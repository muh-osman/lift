import { Outlet, Navigate } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";

export default function OnlyTechnicians() {
  const [cookies, setCookie] = useCookies(["token", "role"]);

  // console.log(cookies.token);

  return !cookies.token ? (
    <Navigate to="/login" />
  ) : cookies.role === 91 ? (
    <Navigate to="dashboard" />
  ) : (
    <Outlet />
  );
}
