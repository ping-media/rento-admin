import axios from "axios";

const getData = async (url, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["token"] = `${token}`;
  } else {
    return "Error fetching Data. Try Again!";
  }
  const response = await axios.get(`${import.meta.env.VITE_BASED_URL}${url}`, {
    headers,
  });

  if (response.status == 200) {
    return response?.data;
  } else {
    return response?.message;
  }
};

const postData = async (url, data, token) => {
  try {
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // if (data) {
    //   headers = {
    //     "Content-Type": "multipart/form-data",
    //   };
    // }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["token"] = `${token}`;
    }
    const response = await axios.post(
      `${import.meta.env.VITE_BASED_URL}${url}`,
      data,
      {
        headers,
      }
    );
    if (response?.status == 200) {
      return response?.data;
    } else {
      return response?.message;
    }
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

export { getData, postData, handleAdminLogin };
