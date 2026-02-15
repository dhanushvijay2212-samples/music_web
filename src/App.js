import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  SkipNext,
  SkipPrevious,
  PlayArrow,
  Pause,
} from "@mui/icons-material";

const BASE_URL = "http://localhost:8080";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Fetch all songs from backend
  useEffect(() => {
    fetch(`${BASE_URL}/api/songs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch songs");
        return res.json();
      })
      .then((data) => {
        setSongs(data);
        if (data.length > 0) setCurrentSongIndex(0);
      })
      .catch((err) => console.error(err));
  }, []);

  const currentSong =
    currentSongIndex !== null ? songs[currentSongIndex] : null;

  // Helper: get correct music URL
  const getMusicUrl = (song) =>
    song ? `${BASE_URL}/music/${song.fileUrl.split("/").pop()}` : "";

  // Reload audio when song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log(err));
      }
    }
  }, [currentSongIndex, currentSong, isPlaying]);

  // Play / Pause control
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.log(err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleNext = () => {
    if (!songs.length) return;
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const handlePrevious = () => {
    if (!songs.length) return;
    setCurrentSongIndex((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
  };

  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  };

  const handleSongEnd = () => {
    handleNext();
  };

  // Loading state
  if (!currentSong) {
    return (
      <Box
        sx={{
          p: 4,
          color: "#fff",
          backgroundColor: "#121212",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" align="center">
          Loading songs...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <Typography variant="h3" gutterBottom align="center">
        Dhanush Music Player
      </Typography>

      {/* Current Song */}
      <Card sx={{ mb: 4, backgroundColor: "#1db954", color: "#fff" }}>
        <CardContent>
          <Typography variant="h5">{currentSong.title}</Typography>
          <Typography variant="subtitle1">{currentSong.artist}</Typography>
        </CardContent>
      </Card>

      {/* Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
        <Button variant="contained" onClick={handlePrevious}>
          <SkipPrevious />
        </Button>

        <Button variant="contained" onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </Button>

        <Button variant="contained" onClick={handleNext}>
          <SkipNext />
        </Button>
      </Box>

      {/* Playlist */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Playlist
      </Typography>
      <List>
        {songs.map((song, index) => (
          <ListItem
            key={song.id}
            sx={{
              backgroundColor: index === currentSongIndex ? "#1db954" : "#333",
              mb: 1,
              borderRadius: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              setCurrentSongIndex(index);
              setIsPlaying(true);
            }}
          >
            <ListItemText primary={song.title} secondary={song.artist} />
          </ListItem>
        ))}
      </List>
      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={getMusicUrl(currentSong)}
        onEnded={handleSongEnd}
        controls
        autoPlay={isPlaying}
      />
    </Box>
  );
}

export default App;
