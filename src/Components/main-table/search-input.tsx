import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "src/hooks/use-translation";
type propsType = {
  openSearch: boolean;
  search: (key: string) => void;
  setOpenSearch: Function;
};
function SearchInput({ openSearch, search, setOpenSearch }: propsType) {
  const { t } = useTranslation("translation");
  const inputRef = useRef<any>();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value === "") search("");
    const timeout = setTimeout(() => {
      value !== "" ? search(value) : null;
    }, 700);
    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  useEffect(() => {
    if (openSearch) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [openSearch]);

  return (
    <TextField
      inputRef={inputRef}
      value={value}
      onBlur={() => {
        value === "" ? setOpenSearch(false) : undefined;
      }}
      onChange={(e) => setValue(e.target.value)}
      label={t("search")}
      variant="outlined"
      size="small"
      sx={{
        width: !openSearch ? "0px" : "250px",
        opacity: !openSearch ? "0" : "1",
        transition: "all 0.4s",
        overFlow: "hidden",
      }}
    />
  );
}

export default SearchInput;
