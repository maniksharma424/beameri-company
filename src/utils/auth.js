export const isAutheticated = () => {
  if (typeof window == "undefined") {
    return true;
  }
  if (localStorage.getItem("BranchManagerAuth")) {
    return JSON.parse(localStorage.getItem("BranchManagerAuth"));
  } else {
    console.log(JSON.parse(localStorage.getItem("BranchManagerAuth")));
    return false;
  }
};

export const signout = () => {
  localStorage.removeItem("BranchManagerAuth");
  return true;
};
