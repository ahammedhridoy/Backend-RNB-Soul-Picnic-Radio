"use client";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/config/axiosConfig";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Email is required");
        return;
      }

      const data = {
        email,
      };

      const res = await apiClient.post("/api/v1/auth/forgot-password", data);

      if (res?.status === 200) {
        toast.success("Password reset email sent");

        setEmail("");

        setTimeout(() => router.push("/"), 500);
      }
    } catch (error) {
      toast.error("Failed to send password reset email");
      console.error(error.message);
    }
  };

  //   useEffect(() => {
  //     const currentUser = localStorage.getItem("user");
  //     if (currentUser) {
  //       window.location.href = "/";
  //     } else {
  //       setLoading(false);
  //     }
  //   }, []);

  //   if (loading) {
  //     return <LoadingSpinner />;
  //   }

  return (
    <div className="forgot-form">
      <Toaster />
      <Box className="md:w-[750px] w-full p-2">
        <Card variant="outlined">
          <CardContent>
            <h1 className="my-10 lg:text-5xl text-3xl font-bold text-center text-[var(--black-color)]">
              Send Reset Password Email
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
                <FormControl variant="outlined" className="w-full mb-5">
                  <InputLabel htmlFor="outlined-adornment-password">
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

                <Button
                  type="submit"
                  variant="contained"
                  className="w-full bg-[var(--primary-color)]"
                >
                  Send
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default ForgotPasswordForm;
