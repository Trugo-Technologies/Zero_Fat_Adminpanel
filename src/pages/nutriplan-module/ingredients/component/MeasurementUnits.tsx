/** @format */

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Grid, IconButton, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { useIntl } from "react-intl";
import OutlinedTextInput from "src/Components/formik-input/outlined-text-input";
import SelectInput from "src/Components/formik-input/select-input";
import { useGetAllMeasurementUnitsQuery } from "../../measurementUnits/services/api";
function MeasurementUnits() {
  const { messages } = useIntl();
  const { values, setFieldValue, errors }: any = useFormikContext();
  const { data: measurementUnitsData } = useGetAllMeasurementUnitsQuery({});
  const measurementUnits = measurementUnitsData?.data?.map((e) => ({
    key: e.nameEn,
    value: e.id,
  }));

  return (
    <Grid container item spacing={2} xs={12} alignItems='center'>
      <Grid item md={12}>
        {" "}
        <Typography
          sx={{
            fontSize: "19px",
            color: "gray",
            marginBottom: "3px",
            fontWeight: 500,
          }}>
          {messages["ingredients.IngredientMeasurementUnits"] as string}
        </Typography>
      </Grid>

      {values?.ingredientMeasurementUnits?.map(
        (element: any, index: number) => (
          <>
            {" "}
            <Grid item md={5}>
              <SelectInput
                name={`ingredientMeasurementUnits[${index}.measurementUnitId]`}
                label='ingredients.IngredientMeasurementUnits'
                options={measurementUnits}
                onChange={(e) => {
                  // index === values?.IngredientMeasurementUnits.length - 1 &&
                  //   setFieldValue(`IngredientMeasurementUnits`, [
                  //     ...values?.IngredientMeasurementUnits,
                  //     { measurementUnitId: "", weight: 0 },
                  //   ]);
                  setFieldValue(
                    `ingredientMeasurementUnits[${index}.measurementUnitId]`,
                    e.target.value
                  );
                }}
              />
            </Grid>
            <Grid item md={5}>
              <OutlinedTextInput
                name={`ingredientMeasurementUnits[${index}].equivalentInUnit`}
                label='ingredients.weight'
                type='number'
                onChange={(e) => {
                  setFieldValue(
                    `ingredientMeasurementUnits[${index}].equivalentInUnit`,
                    +e.target.value
                  );
                }}
              />
            </Grid>
            <Grid item md={2}>
              {index === values?.ingredientMeasurementUnits.length - 1 && (
                <IconButton
                  onClick={() => {
                    setFieldValue(`ingredientMeasurementUnits`, [
                      ...values?.ingredientMeasurementUnits,
                      { measurementUnitId: "", equivalentInUnit: 0 },
                    ]);
                  }}>
                  <AddCircleOutlineIcon />
                </IconButton>
              )}
              <IconButton
                disabled={values.ingredientMeasurementUnits.length === 1}
                onClick={() => {
                  setFieldValue(
                    `ingredientMeasurementUnits`,
                    values.ingredientMeasurementUnits.filter(
                      (row: any, rowIndex: number) => rowIndex !== index
                    )
                  );
                }}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
          </>
        )
      )}
    </Grid>
  );
}

export default MeasurementUnits;
