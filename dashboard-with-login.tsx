import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart3, Target, Layers, Circle, Plus, X, Sun, Moon, MoreVertical, Lock, User, Eye, EyeOff } from 'lucide-react';

// Authentication Service - Replace with your internal system
class AuthService {
  static async login(credentials) {
    // OPTION 1: REST API Authentication
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      const data = await response.json();
      
      // Store JWT token and user info
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // OPTION 2: LDAP/Active Directory Integration
  static async loginLDAP(credentials) {
    try {
      const response = await fetch('/api/auth/ldap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          domain: 'YOUR_DOMAIN' // e.g., 'mindfulasset.local'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'LDAP authentication failed');
      }
      
      // Store user info and permissions
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      localStorage.setItem('user_permissions', JSON.stringify(data.permissions));
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'LDAP login failed');
    }
  }

  // OPTION 3: SSO Integration (SAML/OAuth)
  static async loginSSO() {
    // Redirect to SSO provider
    window.location.href = '/api/auth/sso/login';
  }

  static async logout() {
    try {
      // Call logout endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('user_permissions');
    }
  }

  static isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  static getCurrentUser() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  static getUserPermissions() {
    const permissions = localStorage.getItem('user_permissions');
    return permissions ? JSON.parse(permissions) : [];
  }

  // Token refresh for long-lived sessions
  static async refreshToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        return data;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }
  }
}

