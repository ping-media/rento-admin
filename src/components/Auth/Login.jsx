import { useEffect, useState } from "react";
import Alert from "../Alert/Alert";
import loginImage from "../../assets/logo/login.svg";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils";
import { Email } from "@mui/icons-material";
import { setLoginDetails } from "../../Redux/AdsSlice/VehicleSlice";
import { setError } from "../../Redux/ErrorSlice/ErrorSlice";
import { setLoading } from "../../Redux/ThemeSlice/ThemeSlice";
import { postApi } from "../../response/api";
import { Spinner } from "../CommonComponents/commonComponents";

const Login = () => {
  const [inputType, setInputType] = useState("password");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, type } = useSelector((state) => state.error);
  const { loginDetails } = useSelector((state) => state.vehicles);
  const { loading } = useSelector((state) => state.theme);
  const { email, password } = loginDetails

  useEffect(() => {
    const checkoToken = localStorage.getItem("token");
    if (checkoToken) {
      navigate("/dashboard");
    }
  }, []);

  const isValid = () => {
    let valid = true;
   if(!email){
    dispatch(setError({type: "error", message: "Email is required"}));
    valid = false;
   } else if(!isValidEmail(email)){
    dispatch(setError({type: "error", message: "Invalid Email"}));
    valid = false;
   } else if(!password){
    dispatch(setError({type: "error", message: "Password is required"}));
    valid = false;
   } 
   return valid
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    if(isValid()){
      const res = await postApi("/adminLogin", loginDetails, "")
      if(res.status === 200){       
        dispatch(setError({type: "success", message: res.message})); 
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.data))
        dispatch(setLoginDetails(res.data))
        navigate("/dashboard")
      } else {
        dispatch(setError({type: "error", message: res.message}));
      }
    }
    dispatch(setLoading(false));
  };

  return (
    <div className="min-h-screen login relative">
      {message && <Alert error={message} errorType={type} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gradient-to-t from-theme-dark from-20% via-theme via-40% to-theme-seconday-dark to-90% rounded-bl-[18rem] lg:bg-none">
        <div className="bg-gradient-to-t from-theme-seconday-dark from-20% via-theme via-40% to-theme-dark to-90% min-h-screen hidden lg:block">
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={loginImage}
              className="w-[80%] mx-auto mb-5 drop-shadow-2xl"
              alt="LOGO"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-[90%] lg:w-[65%]">
            <div className="mb-8">
              <h1 className="text-4xl font-black uppercase text-gray-100 lg:text-black mb-2">
                Welcome to <span className="lg:text-theme">Rento</span>
              </h1>
              <p className="capitalize text-gray-200 lg:text-gray-400">
                Welcome back! Please enter your credentials to continue.
              </p>
            </div>
            <div>
             
                <div className="mb-5">
                  <div className="relative mt-2 text-gray-100 lg:text-gray-500">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="stroke-gray-100 lg:stroke-gray-500"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="someone@example.com"
                      name="email"
                      value={loginDetails?.email}
                      id="email"
                      className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                      onChange={(e) => dispatch(setLoginDetails({...loginDetails, email: e.target.value}))}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <div className="relative mt-2 text-gray-100 lg:text-gray-500">
                    <div onClick={() => setInputType(inputType === "password" ? "text" : "password")} className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="stroke-gray-100 lg:stroke-gray-500"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    <input
                      type={inputType}
                      placeholder="************"
                      name="password"
                      id="password"
                      className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                      onChange={(e) => dispatch(setLoginDetails({...loginDetails, password: e.target.value}))}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-theme-dark lg:bg-theme py-3.5 px-6 rounded-lg text-white uppercase hover:bg-theme-dark transition duration-200 ease-in-out disabled:bg-gray-500 outline-none"
                  disabled={loading}
                  onClick={(e) => handleSubmit(e)}
                >
                  {loading ? <Spinner message={"Signing In.."} /> : "Sign In"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
