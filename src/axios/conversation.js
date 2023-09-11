import { isAutheticated } from "../utils/auth";
import { Axios } from "./axios";

// const { token } = isAutheticated();

export const getConversation = async () => {
  return await Axios.get("/api/conversation", {});
};
export const getConversationSingle = async (id) => {
  console.log("getExercise", id);
  return await Axios.get(`/api/conversation/${id}`, {});
};
export const createConversation = async ({ ...data }) => {
  return await Axios.post("/api/conversation/create", data, {});
};

export const updateConversation = async ({ id, ...rest }) => {
  return await Axios.put(`/api/conversation/update/${id}`, rest, {});
};
