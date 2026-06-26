/** @format */

import AppCard from "@crema/components/AppCard";
import IntlMessages from "@crema/helpers/IntlMessages";
import { MinBarChartType } from "src/types/modules/dashboard";
import MinBarGraph from "src/Components/dashboard/minBarChart/MinBarGraph";

type Props = {
  data: MinBarChartType[];
  title: string;
};
const MinBarChart = ({ data = [], title }: Props) => {
  return (
    <AppCard title={<IntlMessages id={title} />} sxStyle={{ height: 1 }}>
      <MinBarGraph data={data} />
    </AppCard>
  );
};

export default MinBarChart;
