import { isAutheticated } from "../utils/auth";
import { Axios } from "./axios";

const { token } = isAutheticated();

export const getAvatarActive = async () => {
  return await Axios.get("/api/avatar", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getVoiceActive = async () => {
  return await Axios.get("/api/elevenlabs/active-voice", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
