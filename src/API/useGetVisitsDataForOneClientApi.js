import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchVisitsDataForOneClient = async (id) => {
  const res = await API.get(`api/customers/${id}/visits`);
  return res.data;
};

export default function useGetVisitsDataForOneClientApi() {
  let { id } = useParams();

  return useQuery({
    queryKey: ["visitsDataForOneClient", id],
    queryFn: () => fetchVisitsDataForOneClient(id),
  });
}
