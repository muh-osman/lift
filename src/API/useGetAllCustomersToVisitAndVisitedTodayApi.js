import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllCustomersToVisitAndVisitedToday = async () => {
  const res = await API.get(`api/customers/visit/today/and/visited/today`);
  return res.data;
};

export default function useGetAllCustomersToVisitAndVisitedTodayApi() {
  return useQuery({
    queryKey: ["allCustomersToVisitAndVisitedToday"],
    queryFn: () => fetchAllCustomersToVisitAndVisitedToday(),
  });
}
