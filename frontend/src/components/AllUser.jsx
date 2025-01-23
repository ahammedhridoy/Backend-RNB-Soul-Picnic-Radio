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
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import UpdateUser from "./UpdateUser";

const AllUser = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  // Delete dialog handlers
  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  // Update dialog handlers
  const handleUpdateOpen = () => {
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  return (
    <div className="w-full my-10">
      <h1 className="mb-5 text-2xl font-bold">All User</h1>
      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold" align="right">
                Email
              </TableCell>
              <TableCell className="font-bold" align="right">
                Role
              </TableCell>
              <TableCell className="font-bold" align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleUpdateOpen()}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteOpen()}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
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
              <UpdateUser handleUpdateClose={handleUpdateClose} />
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleUpdateClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllUser;
