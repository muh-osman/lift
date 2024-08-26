import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// API base
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";

export const useLogoutApi = () => {
  const navigate = useNavigate();

  const qc = useQueryClient();
  // Cookies
  const [cookies, setCookie, removeCookie] = useCookies(["token", "role"]);


  return useMutation({
    mutationFn: async () => {
      const res = await API.post("api/logout");
      removeCookie("role");
      removeCookie("token");
      return res.data;
    },

    onSuccess: () => {
      removeCookie("role");
      removeCookie("token");
      qc.clear();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    },

    onError: (err) => {
      qc.clear();
      console.error(err);
      removeCookie("role");
      removeCookie("token");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    },
  });
};
