import React from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Avatar, Rating, alpha, useTheme, Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const topRatedDishes = [
  { id: 1, name: "Mediterranean Salad", rating: 4.9, revs: 245, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=64&q=80" },
  { id: 2, name: "Grilled Chicken Bowl", rating: 4.8, revs: 320, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=64&q=80" },
  { id: 3, name: "Quinoa Power Bowl", rating: 4.7, revs: 190, img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=64&q=80" },
  { id: 4, name: "Salmon with Avocado", rating: 4.6, revs: 210, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=64&q=80" },
  { id: 5, name: "Vegetable Stir Fry", rating: 4.5, revs: 180, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=64&q=80" },
  { id: 6, name: "Protein Pancakes", rating: 4.5, revs: 150, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=64&q=80" },
];

const TopRatedDishes = () => {
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
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Top Rated Dishes</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>Detailed view of your highest performing meals</Typography>
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
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topRatedDishes.map((dish) => (
                <TableRow key={dish.id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar variant="rounded" src={dish.img} sx={{ width: 48, height: 48, borderRadius: 2 }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{dish.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating value={dish.rating} precision={0.1} size="small" readOnly sx={{ color: "#FBBF24" }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{dish.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>{dish.revs}</Typography></TableCell>
                  <TableCell>
                    <Chip label="Excellent" size="small" sx={{ height: 26, fontSize: 12, fontWeight: 700, bgcolor: alpha(primaryGreen, 0.1), color: primaryGreen, borderRadius: 1.5 }} />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />} 
                      onClick={() => navigate(`/dashboard/dish-rating-details`)}
                      sx={{ color: primaryGreen, borderColor: primaryGreen, textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                      View Feedback
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

export default TopRatedDishes;
