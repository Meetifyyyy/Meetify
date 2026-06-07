import { createBrowserRouter, RouterProvider, Navigate, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardLayoutWrapper from './pages/DashboardLayoutWrapper';
import FeedRoute from './pages/FeedRoute';
import CommunitiesRoute from './pages/CommunitiesRoute';
import CommunityDetailRoute from './pages/CommunityDetailRoute';
import PostDetailRoute from './pages/PostDetailRoute';
import MessagesRoute from './pages/MessagesRoute';
import ProfilePage from './pages/ProfilePage';
import CollegesRoute from './pages/CollegesRoute';
import CollegeDetailRoute from './pages/CollegeDetailRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

import SearchResultsRoute from './pages/SearchResultsRoute';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/home" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <ScrollRestoration />
        <Outlet />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ),
      },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayoutWrapper />
          </ProtectedRoute>
        ),
        children: [
          { path: "/home", element: <FeedRoute /> },
          { path: "/search", element: <SearchResultsRoute /> },
          { path: "/communities", element: <CommunitiesRoute /> },
          { path: "/communities/:id", element: <CommunityDetailRoute /> },
          { path: "/colleges", element: <CollegesRoute /> },
          { path: "/colleges/:id", element: <CollegeDetailRoute /> },
          { path: "/messages/:conversationId?", element: <MessagesRoute /> },
          { path: "/post/:id", element: <PostDetailRoute /> },
          { path: "/profile/:profileUsername?", element: <ProfilePage /> },
        ]
      },
      { path: "*", element: <Navigate to="/" replace /> }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
