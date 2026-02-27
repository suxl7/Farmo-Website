class SessionData {
  /**
   * Retrieves and parses the auth data from session storage.
   * @returns {Object|null} The parsed auth object or null if not found.
   */
  static getAuthData() {
    const data = localStorage.getItem("authData") || sessionStorage.getItem("authData");
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing authData:", error);
      return null;
    }
  }

  /**
   * Directly returns the token.
   */
  static getToken() {
    const auth = this.getAuthData();
    return auth ? auth.token : null;
  }

  /**
   * Directly returns the user_id.
   */
  static getUserId() {
    const auth = this.getAuthData();
    return auth ? auth.user_id : null;
  }

  /**
   * Helper to check if the user is logged in.
   */
  static isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Returns the user type.
   */
  static getUserType() {
    const auth = this.getAuthData();
    return auth ? auth.user_type : null;
  }
}

export default SessionData;