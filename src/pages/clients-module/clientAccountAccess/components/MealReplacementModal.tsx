/** @format */



import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import {

  Alert,

  Box,

  Button,

  CircularProgress,

  Dialog,

  DialogActions,

  DialogContent,

  DialogTitle,

  Stack,

  Typography,

} from "@mui/material";

import { useEffect, useMemo, useState } from "react";

import { useIntl } from "react-intl";

import {

  IDeliveryCalendarDayMeal,

  IReplaceDeliveryCalendarMealsPreview,

  IReplaceDeliveryCalendarMeal,

} from "src/types/modules/clientsManagement/clientAccountAccess";

import { getApiErrorMessage } from "src/Helpers/get-api-error-message";

import { showErrorToasts } from "src/Components/toasts";

import {

  useGetDeliveryCalendarDayQuery,

  usePreviewReplaceDeliveryCalendarMealsMutation,

  useReplaceDeliveryCalendarMealsMutation,

} from "../services/api";

import ReplaceAddOnSelect, { isAddOnMealSelection } from "./ReplaceAddOnSelect";

import ReplaceMealSelect from "./ReplaceMealSelect";

import ReplaceMealsPreviewResult from "./ReplaceMealsPreviewResult";



type Props = {

  open: boolean;

  clientId?: string | null;

  date?: string | null;

  onClose: () => void;

  onSaved?: () => void;

  /** When enabled, preview + mutation should bypass cutoff validation (admin only). */

  bypassCutoffEnabled?: boolean;

  errorMessage?: string | null;

};



type ReplacementDraft = {

  dailyMealSelectionId: string;

  mealTypeName: string;

  currentMealName: string;

  isAddOn: boolean;

  replacementMealId: string;

  replacementDailyMenuMealId: string;

  replacementMealPlanId: string;

  replacementMealName: string;

};



