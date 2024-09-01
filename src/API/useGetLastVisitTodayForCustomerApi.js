import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchGetLastVisitTodayForCustomerApi = async (id) => {
  const res = await API.get(`api/last/visit/for/customer/${id}/today`);
  return res.data;
};

export default function useGetLastVisitTodayForCustomerApi() {
  let { id } = useParams();

  return useQuery({
    queryKey: ["lastVisitTodayForCustomer", id],
    queryFn: () => fetchGetLastVisitTodayForCustomerApi(id),
  });
}
