import Spinner from "../Spinner/Spinner";

const PreLoader = () => {
  return (
    <div
      id="loading-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60"
    >
      <Spinner message={"Loading..."} />
    </div>
  );
};

export default PreLoader;
