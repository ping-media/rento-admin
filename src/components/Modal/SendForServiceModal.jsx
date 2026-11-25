import Spinner from "../../components/Spinner/Spinner";
import ModalWrapper from "../../components/Modal/ModalWrapper";
import ArrowSelect from "../../components/InputAndDropdown/ArrowSelect";
import ManagerSelect from "../../components/InputAndDropdown/ManagerSelect";
import useSendForService from "../../hooks/use-send-for-service";
import { REPAIR_TYPES, INPUT_CLS } from "../../utils/maintenance";
import { Link } from "react-router-dom";

const SendForServiceModal = ({ onClose, onSent }) => {
  const s = useSendForService({ onSent });

  return (
    <ModalWrapper
      active
      onClose={onClose}
      size="lg"
      position="responsive"
      zIndexClass="z-50"
      className="text-left"
      title={<span className="text-theme text-lg">Add Repair</span>}
    >
      <div className="p-4 pt-0 flex flex-col gap-3 text-sm">
        {!s.selected && (
          <>
            <div className="text-sm border border-amber-300 bg-amber-50 text-amber-800 rounded-md px-3 py-2">
              Only vehicles on an <b>ongoing ride</b> can be added for repair
              from here. To add any other vehicle, go to the{" "}
              <Link
                to={"/all-vehicles"}
                className="font-bold underline underline-offset-4 hover:no-underline transition-all duration-200 ease-in-out"
              >
                All Vehicles
              </Link>{" "}
              and use <b>Add Block</b>.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-medium">
                Vehicle number (ongoing ride)
              </label>
              <input
                className={`${INPUT_CLS} uppercase`}
                placeholder="Search by vehicle number"
                value={s.search}
                onChange={(e) => s.setSearch(e.target.value)}
                autoFocus
              />
            </div>

            {s.searching && (
              <Spinner message="searching" textColor="text-black" />
            )}

            {s.showEmpty && (
              <p className="text-gray-400 italic text-center">
                No ongoing ride found for this vehicle number.
              </p>
            )}

            <div className="flex flex-col gap-2">
              {s.results.map((v) => (
                <button
                  key={v._id}
                  type="button"
                  disabled={v.hasOpenService}
                  onClick={() => s.pick(v)}
                  className="text-left border rounded-md p-2 hover:border-theme disabled:opacity-50 disabled:hover:border-gray-200"
                >
                  <div className="flex justify-between gap-2">
                    <b className="uppercase">{v.vehicleNumber}</b>
                    <span className="text-xs text-gray-500 capitalize">
                      {v.vehicleName}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="capitalize">{v.customerName}</span> ·{" "}
                    {v.contact} · Booking #{v.bookingId}
                  </div>
                  {v.hasOpenService && (
                    <div className="text-xs text-red-600">
                      Already under service
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {s.selected && (
          <>
            <div className="border rounded-md bg-gray-50 p-2 flex justify-between gap-2">
              <div>
                <b className="uppercase mb-1">{s.selected.vehicleNumber}</b>
                <div className="text-xs text-gray-500 mb-0.5">
                  <span className="capitalize">{s.selected.customerName}</span>{" "}
                  · Booking #{s.selected.bookingId}
                </div>
                <div className="text-xs text-gray-500">
                  Meter at pickup: {s.selected.startMeterReading} km
                </div>
              </div>
              <button
                type="button"
                onClick={s.clearSelected}
                className="text-theme text-sm self-start"
              >
                Change
              </button>
            </div>

            <div>
              <label className="font-medium">Work type</label>
              <WorkTypeSelect
                value={s.form.type}
                onChange={(v) => s.setField("type", v)}
              />
            </div>

            <div>
              <label className="font-medium">Problem / work details *</label>
              <textarea
                rows={3}
                className={`${INPUT_CLS} resize-none`}
                value={s.form.problemDescription}
                onChange={(e) =>
                  s.setField("problemDescription", e.target.value)
                }
              />
            </div>

            <div>
              <label className="font-medium">
                Current meter reading (km) *
              </label>
              <input
                type="number"
                min="0"
                className={INPUT_CLS}
                value={s.form.readingBeforeService}
                onChange={(e) =>
                  s.setField("readingBeforeService", e.target.value)
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                The new reading is entered by the mechanic when the repair is
                completed.
              </p>
            </div>

            {s.isAdmin ? (
              <div>
                <label className="font-medium">Assign manager</label>
                <ManagerSelect
                  value={s.form.mechanicId}
                  onChange={(v) => s.setField("mechanicId", v)}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                You will be set as the mechanic.
              </p>
            )}

            <button
              type="button"
              disabled={s.saving}
              onClick={s.submit}
              className="bg-theme text-white rounded-md py-2 flex justify-center disabled:bg-gray-400"
            >
              {s.saving ? <Spinner /> : "Add Repair"}
            </button>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export default SendForServiceModal;

const WorkTypeSelect = ({ value, onChange }) => (
  <ArrowSelect
    wrapperClassName="w-full"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="block w-full rounded-md border border-gray-300 px-5 py-3 text-sm capitalize"
  >
    {REPAIR_TYPES.map(([v, l]) => (
      <option key={v} value={v}>
        {l}
      </option>
    ))}
  </ArrowSelect>
);
