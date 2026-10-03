import React from "react";
import { BookingForm } from "./BookingComponents/BookingForm";

const CreateBooking = () => {
  const handleFormSubmitForNew = () => {};
  return (
    <form onSubmit={handleFormSubmitForNew}>
      <div className="flex flex-wrap gap-4">
        <BookingForm />
        {/* <>
          <BookingStepOne
            data={formData?.stepOneData}
            token={token}
            onNext={handleNext}
          />

          <BookingStepTwo
            data={formData?.stepOneData}
            priceCalculate={changePriceAccordingtoData}
            gst={GST}
            setCoupon={setCoupon}
            coupon={coupon}
            setFormData={setFormData}
            plan={planData}
            setPlan={setPlanData}
          />
        </> */}
      </div>

      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-5 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
        type="submit"
        // disabled={formLoading || loading}
      >
        Create Booking
        {/* {formLoading || loading ? (
          <Spinner
            message={
              id ? "uploading" : "booking. Do not refresh or press back button"
            }
          />
        ) : id ? (
          "Update"
        ) : (
          "Book Ride"
        )} */}
      </button>
    </form>
  );
};

export default CreateBooking;
