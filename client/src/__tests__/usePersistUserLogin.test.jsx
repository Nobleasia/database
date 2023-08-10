import { renderHook } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";

import { PersistUserLoginContextProvider } from "../context";
import { usePersistUserLogin } from "../hooks";

describe("usePersistUser Hook", () => {
  const wrapper = ({ children }) => (
    <PersistUserLoginContextProvider>
      {children}
    </PersistUserLoginContextProvider>
  );

  test("should return correctly context values", () => {
    const contextValuesKey = ["isPersistUserLogin", "setIsPersistUserLogin"];

    const { result } = renderHook(() => usePersistUserLogin(), { wrapper });

    expect(Object.keys(result.current)).toEqual(contextValuesKey);
  });

  test("should return empty object, if not wrapped using PersistUserLoginContextProvider", () => {
    const { result } = renderHook(() => usePersistUserLogin());

    expect(result.current).toEqual({});
  });

  test("should changes the isPersistUserLogin value", () => {
    const condition = true;

    const { result } = renderHook(() => usePersistUserLogin(), { wrapper });

    act(() => {
      result.current.setIsPersistUserLogin(condition);
    });

    expect(result.current.isPersistUserLogin).toEqual(condition);

    act(() => {
      result.current.setIsPersistUserLogin(!condition);
    });

    expect(result.current.isPersistUserLogin).toEqual(!condition);
  });
});
