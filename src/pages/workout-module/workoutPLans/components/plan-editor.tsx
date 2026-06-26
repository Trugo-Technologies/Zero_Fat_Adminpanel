/** @format */

import AppFreeEditor from "src/Components/baseComponents/inputs/AppFreeEditor";

function PlanEditor({ name }: { name: "OverviewAr" | "OverviewEn" }) {
  return <AppFreeEditor label={name} name={name} />;
}

export default PlanEditor;
