export const AlertInputError = ({ children }) => {
  return (
    <p className="text-sm text-red-500" role="alert">
      {children}
    </p>
  );
};
