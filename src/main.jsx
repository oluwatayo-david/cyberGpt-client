import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashboard/Dashboard";
import ChatPage from "./routes/chat/Chat";
import RootLayout from "./routes/layout/rootLayout/rootLayout";
import DashboardLayout from "./routes/layout/dashboardLayout/dashboardLayout";
import SignInPage from "./routes/signin/SignIn";
import SignUpPage from "./routes/signup/SignUp";
import Contactpage from "./routes/contactpage/contactpage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },

      {
        path: "/contact",
        element: <Contactpage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);