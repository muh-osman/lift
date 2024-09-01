import style from "./SelectClient.module.scss";
// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
// API
import useGetNameAndIdAllClientsApi from "../../API/useGetNameAndIdAllClientsApi";

export default function SelectClient() {
  const [selectedClientId, setSelectedClientId] = useState("");

  const { data, isSuccess, isPending, fetchStatus } =
    useGetNameAndIdAllClientsApi();

  const navigate = useNavigate();
  const handleChange = (e) => {
    setSelectedClientId(e.target.value);
    const dataToSend = { maintenance: "عطل" };
    navigate(`/add-visit/${e.target.value}`, { state: dataToSend });
  };

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
        }}
      >
        <h2>زيارة صيانة غير مجدولة</h2>
      </div>

      <Box
        component="form"
        noValidate
        sx={{
          mt: 3,
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              dir="rtl"
              required
              fullWidth
              select
              label="اختر عميل"
              value={selectedClientId}
              onChange={handleChange}
              disabled={isPending}
            >
              {data === undefined && (
                <MenuItem value="">
                  <em>Loading...</em>
                </MenuItem>
              )}

              {data?.length === 0 && (
                <MenuItem value="">
                  <em>No country to show.</em>
                </MenuItem>
              )}

              {data !== undefined &&
                data?.length !== 0 &&
                data.map((client) => (
                  <MenuItem dir="rtl" key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
