// ...
class Player {
  constructor() {
    this.index = 0;
    this.songs = [];
    this.audio = new Audio();
    this.audio.volume = 0.1;

    //
    this.volumeControl = document.getElementById('volume');
    this.songTitle = document.getElementById('song');

    // buttons
    this.backButton = document.getElementById('back');
    this.playPauseButton = document.getElementById('play-pause');
    this.nextButton = document.getElementById('next');
    this.#setupButtonListeners();
  }

  // returns song file
  get currentSong() {
    return this.songs[this.index];
  }

  get volume() {
    return this.audio.volume;
  }

  set volume(val) {
    this.audio.volume = val;
  }

  // void
  next() {
    this.index++;
    if (this.index > this.songs.length - 1) {
      this.index = 0;
    }
    this.play();
  }

  // void
  back() {
    this.index--;
    if (this.index < 0) {
      this.index = this.songs.length - 1;
    }
    this.play();
  }

  // input: integer
  // void
  play(id=this.index) {
    this.audio.src = this.songs[id].path;
    this.audio.play();
    this.songTitle.innerHTML = `"${this.currentSong.tag.tags.title}" - ${this.currentSong.tag.tags.artist}`;
  }

  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play();
      this.playPauseButton.innerText = "▶️";
    } else {
      this.audio.pause();
      this.playPauseButton.innerText = "⏸️";
    }
  }

  #setupButtonListeners() {
    this.audio.addEventListener('ended', function() {
      this.next();
    }.bind(this));
    this.backButton.addEventListener('click', function() {
      this.back();
    }.bind(this));
    this.nextButton.addEventListener('click', function() {
      this.next();
    }.bind(this));
    this.playPauseButton.addEventListener('click', function() {
      this.togglePlayPause();
    }.bind(this));
    this.volumeControl.addEventListener('change', function(e) {
      this.volume = parseFloat(e.target.value);
    }.bind(this));
  }
}
