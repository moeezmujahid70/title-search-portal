
import axios from "axios";

// export const BASE_URL = "https://title-search-portal-production.up.railway.app/api/";
export const BASE_URL = "http://144.76.59.234:8000/api/";
// export const BASE_URL = "http://localhost:8000/api/"; // For local development
axios.defaults.baseURL = BASE_URL;

export const postAPIWithoutAuth = async (url, body) => {
  try {
    RemoveApiHeader();
    const res = await axios.post(url, body);

    return {
      data: res,
      success: true,

    };
  } catch (err) {
    return {
      data: err.response,
      success: false
    };
  }
};

export const postAPIWithAuth = async (url, body, headers) => {
  try {
    await setApiHeader();
    let res = {};
    if (headers) {
      res = await axios.post(url, body, { headers });
    } else {
      res = await axios.post(url, body);
    }
    return { data: res, success: true };
  } catch (err) {
    console.log(err, "err");
    return { data: err.response, success: false };
  }
};



export const getApiWithAuth = async (url) => {
  try {
    await setApiHeader();
    const res = await axios.get(url);
    return { data: res, success: true };
  } catch (err) {

    return { data: err?.response, success: false };
  }
};

const setApiHeader = async () => {
  // const token = await getAccessToken();
  const token = localStorage.getItem("authToken")
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};


const RemoveApiHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};
// utils/auth.js
export const isTokenExpiredError = (error) => {
  return (
    error.response?.data?.code === "token_not_valid" ||
    error.response?.data?.messages?.some(
      (m) => m.message === "Token is expired"
    )
  );
};
