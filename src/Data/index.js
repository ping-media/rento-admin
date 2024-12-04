<<<<<<< HEAD
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

    if (data?.isImage || data?.image) {
      headers = {
        "Content-Type": "multipart/form-data",
      };
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["token"] = `${token}`;
    }
    let response;
    if (data?._id && url.includes("update")) {
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
    // console.log(response);
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

export { getData, postData, handleAdminLogin, deleteData };
=======
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

    if (data?.isImage || data?.image) {
      headers = {
        "Content-Type": "multipart/form-data",
      };
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["token"] = `${token}`;
    }
    let response;
    if (data?._id && url.includes("update")) {
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
    console.log(response);
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
    return response;
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

export { getData, postData, handleAdminLogin, deleteData };
>>>>>>> 7c68227eed8a9ef8581682dfe36493e539047016
