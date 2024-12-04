// import underConstructionImage from "../assets/logo/under-construction.svg";
import NoDataImg from "../assets/logo/No-data.svg";

const NotFound = () => {
  return (
    <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white h-full">
      <div className="flex items-center justify-center h-full flex-col">
        <img
          src={NoDataImg}
          className="lg:w-[50%] mx-auto lg:h-[50%] object-cover mb-10"
          alt="UNDER_DEVELOPMENT"
        />
        <h1 className="text-center uppercase text-3xl font-bold">
          404 Not Found
        </h1>
      </div>
    </div>
  );
};

export default NotFound;
