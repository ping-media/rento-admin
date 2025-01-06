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

const getFullData = async (url, token) => {
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
    return response;
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

const getGeoData = async (zipCode) => {
  try {
    let response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${
        import.meta.env.VITE_GEO_KEY
      }`
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

export {
  getData,
  getFullData,
  postData,
  postMultipleData,
  handleAdminLogin,
  deleteData,
  deleteDataById,
  getGeoData,
};
