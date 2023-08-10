export const toCapitalize = (sting) => {
  return sting.toLowerCase().replace(/\b[a-z]/g, (letter) => {
    return letter.toUpperCase();
  });
};
