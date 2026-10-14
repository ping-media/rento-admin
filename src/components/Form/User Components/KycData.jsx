import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../../Data";
import React, { useEffect, useState } from "react";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";

const KycData = ({ userId = "" }) => {
  const { token } = useSelector((state) => state.user);
  const [kycRes, setKycRes] = useState({
    data: null,
    loading: false,
  });
  const [showAadhaar, setShowAadhaar] = useState(false);
  const dispatch = useDispatch();

  const fetchKycData = async () => {
    try {
      setKycRes((prev) => ({
        ...prev,
        loading: true,
      }));
      const response = await getData(`/get-kyc-data?userId=${userId}`, token);
      if (response?.status === 200) {
        setKycRes((prev) => ({
          ...prev,
          data: response?.data,
        }));
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to fetch kyc data!");
    } finally {
      setKycRes((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (userId?.trim() === "") return;

    fetchKycData();
  }, [userId]);

  const aadhaarNumber = kycRes.data?.aadharNumber;

  const maskedAadhaar = aadhaarNumber
    ? `XXXXXXXX${aadhaarNumber.slice(-4)}`
    : "--";

  if (kycRes.loading) {
    return (
      <div className="flex flex-col gap-2 mb-5">
        <div className="bg-gray-300 w-1/2 h-5 animate-pulse" />
        <div className="bg-gray-300 w-1/2 h-5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-5">
      <p className="uppercase text-base">
        <span className="font-semibold capitalize">Aadhar Number:</span>{" "}
        <span className="mr-2">
          {showAadhaar ? aadhaarNumber : maskedAadhaar}
        </span>
        {aadhaarNumber && (
          <button
            type="button"
            onClick={() => setShowAadhaar((prev) => !prev)}
            className="text-theme hover:underline"
          >
            {showAadhaar ? "Hide" : "Show"}
          </button>
        )}
      </p>
      <p className="uppercase text-base">
        <span className="font-semibold capitalize">
          Driving License Number:
        </span>{" "}
        {kycRes.data?.licenseNumber ?? "--"}
      </p>
    </div>
  );
};

export default KycData;
