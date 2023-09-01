import { isAutheticated } from "../utils/auth";
import { Axios } from "./axios";

const { token } = isAutheticated();

export const getAllArticles = async () => {
  return await Axios.get("/api/article/get-articles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArticleSingle = async (id) => {
  return await Axios.get(`/api/article/get-article/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const createArticle = async ({ ...data }) => {
  return await Axios.post("/api/article/add-article", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editArticle = async ({ id, ...rest }) => {
  return await Axios.put(`/api/article/update-article/${id}`, rest, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteArticle = async (id) => {
  return await Axios.delete(`/api/article/delete-article/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
