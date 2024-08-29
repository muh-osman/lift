import style from "./AddVisit.module.scss";
// React
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from "@mui/material/LinearProgress";
import { Divider } from "@mui/material";
// Api
import useGetOneClientDataApi from "../../API/useGetOneClientDataApi";
import { useAddVisitApi } from "../../API/useAddVisitApi";

export default function AddVisit() {
  let { id } = useParams();

  const {
    data: client,
    fetchStatus,
    isPending: isFetchCientPending,
  } = useGetOneClientDataApi();

  const addFormRef = useRef();
  const [addFormData, setAddFormData] = useState({
    maintenance_type: "",
    comments: "",
    image: "",
  });

  const { mutate, data, isPending, isSuccess } = useAddVisitApi();

  const handleInputChange = (e) => {
    setAddFormData({
      ...addFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAddFormData({
      ...addFormData,
      image: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = addFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data

    const formData = new FormData();
    // Append all form data to the FormData object
    Object.keys(addFormData).forEach((key) => {
      // Check if the key is 'image' and if there is no image selected
      if (key === "image" && !addFormData.image) {
        return; // Skip appending the 'image' key if no image is selected
      }
      formData.append(key, addFormData[key]);
    });
    formData.append("customer_id", id);

    mutate(formData);
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
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
        ref={addFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
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
              value={addFormData.maintenance_type}
              onChange={handleInputChange}
              disabled={isPending}
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
              disabled={isPending}
              value={addFormData.skills}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="file"
              name="image"
              required
              disabled={isPending}
              onChange={handleImageChange}
              dir="ltr"
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
          حفظ
        </LoadingButton>
      </Box>
    </div>
  );
}
