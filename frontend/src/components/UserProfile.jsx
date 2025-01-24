"use client";
import React, { useContext, useState } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { GlobalContext } from "@/context/GlobalContext";

const UserProfile = () => {
  const { user, fetchSingleUser, updateUserAccount, loading, accessToken } =
    useContext(GlobalContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="w-full">
        <CardContent>
          <Typography
            variant="h6"
            className="text-center text-[--light-title-color] font-bold"
          >
            {user?.name}
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
