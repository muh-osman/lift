import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAlmostExpiredContracts = async () => {
  const res = await API.get(`api/customers/almost/expiring/contracts`);
  return res.data;
};

export default function useGetAlmostExpiredContractsApi() {
  return useQuery({
    queryKey: ["almostExpiredContracts"],
    queryFn: () => fetchAlmostExpiredContracts(),
  });
}
