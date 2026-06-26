import { useState } from "react";
import GenericTable, { GenericTableType } from "../generic-table";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ColumnsIcon from "@mui/icons-material/ViewColumn";
import { useTranslation } from "src/hooks/use-translation";
import SearchInput from "./search-input";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import DateDialog from "../dialog/date-dialog";
import AddButton from "../add-button";
import { privilegeFeature } from "src/shared/privileges";

type propsType = {
  handleSearch?: (key: string) => void;
  filter?: (start: string, end: string) => void;
  title: string | React.ReactNode;
  feature?: privilegeFeature;
  onAdd?: string | Function;
  actionIcons?: React.ReactNode[];
  refetch?: Function;
  AdditionalComponent?: React.ReactNode;
  hideColumnPopup?: boolean;
};
function MainTable<
  T extends { id: any; removeDelete?: boolean; removeUpdate?: boolean },
>({
  feature,
  onAdd,
  filter,
  handleSearch,
  title,
  actionIcons,
  refetch,
  AdditionalComponent,
  hideColumnPopup = false,
  ...props
}: GenericTableType<T> & propsType) {
  const { t } = useTranslation("translation");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [search, setSearch] = useState(false);
  const [hideColumn, setHide] = useState<string[]>([]);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const showsColumns = props.header.filter(
    (h) => !props.hideColumns?.includes(h.key)
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        py: 3,
        bgcolor: "white",
        borderRadius: "12px",
        border: "1px solid #E9EFF6",
      }}
    >
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography
            color="grey.500"
            variant="h1"
            sx={{
              ml: 1,
            }}
          >
            {typeof title === "string" ? t(title) : title}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "5px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {handleSearch && (
            <>
              <SearchInput
                openSearch={search}
                setOpenSearch={setSearch}
                search={handleSearch}
              />
              <Tooltip title={t("search")} enterDelay={500} placement="top">
                <IconButton onClick={() => setSearch(!search)}>
                  {search ? <SearchOffIcon /> : <SearchIcon />}
                </IconButton>
              </Tooltip>
            </>
          )}
          {filter && <DateDialog filter={filter} isIcon />}

          {!hideColumnPopup && (
            <IconButton aria-describedby={id} onClick={handleClick}>
              <ColumnsIcon />
            </IconButton>
          )}
          {refetch && (
            <Tooltip title={t("refresh")} enterDelay={500} placement="top">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}

          {actionIcons ? <>{...actionIcons}</> : null}
          {onAdd && <AddButton feature={feature} url={onAdd} />}
        </Box>
      </Box>
      {AdditionalComponent && AdditionalComponent}
      <Divider sx={{ borderBottomWidth: "0px" }} />
      <GenericTable
        {...props}
        hideColumns={[...(props.hideColumns ?? []), ...hideColumn]}
      />
      <Popover
        key={id}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {showsColumns.map((c, i) => {
          const isHidden = hideColumn.some((h) => h === c.key);

          return (
            <Box
              key={c.key}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
                m: 1,
                alignItems: "center",
              }}
            >
              <Switch
                checked={!isHidden}
                onChange={() => {
                  if (!isHidden) {
                    setHide((prev) => prev.concat(c.key));
                  } else {
                    setHide((prev) => prev.filter((d) => d !== c.key));
                  }
                }}
                size="small"
              />
              <Typography>{c.value}</Typography>
            </Box>
          );
        })}
      </Popover>
    </Box>
  );
}

export default MainTable;
