/** @format */

import { Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import OutlinedTextInput from "src/Components/formik-input/outlined-text-input";
import { useFormikContext } from "formik";
import SelectInput from "src/Components/formik-input/select-input";
import { useGetAllNutrientsAttributesQuery } from "src/pages/nutriplan-module/nutrientsAttributes/services/api";

function AttributesTable() {
  const { messages } = useIntl();
  const { values, setFieldValue, errors }: any = useFormikContext();
  const { data } = useGetAllNutrientsAttributesQuery({});
  const lequidOptions = [
    { key: "g", value: "g" },
    { key: "ml", value: "ml" },
  ];
  const solidCostOptions = [{ key: "g", value: "g" }];
  const lequidCostOptions = [
    { key: "l", value: "l" },
    { key: "ml", value: "ml" },
  ];
  const solidOptions = [
    { key: "kg", value: "kg" },
    { key: "g", value: "g" },
  ];
  const unitOptions =
    values["BasicUnit"] === "Solid" ? solidCostOptions : lequidCostOptions;
  return (
    <Grid container spacing={3} xs={12}>
      <Grid item xs={12} md={6}>
        <SelectInput
          disabled={!values["BasicUnit"]}
          name='CaloriesUnit'
          label={"ingredients.CaloriesUnit"}
          options={
            values["BasicUnit"] === "Solid" ? solidOptions : lequidOptions
          }
        />
      </Grid>
      <Grid container item xs={12} alignItems='center' spacing={1}>
        <Grid item md={5.5}>
          <OutlinedTextInput
            name='Price'
            label='ingredients.price'
            type='number'
          />
        </Grid>
        <Grid item md={0.5}>
          {messages["ingredients.AED"] as string}
        </Grid>
        <Grid item md={3}>
          <OutlinedTextInput name='unitNumber' label={""} type='number' />
        </Grid>
        <Grid item md={1.5}>
          <SelectInput
            disabled={!values["BasicUnit"]}
            name='unit'
            label={messages["common.defult"] as string}
            options={unitOptions}
            defaultValue={unitOptions[0].value}
          />
        </Grid>
        <Grid item md={1.5}>
          (
          {values.CostPer100Unit
            ? values.CostPer100Unit
            : values.Price && values.unitNumber
              ? (values.Price / values.unitNumber).toFixed(5)
              : 0}
          AED / 100
          {values.unit})
        </Grid>
      </Grid>
      <Grid container item md={12}>
        <Grid item md={6}>
          {" "}
          <Typography
            sx={{
              fontSize: "19px",
              color: "gray",
              marginBottom: "3px",
              fontWeight: 500,
            }}>
            {messages["ingredients.Attributes"] as string}
          </Typography>
          <Typography color='error'>{errors?.attributes} </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{ marginBottom: "10px", fontSize: "14px", fontWeight: 600 }}>
        {messages["ingredients.name"] as string}
      </Grid>
      <Grid
        item
        xs={6}
        sx={{ marginBottom: "10px", fontSize: "14px", fontWeight: 600 }}>
        {messages["ingredients.value"] as string}
      </Grid>
      {data?.data.map((item, index) => (
        <Grid
          container
          item
          xs={12}
          alignItems='center'
          sx={{
            background: index % 2 === 0 ? "rgba(0, 0, 0, 0.04)" : "",
            borderRadius: "10px",
            padding: "8px 2px",
          }}>
          <Grid item xs={6}>
            {item?.nameEn}
          </Grid>
          <Grid container item xs={6} alignItems='center' spacing={2}>
            <Grid item xs={3}>
              <OutlinedTextInput
                name={`AttributesObj[${item?.id}].value`}
                onChange={(e) => {
                  const newObj = {
                    ...values.AttributesObj,
                    [item?.id]: {
                      nameEn: item.nameEn,
                      nameAr: item.nameAr,
                      unit: item.unit,
                      value: +e.target.value,
                      nutrientsAttributeId: item.id,
                    },
                  };
                  if (!e.target.value) delete newObj[item?.id];
                  setFieldValue("attributes", Object.values(newObj));
                  setFieldValue("AttributesObj", newObj);
                }}
                label='ingredients.value'
                type='number'
              />
            </Grid>
            <Grid item xs={3}>
              {item?.unit}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default AttributesTable;
