import {
  ApartmentSpecification,
  HomeSpecification,
  LandSpecification,
  OfficeSpecification,
  getViewPublicLayoutProps,
  useViewPublicData,
} from "@/features/property-partialan"

const SpecificationAndTerms = () => {
  const { publicAttributes } = useViewPublicData()

  const propertyType = publicAttributes.property_type

  let specificationComponent = null

  if (propertyType === "Apartment") {
    specificationComponent = (
      <ApartmentSpecification publicAttributes={publicAttributes} />
    )
  } else if (propertyType === "Home") {
    specificationComponent = (
      <HomeSpecification publicAttributes={publicAttributes} />
    )
  } else if (propertyType === "Office") {
    specificationComponent = (
      <OfficeSpecification publicAttributes={publicAttributes} />
    )
  } else if (propertyType === "Land") {
    specificationComponent = (
      <LandSpecification publicAttributes={publicAttributes} />
    )
  }

  return specificationComponent
}

SpecificationAndTerms.getLayout = getViewPublicLayoutProps

export default SpecificationAndTerms
