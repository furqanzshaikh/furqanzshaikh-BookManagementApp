// src/index.js
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider, useSelector } from "react-redux"; 
import store from "./redux/store";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Login from './routes/login/Login';
import ProtectedRoute from './routes/protectedRoute/ProtectedRoute';
import SignUp from "./routes/signup/SignUp";
import SingleBook from './routes/singleBook/SingleBook';
import AddBook from './routes/addBook/AddBook';
import EditBook from './routes/edit/EditBook';
import Book from './routes/books/Book';
import NotFound from '../src/NotFound';
import MatchMaking from "./routes/matchMaking/MatchMaking";

// Layout component that conditionally renders Navbar based on the route
const Layout = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // Only render Navbar if user is authenticated and not on Login or SignUp page
  const showNavbar = isAuthenticated && !['/', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/register",
    element: <SignUp />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "books/:id",
        element: <ProtectedRoute><SingleBook /></ProtectedRoute>
      },
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/addbook",
        element: <ProtectedRoute><AddBook /></ProtectedRoute>
      },
      {
        path: "/books/edit/:id",
        element: <ProtectedRoute><EditBook /></ProtectedRoute>
      },
      {
        path: "/books",
        element: <ProtectedRoute><Book /></ProtectedRoute>
      },
      {
        path: "/matchmaking",
        element: <ProtectedRoute><MatchMaking /></ProtectedRoute>
      },
      {
        path: "*",
        element: <NotFound />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
