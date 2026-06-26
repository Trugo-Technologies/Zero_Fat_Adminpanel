/** @format */

import {
  Box,
  Collapse,
  IconButton,
  IconButtonProps,
  Switch,
  styled,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTranslation } from "src/hooks/use-translation";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/EditNote";
import LinearProgress from "@mui/material/LinearProgress";
import TableCellHeader, {
  StyledTableCell,
} from "src/Components/generic-table/table-cell-header";
import DeleteDialog from "src/Components/dialog/delete-dialog";
import TablePagination from "@mui/material/TablePagination";
import useGetIsRtlDirection from "src/hooks/use-get-is-rtl-direction";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "src/Components/error/error-alert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface Row {
  id: string | number;
  [key: string]: any;
}

export interface GenericTableType<T> {
  page?: number;
  header: {
    key: string;
    value: string | React.ReactNode;
    sort?: (type: -1 | 1) => void;
  }[];
  hideColumns?: string[];
  rows: Array<T>;
  onPageChange?: (value: number) => void;
  limits?: number[];
  onLimitChange?: (e: string) => void;
  totalRecords: number;
  action?: {
    delete?: (id: string) => void;
    update?: string | Function;
    activation?: {
      key: string;
      handler: (id: string, currentValue: boolean) => void;
    };
  };
  loading?: boolean;
  limit?: number;
  isError?: boolean;
  nested?: {
    activeId?: (id: string) => void;
    colSpan: number;
    arrayKey: string;
    header: {
      key: string;
      value: string | React.ReactNode;
    }[];
  };
}

function GenericTable<
  T extends { id: any; removeDelete?: boolean; removeUpdate?: boolean },
