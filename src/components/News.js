import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
} from "@mui/material";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch sports news from the API
    const fetchNews = async () => {
      try {
        const apiKey = "98ee93c7c2684dd5a85e7dc7be7e5807";
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=sports&apiKey=${apiKey}`
        );
        setNews(response.data.articles);
      } catch (error) {
        setError("Failed to fetch news.");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
        padding: 4,
        background: "linear-gradient(135deg, #1e1e2f, #3a3a5f)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mb: 4, color: "white", fontWeight: "bold" }}
      >
        Sports News
      </Typography>
      <Grid container spacing={4}>
        {news.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {article.urlToImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={article.urlToImage}
                  alt={article.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "white", fontWeight: "bold" }}
                >
                  {article.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "rgba(255, 255, 255, 0.8)" }}
                >
                  {article.description}
                </Typography>
                <Link
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "primary.main", textDecoration: "none" }}
                >
                  Read More
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default News;