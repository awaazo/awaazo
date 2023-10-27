import React from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/shared/Navbar";
import { ColorModeScript, ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider } from "@chakra-ui/react";
import fetchMock from "jest-fetch-mock";

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

// Configure fetch to use fetchMock
global.fetch = fetchMock;

// Mock response for the signOut fetch function so that it doesn't make an actual network request
fetchMock.mockResponse(JSON.stringify({ message: "Logged out" }));

// Helper to control isLoggedIn mock function
let isLoggedInValue;
const setLoggedInValue = (value) => {
  isLoggedInValue = value;
};

// Mock AuthHelper methods for Token Management and Google SSO
jest.mock("../helpers/AuthHelper", () => ({
  // Mock Google SSO login method
  loginGoogleSSO: jest.fn().mockResolvedValue({
    status: 200,
    data: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjAwMjA4NTRjLWMxZmUtNDlhMC1hNTI0LWYyMTVmYWY5MjJlNyIsImV4cCI6MTY5OTgyMTQ5MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMjc3MyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9._fFhGpQgpVAMdB8FqE24Mr1deLktb7vHXkv3xmGT8gA",
    },
  }),

  // Mock logout method
  logout: jest.fn().mockImplementation(() => {
    console.log("logged out");
  }),

  // Mock getUser method
  getUser: jest.fn().mockResolvedValue({
    userId: "c4566bbc-737a-4083-a65d-29e2370e5373",
  }),

  // Mock isLoggedIn method
  isLoggedIn: jest.fn().mockImplementation(() => isLoggedInValue),
}));

