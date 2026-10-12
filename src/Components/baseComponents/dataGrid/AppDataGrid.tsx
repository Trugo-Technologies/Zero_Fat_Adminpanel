/** @format */

import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridColumnVisibilityModel,
  GridEditMode,
  GridEventListener,
  GridInitialState,
  GridRowModel,
  GridRowModesModel,
  GridRowSelectionModel,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import * as React from "react";
import { useIntl } from "react-intl";

interface IAppDataGridProps {
  headerHeight?: number;
  pageSize: number;
  pageNumber: number;
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (pageNumber: number) => void;
  onSortModelChange: (result: string[] | null) => void;
  columns: GridColDef[];
  rows: any[];
  loading: boolean;
  checkboxSelection?: boolean;
  rowCount: number;
  tableName: string;
  //for menu
  disableColumnMenu?: boolean;
  disableColumnSelector?: boolean;
  //edit
  processRowUpdate?: (newRow: GridRowModel) => Promise<
    | {
        data: void;
      }
    | {
        error: unknown;
      }
  >;
  editMode?: GridEditMode;
  rowModesModel?: GridRowModesModel;
  handleRowModesModelChange?: (
    rowModesModel: GridRowModesModel,
    details: GridCallbackDetails<any>
  ) => void;
  handleRowEditStop?: GridEventListener<"rowEditStop">;
  //for selections
  onSelectionModelChange?: (selectionModel: GridRowSelectionModel) => void;
  selectionModel?: GridRowSelectionModel;
  /** Keep selected row ids even when they are not on the current server page */
  keepNonExistentRowsSelected?: boolean;
  // When use data grid with another id key
  getRowId?: (row: any) => any;
  initialState?: GridInitialState;
}

const AppDataGrid: React.FC<IAppDataGridProps> = (props) => {
  const {
    headerHeight = 40,
    pageSize,
    pageNumber,
    columns,
    rows,
    loading,
    rowCount,
    onPageSizeChange,
    onPageChange,
    checkboxSelection = true,
    onSelectionModelChange = () => {},
    onSortModelChange,
    disableColumnMenu = true,
    disableColumnSelector = false,
    selectionModel,
    keepNonExistentRowsSelected = false,
    getRowId,
    tableName = "test",
    initialState,
    //edit row
    processRowUpdate,
    editMode,
    rowModesModel,
    handleRowModesModelChange,
    handleRowEditStop,
  } = props;

  const { locale, messages } = useIntl();
  const [columnsView, setColumnsView] = React.useState(columns);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<{
    [key: string]: boolean;
  }>({});

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  };
  React.useEffect(() => {
    const generateInitialVisibility = (
      cols: GridColDef[]
    ): GridColumnVisibilityModel => {
      const visibility: GridColumnVisibilityModel = {};
      cols.forEach((col) => {
        // Set visibility based on hideable property
        visibility[col.field] = col.hideable ? false : true; // Default to true if hideable
      });
      return visibility;
    };

    // Load column visibility from local storage on mount
    const storedColumns = localStorage.getItem(`table_${tableName}`);
    if (storedColumns) {
      const parsedColumns = JSON.parse(storedColumns);
      setColumnVisibilityModel(parsedColumns);
    } else {
      // Set default visibility based on locale
      const initialVisibility = generateInitialVisibility(columns);
      setColumnVisibilityModel(initialState?.columns?.columnVisibilityModel!);
    }
  }, []); // Run only on mount

  // Save column visibility to local storage when it changes
  const handleColumnVisibilityModelChange = (model: {
    [key: string]: boolean;
  }) => {
    localStorage.setItem(`table_${tableName}`, JSON.stringify(model));
    setColumnVisibilityModel(model);
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <DataGrid
      rowCount={rowCount}
      //edit row
      editMode={editMode}
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={(error) => {
        console.log("error", error);
      }}
      paginationMode='server'
      paginationModel={{ page: pageNumber - 1, pageSize: pageSize }}
      onPaginationModelChange={(paginationModel) => {
        const { page, pageSize } = paginationModel;
        onPageChange(page);
        onPageSizeChange(pageSize);
      }}
      //For sorting
      sortingMode='server'
      onSortModelChange={(modal: GridSortModel) => {
        onSortModelChange(
          modal.length === 0 ? null : [`${modal[0].field} ${modal[0].sort}`]
        );
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
      initialState={initialState}
      //for selection
      onRowSelectionModelChange={onSelectionModelChange}
      rowSelectionModel={selectionModel}
      keepNonExistentRowsSelected={keepNonExistentRowsSelected}
      sx={{
        width: "100%",
        borderWidth: "0px !important",

        "& .MuiDataGrid-root": {
          border: "0px",
        },
        "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
          borderBottom: "0px",
        },
        "& .MuiDataGrid-columnHeaders": {
          borderBottom: "0px",
        },

        "& .MuiDataGrid-columnSeparator": {
          display: "none",
        },
      }}
      slots={{
        toolbar: CustomToolbar,
      }}
      disableRowSelectionOnClick
      //For style
      columnHeaderHeight={headerHeight}
      autoHeight
      disableColumnMenu={disableColumnMenu}
      checkboxSelection={checkboxSelection}
      disableColumnSelector={disableColumnSelector}
      pageSizeOptions={[10, 25, 50, 100]}
      getRowId={getRowId}
      showCellVerticalBorder={false}
      showColumnVerticalBorder={false}
      localeText={{
        footerRowSelected: (count) => {
          if (locale == "en-US") {
            if (count == 1)
              return `${count.toLocaleString()} ${messages["common.rowSelected"]}`;
            return `${count.toLocaleString()} ${messages["common.rowSelected"]}`;
          } else {
            return ` ${count.toLocaleString()} ${messages["common.rowSelected"]}`;
          }
        },
        noRowsLabel:
          locale == "en-US"
            ? "There are no records to display"
            : "لا يوجد بيانات لعرضها",

        MuiTablePagination: {
          labelRowsPerPage:
            locale == "en-US" ? "Rows per page" : "عدد الأسطر في الصفحة",
          labelDisplayedRows: ({ from, to, count }) => {
            return locale == "en-US"
              ? `${from} - ${to} of  ${count}`
              : `${from} - ${to} من ${count}`;
          },
        },
      }}
      //rest of props
      columns={columns}
      rows={rows}
      loading={loading}
    />
    </Box>
  );
};

export default AppDataGrid;
