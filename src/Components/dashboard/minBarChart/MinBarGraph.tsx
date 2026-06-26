/** @format */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import Box from "@mui/material/Box";
import { Fonts } from "@crema/constants/AppEnums";
import { MinBarChartType } from "src/types/modules/dashboard";

type Props = {
  data: MinBarChartType[];
};

const MinBarGraph = ({ data = [] }: Props) => {
  return (
    <Box
      sx={{
        mt: 5,
        "& .graphText": {
          fontWeight: Fonts.MEDIUM,
          fontSize: 14,
        },
      }}
    >
      <ResponsiveContainer width="100%" height={235}>
        <BarChart
          barSize={8}
          data={data}
          margin={{ top: 15, right: 0, left: 0, bottom: 15 }}
        >
          <CartesianGrid strokeDasharray="3 3" style={{ paddingTop: 20 }} />
          <XAxis dataKey="value" />
          <YAxis hide />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="name" position="top" fill="#000" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MinBarGraph;
