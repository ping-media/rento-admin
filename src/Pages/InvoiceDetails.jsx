import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getData, postMultipleData } from "../Data";
import PreLoader from "../components/Skeleton/PreLoader";
import companyLogo from "../assets/logo/rento-logo.png";
import { formatDateForInvoice, formatPrice } from "../utils";
import html2pdf from "html2pdf.js";
import { tableIcons } from "../Data/Icons";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import Spinner from "../components/Spinner/Spinner";

const useInvoiceData = (id, token) => {
  const fetchInvoiceData = useCallback(async () => {
    if (!id) return null;
    try {
      const response = await getData(`/getAllInvoice?_id=${id}`, token);
      if (response?.status === 200) {
        // const bookingResponse = await getData(
        //   `/getBooking?bookingId=${response?.data[0]?.bookingId}`,
        //   token
        // );
        return {
          invoice: response?.data[0],
          // booking: bookingResponse?.data[0],
        };
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }, [id, token]);

  return fetchInvoiceData;
};

const InvoiceDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [invoiceData, setInvoiceData] = useState(null);
  // const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  // getting invoice data
  const fetchInvoiceData = useInvoiceData(id, token);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      const tempInvoiceData = await fetchInvoiceData();
      if (tempInvoiceData) {
        setInvoiceData(tempInvoiceData?.invoice);
        // setBookingData(tempInvoiceData?.booking);
      }
      setLoading(false);
    })();
  }, [fetchInvoiceData, id, setLoading, setInvoiceData]);

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
  // function for generating invoice and than send to email
  const handleSaveInvoiceAndSendToMail = async () => {
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

    // Generate the PDF and store it as a blob
    const pdfBlob = await html2pdf()
      .from(invoiceElement)
      .set(options)
      .outputPdf("blob");

    // Store the PDF in a variable
    const pdfFile = new File([pdfBlob], `${invoiceData?.invoiceNumber}.pdf`, {
      type: "application/pdf",
    });

    // combining the data so that we can send this backend
    const formData = new FormData();
    formData.append("firstName", invoiceData?.firstName);
    formData.append("lastName", invoiceData?.lastName);
    formData.append("email", invoiceData?.email);
    formData.append("file", pdfFile);

    try {
      setIsSending(true);
      const response = await postMultipleData(
        "/sendInvoiceByEmail",
        formData,
        token
      );
      if (response?.success === true) {
        return handleAsyncError(
          dispatch,
          "Invoice send successfully.",
          "success"
        );
      } else {
        return handleAsyncError(dispatch, "unable to send invoice! try again.");
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setIsSending(false);
    }
  };

  return !loading ? (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2 my-5">
        <h1 className="text-xl xl:text-2xl uppercase font-bold text-theme">
          View Invoice
        </h1>
        {/* button for donwloading invoice  */}
        <div className="flex items-center gap-2">
          <button
            className="bg-theme font-semibold text-gray-100 px-3 py-1.5 lg:px-6 lg:py-2.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
            type="button"
            onClick={handleSaveInvoice}
          >
            {tableIcons.download}
            Download Invoice
          </button>
          <button
            className="bg-theme font-semibold text-gray-100 px-3 py-1.5 lg:px-6 lg:py-2.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
            type="button"
            onClick={handleSaveInvoiceAndSendToMail}
            disabled={iSending}
          >
            {!iSending && tableIcons.send}
            {!iSending ? "Send Email" : <Spinner message={"sending..."} />}
          </button>
        </div>
      </div>
      {/* invoice  */}
      <div
        className="max-w-full lg:max-w-3xl mx-auto p-2.5 lg:p-6 bg-white rounded shadow-sm mt-6"
        id="invoice"
      >
        <div className="grid grid-cols-2 items-center">
          <div>
            <img
              src={companyLogo}
              alt="company-logo"
              className="size-14 lg:size-20"
            />
          </div>

          <div className="text-right">
            <p className="text-gray-500 text-xs lg:text-sm">
              Bongi Mobility Solutions Private Limited
            </p>
            <p className="text-gray-500 text-xs lg:text-sm">
              support@rentobikes.com
            </p>
            <p className="text-gray-500 text-xs lg:text-sm mt-1">
              +91-8884488891
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center mt-8">
          <div>
            <p className="font-bold text-gray-800 text-xs lg:text-sm">
              Bill to :
            </p>
            <p className="text-gray-500 capitalize text-xs lg:text-sm">
              {invoiceData?.firstName} {invoiceData?.lastName}
            </p>
            <p className="text-gray-500 text-xs lg:text-sm">
              {invoiceData?.email}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs lg:text-sm">
              Invoice number:
              <span className="text-gray-500">
                {invoiceData?.invoiceNumber}
              </span>
            </p>
            <p className="text-xs lg:text-sm">
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
                  className="py-3.5 pl-4 pr-3 text-left text-xs lg:text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Booking Id & Vehicle Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-xs lg:text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-xs lg:text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Rent Amount
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-3 pr-4 text-right text-xs lg:text-sm font-semibold text-gray-900 sm:pr-0"
                >
                  Booking Amount
                </th>
              </tr>
            </thead>
            <tbody className="h-[30rem]">
              <tr className="border-b border-gray-200 align-top">
                <td className="max-w-0 py-5 pl-4 pr-3 text-xs lg:text-sm sm:pl-0">
                  <div className="font-medium text-gray-900 capitalize">
                    {`#${invoiceData?.bookingId} (${invoiceData?.vehicleName})`}
                  </div>
                  <div className="mt-1 mb-3 text-gray-500">
                    ({invoiceData?.vehicleBasic?.vehicleNumber})
                  </div>
                </td>
                <td className="hidden px-3 py-5 text-right text-xs lg:text-sm text-gray-500 sm:table-cell">
                  {parseInt(
                    invoiceData?.bookingPrice?.bookingPrice /
                      invoiceData?.bookingPrice?.rentAmount
                  )}{" "}
                  day(s)
                </td>
                <td className="hidden px-3 py-5 text-right text-xs lg:text-sm text-gray-500 sm:table-cell">
                  ₹{formatPrice(invoiceData?.bookingPrice?.rentAmount)}
                </td>
                <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                  ₹{formatPrice(invoiceData?.bookingPrice?.bookingPrice)}
                </td>
              </tr>
              {/* for adding extendAmount  */}
              {/* {bookingData != null &&
                bookingData?.bookingPrice?.extendAmount &&
                bookingData?.bookingPrice?.extendAmount?.length > 0 &&
                bookingData?.bookingPrice?.extendAmount?.map((item, index) => {
                  if (item.status === "unpaid") {
                    return null;
                  }
                  return (
                    <tr
                      className="border-b border-gray-200 align-top"
                      key={index}
                    >
                      <td className="max-w-0 py-5 pl-4 pr-3 text-xs lg:text-sm sm:pl-0">
                        <div className="font-medium text-gray-900 capitalize">
                          {item?.title}
                        </div>
                      </td>
                      <td className="hidden px-3 py-5 text-right text-xs lg:text-sm text-gray-500 sm:table-cell">
                        {parseInt(
                          invoiceData?.bookingPrice?.bookingPrice /
                            invoiceData?.bookingPrice?.rentAmount
                        )}{" "}
                        day(s)
                      </td>
                      <td className="hidden px-3 py-5 text-right text-xs lg:text-sm text-gray-500 sm:table-cell">
                        ₹{formatPrice(invoiceData?.bookingPrice?.rentAmount)}
                      </td>
                      <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                        ₹{formatPrice(item?.amount)}
                      </td>
                    </tr>
                  );
                })} */}
            </tbody>
            <tfoot>
              <tr>
                <th
                  scope="row"
                  colSpan="3"
                  className="hidden pl-4 pr-3 pt-6 text-right text-xs lg:text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                >
                  Subtotal
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-6 text-left text-xs lg:text-sm font-normal text-gray-500 sm:hidden"
                >
                  Subtotal
                </th>
                <td className="pl-3 pr-6 pt-6 text-right text-xs lg:text-sm text-gray-500 sm:pr-0">
                  ₹{formatPrice(invoiceData?.bookingPrice?.bookingPrice)}
                </td>
              </tr>
              {invoiceData?.bookingPrice?.extraAddonPrice !== 0 && (
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                  >
                    Extra Helmet Charge
                  </th>
                  <th
                    scope="row"
                    className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                  >
                    Extra Helmet Charge
                  </th>
                  <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                    + ₹{formatPrice(invoiceData?.bookingPrice?.extraAddonPrice)}
                  </td>
                </tr>
              )}
              <tr>
                <th
                  scope="row"
                  colSpan="3"
                  className="hidden pl-4 pr-3 pt-4 text-right text-xs lg:text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                >
                  Tax
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-4 text-left text-xs lg:text-sm font-normal text-gray-500 sm:hidden"
                >
                  Tax
                </th>
                <td className="pl-3 pr-6 pt-4 text-right text-xs lg:text-sm text-gray-500 sm:pr-0">
                  + ₹{formatPrice(invoiceData?.bookingPrice?.tax)}
                </td>
              </tr>
              {invoiceData?.bookingPrice?.isDiscountZero === true ||
                (invoiceData?.bookingPrice?.discountPrice !== undefined &&
                  invoiceData?.bookingPrice?.discountPrice !== null &&
                  invoiceData?.bookingPrice?.discountPrice > 0 && (
                    <tr>
                      <th
                        scope="row"
                        colSpan="3"
                        className="hidden pl-4 pr-3 pt-4 text-right text-xs lg:text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                      >
                        Discount
                      </th>
                      <th
                        scope="row"
                        className="pl-6 pr-3 pt-4 text-left text-xs lg:text-sm font-normal text-gray-500 sm:hidden"
                      >
                        Discount
                      </th>
                      <td className="pl-3 pr-6 pt-4 text-right text-xs lg:text-sm text-gray-500 sm:pr-0">
                        - ₹
                        {formatPrice(invoiceData?.bookingPrice?.discountPrice)}
                      </td>
                    </tr>
                  ))}
              <tr>
                <th
                  scope="row"
                  colSpan="3"
                  className="hidden pl-4 pr-3 pt-4 text-right text-xs lg:text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                >
                  Total
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-4 text-left text-xs lg:text-sm font-semibold text-gray-900 sm:hidden"
                >
                  Total
                </th>
                <td className="pl-3 pr-4 pt-4 text-right text-xs lg:text-sm font-semibold text-gray-900 sm:pr-0">
                  ₹
                  {formatPrice(
                    invoiceData?.bookingPrice?.discountTotalPrice &&
                      invoiceData?.bookingPrice?.discountTotalPrice !== 0
                      ? invoiceData?.bookingPrice?.discountTotalPrice
                      : invoiceData?.bookingPrice?.totalPrice
                  )}
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
