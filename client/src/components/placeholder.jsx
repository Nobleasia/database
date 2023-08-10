export const Placeholder = ({ children, ariaPlaceholder = "", ...props }) => {
  return (
    <p {...props} aria-placeholder={ariaPlaceholder || children}>
      {children}
    </p>
  );
};
