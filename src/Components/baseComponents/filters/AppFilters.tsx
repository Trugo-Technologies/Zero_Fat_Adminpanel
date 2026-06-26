/** @format */

import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Zoom,
  Collapse,
  Box,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { FaFileExcel } from "react-icons/fa";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
interface IAdvanceFilterProps {
  showAdvanceFiltersButton?: boolean;
  advanceFiltersInputs?: React.ReactNode[];
  setAdvancedFilter?: any;
  advancedFilter?: any;
  isOpenAdvanceFilters?: boolean;
  filterAll?: any;

  setIsOpenAdvanceFilters?: any;
}
interface MenuItem {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  labelMenuItem: string;
}
interface IAppFiltersProps extends IAdvanceFilterProps {
  value?: string;
  onChangeKeywordValue?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectionModel: string[];
  showSearchInput?: boolean;
  addTitle?: string;
  errorFileButtonTile?: string;
  showAddButton?: boolean;
  showDailyUploadButton?: boolean;
  handleDailyUploadButtonClick?: () => void;
  setShowAddModal?: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeAddButton?: () => void;
  showDetailsErrorFileButton?: boolean;
  setShowDetailsErrorFile?: React.Dispatch<React.SetStateAction<boolean>>;
  // Second Button
  addSecondTitle?: string;
  showAddSecondButton?: boolean;
  setShowAddSecondModal?: React.Dispatch<React.SetStateAction<boolean>>;
  schemaNameForSecondButton?: string;
  entityNameForSecondButton?: string;
  refetch: () => void;
  // Multiple Select
  successUrl: string;
  setSelectionModel: React.Dispatch<
    React.SetStateAction<GridRowSelectionModel>
  >;
  showMultipleDeactivation?: boolean;
  showMultipleActivation?: boolean;
  showMultipleDeletion?: boolean;
  showCheckAll?: boolean;

  excelFileTitle?: string;
  callBack?: any;
  keyword?: string;
  isActive?: boolean;
  customQueries?: any;
  totalCount?: number;
  withExportPdfButton?: boolean;
  withExportExcelButton?: boolean;
  toolbarActions?: React.ReactNode;

  showAddButtonWithPage?: boolean;
  pathPage?: string;

  //drop down
  showDropDownButton?: boolean;
  titleDropDownButton?: string;
  menuItemsDropDown?: Array<MenuItem>;

  // For Indicators Values Page
  // Generate Excel
  generateTitle?: string;
  showGenerateButton?: boolean;
  setGenerateModal?: React.Dispatch<React.SetStateAction<boolean>>;
  // Import File
  importTitle?: string;
  showImportButton?: boolean;
  setImportModal?: React.Dispatch<React.SetStateAction<boolean>>;
  onClickMultipleExport?: () => void;
  deleteAllQuery?: any;
  deleteAllQueryLoading?: boolean;
  activeAllQuery?: any;
  activeAllQueryLoading?: boolean;
}

enum OperationTypeForSetAll {
  Delete = "Deletes",
  Active = "Active",
  InActive = "InActive",
}

