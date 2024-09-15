import style from "../../Layout/layout.module.scss";
// React router
import { Link as RouterLink } from "react-router-dom";
// Mui
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Copyright from "../../Components/Copyright";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// API
import { useLoginApi } from "../../API/useLoginApi";
// Images
import loginBg from "../../Assets/Images/loginBg.avif";

export default function LogIn() {
  const [showPassword, setShowPassword] = React.useState(false);

  const [email, setEmail] = React.useState("admin@mail.com");
  const [password, setPassword] = React.useState("00266321");

  const formRef = React.useRef();

  const { mutate, isPending } = useLoginApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    const data = new FormData(e.currentTarget);
    mutate(data);
  };

  return (
    <Grid
      className={style.container}
      container
      component="main"
      sx={{ height: "100vh" }}
    >
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${loginBg})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            تسجيل الدخول
          </Typography>
          <Box
            ref={formRef}
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الالكتروني"
              name="email"
              autoComplete="email"
              autoFocus
              disabled={isPending}
              value={email} // Set the value to the state
              onChange={(e) => setEmail(e.target.value)} // Update state on change
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              disabled={isPending}

              value={password} // Set the value to the state
              onChange={(e) => setPassword(e.target.value)} // Update state on change

              InputLabelProps={{
                shrink: true, // This keeps the label fixed
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="تذكرني"
              disabled={isPending}
              dir="rtl"
              style={{ display: "block" }}
            />

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              disableRipple
              loading={isPending}
              sx={{ mt: 3, mb: 2, transition: "0.1s" }}
            >
              تسجيل الدخول
            </LoadingButton>

            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
