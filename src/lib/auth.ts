import Cookies from 'js-cookie';

export class AuthService {
  static TOKEN_KEY = 'auth-token';
  
  // Save token in cookies (safer than localStorage)
  static setToken(token: string) {
    Cookies.set(this.TOKEN_KEY, token, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      path: '/'
    });
  }
  
  // Get token
  static getToken() {

    return Cookies.get(this.TOKEN_KEY);
  }
  
  // Remove token
  static removeToken() {
    Cookies.remove(this.TOKEN_KEY);
  }
  
  // Login
  static async login(email: string, password: string) {
    try {
      const dataSuccess = {email, password}
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataSuccess),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      this.setToken(data.accessToken);
      
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Logout
  static logout() {
    this.removeToken();
    window.location.href = '/signin';
  }
  
  // Get current user from backend
  static async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const response = await fetch(`/api/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      this.removeToken();
      return null;
    }
  }
}