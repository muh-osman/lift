import style from "./EditTechnician.module.scss";
import { useParams } from "react-router-dom";
// Mui
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
// API
import { useResetTechnicianPasswordApi } from "../../../API/useResetTechnicianPasswordApi";

export default function EditTechnician() {
  let { id: user_id } = useParams();
  //
  const formRef = React.useRef();

  const { mutate, isPending, isSuccess } = useResetTechnicianPasswordApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;

    const formData = new FormData(e.currentTarget);
    const new_password = formData.get("password");

    mutate({
      user_id,
      new_password,
    });
  };

  return (
    <Container
      className={style.container}
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Avatar
          sx={{
            margin: "auto",
            marginBottom: "8px",
            bgcolor: "secondary.main",
          }}
        >
          <PasswordIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          إعادة تعيين كلمة المرور
        </Typography>
        <Box
          ref={formRef}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                dir="ltr"
                required
                fullWidth
                id="password"
                label="كلمة المرور الجديدة"
                type="text"
                name="password"
                autoComplete="new-password"
                autoFocus
                disabled={isPending || isSuccess}
              />
            </Grid>
          </Grid>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            disableRipple
            loading={isPending}
            disabled={isSuccess}
            sx={{ mt: 3, mb: 2, transition: "0.1s" }}
          >
            إعادة تعيين
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}
