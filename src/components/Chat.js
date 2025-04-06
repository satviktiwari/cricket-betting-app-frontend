import React, { useState, useContext } from "react";
import axios from "axios";
 
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
   

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {

      const response = await axios.post(
        "http://localhost:8080/api/chat",
        { message: input },
         
      );

      const aiMessage = { text: response.data.reply, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Failed to get a response.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

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
          height: 600,
          display: "flex",
          flexDirection: "column",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    padding: 2,
                    background:
                      msg.sender === "user"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                    maxWidth: "70%",
                  }}
                >
                  <ListItemText
                    primary={msg.text}
                    sx={{ color: "white", wordBreak: "break-word" }}
                  />
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ display: "flex", padding: 2 }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 1,
              "& .MuiInputBase-input": {
                color: "white",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={loading}
            sx={{ ml: 2 }}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;
