export const dateFormatter = (dateString) => {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Asia/Kuala_Lumpur", // Menggunakan waktu Kuala Lumpur (GMT+8)
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
};
