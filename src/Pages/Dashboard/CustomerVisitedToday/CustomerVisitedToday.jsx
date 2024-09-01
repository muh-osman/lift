import style from "./CustomerVisitedToday.module.scss";
// React
import { useRef } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from "@mui/material/LinearProgress";
import { Divider } from "@mui/material";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// Api
import useGetOneClientDataApi from "../../../API/useGetOneClientDataApi";
import useGetLastVisitTodayForCustomerApi from "../../../API/useGetLastVisitTodayForCustomerApi";

export default function AddVisit() {
  const {
    data: client,
    fetchStatus,
    isPending: isFetchCientPending,
  } = useGetOneClientDataApi();

  const {
    data: visit,
    fetchStatus: fetchVisitStatus,
    isPending: isFetchVisitPending,
  } = useGetLastVisitTodayForCustomerApi();

  return (
    <div className={style.container}>
      {(fetchStatus === "fetching" || fetchVisitStatus === "fetching") && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <div className={style.table_container} dir="rtl">
        <table>
          <tbody>
            <tr>
              <td>اسم العميل:</td>
              <td>{client?.name}</td>
            </tr>

            <tr>
              <td>رقم الهاتف:</td>
              <td>{client?.phone_number}</td>
            </tr>

            <tr>
              <td>الحي:</td>
              <td>{client?.neighborhood}</td>
            </tr>

            <tr>
              <td>الصيانة:</td>
              <td>{client?.maintenance_type}</td>
            </tr>

            <tr>
              <td>قطع الغيار:</td>
              <td>{client?.spare_parts}</td>
            </tr>

            <tr>
              <td>نوع الخدمة:</td>
              <td>{client?.service_type}</td>
            </tr>

            <tr>
              <td>بداية العقد:</td>
              <td>{client?.contract_start_date}</td>
            </tr>

            <tr>
              <td>نهاية العقد:</td>
              <td>{client?.contract_end_date}</td>
            </tr>

            <tr>
              <td>قيمة الصيانة:</td>
              <td>
                {client?.maintenance_value !== undefined
                  ? Math.floor(client.maintenance_value)
                  : ""}
              </td>
            </tr>

            <tr>
              <td>مدفوع:</td>
              <td>
                {client?.paid !== undefined ? Math.floor(client.paid) : ""}
              </td>
            </tr>

            <tr>
              <td>غير مدفوع:</td>
              <td>
                {client?.unpaid !== undefined ? Math.floor(client.unpaid) : ""}
              </td>
            </tr>

            <tr>
              <td>ملاحظات:</td>
              <td>{client?.notes}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Divider />

      <Box
        component="form"
        noValidate
        sx={{ m: "auto", mt: 4, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              select
              fullWidth
              required
              label="الصيانة"
              name="maintenance_type"
              value={visit?.maintenance_type || ""} // Set the value from visit data
              disabled={true}
            >
              <MenuItem dir="rtl" value={"صيانة دورية"}>
                صيانة دورية
              </MenuItem>
              <MenuItem dir="rtl" value={"عطل"}>
                عطل
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ملاحظات (اختياري)"
              type="text"
              name="comments"
              disabled={true}
              value={visit?.comments || ""}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Checkbox to confirm action */}
            <FormControlLabel
              control={<Checkbox checked={true} color="primary" />}
              label="تم الصيانة"
              disabled={true}
            />
          </Grid>

          {visit?.image && (
            <Grid item xs={12}>
              <div>
                <img
                  style={{ width: "100%" }}
                  src={visit?.image}
                  alt="receipt"
                />
              </div>
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
}
