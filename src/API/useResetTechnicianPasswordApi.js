import { useMutation } from "@tanstack/react-query";
//
import { useNavigate } from "react-router-dom";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useResetTechnicianPasswordApi = () => {
  //
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/reset/technician/password", data);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Password have been reset.");

        navigate("/dashboard/technicians", { replace: true });
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
