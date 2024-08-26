import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useEditClientApi = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post(`api/customers/${id}`, formData);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Updated successfully.");
      navigate("/dashboard/clients");
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
