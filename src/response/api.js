import axios from "axios";
import { baseUrl } from "../constant";

export const getApi = async (url) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        headers["token"] = `${token}`;
    }
    const response = await axios.get(baseUrl + "/api" + url, { headers });

    return response.data;
};

export const postApi = async (url, data={}, token) => {
    let headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    if (data.formData) {
        headers = {
            "Content-Type": "multipart/form-data",
        };
    }
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        headers["token"] = `${token}`;
    }
    const response = await axios.post(
        baseUrl + "/api" + url,
        data?.formData ? data?.formData : data,
        { headers },
    );
    return response.data;
};
