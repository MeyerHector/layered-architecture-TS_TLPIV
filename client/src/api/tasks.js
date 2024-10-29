import axios from "./axios";

export const getTasksRequest = () => axios.get("/api/tasks", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
});

export const getTaskByIdRequest = (id) => axios.get(`/api/tasks/${id}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
});

export const addTaskRequest = (task) => axios.post("/api/tasks", task, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
});

export const updateTaskRequest = (id, task) => axios.put(`/api/tasks/${id}`, task, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
});

export const deleteTaskRequest = (id) => axios.delete(`/api/tasks/${id}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
});
