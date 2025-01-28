"use client";
import { GlobalContext } from "@/context/GlobalContext";
import { Button } from "@mui/material";
import React, { useContext } from "react";

const Navigation = () => {
  const { userLogout } = useContext(GlobalContext);
  return (
    <div className="bg-[var(--primary-color)] h-[50px]">
      <div className="flex items-center justify-end h-[50px] mx-4">
        <Button
          variant="contained"
          className="bg-[--black-color] font-bold"
          onClick={userLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
