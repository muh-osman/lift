import style from "./EditClient.module.scss";
// React
import { useEffect, useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LinearProgress from "@mui/material/LinearProgress";
import dayjs from "dayjs";
// toast
import { toast } from "react-toastify";
// Api
import useGetOneClientDataApi from "../../../API/useGetOneClientDataApi";
import { useEditClientApi } from "../../../API/useEditClientApi";

export default function EditClient() {
  const addFormRef = useRef();

  const {
    data: client,
    fetchStatus,
    isSuccess,
    isPending: isFetchCientPending,
  } = useGetOneClientDataApi();
  const { mutate, isPending } = useEditClientApi();

  const [clientData, setClientData] = useState({
    name: "",
    phone_number: "",
    neighborhood: "",
    maintenance_type: "",
    spare_parts: "",
    service_type: "",
    contract_start_date: "",
    contract_end_date: "",
    maintenance_value: "",
    paid: "",
    notes: "",
  });

  // State for the date pickers
  const [contractStartDate, setContractStartDate] = useState(null);
  const [contractEndDate, setContractEndDate] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      setClientData(client);
      setContractStartDate(
        client.contract_start_date ? dayjs(client.contract_start_date) : null
      );
      setContractEndDate(
        client.contract_end_date ? dayjs(client.contract_end_date) : null
      );
    }
  }, [isSuccess, client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = addFormRef.current.reportValidity();
    if (!validate) return;

    let formData = new FormData(addFormRef.current);

    // Date validation
    if (contractEndDate && contractStartDate) {
      const startDate = new Date(contractStartDate);
      const endDate = new Date(contractEndDate);

      if (endDate <= startDate) {
        toast.warn("تاريخ نهاية العقد يجب أن يكون بعد تاريخ بداية العقد");
        return;
      }
    }

    const paid = parseFloat(formData.get("paid"));
    const maintenanceValue = parseFloat(formData.get("maintenance_value"));

    if (paid > maintenanceValue) {
      toast.warn("المبلغ المدفوع أكبر من قيمة الصيانة");
      return;
    }

    // Use dayjs to format the dates
    const formattedStartDate = contractStartDate
      ? contractStartDate.format("YYYY-MM-DD")
      : null;
    const formattedEndDate = contractEndDate
      ? contractEndDate.format("YYYY-MM-DD")
      : null;

    formData.append("contract_start_date", formattedStartDate);
    formData.append("contract_end_date", formattedEndDate);

    mutate(formData);
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <div className={style.title}>
        <h1>تعديل عميل</h1>
      </div>
      <Box
        ref={addFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الأسم"
              type="text"
              name="name"
              required
              disabled={isPending || isFetchCientPending}
              value={clientData.name}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              dir="ltr"
              fullWidth
              label="رقم الهاتف"
              type="tel"
              name="phone_number"
              required
              disabled={isPending || isFetchCientPending}
              value={clientData.phone_number}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الحي"
              type="text"
              name="neighborhood"
              required
              disabled={isPending || isFetchCientPending}
              value={clientData.neighborhood}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              select
              fullWidth
              required
              label="الصيانة"
              name="maintenance_type"
              value={clientData.maintenance_type}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              <MenuItem dir="rtl" value={"شهري"}>
                شهري
              </MenuItem>
              <MenuItem dir="rtl" value={"شهرين"}>
                شهرين
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              select
              fullWidth
              required
              label="قطع الغيار"
              name="spare_parts"
              value={clientData.spare_parts}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              <MenuItem dir="rtl" value={"شامل"}>
                شامل
              </MenuItem>
              <MenuItem dir="rtl" value={"غير شامل"}>
                غير شامل
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              select
              fullWidth
              required
              label="نوع الخدمة"
              name="service_type"
              value={clientData.service_type}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              <MenuItem dir="rtl" value={"عقد"}>
                عقد
              </MenuItem>
              <MenuItem dir="rtl" value={"سنتين"}>
                سنتين
              </MenuItem>
            </TextField>
          </Grid>

          <Grid
            item
            xs={12}
            container
            dir="rtl"
            justifyContent="space-between"
            margin={0}
          >
            <Grid item xs={12} sm={6} className={style.start_contract_box}>
              <DatePicker
                sx={{ width: "100%" }}
                label="بداية العقد *"
                views={["year", "month", "day"]}
                format="DD/MM/YYYY"
                value={contractStartDate}
                onChange={(newValue) => setContractStartDate(newValue)}
                disabled={isPending || isFetchCientPending}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} className={style.end_contract_box}>
              <DatePicker
                sx={{ width: "100%" }}
                label="نهاية العقد *"
                views={["year", "month", "day"]}
                format="DD/MM/YYYY"
                value={contractEndDate}
                onChange={(newValue) => setContractEndDate(newValue)}
                disabled={isPending || isFetchCientPending}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="قيمة الصيانة"
              type="number"
              name="maintenance_value"
              required
              disabled={isPending || isFetchCientPending}
              value={
                clientData.maintenance_value
                  ? Math.floor(clientData.maintenance_value)
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="مدفوع"
              type="number"
              name="paid"
              required
              disabled={isPending || isFetchCientPending}
              value={clientData.paid ? Math.floor(clientData.paid) : ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ملاحظات (اختياري)"
              type="text"
              name="notes"
              disabled={isPending || isFetchCientPending}
              value={clientData.notes}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          disabled={isFetchCientPending}
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          تعديل
        </LoadingButton>
      </Box>
    </div>
  );
}
