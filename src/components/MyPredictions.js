import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  TableSortLabel,
  Tooltip,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const MyPredictions = () => {
  const { username } = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    if (username) {
      setLoading(true);
      fetchPredictionsByUsername(username)
        .then((data) => {
          setPredictions(data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch predictions.");
          setLoading(false);
        });
    }
  }, [username]);

  const fetchPredictionsByUsername = async (username) => {
    try {
      const response = await axios.get(
        `https://localhost:8080/api/predictions/user/${username}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching predictions:", error);
      throw error;
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Filter and sort predictions
  const filteredPredictions = predictions.filter((prediction) =>
    Object.values(prediction).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedPredictions = stableSort(filteredPredictions, getComparator(order, orderBy));

  const headerCells = [
    { id: "matchId", label: "Match ID", sortable: true },
    { id: "playerName", label: "Player Name", sortable: true },
    { id: "runsPredicted", label: "Runs", sortable: true },
    { id: "ballsPredicted", label: "Balls", sortable: true },
    { id: "foursPredicted", label: "Fours", sortable: true },
    { id: "sixesPredicted", label: "Sixes", sortable: true },
    { id: "betAmount", label: "Bet Amount", sortable: true },
    { id: "createdAt", label: "Date & Time", sortable: true },
  ];

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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
        My Predictions
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search predictions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            boxShadow: 1,
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      {sortedPredictions.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No predictions found. Start making predictions to see them here!
        </Typography>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',
              borderRadius: '4px',
            }
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: 'primary.light' }}>
              <TableRow>
                {headerCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ 
                      fontWeight: "bold",
                      color: 'common.white',
                      py: 2,
                      borderRight: '1px solid rgba(224, 224, 224, 0.5)',
                      '&:last-child': { borderRight: 'none' }
                    }}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                        sx={{ color: 'inherit !important' }}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={{ display: 'none' }}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPredictions.map((prediction) => (
                <TableRow
                  key={prediction.id}
                  hover
                  sx={{ 
                    '&:nth-of-type(even)': { backgroundColor: 'action.hover' },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell>
                    <Chip 
                      label={prediction.matchId} 
                      color="primary" 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {prediction.playerName}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      backgroundColor: 'success.light', 
                      color: 'success.dark',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: 'inline-block'
                    }}>
                      {prediction.runsPredicted}
                    </Box>
                  </TableCell>
                  <TableCell>{prediction.ballsPredicted}</TableCell>
                  <TableCell>{prediction.foursPredicted}</TableCell>
                  <TableCell>{prediction.sixesPredicted}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{prediction.betAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={new Date(prediction.createdAt).toLocaleString()}>
                      <Typography variant="body2">
                        {new Date(prediction.createdAt).toLocaleDateString()}
                        <br />
                        {new Date(prediction.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyPredictions;