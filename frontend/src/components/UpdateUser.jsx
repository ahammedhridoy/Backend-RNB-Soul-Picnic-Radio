"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const UpdateUser = ({ handleUpdateClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  // Update User
  const handleUpdate = async (e) => {
    e.preventDefault();
    handleUpdateClose();
  };

  return (
    <div>
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
        <div className="w-full mt-2">
          <FormControl variant="standard" className="w-full">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={handleChange} label="Role">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
              <MenuItem value={"EDITOR"}>EDITOR</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          variant="contained"
          type="submit"
          className="w-full mt-4 bg-[var(--gray-color)]"
        >
          Update User
        </Button>
      </form>
    </div>
  );
};

export default UpdateUser;
