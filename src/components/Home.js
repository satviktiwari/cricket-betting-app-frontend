import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  CircularProgress,
  Slide,
  Zoom,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import axios from "axios";

// Keyframes for animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components for enhanced UI
const MatchCard = styled(Card)`
  background-color: #f9f9f9;
  color: #333;
  text-align: left;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0,0,0,0.15);
  }
`;

const SingleMatchCard = styled(MatchCard)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border: 1px solid #ddd;
`;

const AnimatedTypography = styled(Typography)`
  animation: ${pulse} 2s infinite;
`;

const LoadingIndicator = styled(CircularProgress)`
  animation: ${spin} 2s linear infinite;
  color: #2979ff;
`;

const PlayerCard = styled(Card)`
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
});

const StyledTab = styled(Tab)({
  textTransform: 'none',
  minWidth: 72,
  fontWeight: 'bold',
  marginRight: '24px',
  color: 'rgba(0, 0, 0, 0.7)',
  '&:hover': {
    color: '#1890ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#1890ff',
  },
});

// --- Component: Home ---
export default function Home() {
  // --- State Variables ---
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState({});
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [batterPrediction, setBatterPrediction] = useState({
    runs: "",
    balls: "",
    fours: "",
    sixes: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [openPredictionModal, setOpenPredictionModal] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [predictionDisabled, setPredictionDisabled] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for today's matches, 1 for upcoming, 2 for past

  const matchesPerPage = 6;

  // Team Name Mapping (Short Name to Full Name)
  const teamNameMap = {
    "MI": "Mumbai Indians",
    "CSK": "Chennai Super Kings",
    "RCB": "Royal Challengers Bangalore",
    "DC": "Delhi Capitals",
    "KKR": "Kolkata Knight Riders",
    "RR": "Rajasthan Royals",
    "SRH": "Sunrisers Hyderabad",
    "PBKS": "Punjab Kings",
    "LSG": "Lucknow Super Giants",
    "GT": "Gujarat Titans"
  };

  // --- Effects ---
  // Fetch Teams and Players
  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      try {
        // Fetch Teams using axios
        const teamsResponse = await axios.get("https://localhost:8080/api/get-all-teams");
        const teamsData = teamsResponse.data;
        setTeams(teamsData);

        // Fetch Players using axios
        const playersResponse = await axios.get("https://localhost:8080/api/get-all-players");
        const playersData = playersResponse.data;

        // Group players by teamId
        const groupedPlayers = playersData.reduce((acc, player) => {
          if (!acc[player.teamId]) {
            acc[player.teamId] = [];
          }
          acc[player.teamId].push(player);
          return acc;
        }, {});
        setPlayers(groupedPlayers);
      } catch (error) {
        console.error("Error fetching teams and players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndPlayers();
  }, []);

  // Fetch Matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("https://localhost:8080/api/get-all-matches");
        const matchesData = await response.json();

        // Sort matches by date and time
        const sortedMatches = matchesData.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB; // Sort in ascending order (earliest first)
        });

        setMatches(sortedMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Countdown Timer Effect
  useEffect(() => {
    if (!selectedMatch) return;

    // Combine date and time into a valid ISO string
    const matchDateTime = `${selectedMatch.date}T${selectedMatch.time}`;
    const matchTime = new Date(matchDateTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = matchTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeRemaining("Match Started");
        setPredictionDisabled(true); // Disable prediction button
        return;
      }

      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // Disable predictions 1 minute before the match
      if (difference <= 60000) {
        setPredictionDisabled(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedMatch]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setBatterPrediction({ ...batterPrediction, [name]: value });
    }
  };

  const handleBetChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    setSelectedPlayer("");
  };

  const handlePlayerChange = (playerName) => {
    if (predictionDisabled) return; // Disable if predictions are locked
    setSelectedPlayer(playerName);
    setOpenPredictionModal(true);
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!selectedPlayer || !selectedMatch || !betAmount) {
      alert("Please fill in all fields.");
      return;
    }

    // Open the confirmation dialog
    setOpenModal(true);
  };

  const confirmBet = async () => {
    // Prepare the payload
    const { username } = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {};

    if (!username) {
      alert("User not logged in. Please log in to place a bet.");
      return;
    }

    const payload = {
      username: username,
      matchId: selectedMatch.id,
      playerName: selectedPlayer,
      runsPredicted: parseInt(batterPrediction.runs),
      ballsPredicted: parseInt(batterPrediction.balls),
      foursPredicted: parseInt(batterPrediction.fours),
      sixesPredicted: parseInt(batterPrediction.sixes),
      betAmount: parseFloat(betAmount),
    };

    console.log("Prediction payload:", payload);

    try {
      // Make the API call
      const response = await axios.post(
        "https://localhost:8080/api/predictions/submit",
        payload
      );

      // Handle success
      console.log("Prediction submitted successfully:", response.data);
      alert("Prediction submitted successfully!");
      setOpenModal(false); // Close the confirmation dialog
      setBatterPrediction({ runs: "", balls: "", fours: "", sixes: "" }); // Reset form
      setBetAmount(""); // Reset bet amount
    } catch (err) {
      // Handle error
      console.error("Error submitting prediction:", err);
      alert("Failed to submit prediction. Please try again.");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setPredictionDisabled(false); // Reset prediction button state

    // Extract team short names from the match string (e.g., "SRH vs MI")
    const teamShortNames = match.match.split(" vs ");

    // Convert short names to full team names using the map
    const teamFullNames = teamShortNames.map(shortName => teamNameMap[shortName] || shortName);

    // Filter available teams based on the match's full team names
    const filteredTeams = teams.filter(team =>
      teamFullNames.includes(team.teamName)
    );
    setAvailableTeams(filteredTeams);

    // Reset the state
    setSelectedTeam("");
    setSelectedPlayer("");
    setBatterPrediction({ runs: "", balls: "", fours: "", sixes: "" });
    setBetAmount("");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Reset to first page when changing tabs
  };

  // --- Helper Functions ---
  const getTodaysMatches = () => {
    const today = new Date().toISOString().split('T')[0];
    return matches.filter(match => match.date === today);
  };

  const getUpcomingMatches = () => {
    const today = new Date().toISOString().split('T')[0];
    return matches.filter(match => match.date > today);
  };

  const getPastMatches = () => {
    const today = new Date().toISOString().split('T')[0];
    return matches.filter(match => match.date < today);
  };

  // --- Render ---
  const todaysMatches = getTodaysMatches();
  const upcomingMatches = getUpcomingMatches();
  const pastMatches = getPastMatches();

  const renderMatches = (matchesToRender) => {
    if (matchesLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <LoadingIndicator size={40} />
        </Box>
      );
    }

    if (matchesToRender.length === 0) {
      return (
        <Typography variant="h6" sx={{ mt: 4, color: 'text.secondary' }}>
          No matches found
        </Typography>
      );
    }

    return (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {matchesToRender.map((match, index) => (
            <Grid item xs={12} key={match.id}>
              <Zoom in={!matchesLoading} style={{ transitionDelay: !matchesLoading ? '50ms' : '0ms' }}>
                <MatchCard onClick={() => handleMatchSelect(match)}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: '#1565c0', mb: 1 }}>
                      {match.match}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#555' }}>
                      <AccessTimeIcon color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">Time: {match.time}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#555' }}>
                      <LocationOnIcon color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">Venue: {match.venue}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: '#777' }}>Date: {match.date}</Typography>
                  </CardContent>
                </MatchCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {matchesToRender.length > matchesPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Pagination
              count={Math.ceil(matchesToRender.length / matchesPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </>
    );
  };

  const renderPastMatchesTable = () => {
    if (pastMatches.length === 0) {
      return (
        <Typography variant="h6" sx={{ mt: 4, color: 'text.secondary' }}>
          No past matches found
        </Typography>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: "bold" }}>Match</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Venue</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.match}</TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.time}</TableCell>
                <TableCell>{match.venue}</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const [estimatedReturn, setEstimatedReturn] = useState(null);

  const fetchPotentialWinnings = async () => {
    if (!selectedPlayer || !batterPrediction.runs || !betAmount) return;

    try {
      const response = await axios.post(
        'https://<your-lambda-function-url>/calculate-potential-winnings',
        {
          player_id: selectedPlayer, // You might need to adjust this based on your player ID system
          bet_amount: parseFloat(betAmount),
          prediction: {
            runs: parseInt(batterPrediction.runs),
            balls: parseInt(batterPrediction.balls),
            fours: parseInt(batterPrediction.fours),
            sixes: parseInt(batterPrediction.sixes)
          }
        }
      );
      setEstimatedReturn(response.data.estimated_return);
    } catch (error) {
      console.error('Error fetching potential winnings:', error);
      // Fallback to default 2x multiplier if API fails
      setEstimatedReturn(betAmount * 2);
    }
  };

  useEffect(() => {
    if (openModal) {
      fetchPotentialWinnings();
    }
  }, [openModal]);

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4, minHeight: '100vh', padding: '32px', position: 'relative' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <LoadingIndicator size={60} />
        </Box>
      ) : (
        <>
          {/* Match Selection Section */}
          {selectedMatch === null ? (
            <>
              <AnimatedTypography variant="h4" sx={{ mb: 4, color: 'black', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                Cricket Matches
              </AnimatedTypography>

              {/* Tabs for Today/Upcoming/Past Matches */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="match tabs">
                  <StyledTab icon={<SportsCricketIcon />} iconPosition="start" label="Today's Matches" />
                  <StyledTab icon={<EventIcon />} iconPosition="start" label="Upcoming Matches" />
                  <StyledTab icon={<HistoryIcon />} iconPosition="start" label="Past Matches" />
                </StyledTabs>
              </Box>

              {/* Tab Content */}
              {tabValue === 0 && (
                <>
                  <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                    Today's Matches
                  </Typography>
                  {todaysMatches.length > 0 ? (
                    <SingleMatchCard onClick={() => handleMatchSelect(todaysMatches[0])}>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: "bold", color: '#1565c0', mb: 2 }}>
                          {todaysMatches[0].match}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#555' }}>
                          <AccessTimeIcon color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body1">Time: {todaysMatches[0].time}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#555' }}>
                          <LocationOnIcon color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body1">Venue: {todaysMatches[0].venue}</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, color: '#777' }}>Date: {todaysMatches[0].date}</Typography>
                      </CardContent>
                    </SingleMatchCard>
                  ) : (
                    <Typography variant="h6" sx={{ mt: 4, color: 'text.secondary' }}>
                      No matches scheduled for today
                    </Typography>
                  )}
                </>
              )}

              {tabValue === 1 && (
                <>
                  <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                    Upcoming Matches
                  </Typography>
                  {renderMatches(upcomingMatches)}
                </>
              )}

              {tabValue === 2 && (
                <>
                  <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                    Past Matches
                  </Typography>
                  {renderPastMatchesTable()}
                </>
              )}
            </>
          ) : (
            <Slide direction="left" in={selectedMatch !== null} mountOnEnter unmountOnExit>
              <Box>
                {/* Back Button */}
                <Box sx={{ mb: 2, textAlign: 'left' }}>
                  <Button variant="outlined" color="primary" onClick={() => setSelectedMatch(null)}>
                    Back to Matches
                  </Button>
                </Box>

                {/* Countdown Timer */}
                <Typography variant="h6" sx={{ mb: 2, color: predictionDisabled ? "error.main" : "text.primary" }}>
                  {predictionDisabled ? "Predictions Locked" : `Time Remaining: ${timeRemaining}`}
                </Typography>

                {/* Prediction Form */}
                <Typography variant="h5" gutterBottom sx={{ color: 'black', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  Make a Prediction for {selectedMatch.match}
                </Typography>

                <Card sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '16px' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                    Select a Player to Predict
                  </Typography>

                  {/* Team Selection */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {availableTeams.map((team) => (
                      <Grid item xs={6} key={team.id}>
                        <PlayerCard onClick={() => handleTeamChange(team.id)}>
                          <CardContent>
                            <Typography variant="h6">{team.teamName}</Typography>
                          </CardContent>
                        </PlayerCard>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Player Selection */}
                  {selectedTeam && (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Player Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Role</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {players[selectedTeam]?.map((player) => (
                            <TableRow
                              key={player.id}
                              hover
                              onClick={() => handlePlayerChange(player.playerName)}
                              sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f9f9f9" } }}
                            >
                              <TableCell>{player.playerName}</TableCell>
                              <TableCell>{player.role}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Card>
              </Box>
            </Slide>
          )}
        </>
      )}

      {/* Prediction Modal */}
      <Dialog open={openPredictionModal} onClose={() => setOpenPredictionModal(false)}>
        <DialogTitle>Predict {selectedPlayer}'s Performance</DialogTitle>
        <DialogContent>
          {/* Batsman Prediction */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Runs"
                variant="outlined"
                name="runs"
                value={batterPrediction.runs}
                onChange={handleChange}
                fullWidth
                disabled={predictionDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Balls Faced"
                variant="outlined"
                name="balls"
                value={batterPrediction.balls}
                onChange={handleChange}
                fullWidth
                disabled={predictionDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="4s"
                variant="outlined"
                name="fours"
                value={batterPrediction.fours}
                onChange={handleChange}
                fullWidth
                disabled={predictionDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="6s"
                variant="outlined"
                name="sixes"
                value={batterPrediction.sixes}
                onChange={handleChange}
                fullWidth
                disabled={predictionDisabled}
              />
            </Grid>
          </Grid>

          {/* Bet Amount */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Bet Amount"
              variant="outlined"
              value={betAmount}
              onChange={handleBetChange}
              fullWidth
              disabled={predictionDisabled}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPredictionModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={predictionDisabled}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm Your Bet</DialogTitle>
        <DialogContent>
          <Typography>
            Your potential winnings: {estimatedReturn ? `${estimatedReturn.toFixed(2)}` : 'Calculating...'}
          </Typography>
          {estimatedReturn && (
            <Typography variant="caption" color="textSecondary">
              Multiplier: {(estimatedReturn / betAmount).toFixed(1)}x
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmBet} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}