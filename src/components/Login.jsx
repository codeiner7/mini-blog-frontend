import React, { useState, useContext, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginImg from "../images/login.png";
import { AuthContext } from "../context/AuthContext";
import { getBaseUrl } from "../utils/common.utils";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(`${getBaseUrl()}/api/auth/login`, formData);
      console.log(response)
      if (response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 700 }} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Welcome Back 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Shape Your Thoughts. Sign in to share and explore insightful blogs.
          </Typography>

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "primary.main",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Sign In
          </Button>

          <Typography variant="body2" align="center">
            Don't you have an account?{" "}
            <Link href="/signup" underline="hover" fontWeight="bold">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box
          component="img"
          src={LoginImg}
          alt="Sign Up"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 2,
            maxHeight: 700,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Login;