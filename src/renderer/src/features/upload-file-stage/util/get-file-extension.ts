export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }

  return "";
};
