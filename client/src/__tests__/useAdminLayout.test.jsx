import { renderHook } from "@testing-library/react";
import { createContext, useEffect, useState } from "react";
import { act } from "react-dom/test-utils";

import { AdminLayoutContext, AdminLayoutContextProvider } from "../context";
import { useAdminLayout } from "../hooks";

describe("useAdmiLayout", () => {
  const wrapper = ({ children }) => (
    <AdminLayoutContextProvider>{children}</AdminLayoutContextProvider>
  );

  test("should return 4 values", () => {
    const { result } = renderHook(() => useAdminLayout(), { wrapper });

    expect(Object.keys(result.current).length).toEqual(4);
  });

  test("should return correctly shared props", () => {
    const contextValues = [
      "isUnderMDScreen",
      "sidebarIsOpen",
      "setIsUnderMDScreen",
      "setSidebarIsOpen",
    ];

    const { result } = renderHook(() => useAdminLayout(), { wrapper });

    expect(Object.keys(result.current)).toEqual(contextValues);
  });

  test("should return correctly prop values", () => {
    const MockContext = createContext(AdminLayoutContext);

    const wrapperContext = ({ children, value }) => (
      <MockContext.Provider value={value}>{children}</MockContext.Provider>
    );

    const { result, rerender } = renderHook(
      ({ windowWidth }) => {
        const [isUnderMDScreen, setIsUnderMDScreen] = useState(false);
        const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

        useEffect(() => {
          setIsUnderMDScreen(windowWidth <= 767);
          setSidebarIsOpen(windowWidth >= 768);
        }, [windowWidth]);

        return {
          isUnderMDScreen,
          sidebarIsOpen,
        };
      },
      {
        wrapperContext,
        initialProps: {
          windowWidth: 378,
        },
      }
    );

    expect(result.current).toEqual({
      isUnderMDScreen: true,
      sidebarIsOpen: false,
    });

    rerender({ windowWidth: 777 });

    expect(result.current).toEqual({
      isUnderMDScreen: false,
      sidebarIsOpen: true,
    });
  });

  test("should an empty object if context not wrapped with the `AdminContextProvider`.", () => {
    const { result } = renderHook(() => useAdminLayout());

    expect(result.current).toEqual({});
  });

  test("should changes the values", () => {
    let windowWidth = 378;
    const { result } = renderHook(() => useAdminLayout(), { wrapper });

    act(() => {
      result.current.setIsUnderMDScreen(windowWidth <= 767);
      result.current.setSidebarIsOpen(windowWidth >= 768);
    });

    expect(result.current).toEqual({
      isUnderMDScreen: true,
      sidebarIsOpen: false,
      setIsUnderMDScreen: result.current.setIsUnderMDScreen,
      setSidebarIsOpen: result.current.setSidebarIsOpen,
    });

    windowWidth = 1080;

    act(() => {
      result.current.setIsUnderMDScreen(windowWidth <= 767);
      result.current.setSidebarIsOpen(windowWidth >= 768);
    });

    expect(result.current).toEqual({
      isUnderMDScreen: false,
      sidebarIsOpen: true,
      setIsUnderMDScreen: result.current.setIsUnderMDScreen,
      setSidebarIsOpen: result.current.setSidebarIsOpen,
    });
  });
});
