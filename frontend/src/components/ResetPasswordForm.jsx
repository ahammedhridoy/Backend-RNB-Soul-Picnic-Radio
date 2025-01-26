"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";
import apiClient from "@/config/axiosConfig";
import LoadingSpinner from "./LoadingSpinner";

const ResetPasswordForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const { token } = useParams();

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("Please enter a password");
    }

    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await apiClient.post("/api/v1/auth/reset-password", {
        token,
        newPassword: password,
      });

      if (res?.status === 200) {
        toast.success("Password updated successfully");
        setTimeout(() => router.push("/"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      console.error("Error resetting password:", error.message);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

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
    <div className="forgot-form">
      <Toaster />
      <Box className="w-full md:w-[750px] p-2">
        <Card variant="outlined">
          <CardContent>
            <h1 className="my-10 lg:text-5xl text-3xl font-bold text-center text-[var(--black-color)]">
              Reset Password
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
              <div className="w-full">
                {/* New Password Input */}
                <FormControl variant="outlined" className="w-full mb-5">
                  <InputLabel htmlFor="outlined-adornment-password">
                    New Password
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
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                  />
                </FormControl>

                {/* Confirm Password Input */}
                <FormControl variant="outlined" className="w-full mb-5">
                  <InputLabel htmlFor="outlined-adornment-confirm-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-[var(--input-bg-color)]"
                    id="outlined-adornment-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
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
                    label="Confirm Password"
                  />
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  className="w-full bg-[var(--primary-color)]"
                >
                  Update Password
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default ResetPasswordForm;
