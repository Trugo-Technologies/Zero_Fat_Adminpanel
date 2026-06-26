import React from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Avatar, Rating, Stack, useTheme, Button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const lowRatingDishes = [
  { id: 1, name: "Protein Oats", rating: 2.8, revs: 65, issues: ["Too dry", "Not fresh"], img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Tuna Wrap", rating: 3.0, revs: 43, issues: ["Too salty", "Portion too small"], img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=150&q=80" },
  { id: 3, name: "Paneer Tikka Bowl", rating: 3.1, revs: 38, issues: ["Spicy", "Could be better"], img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80" },
  { id: 4, name: "Beef Stroganoff", rating: 3.2, revs: 50, issues: ["Chewy", "Not hot enough"], img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=150&q=80" },
];

const LowRatingAlerts = () => {
  const theme = useTheme();
  const primaryGreen = theme.palette.primary.main;
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Low Rating Alerts</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>Detailed view of meals requiring immediate attention</Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #F1F5F9" }}>
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
          <Table sx={{ minWidth: 650, "& th": { borderBottom: "1px solid #E2E8F0", color: "text.secondary", fontWeight: 700, fontSize: 13, py: 2, px: 3 }, "& td": { borderBottom: "1px solid #F1F5F9", py: 2, px: 3 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Dish Name</TableCell>
                <TableCell>Average Rating</TableCell>
                <TableCell>Total Reviews</TableCell>
                <TableCell>Top Issues</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowRatingDishes.map((dish) => (
                <TableRow key={dish.id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar variant="rounded" src={dish.img} sx={{ width: 48, height: 48, borderRadius: 2 }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{dish.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating value={dish.rating} precision={0.1} size="small" readOnly sx={{ color: "#F97316" }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#F97316" }}>{dish.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>{dish.revs}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {dish.issues.map(i => <Chip key={i} label={i} size="small" sx={{ height: 24, fontSize: 11, bgcolor: "#FEE2E2", color: "#EF4444", fontWeight: 600 }} />)}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />} 
                      onClick={() => navigate(`/dashboard/dish-rating-details`)}
                      sx={{ color: primaryGreen, borderColor: primaryGreen, textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LowRatingAlerts;
