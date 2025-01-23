"use client";
import React, { useState } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

const UserProfile = () => {
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
            Ashik Ahammed Hridoy
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
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              className="w-full mb-4"
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              className="w-full mb-4"
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              className="w-full mb-4"
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