// HTTP Interceptor for API calls
const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 - token expired
    if (response.status === 401) {
      await AuthService.refreshToken();
      // Retry with new token
      const newToken = localStorage.getItem('auth_token');
      config.headers.Authorization = `Bearer ${newToken}`;
      return fetch(url, config);
    }
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Login Page Component with Real Authentication
const LoginPage = ({ onLogin, theme, setTheme }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState('standard'); // 'standard', 'ldap', 'sso'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let authData;
      
      switch (authMethod) {
        case 'ldap':
          authData = await AuthService.loginLDAP(credentials);
          break;
        case 'sso':
          await AuthService.loginSSO();
          return; // SSO will handle redirect
        default:
          authData = await AuthService.login(credentials);
      }
      
      onLogin(authData.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const themeClasses = theme === 'light' 
    ? 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900' 
    : 'bg-gradient-to-br from-gray-800 to-blue-950 text-white';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${themeClasses}`}>
      <div className="relative w-full max-w-md">
        {/* Theme Toggle */}
        <div className="absolute top-0 right-0 -mt-16">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`p-3 rounded-full transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-white/80 hover:bg-white text-gray-700 shadow-lg' 
                : 'bg-gray-800/80 hover:bg-gray-800 text-gray-300 shadow-xl'
            }`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Login Card */}
        <div className={`backdrop-blur-sm border rounded-2xl p-8 shadow-2xl ${
          theme === 'light' 
            ? 'bg-white/90 border-gray-200 shadow-blue-100/50' 
            : 'bg-gray-900/90 border-gray-700 shadow-blue-900/20'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <BarChart3 size={32} className="text-white" />
              </div>
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Mindful Asset Planning
            </h1>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Organizer Dashboard Login
            </p>
          </div>

          {/* Authentication Method Selector */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Authentication Method
            </label>
            <select
              value={authMethod}
              onChange={(e) => setAuthMethod(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-all duration-200 ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500' 
                  : 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
              }`}
              disabled={isLoading}
            >
              <option value="standard">Standard Login</option>
              <option value="ldap">Active Directory / LDAP</option>
              <option value="sso">Single Sign-On (SSO)</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {authMethod !== 'sso' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {authMethod === 'ldap' ? 'Domain Username' : 'Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all duration-200 ${
                      theme === 'light' 
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    placeholder={authMethod === 'ldap' ? 'domain\\username or username@domain.com' : 'Enter your username'}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition-all duration-200 ${
                      theme === 'light' 
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                      theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !credentials.username || !credentials.password}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isLoading || !credentials.username || !credentials.password
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  `Sign In${authMethod === 'ldap' ? ' with Active Directory' : ''}`
                )}
              </button>
            </form>
          )}

          {/* SSO Login */}
          {authMethod === 'sso' && (
            <div className="space-y-6">
              <button
                onClick={() => AuthService.loginSSO()}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Redirecting...</span>
                  </div>
                ) : (
                  'Sign In with Single Sign-On'
                )}
              </button>
              <p className={`text-center text-xs ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                You will be redirected to your organization's SSO provider
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-center text-xs ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              © 2025 Mindful Asset Planning. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Permission-based Component Wrapper
const ProtectedComponent = ({ children, requiredPermission, userPermissions }) => {
  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have permission to access this feature.</p>
      </div>
    );
  }
  return children;
};

// Main Dashboard Component with Real Authentication
export default function MindfulAssetPlanningDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (AuthService.isAuthenticated()) {
        const user = AuthService.getCurrentUser();
        const permissions = AuthService.getUserPermissions();
        
        setIsAuthenticated(true);
        setCurrentUser(user);
        setUserPermissions(permissions);
        
        // Set up token refresh
        const refreshInterval = setInterval(() => {
          AuthService.refreshToken();
        }, 15 * 60 * 1000); // Refresh every 15 minutes
        
        return () => clearInterval(refreshInterval);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Authentication Handlers
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setUserPermissions(AuthService.getUserPermissions());
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserPermissions([]);
  };

  // Loading screen
  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} theme={theme} setTheme={setTheme} />;
  }

  // Dashboard content
  return (
    <div className={`h-screen flex flex-col ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-800 text-white'}`}>
      {/* Header with User Info */}
      <header className={`border-b px-6 py-4 ${theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-gray-900/80 border-gray-700/50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">Mindful Asset Planning - Organizer Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
              theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
            }`}>
              <div className="flex items-center space-x-2">
                <User size={16} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
                <div className="text-left">
                  <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {currentUser?.displayName || currentUser?.username}
                  </div>
                  <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {currentUser?.role || 'User'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  theme === 'light' 
                    ? 'text-gray-600 hover:text-red-600 hover:bg-red-50' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
                }`}
              >
                Logout
              </button>
            </div>
            
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'light' 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Permission Protection */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Welcome, {currentUser?.displayName || currentUser?.username}!</h2>
            <p className={`text-lg mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Successfully authenticated via {currentUser?.authMethod || 'internal system'}
            </p>
          </div>

          {/* Permission-based Feature Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProtectedComponent requiredPermission="view_meetings" userPermissions={userPermissions}>
              <div className={`p-6 rounded-lg border ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
              }`}>
                <h3 className="font-semibold mb-2">Meeting Management</h3>
                <p className="text-sm text-gray-500">View and manage client meetings</p>
              </div>
            </ProtectedComponent>

            <ProtectedComponent requiredPermission="manage_tasks" userPermissions={userPermissions}>
              <div className={`p-6 rounded-lg border ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
              }`}>
                <h3 className="font-semibold mb-2">Task Management</h3>
                <p className="text-sm text-gray-500">Organize and track preparation tasks</p>
              </div>
            </ProtectedComponent>

            <ProtectedComponent requiredPermission="view_reports" userPermissions={userPermissions}>
              <div className={`p-6 rounded-lg border ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
              }`}>
                <h3 className="font-semibold mb-2">Reports & Analytics</h3>
                <p className="text-sm text-gray-500">Access performance dashboards</p>
              </div>
            </ProtectedComponent>
          </div>

          {/* User Details */}
          <div className={`mt-8 p-6 rounded-lg border ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
          }`}>
            <h3 className="font-semibold mb-4">User Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Username:</span> {currentUser?.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {currentUser?.email}
              </div>
              <div>
                <span className="font-medium">Role:</span> {currentUser?.role}
              </div>
              <div>
                <span className="font-medium">Department:</span> {currentUser?.department}
              </div>
              <div>
                <span className="font-medium">Permissions:</span> {userPermissions.length} active
              </div>
              <div>
                <span className="font-medium">Last Login:</span> {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t px-6 py-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900/50 border-gray-700/50'}`}>
        <div className="flex justify-between items-center text-sm">
          <div className={`flex items-center space-x-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            <span>Status: <span className="text-emerald-500">AUTHENTICATED</span></span>
            <span>Session: <span className="text-blue-500">ACTIVE</span></span>
          </div>
          <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-500'}>
            Mindful Asset Planning v2.1.0
          </div>
        </div>
      </footer>
    </div>
  );
}