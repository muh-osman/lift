import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchNameAndIdAllClients = async () => {
  const res = await API.get(`api/customers/ids/names`);
  return res.data;
};

export default function useGetNameAndIdAllClientsApi() {
  return useQuery({
    queryKey: ["AllNameAndIdClients"],
    queryFn: () => fetchNameAndIdAllClients(),
  });
}
