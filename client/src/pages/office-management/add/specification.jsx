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
  AddOfficeLabel,
  OfficeManagementCustomPlaceholder,
  OfficeManagementGroupInput,
  getAddOfficeLayout,
} from "@/features/office-management";

const Specification = ({ condition }) => {
  const {
    control,
    setError,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext();

  return (
    <>
      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="grade">Grade</AddOfficeLabel>
        <Controller
          control={control}
          name="grade"
          rules={{
            pattern: {
              value: /^[A-Z ]+$/g,
              message: "Grade must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="text"
                id="grade"
                placeholder="Office grade"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target;
                  const isCustomInvalid = /[^A-Z ]+/.test(value);

                  if (isCustomInvalid) {
                    setError("tower", {
                      type: "custom",
                      message: "Tower must not contain special characters",
                    });
                  } else {
                    clearErrors("tower");
                  }

                  field.onChange(value);
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <OfficeManagementCustomPlaceholder>
                  Example: A
                </OfficeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </OfficeManagementGroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="floor">Floor</AddOfficeLabel>
        <Controller
          control={control}
          name="floor"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Floor must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="text"
                id="floor"
                placeholder="Office floor"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target;
                  const isCustomInvalid = /[^a-zA-Z0-9 ]+/.test(value);

                  if (isCustomInvalid) {
                    setError("floor", {
                      type: "custom",
                      message: "Floor must not contain special characters",
                    });
                  } else {
                    clearErrors("floor");
                  }

                  field.onChange(value);
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <OfficeManagementCustomPlaceholder>
                  Example: 7A
                </OfficeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </OfficeManagementGroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="semi_gross_area">
          Semi Gross Area (sqm)
        </AddOfficeLabel>
        <Controller
          control={control}
          name="semi_gross_area"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="semi_gross_area"
                placeholder="Office semi gross area"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
              />
              <OfficeManagementCustomPlaceholder>
                Example: 500
              </OfficeManagementCustomPlaceholder>
            </>
          )}
        />
      </OfficeManagementGroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="parking_ratio">
          Parking Ratio (sqm)
        </AddOfficeLabel>
        <Controller
          control={control}
          name="parking_ratio"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="parking_ratio"
                placeholder="Office parking ratio"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value));
                }}
              />
              <OfficeManagementCustomPlaceholder>
                Example: 500
              </OfficeManagementCustomPlaceholder>
            </>
          )}
        />
      </OfficeManagementGroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="condition">Condition</AddOfficeLabel>

        <Controller
          control={control}
          name="condition"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="condition"
              placeholder="Select a condition type ..."
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

              {condition.map(({ id, label, value }) => (
                <SelectItem
                  key={`select-condition-${value}-${id}`}
                  value={value}
                  selected={field.value === value && label}
                >
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </OfficeManagementGroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddOfficeLabel htmlFor="remarks_1">First Remark</AddOfficeLabel>
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
                <OfficeManagementCustomPlaceholder>
                  Example: Unreachable
                </OfficeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddOfficeLabel htmlFor="remarks_2">Second Remark</AddOfficeLabel>
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
                <OfficeManagementCustomPlaceholder>
                  Example: Unreachable
                </OfficeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddOfficeLabel htmlFor="remarks_3">Third Remark</AddOfficeLabel>
        <Controller
          control={control}
          name="remarks_3"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "Third Remark must not contain special characters",
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
                      message:
                        "Third remark must not contain special characters",
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
                <OfficeManagementCustomPlaceholder>
                  Example: Unreachable
                </OfficeManagementCustomPlaceholder>
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
      condition: [
        {
          id: 1,
          value: "Fitted",
          label: "Fitted",
        },
        {
          id: 2,
          value: "Semi Fitted",
          label: "Semi Fitted",
        },
        {
          id: 3,
          value: "Bare",
          label: "Bare",
        },
      ],
    },
  };
}

Specification.getLayout = getAddOfficeLayout;

export default Specification;
