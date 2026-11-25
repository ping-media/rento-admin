import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, postData } from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { useDebounce } from "../utils/Helper/debounce";

const emptyForm = {
  type: "repair",
  problemDescription: "",
  readingBeforeService: "",
  mechanicId: "",
};

const useSendForService = ({ onSent }) => {
  const dispatch = useDispatch();
  const { token, loggedInRole } = useSelector((state) => state.user);
  const isAdmin = loggedInRole === "admin";

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 400);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const term = debounced.trim();
    if (selected || term.length < 2) {
      setResults([]);
      return;
    }
    (async () => {
      setSearching(true);
      try {
        const res = await getData(
          `/maintenance-request/ongoing-vehicles?search=${encodeURIComponent(term)}`,
          token,
        );
        if (res?.status === 200) setResults(res.data || []);
        else {
          setResults([]);
          handleAsyncError(dispatch, res?.message);
        }
      } catch (e) {
        handleAsyncError(dispatch, e?.message);
      } finally {
        setSearching(false);
      }
    })();
  }, [debounced, selected]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const pick = (vehicle) => {
    if (vehicle.hasOpenService) return;
    setSelected(vehicle);
    setForm({
      ...emptyForm,
      readingBeforeService: String(vehicle.startMeterReading ?? ""),
    });
  };

  const clearSelected = () => {
    setSelected(null);
    setForm(emptyForm);
  };

  const submit = async () => {
    if (!form.problemDescription.trim())
      return handleAsyncError(dispatch, "Problem description is required");
    if (form.readingBeforeService === "")
      return handleAsyncError(dispatch, "Enter the current meter reading");
    const reading = Number(form.readingBeforeService);
    if (reading < Number(selected.startMeterReading || 0))
      return handleAsyncError(
        dispatch,
        `Meter reading must be at least ${selected.startMeterReading} km (the reading at pickup)`,
      );

    try {
      setSaving(true);
      const res = await postData(
        "/maintenance-request/send-booking-for-service",
        {
          bookingId: selected._id,
          type: form.type,
          problemDescription: form.problemDescription,
          readingBeforeService: reading,
          mechanicId: isAdmin && form.mechanicId ? form.mechanicId : undefined,
        },
        token,
      );
      if (res?.status === 200) {
        handleAsyncError(dispatch, res.message, "success");
        onSent?.(res.data);
      } else {
        handleAsyncError(dispatch, res?.message);
      }
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    isAdmin,
    search,
    setSearch,
    results,
    searching,
    selected,
    pick,
    clearSelected,
    form,
    setField,
    saving,
    submit,
    showEmpty:
      !selected &&
      debounced.trim().length >= 2 &&
      !searching &&
      results.length === 0,
  };
};

export default useSendForService;
