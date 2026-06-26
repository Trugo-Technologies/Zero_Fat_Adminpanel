/** @format */

import InfoIcon from "@mui/icons-material/Info";
import PaidIcon from "@mui/icons-material/Paid";
import PlaceIcon from "@mui/icons-material/Place";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ReviewsIcon from "@mui/icons-material/Reviews";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useParams } from "react-router-dom";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import AppProfile, {
  IProfileComponents,
  IProfileRoutes,
} from "src/Components/baseComponents/profile/AppProfile";
import ClientProfileDetails from "src/Components/clients-module/clients/ClientProfileDetails";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import ClientGoalsPage from "../clientGoals/ClientGoalsPage";
import ClientLocationsPages from "../clientLocations";
import ClientLoyaltyPointsPage from "../clientLoyaltyPoints/ClientLoyaltyPointsPage";
import ClientSubscriptionsPage from "../clientSubscriptions/ClientSubscriptionsPage";
import DailyMealSelectionsPage from "../dailyMealSelections/DailyMealSelectionsPage";
import DailySelectionsPage from "../dailySelections/DailySelectionsPage";
import PaymentsPage from "../payments/PaymentsPage";
import { useGetClientQuery } from "./services/api";
const ClientsProfile = () => {
  const { clientIdParams } = useParams();
  const { messages } = useIntl();

  const { data: clientItem, isLoading } = useGetClientQuery(
    { id: clientIdParams || "" },
    {
      skip: !clientIdParams,
    }
  );

  const childrenComponents: IProfileComponents[] = [
    {
      label: "table.actions.details",
      toPath: "",
      icon: <InfoIcon fontSize='small' />,
    },

    {
      label: "sidebar.clientLocation",
      toPath: "clientLocation",
      icon: (
        <PlaceIcon sx={{ fontSize: 24, transform: "translateX(-0.12rem)" }} />
      ),
    },

    {
      label: "sidebar.dailyMealSelections",
      toPath: "dailyMealSelections",
      icon: <ReceiptLongIcon fontSize='small' />,
    },

    {
      label: "sidebar.dailySelections",
      toPath: "dailySelections",
      icon: <ReceiptLongIcon fontSize='small' />,
    },

    {
      label: "sidebar.clientGoals",
      toPath: "clientGoals",
      icon: <ReviewsIcon fontSize='small' />,
    },

    {
      label: "sidebar.clientLoyaltyPoints",
      toPath: "clientLoyaltyPoints",
      icon: <ReviewsIcon fontSize='small' />,
    },

    {
      label: "sidebar.clientSubscription",
      toPath: "clientSubscriptions",
      icon: <ReviewsIcon fontSize='small' />,
    },

    {
      label: "sidebar.payments",
      toPath: "payments",
      icon: <PaidIcon fontSize='small' />,
    },
  ];

  const sidebarRoutes: IProfileRoutes[] = [
    {
      path: "",
      routeComponent: (
        <>
          {" "}
          <LoadingAndErrorWrapper errorMessage={""} isLoading={isLoading}>
            <ClientProfileDetails clientItem={clientItem!} />
          </LoadingAndErrorWrapper>
        </>
      ),
    },

    {
      path: "clientLocation",
      routeComponent: <ClientLocationsPages clientItem={clientItem!} />,
    },

    {
      path: "clientSubscriptions",
      routeComponent: <ClientSubscriptionsPage />,
    },

    {
      path: "clientGoals",
      routeComponent: <ClientGoalsPage />,
    },
    {
      path: "clientLoyaltyPoints",
      routeComponent: <ClientLoyaltyPointsPage />,
    },

    {
      path: "payments",
      routeComponent: <PaymentsPage />,
    },
    {
      path: "dailyMealSelections",
      routeComponent: (
        <DailyMealSelectionsPage clientName={clientItem?.data?.fullName} />
      ),
    },
    {
      path: "dailySelections",
      routeComponent: (
        <DailySelectionsPage clientName={clientItem?.data?.fullName} />
      ),
    },
  ];
  return (
    <AppProfile
      breadcrumbPaths={[
        { name: messages["sidebar.clientsManagement.title"] as string },
        {
          name: messages["sidebar.clients"] as string,
          path: "/clientsManagement/clients",
        },
        {
          name: clientItem?.data?.fullName,
        },
        { name: messages["table.actions.details"] as string },
      ]}
      currentBreadcrumbPath=''
      childrenComponents={childrenComponents}
      sidebarRoutes={sidebarRoutes}
      activePath={5}></AppProfile>
  );
};

export default ClientsProfile;
