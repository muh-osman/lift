import style from "./Dashboard.module.scss";
// React router
import { useNavigate } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
// API
import useGetAllCustomersToVisitAndVisitedTodayApi from "../../API/useGetAllCustomersToVisitAndVisitedTodayApi";
// toast
import { toast } from "react-toastify";

export default function Dashboard() {
  const {
    data: AllCustomersToVisitAndVisitedToday,
    fetchStatus,
    isSuccess,
    isError,
  } = useGetAllCustomersToVisitAndVisitedTodayApi();

  // useEffect(() => {
  //   if (fetchStatus === "idle" && isError === false) {
  //     if (
  //       AllCustomersToVisitAndVisitedToday.customers_to_visit_today.length === 0
  //     ) {
  //       toast.success("لا توجد زيارات مجدولة اليوم");
  //     }
  //     if (
  //       AllCustomersToVisitAndVisitedToday.customers_visited_today.length === 0
  //     ) {
  //       toast.success("لم تتم زيارة أي عميل اليوم");
  //     }
  //   }
  // }, [fetchStatus]);

  const navigate = useNavigate();

  const customersToVisitTodayHandle = (id) => {
    navigate(`/dashboard/customer-to-visit-today/${id}`);
  };

  const customersVisitedTodayHandle = (id) => {
    navigate(`/dashboard/customer-visited-today/${id}`);
  };

  const customersToVisitToday =
    AllCustomersToVisitAndVisitedToday?.customers_to_visit_today?.map(
      ({ id, name }) => (
        <Button
          key={id}
          sx={{ width: "100%", flex: 1 }}
          size="large"
          variant="outlined"
          onClick={() => customersToVisitTodayHandle(id)}
        >
          {name}
        </Button>
      )
    ) || [];

  const customersVisitedToday =
    AllCustomersToVisitAndVisitedToday?.customers_visited_today?.map(
      ({ id, name }) => (
        <Button
          key={id}
          sx={{ width: "100%", flex: 1 }}
          size="large"
          variant="contained"
          onClick={() => customersVisitedTodayHandle(id)}
        >
          {name}
        </Button>
      )
    ) || [];

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#757575",
        }}
      >
        <h2>الزيارات المجدولة لليوم</h2>
      </div>

      {fetchStatus !== "fetching" &&
        isSuccess &&
        AllCustomersToVisitAndVisitedToday.customers_to_visit_today.length ===
          0 && (
          <div style={{ textAlign: "center", color: "#757575" }}>
            لا توجد زيارات
          </div>
        )}

      <Stack
        sx={{ pt: 2, pb: 4, maxWidth: "617px", margin: "auto" }}
        spacing={3}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {customersToVisitToday}
      </Stack>

      <Divider />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#757575",
        }}
      >
        <h2>تمت الزيارة اليوم</h2>
      </div>

      {fetchStatus !== "fetching" &&
        isSuccess &&
        AllCustomersToVisitAndVisitedToday.customers_visited_today.length ===
          0 && (
          <div style={{ textAlign: "center", color: "#757575" }}>
            لا توجد زيارات
          </div>
        )}

      <Stack
        sx={{ pt: 2, pb: 4, maxWidth: "617px", margin: "auto" }}
        spacing={3}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {customersVisitedToday}
      </Stack>
    </div>
  );
}
