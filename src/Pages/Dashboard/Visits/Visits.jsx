import style from "./Visits.module.scss";
import { useState, useEffect } from "react";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// Toast
import { toast } from "react-toastify";
// API
import useGetVisitsDataForOneClientApi from "../../../API/useGetVisitsDataForOneClientApi";

export default function Clients() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage("");
  };

  const {
    data: allVisits,
    fetchStatus,
    isError,
  } = useGetVisitsDataForOneClientApi();

  useEffect(() => {
    if (fetchStatus === "idle" && !isError) {
      if (allVisits?.length === 0) {
        toast.success("لا توجد زيارات لهذا العميل بعد");
      }
    }
  }, [fetchStatus]);

  // Function to format the date
  const formatDateAR = (isoDate) => {
    const date = new Date(isoDate);

    // Extract the components of the date
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad
    const year = date.getFullYear(); // Get full year

    // Extract the time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad with zero if needed
    const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM/PM

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12"; // Convert hour to 12-hour format and pad

    // Construct the formatted date string
    return `${day}-${month}-${year} at ${hours}:${minutes} ${ampm}`;
  };

  const rows =
    allVisits?.map((visit) => ({
      id: visit?.id,
      user_email: visit?.user_email, // الفني
      maintenance_type: visit?.maintenance_type,
      comments: visit?.comments,
      image: visit?.image,
      created_at: formatDateAR(visit?.created_at),
    })) || [];

  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 50, sortable: false },
    {
      field: "maintenance_type",
      headerName: "نوع الزيارة",
      flex: 1,
      minWidth: 110,
      sortable: false,
    },
    {
      field: "created_at",
      headerName: "تاريخ الزيارة",
      flex: 1,
      minWidth: 175,
      sortable: false,
      renderCell: (params) => (
        <div style={{ direction: "ltr", textAlign: "left" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "user_email",
      headerName: "الفني",
      flex: 1,
      minWidth: 175,
      sortable: false,
    },
    {
      field: "comments",
      headerName: "ملاحظات",
      flex: 1,
      minWidth: 175,
      sortable: false,
    },
    {
      field: "image",
      headerName: "صورة",
      flex: 1,
      minWidth: 125,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params.value;

        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Visit"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100px",
              objectFit: "contain",
              cursor: "pointer",
            }}
            onClick={() => handleImageClick(imageUrl)} // Handle click to open modal
          />
        ) : (
          <div style={{ textAlign: "center", color: "#757575" }}>No Image</div>
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
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <div>
        <h2
          style={{
            color: "#757575",
            textAlign: "right",
            marginTop: 0,
            height: "36px",
          }}
        >
          {allVisits?.[0]?.customer_name}
        </h2>
      </div>

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

      {/* Modal for displaying the image */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Image
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: "100%", height: "auto" }} // Adjust styles as needed
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
