import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    MenuItem,
    Select,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    CircularProgress
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// --- Constants ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#ff6347', '#ff4500'];
const statOptions = ["runs", "fours", "sixes", "fifties", "hundreds"];

// --- Main Component ---
export default function TeamData() {
    // --- State Variables ---
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState({});
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedStat, setSelectedStat] = useState("runs");
    const [playerStats, setPlayerStats] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [loadingStats, setLoadingStats] = useState(false);
     
    // --- Effects ---
    // Fetch Teams
    useEffect(() => {
        const fetchTeams = async () => {
            setLoadingTeams(true);
            try {
                const response = await fetch('https://localhost:8080/api/get-all-teams');
                const data = await response.json();
                setTeams(data);
                if (data.length > 0) {
                    setSelectedTeam(data[0].teamName); // Set initial selected team
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoadingTeams(false);
            }
        };

        fetchTeams();
    }, []);

    // Fetch Players
    useEffect(() => {
        const fetchPlayers = async () => {
            setLoadingPlayers(true);
            try {
                const response = await fetch('https://localhost:8080/api/get-all-players');
                const data = await response.json();
                // Group players by teamId
                const groupedPlayers = data.reduce((acc, player) => {
                    if (!acc[player.teamId]) {
                        acc[player.teamId] = [];
                    }
                    acc[player.teamId].push(player);
                    return acc;
                }, {});
                setPlayers(groupedPlayers);
            } catch (error) {
                console.error('Error fetching players:', error);
            } finally {
                setLoadingPlayers(false);
            }
        };

        fetchPlayers();
    }, []);

    // Fetch Player Stats when selected
    useEffect(() => {
        if (selectedPlayer) {
            const fetchPlayerStats = async () => {
                setLoadingStats(true);
                try {
                    const response = await fetch(`http://localhost:8081/api/player-stats/by-player-id/${selectedPlayer.id}`);
                    const data = await response.json();
                    setPlayerStats(data);
                } catch (error) {
                    console.error('Error fetching player stats:', error);
                } finally {
                    setLoadingStats(false);
                }
            };
            fetchPlayerStats();
        }
    }, [selectedPlayer]);

    // --- Handlers ---
    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        setSelectedPlayer(null); // Clear selected player when team changes
    };

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Format stats for charts
    const formatStatsForCharts = () => {
        if (!playerStats) return [];
        
        return [{
            name: "IPL Career",
            matches: playerStats.matches,
            runs: playerStats.runs,
            average: playerStats.average,
            strikeRate: playerStats.strike_rate,
            fours: playerStats.fours,
            sixes: playerStats.sixes,
            fifties: playerStats.fifties,
            hundreds: playerStats.hundreds,
            twoHundreds: playerStats.two_hundreds,
            threeHundreds: playerStats.three_hundreds,
            fourHundreds: playerStats.four_hundreds
        }];
    };

    // --- Render ---
    return (
        <Container>
            {/* Title */}
            <Typography variant="h4" sx={{ my: 2, textAlign: "center" }}>
                IPL Dashboard
            </Typography>

            {/* Team Selection */}
            {loadingTeams ? (
                <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Select
                    value={selectedTeam}
                    onChange={handleTeamChange}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    {teams.map((team) => (
                        <MenuItem key={team.id} value={team.teamName}>
                            {team.teamName}
                        </MenuItem>
                    ))}
                </Select>
            )}

            {/* Player Grid */}
            <Grid container spacing={2}>
                {loadingPlayers ? (
                    <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    players[teams.find(team => team.teamName === selectedTeam)?.id]?.map((player) => (
                        <Grid item xs={12} sm={4} key={player.id}>
                            <Card
                                onClick={() => handlePlayerSelect(player)}
                                sx={{
                                    cursor: "pointer",
                                    backgroundColor: "#f5f5f5",
                                    transition: "transform 0.2s",
                                    '&:hover': {
                                        transform: "scale(1.05)",
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">{player.playerName}</Typography>
                                    <Typography>{player.role}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Player Details Modal */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isModalOpen}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        maxHeight: '90vh'
                    }}>
                        {selectedPlayer && (
                            <>
                                <Typography variant="h5">{selectedPlayer.playerName}</Typography>
                                <Typography>Role: {selectedPlayer.role}</Typography>
                                
                                {loadingStats ? (
                                    <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : playerStats ? (
                                    <>
                                        {/* Player Stats Table */}
                                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Stat</TableCell>
                                                        <TableCell>Value</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Matches</TableCell>
                                                        <TableCell>{playerStats.matches}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Innings</TableCell>
                                                        <TableCell>{playerStats.innings}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Runs</TableCell>
                                                        <TableCell>{playerStats.runs}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Balls Faced</TableCell>
                                                        <TableCell>{playerStats.balls}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Highest Score</TableCell>
                                                        <TableCell>{playerStats.highest}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Average</TableCell>
                                                        <TableCell>{playerStats.average}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Strike Rate</TableCell>
                                                        <TableCell>{playerStats.strike_rate}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Not Outs</TableCell>
                                                        <TableCell>{playerStats.not_out}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Fours</TableCell>
                                                        <TableCell>{playerStats.fours}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Sixes</TableCell>
                                                        <TableCell>{playerStats.sixes}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Ducks</TableCell>
                                                        <TableCell>{playerStats.ducks}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>50s</TableCell>
                                                        <TableCell>{playerStats.fifties}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>100s</TableCell>
                                                        <TableCell>{playerStats.hundreds}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>200s</TableCell>
                                                        <TableCell>{playerStats.two_hundreds}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>300s</TableCell>
                                                        <TableCell>{playerStats.three_hundreds}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>400s</TableCell>
                                                        <TableCell>{playerStats.four_hundreds}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {/* Charts and Performance Analysis */}
                                        <Box mt={3}>
                                            <Typography variant="h6">Performance Analysis</Typography>
                                            <Select
                                                value={selectedStat}
                                                onChange={(e) => setSelectedStat(e.target.value)}
                                                fullWidth
                                                sx={{ mb: 2 }}
                                            >
                                                {statOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                            {/* Bar Chart */}
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={formatStatsForCharts()}>
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey={selectedStat} fill="#8884d8" />
                                                </BarChart>
                                            </ResponsiveContainer>

                                            {/* Pie Chart */}
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={formatStatsForCharts()}
                                                        dataKey={selectedStat}
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        label
                                                    >
                                                        {formatStatsForCharts().map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </>
                                ) : (
                                    <Typography sx={{ mt: 2 }}>No stats available for this player</Typography>
                                )}
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
}