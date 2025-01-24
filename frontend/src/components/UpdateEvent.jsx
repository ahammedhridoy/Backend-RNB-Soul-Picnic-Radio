"use client";
import React from "react";
import Card from "@mui/material/Card";
import { Button, CardContent, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { GlobalContext } from "@/context/GlobalContext";
import apiClient from "@/config/axiosConfig";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const UpdateEvent = ({ event, handleUpdateClose }) => {
  const [date, setDate] = useState(event?.date);
  const [title, setTitle] = useState(event?.title);
  const [image, setImage] = useState(null);
  const { updateEvent } = useContext(GlobalContext);

  // Update Event

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Create FormData to send image
    const formData = new FormData();
    formData.append("title", title ? title : event?.title);
    formData.append("date", date ? date : event?.date);
    formData.append("image", image ? image : event?.image);

    // Call the updateSlide function with the slide ID and formData
    const success = await updateEvent(event?.id, formData);

    if (success) {
      handleUpdateClose();
    }
  };

  return (
    <div>
      <Card>
        <Toaster />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Update Event <hr />
          </Typography>
          {/* Form */}
          <form
            encType="multipart/form-data"
            method="post"
            onSubmit={handleUpdate}
          >
            <div className="w-full">
              <div className="mt-4 file-input">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  variant="outlined"
                />
              </div>
              <div className="my-2">
                {image && (
                  <Image
                    src={URL.createObjectURL(image)}
                    width={200}
                    height={200}
                    className="w-[500px] h-[300px] border-2 border-gray-400 border-dashed"
                  />
                )}
              </div>
              <div className="w-full mt-2">
                <TextField
                  id="blog-title"
                  label="Title"
                  variant="outlined"
                  className="w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Select Date"
                    onChange={setDate}
                    className="w-full"
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button
                variant="contained"
                type="submit"
                className="w-full mt-4 bg-[var(--primary-color)]"
              >
                Update Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateEvent;
