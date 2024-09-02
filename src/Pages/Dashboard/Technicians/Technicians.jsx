import style from "./Technicians.module.scss";
import { useState, useEffect } from "react";
// React router
import { useNavigate } from "react-router-dom";
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
  { field: "id", headerName: "ID", width: 18, sortable: false },
  {
    field: "email",
    headerName: "البريد الالكتروني",
    flex: 1,
    minWidth: 110,
    sortable: false,
  },
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

  const addBtn = () => {
    navigate(`/dashboard/add-technician`);
  };

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

  // Responsive table
  const [containerWidth, setContainerWidth] = useState(
    window.innerWidth < 600 ? window.innerWidth - 48 : "100%"
  );

  const updateContainerWidth = () => {
    if (window.innerWidth < 600) {
      setContainerWidth(window.innerWidth - 48);
    } else {
      setContainerWidth("100%");
    }
  };

  useEffect(() => {
    // Set initial width
    updateContainerWidth();

    // Update width on window resize
    window.addEventListener("resize", updateContainerWidth);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  return (
    <div className={style.container}>
      {(fetchStatus === "fetching" || isPending) && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <Stack
        sx={{ pb: 3, maxWidth: "617px", margin: "auto" }}
        spacing={2}
        justifyContent="center"
        direction={{ xs: "column", sm: "row" }}
        alignItems="stretch"
      >
        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          variant="outlined"
          onClick={addBtn}
        >
          اضافة فني جديد
        </Button>

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

      <div
        className={style.datagrid_container}
        style={{
          width: containerWidth, // Set width dynamically
        }}
      >
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
          disableColumnFilter // Disable filtering
          disableColumnSort // Disable sorting
          disableMultipleColumnSorting // Disable multiple column sorting
          disableColumnMenu // Hide column menu
          onRowSelectionModelChange={handleSelectionChange}
          style={{ width: "100%", height: "100%", overflowX: "auto" }}
        />
      </div>
    </div>
  );
}
