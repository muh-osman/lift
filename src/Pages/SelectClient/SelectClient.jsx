import style from "./SelectClient.module.scss";
// React
import { useNavigate } from "react-router-dom";
// MUI
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LinearProgress from "@mui/material/LinearProgress";
// API
import useGetNameAndIdAllClientsApi from "../../API/useGetNameAndIdAllClientsApi";

export default function SelectClient() {
  const { data, isSuccess, fetchStatus } = useGetNameAndIdAllClientsApi();

  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    if (newValue) {
      const dataToSend = { maintenance: "عطل" };
      navigate(`/add-visit/${newValue.id}?maintenance=damage`);
    }
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
          color: "#757575",
        }}
      >
        <h2>زيارة صيانة غير مجدولة</h2>
      </div>

      <Autocomplete
        disablePortal
        options={isSuccess ? data : []} // Assuming data is an array of client objects
        getOptionLabel={(option) => option.name} // Assuming each client object has a 'name' property
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} label="بحث" />}
        sx={{
          width: {
            xs: 300,
            md: 500,
          },
          margin: "auto",
          marginTop: "16px",
          backgroundColor: "#fff",
        }}
      />
    </div>
  );
}
