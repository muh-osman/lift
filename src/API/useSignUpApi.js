import { useMutation } from "@tanstack/react-query";
//
import { useNavigate } from "react-router-dom";
// API base
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";
// Toastify
import { toast } from "react-toastify";

export const useSignUpApi = () => {
  //
  const navigate = useNavigate();
  // Cookies
  const [cookies, setCookie] = useCookies(["token", "role"]);

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/register", data);
      return res.data;
    },

    onSuccess: (responseData) => {
      if (responseData.user.role === 91) {
        setCookie("role", responseData.user.role);
        setCookie("token", responseData.token);
        navigate("/dashboard", { replace: true });
      } else {
        // Create new technician (role 13)
        navigate("/dashboard/technicians", { replace: true });
      }
    },

    onError: (err) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      // Toastify
      toast.error(errorMessage);
    },
  });
};
