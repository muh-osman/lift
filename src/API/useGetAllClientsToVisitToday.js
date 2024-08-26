import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllClientsToVisitToday = async () => {
  const res = await API.get(`api/customers/visit/today`);
  return res.data;
};

export default function useGetAllClientsToVisitToday() {
  return useQuery({
    queryKey: ["AllClientsToVisitToday"],
    queryFn: () => fetchAllClientsToVisitToday(),
  });
}
