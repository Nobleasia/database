import cn from "classnames";
import { forwardRef, useMemo, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";

const DEFAULT_INPUT_CLASSNAMES = (disabled) => {
  return cn(
    "form-input w-full appearance-none border-0 bg-transparent py-0 px-0 placeholder:text-sm focus:border-none focus:outline-none focus:ring-0",
    {
      "cursor-not-allowed placeholder:text-npa-neutral-400": disabled,
      "placeholder:text-npa-neutral-500": !disabled,
    }
  );
};

const Input = ({ type, value, disabled, placeholder, inputRef, ...props }) => (
  <input
    {...props}
    type={type}
    ref={inputRef}
    value={value}
    disabled={disabled}
    placeholder={placeholder}
    onWheel={(e) => e.target.blur()}
    className={DEFAULT_INPUT_CLASSNAMES(disabled)}
  />
);

const TextArea = ({ value, disabled, placeholder, inputRef, ...props }) => {
  return (
    <textarea
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      ref={inputRef}
      className={`${DEFAULT_INPUT_CLASSNAMES(disabled)} min-h-[10rem] resize`}
      {...props}
    />
  );
};

const PasswordToggle = ({ isVisible, isError, handleVisiblePassword }) => {
  const DEFAULT_PASSWORD_TOGGLE_CLASSNAMES = cn("h-6 w-6 cursor-pointer", {
    "text-npa-error-500": isError,
    "text-npa-neutral-400": !isError,
  });

  return isVisible ? (
    <AiFillEyeInvisible
      className={DEFAULT_PASSWORD_TOGGLE_CLASSNAMES}
      onClick={handleVisiblePassword}
    />
  ) : (
    <AiFillEye
      className={DEFAULT_PASSWORD_TOGGLE_CLASSNAMES}
      onClick={handleVisiblePassword}
    />
  );
};

export const InputField = forwardRef(
  (
    {
      type,
      disabled,
      placeholder,
      isTouched,
      isSubmitted,
      isError,
      value,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const [isVisible, setIsVisible] = useState(!(type === "password"));
    const handleVisiblePassword = () => {
      setIsVisible((oldValue) => !oldValue);
    };

    const InputComponent = type === "textarea" ? TextArea : Input;

    const inputType = useMemo(() => {
      if (type === "number") {
        return "number";
      }

      if (isVisible) {
        return "text";
      }

      return "password";
    }, [isVisible]);

    return (
      <div
        className={cn(
          "flex h-full items-center justify-between gap-3 rounded-lg border-1 border-npa-neutral-400 px-6 py-3 text-sm duration-300  focus-within:shadow-input lg:text-base",
          {
            "bg-npa-neutral-50 focus-within:ring-4 focus-within:ring-npa-purple-400/30 hover:border-npa-purple-400":
              !disabled && !isError,
            "border-npa-success-500 focus-within:ring-4 focus-within:ring-npa-success-500/20 hover:border-npa-success-500":
              !disabled &&
              isTouched &&
              !isError &&
              isSubmitted &&
              value.length > 0,
            "border-npa-error-500 focus-within:ring-4 focus-within:ring-npa-error-500/20 hover:border-npa-error-500":
              isError,
            "cursor-not-allowed bg-npa-neutral-200": disabled,
          }
        )}
      >
        {children}
        <InputComponent
          {...props}
          type={inputType}
          inputRef={forwardedRef}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
        />

        {type === "password" ? (
          <PasswordToggle
            isVisible={isVisible}
            isError={isError}
            handleVisiblePassword={handleVisiblePassword}
          />
        ) : (
          <RiErrorWarningFill
            className={cn("h-6 w-6 text-npa-error-500", {
              hidden: !isError,
              block: isError,
            })}
          />
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
