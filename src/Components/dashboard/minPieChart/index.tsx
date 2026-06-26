/** @format */

import AppCard from "@crema/components/AppCard";
import { useIntl } from "react-intl";
import { Box, Typography } from "@mui/material";

import { styled } from "@mui/material/styles";
import AppList from "@crema/components/AppList";
import { MinPieChartType } from "src/types/modules/dashboard";
import MinPieGraph from "src/Components/dashboard/minPieChart/MinPieGraph";

const Row = styled("div")(({ theme }) => {
  return {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    marginLeft: -8,
    marginRight: -8,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
    "& .top-inquiry-col": {
      width: "100%",
      paddingLeft: 8,
      paddingRight: 8,
      [theme.breakpoints.up("sm")]: {
        width: "50%",
        display: "flex",
        alignItems: "center",
      },
      "& > div": {
        width: "100%",
      },
    },
    "& .top-inquiry-chart": {
      [theme.breakpoints.up("sm")]: {
        justifyContent: "center",
      },
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
    },
  };
});

type CellProps = {
  item: MinPieChartType;
};

const Cell = ({ item }: CellProps) => {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
      }}
      className='item-hover'>
      <Box
        sx={{
          mt: 1.5,
          bgcolor: item.color,
          minWidth: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          ml: 2,
          overflow: "hidden",
        }}>
        <Typography
          variant='h5'
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          component='h5'>
          {item.title}
        </Typography>
        <Box
          component='p'
          sx={{
            color: "text.secondary",
            fontSize: 14,
          }}>
          {item.value}
        </Box>
      </Box>
    </Box>
  );
};

type Props = {
  data: MinPieChartType[];
  title: string;
};

const MinPieChart = ({ data, title }: Props) => {
  const { messages } = useIntl();

  return (
    <AppCard
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      title={messages[title] as string}>
      <Row>
        <div className='top-inquiry-col top-inquiry-chart'>
          <MinPieGraph data={data} />
        </div>

        <div className='top-inquiry-col'>
          <AppList
            data={data}
            renderRow={(data) => (
              <Cell key={"itemPie-" + data.id} item={data} />
            )}
          />
        </div>
      </Row>
    </AppCard>
  );
};

export default MinPieChart;
