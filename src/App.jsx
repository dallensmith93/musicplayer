import React, { useEffect, useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const genrePresets = {
  metal: {
    label: "Metal",
    description: "Heavy riffs, classic metal, and fast modern cuts.",
    searchTerms: [
      "Dio",
      "Black Sabbath",
      "heavy metal",
      "thrash metal",
      "metalcore",
    ],
    priorityArtists: ["dio", "black sabbath"],
    genreFilters: ["metal", "hard rock", "rock"],
    blockedTitles: ["dio", "black sabbath", "heavy metal"],
  },
  gaming: {
    label: "Gaming",
    description: "Game soundtracks, battle themes, and high-energy score cuts.",
    searchTerms: [
      "video game soundtrack",
      "game music",
      "JRPG soundtrack",
      "boss battle theme",
      "orchestral game score",
    ],
    priorityArtists: [],
    genreFilters: ["soundtrack", "instrumental", "classical", "anime"],
  },
  classical: {
    label: "Classical",
    description: "Symphonies, concertos, piano, and chamber music previews.",
    searchTerms: [
      "classical",
      "symphony orchestra",
      "piano concerto",
      "violin sonata",
      "baroque",
    ],
    priorityArtists: [],
    genreFilters: ["classical", "opera"],
  },
  country: {
    label: "Country",
    description: "Country radio, outlaw, acoustic storytelling, and southern hooks.",
    searchTerms: ["country", "outlaw country", "country hits", "americana", "bluegrass"],
    priorityArtists: [],
    genreFilters: ["country", "americana", "bluegrass", "singer/songwriter", "folk"],
  },
  rap: {
    label: "Rap",
    description: "Mainstream rap, lyric-driven cuts, trap, and classic hip-hop.",
    searchTerms: ["rap", "hip-hop", "trap", "boom bap", "conscious rap"],
    priorityArtists: [],
    genreFilters: ["hip-hop/rap", "rap", "hip-hop"],
  },
  pop: {
    label: "Pop",
    description: "Big hooks, chart singles, and polished crossover tracks.",
    searchTerms: ["pop", "dance pop", "electropop", "top hits", "synthpop"],
    priorityArtists: [],
    genreFilters: ["pop"],
  },
  rock: {
    label: "Rock",
    description: "Alt rock, arena rock, indie rock, and classic anthems.",
    searchTerms: ["rock", "alternative rock", "indie rock", "classic rock", "hard rock"],
    priorityArtists: [],
    genreFilters: ["rock", "alternative", "indie", "hard rock"],
  },
  jazz: {
    label: "Jazz",
    description: "Swing, modern jazz, smooth sessions, and late-night standards.",
    searchTerms: ["jazz", "bebop", "smooth jazz", "jazz trio", "big band"],
    priorityArtists: [],
    genreFilters: ["jazz"],
  },
  blues: {
    label: "Blues",
    description: "Electric blues, delta roots, and smoky guitar leads.",
    searchTerms: ["blues", "electric blues", "delta blues", "blues rock", "soul blues"],
    priorityArtists: [],
    genreFilters: ["blues"],
  },
  edm: {
    label: "EDM",
    description: "Festival drops, house grooves, and club-ready electronic tracks.",
    searchTerms: ["EDM", "electronic dance", "house music", "techno", "trance"],
    priorityArtists: [],
    genreFilters: ["dance", "electronic", "house", "techno", "trance"],
  },
  lofi: {
    label: "Lo-Fi",
    description: "Chill loops, mellow beats, and study-session instrumentals.",
    searchTerms: ["lofi beats", "chillhop", "study beats", "lofi instrumental", "downtempo"],
    priorityArtists: [],
    genreFilters: ["hip-hop/rap", "electronic", "instrumental", "downtempo"],
  },
  rnb: {
    label: "R&B",
    description: "Smooth vocals, groove-heavy tracks, and modern soul crossover.",
    searchTerms: ["R&B", "contemporary R&B", "neo soul", "soul", "slow jam"],
    priorityArtists: [],
    genreFilters: ["r&b/soul", "r&b", "soul"],
  },
  soul: {
    label: "Soul",
    description: "Classic soul, deep vocals, horns, and warm live-band feel.",
    searchTerms: ["soul music", "motown", "southern soul", "funk soul", "classic soul"],
    priorityArtists: [],
    genreFilters: ["r&b/soul", "soul"],
  },
  reggae: {
    label: "Reggae",
    description: "Roots reggae, dub textures, and laid-back island grooves.",
    searchTerms: ["reggae", "roots reggae", "dub", "dancehall", "ska"],
    priorityArtists: [],
    genreFilters: ["reggae", "dub", "ska"],
  },
  latin: {
    label: "Latin",
    description: "Latin pop, reggaeton, salsa, bachata, and tropical rhythm.",
    searchTerms: ["latin music", "reggaeton", "salsa", "bachata", "latin pop"],
    priorityArtists: [],
    genreFilters: ["latin", "latino", "reggaeton", "salsa", "bachata"],
  },
  kpop: {
    label: "K-Pop",
    description: "Polished idol pop, dance-heavy singles, and glossy production.",
    searchTerms: ["K-pop", "Korean pop", "K-pop hits", "girl group", "boy band"],
    priorityArtists: [],
    genreFilters: ["k-pop", "pop"],
  },
  punk: {
    label: "Punk",
    description: "Fast guitars, attitude, and stripped-down energy.",
    searchTerms: ["punk", "pop punk", "hardcore punk", "skate punk", "punk rock"],
    priorityArtists: [],
    genreFilters: ["punk", "alternative", "rock"],
  },
  folk: {
    label: "Folk",
    description: "Acoustic storytelling, roots instrumentation, and intimate vocals.",
    searchTerms: ["folk", "indie folk", "acoustic folk", "singer songwriter", "traditional folk"],
    priorityArtists: [],
    genreFilters: ["folk", "singer/songwriter", "americana"],
  },
  ambient: {
    label: "Ambient",
    description: "Atmospheric pads, cinematic textures, and slow-burn soundscapes.",
    searchTerms: ["ambient", "drone ambient", "cinematic ambient", "soundscape", "new age"],
    priorityArtists: [],
    genreFilters: ["ambient", "electronic", "new age", "soundtrack"],
  },
  soundtrack: {
    label: "Soundtrack",
    description: "Film score, TV score, and dramatic instrumental themes.",
    searchTerms: ["soundtrack", "film score", "movie soundtrack", "cinematic score", "epic score"],
    priorityArtists: [],
    genreFilters: ["soundtrack", "classical", "instrumental"],
  },
  anime: {
    label: "Anime",
    description: "Opening themes, ending themes, and anime score highlights.",
    searchTerms: ["anime opening", "anime soundtrack", "anime theme", "J-rock anime", "anime score"],
    priorityArtists: [],
    genreFilters: ["anime", "j-pop", "soundtrack", "rock"],
  },
  instrumental: {
    label: "Instrumental",
    description: "Wordless arrangements spanning guitar, piano, and ensemble work.",
    searchTerms: [
      "instrumental",
      "guitar instrumental",
      "piano instrumental",
      "orchestral instrumental",
      "acoustic instrumental",
    ],
    priorityArtists: [],
    genreFilters: ["instrumental", "classical", "new age", "soundtrack"],
  },
};

const genreOptions = Object.entries(genrePresets).map(([value, preset]) => ({
  value,
  label: preset.label,
}));

const genreValues = genreOptions.map((option) => option.value);
const AUTOPILOT_QUEUE_SIZE = 18;
const AUTOPILOT_REFILL_THRESHOLD = 6;

function mapApiTrack(track) {
  return {
    id: `itunes-${track.trackId}`,
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName || "iTunes",
    genre: track.primaryGenreName || "Unknown",
    artwork:
      track.artworkUrl100?.replace("100x100", "600x600") ||
      track.artworkUrl100 ||
      "",
    src: track.previewUrl,
    source: "iTunes Preview",
  };
}

function normalizeText(value) {
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesGenre(track, preset) {
  const apiGenre = normalizeText(track.primaryGenreName);

  if (!apiGenre) {
    return false;
  }

  return preset.genreFilters.some((genreFilter) =>
    apiGenre.includes(normalizeText(genreFilter))
  );
}

function buildDedupKey(track) {
  return [
    normalizeText(track.artist),
    normalizeText(track.title),
    normalizeText(track.src),
  ].join("|");
}

function buildLooseDedupKey(track) {
  return [normalizeText(track.artist), normalizeText(track.title)].join("|");
}

function getBlockedTitles(preset) {
  const manualTitles = preset.blockedTitles || [];
  return [...preset.searchTerms, preset.label, ...manualTitles].map(normalizeText);
}

function shouldKeepTrack(track, preset) {
  const normalizedTitle = normalizeText(track.trackName);

  if (getBlockedTitles(preset).some((blockedTitle) => normalizedTitle === blockedTitle)) {
    return false;
  }

  return true;
}

function getNextGenreValue(currentGenre) {
  const currentIndex = genreValues.indexOf(currentGenre);
  if (currentIndex === -1) {
    return genreValues[0];
  }

  return genreValues[(currentIndex + 1) % genreValues.length];
}

function getUpcomingGenreValues(currentGenre, count = 3) {
  return Array.from({ length: count }, (_, index) => {
    let genreValue = currentGenre;

    for (let step = 0; step <= index; step += 1) {
      genreValue = getNextGenreValue(genreValue);
    }

    return genreValue;
  });
}

function buildAutopilotQueue(currentGenre, genreSongCache, size = 12) {
  const orderedGenres = [currentGenre, ...getUpcomingGenreValues(currentGenre, genreValues.length - 1)];
  const queue = [];
  const perGenreIndex = new Map();
  const seenTracks = new Set();

  while (queue.length < size) {
    let addedTrack = false;

    orderedGenres.forEach((genreValue) => {
      if (queue.length >= size) {
        return;
      }

      const tracks = genreSongCache[genreValue] || [];
      const currentIndex = perGenreIndex.get(genreValue) || 0;
      const track = tracks[currentIndex];

      if (!track) {
        return;
      }

      perGenreIndex.set(genreValue, currentIndex + 1);

      if (seenTracks.has(track.id)) {
        return;
      }

      seenTracks.add(track.id);
      queue.push({
        ...track,
        autoplayGenre: genreValue,
      });
      addedTrack = true;
    });

    if (!addedTrack) {
      break;
    }
  }

  return queue;
}

function extendAutopilotQueue(existingQueue, currentGenre, genreSongCache, size = 6) {
  const seedGenre =
    existingQueue[existingQueue.length - 1]?.autoplayGenre || currentGenre;
  const orderedGenres = [seedGenre, ...getUpcomingGenreValues(seedGenre, genreValues.length - 1)];
  const queue = [...existingQueue];
  const perGenreIndex = new Map();
  const seenTracks = new Set();
  const seenLooseMatches = new Set();

  existingQueue.forEach((track) => {
    seenTracks.add(track.id);
    seenLooseMatches.add(buildLooseDedupKey(track));
    perGenreIndex.set(
      track.autoplayGenre,
      (perGenreIndex.get(track.autoplayGenre) || 0) + 1
    );
  });

  while (queue.length < existingQueue.length + size) {
    let addedTrack = false;

    orderedGenres.forEach((genreValue) => {
      if (queue.length >= existingQueue.length + size) {
        return;
      }

      const tracks = genreSongCache[genreValue] || [];
      let currentIndex = perGenreIndex.get(genreValue) || 0;

      while (currentIndex < tracks.length) {
        const track = tracks[currentIndex];
        currentIndex += 1;
        perGenreIndex.set(genreValue, currentIndex);

        if (
          seenTracks.has(track.id) ||
          seenLooseMatches.has(buildLooseDedupKey(track))
        ) {
          continue;
        }

        seenTracks.add(track.id);
        seenLooseMatches.add(buildLooseDedupKey(track));
        queue.push({
          ...track,
          autoplayGenre: genreValue,
        });
        addedTrack = true;
        break;
      }
    });

    if (!addedTrack) {
      break;
    }
  }

  if (queue.length === existingQueue.length) {
    return existingQueue;
  }

  return queue;
}

function MusicPlayerApp() {
  const [selectedGenre, setSelectedGenre] = useState("metal");
  const [autopilotSeedGenre, setAutopilotSeedGenre] = useState("metal");
  const [genreSongCache, setGenreSongCache] = useState({});
  const [autopilotQueue, setAutopilotQueue] = useState([]);
  const [autopilotQueueIndex, setAutopilotQueueIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const audioRef = useRef(null);
  const shouldResumePlaybackRef = useRef(false);
  const pendingGenreLoadsRef = useRef(new Set());
  const isMountedRef = useRef(true);
  const pendingSongIndexRef = useRef(0);
  const songs = useMemo(
    () => (autopilotEnabled ? autopilotQueue : genreSongCache[selectedGenre] || []),
    [autopilotEnabled, autopilotQueue, genreSongCache, selectedGenre]
  );
  const song = songs[currentSongIndex] ?? null;
  const activeGenreValue = autopilotEnabled
    ? song?.autoplayGenre || selectedGenre
    : selectedGenre;
  const activeGenre = genrePresets[activeGenreValue] || genrePresets[selectedGenre];

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadGenreSongs = async (genreValue, options = {}) => {
    const { forceRefresh = false, showLoading = false } = options;
    const preset = genrePresets[genreValue];

    if (!preset) {
      return [];
    }

    if (!forceRefresh && genreSongCache[genreValue]?.length) {
      return genreSongCache[genreValue];
    }

    if (pendingGenreLoadsRef.current.has(genreValue)) {
      return genreSongCache[genreValue] || [];
    }

    pendingGenreLoadsRef.current.add(genreValue);

    if (showLoading) {
      setIsLoading(true);
      setLoadError("");
    }

    try {
      const requests = preset.searchTerms.map((term) =>
        fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            term
          )}&entity=song&media=music&limit=12`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json();
        })
      );

      const responses = await Promise.all(requests);
      const dedupedSongs = [];
      const seenIds = new Set();
      const seenLooseMatches = new Set();

      responses
        .flatMap((response) => response.results || [])
        .filter((track) => track.previewUrl)
        .filter((track) => matchesGenre(track, preset))
        .filter((track) => shouldKeepTrack(track, preset))
        .map(mapApiTrack)
        .forEach((track) => {
          const dedupKey = buildDedupKey(track);
          const looseDedupKey = buildLooseDedupKey(track);

          if (!seenIds.has(dedupKey) && !seenLooseMatches.has(looseDedupKey)) {
            seenIds.add(dedupKey);
            seenLooseMatches.add(looseDedupKey);
            dedupedSongs.push(track);
          }
        });

      dedupedSongs.sort((leftTrack, rightTrack) => {
        const leftPriority = preset.priorityArtists.some((artist) =>
          leftTrack.artist.toLowerCase().includes(artist)
        )
          ? 0
          : 1;
        const rightPriority = preset.priorityArtists.some((artist) =>
          rightTrack.artist.toLowerCase().includes(artist)
        )
          ? 0
          : 1;

        return leftPriority - rightPriority;
      });

      if (isMountedRef.current) {
        setGenreSongCache((currentCache) => ({
          ...currentCache,
          [genreValue]: dedupedSongs,
        }));

        if (!autopilotEnabled && genreValue === selectedGenre && dedupedSongs.length) {
          setCurrentSongIndex(
            Math.min(pendingSongIndexRef.current, Math.max(dedupedSongs.length - 1, 0))
          );
        }
      }

      return dedupedSongs;
    } catch (error) {
      if (showLoading && isMountedRef.current) {
        setLoadError(
          `Could not load ${preset.label.toLowerCase()} preview tracks from the music API.`
        );
      }
      return [];
    } finally {
      pendingGenreLoadsRef.current.delete(genreValue);
      if (showLoading && isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadGenreSongs(selectedGenre, { showLoading: true });
  }, [selectedGenre]);

  useEffect(() => {
    if (!autopilotEnabled) {
      return;
    }

    [selectedGenre, ...getUpcomingGenreValues(selectedGenre, 5)].forEach((genreValue) => {
      if (!genreSongCache[genreValue]?.length) {
        void loadGenreSongs(genreValue);
      }
    });
  }, [autopilotEnabled, selectedGenre, genreSongCache]);

  useEffect(() => {
    if (!autopilotEnabled) {
      return;
    }

    setAutopilotQueue((currentQueue) => {
      const rebuiltQueue = buildAutopilotQueue(
        autopilotSeedGenre,
        genreSongCache,
        AUTOPILOT_QUEUE_SIZE
      );
      const currentTrack = currentQueue[autopilotQueueIndex];

      if (!currentTrack) {
        return rebuiltQueue;
      }

      const rebuiltIndex = rebuiltQueue.findIndex(
        (track) =>
          track.id === currentTrack.id &&
          track.autoplayGenre === currentTrack.autoplayGenre
      );

      if (rebuiltIndex === -1) {
        return rebuiltQueue;
      }

      if (rebuiltIndex !== autopilotQueueIndex) {
        setAutopilotQueueIndex(rebuiltIndex);
      }

      return rebuiltQueue;
    });
  }, [autopilotEnabled, autopilotSeedGenre, genreSongCache]);

  useEffect(() => {
    if (!autopilotEnabled) {
      return;
    }

    if (autopilotQueue.length - autopilotQueueIndex > AUTOPILOT_REFILL_THRESHOLD) {
      return;
    }

    setAutopilotQueue((currentQueue) =>
      extendAutopilotQueue(currentQueue, selectedGenre, genreSongCache, AUTOPILOT_QUEUE_SIZE)
    );
  }, [autopilotEnabled, autopilotQueue, autopilotQueueIndex, selectedGenre, genreSongCache]);

  useEffect(() => {
    if (!autopilotEnabled) {
      setCurrentSongIndex(0);
      return;
    }

    setCurrentSongIndex(autopilotQueueIndex);
  }, [autopilotEnabled, autopilotQueueIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) {
      return undefined;
    }

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const setAudioMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const syncPlayState = () => setIsPlaying(true);
    const syncPauseState = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioMetadata);
    audio.addEventListener("play", syncPlayState);
    audio.addEventListener("pause", syncPauseState);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioMetadata);
      audio.removeEventListener("play", syncPlayState);
      audio.removeEventListener("pause", syncPauseState);
    };
  }, [song?.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) {
      return;
    }

    audio.load();
    setProgress(0);
    setDuration(0);

    if (isPlaying || shouldResumePlaybackRef.current) {
      shouldResumePlaybackRef.current = false;
      audio
        .play()
        .then(() => setLoadError(""))
        .catch(() =>
          setLoadError("Playback was blocked by the browser. Press play again.")
        );
    }
  }, [isPlaying, song?.src]);

  const playPauseHandler = async () => {
    if (!audioRef.current || !song) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      return;
    }

    try {
      await audioRef.current.play();
      setLoadError("");
    } catch (error) {
      setLoadError("Playback was blocked by the browser. Press play again.");
    }
  };

  const rotateToGenre = (genreValue, songIndex = 0) => {
    pendingSongIndexRef.current = songIndex;
    setSelectedGenre(genreValue);
    if (!autopilotEnabled) {
      setCurrentSongIndex(songIndex);
    }
    setProgress(0);
    setDuration(0);
  };

  const queueAutopilotAdvance = () => {
    setAutopilotQueueIndex((currentIndex) => {
      const nextIndex = currentIndex + 1;

      if (nextIndex < autopilotQueue.length) {
        return nextIndex;
      }

      const nextQueue = extendAutopilotQueue(
        autopilotQueue,
        selectedGenre,
        genreSongCache,
        AUTOPILOT_QUEUE_SIZE
      );

      if (nextQueue.length > autopilotQueue.length) {
        setAutopilotQueue(nextQueue);
        return nextIndex;
      }

      const nextGenre =
        getUpcomingGenreValues(activeGenreValue, genreValues.length - 1).find(
          (genreValue) => (genreSongCache[genreValue] || []).length
        ) || getNextGenreValue(activeGenreValue);
      setAutopilotSeedGenre(nextGenre);
      setSelectedGenre(nextGenre);
      return 0;
    });
  };

  const nextSongHandler = () => {
    shouldResumePlaybackRef.current = autopilotEnabled || isPlaying;
    setIsPlaying(true);

    if (!songs.length) {
      if (autopilotEnabled) {
        queueAutopilotAdvance();
      }
      return;
    }

    if (autopilotEnabled) {
      queueAutopilotAdvance();
      return;
    }

    setCurrentSongIndex((prevIndex) => {
      const isLastTrack = prevIndex >= songs.length - 1;

      if (isLastTrack) {
        return 0;
      }

      return prevIndex + 1;
    });
    setProgress(0);
  };

  const prevSongHandler = () => {
    if (autopilotEnabled) {
      setAutopilotQueueIndex((prevIndex) =>
        (prevIndex - 1 + Math.max(autopilotQueue.length, 1)) % Math.max(autopilotQueue.length, 1)
      );
      setProgress(0);
      return;
    }

    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + Math.max(songs.length, 1)) % Math.max(songs.length, 1)
    );
    setProgress(0);
  };

  const selectSongHandler = (index) => {
    if (autopilotEnabled) {
      setAutopilotQueueIndex(index);
    }
    setCurrentSongIndex(index);
    setProgress(0);
  };

  const handleGenreChange = (event) => {
    shouldResumePlaybackRef.current = autopilotEnabled || isPlaying;
    if (autopilotEnabled) {
      setAutopilotSeedGenre(event.target.value);
      setAutopilotQueueIndex(0);
    }
    rotateToGenre(event.target.value, 0);
  };

  useEffect(() => {
    if (!autopilotEnabled || isLoading || !songs.length) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio
      .play()
      .then(() => setLoadError(""))
      .catch(() =>
        setLoadError("Autopilot is ready, but the browser blocked playback. Press play once to unlock it.")
      );
  }, [autopilotEnabled, isLoading, songs, song?.src]);

  const handleAutopilotToggle = () => {
    const nextAutopilotState = !autopilotEnabled;
    setAutopilotEnabled(nextAutopilotState);

    if (nextAutopilotState) {
      shouldResumePlaybackRef.current = true;
      setIsPlaying(true);
      setAutopilotSeedGenre(selectedGenre);
      setAutopilotQueueIndex(0);

      const nextQueue = buildAutopilotQueue(
        selectedGenre,
        genreSongCache,
        AUTOPILOT_QUEUE_SIZE
      );
      setAutopilotQueue(nextQueue);

      if (!nextQueue.length) {
        [selectedGenre, ...getUpcomingGenreValues(selectedGenre, 5)].forEach((genreValue) => {
          void loadGenreSongs(genreValue);
        });
      }
    }
  };

  const handleProgressChange = (event) => {
    if (!audioRef.current || !duration) {
      return;
    }

    const newTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div className="app-shell">
      <div className="ambient-orb ambient-orb-left" />
      <div className="ambient-orb ambient-orb-right" />
      <div className="player-layout">
        <section className="player-card">
          <div className="hero-copy">
            <div className="eyebrow">Preview Deck</div>
            <h1>Music Player</h1>
            <p className="subheading">
              Jump between genre scenes instantly and keep the queue moving with
              clean previews, sharper artwork, and a stronger listening view.
            </p>
          </div>

          <div className="genre-panel">
            <div className="genre-copy">
              <div className="genre-label">Genre Focus</div>
              <h2>{activeGenre.label}</h2>
              <p className="genre-description">
                {activeGenre.description}
              </p>
            </div>
            <div className="genre-spotlight">
              <span className="genre-spotlight-label">Live Scene</span>
              <strong>{activeGenre.label}</strong>
              <p>Curated previews only. Duplicate noise cut out.</p>
            </div>
          </div>

          <div className="genre-stats">
            <div className="stat-pill">
              <span className="stat-label">Mode</span>
              <strong>{activeGenre.label}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Queue</span>
              <strong>{songs.length} Tracks</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Source</span>
              <strong>iTunes Preview</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Autopilot</span>
              <strong>{autopilotEnabled ? "On" : "Off"}</strong>
            </div>
          </div>

          {song ? (
            <>
              <div className="now-playing">
                <div className="cover-frame">
                  <img
                    className="cover-art"
                    src={song.artwork}
                    alt={`${song.title} cover art`}
                  />
                </div>
                <div className="track-meta">
                  <span className="source-badge">{song.source}</span>
                  <h2>{song.title}</h2>
                  <p>{song.artist}</p>
                  <span>{song.album}</span>
                  <div className="track-details">
                    <div>
                      <small>Genre</small>
                      <strong>{activeGenre.label}</strong>
                    </div>
                    <div>
                      <small>Position</small>
                      <strong>
                        {(autopilotEnabled ? autopilotQueueIndex : currentSongIndex) + 1}/{Math.max(songs.length, 1)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={song.src}
                key={song.src}
                onEnded={nextSongHandler}
              />
            </>
          ) : (
            <div className="now-playing">
              <div className="track-meta">
                <span className="source-badge">Waiting on previews</span>
                <h2>No track loaded yet</h2>
                <p>{activeGenre.label} previews will appear here as soon as the API responds.</p>
              </div>
            </div>
          )}

          <div className="progress-container">
            <div className="timestamps">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              className="progress-bar"
              value={(progress / duration) * 100 || 0}
              max="100"
              onChange={handleProgressChange}
            />
          </div>

          <div className="control-dock">
            <div className="controls">
              <button className="control-button secondary" onClick={prevSongHandler}>
                Prev
              </button>
              <button
                className={`control-button primary ${isPlaying ? "is-playing" : ""}`}
                onClick={playPauseHandler}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button className="control-button secondary" onClick={nextSongHandler}>
                Next
              </button>
              <button
                className={`control-button automation-toggle ${
                  autopilotEnabled ? "is-active" : ""
                }`}
                onClick={handleAutopilotToggle}
              >
                {autopilotEnabled ? "Autopilot On" : "Autopilot Off"}
              </button>
            </div>

            <div className="genre-select-wrap genre-dock" aria-label="Switch genre">
              <span>Switch genre</span>
              <div className="genre-grid" role="tablist" aria-label="Genre picker">
                {genreOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={selectedGenre === option.value}
                    className={`genre-chip ${
                      selectedGenre === option.value ? "active" : ""
                    }`}
                    onClick={() =>
                      handleGenreChange({ target: { value: option.value } })
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loadError ? <p className="status-message error">{loadError}</p> : null}
          <p className="status-message">
            {isLoading
              ? `Loading ${activeGenre.label.toLowerCase()} previews from the API...`
              : autopilotEnabled
                ? `Autopilot is live with ${songs.length} preview tracks in ${activeGenre.label}.`
                : `Library ready with ${songs.length} preview tracks.`}
          </p>
        </section>

        <aside className="playlist-card">
          <div className="playlist-header">
            <div>
              <div className="eyebrow">Queue</div>
              <h3>{activeGenre.label} Rotation</h3>
            </div>
            <span>{songs.length} tracks</span>
          </div>

          <div className="playlist">
            {songs.map((track, index) => (
              <button
                key={track.id}
                className={`playlist-item ${
                  index === (autopilotEnabled ? autopilotQueueIndex : currentSongIndex) ? "active" : ""
                }`}
                onClick={() => selectSongHandler(index)}
              >
                <span className="playlist-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img src={track.artwork} alt="" />
                <div>
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                  {autopilotEnabled ? <span>{genrePresets[track.autoplayGenre]?.label || activeGenre.label}</span> : null}
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default MusicPlayerApp;
