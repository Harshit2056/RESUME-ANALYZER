import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/Interview.jsx";
import ForgotPassword from "./features/auth/pages/ForgotPassword.jsx";
import ResetPassword from "./features/auth/pages/ResetPassword.jsx";


export const router = createBrowserRouter([
  {
  path: "/",
  element:<Protected><Home/></Protected>
  },
  {
    path: "/login",
    element:<Login />
  },
  {
    path: "/register",
    element:<Register/>
  },
  {
    path:"/interview/:interviewId",
    element:<Protected><Interview/></Protected>
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  { 
    path: "/reset-password/:token",
    element: <ResetPassword />
  }
]);