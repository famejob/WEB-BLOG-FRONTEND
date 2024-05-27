import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

function NavBar() {
  const [open, setOpen] = React.useState(false);
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const userInfoString = localStorage.getItem("user_info");
  const userInfo: { [key: string]: string } | null = userInfoString
    ? JSON.parse(userInfoString)
    : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการออกจากระบบหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_info");
        navigate("/login");
      }
    });
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "คุณแน่ใจที่จะลบบัญชีผู้ใช้หรือไม่ หากลบแล้วไม่สามารถกู้คืนได้?",
      text: "คุณต้องการลบบัญชีผู้ใช้งานหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/delete-account`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_info");
          navigate("/");
          const data = await response.json();
          Swal.fire({
            title: "การดำเนินการสำเร็จ!",
            text: data.message,
            icon: "success",
            timer: 1000,
          });
        } else {
          throw new Error("ลบบัญชีผู้ใช้ไม่สำเร็จ");
        }
      } catch (error) {
        Swal.fire({
          title: "การลบบทความล้มเหลว!",
          text: "การเชื่อมต่อเซิร์ฟเวอร์ขัดข้อง",
          icon: "error",
          timer: 1000,
        });
      }
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <Typography
                sx={{ ml: 2, fontWeight: "bold" }}
                variant="body2"
                color="text.primary"
              >
                WEB BLOG
              </Typography>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MenuItem
                  sx={{ py: "6px", px: "12px" }}
                  component={Link}
                  to="/"
                >
                  <Typography variant="body2" color="text.primary">
                    บทความทั้งหมด
                  </Typography>
                </MenuItem>
                {isLoggedIn && (
                  <>
                    <MenuItem
                      sx={{ py: "6px", px: "12px" }}
                      component={Link}
                      to="/my-blogs"
                    >
                      <Typography variant="body2" color="text.primary">
                        บทความของฉัน
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      sx={{ py: "6px", px: "12px" }}
                      component={Link}
                      to="/create"
                    >
                      <Typography variant="body2" color="text.primary">
                        เขียนบทความ
                      </Typography>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {!isLoggedIn ? (
                <>
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    component={Link}
                    to="/login"
                  >
                    เข้าสู่ระบบ
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component={Link}
                    to="/register"
                  >
                    สมัครเป็นนักเขียน
                  </Button>
                </>
              ) : (
                <>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccountCircle sx={{ color: "#000" }} />
                    <Typography variant="body2" color="text.primary">
                      {userInfo?.username}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<DeleteOutlinedIcon />}
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                  >
                    ลบบัญชีผู้ใช้งาน
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                  >
                    ออกจากระบบ
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    textAlign={"center"}
                    sx={{ ml: 2, fontWeight: "bold" }}
                    variant="body2"
                    color="text.primary"
                  >
                    WEB BLOG
                  </Typography>
                  <MenuItem component={Link} to="/">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2" color="text.primary">
                        บทความทั้งหมด
                      </Typography>
                    </Box>
                  </MenuItem>
                  {isLoggedIn ? (
                    <>
                      <MenuItem component={Link} to="/my-blogs">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            บทความของฉัน
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem component={Link} to="/create">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            เขียนบทความ
                          </Typography>
                        </Box>
                      </MenuItem>
                      <Divider />
                      <MenuItem>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <AccountCircle sx={{ color: "#000", mr: 0.5 }} />
                          <Typography variant="body2" color="text.primary">
                            {userInfo?.username}
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem>
                        <Button
                          fullWidth
                          startIcon={<DeleteOutlinedIcon />}
                          variant="contained"
                          color="error"
                          onClick={handleDeleteAccount}
                        >
                          ลบบัญชีผู้ใช้งาน
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button
                          color="error"
                          variant="contained"
                          sx={{ width: "100%" }}
                          onClick={handleLogout}
                          startIcon={<LogoutIcon />}
                        >
                          ออกจากระบบ
                        </Button>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        <Button
                          color="primary"
                          variant="contained"
                          component={Link}
                          to="/register"
                          sx={{ width: "100%" }}
                        >
                          สมัครเป็นนักเขียน
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button
                          color="primary"
                          variant="outlined"
                          component={Link}
                          to="/login"
                          sx={{ width: "100%" }}
                        >
                          เข้าสู่ระบบ
                        </Button>
                      </MenuItem>
                    </>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavBar;
