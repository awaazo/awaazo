import RestHelper from "./RestHelper";
import jwt from "jwt-decode";

export default class AuthHelper {
  private static setToken(token: any) {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
  }

  public static getToken() {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("token")) return null;
      else return localStorage.getItem("token");
    }
  }

  private static removeToken() {
    if (typeof window !== "undefined") localStorage.removeItem("token");
  }

  public static login = async (
    email: string,
    password: string
  ): Promise<string> => {
    // Send the request.
    const res = await RestHelper.authLoginRequest(email, password);
    // Successful login.
    if (res.status == 200) {
      console.debug("Login Successful");
      this.setToken(res.data.token);
      console.log(res.data);
      console.log(res.status);
      return "Login Successful";
    }
    // Unsuccessful login.
    else {
      console.error("Login Failed");
      return res.error_message;
    }
  };

  public static logout = (): void => {
    this.removeToken();
  };

  public static getUserId = async (): Promise<string> => {
    const res = await RestHelper.authMeRequest(this.getToken());

    if (res.status === 200) {
      return res.userId;
    } else {
      return null; // Should never happen.
    }
  };

  public static getUser = (): any => {
    //const user = jwt(this.getToken());
    //return user;
  };

  public static isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Double negation to convert to boolean
  }
}
