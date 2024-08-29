import style from "./Home.module.scss";
import { useEffect } from "react";
// React router
import { useNavigate } from "react-router-dom";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { Divider } from "@mui/material";
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
    isPending,
    isSuccess,
  } = useGetAllClientsToVisitToday();

  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.role === 91) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      if (allClientsToVisitToday.length === 0 && cookies.role === 13) {
        toast.success("لا يوجد زيارات مجدولة اليوم");
      }
    }
  }, [isSuccess]);

  const scheduledVisitBtn = (id) => {
    navigate(`/add-visit/${id}`);
  };

  const unscheduledVisitBtn = () => {
    navigate(`/select-client`);
  };

  const rowsBtns =
    allClientsToVisitToday?.map(({ id, name }) => (
      <Button
        key={id}
        sx={{ width: "100%", flex: 1 }}
        size="large"
        variant="contained"
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

          <Stack
            sx={{ pt: 1, pb: 4, maxWidth: "617px", margin: "auto" }}
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              sx={{ width: "100%", flex: 1 }}
              size="large"
              color="secondary"
              variant="outlined"
              onClick={unscheduledVisitBtn}
            >
              زيارة غير مجدول
            </Button>
          </Stack>

          <Divider />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2 style={{ marginTop: "37px" }}>الزيارات المجدولة اليوم</h2>
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
