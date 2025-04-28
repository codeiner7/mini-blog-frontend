import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import HomeImg from "../images/home.png";
import { getBaseUrl } from "../utils/common.utils";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [blogData, setBlogData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllBlogs = () => {
    axios
      .get(`${getBaseUrl()}/api/blog/getAll`)
      .then((res) => {
        setBlogData(res?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getUserBlogs = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${getBaseUrl()}/api/blog/getByUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBlogData(res?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (user) {
      getUserBlogs();
    } else {
      getAllBlogs();
    }
  }, []);

  const filteredBlogs = blogData.filter((blog) => {
    const titleMatch = blog.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const categoryMatch = blog.category_name?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || categoryMatch;
  });

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: { xs: "70vh", md: "90vh" },
          backgroundImage: `url(${HomeImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          color: "#fff",
          px: 4,
        }}
      >
        <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!user) {
                navigate("/login");
              }
            }}
          >
            {user ? user.name : "Sign In"}
          </Button>
          {user && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
              }}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          )}
        </Box>

        <Box sx={{ maxWidth: 600 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Richird Norton photorealistic rendering as real photos
          </Typography>
          <Typography variant="body1">
            1 Jan 2023 — Progressively incentivize cooperative systems through
            technically sound functionalities.
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h5" fontWeight="bold">
            Blogs
          </Typography>

          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" startIcon={<AddIcon />}>
              Add
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 3,
                    borderRadius: 2,
                    maxWidth: 350
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.blog_image_url}
                    alt={blog.title}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {blog.author?.name} •{" "}
                      {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mt: 1, mb: 1 }}
                    >
                      {blog.title.length > 28
                        ? `${blog.title.substring(0, 28)}...`
                        : blog.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ flexGrow: 1 }}
                    >
                      {blog.content.length > 45
                        ? `${blog.content.substring(0, 45)}...`
                        : blog.content}
                    </Typography>
                    <Chip
                      label={blog.category_name?.name}
                      size="small"
                      sx={{ mt: 2, alignSelf: "flex-start" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No blogs found.</Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
