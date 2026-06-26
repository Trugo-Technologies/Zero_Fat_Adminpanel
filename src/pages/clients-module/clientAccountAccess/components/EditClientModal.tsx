import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { ClientAccountData } from "../types";

type Props = {
  open: boolean;
  client: ClientAccountData;
  onClose: () => void;
  onSave: (updated: ClientAccountData) => void;
};

const textFieldStyles = (theme: any) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#F8FAFC",
    transition: "all 0.2s ease",
    "& fieldset": { borderColor: "#E2E8F0", borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "#CBD5E1" },
    "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, borderWidth: "2px" },
    "&.Mui-focused": { bgcolor: "#FFFFFF", boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}` },
  },
  "& .MuiInputLabel-root": {
    color: "#64748B",
    fontWeight: 500,
    "&.Mui-focused": { color: theme.palette.primary.main, fontWeight: 600 },
  },
});

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, mt: 3 }}>
    <Box
      sx={(theme) => ({
        width: 32,
        height: 32,
        borderRadius: "8px",
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: "primary.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      {icon}
    </Box>
    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1A2B48" }}>{title}</Typography>
  </Stack>
);

const initialAddress = {
  type: "Home",
  area: "",
  building: "",
  flat: "",
  street: "",
  postalCode: "",
  block: "",
  office: "",
  fullAddressAr: "",
  fullAddressEn: "",
  notesFromClient: "",
  notesFromZeroFat: "",
};

const EditClientModal = ({ open, client, onClose, onSave }: Props) => {
  const { messages } = useIntl();
  const [form, setForm] = useState(client);
  const [addresses, setAddresses] = useState<any[]>([initialAddress]);

  useEffect(() => {
    if (open) {
      setForm(client);
      setAddresses(
        client.deliveryAddresses?.length && typeof client.deliveryAddresses[0] === "object"
          ? client.deliveryAddresses
          : [{ ...initialAddress, fullAddressEn: client.deliveryAddress || "" }]
      );
    }
  }, [open, client]);

  const handleChange = (field: keyof ClientAccountData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };

  const addAddress = () => setAddresses([...addresses, { ...initialAddress }]);

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 48px -12px rgba(15, 23, 42, 0.25)",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#FFFFFF" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1A2B48", letterSpacing: "-0.01em" }}>
          {messages["clientAccountAccess.editClient"] as string}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary", "&:hover": { bgcolor: "#F1F5F9" } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4, pt: 1 }}>
        <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} title="Personal Information" />
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={messages["clientAccountAccess.fullName"] as string}
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={textFieldStyles}>
              <InputLabel>{messages["clientAccountAccess.gender"] as string}</InputLabel>
              <Select
                value={form.gender}
                label={messages["clientAccountAccess.gender"] as string}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label={messages["common.birthDate"] as string}
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <SectionHeader icon={<ContactMailOutlinedIcon fontSize="small" />} title="Contact Details" />
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={messages["clientAccountAccess.email"] as string}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={messages["clientAccountAccess.phone"] as string}
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <SectionHeader icon={<InfoOutlinedIcon fontSize="small" />} title="Account Info" />
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={messages["clientAccountAccess.customerId"] as string}
              value={form.customerId}
              onChange={(e) => handleChange("customerId", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.secondary", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Delivery Addresses
            </Typography>
            <Stack spacing={3}>
              {addresses.map((address, index) => (
                <Box
                  key={`addr-${index}`}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    position: "relative",
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}>
                      Address {index + 1}
                    </Typography>
                    {addresses.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeAddress(index)}
                        sx={{
                          color: "#EF4444",
                          bgcolor: alpha("#EF4444", 0.1),
                          "&:hover": { bgcolor: alpha("#EF4444", 0.2) },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={textFieldStyles}>
                        <InputLabel>{messages["clientLocations.type"] as string}</InputLabel>
                        <Select
                          value={address.type || "Home"}
                          label={messages["clientLocations.type"] as string}
                          onChange={(e) => handleAddressChange(index, "type", e.target.value)}
                        >
                          <MenuItem value="Home"><IntlMessages id="clientLocations.type.Home" /></MenuItem>
                          <MenuItem value="Office"><IntlMessages id="clientLocations.type.Office" /></MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={<IntlMessages id="clientLocations.area" />}
                        value={address.area}
                        onChange={(e) => handleAddressChange(index, "area", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label={<IntlMessages id="clientLocations.building" />}
                        value={address.building}
                        onChange={(e) => handleAddressChange(index, "building", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label={<IntlMessages id="clientLocations.flat" />}
                        value={address.flat}
                        onChange={(e) => handleAddressChange(index, "flat", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label={<IntlMessages id="clientLocations.street" />}
                        value={address.street}
                        onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label={<IntlMessages id="clientLocations.postalCode" />}
                        value={address.postalCode}
                        onChange={(e) => handleAddressChange(index, "postalCode", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label={<IntlMessages id="clientLocations.block" />}
                        value={address.block}
                        onChange={(e) => handleAddressChange(index, "block", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label={<IntlMessages id="clientLocations.office" />}
                        value={address.office}
                        onChange={(e) => handleAddressChange(index, "office", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={<IntlMessages id="clientLocations.fullAddressAr" />}
                        value={address.fullAddressAr}
                        onChange={(e) => handleAddressChange(index, "fullAddressAr", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={<IntlMessages id="clientLocations.fullAddressEn" />}
                        value={address.fullAddressEn}
                        onChange={(e) => handleAddressChange(index, "fullAddressEn", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={<IntlMessages id="clientLocations.notesFromClient" />}
                        value={address.notesFromClient}
                        onChange={(e) => handleAddressChange(index, "notesFromClient", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={<IntlMessages id="clientLocations.notesFromZeroFat" />}
                        value={address.notesFromZeroFat}
                        onChange={(e) => handleAddressChange(index, "notesFromZeroFat", e.target.value)}
                        sx={textFieldStyles}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addAddress}
                sx={{
                  alignSelf: "flex-start",
                  color: "primary.main",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: alpha("#a5d060", 0.1) },
                }}
              >
                Add another address
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, borderTop: "1px solid #F1F5F9", bgcolor: "#F8FAFC" }}>
        <Button
          onClick={onClose}
          sx={{
            px: 3,
            py: 1,
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            "&:hover": { bgcolor: "#F1F5F9", color: "#1A2B48" },
          }}
        >
          {messages["common.cancel"] as string}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave({ 
              ...form, 
              deliveryAddress: addresses[0]?.fullAddressEn || "", 
              deliveryAddresses: addresses 
            });
            onClose();
          }}
          sx={(theme) => ({
            px: 4,
            py: 1.25,
            bgcolor: "primary.main",
            color: "#FFFFFF",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
            "&:hover": {
              bgcolor: "primary.dark",
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          })}
        >
          {messages["common.save"] as string}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClientModal;
