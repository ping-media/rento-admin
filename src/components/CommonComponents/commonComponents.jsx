import { useDispatch, useSelector } from "react-redux";
import { setAddNew, setUpdateData } from "../../Redux/AdsSlice/VehicleSlice";
import { useEffect, useState } from "react";
import { getApi, postApi } from "../../response/api";
import { setError } from "../../Redux/ErrorSlice/ErrorSlice";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import "react-country-state-city/dist/react-country-state-city.css";
import Switch from '@mui/material/Switch';
import { setLoading } from "../../Redux/ThemeSlice/ThemeSlice";
import { BrandData, displayTableData2, staticData } from "../../constant";

import {
    GetCountries,
    GetState,
    GetCity,
    GetLanguages, //async functions
} from "react-country-state-city";
import { Link } from "react-router-dom";
import CustomTable from "../Table/Table";
import { ArrowBack } from "@mui/icons-material";

export const SelectStateCityRegion = () => {
    const dispatch = useDispatch()
    const updateData = useSelector(state => state.vehicles.updateData)
    const [countryid, setCountryid] = useState(101);
    const [stateid, setStateid] = useState(0);
    const [cityid, setCityid] = useState(0);

    const [countriesList, setCountriesList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
        GetCountries().then((result) => {
            setCountriesList(result);
        });
        GetState(101).then((result) => {
            setStateList(result);
        });
        dispatch(setUpdateData({ ...updateData, country: countryid }));
    }, []);

    return (
        <div style={{ display: "block", width: "100%", marginTop: "15px" }}>
            <div style={{ display: "inline-flex" }}>
                <div style={{ marginRight: "20px" }}>
                    <h6>Country</h6>
                    <select style={{ padding: "10px", border: "1px solid #d1d5db", borderRadius: "5px" }}>
                        {countriesList.map((item, index) => (
                            <option key={index} value={index}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginRight: "20px" }}>
                    <h6>State</h6>
                    <select
                        style={{ padding: "10px", border: "1px solid #d1d5db", borderRadius: "5px" }}
                        onChange={(e) => {
                            const state = stateList[e.target.value]; //here you will get full state object.
                            setStateid(state.id);
                            dispatch(setUpdateData({ ...updateData, state }));
                            GetCity(countryid, state.id).then((result) => {
                                setCityList(result);
                            });
                        }}
                    >
                        {stateList.map((item, index) => (
                            <option key={index} value={index}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ display: "inline-flex" }}>
                <div style={{ marginRight: "20px" }}>
                    <h6>City</h6>
                    <select
                        style={{ padding: "10px", border: "1px solid #d1d5db", borderRadius: "5px" }}
                        onChange={(e) => {
                            const city = cityList[e.target.value]; //here you will get full city object.
                            dispatch(setUpdateData({ ...updateData, city }));
                            setCityid(city.id);
                        }}
                        value={cityid}
                    >
                        {cityList.map((item, index) => (
                            <option key={index} value={index}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>



        </div>
    );
}

export const InputComponent = ({ type, placeholder, name, label, style }) => {
    const { updateData } = useSelector((state) => state.vehicles);
    const dispatch = useDispatch();
    let css1 = {
        display: "block",
        width: "100%",
        marginRight: "15px"
    }
    let css2 = {
        display: "block",
        width: "50%",
        marginRight: "15px"
    }
    return (
        <div style={style ? css2 : css1}>
            <span>{label}</span>
            <input
                style={{ marginRight: "10px", display: "block" }}
                type={type}
                className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                placeholder={placeholder}
                value={updateData[name]}
                onChange={(e) => {
                    let { value } = e.target
                    if (name == "pinCode") {
                        if (value.length < 7) {
                            return dispatch(setUpdateData({ ...updateData, [name]: value }))
                        }
                    } else if (name == "contact" || name == "altContact") {
                        if (value.length < 11) {
                            return dispatch(setUpdateData({ ...updateData, [name]: value }))
                        }
                    } else {
                        dispatch(setUpdateData({ ...updateData, [name]: value }))
                    }
                }}
                name={name}
            />
        </div>

    );
};

export const SwitchComponent = ({ label, name, style }) => {
    const { updateData } = useSelector((state) => state.vehicles);
    const dispatch = useDispatch();
    let css1 = {
        display: "block",
        width: "100%",
        marginRight: "15px"
    }
    return (
        <div style={css1}>
            <span style={style ? {float:"right"} : {}}>{label}</span>
            <div style={style ? {marginRight: "10px", display: "block", float:"right"} : {marginRight: "10px", display: "block"}}>
                <Switch onChange={(e) => {
                    const { checked } = e.target
                    dispatch(setUpdateData({ ...updateData, [name]: checked ? "yes" : "no" }))
                }} />
                <span>{updateData[name] || "no"}</span>
            </div>
        </div>

    );
};

export const SelectComponent2 = () => {
    const { updateData } = useSelector(state => state.vehicles)
    const [locationData, setLocationData] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            if (updateData && locationData.length == 0) {
                const res = await getApi('/getLocationData', updateData)
                if (res && res.status == 200) {
                    dispatch(setError({ type: "success", message: res.message }))
                    setLocationData(res.data)
                } else {
                    dispatch(setError({ type: "error", message: res.message }))
                }
            }

        })()
    }, [updateData])
    return (
        <div style={{ display: "block", width: "100%", marginRight: "15px" }}>
            <label htmlFor="cars">Location</label>
            <select style={{ height: "57px" }}
                className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                onChange={async (e) => {
                    const filter = { ...updateData, locationId: e.target.value }
                    dispatch(setUpdateData(filter))
                }} name="cars" id="cars">
                {
                    locationData.length ? locationData.map((o) => (
                        <option selected={o._id == updateData.locationId ? true : false} key={o.locationName} value={o._id}>{o.locationName}</option>
                    )) : ""
                }
            </select>
        </div>

    );
};

