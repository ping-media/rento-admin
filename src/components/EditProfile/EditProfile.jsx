import { useRef, useState } from "react";
import Spinner from "../spinner/Spinner";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import userImage from "../../assets/logo/user.png";

const EditProfile = ({ isEditMode, setEditModeChanger }) => {
  //for setting tempory image
  const profileImageRef = useRef();
  const [updatedImageURL, setUpdatedImageURL] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChanger = (e) => {
    const image = e.target.files[0];
    if (image) {
      //   tempory image url file
      setProfileImage(image);
      setUpdatedImageURL(URL.createObjectURL(image));
    }
  };

  //updating profile
  const handleUpdateProfile = async (e) => {
    setLoading(true);
    e.preventDefault();

    return setLoading(false);
  };
  return (
    <>
      <div className="flex items-center justify-between border-b-2 py-2 lg:py-1 mb-3">
        <button
          className="flex items-center px-3 py-2 hover:bg-red-500 hover:text-gray-100 border rounded-lg"
          onClick={() => setEditModeChanger(!isEditMode)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          <span className="ml-1">Back</span>
        </button>
        <h3 className="text-theme-blue text-sm lg:text-lg font-semibold">
          User Number: <span className="text-md text-black font-normal"></span>
        </h3>
      </div>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="file"
          accept="image/*"
          name="profileImage"
          ref={profileImageRef}
          hidden
          onChange={handleImageChanger}
        />
        <div
          className="w-40 h-40 mb-10 mx-auto cursor-pointer hover:brightness-90 transition duration-300 ease-in-out group relative"
          onClick={() => profileImageRef.current.click()}
        >
          <div className="invisible group-hover:visible absolute left-5 top-16 font-bold uppercase text-center dark:text-gray-500">
            Choose Image
          </div>
          <img
            src={`${updatedImageURL}`}
            className="w-full h-full border rounded-full"
            alt="PROFILEIMAGE"
          />
        </div>
        <div className="shadow-md flex gap-2 items-center bg-white px-5 py-3 duration-300 border-gray-400 group delay-200 rounded-xl mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <input
            type="text"
            className="flex-1 focus:outline-none capitalize"
            placeholder="Enter Your Full Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full text-center text-gray-100 bg-theme-blue px-5 py-3 rounded-xl hover:bg-blue-400 transition duration-200 ease-in-out disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? <Spinner message={"updating.."} /> : "Update Profile"}
        </button>
      </form>
    </>
  );
};

export default EditProfile;