const AppFilters: React.FC<IAppFiltersProps> = (props) => {
  const {
    onChangeKeywordValue,
    selectionModel,
    addTitle,
    setShowAddModal,
    onChangeAddButton = () => {},
    showAddButton = true,
    refetch = () => {},
    setSelectionModel,
    showSearchInput = true,
    showMultipleDeactivation = true,
    showMultipleActivation = true,
    showMultipleDeletion = true,
    showCheckAll = false,
    // Second Button
    addSecondTitle,
    setShowAddSecondModal,
    showAddSecondButton = false,

    withExportExcelButton = false,
    toolbarActions,
    showAddButtonWithPage = false,

    pathPage,
    deleteAllQuery,
    deleteAllQueryLoading = false,
    activeAllQuery,
    activeAllQueryLoading = false,
    onClickMultipleExport,
    showAdvanceFiltersButton = false,
    advanceFiltersInputs = [],
    isOpenAdvanceFilters = false,
    setIsOpenAdvanceFilters,
  } = props;

  const { messages } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //states
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showConfirmCheckAllModal, setShowConfirmCheckAllModal] =
    useState<boolean>(false);

  const [operationType, setOperationType] =
    useState<OperationTypeForSetAll | null>(null);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  //functions
  const onSuccess = useCallback(() => {
    setShowConfirmModal(false);
    setSelectionModel([]);
  }, []);

  const onConfirmMultipleDeletion = useCallback(() => {
    setShowConfirmModal(true);
    setOperationType(OperationTypeForSetAll.Delete);
    setDialogTitle("table.options.delete");
    setTitle("table.options.delete.title");
    // close dropdown
    handleClose();
  }, []);

  const onConfirmMultipleExport = useCallback(() => {
    onClickMultipleExport && onClickMultipleExport();
    // close dropdown
    handleClose();
  }, []);

  const onConfirmMultipleActivation = useCallback(() => {
    setShowConfirmModal(true);
    setOperationType(OperationTypeForSetAll.Active);
    setDialogTitle("table.options.activation");
    setTitle("table.options.activation.title");
    // close dropdown
    handleClose();
  }, []);

  const onConfirmMultipleDeactivation = useCallback(() => {
    setShowConfirmModal(true);
    setOperationType(OperationTypeForSetAll.InActive);
    setDialogTitle("table.options.deactivation");
    setTitle("table.options.deactivation.title");
    // close dropdown
    handleClose();
  }, []);

  const onConfirmMultiplePopup = useCallback(() => {
    if (operationType === OperationTypeForSetAll.Delete) {
      deleteAllQuery(selectionModel)
        .unwrap()
        .then(onSuccess)
        .catch(() => {});
    } else if (operationType === OperationTypeForSetAll.Active) {
      activeAllQuery({ ids: selectionModel, isActive: true })
        .unwrap()
        .then(onSuccess)
        .catch(() => {});
    } else if (operationType === OperationTypeForSetAll.InActive) {
      activeAllQuery({ ids: selectionModel, isActive: false })
        .unwrap()
        .then(onSuccess)
        .catch(() => {});
    }
  }, [operationType, selectionModel]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //   const mutation = useSetAllService<IBaseSetAllDto, number>(AppUrls.Shared, null, BaseActions.SetAll, onSuccess);

  //   const mutationForCheckAll = useSetAllService<IBaseSetAllDto, number>(AppUrls.Shared, null, BaseActions.SetAll, onSuccess);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Search Input */}
            {showSearchInput && (
              <Grid item>
                <TextField
                  label={<IntlMessages id='common.search' />}
                  variant='outlined'
                  size='small'
                  onChange={debounce(
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                      onChangeKeywordValue && onChangeKeywordValue(event);
                    },
                    1000
                  )}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            {/* Multiple Activation */}
            {selectionModel?.length > 0 && (
              <Grid item>
                <IconButton
                  aria-label='more'
                  id='long-button'
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup='true'
                  onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id='long-menu'
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 200,
                      width: "25ch",
                    },
                  }}>
                  <MenuItem
                    key={"common.activeAll"}
                    onClick={() => {
                      onConfirmMultipleActivation();
                    }}>
                    <IntlMessages id='common.activeAll' />
                  </MenuItem>
                  <MenuItem
                    key={"common.deactiveAll"}
                    onClick={() => {
                      onConfirmMultipleDeactivation();
                    }}>
                    <IntlMessages id='common.deactiveAll' />
                  </MenuItem>
                  <MenuItem
                    key={"common.deleteAll"}
                    onClick={onConfirmMultipleDeletion}>
                    <IntlMessages id='common.deleteAll' />
                  </MenuItem>
                  {onClickMultipleExport && (
                    <MenuItem
                      key={"common.exportAll"}
                      onClick={onConfirmMultipleExport}>
                      <IntlMessages id='common.exportAll' />
                    </MenuItem>
                  )}
                </Menu>
              </Grid>
            )}

            <Grid item sx={{ ml: "auto" }}>
              {/* Export Excel Button */}
              {withExportExcelButton && (
                <Tooltip title={<IntlMessages id='common.export' />}>
                  <Zoom in style={{ transitionDelay: "300ms" }}>
                    <IconButton
                      color='primary'
                      sx={{
                        borderRadius: 8,
                        padding: "0px 10px",
                        "& .MuiSvgIcon-root": {
                          fontSize: 26,
                        },
                      }}
                      onClick={() => {}}>
                      <FaFileExcel color='#2E7D32' />
                    </IconButton>
                  </Zoom>
                </Tooltip>
              )}
              <AppIconButton
                label='table.actions.refetch'
                handleClick={() => {
                  refetch();
                }}
                sxProp={{
                  backgroundColor: "#a5d060",
                  "&:hover": {
                    backgroundColor: "#a5d060",
                  },
                  margin: "0px 10px",
                }}
                childComp={
                  <ReplayIcon fontSize='small' sx={{ color: "#fff" }} />
                }
              />

              {/* Advance Filters Button */}
              {showAdvanceFiltersButton && (
                <Zoom in style={{ transitionDelay: "300ms" }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsOpenAdvanceFilters && setIsOpenAdvanceFilters(!isOpenAdvanceFilters)}
                    startIcon={<FilterListIcon />}
                    sx={{ height: 40, px: 3, mr: 1, borderRadius: 8, borderColor: "#E2E8F0", color: "#0F172A", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#F8FAFC" } }}
                  >
                    <IntlMessages id="common.filter" defaultMessage="Filters" />
                  </Button>
                </Zoom>
              )}

              {toolbarActions && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    verticalAlign: "middle",
                    ml: 1,
                    mr: 1,
                    "& .MuiButton-root": { width: "auto", whiteSpace: "nowrap" },
                  }}>
                  {toolbarActions}
                </Box>
              )}

              {/* Add Button */}
              {showAddButton && (
                // <AppPermissionsGate schemaName={schemaName} entityName={entityName} action={action}>
                <Zoom in style={{ transitionDelay: "300ms" }}>
                  <Button
                    variant='contained'
                    sx={{
                      borderRadius: 8,
                      "& .MuiSvgIcon-root": {
                        fontSize: 26,
                      },
                    }}
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setShowAddModal && setShowAddModal(true);
                      onChangeAddButton && onChangeAddButton();
                    }}>
                    <IntlMessages id={addTitle} />
                  </Button>
                </Zoom>
                // </AppPermissionsGate> ReplayIcon
              )}

              {/* <AppPermissionsGate schemaName={schemaName} entityName={entityName} action={action}> */}
              {showAddButtonWithPage && (
                <Zoom in style={{ transitionDelay: "300ms" }}>
                  <Button
                    variant='contained'
                    sx={{
                      borderRadius: 8,
                      "& .MuiSvgIcon-root": {
                        fontSize: 26,
                      },
                    }}
                    startIcon={<AddIcon />}
                    onClick={() => pathPage && navigate(pathPage)}>
                    <IntlMessages id={addTitle} />
                  </Button>
                </Zoom>
              )}

              {/* Second Add Button If Exist */}
              {showAddSecondButton && (
                // <AppPermissionsGate
                //   schemaName={schemaNameForSecondButton || ''}
                //   entityName={entityNameForSecondButton || ''}
                //   action={actionForSecondButton ? actionForSecondButton : PermissionActionsTypes.FreePermissions}
                // >
                <Zoom in style={{ transitionDelay: "300ms" }}>
                  <Button
                    variant='contained'
                    sx={{
                      borderRadius: 8,
                      ml: 4,
                      mr: 4,
                      "& .MuiSvgIcon-root": {
                        fontSize: 26,
                      },
                    }}
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setShowAddSecondModal && setShowAddSecondModal(true)
                    }>
                    <IntlMessages id={addSecondTitle} />
                  </Button>
                </Zoom>
                // </AppPermissionsGate>
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* Advance Filters Collapse */}
        {showAdvanceFiltersButton && advanceFiltersInputs && advanceFiltersInputs.length > 0 && (
          <Grid item xs={12}>
            <Collapse in={isOpenAdvanceFilters}>
              <Box sx={{ border: "1px solid #E2E8F0", borderRadius: 3, p: 3, mt: 1, bgcolor: "#fff", display: "flex", alignItems: "flex-end", flexWrap: "wrap", gap: 3 }}>
                {advanceFiltersInputs.map((input, index) => (
                  <Box key={index}>{input}</Box>
                ))}
              </Box>
            </Collapse>
          </Grid>
        )}
      </Grid>

      {/* For Multiple Activation Confirmation */}
      {showConfirmModal && (
        <AppConfirmModal
          dialogTitle={dialogTitle}
          open={showConfirmModal}
          itemName=''
          setOpen={setShowConfirmModal}
          loading={deleteAllQueryLoading || activeAllQueryLoading}
          title={title}
          onConfirm={onConfirmMultiplePopup}
        />
      )}
    </>
  );
};

export default AppFilters;
