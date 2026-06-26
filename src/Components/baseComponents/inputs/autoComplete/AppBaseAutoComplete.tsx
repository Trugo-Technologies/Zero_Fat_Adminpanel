import { CircularProgress, Popper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import * as React from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface IAppBaseAutoCompleteProps {
  options: any[] | undefined;
  onChangeAutoComplete: (event: any, value: any) => void;
  isLoading: boolean;
  label: string;
  onChangeTextField?: (value: any) => void;
  error?: any;
  touched?: any;
  defaultValue?: any;
  value?: any;
  searchText?: string | undefined;
  disabled?: boolean;
  autoFocus?: boolean;
  key?: any;
  getOptionLabel?: (option: any) => string;
  pageNumber?: number;
  changePage?: (pageNumber: number) => void;

  hasNextPage?: boolean;
  filterKey?: string;
  anotherFilterKey?: string;

  multiple?: boolean;
}

const AppBaseAutoComplete: React.FC<IAppBaseAutoCompleteProps> = React.memo(
  (props) => {
    const { locale } = useIntl();

    const {
      options,
      onChangeAutoComplete,
      isLoading,
      label,
      onChangeTextField,
      error,
      touched,
      defaultValue,
      value,
      // pagination
      pageNumber,
      changePage,
      hasNextPage = false,
      searchText,
      getOptionLabel = (option: any) => {
        if (locale == "en-US" && option?.nameEn) {
          return option?.nameEn;
        } else return option?.nameAr;
      },
      disabled = false,
      autoFocus = false,
      key,
      filterKey = locale == "en-US" ? "nameEn" : "nameAr",
      anotherFilterKey,
      multiple = false,
    } = props;
    const [dataPagination, setDataPagination] = React.useState<Array<any>>([]);

    //for pagination
    React.useEffect(() => {
      if (options && !searchText && searchText == "") {
        if (pageNumber && pageNumber > 1) {
          setDataPagination([...dataPagination, ...options]);
        } else {
          setDataPagination([...options]);
        }
      } else if (options && searchText != "") {
        if (pageNumber && pageNumber > 1) {
          setDataPagination([...dataPagination, ...options]);
        } else {
          setDataPagination([...options]);
        }
      }
    }, [options]);

    return (
      <Autocomplete
        key={key}
        size="small"
        options={dataPagination || []}
        onChange={onChangeAutoComplete}
        multiple={multiple}
        // TODO It is possible to send the field name to change the nameEn and nameAr display
        getOptionLabel={getOptionLabel}
        loading={isLoading}
        defaultValue={defaultValue}
        loadingText="Loading..."
        autoHighlight
        disableCloseOnSelect={multiple}
        // disableListWrap
        // disableCloseOnSelect
        // PaperProps={{
        //   style: styles.listContainer,
        // }}
        // PaperComponent={{
        //   Pap
        // }}
        renderOption={(props, option) => (
          <>
            <li
              {...props}
              aria-disabled={option?.disabled}
              aria-selected={option?.disabled}
              style={{
                color: option?.disabled ? "#000" : "inherit",
                opacity: option?.disabled ? 1 : "inherit",
                backgroundColor: option?.disabled ? "#004A92" : "inherit",
              }}
            >
              {filterKey && option[filterKey]?.toString()
                ? option[filterKey]?.toString()
                : option[anotherFilterKey!]?.toString()}
            </li>
            {isLoading &&
              option === dataPagination[dataPagination.length - 1] && (
                <li {...props}>Loading...</li>
              )}
          </>
        )}
        // ref={scrollRef as any}

        ListboxProps={{
          // itemRef: scrollRef as any,

          onScroll: (event) => {
            const { scrollTop, clientHeight, scrollHeight } =
              event.target as HTMLElement;
            const threshold = 20; // Set your desired threshold here
            const isScrolledToBottom =
              scrollHeight - scrollTop - clientHeight < threshold;

            if (isScrolledToBottom && !isLoading && hasNextPage) {
              // scrollRef?.current && (scrollRef.current.scrollTop = scrollTop);
              changePage && pageNumber && changePage(pageNumber + 1);
            }
          },
          style: {
            maxHeight: "200px", // Set your desired height here
            overflowY: "auto",
          },
        }}
        // For search in mui on arabic and english language
        filterOptions={(options) => {
          return options;
          // return !searchText
          //   ? options
          //   : options.filter(
          //       (x) =>
          //         x[filterKey]
          //           ?.toString()
          //           ?.toLowerCase()

          //           ?.includes(searchText?.trim()?.toString().toLowerCase()) ||
          //         x[filterKey]
          //           ?.toString()
          //           ?.toLowerCase()
          //           ?.includes(searchText?.trim()?.toString().toLowerCase())
          //     );
        }}
        clearOnBlur={false}
        disabled={disabled}
        value={value}
        renderInput={(params) => (
          <TextField
            autoFocus={autoFocus}
            {...params}
            label={<IntlMessages id={label} />}
            onChange={onChangeTextField}
            error={touched && Boolean(error)}
            helperText={touched && error}
            value={searchText}
          />
        )}
      />
    );
  }
);

export default AppBaseAutoComplete;
