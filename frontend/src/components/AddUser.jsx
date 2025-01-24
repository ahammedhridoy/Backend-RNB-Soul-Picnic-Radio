"use client";
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Card } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { GlobalContext } from "@/context/GlobalContext";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "@/config/axiosConfig";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, fetchUsers } = useContext(GlobalContext);

  // Add User
  const addUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!accessToken) {
        toast.error("Access token is missing. Please log in again.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const data = {
        name,
        email,
        password,
      };

      const res = await apiClient.post("/api/v1/auth/register", data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res?.status === 201) {
        toast.success("User added successfully");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        fetchUsers();
      } else {
        toast.error(res.data.message || "Error adding User");
      }
    } catch (error) {
      console.error("Error adding User:", error);
      console.error("Error Response:", error.response);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-10">
      <Toaster />
      <Card className="p-4">
        <h1 className="text-2xl font-bold">Add User</h1>
        <hr />

        <form className="mt-4" onSubmit={addUser}>
          <div className="w-full mt-2">
            <TextField
              label="Name"
              variant="standard"
              type="text"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="w-full mt-2">
            <TextField
              label="Email"
              variant="standard"
              className="w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full mt-2">
            <TextField
              label="Password"
              variant="standard"
              className="w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-full mt-2">
            <TextField
              label="Confirm Password"
              variant="standard"
              className="w-full"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            variant="contained"
            type="submit"
            className="w-full mt-4 bg-[var(--primary-color)]"
          >
            Add User
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;
