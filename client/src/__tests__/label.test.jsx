import { render, screen } from "@testing-library/react";

import { Label } from "../components";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

afterEach(() => {
  console.error.mockClear();
});

test("should have correctly for attribute value", async () => {
  const props = {
    htmlFor: "test",
    className: "flex flex-col",
    children: "Test",
  };

  render(
    <Label htmlFor={props.htmlFor} className={props.className}>
      {props.children}
    </Label>
  );

  expect(screen.getByText("Test")).toBeInTheDocument();
  expect(screen.getByText("Test")).toHaveClass(props.className);
});

test("should log error proptypes types, when the one props has not correctly", async () => {
  let props = {
    htmlFor: "test",
    className: "flex flex-col",
    children: "Test",
  };

  const { rerender } = render(
    <Label htmlFor={props.htmlFor} className={props.className}>
      {props.children}
    </Label>
  );

  expect(screen.getByText("Test")).toBeInTheDocument();
  expect(screen.getByText("Test")).toHaveClass(props.className);

  props = {
    htmlFor: undefined,
    className: "flex flex-col",
    children: "Test",
  };

  rerender(
    <Label htmlFor={props.htmlFor} className={props.className}>
      {props.children}
    </Label>
  );
  expect(console.error).toBeCalled();
});
