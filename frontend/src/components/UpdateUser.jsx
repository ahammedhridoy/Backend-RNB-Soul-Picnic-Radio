"use client";
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { GlobalContext } from "@/context/GlobalContext";
import toast, { Toaster } from "react-hot-toast";

const UpdateUser = ({ user, handleUpdateClose }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { updateUser } = useContext(GlobalContext);

  // Update User
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user?.id) {
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
      password,
    };

    const success = await updateUser(user.id, payload);

    if (success) {
      handleUpdateClose();
    }
  };

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl font-bold">Update User</h1>
      <hr />

      <form className="mt-4" onSubmit={handleUpdate}>
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
          />
        </div>

        <Button
          variant="contained"
          type="submit"
          className="w-full mt-4 bg-[--primary-color]"
        >
          Update User
        </Button>
      </form>
    </div>
  );
};

export default UpdateUser;
