/* eslint-disable camelcase */

export const handleFacilitiesValues = (oldFacilities, facilities) => {
  const facilitiesSet = new Set(
    facilities.map(({ property_facility_name }) => property_facility_name)
  );
  const oldFacilitiesSet = new Set(
    oldFacilities.map(({ property_facility_name }) => property_facility_name)
  );

  const isSame =
    facilitiesSet.size === oldFacilitiesSet.size &&
    [...facilitiesSet].every((value) => oldFacilitiesSet.has(value));

  if (!isSame && facilitiesSet.size === 0) {
    return [];
  }

  if (isSame) {
    return null;
  }

  const difference = new Set(
    [...oldFacilitiesSet].filter(
      (facilityName) => !facilitiesSet.has(facilityName)
    )
  );

  const finalFacilities = facilities.filter(
    ({ property_facility_name }) => !difference.has(property_facility_name)
  );

  return finalFacilities;
};
