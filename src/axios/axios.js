import axios from "axios";
import { API } from "../utils/api";

export const Axios = axios.create({
  baseURL: API,
});