export const SelectComponent6 = () => {
    const { updateData } = useSelector(state => state.vehicles)
    const [locationData, setLocationData] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            if (updateData && locationData.length == 0) {
                const res = await getApi('/getAllUsers?userType=manager')
                if (res && res.status == 200) {
                    dispatch(setError({ type: "success", message: res.message }))
                    setLocationData(res.data)
                } else {
                    dispatch(setError({ type: "error", message: res.message }))
                }
            }

        })()
    }, [updateData])
    return (
        <div style={{ display: "block", width: "100%", marginRight: "15px" }}>
            <label htmlFor="cars">Select Station Manager</label>
            <select style={{ height: "57px" }}
                className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                onChange={async (e) => {
                    const { value } = e.target
                    if (value.includes("select")) {
                        const filter = { ...updateData, contact: "" }
                        return dispatch(setUpdateData(filter))
                    }
                    const filter = { ...updateData, contact: value }
                    dispatch(setUpdateData(filter))
                }} name="cars" id="cars">
                <option value={"select"}>Select Station Manager</option>
                {
                    locationData.length ? locationData.map((o) => (
                        <option selected={o.contact == updateData.contact ? true : false} key={o.contact} value={o.contact}>{o.firstName}</option>
                    )) : ""
                }
            </select>
        </div>

    );
};


