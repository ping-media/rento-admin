import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getData } from "../Data";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import PreLoader from "../components/Skeleton/PreLoader";
import companyLogo from "../assets/favicon.ico";
import { formatDateForInvoice, formatPrice } from "../utils";
// import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

const InvoiceDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [invoiceData, setInvoiceData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // getting invoice user data
  const getUserData = async (userId) => {
    try {
      if (!userId) return "Id not found";
      const response = await getData(`/getAllUsers?_id=${userId}`, token);
      if (response?.status == 200) {
        setUserData(response?.data[0]);
      } else {
        return handleAsyncError(dispatch, "User not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // getting invoice data
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const response = await getData(`/getAllInvoice?_id=${id}`, token);
        if (response?.status == 200) {
          const tempInvoiceData = response?.data[0];
          setInvoiceData(tempInvoiceData);
          await getUserData(tempInvoiceData?.userId);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // function for downloading the invoice in pdf format
  const handleSaveInvoice = () => {
    const invoiceElement = document.getElementById("invoice");

    const options = {
      margin: [5, 5, 5, 5],
      filename: `${invoiceData?.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 192,
        letterRendering: true,
        scale: 2,
        logging: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
    };
    html2pdf().from(invoiceElement).set(options).save();
  };

  return !loading ? (
    <>
      <div className="flex items-center justify-between my-5">
        <h1 className="text-xl xl:text-2xl uppercase font-bold text-theme">
          View Invoice
        </h1>
        {/* button for donwloading invoice  */}
        <button
          className="bg-theme font-semibold text-gray-100 px-4 lg:px-6 py-2.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
          type="button"
          onClick={handleSaveInvoice}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Download Invoice
        </button>
      </div>
      {/* invoice  */}
      <div
        className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6"
        id="invoice"
      >
        <div className="grid grid-cols-2 items-center">
          <div>
            <img src={companyLogo} alt="company-logo" height="75" width="75" />
          </div>

          <div className="text-right">
            <p>Rento</p>
            <p className="text-gray-500 text-sm">support@rento.com</p>
            <p className="text-gray-500 text-sm mt-1">+41-442341232</p>
            {/* <p className="text-gray-500 text-sm mt-1">VAT: 8657671212</p> */}
          </div>
        </div>

        <div className="grid grid-cols-2 items-center mt-8">
          <div>
            <p className="font-bold text-gray-800">Bill to :</p>
            {/* <p className="text-gray-500">
            Laravel LLC.
            <br />
            102, San-Fransico, CA, USA
          </p> */}
            <p className="text-gray-500">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-gray-500">{userData?.email}</p>
          </div>

          <div className="text-right">
            <p>
              Invoice number:
              <span className="text-gray-500">
                {invoiceData?.invoiceNumber}
              </span>
            </p>
            <p>
              Invoice date:{" "}
              <span className="text-gray-500">
                {formatDateForInvoice(invoiceData?.updatedAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="-mx-4 mt-8 flow-root sm:mx-0">
          <table className="min-w-full">
            <colgroup>
              <col className="w-full sm:w-1/2" />
              <col className="sm:w-1/6" />
              <col className="sm:w-1/6" />
              <col className="sm:w-1/6" />
            </colgroup>
            <thead className="border-b border-gray-300 text-gray-900">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Vehicle Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Rent Amount
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
                >
                  Booking Amount
                </th>
              </tr>
            </thead>
            <tbody className="h-[30rem]">
              <tr className="border-b border-gray-200 align-top">
                <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="font-medium text-gray-900 capitalize">
                    {invoiceData?.vehicleName}
                  </div>
                  <div className="mt-1 mb-3 text-gray-500">
                    ({invoiceData?.vehicleBasic?.vehicleNumber})
                  </div>
                </td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                  {parseInt(
                    invoiceData?.bookingPrice?.bookingPrice /
                      invoiceData?.bookingPrice?.rentAmount
                  )}{" "}
                  day(s)
                </td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                  ₹{formatPrice(invoiceData?.bookingPrice?.rentAmount)}
                </td>
                <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                  ₹{formatPrice(invoiceData?.bookingPrice?.bookingPrice)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th
                  scope="row"
                  colSpan="3"
                  className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                >
                  Subtotal
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden"
                >
                  Subtotal
                </th>
                <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                  ₹{formatPrice(invoiceData?.bookingPrice?.bookingPrice)}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colSpan="3"
                  className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                >
                  Tax
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                >
                  Tax
                </th>
                <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                  ₹{formatPrice(invoiceData?.bookingPrice?.tax)}
                </td>
              </tr>
              {/* <tr>
              <th
                scope="row"
                colSpan="3"
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
              >
                Discount
              </th>
              <th
                scope="row"
                className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
              >
                Discount
              </th>
              <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                - 10%
              </td>
            </tr> */}
              <tr>
                <th
                  scope="row"
                  colSpan="3"
                  className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                >
                  Total
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
                >
                  Total
                </th>
                <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                  ₹{formatPrice(invoiceData?.bookingPrice?.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
          We’ve successfully received your payment for this invoice. If you need
          anything else, our team is happy to assist you.
        </div>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default InvoiceDetails;
