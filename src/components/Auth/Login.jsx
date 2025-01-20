import { useRef, useState } from "react";
import Alert from "../Alert/Alert";
import loginImage from "../../assets/logo/login.svg";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { Navigate, useNavigate } from "react-router-dom";
import { handleOtpLogin } from "../../Data/Function";
import webLogo from "../../assets/logo/rento-logo.png";
import { tableIcons } from "../../Data/Icons";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, type } = useSelector((state) => state.error);
  const { token } = useSelector((state) => state.user);
  const [isPasswordTextActive, setIsPasswordTextActive] = useState(false);
  const passwordRef = useRef(null);

  // change the type of password to type
  const handleChangeType = () => {
    if (passwordRef && passwordRef.current.type === "password") {
      passwordRef.current.type = "text";
      setIsPasswordTextActive(true);
    } else {
      passwordRef.current.type = "password";
      setIsPasswordTextActive(false);
    }
  };

  return token !== null ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="min-h-screen login relative">
      {/* alert or error showing  */}
      {message && <Alert error={message} errorType={type} />}
      {/* login  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gradient-to-t from-theme-dark from-20% via-theme via-40% to-theme-seconday-dark to-90% rounded-bl-[18rem] lg:bg-none">
        {/* login image section */}
        <div className="bg-gradient-to-t from-theme-seconday-dark from-20% via-theme via-40% to-theme-dark to-90% min-h-screen hidden lg:block">
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={loginImage}
              className="w-[80%] mx-auto mb-5 drop-shadow-2xl"
              alt="LOGO"
              loading="lazy"
            />
          </div>
        </div>
        {/* login from section  */}
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-[90%] lg:w-[65%]">
            <div className="flex flex-col items-center justify-center lg:hidden mb-5">
              <img
                src={webLogo}
                className="w-28 p-1 bg-gray-100 rounded-full mx-auto mb-3 drop-shadow-2xl"
                alt="LOGO"
              />
            </div>
            <div className="mb-8">
              <h1 className="text-2xl lg:text-4xl font-black uppercase text-gray-100 lg:text-black mb-2">
                Welcome to <span className="lg:text-theme">Rento Bikes.</span>
              </h1>
              <p className="capitalize text-xs lg:text-sm text-gray-200 lg:text-gray-400">
                Welcome back! Please enter your credentials to continue.
              </p>
            </div>
            <div>
              <form
                className="w-full mx-auto mb-8"
                onSubmit={(event) =>
                  handleOtpLogin(event, dispatch, navigate, setLoading)
                }
              >
                <div className="mb-5">
                  <div className="relative mt-2 text-gray-100 lg:text-gray-500">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                      {tableIcons.email}
                    </div>
                    <input
                      type="email"
                      placeholder="someone@example.com"
                      name="email"
                      id="email"
                      className="w-full pl-[3.4rem] pr-4 py-2.5 lg:py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400 autofill:bg-autofill-bg autofill:text-autofill-text"
                      onChange={(e) => e.target.value}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <div className="relative mt-2 text-gray-100 lg:text-gray-500">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                      {tableIcons.lock}
                    </div>
                    <input
                      type="password"
                      placeholder="************"
                      name="password"
                      id="password"
                      className="w-full pl-[3.4rem] pr-4 py-2.5 lg:py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400 autofill:bg-autofill-bg autofill:text-autofill-text"
                      onChange={(e) => e.target.value}
                      ref={passwordRef}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 my-auto h-6 flex items-center pr-2"
                      onClick={handleChangeType}
                    >
                      {!isPasswordTextActive
                        ? tableIcons.eyeClose
                        : tableIcons.eyeOpen}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-theme-dark lg:bg-theme py-2.5 lg:py-3.5 px-6 rounded-lg text-white uppercase hover:bg-theme-dark transition duration-200 ease-in-out disabled:bg-gray-500 outline-none"
                  disabled={loading}
                >
                  {loading ? <Spinner message={"Signing In.."} /> : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
