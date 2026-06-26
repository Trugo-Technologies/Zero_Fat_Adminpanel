import React, { useState } from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, 
  Avatar, IconButton, Button, Chip, Stack, Select, MenuItem, useTheme, alpha, Collapse, InputAdornment, OutlinedInput
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const allNotificationData = [
  { id: 1, name: "Sarah Al-Mansouri", time: "2026-06-17", type: "Email", title: "Meal Plan Updated", message: "Your Lean Muscle plan has been successfully renewed for 1 month.", status: "Sent", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Ahmed Khan", time: "2026-06-16", type: "Email", title: "Subscription Expiring", message: "Your subscription is expiring in 3 days. Renew now to avoid interruption.", status: "Sent", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Lina Hassan", time: "2026-06-15", type: "Email", title: "Delivery Update", message: "Your meal will be delivered between 6:00 AM and 8:00 AM tomorrow.", status: "Failed", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Omar Suleiman", time: "2026-06-14", type: "Email", title: "Goal Achieved", message: "Congratulations! You have reached your target weight of 75kg.", status: "Sent", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Sarah Mohamed", time: "2026-06-13", type: "Email", title: "Welcome to ZeroFat", message: "Welcome aboard! Here is everything you need to know about your meal plan.", status: "Sent", avatar: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "Kareem Abdul", time: "2026-06-12", type: "Email", title: "Payment Failed", message: "Your recent payment attempt failed. Please update your payment method.", status: "Pending", avatar: "https://i.pravatar.cc/150?u=6" },
];

const NotificationLogsDashboard = () => {
  const theme = useTheme();
  const primaryGreen = theme.palette.primary.main;
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ fromDate: "", toDate: "", status: "All Status" });

  const filteredData = allNotificationData.filter((log) => {
    let isMatch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!log.name.toLowerCase().includes(q) && !log.title.toLowerCase().includes(q) && !log.message.toLowerCase().includes(q)) isMatch = false;
    }
    if (appliedFilters.status !== "All Status" && log.status !== appliedFilters.status) isMatch = false;
    
    if (appliedFilters.fromDate && log.time < appliedFilters.fromDate) isMatch = false;
    if (appliedFilters.toDate && log.time > appliedFilters.toDate) isMatch = false;
    
    return isMatch;
  });

  const handleClear = () => {
    setAppliedFilters({ fromDate: "", toDate: "", status: "All Status" });
  };

  const getStatusChip = (status: string) => {
    switch(status) {
      case "Sent": return <Chip label="Sent" size="small" sx={{ bgcolor: alpha(primaryGreen, 0.1), color: primaryGreen, fontWeight: 700, height: 24 }} />;
      case "Pending": return <Chip label="Pending" size="small" sx={{ bgcolor: "#FEF3C7", color: "#D97706", fontWeight: 700, height: 24 }} />;
      case "Failed": return <Chip label="Failed" size="small" sx={{ bgcolor: "#FEE2E2", color: "#EF4444", fontWeight: 700, height: 24 }} />;
      default: return null;
    }
  };


  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Notification Logs</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>Track and monitor all automated notifications sent to clients</Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #F1F5F9" }}>
        <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <OutlinedInput 
              size="small"
              placeholder="Search by client, title, message..."
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
                  <MenuItem value="All Status" sx={{ fontSize: 13 }}>All Status</MenuItem>
                  <MenuItem value="Sent" sx={{ fontSize: 13 }}>Sent</MenuItem>
                  <MenuItem value="Pending" sx={{ fontSize: 13 }}>Pending</MenuItem>
                  <MenuItem value="Failed" sx={{ fontSize: 13 }}>Failed</MenuItem>
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
              <Box sx={{ ml: "auto" }}>
                <Button onClick={handleClear} sx={{ color: "text.secondary", textTransform: "none", fontWeight: 700, "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" }, height: 36, px: 2, borderRadius: 2 }}>
                  Clear filters
                </Button>
              </Box>
            </Box>
          </Collapse>

          <Table sx={{ "& .MuiTableCell-root": { borderBottom: "1px solid #F1F5F9", py: 2 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                <TableCell sx={{ fontWeight: 700, color: "#64748B", fontSize: 12, textTransform: "uppercase" }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#64748B", fontSize: 12, textTransform: "uppercase", width: "40%" }}>Message Details</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#64748B", fontSize: 12, textTransform: "uppercase" }}>Date Sent</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#64748B", fontSize: 12, textTransform: "uppercase" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((log) => (
                <TableRow key={log.id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={log.avatar} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{log.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{log.time}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0F172A", mb: 0.5 }}>{log.title}</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{log.message}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 600 }}>{log.time}</Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(log.status)}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.secondary" }}>No notification logs found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationLogsDashboard;
