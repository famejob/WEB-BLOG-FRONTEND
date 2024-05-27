import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
function ForgotPassword() {
  const [email, setEmail] = React.useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "กรุณากรอกอีเมล",
        icon: "error",
        timer: 1000,
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        Swal.fire({
          title: "การดำเนินการล้มเหลว!",
          text: data.message,
          icon: "error",
          timer: 1000,
        });
      } else {
        const data = await response.json();
        Swal.fire({
          title: "การดำเนินการสำเร็จ!",
          text: data.message,
          icon: "success",
          timer: 1500,
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

  return (
    <>
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography component="h1" variant="h5" align="center">
          ลืมรหัสผ่าน
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ส่งอีเมล
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default ForgotPassword;
