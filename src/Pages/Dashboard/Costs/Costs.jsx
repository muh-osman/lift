import style from "./Costs.module.scss";
import { useState, useEffect } from "react";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
// API
import useGetAllClientsApi from "../../../API/useGetAllClientsApi";

const columns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 50,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "name",
    headerName: "اسم العميل",
    flex: 1,
    minWidth: 175,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "phone_number",
    headerName: "رقم الهاتف",
    flex: 1,
    minWidth: 110,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "neighborhood",
    headerName: "الحي",
    flex: 1,
    minWidth: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "contract_start_date",
    headerName: "بداية العقد",
    flex: 1,
    minWidth: 125,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "contract_end_date",
    headerName: "نهاية العقد",
    flex: 1,
    minWidth: 125,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "maintenance_value",
    headerName: "قيمة الصيانة",
    flex: 1,
    minWidth: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div
        style={{
          backgroundColor: "#2e7d32",
          color: "#fff",
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "paid",
    headerName: "مدفوع",
    flex: 1,
    minWidth: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div
        style={{
          backgroundColor: "#2e7d32",
          color: "#fff",
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "unpaid",
    headerName: "غير مدفوع",
    flex: 1,
    minWidth: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div
        style={{
          backgroundColor: params.value > 0 ? "#d32f2f" : "#2e7d32",
          color: "#fff",
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "notes",
    headerName: "ملاحظات",
    flex: 1,
    minWidth: 275,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return params.value ? (
        params.value
      ) : (
        <div style={{ color: "#757575" }}>لا توجد ملاحظات</div>
      );
    },
  },
];

export default function Clients() {
  const { data: AllClients, fetchStatus } = useGetAllClientsApi();

  const rows =
    AllClients?.map((client) => ({
      id: client?.id,
      name: client?.name,
      phone_number: client?.phone_number,
      neighborhood: client?.neighborhood,
      contract_start_date: client?.contract_start_date,
      contract_end_date: client?.contract_end_date,
      maintenance_value: Math.floor(client?.maintenance_value),
      paid: Math.floor(client?.paid),
      unpaid: Math.floor(client?.unpaid),
      notes: client?.notes,
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
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

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
          checkboxSelection={false}
          disableMultipleRowSelection
          disableColumnFilter // Disable filtering
          disableColumnSort // Disable sorting
          disableMultipleColumnSorting // Disable multiple column sorting
          disableColumnMenu // Hide column menu
          style={{ width: "100%", height: "100%", overflowX: "auto" }}
        />
      </div>
    </div>
  );
}
