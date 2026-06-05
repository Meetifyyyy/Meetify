import { createContext, useContext, useState, useEffect } from 'react';

const FollowContext = createContext(null);

export function FollowProvider({ children }) {
  const [following, setFollowing] = useState(() => {
    try {
      const stored = localStorage.getItem('following');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('following', JSON.stringify(following));
  }, [following]);

  const isFollowing = (username) => {
    return following.includes(username);
  };

  const toggleFollow = (username) => {
    setFollowing((prev) => {
      if (prev.includes(username)) {
        return prev.filter((u) => u !== username);
      } else {
        return [...prev, username];
      }
    });
  };

  return (
    <FollowContext.Provider value={{ following, isFollowing, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error('useFollow must be used within FollowProvider');
  return ctx;
}
