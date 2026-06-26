import React, { useState } from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, 
  Avatar, Rating, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Stack, Select, MenuItem, useTheme
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const allFeedbackData = [
  { id: 1, name: "Fatima Al-Zahra", time: "2 hours ago", rating: 5, text: "Very fresh and delicious! Loved the portion size and the dressing was perfect. Best salad I've had all week.", avatar: "https://i.pravatar.cc/150?u=1", status: "Resolved", dish: "Mediterranean Salad" },
  { id: 2, name: "Ahmed Khan", time: "Yesterday", rating: 3, text: "Chicken was overcooked and a bit dry.", avatar: "https://i.pravatar.cc/150?u=2", status: "Pending", dish: "Grilled Chicken Bowl" },
  { id: 3, name: "Lina Hassan", time: "2 days ago", rating: 5, text: "Great taste and healthy. Will order again!", avatar: "https://i.pravatar.cc/150?u=3", status: "Resolved", dish: "Quinoa Power Bowl" },
  { id: 4, name: "Omar Suleiman", time: "3 days ago", rating: 4, text: "Good but could use a bit more feta cheese.", avatar: "https://i.pravatar.cc/150?u=4", status: "Pending", dish: "Mediterranean Salad" },
  { id: 5, name: "Sarah Mohamed", time: "4 days ago", rating: 5, text: "Perfect as always!", avatar: "https://i.pravatar.cc/150?u=5", status: "Resolved", dish: "Salmon with Avocado" },
];

const AllFeedback = () => {
  const theme = useTheme();
  const primaryGreen = theme.palette.primary.main;
  const navigate = useNavigate();

  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const handleOpenReply = (fb: any) => {
    setSelectedFeedback(fb);
    setOpenReplyModal(true);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>All Customer Feedback</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>Review and respond to recent customer feedback across all dishes</Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #F1F5F9" }}>
        <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Feedback List</Typography>
            <Stack direction="row" spacing={2}>
              <Select size="small" defaultValue="All Ratings" sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 130 }}>
                <MenuItem value="All Ratings">All Ratings</MenuItem>
                <MenuItem value="5 Stars">5 Stars</MenuItem>
                <MenuItem value="4 Stars">4 Stars</MenuItem>
                <MenuItem value="3 Stars">3 Stars</MenuItem>
                <MenuItem value="1-2 Stars">1-2 Stars</MenuItem>
              </Select>
              <Select size="small" defaultValue="All Status" sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 120 }}>
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </Stack>
          </Box>
          
          <Table sx={{ minWidth: 650, "& th": { borderBottom: "1px solid #E2E8F0", color: "text.secondary", fontWeight: 700, fontSize: 13, py: 2, px: 2 }, "& td": { borderBottom: "1px solid #F1F5F9", py: 2, px: 2 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Dish</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell sx={{ minWidth: 250 }}>Feedback</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allFeedbackData.map((fb) => (
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
                    <Rating value={fb.rating} precision={0.1} size="small" readOnly sx={{ color: "#FBBF24" }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{fb.text}</Typography>
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: 12, color: "text.secondary" }}>{fb.time}</Typography></TableCell>
                  <TableCell align="right">
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
                  </TableCell>
                </TableRow>
              ))}
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
                  <Rating value={selectedFeedback.rating} precision={0.1} size="small" readOnly sx={{ color: "#06B6D4" }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#475569", ml: 0.5, mr: 1 }}>{selectedFeedback.rating}</Typography>
                  <Chip label="Feedback" size="small" sx={{ height: 24, fontSize: 11, fontWeight: 700, bgcolor: "#FFEDD5", color: "#EA580C", borderRadius: 1 }} />
                  <Chip label={selectedFeedback.status === "Pending" ? "Pending" : "Replied"} size="small" sx={{ height: 24, fontSize: 11, fontWeight: 700, bgcolor: selectedFeedback.status === "Pending" ? "#FEE2E2" : "#CCFBF1", color: selectedFeedback.status === "Pending" ? "#EF4444" : "#0D9488", borderRadius: 1 }} />
                </Box>
              </Box>

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

export default AllFeedback;
