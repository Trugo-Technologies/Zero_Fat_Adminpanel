/** @format */

import axios from "@crema/services/axios";
import type { AxiosResponse } from "axios";
import { baseUrl } from "src/env/base-url";
import { v4 as uuidv4 } from "uuid"; // Optional, for generating a unique ID

const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;

  // Device Type Detection
  // Device Type Detection
  let deviceType = "Web"; // Default to Web
  if (/Android/i.test(userAgent)) {
    deviceType = "Android";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    deviceType = "IOS";
  }

  // Operating System Detection
  let deviceOs = "Unknown OS";
  if (userAgent.includes("Win")) {
    deviceOs = "Windows";
  } else if (userAgent.includes("Mac")) {
    deviceOs = "macOS";
  } else if (userAgent.includes("X11") || userAgent.includes("Linux")) {
    deviceOs = "Linux";
  } else if (/Android/i.test(userAgent)) {
    deviceOs = "Android";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    deviceOs = "iOS";
  }

  return {
    BaseDeviceId: uuidv4(), // Generate a unique ID
    DeviceModel: userAgent,
    DeviceType: deviceType,
    DeviceOs: deviceOs,
  };
};

const deviceInfo = getDeviceInfo();

const jwtAxios = axios.create({
  baseURL: baseUrl, // YOUR_API_URL HERE
  headers: {
    "Content-Type": "application/json",
    uniuiq: deviceInfo.BaseDeviceId, // Replace with actual value
    BaseDeviceId: deviceInfo.BaseDeviceId,
    DeviceModel: deviceInfo.DeviceModel,
    DeviceType: deviceInfo.DeviceType,
    DeviceOs: deviceInfo.DeviceOs,
    Platform: "ERP CMS",
    Version: "V 1.0",
  },
});
jwtAxios.interceptors.response.use(
  (res: AxiosResponse<any, any>) => res,
  (err: any) => {
    if (err.response && err.response.data.msg === "Token is not valid") {
      // store.dispatch({type: LOGOUT});
    }
    return Promise.reject(err);
  }
);
export const setAuthToken = (token?: string) => {
  if (token) {
    jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete jwtAxios.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};

export default jwtAxios;
