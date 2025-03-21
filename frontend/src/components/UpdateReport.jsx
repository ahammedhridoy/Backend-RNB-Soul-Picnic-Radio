"use client";
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { GlobalContext } from "@/context/GlobalContext";
import toast, { Toaster } from "react-hot-toast";

const UpdateReport = ({ report, handleUpdateClose }) => {
  const { updateReportApi } = useContext(GlobalContext);
  const [reportStatus, setReportStatus] = useState(
    report?.reportStatus || "pending"
  );

  // Update report
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!report?.id) return;

    const payload = { reportStatus };
    const success = await updateReportApi(report.id, payload);

    if (success) {
      toast.success("Report updated successfully!");
      handleUpdateClose();
    } else {
      toast.error("Failed to update report.");
    }
  };

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl font-bold">Update Report</h1>
      <hr />

      <form className="mt-4" onSubmit={handleUpdate}>
        <h1 className="text-lg">Reason: {report?.reason}</h1>
        <p>Report: {report?.post?.text}</p>

        {report?.post?.images?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <h1 className="text-lg">Images:</h1>
            {report?.post?.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index}`}
                className="w-full h-40 object-cover"
              />
            ))}
          </div>
        )}

        <div className="w-full mt-2">
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={reportStatus}
              label="Status"
              onChange={(e) => setReportStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          variant="contained"
          type="submit"
          className="w-full mt-4 bg-[--primary-color]"
        >
          Update Report
        </Button>
      </form>
    </div>
  );
};

export default UpdateReport;
