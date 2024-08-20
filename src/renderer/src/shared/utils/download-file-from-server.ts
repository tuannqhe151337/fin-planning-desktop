export const downloadFileFromServer = async (
  url: string,
  token?: string,
  fileName?: string
) => {
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` || "" },
    });

    const blob = await response.blob();

    const fileurl = window.URL.createObjectURL(new Blob([blob]));

    const link = document.createElement("a");

    link.href = fileurl;
    link.setAttribute("download", fileName ? fileName : `template.xlsx`);
    link.target = "_blank";

    link.click();
  } catch (_) {}
};
