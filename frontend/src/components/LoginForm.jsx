"use client";
import React, { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "@/config/axiosConfig";
import LoadingSpinner from "./LoadingSpinner";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email,
        password,
      };

      if (!email || !password) {
        toast.error("Please enter email and password");
      }

      const response = await apiClient.post("/api/v1/auth/login", data, {
        withCredentials: true,
      });

      if (response?.status === 200) {
        const token = response?.data?.accessToken;
        const user = response?.data?.user;

        localStorage.setItem("accessToken", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "/dashboard";
      }
      toast.success("Login Successfully");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //   User Check
  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      window.location.href = "/dashboard";
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="login-form">
      <Toaster />
      <Box className="w-[300px] md:w-[600px]">
        <Card variant="outlined">
          <CardContent>
            <h1 className="my-10 text-5xl font-bold text-center text-[var(--black-color)]">
              Login
            </h1>

            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1 },
              }}
              noValidate
              autoComplete="off"
              className="flex flex-col items-center justify-center max-h-fit"
              onSubmit={handleSubmit}
            >
              <div className="">
                <FormControl variant="outlined" className="w-full mb-5">
                  <InputLabel htmlFor="outlined-adornment-email">
                    Email
                  </InputLabel>
                  <OutlinedInput
                    className="bg-[var(--input-bg-color)]"
                    type="email"
                    label="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl
                  variant="outlined"
                  className="w-full mb-5 marginTop"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[var(--input-bg-color)]"
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
                    label="Password"
                  />
                </FormControl>

                <p className="mb-5 text-[var(--primary-color)]">
                  <Link
                    className="hover:border-b-2 w-fit "
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </p>

                <Button
                  type="submit"
                  variant="contained"
                  className="w-full btnCss"
                >
                  Login
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default LoginForm;
