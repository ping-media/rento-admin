import NoDataImg from "../assets/logo/Unauthorized.svg";

const Unauthorized = () => {
  return (
    <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white h-full">
      <div className="flex items-center justify-center h-full flex-col">
        <img
          src={NoDataImg}
          className="lg:w-[50%] mx-auto lg:h-full object-cover mb-10"
          alt="UNDER_DEVELOPMENT"
        />
      </div>
    </div>
  );
};

export default Unauthorized;
