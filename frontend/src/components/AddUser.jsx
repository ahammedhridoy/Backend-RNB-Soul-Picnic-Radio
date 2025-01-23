"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Card } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="w-full mb-10">
      <Card className="p-4">
        <h1 className="text-2xl font-bold">Add User</h1>
        <hr />

        <form className="mt-4">
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
