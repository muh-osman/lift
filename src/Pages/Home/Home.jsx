import style from "./Home.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
// Cookies
import { useCookies } from "react-cookie";
// API
import useGetAllClientsToVisitToday from "../../API/useGetAllClientsToVisitToday";
// toast
import { toast } from "react-toastify";

export default function Home() {
  // Cookies
  const [cookies, setCookie] = useCookies(["token", "role"]);

  const {
    data: allClientsToVisitToday,
    fetchStatus,
    isError,
  } = useGetAllClientsToVisitToday();

  useEffect(() => {
    if (fetchStatus === "idle" && isError === false) {
      if (allClientsToVisitToday.length === 0 && cookies.role === 13) {
        toast.success("لا يوجد زيارات مجدولة لليوم");
      }
    }
  }, [fetchStatus]);

  const navigate = useNavigate();
  const scheduledVisitBtn = (id) => {
    const dataToSend = { maintenance: "صيانة دورية" };
    navigate(`/add-visit/${id}`, { state: dataToSend });
  };

  const rowsBtns =
    allClientsToVisitToday?.map(({ id, name }) => (
      <Button
        key={id}
        sx={{ width: "100%", flex: 1 }}
        size="large"
        variant="outlined"
        onClick={() => scheduledVisitBtn(id)}
      >
        {name}
      </Button>
    )) || [];

  return (
    <>
      {cookies.token && cookies.role === 13 ? (
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
            }}
          >
            <h2>الزيارات المجدولة لليوم</h2>
          </div>

          <Stack
            sx={{ pt: 2, pb: 4, maxWidth: "617px", margin: "auto" }}
            spacing={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            {rowsBtns}
          </Stack>
        </div>
      ) : (
        <div className={style.container}></div>
      )}
    </>
  );
}