const MealReplacementModal = ({

  open,

  clientId,

  date,

  onClose,

  onSaved,

  bypassCutoffEnabled = false,

  errorMessage = null,

}: Props) => {

  const { messages } = useIntl();

  const [replacements, setReplacements] = useState<ReplacementDraft[]>([]);

  const [replacingMealId, setReplacingMealId] = useState<string | null>(null);

  const [replacingIsAddOn, setReplacingIsAddOn] = useState(false);

  const [selectedReplacementMealId, setSelectedReplacementMealId] = useState("");

  const [selectedReplacementDailyMenuMealId, setSelectedReplacementDailyMenuMealId] =

    useState("");

  const [selectedReplacementMealPlanId, setSelectedReplacementMealPlanId] =

    useState("");

  const [selectedReplacementMealName, setSelectedReplacementMealName] = useState("");

  const [saveError, setSaveError] = useState<string | null>(null);

  const [preview, setPreview] = useState<IReplaceDeliveryCalendarMealsPreview | null>(null);



  const [previewReplaceMeals, { isLoading: isPreviewing }] =

    usePreviewReplaceDeliveryCalendarMealsMutation();

  const [replaceDeliveryCalendarMeals, { isLoading: isApplying }] =

    useReplaceDeliveryCalendarMealsMutation();



  const isSaving = isPreviewing || isApplying;



  const { data: dayDetailResponse } = useGetDeliveryCalendarDayQuery(

    { clientId: clientId || "", date: date || "" },

    { skip: !open || !clientId || !date }

  );



  const dayMeals = dayDetailResponse?.data?.meals ?? [];



  const resetReplacementPicker = () => {

    setSelectedReplacementMealId("");

    setSelectedReplacementDailyMenuMealId("");

    setSelectedReplacementMealPlanId("");

    setSelectedReplacementMealName("");

  };



  useEffect(() => {

    if (!open) {

      setReplacements([]);

      setReplacingMealId(null);

      setReplacingIsAddOn(false);

      resetReplacementPicker();

      setSaveError(null);

      setPreview(null);

    }

  }, [open]);



  useEffect(() => {

    if (!preview) {

      setSaveError(null);

    }

  }, [replacements, preview]);



  const previewReplacements = useMemo<IReplaceDeliveryCalendarMeal[]>(() => {

    return replacements.map((item) => {

      const replacement: IReplaceDeliveryCalendarMeal = {

        dailyMealSelectionId: item.dailyMealSelectionId,

        mealId: item.replacementMealId,

      };



      if (!item.isAddOn && item.replacementDailyMenuMealId) {

        replacement.dailyMenuMealId = item.replacementDailyMenuMealId;

      }



      return replacement;

    });

  }, [replacements]);



  const getDisplayMealName = (dailyMealSelectionId: string, currentMealName: string) => {

    const replacement = replacements.find(

      (item) => item.dailyMealSelectionId === dailyMealSelectionId

    );

    return replacement?.replacementMealName || currentMealName;

  };



  const isMealLocked = (dailyMealSelectionId: string) =>

    replacements.some((item) => item.dailyMealSelectionId === dailyMealSelectionId);



  const canLockCurrentSelection = replacingIsAddOn

    ? Boolean(selectedReplacementMealId)

    : Boolean(selectedReplacementMealId && selectedReplacementDailyMenuMealId);



  const handleLockReplacement = (

    dailyMealSelectionId: string,

    mealTypeName: string,

    currentMealName: string,

    isAddOn: boolean,

    replacementMealName: string

  ) => {

    if (!canLockCurrentSelection) return;



    setPreview(null);

    setReplacements((prev) => {

      const existing = prev.find(

        (item) => item.dailyMealSelectionId === dailyMealSelectionId

      );

      const nextDraft: ReplacementDraft = {

        dailyMealSelectionId,

        mealTypeName,

        currentMealName,

        isAddOn,

        replacementMealId: selectedReplacementMealId,

        replacementDailyMenuMealId: isAddOn ? "" : selectedReplacementDailyMenuMealId,

        replacementMealPlanId: isAddOn ? "" : selectedReplacementMealPlanId,

        replacementMealName,

      };



      if (existing) {

        return prev.map((item) =>

          item.dailyMealSelectionId === dailyMealSelectionId ? nextDraft : item

        );

      }



      return [...prev, nextDraft];

    });

    setReplacingMealId(null);

    setReplacingIsAddOn(false);

    resetReplacementPicker();

  };



  const handleOpenReplace = (meal: IDeliveryCalendarDayMeal) => {

    const isAddOn = isAddOnMealSelection(meal.mealSelectionType);

    setReplacingMealId(meal.id);

    setReplacingIsAddOn(isAddOn);



    const existing = replacements.find(

      (item) => item.dailyMealSelectionId === meal.id

    );



    setSelectedReplacementMealId(existing?.replacementMealId ?? "");

    setSelectedReplacementDailyMenuMealId(

      existing?.replacementDailyMenuMealId ?? ""

    );

    setSelectedReplacementMealPlanId(existing?.replacementMealPlanId ?? "");

    setSelectedReplacementMealName(existing?.replacementMealName ?? "");

  };



  const handleSave = async () => {

    if (!clientId || !date || previewReplacements.length === 0) {

      setSaveError(

        !clientId || !date

          ? "Select a client and delivery date before saving."

          : "Save at least one meal replacement before continuing."

      );

      return;

    }



    setSaveError(null);



    try {

      const result = await previewReplaceMeals({

        clientId,

        data: {

          clientId,

          date,

          replacements: previewReplacements,

          ...(bypassCutoffEnabled ? { bypassCutoff: true } : {}),

        },

      }).unwrap();



      const previewData = result?.data ?? null;



      await replaceDeliveryCalendarMeals({

        clientId,

        data: {

          clientId,

          date,

          replacements: previewReplacements,

          paymentMethodId: "card",

          waivePayment: !(previewData?.requiresPayment ?? false),

          bypassCutoff: bypassCutoffEnabled,

        },

      }).unwrap();



      setPreview(previewData);

      onSaved?.();

    } catch (error) {

      const message = getApiErrorMessage(error);

      setSaveError(message);

      showErrorToasts(message);

    }

  };



  const displayError = saveError || errorMessage;

  const showSuccessView = Boolean(preview);

  const hasLockedReplacements = replacements.length > 0;



  return (

    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

      <DialogTitle sx={{ fontWeight: 800, fontSize: 22 }}>

        {messages["clientAccountAccess.replaceMeals"] as string}

      </DialogTitle>

      <DialogContent>

        {displayError ? (

          <Alert severity="error" sx={{ mb: 2 }}>

            {displayError}

          </Alert>

        ) : null}



        {showSuccessView && preview ? (

          <ReplaceMealsPreviewResult preview={preview} />

        ) : (

          <Stack spacing={2} sx={{ mt: 1 }}>

            {dayMeals.length > 0 ? (

              dayMeals.map((meal) => {

                const isAddOn = isAddOnMealSelection(meal.mealSelectionType);

                const isReplacingThisRow = replacingMealId === meal.id;



                return (

                  <Box

                    key={meal.id}

                    sx={{

                      p: 2,

                      borderRadius: 2,

                      border: (t) => `1px solid ${t.palette.divider}`,

                      bgcolor: "background.default",

                    }}

                  >

                    <Stack

                      direction={{ xs: "column", sm: "row" }}

                      justifyContent="space-between"

                      alignItems={{ xs: "flex-start", sm: "center" }}

                      spacing={1}

                    >

                      <Box>

                        <Typography variant="caption" color="text.secondary">

                          {meal.mealTypeName}

                        </Typography>

                        <Typography variant="body1" fontWeight={600}>

                          {getDisplayMealName(meal.id, meal.mealName)}

                        </Typography>

                        {isMealLocked(meal.id) ? (

                          <Typography

                            variant="caption"

                            color="success.main"

                            fontWeight={600}

                          >

                            Replacement saved

                          </Typography>

                        ) : null}

                      </Box>

                      <Button

                        size="small"

                        variant="outlined"

                        startIcon={<SwapHorizIcon />}

                        onClick={() => handleOpenReplace(meal)}

                        sx={{ borderRadius: 2 }}

                      >

                        {messages["clientAccountAccess.replace"] as string}

                      </Button>

                    </Stack>



                    {isReplacingThisRow && date && clientId ? (

                      <Stack spacing={1.5} sx={{ mt: 2 }}>

                        {isAddOn ? (

                          <ReplaceAddOnSelect

                            clientId={clientId}

                            value={selectedReplacementMealId}

                            onChange={(mealId, mealName) => {

                              setSelectedReplacementMealId(mealId);

                              setSelectedReplacementMealName(mealName);

                            }}

                          />

                        ) : (

                          <ReplaceMealSelect

                            clientId={clientId}

                            date={date}

                            mealTypeId={meal.mealTypeId}

                            value={selectedReplacementDailyMenuMealId}

                            mealPlanId={selectedReplacementMealPlanId}

                            label={messages["clientAccountAccess.searchDish"] as string}

                            onChange={(mealId, mealName, dailyMenuMealId, mealPlanId) => {

                              setSelectedReplacementMealId(mealId);

                              setSelectedReplacementMealName(mealName);

                              setSelectedReplacementDailyMenuMealId(dailyMenuMealId);

                              setSelectedReplacementMealPlanId(mealPlanId);

                            }}

                          />

                        )}

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

                          <Button

                            variant="contained"

                            onClick={() =>

                              handleLockReplacement(

                                meal.id,

                                meal.mealTypeName,

                                meal.mealName,

                                isAddOn,

                                selectedReplacementMealName

                              )

                            }

                            disabled={!canLockCurrentSelection}

                            sx={{ borderRadius: 2, minWidth: 100 }}

                          >

                            {messages["common.save"] as string}

                          </Button>

                        </Box>

                      </Stack>

                    ) : null}

                  </Box>

                );

              })

            ) : (

              <Typography color="text.secondary">

                No meals available for this day.

              </Typography>

            )}

          </Stack>

        )}

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>

        <Button onClick={onClose} disabled={isSaving} sx={{ borderRadius: 2 }}>

          {messages["common.cancel"] as string}

        </Button>

        {!showSuccessView ? (

          <Button

            variant="contained"

            onClick={handleSave}

            disabled={!hasLockedReplacements || isSaving || !clientId || !date}

            sx={{ borderRadius: 2, minWidth: 100 }}

          >

            {isSaving ? (

              <CircularProgress size={22} color="inherit" />

            ) : (

              (messages["common.save"] as string)

            )}

          </Button>

        ) : null}

      </DialogActions>

    </Dialog>

  );

};



export default MealReplacementModal;

