"use client";
import React, { useContext, useEffect, useState } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { GlobalContext } from "@/context/GlobalContext";
import LoadingSpinner from "./LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "@/config/axiosConfig";

const UserProfile = () => {
  const { updateUserAccount, accessToken } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getUser = JSON.parse(localStorage.getItem("user"));
  const username = getUser?.name;

  useEffect(() => {
    const fetchSingleUser = async () => {
      setLoading(true);
      if (!getUser || !getUser.id) {
        console.error("User or user.id is undefined");
        return;
      }

      try {
        const response = await apiClient.get(
          `/api/v1/auth/user/${getUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response?.status === 200) {
          setUser(response?.data?.user);
        } else {
          console.error("Failed to fetch user:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchSingleUser();
  }, []);

  // Update name and email when user data is fetched
  useEffect(() => {
    if (user) {
      setName(user?.name || "");
      setEmail(user?.email || "");
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  // Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!getUser?.id) {
      console.error("User ID is missing");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate input fields
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    // Create the payload to send as JSON
    const payload = {
      name,
      email,
      ...(password && { password }),
    };

    const success = await updateUserAccount(getUser?.id, payload);
    if (success) {
      toast.success("User updated successfully!");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <Toaster />
      <div className="w-full">
        <CardContent>
          <Typography variant="h6" className="font-bold text-center text-black">
            {username}
          </Typography>
        </CardContent>
        <CardActions className="flex justify-center">
          <form
            encType="multipart/form-data"
            method="post"
            onSubmit={handleUpdate}
          >
            <TextField
              label="Name"
              variant="outlined"
              className="w-full mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              className="w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              className="w-full mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              className="w-full mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              className="bg-[var(--primary-color)] flex justify-center items-center text-center mx-auto mb-4"
            >
              Update Profile
            </Button>
          </form>
        </CardActions>
      </div>
    </div>
  );
};

export default UserProfile;
