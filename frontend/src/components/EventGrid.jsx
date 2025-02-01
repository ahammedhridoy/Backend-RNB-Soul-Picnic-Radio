"use client";
import React, { useContext, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";
import { GlobalContext } from "@/context/GlobalContext";
import UpdateEvent from "./UpdateEvent";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";

const EventGrid = () => {
  const { loading, events, deleteEvent } = useContext(GlobalContext);
  const { visibleCount, loadMore } = usePagination(8, 8);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);

  // Delete dialog handlers
  const handleDeleteOpen = (eventId) => {
    setDeleteEventId(eventId);
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
    setDeleteEventId(null);
  };

  // Update dialog handlers
  const handleUpdateOpen = (event) => {
    setCurrentEvent(event);
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
    setCurrentEvent(null);
  };

  return (
    <div>
      <Toaster />
      <div className="grid w-full grid-cols-1 gap-5 my-4 md:grid-cols-2 lg:grid-cols-4 place-content-center place-items-center">
        {loading ? (
          <LoadingSpinner />
        ) : (
          events?.slice(0, visibleCount).map((event) => (
            <div sx={{ maxWidth: 345 }}>
              <Card sx={{ maxWidth: 345 }} className="transition-all">
                <CardMedia
                  component="img"
                  height="194"
                  image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${event?.image}`}
                  alt="event"
                  className="object-cover h-[300px] w-[350px]"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className="line-clamp-2"
                  >
                    {event?.title}
                  </Typography>

                  <Typography
                    gutterBottom
                    variant="p"
                    component="div"
                    className="line-clamp-2"
                  >
                    {dayjs(event?.date).format("ddd, DD ")}
                    {event?.secondDate &&
                      ` - ${dayjs(event?.secondDate).format("DD ")}`}
                    {dayjs(event?.date).format("MMM YYYY")}
                  </Typography>

                  <Link href={`${event?.url}`} target="_blank">
                    <Typography
                      gutterBottom
                      variant="p"
                      component="div"
                      className="line-clamp-2"
                    >
                      {event?.url}
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-4 p-4">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleUpdateOpen(event)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteOpen(event?.id)}
                >
                  Delete
                </Button>
                {/*Delete Dialog */}
                <Dialog
                  open={openDelete}
                  onClose={handleDeleteClose}
                  aria-labelledby="alert-dialog-title"
                >
                  <DialogTitle id="blog-delete-title">
                    {"Are you sure you want to delete this event?"}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button
                      onClick={() => {
                        deleteEvent(deleteEventId);
                        handleDeleteClose();
                      }}
                      color="error"
                      autoFocus
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
                {/*Delete Dialog */}
                {/*Update Dialog */}
                <Dialog
                  open={openUpdate}
                  onClose={handleUpdateClose}
                  aria-labelledby="alert-dialog-title"
                >
                  <DialogTitle id="blog-update-title">
                    <UpdateEvent
                      event={currentEvent}
                      handleUpdateClose={handleUpdateClose}
                    />
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleUpdateClose}>Cancel</Button>
                  </DialogActions>
                </Dialog>
                {/*Update Dialog */}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {events?.length > visibleCount && (
        <div className="mt-10 text-center">
          <Button variant="contained" onClick={loadMore} color="success">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventGrid;