//----------------------------------------
// END OF MOCK METHODS & CONFIGURATION
//----------------------------------------

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Test group for when the user has not logged in yet
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe("No Session Navbar tests", () => {
  /*
   * Test case 1: It should render the navbar  its content
   */
  test("Renders the navbar (Signed out) and its content ", () => {
    render(
      <SessionProvider session={null}>
        <Navbar />
      </SessionProvider>
    );

    const logInButton = screen.getByText("Login");
    const signUpButton = screen.getByText("Register");

    // Assure login and register buttons are rendered
    expect(logInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Test group for when the user has logged in through google SSO
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe("Google Session Navbar tests", () => {
  // Mock User with a Google Session
  const mockUser = {
    id: "1654613264",
    email: "test@gmail.com",
    username: "testUser",
    avatar: "",
  };

  // Mock Session for user with a Google Session
  const session = {
    user: mockUser,
    userId: "a5lum3d465zqgdr468mzdf184m2df64a4119mkzdrg",
  };

  setLoggedInValue(false);

  /*
   * Test case 2a: It should render the navbar and all its content when signed in
   */
  test.skip("Renders the navbar (Signed In) and its content ", async () => {
    await act(async () => {
      render(
        <SessionProvider session={session}>
          <Navbar />
        </SessionProvider>
      );
    });

    // Assure that the all user actions are rendered and displayed
    const menuOption1 = screen.getByText("My Account");
    const menuOption2 = screen.getByText("My Podcast");
    const menuOption3 = screen.getByText("Payments");
    const menuOption4 = screen.getByText("Switch to Light Mode");
    const menuOption5 = screen.getByText("Docs");
    const menuOption6 = screen.getByText("FAQ");
    const menuOption7 = screen.getByText("Logout");

    expect(menuOption1).toBeInTheDocument();
    expect(menuOption2).toBeInTheDocument();
    expect(menuOption3).toBeInTheDocument();
    expect(menuOption4).toBeInTheDocument();
    expect(menuOption5).toBeInTheDocument();
    expect(menuOption6).toBeInTheDocument();
    expect(menuOption7).toBeInTheDocument();
  });

  /*
   * Test case 3a: It should call handleSearchSubmit when the search button is clicked
   */
  /*
test("Search button calls handleSearchSubmit", async () => {
  const handleSearchSubmit = jest.fn();
  render(
    <SessionProvider session={null}>
      <Navbar />
    </SessionProvider>
  );

  const searchButton = screen.getByLabelText("Search");
  await fireEvent.click(searchButton);
  expect(handleSearchSubmit).toHaveBeenCalledTimes(1);
});*/

  /*
   * Test case 4a: It should call handleLogOut when the logout button is clicked
   */
  test.skip("Logout button calls handleLogOut to log out user", async () => {
    await act(async () => {
      render(
        <SessionProvider session={null}>
          <Navbar />
        </SessionProvider>
      );
    });
    // Click Logout Button
    const logoutButton = screen.getByText("Logout");
    await fireEvent.click(logoutButton);

    // Assures that logOut method has been called and succeeded in returning user to home page
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  /**
   * Test case 5a: It should toggle between light and dark mode on the Navbar
   */
  test.skip("Toggle between light and dark mode", async () => {
    await act(async () => {
      render(
        <ChakraProvider>
          <ColorModeScript />
          <SessionProvider session={session}>
            <Navbar />
          </SessionProvider>
        </ChakraProvider>
      );
    });

    // Click on toggle Dark Mode button
    const toggleDarkModeButton = screen.getByText("Switch to Dark Mode");
    await fireEvent.click(toggleDarkModeButton);

    // Verify that the button now reads "Switch to Light Mode"
    expect(screen.getByText("Switch to Light Mode")).toBeInTheDocument();

    // Click on toggle Light Mode button
    const toggleLightModeButton = screen.getByText("Switch to Light Mode");
    await fireEvent.click(toggleLightModeButton);

    // Verify that the button now reads "Switch to Dark Mode"
    expect(screen.getByText("Switch to Dark Mode")).toBeInTheDocument();
  });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Test group for when the user has logged in using the app's authentication process
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe("Regular Session Navbar tests", () => {
  setLoggedInValue(true);
  /*
   * Test case 2b: It should render the navbar and all its content when signed in
   */
  test.skip("Renders the navbar (Signed In) and its content ", async () => {
    await act(async () => {
      render(
        <SessionProvider session={null}>
          <Navbar />
        </SessionProvider>
      );
    });
    // Assure that the all user actions are rendered and displayed
    const menuOption1 = screen.getByText("My Account");
    const menuOption2 = screen.getByText("My Podcast");
    const menuOption3 = screen.getByText("Payments");
    const menuOption4 = screen.getByText("Switch to Light Mode");
    const menuOption5 = screen.getByText("Docs");
    const menuOption6 = screen.getByText("FAQ");
    const menuOption7 = screen.getByText("Logout");

    expect(menuOption1).toBeInTheDocument();
    expect(menuOption2).toBeInTheDocument();
    expect(menuOption3).toBeInTheDocument();
    expect(menuOption4).toBeInTheDocument();
    expect(menuOption5).toBeInTheDocument();
    expect(menuOption6).toBeInTheDocument();
    expect(menuOption7).toBeInTheDocument();
  });

  /*
   * Test case 3b: It should call handleSearchSubmit when the search button is clicked
   */
  /*
test("Search button calls handleSearchSubmit", async () => {
  const handleSearchSubmit = jest.fn();
  render(
    <SessionProvider session={null}>
      <Navbar />
    </SessionProvider>
  );

  const searchButton = screen.getByLabelText("Search");
  await fireEvent.click(searchButton);
  expect(handleSearchSubmit).toHaveBeenCalledTimes(1);
});*/

  /*
   * Test case 4b: It should call handleLogOut when the logout button is clicked
   */
  test.skip("Logout button calls handleLogOut to log out user", async () => {
    await act(async () => {
      render(
        <SessionProvider session={null}>
          <Navbar />
        </SessionProvider>
      );
    });

    // Click Logout Button
    const logoutButton = screen.getByText("Logout");
    await fireEvent.click(logoutButton);

    // Assures that logOut method has been called and succeeded in returning user to home page
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  /**
   * Test case 5b: It should toggle between light and dark mode on the Navbar
   */
  test.skip("Toggle between light and dark mode", async () => {
    await act(async () => {
      render(
        <ChakraProvider>
          <ColorModeScript />
          <SessionProvider session={null}>
            <Navbar />
          </SessionProvider>
        </ChakraProvider>
      );
    });

    // Click on toggle Dark Mode button
    const toggleDarkModeButton = screen.getByText("Switch to Dark Mode");
    await fireEvent.click(toggleDarkModeButton);

    // Verify that the button now reads "Switch to Light Mode"
    expect(screen.getByText("Switch to Light Mode")).toBeInTheDocument();

    // Click on toggle Light Mode button
    const toggleLightModeButton = screen.getByText("Switch to Light Mode");
    await fireEvent.click(toggleLightModeButton);

    // Verify that the button now reads "Switch to Dark Mode"
    expect(screen.getByText("Switch to Dark Mode")).toBeInTheDocument();
  });
});
