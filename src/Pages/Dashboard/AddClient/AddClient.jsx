import style from "./AddClient.module.scss";
// React
import { useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// Api
import { useAddClientApi } from "../../../API/useAddClientApi";

export default function AddClient() {
  const addFormRef = useRef();
  // State for the date pickers
  const [contractStartDate, setContractStartDate] = useState(null);
  const [contractEndDate, setContractEndDate] = useState(null);

  const { mutate, isPending } = useAddClientApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = addFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data

    const formData = new FormData(addFormRef.current);

    const formattedStartDate = new Date(contractStartDate)
      .toISOString()
      .split("T")[0]; // "YYYY-MM-DD"
    const formattedEndDate = new Date(contractEndDate)
      .toISOString()
      .split("T")[0]; // "YYYY-MM-DD"

    formData.append("contract_start_date", formattedStartDate);
    formData.append("contract_end_date", formattedEndDate);

    // Access individual fields
    // const name = formData.get("name");
    // const phoneNumber = formData.get("phone_number");
    // const neighborhood = formData.get("neighborhood");
    // const maintenanceType = formData.get("maintenance_type");
    // const spareParts = formData.get("spare_parts");
    // const serviceType = formData.get("service_type");
    // const startDate = formData.get("contract_start_date");
    // const endDate = formData.get("contract_end_date");
    // const maintenanceValue = formData.get("maintenance_value");
    // const paid = formData.get("paid");
    // const notes = formData.get("notes");

    // console.log(name);
    // console.log(phoneNumber);
    // console.log(neighborhood);
    // console.log(maintenanceType);
    // console.log(spareParts);
    // console.log(serviceType);
    // console.log(startDate);
    // console.log(endDate);
    // console.log(maintenanceValue);
    // console.log(paid);
    // console.log(notes);

    mutate(formData);
  };

  return (
    <div className={style.container}>
      <div className={style.title}>
        <h1>اضافة عميل</h1>
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
              disabled={isPending}
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
              disabled={isPending}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الحي"
              type="text"
              name="neighborhood"
              required
              disabled={isPending}
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
              defaultValue=""
              disabled={isPending}
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
              defaultValue=""
              disabled={isPending}
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
              defaultValue=""
              disabled={isPending}
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
            spacing={3}
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
                disabled={isPending}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
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
                disabled={isPending}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
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
              disabled={isPending}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="مدفوع"
              type="number"
              name="paid"
              required
              disabled={isPending}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ملاحظات (اختياري)"
              type="text"
              name="notes"
              disabled={isPending}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          اضافة
        </LoadingButton>
      </Box>
    </div>
  );
}
