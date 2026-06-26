import React, { useState } from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, 
  Avatar, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Stack, Select, MenuItem, useTheme, alpha, Collapse, InputAdornment, OutlinedInput
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useNavigate } from "react-router-dom";

const allFeedbackData = [
  { id: 1, name: "Fatima Al-Zahra", time: "2026-06-17", rating: "Awesome", additionalComment: "", text: "", avatar: "https://i.pravatar.cc/150?u=1", status: "N/A", dish: "Mediterranean Salad" },
  { id: 2, name: "Ahmed Khan", time: "2026-06-16", rating: "Good", additionalComment: "Tastes Good", text: "Chicken was a bit dry but overall nice.", avatar: "https://i.pravatar.cc/150?u=2", status: "Pending", dish: "Grilled Chicken Bowl" },
  { id: 3, name: "Lina Hassan", time: "2026-06-15", rating: "Awesome", additionalComment: "", text: "", avatar: "https://i.pravatar.cc/150?u=3", status: "N/A", dish: "Quinoa Power Bowl" },
  { id: 4, name: "Omar Suleiman", time: "2026-06-14", rating: "Good", additionalComment: "Needs more seasoning", text: "Good but could use a bit more feta cheese.", avatar: "https://i.pravatar.cc/150?u=4", status: "Pending", dish: "Mediterranean Salad" },
  { id: 5, name: "Sarah Mohamed", time: "2026-06-13", rating: "Awesome", additionalComment: "", text: "", avatar: "https://i.pravatar.cc/150?u=5", status: "N/A", dish: "Salmon with Avocado" },
  { id: 6, name: "Kareem Abdul", time: "2026-06-12", rating: "Not Good", additionalComment: "Small portion", text: "Portion was way too small for the price.", avatar: "https://i.pravatar.cc/150?u=6", status: "Pending", dish: "Tuna Wrap" },
];

