import React, { useMemo } from "react";
import BookingTimeLine from "../BookingTimeLine";
import UserRideTimeLine from "../UserRideTimeLine";
import { TimelineBtn } from "./timeline/TimelineBtn";

export const Timeline = ({ booking, tab, setTab }) => {
  const timeline = useMemo(() => {
    if (!booking) return null;

    switch (tab) {
      case "booking":
        return <BookingTimeLine />;
      case "rides":
        return <UserRideTimeLine />;
      default:
        return null;
    }
  }, [booking, tab]);

  return (
    <div className="mt-5 mb-5">
      <div className="flex items-center gap-1 justify-between mb-5">
        <h2 className="text-base lg:text-lg font-semibold text-gray-500 w-2/4">
          {tab.charAt(0).toUpperCase() + tab.slice(1) || "Booking"} Timeline
        </h2>

        <div className="relative flex border rounded overflow-hidden flex-1">
          <div
            className={`absolute top-0 left-0 h-full bg-theme transition-all duration-300 rounded text-white z-0`}
            style={{
              width: "50%",
              transform: `translateX(${tab === "rides" ? "100%" : "0%"})`,
            }}
          />

          <TimelineBtn tab={tab} setTab={setTab} />
        </div>
      </div>

      {/* dynamically rendering the timeline component       */}
      {timeline}
    </div>
  );
};
