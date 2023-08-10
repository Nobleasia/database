/* eslint-disable global-require */
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import Login from "../pages/login";

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

jest.mock("next/router", () => require("next-router-mock"));

// This is needed for mocking 'next/link':
jest.mock("next/dist/client/router", () => require("next-router-mock"));

const mockLogin = jest.fn((username, password) => {
  return Promise.resolve({ username, password });
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

afterEach(() => {
  console.error.mockClear();
});

test("should display required error when value is invalid", async () => {
  render(<Login />);

  const heading = screen.getByRole("heading", {
    name: /Welcome to NPA Database/i,
  });

  expect(heading).toBeInTheDocument();

  fireEvent.submit(screen.getByRole("button"));
  expect(await screen.findAllByRole("alert")).toHaveLength(2);
  expect(mockLogin).not.toBeCalled();
});

test("should display matching error when username is invalid", async () => {
  render(<Login />);

  fireEvent.input(screen.getByLabelText("Password"), {
    target: {
      value: "Password",
    },
  });
  expect(screen.getByLabelText("Password")).toHaveValue("Password");

  fireEvent.submit(screen.getByRole("button"));

  expect(await screen.findByRole("alert")).toBeInTheDocument();

  expect(mockLogin).not.toBeCalled();

  expect(screen.getByLabelText("Username")).toHaveValue("");
});

test("should display matching error when password is invalid", async () => {
  render(<Login />);

  fireEvent.input(screen.getByLabelText("Username"), {
    target: {
      value: "username",
    },
  });
  expect(screen.getByLabelText("Username")).toHaveValue("username");

  fireEvent.submit(screen.getByRole("button"));

  expect(await screen.findByRole("alert")).toBeInTheDocument();

  expect(mockLogin).not.toBeCalled();

  expect(screen.getByLabelText("Password")).toHaveValue("");
});

test("should display alertdialog when username or password is invalid", async () => {
  render(<Login />);

  fireEvent.input(screen.getByLabelText("Username"), {
    target: {
      value: "username",
    },
  });

  expect(screen.getByLabelText("Username")).toHaveValue("username");
  expect(screen.getByLabelText("Password")).toHaveValue("");

  fireEvent.submit(screen.getByRole("button"));

  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(mockLogin).not.toBeCalled();
});

test("should display alertdialog and log the error when username or password is invalid", async () => {
  render(<Login />);

  fireEvent.input(screen.getByLabelText("Username"), {
    target: {
      value: "username",
    },
  });

  fireEvent.input(screen.getByLabelText("Password"), {
    target: {
      value: "password",
    },
  });

  expect(screen.getByLabelText("Username")).toHaveValue("username");
  expect(screen.getByLabelText("Password")).toHaveValue("password");

  fireEvent.submit(screen.getByRole("button"));

  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(mockLogin).not.toBeCalled();
  expect(console.error).toBeCalled();
  expect(console.error).toBeCalledWith("Request failed with status code 404");
});
