/** @format */

import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import DailyMenuMealsPage from "./DailyMenuMealsPage";
import {
  CUSTOMIZE_MENU_MACRO_OPTIONS,
  CustomizeMenuMacroType,
} from "./customizeMenuHelpers";

interface ICustomizeMealTypeMealsPanelProps {
  date?: string;
  dates: string[];
  mealTypeId?: string;
  mealPlanId?: string;
  mealPlan?: IMealPlans;
  mealType?: IMealTypes;
}

const CustomizeMealTypeMealsPanel: React.FC<
  ICustomizeMealTypeMealsPanelProps
> = (props) => {
  const { messages } = useIntl();
  const [macroTab, setMacroTab] = useState<CustomizeMenuMacroType>(
    CustomizeMenuMacroType.Protein
  );

  return (
    <Box>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
        {(messages["dailyMenuMeals.customize.sectionsHint"] as string) ||
          "Add and manage meals separately for Protein, Carbs, and Fiber."}
      </Typography>

      <TabContext value={macroTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(_, value: CustomizeMenuMacroType) => setMacroTab(value)}
            aria-label='customize macro tabs'
            sx={{
              minHeight: 40,
              "& .MuiTab-root": {
                minHeight: 40,
                textTransform: "none",
                fontWeight: 600,
              },
            }}>
            {CUSTOMIZE_MENU_MACRO_OPTIONS.map((option) => (
              <Tab
                key={option.value}
                label={(messages[option.labelKey] as string) || option.fallback}
                value={option.value}
              />
            ))}
          </TabList>
        </Box>

        {CUSTOMIZE_MENU_MACRO_OPTIONS.map((option) => (
          <TabPanel
            key={option.value}
            value={option.value}
            sx={{ px: 0, pt: 2, pb: 0 }}>
            {macroTab === option.value ? (
              <DailyMenuMealsPage
                {...props}
                macroType={option.value}
                isCustomizeSection
              />
            ) : null}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default CustomizeMealTypeMealsPanel;
