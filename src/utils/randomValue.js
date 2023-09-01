export const randomValues = () => {
  const string = "abcdefghijklmnopqrstuvwxyz";

  let val = "";

  for (let i = 0; i < 6; i++) {
    val += string[Math.floor(Math.random() * string.length)];
  }

  return val;
};
