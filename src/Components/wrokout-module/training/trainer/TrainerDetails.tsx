/** @format */

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Grid, IconButton } from "@mui/material";
import { useIntl } from "react-intl";
import TrainerTypeBadge from "src/Components/baseComponents/badge/TrainerTypeBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { removeHTMLTags } from "src/Helpers";
import { useGetTrainerQuery } from "src/pages/workout-module/training-module/trainer/services/api";
import { ITrainer } from "src/types/modules/training/trainers";
interface ITrainerDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const TrainerDetails = (props: ITrainerDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const {
    data: trainerItem,
    isLoading,
    error,
  } = useGetTrainerQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && trainerItem?.data?.nameEn!
            ? `- ${trainerItem?.data?.nameEn!}`
            : `- ${trainerItem?.data?.nameAr!}`
        }
        label='trains.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={trainerItem?.data as ITrainer}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='common.nameAr'
            value={trainerItem?.data?.nameAr}
            column={4}
          />
          <AppItemView
            label='common.nameEn'
            value={trainerItem?.data?.nameEn}
            column={4}
          />

          <AppItemView
            label='exercises.type'
            value={<TrainerTypeBadge label={trainerItem?.data?.type!} />}
            column={4}
          />
          <AppItemView
            label='common.status'
            value={trainerItem?.data?.isActive}
            column={4}
            type='isActive'
          />
          <AppItemView
            label='trainers.specialises'
            value={trainerItem?.data?.specialisesIn?.join(", ")}
            column={12}
          />

          <AppItemView
            type='image'
            label='common.avatarImage'
            value={trainerItem?.data?.avatarImageUrl}
            column={6}
          />
          <AppItemView
            type='image'
            label='trainers.profileMedia'
            value={trainerItem?.data?.profileMediaUrl}
            column={6}
          />

          <AppItemView
            label='trainers.briefAr'
            value={trainerItem?.data?.briefAr}
            column={6}
          />
          <AppItemView
            label='trainers.briefEn'
            value={trainerItem?.data?.briefEn}
            column={6}
          />
          <AppItemView
            label='trainers.descriptionAr'
            value={trainerItem?.data?.descriptionAr}
            column={6}
          />
          <AppItemView
            label='trainers.descriptionEn'
            value={trainerItem?.data?.descriptionEn}
            column={6}
          />
          <Grid container xs={12} justifyContent='center' mt={6}>
            {trainerItem?.data?.facebookUrl && (
              <IconButton
                onClick={() => {
                  window.open(
                    trainerItem.data.facebookUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}>
                <FacebookIcon fontSize='large' />
              </IconButton>
            )}
            {trainerItem?.data?.instagramUrl && (
              <IconButton
                onClick={() => {
                  window.open(
                    trainerItem.data.instagramUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}>
                <InstagramIcon fontSize='large' />
              </IconButton>
            )}

            {trainerItem?.data?.youtubeUrl && (
              <IconButton
                onClick={() => {
                  window.open(
                    trainerItem.data.youtubeUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}>
                <YouTubeIcon fontSize='large' />
              </IconButton>
            )}

            {trainerItem?.data?.websiteUrl && (
              <IconButton
                onClick={() => {
                  window.open(
                    trainerItem.data.websiteUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}>
                <LanguageIcon fontSize='large' />
              </IconButton>
            )}

            {trainerItem?.data?.pinterestUrl && (
              <IconButton
                onClick={() => {
                  window.open(
                    trainerItem.data.pinterestUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}>
                <PinterestIcon fontSize='large' />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </BaseDetails>
    </>
  );
};

export default TrainerDetails;
