import { useDispatch, useSelector } from "react-redux";
import { handleGenerateInvoice } from "../../Data/Function";
import Spinner from "../Spinner/Spinner";

const GenerateInvoiceButton = ({ item, loadingStates, setLoadingStates }) => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className="w-auto lg:w-32 bg-theme text-gray-100 py-1 px-2 bg-opacity-90 rounded-lg shadow-md hover:shadow-none disabled:bg-gray-400"
      onClick={() =>
        handleGenerateInvoice(dispatch, item?._id, token, setLoadingStates)
      }
      disabled={item?.bookingPrice?.isInvoiceCreated || loadingStates[item._id]}
    >
      {!loadingStates[item._id] ? (
        item?.bookingPrice?.isInvoiceCreated ? (
          "Created"
        ) : (
          "create Invoice"
        )
      ) : (
        <Spinner message={"creating.."} />
      )}
    </button>
  );
};

export default GenerateInvoiceButton;
