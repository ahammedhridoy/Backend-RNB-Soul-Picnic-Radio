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

const AddEvent = () => {
  const [date, setDate] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [secondDate, setSecondDate] = useState(null);

  const { accessToken, fetchEvents } = useContext(GlobalContext);

  // Add Event
  const addEvent = async (e) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        toast.error("Access token is missing. Please log in again.");
        return;
      }

      if (!title || !date || !image || !url) {
        toast.error("All fields are required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date ? dayjs(date).utc().format() : null);
      formData.append("image", image);
      formData.append("url", url);

      if (secondDate) {
        formData.append(
          "secondDate",
          secondDate ? dayjs(secondDate).utc().format() : null
        );
      }

      const res = await apiClient.post("/api/v1/event/create", formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.status === 201) {
        toast.success("Event added successfully");
        setTitle("");
        setImage("");
        setUrl("");
        fetchEvents();
        setDate(null);
        setSecondDate(null);
      }
    } catch (error) {
      console.error("Error adding Event:", error);
    }
  };

  return (
    <Card>
      <Toaster />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Add Event <hr />
        </Typography>
        {/* Form */}
        <form encType="multipart/form-data" method="post" onSubmit={addEvent}>
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
                    onChange={(newValue) => setDate(newValue)}
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
                    onChange={(newValue) => setSecondDate(newValue)}
                    className="w-full "
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <Button
              variant="contained"
              type="submit"
              className="w-full mt-4 btnCss marginTop"
            >
              Add Event
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEvent;
