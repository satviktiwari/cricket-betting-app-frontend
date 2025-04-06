import React, { useState, useEffect, useContext } from "react";
 
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import the checkmark icon

const Profile = () => {
  const { username } = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
   

  useEffect(() => {

    
    // Fetch user details by username
    const fetchUserProfile = async () => {
      try {
        
        const response = await axios.get(
          `https://localhost:8080/api/users/profile/${username}`,
        );
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user profile.");
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleValidateUser = async () => {
    try {
      // Send request to backend to trigger SMS and email notifications
      const response = await axios.post(
        `https://localhost:8080/api/users/validate-notifications/${user.id}`,
        {},
      );
      setSnackbarMessage("Validation notifications sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to send validation notifications.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error sending validation notifications:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1e2f, #3a3a5f)",
        padding: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 4,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Box
          sx={{
            background: "rgba(0, 0, 0, 0.2)",
            padding: 3,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: "0 auto",
              bgcolor: "primary.main",
              fontSize: "3rem",
              border: "4px solid white",
            }}
          >
            {user?.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="h4"
            sx={{ mt: 2, fontWeight: "bold", color: "white" }}
          >
            {user?.fullName}
            {user?.isValidated && (
              <CheckCircleIcon
                sx={{ color: "green", marginLeft: 1, verticalAlign: "middle" }}
              />
            )}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
            @{user?.username}
            {user?.isValidated && (
              <CheckCircleIcon
                sx={{ color: "green", marginLeft: 1, verticalAlign: "middle" }}
              />
            )}
          </Typography>
        </Box>

        <CardContent>
          <Grid container spacing={3} sx={{ padding: 3 }}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                  Personal Details
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  <strong>Email:</strong> {user?.email}
                  {user?.isValidated && (
                    <CheckCircleIcon
                      sx={{ color: "green", marginLeft: 1, verticalAlign: "middle" }}
                    />
                  )}
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  <strong>Mobile No:</strong> {user?.mobileNo}
                  {user?.isValidated && (
                    <CheckCircleIcon
                      sx={{ color: "green", marginLeft: 1, verticalAlign: "middle" }}
                    />
                  )}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                  Government IDs
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  <strong>Aadhar No:</strong> {user?.aadharNo}
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  <strong>PAN No:</strong> {user?.panNo}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Validate User Button
          {!user?.isValidated && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleValidateUser}
              >
                Validate User
              </Button>
            </Box>
          )} */}
        </CardContent>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;