>({
  header,
  page,
  rows = [],
  onPageChange,
  limits = [10, 20, 50],
  onLimitChange,
  totalRecords = 0,
  action,
  loading,
  limit,
  isError,
  hideColumns,
  nested,
}: GenericTableType<T>) {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");
  const isRtl = useGetIsRtlDirection();
  const [showDeleteModal, setShow] = useState("");
  const [activeSortKey, setActive] = useState("");
  const [expandedCollapse, setExpand] = useState("");
  const sliderRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [cursorStyle, setCursorStyle] = useState(""); // Default cursor style
  const startDragging = (e: any) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current?.offsetLeft);
    setScrollLeft(sliderRef.current?.scrollLeft);
    setCursorStyle("grab");
  };

  const stopDragging = () => {
    setIsDragging(false);
    setCursorStyle("");
  };

  const onDragging = (e: any) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current?.offsetLeft;
    const walk = (x - startX) * 2; // The number here (2) determines how fast the scroll moves
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  useEffect(() => {
    if (nested && nested.activeId) {
      nested.activeId(expandedCollapse);
    }
  }, [expandedCollapse]);
  if (isError) return <ErrorAlert />;
  return (
    <>
      <Box sx={{ height: "0px" }}>
        {loading && (
          <LinearProgress
            sx={{
              height: "3px",
              // borderRadius: "12px 12px 0 0",
              // width: "99.8%",
              margin: "0 auto",
            }}
            color='secondary'
          />
        )}
      </Box>
      <TableContainer
        sx={{
          boxShadow: " 0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02);",
          borderRadius: "0 0 10px 10px",
          cursor: cursorStyle,
        }}
        component={Paper}
        ref={sliderRef}
        onMouseDown={startDragging}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={onDragging}>
        <Table>
          <TableHead>
            <TableRow>
              <>
                {header
                  .filter((h) => !hideColumns?.includes(h.key))
                  .map((h, i) => (
                    <TableCellHeader
                      activeSortKey={activeSortKey}
                      setActive={setActive}
                      key={i}
                      header={h}
                      loading={loading ?? false}
                    />
                  ))}
                {action ? (
                  <StyledTableCell align='right'></StyledTableCell>
                ) : null}
                {nested ? (
                  <StyledTableCell align='right'></StyledTableCell>
                ) : null}
              </>
            </TableRow>
          </TableHead>

          <TableBody>
            <>
              {rows.map((row, i) => {
                return (
                  <React.Fragment key={i}>
                    <StyledTableRow key={i}>
                      <>
                        {header
                          .filter((h) => !hideColumns?.includes(h.key))
                          .map((h, i) => (
                            <StyledTableCell
                              sx={{ minWidth: "160px" }}
                              key={i}
                              component='th'
                              scope='row'>
                              {(row as Row)[`${h.key}`]}
                            </StyledTableCell>
                          ))}

                        {action && (
                          <StyledTableCell
                            sx={{ width: "300px" }}
                            align='right'
                            component='th'
                            scope='row'>
                            <Box sx={{ display: "flex" }}>
                              {action?.activation && !row?.removeUpdate && (
                                <Switch
                                  disabled={loading}
                                  checked={Boolean(
                                    (row as any)[action.activation.key]
                                  )}
                                  onChange={() => {
                                    action.activation?.handler(
                                      row.id,
                                      (row as any)[action.activation?.key]
                                    );
                                  }}
                                />
                              )}
                              {action?.update && !row?.removeUpdate && (
                                <>
                                  <IconButton
                                    disabled={loading}
                                    onClick={() => {
                                      if (typeof action.update === "string") {
                                        navigate(
                                          `${action?.update ?? ""}/${row.id}`
                                        );
                                      } else
                                        action.update && action.update(row.id);
                                    }}>
                                    <EditIcon color='primary' />
                                  </IconButton>
                                </>
                              )}
                              {action?.delete && !row?.removeDelete && (
                                <IconButton
                                  disabled={loading}
                                  onClick={() => {
                                    setShow(row.id);
                                  }}>
                                  <DeleteIcon color='error' />
                                </IconButton>
                              )}
                            </Box>
                          </StyledTableCell>
                        )}
                        {nested && (
                          <StyledTableCell component='th' scope='row'>
                            <ExpandMore
                              onClick={() =>
                                setExpand((prev) =>
                                  prev === "" || prev !== row.id ? row.id : ""
                                )
                              }
                              expand={expandedCollapse === row.id}>
                              <ExpandMoreIcon />
                            </ExpandMore>
                          </StyledTableCell>
                        )}
                      </>
                    </StyledTableRow>
                    {nested && (
                      <tr>
                        <StyledTableCell
                          sx={{ p: 0, width: "100%" }}
                          colSpan={nested.colSpan}>
                          <Collapse
                            in={expandedCollapse === row.id}
                            timeout='auto'
                            unmountOnExit>
                            <Box
                              sx={{
                                borderRadius: "12px   12px 0",
                                overflow: "hidden",
                                mb: 0,
                              }}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <>
                                      {nested?.header?.map((h, i) => (
                                        <TableCell
                                          key={h.key}
                                          sx={{
                                            color: "black",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid black",
                                            maxWidth: "140px",
                                          }}>
                                          {h.value}
                                        </TableCell>
                                      ))}
                                    </>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(
                                    (row as any)[nested.arrayKey] as any[]
                                  )?.map((medicine, index) => (
                                    <StyledTableRow
                                      key={index}
                                      sx={(theme) => ({
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.primary.light,
                                        },
                                      })}>
                                      <>
                                        {nested?.header?.map((nh, ni) => {
                                          return (
                                            <StyledTableCell
                                              key={ni}
                                              component='th'
                                              scope='row'>
                                              {(medicine as any)[`${nh.key}`]}
                                            </StyledTableCell>
                                          );
                                        })}
                                      </>
                                    </StyledTableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </StyledTableCell>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </>
          </TableBody>
        </Table>

        {/**pagination and rows section */}
        {!!onLimitChange && (page || !page) && !!onPageChange && limit ? (
          <TablePagination
            // sx={{
            //   "& .MuiToolbar-root": {
            //     flexDirection: isRtl ? "row-reverse" : "row",
            //     flexWrap: "wrap",
            //   },
            // }}
            dir='ltr'
            component='div'
            // labelRowsPerPage={t("rowsPerPage")}
            rowsPerPageOptions={limits}
            count={totalRecords}
            rowsPerPage={limit ?? 5}
            page={page ?? 0}
            onPageChange={(e, value) => {
              onPageChange(value);
            }}
            onRowsPerPageChange={(e) => {
              onLimitChange(e.target.value);
            }}
          />
        ) : null}
        {/**pagination and rows section */}
      </TableContainer>
      <DeleteDialog
        open={Boolean(showDeleteModal)}
        setOpen={setShow}
        deleteHandler={() => {
          if (action && action.delete) action.delete(showDeleteModal);
          setShow("");
        }}
      />
    </>
  );
}

export default GenericTable;
