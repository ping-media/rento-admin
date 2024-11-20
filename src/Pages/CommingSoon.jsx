// import underConstructionImage from "../assets/logo/under-construction.svg";
import computerTroubleshootingImage from "../assets/logo/computer-troubleshooting.svg";

const CommingSoon = () => {
  return (
    <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white h-full">
      <div className="flex items-center justify-center h-full flex-col">
        <img
          src={computerTroubleshootingImage}
          className="lg:w-[80%] mx-auto lg:h-[80%] object-cover mb-10"
          alt="UNDER_DEVELOPMENT"
        />
        <h1 className="text-center uppercase text-3xl font-bold">
          Under development
        </h1>
      </div>
    </div>
  );
};

export default CommingSoon;
