import moment from "moment";

export const formatDate = (createAt) => {
  const date = moment(createAt);
  const formattedDate = date.format("DD MMM, YYYY");
  return formattedDate;
};
export const timeDate = (createAt) => {
  const date = moment(createAt);
  const formattedDate = date.format("YYYY-MM-DD");
  return formattedDate;
};
