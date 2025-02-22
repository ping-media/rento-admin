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
      className="bg-theme text-gray-100 rounded-md font-medium p-1.5 text-sm lg:px-2.5 lg:py-1.5 text-left disabled:bg-gray-400"
      onClick={() =>
        handleGenerateInvoice(
          dispatch,
          item?._id,
          token,
          setLoadingStates,
          item,
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
