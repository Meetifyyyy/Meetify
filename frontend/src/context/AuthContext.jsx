import { createContext, useContext, useState, useCallback } from 'react';
import { initialUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) return JSON.parse(savedUser);
    
    const oldUsername = localStorage.getItem('username');
    if (oldUsername) {
      const user = Object.values(initialUsers).find(u => u.username === oldUsername) || {
        id: `u_${Date.now()}`,
        username: oldUsername,
        displayName: oldUsername.charAt(0).toUpperCase() + oldUsername.slice(1),
        avatar: oldUsername.charAt(0).toUpperCase(),
        bio: 'Just joined Meetify!',
        location: 'Earth',
        role: 'New User',
        email: `${oldUsername}@meetify.app`,
        followers: 0,
        following: 0,
        communities: []
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const hasUser = !!localStorage.getItem('currentUser') || !!localStorage.getItem('username');
    return localStorage.getItem('loggedIn') === 'true' && hasUser;
  });

  const login = useCallback((username) => {
    // Find the user in mockData, or create a fallback guest if not found
    let user = Object.values(initialUsers).find(u => u.username === username);
    
    if (!user) {
      const isGla = username && username.includes('@gla.ac.in');
      const isIitd = username && username.includes('@iitd.ac.in');
      const baseName = username ? username.split('@')[0] : 'guest';
      
      let collegeId = undefined;
      let communitiesList = [];
      let bioText = 'Just joined Meetify!';
      let roleText = 'New User';
      
      if (isGla) {
        collegeId = 'gla';
        communitiesList = ['GLA University'];
        bioText = 'Student at GLA University';
        roleText = 'Student';
      } else if (isIitd) {
        collegeId = 'iitdelhi';
        communitiesList = ['IIT Delhi'];
        bioText = 'Student at IIT Delhi';
        roleText = 'Student';
      }

      user = {
        id: `u_${Date.now()}`,
        username: username || 'guest',
        displayName: baseName.charAt(0).toUpperCase() + baseName.slice(1),
        avatar: baseName.charAt(0).toUpperCase(),
        bio: bioText,
        location: 'Earth',
        role: roleText,
        email: username && username.includes('@') ? username : `${username || 'guest'}@meetify.app`,
        followers: 0,
        following: 0,
        communities: communitiesList,
        collegeId,
        course: collegeId ? 'B.Tech CS' : undefined,
        year: collegeId ? '1st Year' : undefined
      };
    }

    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
  }, []);

  const username = currentUser?.username || '';
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  const displayName = currentUser?.displayName || '';

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, currentUser, username, displayName, initial, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
