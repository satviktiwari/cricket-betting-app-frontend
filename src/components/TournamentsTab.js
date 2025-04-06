import React, { useState, useEffect } from "react";
import { 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Paper, 
    TableContainer, 
    Box, 
    Typography, 
    LinearProgress, 
    TextField,
    TableFooter,
    TablePagination,
    Tabs,
    Tab
} from '@mui/material';

export default function TournamentsTab() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filters, setFilters] = useState({
        date: '',
        match: '',
        venue: '',
        time: ''
    });
    const [activeTab, setActiveTab] = useState(0); // 0 for upcoming, 1 for completed

    useEffect(() => {
        fetch('https://localhost:8080/api/get-all-matches')
            .then(response => response.json())
            .then(data => {
                // Sort all matches by date and time
                const sortedData = data.sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.time}`);
                    const dateB = new Date(`${b.date} ${b.time}`);
                    return dateA - dateB;
                });
                setSchedule(sortedData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSearch = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(0); // Reset to first page when filters change
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(0); // Reset pagination when switching tabs
    };

    // Get current date/time for comparison
    const now = new Date();

    // Separate matches into upcoming and completed
    const upcomingMatches = schedule.filter(match => {
        const matchDate = new Date(`${match.date} ${match.time}`);
        return matchDate > now;
    });

    const completedMatches = schedule.filter(match => {
        const matchDate = new Date(`${match.date} ${match.time}`);
        return matchDate <= now;
    });

    // Select which data to display based on active tab
    const currentData = activeTab === 0 ? upcomingMatches : completedMatches;

    const filteredData = currentData.filter(match => 
        Object.entries(filters).every(([key, value]) =>
            String(match[key]).toLowerCase().includes(value.toLowerCase())
        )
    );

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                IPL 2025 Tournament Schedule
            </Typography>
            
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Upcoming Matches" />
                <Tab label="Completed Matches" />
            </Tabs>
            
            {loading ? (
                <LinearProgress sx={{ mt: 2 }} />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Date', 'Match', 'Venue', 'Time'].map((header) => (
                                    <TableCell key={header}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {header}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            placeholder={`Search ${header}`}
                                            value={filters[header.toLowerCase()]}
                                            onChange={(e) => handleSearch(header.toLowerCase(), e.target.value)}
                                            sx={{ mt: 1 }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((match) => (
                                    <TableRow key={match.id}>
                                        <TableCell>{match.date}</TableCell>
                                        <TableCell>{match.match}</TableCell>
                                        <TableCell>{match.venue}</TableCell>
                                        <TableCell>{match.time}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No matches found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    count={filteredData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(e, newPage) => setPage(newPage)}
                                    onRowsPerPageChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value, 10));
                                        setPage(0);
                                    }}
                                    colSpan={4}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}