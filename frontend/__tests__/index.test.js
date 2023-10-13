import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession, createSession, signOut } from "next-auth/react";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";
import Home from "../pages/index";

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
  id: "9b61a730-0c33-48ec-b247-dcf889583978",
  email: "string",
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

//Generated Token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjliNjFhNzMwLTBjMzMtNDhlYy1iMjQ3LWRjZjg4OTU4Mzk3OCIsImV4cCI6MTY5OTc2NzMyOCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMjc3MyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.rlNiPLl_XXDh_EPfRfbadW-QbfPW039Aac7y9CxUVLI";

// Utility function to mock a logged in user
function setLocalStorageData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Test case 1: It should render the signup page and its content when a user is not signed In
test("Renders the index page (Not Signed In)  navbar and content ", () => {
  render(
    <SessionProvider session={null}>
      <Home />
    </SessionProvider>
  );
  const MainMsg = screen.getByText("Main Content Here");
  expect(MainMsg).toBeInTheDocument();
});

// Test case 2: It should render the signup page and its content when a user is signed In
test("Renders the index page (Signed In) navbar and content ", () => {
  setLocalStorageData(token, mockUser);
  render(
    <SessionProvider session={{ user: mockUser }}>
      <Home />
    </SessionProvider>
  );
  const MainMsg = screen.getByText("Main Content Here");
  expect(MainMsg).toBeInTheDocument();
});
