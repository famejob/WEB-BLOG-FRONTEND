import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/custom-quill.css";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

interface FormData {
  title: string;
  content: string;
}

function ReactQuillWrapper({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div>
      <ReactQuill
        value={value}
        modules={modules}
        formats={formats}
        onChange={onChange}
        placeholder="เนื้อหาบทความ"
      />
    </div>
  );
}

function EditBlog() {
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    content: "",
  });
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${id}`
      );
      const data = await response.json();
      console.log(data);
      setFormData({
        title: data.title,
        content: data.content,
      });
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

  React.useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [id]);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const plainTextContent = stripHtml(formData.content).trim();
    if (!formData.title.trim() && !plainTextContent) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "กรุณากรอกชื่อบทความ กรุณากรอกเนื้อหาบทความ",
        icon: "error",
        timer: 1000,
      });
      return;
    }
    if (!formData.title.trim()) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "กรุณากรอกชื่อบทความ",
        icon: "error",
        timer: 1000,
      });
      return;
    }
    if (!plainTextContent) {
      Swal.fire({
        title: "การดำเนินการล้มเหลว!",
        text: "กรุณากรอกเนื้อหาบทความ",
        icon: "error",
        timer: 1000,
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography component="h1" variant="h5" align="center">
          แก้ไขบทความ
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                onChange={handleChange}
                id="title"
                label="ชื่อบทความ"
                name="title"
                value={formData.title}
              />
            </Grid>
            <Grid item xs={12}>
              <ReactQuillWrapper
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
                value={formData.content}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="success"
          >
            อัพเดต
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default EditBlog;
