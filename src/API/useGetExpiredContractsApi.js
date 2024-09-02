import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchExpiredContracts = async () => {
  const res = await API.get(`api/customers/expired/contracts`);
  return res.data;
};

export default function useGetExpiredContractsApi() {
  return useQuery({
    queryKey: ["expiredContracts"],
    queryFn: () => fetchExpiredContracts(),
  });
}