export const Loader = () => {
    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export const Spinner = ({ message }) => {
    return (
        <div className="flex items-center justify-center">
            <span className="mr-2">{message}</span>
            <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
    );
};

export const SelectComponent3 = () => {
    const { updateData } = useSelector(state => state.vehicles)
    const [locationData, setLocationData] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            if (updateData && locationData.length == 0) {
                const res = await getApi('/getVehicleMasterData', updateData)
                if (res && res.status == 200) {
                    dispatch(setError({ type: "success", message: res.message }))
                    setLocationData(res.data)
                } else {
                    dispatch(setError({ type: "error", message: res.message }))
                }
            }

        })()
    }, [updateData])
    return (
        <div style={{ display: "block", width: "100%", marginRight: "15px" }}>
            <label htmlFor="cars">Location</label>
            <select style={{ height: "57px" }}
                className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                onChange={async (e) => {
                    const filter = { ...updateData, vehicleId: e.target.value }
                    dispatch(setUpdateData(filter))
                }} name="cars" id="cars">
                {
                    locationData.length ? locationData.map((o) => (
                        <option selected={o._id == updateData.vehicleId ? true : false} key={o.vehicleName} value={o._id}>{o.vehicleName}</option>
                    )) : ""
                }
            </select>
        </div>

    );
};

export const SelectComponent4 = () => {
    const { updateData } = useSelector(state => state.vehicles)
    const [locationData, setLocationData] = useState([])
    const dispatch = useDispatch()
    return (
        <div style={{ display: "block", width: "100%", marginRight: "15px" }}>
            <label htmlFor="cars">Brand Name</label>
            <select style={{ height: "57px" }}
                className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                onChange={async (e) => {
                    const { value } = e.target
                    if (value == "selectBrandName") {
                        const filter = { ...updateData, vehicleBrand: "" }
                        dispatch(setUpdateData(filter))
                    } else {
                        const filter = { ...updateData, vehicleBrand: e.target.value }
                        dispatch(setUpdateData(filter))
                    }
                }} name="cars" id="cars">
                {
                    BrandData.map((o) => (
                        <option selected={o.value == updateData.vehicleBrand ? true : false} key={o.value} value={o.value}>{o.label}</option>
                    ))
                }
            </select>
        </div>

    );
};

export const SelectComponent5 = () => {
    const { updateData } = useSelector(state => state.vehicles)
    const [locationData, setLocationData] = useState([])
    const dispatch = useDispatch()
    return (
        <div style={{ display: "block", width: "100%", marginRight: "15px" }}>
            <label htmlFor="cars">Vehicle Type</label>
            <select style={{ height: "57px" }}
                className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                onChange={async (e) => {
                    const { value } = e.target
                    if (value == "selectVehicleType") {
                        const filter = { ...updateData, vehicleType: "" }
                        dispatch(setUpdateData(filter))
                    } else {
                        const filter = { ...updateData, vehicleType: e.target.value }
                        dispatch(setUpdateData(filter))
                    }

                }} name="cars" id="cars">
                {
                    staticData.map((o) => (
                        <option selected={o.value == updateData.vehicleType ? true : false} key={o.value} value={o.value}>{o.label}</option>
                    ))
                }
            </select>
        </div>

    );
};

export const CreateUpdate = ({ url }) => {
    const updateData = useSelector(state => state.vehicles.updateData)
    return (
        <button
            onClick={() => displayTableData2(url)}
            className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        >
            {updateData._id ? "Update" : "Create"}
        </button>
    )
}

export const BackButton = ({ label }) => {
    const dispatch = useDispatch()
    return (
        <div style={{ display: "inline-flex" }}>
            <button style={{ margin: "-20px 5px 0px 0px" }} onClick={() => {
                dispatch(setAddNew(false))
            }}><ArrowBack /></button>
            <h1 className="text-2xl uppercase font-bold text-theme mb-5">
                Create {label}
            </h1>
        </div>
    )
}

