export const formatViMoney = (number?: number): string => {
  // Chuyển số thành chuỗi và thêm dấu phẩy
  const formattedNumber = number
    ? (Math.round(number * 100) / 100)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .trim()
    : 0;
  return `${formattedNumber} VNĐ`;
};
