import style from "./Technicians.module.scss";
import { useState } from "react";
// React router
import { Link, useNavigate } from "react-router-dom";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
// API
import useGetAllTechniciansApi from "../../../API/useGetAllTechniciansApi";
// toast
import { toast } from "react-toastify";

const columns = [
  { field: "id", headerName: "ID", minWidth: 50 },
  { field: "email", headerName: "البريد الالكتروني", flex: 1, minWidth: 110 },
];

export default function Technicians() {
  const {
    data: AllTechnicians,
    fetchStatus,
    isPending,
  } = useGetAllTechniciansApi();

  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleSelectionChange = (newSelection) => {
    setSelectedRowId(newSelection[0]);
  };

  const navigate = useNavigate();
  const editBtn = () => {
    if (selectedRowId) {
      navigate(`/dashboard/edit-technician/${selectedRowId}`);
    } else {
      toast.warn("Select technician");
    }
  };

  const rows =
    AllTechnicians?.map((technician) => ({
      id: technician.id,
      email: technician.email,
    })) || [];

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {isPending && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <Stack
        sx={{ pt: 2, pb: 4, maxWidth: "617px", margin: "auto" }}
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link to={"/dashboard/add-technician"} style={{ flex: 1 }}>
          <Button sx={{ width: "100%" }} size="large" variant="outlined">
            اضافة
          </Button>
        </Link>

        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          color="secondary"
          variant="outlined"
          onClick={editBtn}
        >
          تغيير كلمة المرور
        </Button>
      </Stack>

      <div style={{ height: "calc(100vh - 202px)", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection
          disableMultipleRowSelection
          onRowSelectionModelChange={handleSelectionChange}
        />
      </div>
    </div>
  );
}
