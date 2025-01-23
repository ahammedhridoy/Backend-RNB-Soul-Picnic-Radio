import React from "react";
import { Card } from "@mui/material";
import DashOverview from "@/components/DashOverview";

const Dashboard = () => {
  return (
    <div>
      <Card className="min-h-screen p-4">
        <DashOverview />
      </Card>
    </div>
  );
};

export default Dashboard;
