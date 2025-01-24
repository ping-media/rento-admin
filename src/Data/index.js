import axios from "axios";
import { useNavigate } from "react-router-dom";

// const getData = async (url, token) => {
//   const headers = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   };
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//     headers["token"] = `${token}`;
//   }

//   const response = await axios.get(`${import.meta.env.VITE_BASED_URL}${url}`, {
//     headers,
//   });

//   if (response.status == 200) {
//     return response?.data;
//   } else {
//     return response?.message;
//   }
// };

const getData = async (url, token, retries = 5, delay = 500) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["token"] = `${token}`;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASED_URL}${url}`,
        {
          headers,
        }
      );

      if (response.status === 200) {
        return response?.data;
      } else {
        throw new Error(response?.message || "Unexpected response");
      }
    } catch (error) {
      if (attempt < retries) {
        // console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("All retry attempts failed.");
        const navigate = useNavigate(); // React Router navigation
        navigate("*");
        throw error;
      }
    }
  }
};

// const getFullData = async (url, token) => {
//   const headers = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   };
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//     headers["token"] = `${token}`;
//   } else {
//     return "Error fetching Data. Try Again!";
//   }
//   const response = await axios.get(`${import.meta.env.VITE_BASED_URL}${url}`, {
//     headers,
//   });

//   if (response.status == 200) {
//     return response;
//   } else {
//     return response?.message;
//   }
// };

const getFullData = async (url, token, retries = 5, delay = 500) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (!token) {
    return "Error fetching Data. No token provided.";
  }

  headers["Authorization"] = `Bearer ${token}`;
  headers["token"] = `${token}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASED_URL}${url}`,
        {
          headers,
        }
      );

      if (response.status === 200) {
        return response;
      } else {
        throw new Error(response?.message || "Unexpected response");
      }
    } catch (error) {
      if (attempt < retries) {
        // console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("All retry attempts failed.");
        const navigate = useNavigate(); // React Router navigation
        navigate("*");
        return `Error fetching Data: ${error.message}`;
      }
    }
  }
};

const postData = async (url, data, token) => {
  try {
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (data?.isImage || data?.image || data?.images) {
      headers = {
        "Content-Type": "multipart/form-data",
      };
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["token"] = `${token}`;
    }

    let response;
    if (data?._id && url?.includes("update")) {
      response = await axios.put(
        `${import.meta.env.VITE_BASED_URL}${url}`,
        data,
        {
          headers,
        }
      );
    } else {
      response = await axios.post(
        `${import.meta.env.VITE_BASED_URL}${url}`,
        data,
        {
          headers,
        }
      );
    }
    return response?.data;
  } catch (error) {
    return `Error :${error?.message}`;
  }
};

const postMultipleData = async (url, data, token) => {
  try {
    let headers = {
      "Content-Type": "multipart/form-data",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["token"] = `${token}`;
    }

    let response = await axios.post(
      `${import.meta.env.VITE_BASED_URL}${url}`,
      data,
      {
        headers,
      }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    return `Error :${error?.message}`;
  }
};

const deleteData = async (url) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASED_URL}${url}`
    );
    return response?.data;
  } catch (error) {
    return `Error :${error?.message}`;
  }
};

const deleteDataById = async (url, data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASED_URL}${url}`,
      data
    );
    return response?.data;
  } catch (error) {
    return `Error :${error?.message}`;
  }
};

//for authentication
const handleAdminLogin = async (url, data) => {
  try {
    if (!data) return "email & password should not be empty";
    const response = await axios.post(
      `${import.meta.env.VITE_BASED_URL}${url}`,
      data
    );
    if (response?.status == 200) {
      return response?.data;
    } else {
      return response?.message;
    }
  } catch (error) {
    return error?.message;
  }
};

// for creating order id
const createOrderId = async (data) => {
  if (!data) return "unable to process payment.";
  const payableAmount =
    data?.bookingPrice?.userPaid ||
    data?.bookingPrice?.discountTotalPrice ||
    data?.bookingPrice?.totalPrice ||
    100;

  const amount = payableAmount;
  const options = { amount: amount, booking_id: data?.bookingId || "000000" };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASED_URL}/createOrderId`,
      options
    );

    return response?.data;
  } catch (error) {
    console.error(
      "Error creating Razorpay order:",
      error.response ? error.response.data : error.message
    );
  }
};

export {
  getData,
  getFullData,
  postData,
  postMultipleData,
  handleAdminLogin,
  deleteData,
  deleteDataById,
  createOrderId,
};
