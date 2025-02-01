"use client";
import React from "react";
import Card from "@mui/material/Card";
import { Button, CardContent, InputLabel, Typography } from "@mui/material";
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
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(utc);

const UpdateEvent = ({ event, handleUpdateClose }) => {
  const [date, setDate] = useState(event?.date);
  const [title, setTitle] = useState(event?.title);
  const [image, setImage] = useState(null);
  const { updateEvent } = useContext(GlobalContext);
  const [url, setUrl] = useState(event?.url);
  const [secondDate, setSecondDate] = useState(event?.secondDate);

  // Update Event

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Create FormData to send image
    const formData = new FormData();
    formData.append("title", title ? title : event?.title);
    formData.append(
      "date",
      date ? (date ? dayjs(date).utc().format() : null) : event?.date
    );
    formData.append("image", image ? image : event?.image);
    formData.append("url", url ? url : event?.url);
    formData.append(
      "secondDate",
      secondDate
        ? secondDate
          ? dayjs(secondDate).utc().format()
          : null
        : event?.secondDate
    );

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
                <InputLabel>Select Image</InputLabel>
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
                    className="w-[300px] h-[300px] border-2 border-gray-400 border-dashed"
                    alt="Event Image"
                  />
                )}
              </div>
              <div className="w-full mt-2">
                <InputLabel>Title</InputLabel>
                <TextField
                  label="Title"
                  variant="outlined"
                  className="w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="w-full mt-2">
                <InputLabel>Event URL</InputLabel>
                <TextField
                  label="URL"
                  variant="outlined"
                  className="w-full"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <InputLabel>From</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Select Date"
                      onChange={setDate}
                      className="w-full "
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>

              <div className="mt-2">
                <InputLabel>To (Optional)</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Select Date"
                      onChange={setSecondDate}
                      className="w-full "
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
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
