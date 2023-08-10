import { Controller, useFormContext } from "react-hook-form";

import {
  AlertInputError,
  GroupInput,
  InputField,
  Select,
  SelectItem,
  SelectItemDefault,
} from "@/components";

import { stringToNumber } from "@/utils";

import {
  AddHomeLabel,
  HomeManagementCustomPlaceholder,
  HomeManagementGroupInput,
  getEditHomeLayout,
} from "@/features/home-management";

const Specification = ({ furnishing, houseType, backyard, swimmingPool }) => {
  const {
    control,
    setError,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext();

  return (
    <>
      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="land_size">Land Size</AddHomeLabel>
        <Controller
          control={control}
          name="land_size"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="land_size"
                placeholder="Home land size"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
              />
              <HomeManagementCustomPlaceholder>
                Example: 500 (m²)
              </HomeManagementCustomPlaceholder>
            </>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="building_size">Building Size</AddHomeLabel>
        <Controller
          control={control}
          name="building_size"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="building_size"
                placeholder="Home building size"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
              />
              <HomeManagementCustomPlaceholder>
                Example: 500 (m²)
              </HomeManagementCustomPlaceholder>
            </>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="stories">Stories</AddHomeLabel>
        <Controller
          control={control}
          name="stories"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Stories must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="text"
                id="stories"
                placeholder="Home stories"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target;

                  const isCustomInvalid = /[^a-zA-Z0-9 ]+/.test(value);
                  if (isCustomInvalid) {
                    setError("stories", {
                      type: "custom",
                      message: "Stories must not contain special characters",
                    });
                  } else {
                    clearErrors("stories");
                  }

                  field.onChange(value);
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <HomeManagementCustomPlaceholder>
                  Example: 7A
                </HomeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="bedroom">Bedroom</AddHomeLabel>
        <Controller
          control={control}
          name="bedroom"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Bedroom must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
                type="number"
                id="bedroom"
                min={0}
                placeholder="Home bedroom unit"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
              />
              <HomeManagementCustomPlaceholder>
                Example: 7 (unit)
              </HomeManagementCustomPlaceholder>
            </>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="bathroom">Bathroom</AddHomeLabel>
        <Controller
          control={control}
          name="bathroom"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Bathroom must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="bathroom"
                min={0}
                placeholder="Home bathroom unit"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
              />
              <HomeManagementCustomPlaceholder>
                Example: 7 (unit)
              </HomeManagementCustomPlaceholder>
            </>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="study_room">Study Room</AddHomeLabel>
        <Controller
          control={control}
          name="study_room"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Study room must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="studyroom"
                min={0}
                placeholder="Home study room unit"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
              />
              <HomeManagementCustomPlaceholder>
                Example: 7 (unit)
              </HomeManagementCustomPlaceholder>
            </>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="carport_or_garage">Carport/Garage</AddHomeLabel>
        <Controller
          control={control}
          name="carport_or_garage"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Carport/garage must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="carport_or_garage"
                min={0}
                placeholder="Home carport/garage unit"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
              />
              <HomeManagementCustomPlaceholder>
                Example: 7 (unit)
              </HomeManagementCustomPlaceholder>
            </>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="backyard">Backyard</AddHomeLabel>

        <Controller
          control={control}
          name="backyard"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="backyard"
              placeholder="Select a backyard status ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              defaultValue={field.value}
              onValueChange={(value) => {
                field.onChange(JSON.parse(value || false));
              }}
            >
              <SelectItemDefault value="">
                Select an backyard status ...
              </SelectItemDefault>
              {backyard.map(({ value, label }) => (
                <SelectItem
                  key={`select-backyard-${value}`}
                  value={value}
                  selected={field.value === value && label}
                >
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="swimming_pool">Swimming Pool</AddHomeLabel>

        <Controller
          control={control}
          name="swimming_pool"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="swimming_pool"
              placeholder="Select a swimming pool status ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              defaultValue={field.value}
              onValueChange={(value) => {
                field.onChange(JSON.parse(value || false));
              }}
            >
              <SelectItemDefault value="">
                Select an availability status ...
              </SelectItemDefault>
              {swimmingPool.map(({ value, label }) => (
                <SelectItem
                  key={`select-available-${value}`}
                  value={value}
                  selected={field.value === value && label}
                >
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="house_type">House Type</AddHomeLabel>

        <Controller
          control={control}
          name="house_type"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="house_type"
              placeholder="Select a house type type ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              value={field.value}
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectItemDefault value="">
                Choose a house type ...
              </SelectItemDefault>
              {console.log(field)}
              {houseType.map((item) => (
                <SelectItem
                  key={`select-house-${item}`}
                  value={item}
                  selected={field.value === item && item}
                >
                  {item}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="furnishing">Furnishing</AddHomeLabel>

        <Controller
          control={control}
          name="furnishing"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="furnishing"
              placeholder="Select a furnishing type ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              value={field.value}
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectItemDefault value="">
                Choose a furnishing type ...
              </SelectItemDefault>

              {furnishing.map((item) => (
                <SelectItem
                  key={`select-furnishing-${item}`}
                  value={item}
                  selected={field.value === item && item}
                >
                  {item}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </HomeManagementGroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddHomeLabel htmlFor="remarks_1">First Remark</AddHomeLabel>
        <Controller
          control={control}
          name="remarks_1"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "First remark must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="textarea"
                id="remarks_1"
                placeholder="Enter first remark"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target;
                  const isCustomInvalid = /[^a-zA-Z0-9., ]+/g.test(value);

                  if (isCustomInvalid) {
                    setError("remarks_1", {
                      type: "custom",
                      message:
                        "First remark must not contain special characters",
                    });
                  } else {
                    clearErrors("remarks_1");
                  }

                  field.onChange(value);
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <HomeManagementCustomPlaceholder>
                  Example: Unreachable
                </HomeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddHomeLabel htmlFor="remarks_2">Second Remark</AddHomeLabel>
        <Controller
          control={control}
          name="remarks_2"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "Remark must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="textarea"
                id="remarks_2"
                placeholder="Enter second remark value"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target;
                  const isCustomInvalid = /[^a-zA-Z0-9., ]+/g.test(value);

                  if (isCustomInvalid) {
                    setError("remarks_2", {
                      type: "custom",
                      message: "remarks_2 must not contain special characters",
                    });
                  } else {
                    clearErrors("remarks_2");
                  }

                  field.onChange(value);
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <HomeManagementCustomPlaceholder>
                  Example: Unreachable
                </HomeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddHomeLabel htmlFor="remarks_3">Third Remark</AddHomeLabel>
        <Controller
          control={control}
          name="remarks_3"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "remarks_3 must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="textarea"
                id="remarks_3"
                placeholder="Enter third remark value"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target;
                  const isCustomInvalid = /[^a-zA-Z0-9., ]+/g.test(value);

                  if (isCustomInvalid) {
                    setError("remarks_3", {
                      type: "custom",
                      message: "remarks_3 must not contain special characters",
                    });
                  } else {
                    clearErrors("remarks_3");
                  }

                  field.onChange(value);
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <HomeManagementCustomPlaceholder>
                  Example: Unreachable
                </HomeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      swimmingPool: [
        {
          value: true,
          label: "Yes",
        },
        {
          value: false,
          label: "No",
        },
      ],
      backyard: [
        {
          value: true,
          label: "Yes",
        },
        {
          value: false,
          label: "No",
        },
      ],
      furnishing: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
      houseType: ["Compound", "Standalone", "Commercial"],
    },
  };
}

Specification.getLayout = getEditHomeLayout;

export default Specification;
