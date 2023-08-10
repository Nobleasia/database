export const HeaderPage = ({ children }) => {
  return (
    <header className="flex flex-col flex-wrap justify-center gap-5 md:flex-row md:items-center md:justify-between">
      {children}
    </header>
  );
};