export const ImageComponent = (props) => {
    const { name, label, id } = props
    const updateData = useSelector(state => state.vehicles.updateData)
    const dispatch = useDispatch()
    const [imageUrl, setImageUrl] = useState("")
    const handleImageChange = async (file) => {
        const url = URL.createObjectURL(file);
        const formData = new FormData();
        formData.append('profileImg', file);
        const response = await postApi('/image-upload', { formData })
        if (response && response.data) {
            dispatch(setError({ type: "success", message: response.message }))
            let rr = { ...updateData, [name]: response.data }
            dispatch(setUpdateData(rr))
            setImageUrl(url);
        }
    }
    return (
        <div style={{ display: "block", width: "100%", marginLeft: "10px" }}>
            <p className="block text-gray-800 font-semibold text-sm mb-2">{label}</p>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md px-6 py-6 md:py-5 lg:py-4 text-center mb-5">
                <input
                    type="file"
                    className="hidden"
                    id={name}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                />
                {updateData[name] ? (
                    //  image preview only shows when there user select any image
                    <>
                        <div className="lg:absolute block text-right right-8 z-50 mb-5">
                            {/* remove image if user want to reupload another image  */}
                            <button
                                className="inline-flex items-center gap-1 text-red-500 border border-red-500 p-1 rounded-md hover:bg-red-500 hover:text-gray-100 transition duration-300 ease-in-out group"
                                onClick={() => {
                                    setImageUrl("")
                                    dispatch(setUpdateData({ ...updateData, [name]: "" }));
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="group-hover:stroke-gray-100 stroke-red-500 transition duration-300 ease-in-out group"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Remove
                            </button>
                        </div>
                        <div className="w-full h-28 lg:h-40 mx-auto relative mx-auto">
                            <img
                                src={updateData[name]}
                                className="w-full h-full object-contain hover:border rounded-xl transition duration-300 ease-in-out"
                                alt="UPLOAD_IMAGE"
                            />
                        </div>
                    </>
                ) : (
                    <label htmlFor={name} className="cursor-pointer">
                        {/* if not showing image preview than show option to upload */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <g transform="translate(2 3)">
                                <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                                <circle cx="10" cy="10" r="4" />
                            </g>
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <label
                                htmlFor={name}
                                className="cursor-pointer text-theme hover:underline mr-1"
                            >
                                Browse
                            </label>
                            to upload {label}.
                        </p>
                    </label>
                )}
            </div>
        </div>
    )
}

export const SelectComponent = ({ data, label, name }) => {
    const { updateData } = useSelector(state => state.vehicles)
    const dispatch = useDispatch()
    return (
        <div style={{ display: "block", width: "100%", marginRight: "15px" }}>
            <label htmlFor="cars">{label}</label>
            <select style={{ height: "57px" }}
                className="w-full pl-[3.4rem] pr-4 py-3.5 appearance-none bg-transparent outline-none border border-gray-100 lg:border-gray-300 focus:border-text-gray-200 lg:focus:border-theme lg:focus:text-gray-800 text-gray-100 lg:text-gray-800 outline-none rounded-lg placeholder-gray-100 lg:placeholder-gray-400"
                onChange={async (e) => {
                    if (e.target.value.includes("select")) {
                        const filter = { ...updateData, [name]: "" }
                        dispatch(setUpdateData(filter))
                        return
                    }
                    const filter = { ...updateData, [name]: e.target.value }
                    dispatch(setUpdateData(filter))
                }} name="cars" id="cars">
                {
                    data && data.length ? data.map((o) => (
                        <option selected={o.value == updateData[name] ? true : false} key={o.value} value={o.value}>{o.label}</option>
                    )) : ""
                }
            </select>
        </div>

    );
};

export const CollectiveComponent = () => {
    return (
        <>
            <LinkComponent />
            <div className="mt-5">
                <CustomTable />
            </div>
        </>
    )
}
export const LinkComponent = () => {
    const dispatch = useDispatch();
    return (
        <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl uppercase font-bold text-theme">
                {window.location.pathname.substr(1, window.location.pathname.length)}
            </h1>
            <Link
                onClick={() => {
                    dispatch(setUpdateData({}))
                    dispatch(setAddNew(true))
                }}
                className="bg-theme font-semibold text-gray-100 px-4 lg:px-6 py-2.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="stroke-gray-100"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add new
            </Link>
        </div>
    )
}