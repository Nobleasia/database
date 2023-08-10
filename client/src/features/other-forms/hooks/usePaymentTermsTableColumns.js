import { useMemo } from "react";

import { OtherFormsTableActionButtons } from "../components/other-form-table-action-buttons";

export const usePaymentTermsTableColumns = ({
  handleDeleteDataOrigin,
  mutateDataOrigin,
}) => {
  const tableColumns = useMemo(() => {
    return [
      {
        id: "actions",
        accessorFn: (row) => ({
          id: row.id,
          paymentTerm: row.payment_term,
        }),
        cell: (info) => (
          <OtherFormsTableActionButtons
            {...info.getValue()}
            editFormNameId="property_payment_terms"
            handleDeleteDataOrigin={handleDeleteDataOrigin}
            mutateDataOrigin={mutateDataOrigin}
          />
        ),
        header: () => "Actions",
      },
      {
        id: "paymentTerm",
        accessorKey: "payment_term",
        cell: (info) => info.getValue(),
        header: () => "Payment Term",
      },
    ];
  }, []);

  return tableColumns;
};
