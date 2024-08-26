import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllTechnicians = async () => {
  const res = await API.get(`api/user/role/technician`);
  return res.data;
};

export default function useGetAllTechniciansApi() {
  return useQuery({
    queryKey: ["AllTechnicians"],
    queryFn: () => fetchAllTechnicians(),
  });
}
