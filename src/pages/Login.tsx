import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Container from "@mui/material/Container";

interface FormData {
  email: string;
  password: string;
}

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        Swal.fire({
          title: "การเข้าสู่ระบบล้มเหลว!",
          text: data.error,
          icon: "error",
          timer: 1000,
        });
      } else {
        const data = await response.json();
        Swal.fire({
          title: "การดำเนินการสำเร็จ!",
          text: data.message,
          icon: "success",
          timer: 500,
        }).then(() => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_info", JSON.stringify(data.user_info));
          navigate("/my-blogs");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "การเชื่อมต่อเซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        timer: 1000,
      });
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography component="h1" variant="h5" align="center">
          เข้าสู่ระบบ
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                onChange={handleChange}
                fullWidth
                id="email"
                label="อีเมล"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="outlined-adornment-password">
                  รหัสผ่าน
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  name="password"
                  label="รหัสผ่าน"
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            เข้าสู่ระบบ
          </Button>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
              <Typography
                variant="body1"
                component={Link}
                sx={{ textDecoration: "none" }}
                to="/forgot-password"
              >
                ลืมรหัสผ่าน?
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              justifyContent={{ xs: "center", sm: "flex-end" }}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  ยังไม่มีบัญชี?
                </Typography>
                <Typography
                  component={Link}
                  variant="body1"
                  sx={{ textDecoration: "none" }}
                  to="/register"
                >
                  สมัครเป็นนักเขียน
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Login;
