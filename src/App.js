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
import { SkipNext, SkipPrevious, PlayArrow, Pause } from "@mui/icons-material";

const BASE_URL = "http://localhost:8080";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

  const getMusicUrl = (song) =>
    song ? `${BASE_URL}/music/${song.fileUrl.split("/").pop()}` : "";

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log(err));
      }
    }
  }, [currentSongIndex, currentSong, isPlaying]);

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
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  };

  const handleSongEnd = () => handleNext();

  if (!currentSong) {
    return (
      <Box
        sx={{
          p: 4,
          backgroundColor: "#000",
          color: "#0f0",
          fontFamily: "monospace",
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
        backgroundColor: "#000",
        color: "#0f0",
        fontFamily: "monospace",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" gutterBottom align="center">
        Dhanush's Music Player
      </Typography>

      {/* Current Song */}
      <Card
        sx={{
          mb: 4,
          backgroundColor: "#111",
          color: "#0f0",
          border: "1px solid #0f0",
        }}
      >
        <CardContent>
          <Typography variant="h5">{currentSong.title}</Typography>
          <Typography variant="subtitle1">{currentSong.artist}</Typography>
        </CardContent>
      </Card>

      {/* Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          sx={{ color: "#0f0", borderColor: "#0f0" }}
          onClick={handlePrevious}
        >
          <SkipPrevious />
        </Button>

        <Button
          variant="outlined"
          sx={{ color: "#0f0", borderColor: "#0f0" }}
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </Button>

        <Button
          variant="outlined"
          sx={{ color: "#0f0", borderColor: "#0f0" }}
          onClick={handleNext}
        >
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
              backgroundColor: index === currentSongIndex ? "#0f0" : "#111",
              color: index === currentSongIndex ? "#000" : "#0f0",
              mb: 1,
              borderRadius: 0,
              cursor: "pointer",
              fontFamily: "monospace",
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
        style={{
          width: "100%",
          marginTop: "20px",
          backgroundColor: "#000",
          color: "#0f0",
        }}
      />
    </Box>
  );
}

export default App;
