/** @format */

import AppAnimate from "@crema/components/AppAnimate";
import IntlMessages from "@crema/helpers/IntlMessages";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import AppLogo from "@crema/components/AppLayout/components/AppLogo";

const SECTION_IDS = [
  "introduction",
  "informationWeCollect",
  "howWeUse",
  "sharing",
  "retention",
  "security",
  "yourRights",
  "children",
  "changes",
  "contact",
] as const;

const PrivacyPolicyPage = () => {
  const { messages } = useIntl();

  return (
    <AppAnimate animation="transition.slideUpIn" delay={100}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 820,
          mx: "auto",
          bgcolor: "#FFFFFF",
          borderRadius: { xs: 0, sm: 3 },
          border: { xs: "none", sm: "1px solid #E2E8F0" },
          boxShadow: { xs: "none", sm: "0 8px 30px rgba(15, 23, 42, 0.06)" },
          px: { xs: 0, sm: 4, md: 5 },
          py: { xs: 1, sm: 4, md: 5 },
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <AppLogo />
          <Typography
            component="h1"
            sx={{
              mt: 2,
              fontSize: { xs: 26, md: 32 },
              fontWeight: 800,
              color: "#0F172A",
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            <IntlMessages id="privacyPolicy.title" />
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            <IntlMessages id="privacyPolicy.lastUpdated" />
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: 15,
            color: "#334155",
            lineHeight: 1.7,
            mb: 3,
          }}
        >
          {messages["privacyPolicy.intro"] as string}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3.5}>
          {SECTION_IDS.map((sectionId, index) => (
            <Box key={sectionId} component="section">
              <Typography
                component="h2"
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0F172A",
                  mb: 1,
                }}
              >
                {index + 1}.{" "}
                {messages[`privacyPolicy.section.${sectionId}.title`] as string}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14.5,
                  color: "#475569",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                }}
              >
                {
                  messages[
                    `privacyPolicy.section.${sectionId}.body`
                  ] as string
                }
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </AppAnimate>
  );
};

export default PrivacyPolicyPage;
