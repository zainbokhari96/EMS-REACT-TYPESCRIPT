import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, useEffect } from "react";
import { blue } from "@mui/material/colors";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Grid, Button } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import _ from "lodash";

import { useAppSelector } from "../../redux/reduxHook";
import { Attendance } from "../../redux/reducers/admin/attendanceReducer";

import CreateAttendanceDialog from "./createAttendanceDialog";

interface AttendanceTable {
  row : Attendance
}

const CollapsibleTable:React.FC<AttendanceTable> = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row ? row.name : ""}
        </TableCell>
        <TableCell align="center"> {row ? row.email : ""}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row && row.Attendances
                    ? row.Attendances.map((historyRow) => (
                        <TableRow key={historyRow.date}>
                          <TableCell component="th" scope="row">
                            {moment.utc(historyRow.date).format("MM/DD/YYYY")}
                          </TableCell>
                          <TableCell
                            sx={{
                              color:
                                historyRow.status === "Present"
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {historyRow.status}
                          </TableCell>
                        </TableRow>
                      ))
                    : () => {}}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const Attendances = () => {
  const dispatch = useDispatch();
  const [attendance, setAttendance] = useState<Attendance | any>();
  const [sorting, setSorting] = useState<string>("desc");
  const data = useAppSelector((state) =>
    state.attendanceReducer.attendance.length > 1
      ? state.attendanceReducer.attendance
      : [{}]
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    setAttendance(data);
  }, [data]);

  const sort = (column:string) => {
    if (column === "name") {
      if (sorting === "desc") {
        let sorting = _.orderBy(attendance, ["name"], ["asc"]);
        setAttendance(sorting);
        setSorting("asc");
      } else {
        let sorting = _.orderBy(attendance, ["name"], ["desc"]);
        setAttendance(sorting);
        setSorting("desc");
      }
    } else {
      if (sorting === "desc") {
        let sorting = _.orderBy(attendance, ["email"], ["asc"]);
        setAttendance(sorting);
        setSorting("asc");
      } else {
        let sorting = _.orderBy(attendance, ["email"], ["desc"]);
        setAttendance(sorting);
        setSorting("desc");
      }
    }
  };
  const currentCompany = useAppSelector((state) =>
    state.companyReducer.currentCompany
      ? state.companyReducer.currentCompany
      : null
  );
  useEffect(() => {
    dispatch({ type: "FETCH_ATTENDANCE_REQUEST", currentCompany });
  }, []);
  if (attendance) {
    return (
      <Grid container>
        <Grid item xs={12} sx={{ mt: 3, mb: 3 }}>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button variant="contained" onClick={toggleModal}>
              Create Attendance
            </Button>
          </div>
        </Grid>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead sx={{ backgroundColor: blue["900"] }}>
              <TableRow>
                <TableCell />
                <TableCell sx={{ color: "white" }}>
                  <div style={{ display: "flex", marginTop: 1 }}>
                    Employee Name{" "}
                    <IconButton
                      onClick={() => {
                        sort("name");
                      }}
                      sx={{ color: "white", mt: -1 }}
                    >
                      <ImportExportIcon />
                    </IconButton>
                  </div>{" "}
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  Email
                  <IconButton
                    onClick={() => {
                      sort("email");
                    }}
                    sx={{ color: "white", mt: -1 }}
                  >
                    <ImportExportIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((item:Attendance, index:number) => (
                <CollapsibleTable key={index} row={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CreateAttendanceDialog isOpen={showModal} toggle={toggleModal} />
      </Grid>
    );
  } else {
    return (
      <>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
        >
          No Data Available
        </div>
        <CreateAttendanceDialog isOpen={showModal} toggle={toggleModal} />
      </>
    );
  }
}

export default Attendances;
