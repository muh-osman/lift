import style from "./Expirations.module.scss";
import { useState, useEffect } from "react";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
// API
import useGetAlmostExpiredContractsApi from "../../../API/useGetAlmostExpiredContractsApi";
import useGetExpiredContractsApi from "../../../API/useGetExpiredContractsApi";

export default function Expirations() {
  const {
    data: almostExpiredContracts,
    fetchStatus: fetchAlmostExpiredContractsStatus,
  } = useGetAlmostExpiredContractsApi();

  const { data: expiredContracts, fetchStatus: fetchExpiredContractsStatus } =
    useGetExpiredContractsApi();

  const [data, setData] = useState([]);
  const [activeButton, setActiveButton] = useState("almostExpired");

  // Update data based on the active button
  useEffect(() => {
    if (activeButton === "almostExpired") {
      setData(almostExpiredContracts);
    } else {
      setData(expiredContracts);
    }
  }, [activeButton, almostExpiredContracts, expiredContracts]);

  const rows =
    data?.map((client) => ({
      id: client.id,
      name: client.name,
      phone_number: client.phone_number,
      neighborhood: client.neighborhood,
      maintenance_type: client.maintenance_type,
      service_type: client.service_type,
      contract_start_date: client.contract_start_date,
      contract_end_date: client.contract_end_date,
    })) || [];

  const almostExpiredContractBtn = () => {
    setActiveButton("almostExpired");
  };

  const expiredContractBtn = () => {
    setActiveButton("expired");
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 25,
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
      field: "maintenance_type",
      headerName: "الصيانة",
      flex: 1,
      minWidth: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "service_type",
      headerName: "نوع الخدمة",
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
      renderCell: (params) => {
        const backgroundColor =
          activeButton === "almostExpired" ? "#ed6c02" : "#d32f2f";
        return (
          <div
            style={{
              backgroundColor,
              color: "#fff",
            }}
          >
            {params.value}
          </div>
        );
      },
    },
  ];

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
      {(fetchAlmostExpiredContractsStatus === "fetching" ||
        fetchExpiredContractsStatus === "fetching") && (
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
          variant={activeButton === "almostExpired" ? "contained" : "outlined"}
          color="warning"
          onClick={almostExpiredContractBtn}
        >
          شارفت على الانتهاء
        </Button>

        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          color="error"
          variant={activeButton === "expired" ? "contained" : "outlined"}
          onClick={expiredContractBtn}
        >
          عقود منتهية
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
