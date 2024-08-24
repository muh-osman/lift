import { Outlet, Navigate } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";

export default function Auth() {
  const [cookies, setCookie] = useCookies(["token", "role"]);

  // console.log(cookies.token);


  return cookies.token && cookies.role === 91 ? <Outlet /> : <Navigate to="login" />;
}
