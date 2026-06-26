/** @format */

import { Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import { IBaseAdditionalResponseDetailsDto } from "src/types/baseEntity";
import AppItemView from "src/Components/baseComponents/other/AppItemView";

interface IAppMoreDetailsProps {
  spacing?: number;
  rowSpacing?: number;
  column?: number;
  isShowLogs?: boolean;
  moreDetails: IBaseAdditionalResponseDetailsDto;
}
const AppMoreDetails = (props: IAppMoreDetailsProps) => {
  const {
    spacing = 8,
    rowSpacing = 8,
    column = 3,
    moreDetails,
    isShowLogs = false,
  } = props;
  const location = useLocation();
  return (
    <>
      <Grid container spacing={spacing} rowSpacing={rowSpacing}>
        <AppItemView
          label={"createdBy"}
          value={moreDetails?.createdByName}
          type='text'
          column={column}
        />
        <AppItemView
          label='modifiedBy'
          value={moreDetails?.lastModifiedByName}
          type='text'
          column={column}
        />

        <AppItemView
          label='activatedBy'
          value={moreDetails?.activationChangedByName}
          type='text'
          column={column}
        />
        <AppItemView
          label='deletedBy'
          value={moreDetails?.deletedByName}
          type='text'
          column={column}
        />
        <AppItemView
          label={"creationDate"}
          value={moreDetails?.createdOn}
          type='dateTime'
          column={column}
        />

        {/* archiveStatusModifyDate */}

        <AppItemView
          label='modificationDate'
          value={moreDetails?.lastModifiedOn}
          type='dateTime'
          column={column}
        />

        <AppItemView
          label='activationDate'
          value={moreDetails?.activationChangedOn}
          type='dateTime'
          column={column}
        />
        <AppItemView
          label='deletionDate'
          value={moreDetails?.deletedOn}
          type='dateTime'
          column={column}
        />
        {isShowLogs === true ? (
          <Grid item xs={12}>
            {/* <Logs selectedId={selectedRow?.id} /> */}
          </Grid>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
};

export default AppMoreDetails;
