"use client";
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import DashSidebar from "./DashSidebar";

const DashMobileSidebar = () => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <div className="w-64 min-h-screen text-white bg-gray-800">
        <DashSidebar />
      </div>
    </Box>
  );

  return (
    <div className="flex justify-end md:hidden">
      <Button onClick={toggleDrawer(true)}>Open Dashboard Sidebar</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default DashMobileSidebar;
