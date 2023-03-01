// __tests__/index.test.jsx

import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders get started text", () => {
    render(<Home />);
    expect(
      screen.getByText(
        "Find in-depth information about Next.js features and API."
      )
    ).toBeInTheDocument();
  });
});
