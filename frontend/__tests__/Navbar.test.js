import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

// Mock response for the signOut function so that it doesn't make an actual network request
fetchMock.mockResponse(JSON.stringify({ message: "Logged out" }));

// Mock User
const mockUser = {
  id: "9b61a730-0c33-48ec-b247-dcf889583978",
  email: "any@email.com",
  password: "$2a$11$nJCWjLfZZVY6MvmTU/Ccw.xGIc6tmeEHoXEZe/FhCb1kslzY4.3em",
  username: "anyUser",
  avatar: "",
  interests: [],
  dateOfBirth: "2023-10-12T05:29:31.44",
  gender: 0,
  isPodcaster: false,
  podcasts: [],
  bookmarks: [],
  podcastFollows: [],
  userFollows: [],
  subscriptions: [],
  ratings: [],
  createdAt: "0001-01-01T00:00:00",
  updatedAt: "0001-01-01T00:00:00",
};

// Test case 1: It should render the navbar  its content
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

// Test case 2: It should render the navbar and all its content when signed in
test("Renders the navbar (Signed In) and its content ", () => {
  render(
    <SessionProvider session={{ user: mockUser }}>
      <Navbar />
    </SessionProvider>
  );

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

//TODO
/*
// Test case 3: It should call handleSearchSubmit when the search button is clicked
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

// Test case 4: It should call handleLogOut when the logout button is clicked
test("Logout button calls handleLogOut to log out user", async () => {
  // Mock the handleLogOut function
  Navbar.handleLogOut = jest.fn();

  render(
    <SessionProvider session={{ user: mockUser }}>
      <Navbar />
    </SessionProvider>
  );

  // Click Logout Button
  const logoutButton = screen.getByText("Logout");
  await fireEvent.click(logoutButton);

  // Assures that logOut method has been called and succeeded in returning user to home page
  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByText("Register")).toBeInTheDocument();
});

// Test case 5: It should toggle between light and dark mode on the Navbar
test("Toggle between light and dark mode", async () => {
  render(
    <ChakraProvider>
      <ColorModeScript />
      <SessionProvider session={{ user: mockUser }}>
        <Navbar />
      </SessionProvider>
    </ChakraProvider>
  );

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
