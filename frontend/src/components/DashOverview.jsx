import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import AddEvent from "./AddEvent";
import EventGrid from "./EventGrid";

const DashOverview = () => {
  return (
    <div>
      {/* Add Event */}
      <AddEvent />
      {/* Dashboard Cards */}
      <h1 className="mt-5 mb-4 text-2xl font-bold">
        All Events <hr />
      </h1>
      <EventGrid />
    </div>
  );
};

export default DashOverview;
