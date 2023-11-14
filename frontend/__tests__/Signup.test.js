import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
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
 * Test case 1: It should render the signup page and its content
 */
test.skip("Renders the sign-up page header and description", () => {
  render(
    <SessionProvider session={null}>
      <Signup />
    </SessionProvider>
  );

  const CreateAccountMsg = screen.getByText("Create an Account");
  const SignUpMsg = screen.getByText("Sign up to get started");

  expect(CreateAccountMsg).toBeInTheDocument();
  expect(SignUpMsg).toBeInTheDocument();
});

/*
 * Test case 2: It should render the signup form
 */
test.skip("Renders the sign-up form elements", () => {
  render(
    <SessionProvider session={null}>
      <Signup />
    </SessionProvider>
  );

  const emailInput = screen.getByPlaceholderText("Enter your email");
  const usernameInput = screen.getByPlaceholderText("Enter your username");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const confirmPasswordInput = screen.getByPlaceholderText(
    "Confirm your password"
  );
  const dateOfBirthInput = screen.getByLabelText("Date of Birth");
  const signUpButton = screen.getByText("Sign Up");

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(usernameInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(dateOfBirthInput).toBeInTheDocument();
  expect(signUpButton).toBeInTheDocument();
});

/*
 * Test case 3: It should call the handleSignup function when submitted with valid fields
 */
test.skip("Submits the sign-up form with valid fields", async () => {
  const consoleSpy = jest.spyOn(console, "debug");

  render(
    <SessionProvider session={null}>
      <Signup />
    </SessionProvider>
  );
  const emailInput = screen.getByPlaceholderText("Enter your email");
  const usernameInput = screen.getByPlaceholderText("Enter your username");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const confirmPasswordInput = screen.getByPlaceholderText(
    "Confirm your password"
  );
  const dateOfBirthInput = screen.getByLabelText("Date of Birth");
  const signUpButton = screen.getByText("Sign Up");

  expect(signUpButton).toBeEnabled();

  await fireEvent.change(emailInput, { target: { value: "any@email.com" } });
  await fireEvent.change(usernameInput, { target: { value: "anyUser" } });
  await fireEvent.change(passwordInput, { target: { value: "anyPassword" } });
  await fireEvent.change(confirmPasswordInput, {
    target: { value: "anyPassword" },
  });
  await fireEvent.input(dateOfBirthInput, {
    target: { value: "2023-10-13" },
  });

  await fireEvent.click(signUpButton);

  // Assert that signup button works as expected
  expect(consoleSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      method: "POST",
      url: process.env.NEXT_PUBLIC_BASE_URL+"/auth/register",
      data: {
        email: "any@email.com",
        password: "anyPassword",
        dateOfBirth: "2023-10-13T00:00:00.000Z",
        username: "anyUser",
        gender: "None",
      },
      headers: { accept: "*/*", "Content-Type": "application/json" },
    })
  );

  // Restore the original console.log function
  consoleSpy.mockRestore();
});

/*
 * Test case 4: It should show an error when the register process fails
 */
test.skip("Shows an error when the register process fails", async () => {
  // Mock AuthHelper methods for Token Management and Google SSO
  jest.mock("../helpers/AuthHelper", () => ({
    // Mock login method
    register: jest.fn((email, password) => {
      if (email === "existing@email.com" && password === "anyPassword") {
        return false;
      }
    }),
  }));
  render(
    <SessionProvider session={null}>
      <Signup />
    </SessionProvider>
  );
  const emailInput = screen.getByPlaceholderText("Enter your email");
  const usernameInput = screen.getByPlaceholderText("Enter your username");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const confirmPasswordInput = screen.getByPlaceholderText(
    "Confirm your password"
  );
  const dateOfBirthInput = screen.getByLabelText("Date of Birth");
  const signUpButton = screen.getByText("Sign Up");

  expect(signUpButton).toBeEnabled();

  await fireEvent.change(emailInput, {
    target: { value: "existing@email.com" },
  });
  await fireEvent.change(usernameInput, { target: { value: "anyUser" } });
  await fireEvent.change(passwordInput, { target: { value: "anyPassword" } });
  await fireEvent.change(confirmPasswordInput, {
    target: { value: "anyPassword" },
  });
  await fireEvent.input(dateOfBirthInput, {
    target: { value: "2023-10-13" },
  });

  await fireEvent.click(signUpButton);

  waitFor(
    () => {
      const errorMsg = screen.getByText("Registration failed.");
      expect(errorMsg).toBeInTheDocument();
    },
    {
      timeout: 3000,
    }
  );
});

/*
 * Test case 5: It should show an error when the password and confrim password is not the same
 */
test.skip("Shows an error when passwords don't match", async () => {
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
  render(
    <SessionProvider session={null}>
      <Signup />
    </SessionProvider>
  );
  const emailInput = screen.getByPlaceholderText("Enter your email");
  const usernameInput = screen.getByPlaceholderText("Enter your username");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const confirmPasswordInput = screen.getByPlaceholderText(
    "Confirm your password"
  );
  const dateOfBirthInput = screen.getByLabelText("Date of Birth");
  const signUpButton = screen.getByText("Sign Up");

  expect(signUpButton).toBeEnabled();

  await fireEvent.change(emailInput, { target: { value: "any@email.com" } });
  await fireEvent.change(usernameInput, { target: { value: "anyUser" } });
  await fireEvent.change(passwordInput, { target: { value: "anyPassword" } });
  await fireEvent.change(confirmPasswordInput, {
    target: { value: "differentPassword" },
  });
  await fireEvent.input(dateOfBirthInput, {
    target: { value: "2023-10-13" },
  });

  await fireEvent.click(signUpButton);

  const errorMsg = screen.getByText("Passwords do not match.");
  expect(errorMsg).toBeInTheDocument();
});

/*
 * Test case 6: It should display the option to sign up with Google
 */
test.skip("Displays the 'Sign up with Google' option", async () => {
  render(
    <SessionProvider session={null}>
      <Signup />
    </SessionProvider>
  );
  const signInWithGoogleButton = screen.getByText("Sign up with Google");
  expect(signInWithGoogleButton).toBeEnabled();
  expect(signInWithGoogleButton).toBeInTheDocument();
});
/*
 * Test case 7: It should display 'Log in' link to navigate to the login page
 */
test.skip("Displays 'Log in' link to navigate to the login page", async () => {
  render(
    <MemoryRouter initialEntries={["/auth/Login"]}>
      <SessionProvider session={null}>
        <Signup />
      </SessionProvider>
    </MemoryRouter>
  );

  const LogInLink = screen.getByText("Log in");
  await fireEvent.click(LogInLink);

  // Assure link is there and active
  expect(LogInLink).toBeEnabled();
  expect(LogInLink).toBeInTheDocument();
});
