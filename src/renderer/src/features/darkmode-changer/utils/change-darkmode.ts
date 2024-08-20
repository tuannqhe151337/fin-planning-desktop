export const changeDarkmode = (darkmode: boolean) => {
  if (!darkmode) {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
};
