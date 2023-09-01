import { isAutheticated } from "../utils/auth";
import { Axios } from "./axios";

const { token, data } = isAutheticated();

const _id = data?.data?.branchData?._id;

export const getMember = async () => {
  return await Axios.get(`/api/member/get-members/${_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getMemberSingle = async (id) => {
  return await Axios.get(`/api/member/get-member/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createMember = async ({ ...data }) => {
  return await Axios.post(`/api/member/add-member/${_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editMember = async ({ id, ...rest }) => {
  return await Axios.put(`/api/member/update-member/${id}`, rest, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteMember = async (id) => {
  return await Axios.delete(`/api/member/delete-member/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
