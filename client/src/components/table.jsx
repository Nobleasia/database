import { forwardRef } from "react";

export const Table = forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <table {...props} ref={forwardedRef}>
      {children}
    </table>
  );
});

export const TableBody = forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <tbody {...props} ref={forwardedRef}>
      {children}
    </tbody>
  );
});

export const TableHead = forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <thead
        {...props}
        className={`overflow-hidden rounded-md bg-npa-neutral-200 ${className}`}
        ref={forwardedRef}
      >
        {children}
      </thead>
    );
  }
);

export const TableFoot = forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <tfoot {...props} ref={forwardedRef}>
      {children}
    </tfoot>
  );
});

export const TableHeader = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <th {...props} ref={forwardedRef}>
        {children}
      </th>
    );
  }
);

export const TableRow = forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <tr {...props} ref={forwardedRef}>
      {children}
    </tr>
  );
});

export const TableData = forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <td {...props} ref={forwardedRef}>
      {children}
    </td>
  );
});

Table.displayName = "TableRoot";
TableBody.displayName = "TableBody";
TableHead.displayName = "TableHead";
TableFoot.displayName = "TableFoot";
TableHeader.displayName = "TableHeader";
TableRow.displayName = "TableRow";
TableData.displayName = "TableData";
