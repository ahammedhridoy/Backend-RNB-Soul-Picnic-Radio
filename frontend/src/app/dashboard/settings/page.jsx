import React from "react";
import { Card } from "@mui/material";
import UserProfile from "@/components/UserProfile";

const Settings = () => {
  return (
    <div className="">
      <Card className="p-4">
        <UserProfile />
      </Card>
    </div>
  );
};

export default Settings;
