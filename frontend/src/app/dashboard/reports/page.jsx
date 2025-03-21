import React from "react";
import { Card } from "@mui/material";
import ProtectedRoute from "@/hooks/ProtectedRoute";
import UserReports from "@/components/UserReports";

const ManageReports = () => {
  return (
    <ProtectedRoute>
      <div className="">
        <Card className="p-4">
          <UserReports />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ManageReports;
