import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:3001";
axios.defaults.baseURL = API_URL;

class Api {
  token = "Hello";

  loadAccessToken() {
    if (!this.token) {
      return;
    }

    axios.defaults.headers.common.authorization = `Bearer ${this.token}`;

    return this.token;
  }

  async executeApiCall(numberOfRetries, name, needsAuth, call) {
    if (numberOfRetries >= 5) {
      throw Error("Reached max retries");
    }

    if (needsAuth) {
      this.loadAccessToken();
    }

    try {
      const response = await call;
      if (response.data) {
        return response.data;
      }
      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAccessToken() {
    let token;
    try {
      token = this.loadAccessToken();
    } catch (e) {
      console.error(e.message);
    }
    return token;
  }

  saveAccessToken(token) {
    this.token = token;
  }

  login = async (data) => {
    const apiCall = axios({
      method: "post",
      url: "/auth/login",
      data,
    });
    const response = await this.executeApiCall(1, "login", false, apiCall);

    if (response) {
      this.saveAccessToken(response.user.token);
      return response.user;
    }
    return undefined;
  };

  isUserLoggedIn() {
    try {
      this.loadAccessToken();
      return {
        isLoggedIn: this.token ? true : false,
        token: this.token,
      };
    } catch (e) {
      return { isLoggedIn: false, token: null };
    }
  }
}

export default new Api();
