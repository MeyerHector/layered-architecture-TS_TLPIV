import axios from "./axios";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTasksRequest = () =>
  axios.get("api/tasks", {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });

export const getTaskByIdRequest = (id) =>
  axios.get(`api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });

export const addTaskRequest = (task) =>
  axios.post("api/tasks", task, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
export const updateTaskRequest = (id, task) =>
  axios.put(`api/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });

export const deleteTaskRequest = (id) =>
  axios.delete(`api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
