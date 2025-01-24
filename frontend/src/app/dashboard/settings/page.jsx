import React from "react";
import { Card } from "@mui/material";
import UserProfile from "@/components/UserProfile";
import ProtectedRoute from "@/hooks/ProtectedRoute";

const Settings = () => {
  return (
    <ProtectedRoute>
      <div className="">
        <Card className="p-4">
          <UserProfile />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
