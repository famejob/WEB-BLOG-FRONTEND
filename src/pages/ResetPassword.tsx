import * as React from "react";
import Button from "@mui/material/Button";
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
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
interface FormData {
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const [formData, setFormData] = React.useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.password.trim() && !formData.confirmPassword.trim()) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "กรุณากรอกรหัสผ่าน กรุณายืนยันรหัสผ่าน",
        icon: "error",
        timer: 1000,
      });
      return;
    }
    if (!formData.password.trim()) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "กรุณากรอกรหัสผ่าน",
        icon: "error",
        timer: 1000,
      });
      return;
    }
    if (!formData.confirmPassword.trim()) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "กรุณายืนยันรหัสผ่าน",
        icon: "error",
        timer: 1000,
      });
      return;
    }
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "รหัสผ่านไม่ตรงกัน",
        icon: "error",
        timer: 1000,
      });
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reset/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.errors
          .map((error: { msg: string }) => error.msg)
          .join("\n");
        Swal.fire({
          title: "การดำเนินการล้มเหลว!",
          text: errorMessage || "มีข้อผิดพลาดเกิดขึ้น",
          icon: "error",
          timer: 1000,
        });
      } else {
        const data = await response.json();
        Swal.fire({
          title: "การดำเนินการสำเร็จ!",
          text: data.message,
          icon: "success",
          timer: 1000,
        }).then(() => {
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

  const handleMouseDownConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography component="h1" variant="h5" align="center">
          เปลี่ยนรหัสผ่าน
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="outlined-adornment-confirm-password">
                  ยืนยันรหัสผ่าน
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  name="confirmPassword"
                  label="ยืนยันรหัสผ่าน"
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
            เปลี่ยนรหัสผ่าน
          </Button>
        </Box>
      </Container>
    </>
  );
}
export default ResetPassword;
