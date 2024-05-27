import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

interface Author {
  username: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: Author;
  created_at: string;
  updated_at: string;
}

interface JwtPayload {
  exp: number;
}

function MyBlogs() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  const checkTokenExpiration = () => {
    if (token) {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      const expirationDate = new Date(decoded.exp * 1000);
      if (expirationDate < new Date()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_info");
        Swal.fire({
          title: "เซสชั่นหมดอายุแล้ว",
          text: "เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบอีกครั้ง",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
        return false;
      }
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async (query = "") => {
    if (!checkTokenExpiration()) return;

    try {
      const url = query
        ? `${import.meta.env.VITE_API_URL}/my-blogs/search/${query}`
        : `${import.meta.env.VITE_API_URL}/my-blogs`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "การเชื่อมต่อเซิร์ฟเวอร์ขัดข้อง",
        icon: "error",
        timer: 1000,
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchData(query);
  };

  const handleDelete = async (blogId: string) => {
    if (!checkTokenExpiration()) return;

    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบบทความนี้หรือไม่?",
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
          `${import.meta.env.VITE_API_URL}/blogs/${blogId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBlogs(blogs.filter((blog) => blog._id !== blogId));
          Swal.fire({
            title: "การดำเนินการสำเร็จ!",
            text: data.message,
            icon: "success",
            timer: 1000,
          });
        } else {
          throw new Error("ลบบทความไม่สำเร็จ");
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

  if (loading) {
    return (
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography component="h1" variant="h5" align="center">
          กำลังโหลด...
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="md">
        <Box sx={{ p: 2 }}>
          <Typography
            component="h1"
            sx={{ mb: 3 }}
            variant="h5"
            textAlign={{ xs: "center" }}
          >
            บทความของฉัน
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ค้นหาชื่อบทความของฉัน"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={2}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} key={blog._id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">{blog.title}</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography variant="body2">ผู้เขียน: </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        {blog.author.username}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography variant="body2">วันที่เผยแพร่: </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        {dayjs(blog.created_at).format("DD/MM/YYYY HH:mm น.")}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography variant="body2">วันที่อัพเดต: </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        {dayjs(blog.updated_at).format("DD/MM/YYYY HH:mm น.")}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{ flex: "1 1 auto", mb: { xs: 1, md: 0 } }}>
                      <Button
                        fullWidth
                        startIcon={<ModeEditOutlinedIcon />}
                        variant="contained"
                        component={Link}
                        to={`/edit/${blog._id}`}
                        color="warning"
                      >
                        แก้ไขบทความ
                      </Button>
                    </Box>
                    <Box sx={{ flex: "1 1 auto" }}>
                      <Button
                        fullWidth
                        startIcon={<DeleteOutlinedIcon />}
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(blog._id)}
                      >
                        ลบบทความ
                      </Button>
                    </Box>

                    <Box sx={{ flex: "1 1 auto", mb: { xs: 1, md: 0 } }}>
                      <Button
                        fullWidth
                        startIcon={<BookOutlinedIcon />}
                        variant="contained"
                        component={Link}
                        to={`/blogs/${blog._id}`}
                      >
                        อ่านบทความ
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default MyBlogs;
