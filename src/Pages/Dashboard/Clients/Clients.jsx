import style from "./Clients.module.scss";
import { useState, useEffect } from "react";
// React router
import { Link, useNavigate } from "react-router-dom";
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
  { field: "id", headerName: "ID", flex: 1, minWidth: 50 },
  { field: "name", headerName: "اسم العميل", flex: 1, minWidth: 175 },
  { field: "phone_number", headerName: "رقم الهاتف", flex: 1, minWidth: 110 },
  { field: "neighborhood", headerName: "الحي", flex: 1, minWidth: 100 },
  { field: "maintenance_type", headerName: "الصيانة", flex: 1, minWidth: 100 },
  { field: "spare_parts", headerName: "قطع الغيار", flex: 1, minWidth: 100 },
  { field: "service_type", headerName: "نوع الخدمة", flex: 1, minWidth: 100 },
  { field: "contract_start_date", headerName: "بداية العقد", flex: 1, minWidth: 125 },
  { field: "contract_end_date", headerName: "نهاية العقد", flex: 1, minWidth: 125 },
  { field: "maintenance_value", headerName: "قيمة الصيانة", flex: 1, minWidth: 100 },
  { field: "paid", headerName: "مدفوع", flex: 1, minWidth: 100 },
  { field: "unpaid", headerName: "غير مدفوع", flex: 1, minWidth: 100 },
  { field: "notes", headerName: "ملاحظات", flex: 1, minWidth: 275 },
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
        <Link to={"/dashboard/add-client"} style={{ flex: 1 }}>
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
