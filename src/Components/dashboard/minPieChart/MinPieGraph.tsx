/** @format */

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { MinPieChartType } from "src/types/modules/dashboard";

type Props = {
  data: MinPieChartType[];
};

const MinPieGraph = ({ data }: Props) => {
  return (
    <ResponsiveContainer height={195}>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          innerRadius='80%'
          outerRadius='95%'
          nameKey='title'
          
          dataKey='value'>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          labelStyle={{ color: "black" }}
          contentStyle={{
            borderRadius: 12,
            borderColor: "#31354188",
            background: "#FFFFFFCA",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MinPieGraph;
