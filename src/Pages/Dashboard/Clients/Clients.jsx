import style from "./Clients.module.scss";
import { useState, useEffect } from "react";
// React router
import { useNavigate } from "react-router-dom";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
// API
import useGetAllClientsApi from "../../../API/useGetAllClientsApi";
import { useDeleteClientApi } from "../../../API/useDeleteClientApi";
// toast
import { toast } from "react-toastify";

const columns = [
  { field: "id", headerName: "ID", flex: 1, minWidth: 50, sortable: false },
  {
    field: "name",
    headerName: "اسم العميل",
    flex: 1,
    minWidth: 175,
    sortable: false,
  },
  {
    field: "phone_number",
    headerName: "رقم الهاتف",
    flex: 1,
    minWidth: 110,
    sortable: false,
  },
  {
    field: "neighborhood",
    headerName: "الحي",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "maintenance_type",
    headerName: "الصيانة",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "spare_parts",
    headerName: "قطع الغيار",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "service_type",
    headerName: "نوع الخدمة",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "contract_start_date",
    headerName: "بداية العقد",
    flex: 1,
    minWidth: 125,
    sortable: false,
  },
  {
    field: "contract_end_date",
    headerName: "نهاية العقد",
    flex: 1,
    minWidth: 125,
    sortable: false,
  },
  {
    field: "maintenance_value",
    headerName: "قيمة الصيانة",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "paid",
    headerName: "مدفوع",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "unpaid",
    headerName: "غير مدفوع",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "notes",
    headerName: "ملاحظات",
    flex: 1,
    minWidth: 275,
    sortable: false,
  },
];

export default function Clients() {
  const { data: AllClients, fetchStatus } = useGetAllClientsApi();
  const {
    mutate,
    isPending,
    isSuccess: isDeleteSuccess,
  } = useDeleteClientApi();

  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleSelectionChange = (newSelection) => {
    setSelectedRowId(newSelection[0]);
  };

  const navigate = useNavigate();
  const addBtn = () => {
    navigate(`/dashboard/add-client`);
  };

  const editBtn = () => {
    if (selectedRowId) {
      navigate(`/dashboard/edit-client/${selectedRowId}`);
    } else {
      toast.warn("Select client");
    }
  };

  const deleteBtn = () => {
    if (selectedRowId) {
      const confirmDelete = window.confirm("هل تريد بالتأكيد حذف العميل؟");
      if (confirmDelete) {
        mutate(selectedRowId);
      }
    } else {
      toast.warn("Select client");
    }
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Deleted successfully.");
      setSelectedRowId(null);
    }
  }, [isDeleteSuccess]);

  const rows =
    AllClients?.map((client) => ({
      id: client.id,
      name: client.name,
      phone_number: client.phone_number,
      neighborhood: client.neighborhood,
      maintenance_type: client.maintenance_type,
      spare_parts: client.spare_parts,
      service_type: client.service_type,
      contract_start_date: client.contract_start_date,
      contract_end_date: client.contract_end_date,
      maintenance_value: Math.floor(client.maintenance_value),
      paid: Math.floor(client.paid),
      unpaid: Math.floor(client.unpaid),
      notes: client.notes,
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
          اضافة
        </Button>

        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          color="secondary"
          variant="outlined"
          onClick={editBtn}
        >
          تعديل
        </Button>

        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          color="error"
          variant="outlined"
          onClick={deleteBtn}
        >
          حذف
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
