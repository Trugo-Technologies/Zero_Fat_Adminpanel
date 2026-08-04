/** @format */



import StarOutlineIcon from "@mui/icons-material/StarOutline";

import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";

import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";

import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

import { Box, Grid, Typography } from "@mui/material";

import { ReportColors } from "src/assets/colors/colorSet";

import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";

import StatisticsBaseTitle from "src/Components/dashboard/StatisticsBaseTitle";

import StatsCard from "src/Components/dashboard/StatsCard";

import { useGetMealRatingsSummaryQuery } from "src/pages/dashboard/services/api";

import RecentMealRatingsTable from "./RecentMealRatingsTable";



const MealRatingStatistics = () => {

  const {

    data: ratingsData,

    isLoading,

    isError,

  } = useGetMealRatingsSummaryQuery({ id: "" });



  const ratingsSummary = ratingsData?.data ?? {
    totalRatings: 0,
    notGood: 0,
    good: 0,
    awesome: 0,
  };



  return (

    <LoadingAndErrorWrapper isLoading={isLoading} errorMessage="">

      <Box mb={8}>

        <StatisticsBaseTitle title="sidebar.mealRatings" />



        {isError && (

          <Typography sx={{ fontSize: 13, color: "warning.main", mb: 2 }}>

            Rating summary could not be loaded from the server.

          </Typography>

        )}



        <Grid container spacing={4} sx={{ mb: 4 }}>

          <Grid item xs={12} sm={6} md={3}>

            <StatsCard

              data={{

                color: ReportColors.green,

                icon: <StarOutlineIcon />,

                value: ratingsSummary.totalRatings,

                name: "dashboard.totalRatings",

              }}

            />

          </Grid>

          <Grid item xs={12} sm={6} md={3}>

            <StatsCard

              data={{

                color: ReportColors.green,

                icon: <WorkspacePremiumOutlinedIcon />,

                value: ratingsSummary.awesome,

                name: "dashboard.awesomeRatings",

              }}

            />

          </Grid>

          <Grid item xs={12} sm={6} md={3}>

            <StatsCard

              data={{

                color: ReportColors.orange,

                icon: <ThumbUpAltOutlinedIcon />,

                value: ratingsSummary.good,

                name: "dashboard.goodRatings",

              }}

            />

          </Grid>

          <Grid item xs={12} sm={6} md={3}>

            <StatsCard

              data={{

                color: ReportColors.red,

                icon: <ThumbDownAltOutlinedIcon />,

                value: ratingsSummary.notGood,

                name: "dashboard.notGoodRatings",

              }}

            />

          </Grid>

        </Grid>



        <RecentMealRatingsTable />

      </Box>

    </LoadingAndErrorWrapper>

  );

};



export default MealRatingStatistics;

