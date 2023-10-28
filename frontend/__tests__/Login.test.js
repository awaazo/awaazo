import React from "react";
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Main from "../pages/Main";
import "jest-webextension-mock";

// Mock Next.js' router to prevent issues
jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

//----------------------------------------
// END OF MOCK METHODS & CONFIGURATION
//----------------------------------------

/*
 * Test case 1: It should render the login page and its content
 */
test.skip("Renders the login page header and description", () => {
  render(
    <SessionProvider session={null}>
      <Login />
    </SessionProvider>
  );

  const WelcomeMsg = screen.getByText("Welcome Back");
  const SignInMsg = screen.getByText("Sign in to continue");

  expect(WelcomeMsg).toBeInTheDocument();
  expect(SignInMsg).toBeInTheDocument();
});

/*
 * Test case 2: It should render the login form
 */
test.skip("Renders the login form elements", () => {
  render(
    <SessionProvider session={null}>
      <Login />
    </SessionProvider>
  );

  const emailInput = screen.getByPlaceholderText("Enter your email");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const loginButton = screen.getByText("Login");

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

/*
 * Test case 3: It should call the handleLogin function when submitted with valid fields
 */
test.skip("Submits the login form with valid fields", async () => {
  const consoleSpy = jest.spyOn(console, "debug");

  await act(async () => {
    render(
      <SessionProvider session={null}>
        <Login />
      </SessionProvider>
    );
  })

  const emailInput = screen.getByPlaceholderText("Enter your email");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const loginButton = screen.getByText("Login");

  expect(loginButton).toBeEnabled();

  await fireEvent.change(emailInput, { target: { value: "any@email.com" } });
  await fireEvent.change(passwordInput, { target: { value: "anyPassword" } });
  await fireEvent.click(loginButton);

  // Assert that signup button works as expected
  expect(consoleSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      method: "POST",
      url: "http://localhost:32773/auth/login",
      data: { email: "any@email.com", password: "anyPassword" },
      headers: { accept: "*/*", "Content-Type": "application/json" },
    })
  );

  // Restore the original console.log function
  consoleSpy.mockRestore();
});

/*
 * Test case 4: It should return an error if the login form with invalid credentials
 */
test.skip("Displays an error if the login form with invalid credentials", async () => {
  // Mock AuthHelper methods for Token Management and Google SSO
  jest.mock("../helpers/AuthHelper", () => ({
    // Mock login method
    login: jest.fn((email, password) => {
      if (email === "wrong@invalid.com" && password === "invalidPassword") {
        return false;
      }
    }),

    // Mock isLoggedIn method
    isLoggedIn: jest.fn().mockReturnValue(false),
  }));

  await act(async () => {
    render(
      <SessionProvider session={null}>
        <Login />
      </SessionProvider>
    );
  })
  const emailInput = screen.getByPlaceholderText("Enter your email");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const loginButton = screen.getByText("Login");

  expect(loginButton).toBeEnabled();

  await fireEvent.change(emailInput, {
    target: { value: "wrong@invalid.com" },
  });
  await fireEvent.change(passwordInput, {
    target: { value: "invalidPassword" },
  });
  await fireEvent.click(loginButton);

  waitFor(
    () => {
      const errorMsg = screen.getByText(
        "Login failed. Invalid Email and/or Password."
      );
      expect(errorMsg).toBeInTheDocument();
    },
    {
      timeout: 3000,
    }
  );
});

/*
 * Test case 5: It should dsiplay the option to sign in with Google
 */
test.skip("Displays the 'Sign in with Google' option", async () => {
  await act(async () => {
    render(
      <SessionProvider session={null}>
        <Login />
      </SessionProvider>
    );
  })
  const signInWithGoogleButton = screen.getByText("Sign in with Google");
  expect(signInWithGoogleButton).toBeEnabled();
  expect(signInWithGoogleButton).toBeInTheDocument();
});

/*
 * Test case 6: It should display 'Sign up' link to navigate to the login page
 */
test.skip("Displays 'Sign up' link to navigate to the login page", async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/auth/Login"]}>
      <SessionProvider session={null}>
        <Login />
      </SessionProvider>
    </MemoryRouter>
    );
  })

  const signUpLink = screen.getByText("Sign up");
  await fireEvent.click(signUpLink);

  // Assure link is there and active
  expect(signUpLink).toBeEnabled();
  expect(signUpLink).toBeInTheDocument();
});
