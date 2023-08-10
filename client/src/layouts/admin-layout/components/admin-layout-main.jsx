export const AdminLayoutMain = ({ children }) => {
  return (
    <main className="flex h-screen min-h-max max-w-[100vw] flex-col gap-8 overflow-y-auto p-5 pb-48 sm:max-w-full lg:px-10">
      {children}
    </main>
  );
};
