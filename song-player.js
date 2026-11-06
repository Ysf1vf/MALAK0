document.addEventListener("DOMContentLoaded", () => {
  const songs = [
    {
      title: " Reflections ♡",
      artist: "The Neighbourhood",
      src: "A0.mp3"
    },
    {
      title: "Perfect ♡",
      artist: "Ed Sheeran",
      src: "Perfect.mp3"
    },

    {
      title: "Into it ",
      artist: "chase Atlantic",
      src: "A2.mp3"
  },

    {
      title: "Lovesong ♡",
      artist: "Adeel",
      src: "Lovesong.mp3"
    },

    {
      title: "Swim",
      artist: "chase Atlantic",
      src: "Swim.mp3"
    },

    {
      title: "Last Leaves of Autumn ♡",
      artist: "Zleepyfred",
      src: "Lla.mp3"
    },

    {
      title: "Heaven And Back",
      artist: "chase Atlantic",
      src: "HEAVEN&BACK.mp3"
    },

  {
      title: "Friends",
      artist: "chase Atlantic",
      src: "A3.mp3"
  },

  {
      title: "Sweater Weather",
      artist: "The Neighbourhood",
      src: "A4.mp3"
  },

  {
      title: "Love me not",
      artist: "Ravyn lenae",
      src: "A6.mp3"
  },

    {
      title: "الوقت فات؟",
      artist: "امير عيد",
      src: "A1.mp3"
    },
    
    {
      title: "A",
      artist: "امير عيد",
      src: "MA.mp3"
    },

    {
      title: "♡وحشتيني",
      artist: "امير عيد",
      src: "MA2.mp3"
    },

    {
      title: "James Dean♡",
      artist: "امير عيد",
      src: "MA1.mp3"
    },

    {
      title: "حبيبي",
      artist: "♡",
      src: "A5.mp3"
    },

  ];

  const audio = document.getElementById("song-audio");
  const title = document.getElementById("song-title");
  const artist = document.getElementById("song-artist");
  const cover = document.getElementById("song-cover");
  const playButton = document.getElementById("song-play");
  const progress = document.getElementById("song-progress");
  const currentTime = document.getElementById("song-current-time");
  const duration = document.getElementById("song-duration");
  const previousButton = document.getElementById("song-previous");
  const nextButton = document.getElementById("song-next");
  const shuffleButton = document.getElementById("song-shuffle");
  const repeatButton = document.getElementById("song-repeat");

  if (
    !audio || !title || !artist || !playButton || !progress ||
    !currentTime || !duration || !previousButton || !nextButton ||
    !shuffleButton || !repeatButton
  ) {
    return;
  }

  let songIndex = 0;
  let shuffle = false;
  let repeat = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  }

  function getNextIndex() {
    if (songs.length <= 1) return songIndex;

    if (shuffle) {
      let nextIndex = songIndex;

      while (nextIndex === songIndex) {
        nextIndex = Math.floor(Math.random() * songs.length);
      }

      return nextIndex;
    }

    return (songIndex + 1) % songs.length;
  }

  function loadSong(index, autoplay = false) {
    if (!songs.length) return;

    songIndex = (index + songs.length) % songs.length;

    const song = songs[songIndex];

    title.textContent = song.title;
    artist.textContent = song.artist;

    audio.pause();
    audio.src = song.src;
    audio.load();

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play");

    if (autoplay) {
      playSong();
    }
  }

  function playSong() {
    audio.play().catch(() => {
      playButton.textContent = "▶";
      playButton.setAttribute("aria-label", "Play");
    });
  }

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      playSong();
    } else {
      audio.pause();
    }
  });

  previousButton.addEventListener("click", () => {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      const previousIndex =
        (songIndex - 1 + songs.length) % songs.length;

      loadSong(previousIndex, true);
    }
  });

  nextButton.addEventListener("click", () => {
    loadSong(getNextIndex(), true);
  });

  shuffleButton.addEventListener("click", () => {
    shuffle = !shuffle;

    shuffleButton.classList.toggle("active", shuffle);
    shuffleButton.setAttribute("aria-pressed", String(shuffle));
  });

  repeatButton.addEventListener("click", () => {
    repeat = !repeat;
    audio.loop = repeat;

    repeatButton.classList.toggle("active", repeat);
    repeatButton.setAttribute("aria-pressed", String(repeat));
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value = (audio.currentTime / audio.duration) * 100;
    } else {
      progress.value = 0;
    }
  });

  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime =
        (Number(progress.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener("play", () => {
    playButton.textContent = "Ⅱ";
    playButton.setAttribute("aria-label", "Pause");
  });

  audio.addEventListener("pause", () => {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play");
  });

  audio.addEventListener("ended", () => {
    if (repeat || songIndex === songs.length - 1 && !shuffle) {
      return;
    }

    loadSong(getNextIndex(), true);
  });
  
  loadSong(0);
});