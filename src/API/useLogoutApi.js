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
      return res.data;
    },

    onSuccess: () => {
      removeCookie("role", { path: "/" });
      removeCookie("token", { path: "/" });
      qc.clear();

      navigate("/login", { replace: true });
    },

    onError: (err) => {
      qc.clear();
      console.error(err);
      removeCookie("role", { path: "/" });
      removeCookie("token", { path: "/" });

      navigate("/login", { replace: true });
    },
  });
};
