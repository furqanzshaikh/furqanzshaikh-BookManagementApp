import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Book from "./components/books/Book";
import SingleBook from "./components/singleBook/SingleBook";
import EditBook from "./components/edit/EditBook";
import Login from "./components/login/Login";
import NotFound from "./NotFound";
import { Provider, useSelector } from "react-redux"; // Import useSelector to access isAuthenticated state
import store from "./redux/store";
import NavBar from "./components/navbar/Navbar";
import AddBook from "./components/addBook/AddBook";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

const Layout = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated); // Get isAuthenticated from Redux state
  return (
    <>
      {isAuthenticated && <NavBar />} {/* Render NavBar only if user is authenticated */}
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "books/:id",
        element: <ProtectedRoute><SingleBook /></ProtectedRoute>
      },
      { path: "/", element: <Login /> },
      {
        path: "/addbook",
        element: <ProtectedRoute><AddBook /></ProtectedRoute>
      },
      {
        path: "/books/edit/:id",
        element: <ProtectedRoute><EditBook /></ProtectedRoute>
      },
      {
        path: "/books", element: <ProtectedRoute>
          <Book />
        </ProtectedRoute>
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
