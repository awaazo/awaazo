import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession, createSession, signOut } from "next-auth/react";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";
import Home from "../pages/index";
import { describe } from "node:test";

// Mock the Chakra UI useBreakpointValue hook
jest.mock("@chakra-ui/media-query", () => ({
  useBreakpointValue: jest.fn(() => false),
}));

// Mock Next.js' router to prevent issues
jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock User
const mockUser = {
  id: "a5lum3d465zqgdr468mzdf184m2df64a4119mkzdrg",
};

//Generated Token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjliNjFhNzMwLTBjMzMtNDhlYy1iMjQ3LWRjZjg4OTU4Mzk3OCIsImV4cCI6MTY5OTc2NzMyOCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMjc3MyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.rlNiPLl_XXDh_EPfRfbadW-QbfPW039Aac7y9CxUVLI";

// Utility function to mock a logged in user
function setLocalStorageData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

//----------------------------------------
// END OF MOCK METHODS & CONFIGURATION
//----------------------------------------

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Test group for individual components
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe("Renders Navbar with page", () => {
  /*
   * Test case 1: It should render the navbar in the index page
   */
  test("Renders the Navbar in the Index Page ", () => {
    render(
      <SessionProvider session={null}>
        <Home />
      </SessionProvider>
    );
    const navbarElement = screen.getByTestId("navbar-component");

    expect(navbarElement).toBeInTheDocument();
  });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Test group for page content
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe("Renders Navbar with page", () => {
  /*
   * Test case 2: It should render the index page and its content when a user is not signed In
   */
  test("Renders the index page (Not Signed In)  content ", () => {
    render(
      <SessionProvider session={null}>
        <Home />
      </SessionProvider>
    );
    const MainMsg = screen.getByText("Main Content Here");
    expect(MainMsg).toBeInTheDocument();
  });

  /*
   * Test case 3: It should render the index page and its content when a user is signed In
   */
  test("Renders the index page (Signed In) content ", () => {
    setLocalStorageData(token, mockUser);
    render(
      <SessionProvider session={{ user: mockUser }}>
        <Home />
      </SessionProvider>
    );
    const MainMsg = screen.getByText("Main Content Here");
    expect(MainMsg).toBeInTheDocument();
  });
});
