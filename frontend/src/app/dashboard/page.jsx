import React from "react";
import { Card } from "@mui/material";
import DashOverview from "@/components/DashOverview";
import ProtectedRoute from "@/hooks/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div>
        <Card className="min-h-screen p-4">
          <DashOverview />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