const MealRatingsDashboard = () => {
  const theme = useTheme();
  const primaryGreen = theme.palette.primary.main;
  const navigate = useNavigate();

  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ fromDate: "", toDate: "", rating: "All Ratings", status: "All Status" });

  const filteredData = allFeedbackData.filter((fb) => {
    let isMatch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!fb.name.toLowerCase().includes(q) && !fb.text?.toLowerCase().includes(q) && !fb.additionalComment?.toLowerCase().includes(q)) isMatch = false;
    }
    if (appliedFilters.rating !== "All Ratings" && fb.rating !== appliedFilters.rating) isMatch = false;
    if (appliedFilters.status !== "All Status" && fb.status !== appliedFilters.status) isMatch = false;
    
    if (appliedFilters.fromDate && fb.time < appliedFilters.fromDate) isMatch = false;
    if (appliedFilters.toDate && fb.time > appliedFilters.toDate) isMatch = false;
    
    return isMatch;
  });

  const handleClear = () => {
    setAppliedFilters({ fromDate: "", toDate: "", rating: "All Ratings", status: "All Status" });
  };

  const handleOpenReply = (fb: any) => {
    setSelectedFeedback(fb);
    setOpenReplyModal(true);
  };

  const getRatingChip = (rating: string) => {
    switch(rating) {
      case "Awesome": return <Chip label="Awesome" size="small" sx={{ bgcolor: alpha(primaryGreen, 0.1), color: primaryGreen, fontWeight: 700, height: 24 }} />;
      case "Good": return <Chip label="Good" size="small" sx={{ bgcolor: "#FEF3C7", color: "#D97706", fontWeight: 700, height: 24 }} />;
      case "Not Good": return <Chip label="Not Good" size="small" sx={{ bgcolor: "#FEE2E2", color: "#EF4444", fontWeight: 700, height: 24 }} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Meal Rating</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>Track meal performance and review customer feedback</Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #F1F5F9" }}>
        <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <OutlinedInput 
              size="small"
              placeholder="Search by feedback, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} /></InputAdornment>}
              sx={{ width: 300, borderRadius: 2, bgcolor: "#fff", "& fieldset": { borderColor: "#E2E8F0" } }}
            />
            <Button 
              variant="outlined" 
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterListIcon />}
              sx={{ height: 36, px: 3, borderRadius: 2, borderColor: "#E2E8F0", color: "#0F172A", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#F8FAFC" } }}
            >
              Filters
            </Button>
          </Box>

          <Collapse in={showFilters}>
            <Box sx={{ border: "1px solid #E2E8F0", borderRadius: 3, p: 3, mb: 3, bgcolor: "#fff", display: "flex", alignItems: "flex-end", gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Status</Typography>
                <Select size="small" value={appliedFilters.status} onChange={(e) => setAppliedFilters({...appliedFilters, status: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
                  <MenuItem value="All Status">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Rating</Typography>
                <Select size="small" value={appliedFilters.rating} onChange={(e) => setAppliedFilters({...appliedFilters, rating: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
                  <MenuItem value="All Ratings">All</MenuItem>
                  <MenuItem value="Awesome">Awesome</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Not Good">Not Good</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>From Date</Typography>
                <OutlinedInput 
                  type="date" 
                  size="small" 
                  value={appliedFilters.fromDate} 
                  onChange={(e) => setAppliedFilters({...appliedFilters, fromDate: e.target.value})} 
                  sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }} 
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>To Date</Typography>
                <OutlinedInput 
                  type="date" 
                  size="small" 
                  value={appliedFilters.toDate} 
                  onChange={(e) => setAppliedFilters({...appliedFilters, toDate: e.target.value})} 
                  sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }} 
                />
              </Box>
              
              <Button onClick={handleClear} variant="outlined" sx={{ height: 36, px: 3, borderRadius: 2, borderColor: "#E2E8F0", color: "#0F172A", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#F8FAFC" } }}>
                Clear filters
              </Button>
            </Box>
          </Collapse>
          
          <Table sx={{ minWidth: 650, "& th": { borderBottom: "1px solid #E2E8F0", color: "text.secondary", fontWeight: 700, fontSize: 13, py: 2, px: 2 }, "& td": { borderBottom: "1px solid #F1F5F9", py: 2, px: 2 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Dish</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Additional Comment</TableCell>
                <TableCell sx={{ minWidth: 250 }}>Feedback</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((fb) => (
                <TableRow key={fb.id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar src={fb.avatar} sx={{ width: 36, height: 36 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{fb.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{fb.dish}</Typography>
                  </TableCell>
                  <TableCell>
                    {getRatingChip(fb.rating)}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{fb.additionalComment || "-"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{fb.text || "-"}</Typography>
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: 12, color: "text.secondary" }}>{fb.time}</Typography></TableCell>
                  <TableCell align="right">
                    {fb.rating !== "Awesome" ? (
                      <Button 
                        size="small" 
                        onClick={() => handleOpenReply(fb)}
                        variant={fb.status === "Pending" ? "contained" : "outlined"}
                        sx={{ 
                          bgcolor: fb.status === "Pending" ? primaryGreen : "transparent",
                          color: fb.status === "Pending" ? "#fff" : "text.secondary",
                          borderColor: fb.status === "Pending" ? primaryGreen : "#E2E8F0",
                          boxShadow: "none", textTransform: "none", borderRadius: 2, fontSize: 12, fontWeight: 600,
                          "&:hover": { boxShadow: "none", bgcolor: fb.status === "Pending" ? primaryGreen : "#F8FAFC" }
                        }}
                      >
                        {fb.status === "Pending" ? "Reply" : "View Details"}
                      </Button>
                    ) : (
                      <Typography sx={{ fontSize: 13, color: "text.disabled", fontWeight: 600, mr: 1 }}>-</Typography>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>No feedback matches the selected filters.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reply Modal - Detailed View */}
      <Dialog open={openReplyModal} onClose={() => setOpenReplyModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", pb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Feedback Details</Typography>
          <IconButton onClick={() => setOpenReplyModal(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedFeedback && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar src={selectedFeedback.avatar} sx={{ width: 48, height: 48, bgcolor: primaryGreen, color: "#fff", fontWeight: 800 }}>
                    {selectedFeedback.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{selectedFeedback.name}</Typography>
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>customer@example.com</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getRatingChip(selectedFeedback.rating)}
                  <Chip label="Feedback" size="small" sx={{ height: 24, fontSize: 11, fontWeight: 700, bgcolor: "#FFEDD5", color: "#EA580C", borderRadius: 1 }} />
                  <Chip label={selectedFeedback.status === "Pending" ? "Pending" : "Replied"} size="small" sx={{ height: 24, fontSize: 11, fontWeight: 700, bgcolor: selectedFeedback.status === "Pending" ? "#FEE2E2" : "#CCFBF1", color: selectedFeedback.status === "Pending" ? "#EF4444" : "#0D9488", borderRadius: 1 }} />
                </Box>
              </Box>

              <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#64748B", letterSpacing: 1, textTransform: "uppercase", mb: 1 }}>Additional Comment</Typography>
              <Typography sx={{ fontSize: 15, color: "#0F172A", mb: 3, fontWeight: 600 }}>{selectedFeedback.additionalComment || "-"}</Typography>

              <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#64748B", letterSpacing: 1, textTransform: "uppercase", mb: 1 }}>Full Message</Typography>
              <Typography sx={{ fontSize: 15, color: "#0F172A", mb: 1 }}>{selectedFeedback.text}</Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 4 }}>Submitted: {selectedFeedback.time}</Typography>

              <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#64748B", letterSpacing: 1, textTransform: "uppercase", mb: 1 }}>Admin Reply</Typography>
              {selectedFeedback.status === "Pending" ? (
                <TextField 
                  fullWidth 
                  multiline 
                  rows={3} 
                  placeholder="Type your reply here..." 
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#fff", "& fieldset": { borderColor: "#E2E8F0" } } }} 
                />
              ) : (
                <Box sx={{ border: "1px solid #E2E8F0", borderRadius: 3, p: 2, bgcolor: "#fff" }}>
                  <Typography sx={{ fontSize: 15, color: "#0F172A" }}>Thank you for your feedback.</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="outlined" onClick={() => setOpenReplyModal(false)} sx={{ color: "#0F172A", borderColor: "#E2E8F0", textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}>
            Close
          </Button>
          {selectedFeedback?.status === "Pending" && (
            <Button variant="contained" onClick={() => setOpenReplyModal(false)} sx={{ bgcolor: primaryGreen, textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3, boxShadow: "none", "&:hover": { boxShadow: "none" } }}>
              Send Reply
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealRatingsDashboard;
