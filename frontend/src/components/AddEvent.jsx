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

const AddEvent = () => {
  const [date, setDate] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  const { accessToken, fetchEvents } = useContext(GlobalContext);

  // Add Event
  const addEvent = async (e) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        toast.error("Access token is missing. Please log in again.");
        return;
      }

      if (!title || !date || !image) {
        toast.error("All fields are required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("image", image);

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
        fetchEvents();
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
              <TextField
                id="blog-title"
                label="Title"
                variant="outlined"
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs} className="mt-2 ">
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
              Add Event
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEvent;
