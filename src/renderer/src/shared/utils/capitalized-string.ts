// capitalizeFirstLetter.js
export const capitalizeFirstLetter = (value?: string) => {
  try {
    if (!value) {
      return "";
    }

    const lowerCaseString = value.toLowerCase();
    const capitalizedString =
      lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);

    return capitalizedString;
  } catch (ex) {
    return null;
  }
};
