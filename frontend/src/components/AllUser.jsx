"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import React, { useContext, useState } from "react";
import Paper from "@mui/material/Paper";
import UpdateUser from "./UpdateUser";
import { GlobalContext } from "@/context/GlobalContext";
import usePagination from "@/hooks/usePagination";

const AllUser = () => {
  const { users, deleteUser } = useContext(GlobalContext);
  const { visibleCount, loadMore } = usePagination(8, 8);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Delete dialog handlers
  const handleDeleteOpen = (userId) => {
    setDeleteUserId(userId);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setDeleteUserId(null);
  };

  // Update dialog handlers
  const handleUpdateOpen = (user) => {
    console.log("Selected user for update:", user);
    setCurrentUser(user);
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
    setCurrentUser(null);
  };

  return (
    <div className="w-full my-10">
      <h1 className="mb-5 text-2xl font-bold">All User</h1>
      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(0, visibleCount).map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateOpen(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteOpen(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Load More */}
      {users?.length > visibleCount && (
        <div className="mt-10 text-center">
          <Button
            variant="contained"
            onClick={loadMore}
            className="bg-[var(--gray-color)]"
          >
            Load More
          </Button>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="user-delete-title">
          {"Are you sure you want to delete this user?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            onClick={() => {
              deleteUser(deleteUserId);
              handleDeleteClose();
            }}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog
        open={openUpdate}
        onClose={handleUpdateClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="user-update-title">
          <UpdateUser
            user={currentUser}
            handleUpdateClose={handleUpdateClose}
          />
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleUpdateClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllUser;
