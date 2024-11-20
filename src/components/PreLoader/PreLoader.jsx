import logoImage from "../../assets/logo/logo.png";

const PreLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-pulse bg-white">
      <div className="w-24 h-24 mb-5">
        <img
          src={logoImage}
          className="w-full h-full object-cover"
          alt="Sure Success"
        />
      </div>
      <h2 className="italic text-center font-semibold">Sure Success Ads</h2>
    </div>
  );
};

export default PreLoader;
