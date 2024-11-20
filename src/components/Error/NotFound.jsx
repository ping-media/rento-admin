import noDataImg from "../../assets/logo/No-data.svg";

const NotFound = ({ message }) => {
  return (
    <>
      <div className="w-80 h-80 mx-auto mb-2">
        <img src={noDataImg} alt="NO_DATA" />
      </div>
      <h2 className="text-center font-semibold text-xl">{message}</h2>
    </>
  );
};

export default NotFound;
