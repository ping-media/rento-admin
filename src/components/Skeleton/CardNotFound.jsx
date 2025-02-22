import notFoundImg from "../../assets/logo/internet.png";

const CardNotFound = () => {
  return (
    <>
      <div className="w-16 h-16 mx-auto">
        <img
          src={notFoundImg}
          className="w-full h-full object-cover opacity-50"
          alt="DATA_NOT_FOUND"
        />
      </div>
      <span className="opacity-50">No Data Found.</span>
    </>
  );
};

export default CardNotFound;
