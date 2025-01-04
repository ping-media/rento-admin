import { useDispatch, useSelector } from "react-redux";
import { handleGenerateInvoice } from "../../Data/Function";
import Spinner from "../Spinner/Spinner";
import { handleInvoiceCreated } from "../../Redux/VehicleSlice/VehicleSlice";

const GenerateInvoiceButton = ({ item, loadingStates, setLoadingStates }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className="w-full px-3 py-1 text-left disabled:bg-gray-300 disabled:bg-opacity-50"
      onClick={() =>
        handleGenerateInvoice(
          dispatch,
          item?._id,
          token,
          setLoadingStates,
          vehicleMaster?.data,
          handleInvoiceCreated
        )
      }
      disabled={item?.bookingPrice?.isInvoiceCreated || loadingStates[item._id]}
    >
      {!loadingStates[item._id] ? (
        item?.bookingPrice?.isInvoiceCreated ? (
          "Invoice Created"
        ) : (
          "Create Invoice"
        )
      ) : (
        <Spinner message={"creating.."} />
      )}
    </button>
  );
};

export default GenerateInvoiceButton;
