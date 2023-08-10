import { AddPicCompanyDialog } from "../add-pic-company-dialog"
import { AddPicDialog } from "../add-pic-dialog"
import { AddPicRoleDialog } from "../add-pic-role-dialog"
import { AddPropertyAreaDialog } from "../add-property-area-dialog"
import { AddPropertyFacilityDialog } from "../add-property-facility-dialog"
import { AddPropertyPaymentTermsDialog } from "../add-property-payment-terms-dialog"

export const OtherFormsTableActionEditButton = ({
  editFormNameId,
  mutateDataOrigin,
  ...props
}) => {
  const editFormNameIdObject = {
    pic: AddPicDialog,
    pic_role: AddPicRoleDialog,
    pic_company: AddPicCompanyDialog,
    property_area: AddPropertyAreaDialog,
    property_payment_terms: AddPropertyPaymentTermsDialog,
    property_facilities: AddPropertyFacilityDialog,
  }

  const EditFormComponent = editFormNameIdObject[editFormNameId]

  return (
    <EditFormComponent
      {...props}
      isEditMode
      mutateDataOrigin={mutateDataOrigin}
    />
  )
}
