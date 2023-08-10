import { render, screen } from "@testing-library/react";

import { Badge } from "../components";

describe("Badge component", () => {
  test("should render badge with default props", () => {
    render(<Badge>Test</Badge>);

    expect(screen.getByTestId("badge-component")).toHaveClass(
      "border-npa-neutral-300 bg-npa-neutral-50 text-npa-neutral-500"
    );
  });

  test("should have correctly children or text content", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByTestId("badge-component")).toHaveTextContent("Test");
  });

  describe("Badge component variant classnames", () => {
    test("should have class variant default", () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass(
        "border-npa-neutral-300 bg-npa-neutral-50 text-npa-neutral-500"
      );
    });

    test("should have class variant green", () => {
      render(<Badge variant="green">Green</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass(
        "border-npa-success-300 bg-npa-success-50 text-npa-success-500"
      );
    });

    test("should have class variant red", () => {
      render(<Badge variant="red">Red</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass(
        "border-npa-error-300 bg-npa-error-50 text-npa-error-500"
      );
    });

    test("should have class variant blue", () => {
      render(<Badge variant="blue">Blue</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass(
        "border-npa-info-300 bg-npa-info-50 text-npa-info-500"
      );
    });

    test("should have class variant yellow", () => {
      render(<Badge variant="yellow">Yellow</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass(
        "border-npa-warning-300 bg-npa-warning-50 text-npa-warning-500"
      );
    });

    test("should have class variant default when variant is not green, red, blue, yellow", () => {
      render(<Badge variant="purple">Purple</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass(
        "border-npa-neutral-300 bg-npa-neutral-50 text-npa-neutral-500"
      );
    });
  });

  describe("Badge component size classnames", () => {
    test("should have class size sm", () => {
      render(<Badge size="sm">Small</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass("py-1 px-2");
    });

    test("should have class size md", () => {
      render(<Badge size="md">Medium</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass("py-2 px-3");
    });

    test("should have class size lg", () => {
      render(<Badge size="lg">Large</Badge>);
      expect(screen.getByTestId("badge-component")).toHaveClass("py-3 px-4");
    });
  });
});
