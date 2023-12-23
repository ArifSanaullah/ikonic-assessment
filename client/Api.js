import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:3001";
axios.defaults.baseURL = API_URL;

class Api {
  token = null;

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

  createUser = async (data) => {
    const apiCall = axios({
      method: "post",
      url: "/user",
      data,
    });
    const response = await this.executeApiCall(1, "createUser", false, apiCall);

    if (response) {
      return response.user;
    }
    return undefined;
  };

  getUserByEmail = async (email) => {
    const apiCall = axios({
      method: "get",
      url: `/user/${email}`,
    });
    const response = await this.executeApiCall(
      1,
      "getUserByEmail",
      false,
      apiCall
    );

    if (response) {
      return response.user;
    }
    return undefined;
  };

  getOrCreateUserByEmail = async (email) => {
    const apiCall = axios({
      method: "post",
      url: `/user/get-or-create-user-by-email/${email}`,
    });

    const response = await this.executeApiCall(
      1,
      "getOrCreateUserByEmail",
      false,
      apiCall
    );

    if (response) {
      return response.user;
    }
    return undefined;
  };

  createRoom = async (data) => {
    const apiCall = axios({
      method: "post",
      url: `rooms/`,
      data,
    });

    return this.executeApiCall(0, "createRoom", false, apiCall);
  };

  getJoinedRooms = async (userId) => {
    const apiCall = axios({
      method: "get",
      url: `rooms/joined/${userId}`,
    });

    return this.executeApiCall(1, "getJoinedRooms", false, apiCall);
  };

  getRoomMessages = async (roomId) => {
    const apiCall = axios({
      method: "get",
      url: `/messages/room/${roomId}`,
    });

    return this.executeApiCall(0, "getRoomMessages", false, apiCall);
  };

  getJoinedRooms = async (userId) => {
    const apiCall = axios({
      method: "get",
      url: `rooms/joined/${userId}`,
    });

    return this.executeApiCall(1, "getJoinedRooms", false, apiCall);
  };

  getJoinableRooms = async (userId) => {
    const apiCall = axios({
      method: "get",
      url: `rooms/get-joinable-rooms/${userId}`,
    });

    return this.executeApiCall(1, "getJoinableRooms", false, apiCall);
  };

  joinRoom = async (data) => {
    const apiCall = axios({
      method: "patch",
      url: `rooms/join-room`,
      data,
    });

    return this.executeApiCall(0, "joinRoom", false, apiCall);
  };

  leaveRoom = async (data) => {
    const apiCall = axios({
      method: "patch",
      url: `rooms/leave-room`,
      data,
    });

    return this.executeApiCall(0, "leaveRoom", false, apiCall);
  };

  sendMessage = async (data) => {
    const apiCall = axios({
      method: "post",
      url: `/messages`,
      data,
    });

    return this.executeApiCall(0, "sendMessage", false, apiCall);
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
