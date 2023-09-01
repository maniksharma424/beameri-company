import { isAutheticated } from "../auth";

const { data } = isAutheticated();

export const qrCode = data?.data?.branchData?.qrCode;
export const name = data?.data?.branchData?.name;
