import * as React from "react";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import "../styles/quillStyles.css";
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

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem("token");

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

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${id}`
      );
      if (!response.ok) {
        const data = await response.json();
        Swal.fire({
          title: "การดำเนินการล้มเหลว!",
          text: data.message || "มีข้อผิดพลาดเกิดขึ้น",
          icon: "error",
          timer: 1000,
        }).then(() => {
          navigate("/");
        });
      } else {
        const data = await response.json();
        setBlog(data);
        setLoading(false);
      }
    } catch (error) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "การเชื่อมต่อเซิร์ฟเวอร์ขัดข้อง",
        icon: "error",
        timer: 1000,
      }).then(() => {
        navigate("/");
      });
    }
  };

  React.useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [id]);

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
        <Typography component="h1" variant="h3" align="center">
          {blog?.title}
        </Typography>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
          />
        </Box>
      </Container>
    </>
  );
}

export default BlogDetail;
