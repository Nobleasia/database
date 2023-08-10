import { renderHook } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";

import { AuthContextProvider } from "../context/AuthContextProvider";
import { useAuth } from "../hooks";

describe("useAuth Hook", () => {
  const wrapper = ({ children }) => (
    <AuthContextProvider>{children}</AuthContextProvider>
  );

  test("should return context values.", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(Object.keys(result.current)).toEqual(["auth", "setAuth"]);
    expect(typeof result.current.auth).toEqual("object");
    expect(typeof result.current.setAuth).toEqual("function");
  });

  test("The `auth` defualt value should be an empty object.", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.auth).toEqual({});
  });

  test("should an empty object if context not wrapped with the `AuthContextProvider`.", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toEqual({});
  });

  test("should changes the `auth` value", () => {
    const attributes = {
      access_token: "123456",
      user_role: "user",
    };

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.auth).toEqual({});

    act(() => {
      result.current.setAuth(attributes);
    });

    expect(result.current.auth).toEqual({
      access_token: "123456",
      user_role: "user",
    });
  });
});
