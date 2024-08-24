import { Outlet, Navigate } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";

export default function NotAuth() {
  const [cookies, setCookie] = useCookies(["token", "role"]);

  // console.log(cookies.token);

  return !cookies.role ? (
    <Outlet />
  ) : cookies.role === 91 ? (
    <Navigate to="dashboard" />
  ) : (
    <Navigate to="/" />
  );
}
