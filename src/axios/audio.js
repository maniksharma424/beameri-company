import { Axios } from "./axios";

export const createVoiceClone = async ({ ...data }) => {
  // return await Axios.post("/api/playht/upload", data, {

  return await Axios.post("/api/elevenlabs/add", data, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
};
