import dangerLogo from "../..//assets/logo/promise-remove.png";
import warningLogo from "../../assets/logo/promise-remove-yellow.png";

const ApplicationError = ({ type = "pause" }) => {
  return (
    <div className="absolute right-4 glass w-20 p-1">
      <div className={`w-full rotate-12 relative`}>
        <img
          src={type == "pause" ? dangerLogo : warningLogo}
          className="w-full h-full object-cover"
          alt="ERROR_TYPE"
          loading="lazy"
        />
        <span
          className="absolute uppercase text-white text-sm"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {type}
        </span>
      </div>
    </div>
  );
};

export default ApplicationError;
