import { useSelector } from "react-redux";
import useServiceHistory from "../../hooks/use-service-history";
import ServiceHistoryItem from "./ServiceHistoryItem";

const SkeletonRow = () => (
  <div className="border rounded-md p-3 flex items-start gap-3 animate-pulse">
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="h-4 w-20 bg-gray-200 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
    </div>
    <div className="h-5 w-16 bg-gray-200 rounded" />
  </div>
);

const ServiceHistory = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const h = useServiceHistory(vehicleMaster?.[0]?._id);

  if (h.loading)
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );

  if (h.items.length === 0)
    return (
      <div className="text-sm text-gray-400 italic text-center p-5">
        No service history yet.
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {/* <p className="text-xs text-gray-500">
        {h.total} approved repair{h.total === 1 ? "" : "s"}
      </p> */}

      {h.items.map((item) => (
        <ServiceHistoryItem
          key={item._id}
          item={item}
          open={h.openId === item._id}
          onToggle={() => h.toggle(item._id)}
        />
      ))}

      {h.loadingMore && <SkeletonRow />}

      {h.hasMore && !h.loadingMore && (
        <button
          type="button"
          onClick={h.loadMore}
          className="mt-1 w-full sm:w-auto sm:self-center px-4 py-2 text-sm rounded-md border border-theme text-theme hover:bg-theme hover:text-white transition"
        >
          Load more
        </button>
      )}
    </div>
  );
};

export default ServiceHistory;
