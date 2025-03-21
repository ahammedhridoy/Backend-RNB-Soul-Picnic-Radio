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
import UpdateReport from "./UpdateReport";

const UserReports = () => {
  const { reports, deleteReport } = useContext(GlobalContext);
  const { visibleCount, loadMore } = usePagination(8, 8);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [deleteReportId, setDeleteReportId] = useState(null);

  console.log(deleteReportId);

  // Delete dialog handlers
  const handleDeleteOpen = (id) => {
    setDeleteReportId(id);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setDeleteReportId(null);
  };

  // Update dialog handlers
  const handleUpdateOpen = (report) => {
    setCurrentReport(report);
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
    setCurrentReport(null);
  };

  return (
    <div className="w-full my-10">
      <h1 className="mb-5 text-2xl font-bold">All Reports</h1>
      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Reason</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.slice(0, visibleCount).map((report) => (
              <TableRow
                key={report?.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {report?.reason}
                </TableCell>
                <TableCell align="right">{report?.reportStatus}</TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateOpen(report)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteOpen(report.id)}
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
      {reports?.length > visibleCount && (
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
          {"Are you sure you want to delete this report?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            onClick={() => {
              deleteReport(deleteReportId);
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
          <UpdateReport
            report={currentReport}
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

export default UserReports;
