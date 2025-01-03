import { useEffect, useRef, useState } from "react";
import Alert from "../Alert/Alert";
import loginImage from "../../assets/logo/login.svg";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { handleOtpLogin } from "../../Data/Function";
import webLogo from "../../assets/logo/rento-logo.png";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, type } = useSelector((state) => state.error);
  const { token } = useSelector((state) => state.user);
  const [isPasswordTextActive, setIsPasswordTextActive] = useState(false);
  const passwordRef = useRef(null);

  //if user is already login than don't let user to come to this page
  useEffect(() => {
    if (token != null) {
      navigate("/dashboard");
    }
  }, []);

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

  return (
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
                Welcome to <span className="lg:text-theme">Rento</span>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
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
                      {!isPasswordTextActive ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      )}
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
