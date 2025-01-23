import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";

const DashOverview = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        All Events <hr />
      </h1>
      {/* Dashboard Cards */}
      <div className="grid w-full grid-cols-4 gap-4"></div>
    </div>
  );
};

export default DashOverview;
