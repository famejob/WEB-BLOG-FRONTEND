import * as React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

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

function BlogList() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  const fetchData = async (query = "") => {
    try {
      const url = query
        ? `${import.meta.env.VITE_API_URL}/search/${query}`
        : `${import.meta.env.VITE_API_URL}/blogs`;
      const response = await fetch(url);
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
    }, 60000);
    return () => clearInterval(intervalId);
  }, [location]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchData(query);
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
            บทความทั้งหมด
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ค้นหาชื่อบทความ, ชื่อผู้เขียน"
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
                  <Button
                    component={Link}
                    to={`/blogs/${blog._id}`}
                    sx={{ mt: 1 }}
                    variant="contained"
                    startIcon={<BookOutlinedIcon />}
                  >
                    อ่านบทความ
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default BlogList;
