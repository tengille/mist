// variables
const jsmediatags = window.jsmediatags;
const background = document.getElementById('background');
const loader = document.getElementById('loader');
const sidebar = document.getElementById('sidebar');
const controls = document.getElementById('controls');
const player = new Player();
loader.addEventListener('change', handleFiles);

// hover states
document.querySelector('html').addEventListener('mousemove', getCursorPosition)
function getCursorPosition(event) {
  if (event.clientX < 160) {
    sidebar.style.left = '0px';
  } else if (event.clientX >= 160) {
    sidebar.style.left = '-160px';
  }

  if (event.clientY > window.innerHeight - 60) {
    controls.style.bottom = '0px';
  } else if (event.clientY <= window.innerHeight - 60) {
    controls.style.bottom = '-60px';
  }
}

// void
function handleFiles() {
  loader.style.display = 'none';
  populateSongs(this.files);
}

// input [Filelist]
// description: populates sidebar with songs & sets up listeners
async function populateSongs(files) {
  for (let i = 0; i < files.length; i++) {
    if (files[i].type === 'audio/mpeg') {
      player.songs.push(files[i]);

      await jsmediatags.read(files[i], {
        onSuccess: function(tag) {
          // looking by song name... not ideal
          let songFile = findSong(tag.tags.title)
          if (songFile) {
            songFile.tag = tag;
          } else {
            alert('Something fishy happened whilst getting id3 information. Sorry.');
          }
        },
        onError: function(error) {
          alert(error);
        }
      });
    }
  }

  populateSidebar();
}

// input: string (song name)
// returns: song File
function findSong(songName) {
  return player.songs.find(songFile => songFile.name.includes(songName));
}

// void
function populateSidebar() {
  for (let i = 0; i < player.songs.length; i++) {
    let songElement = song(player.songs[i].name);
    songElement.dataset.id = i;
  }

  controls.style.display = 'block';
  controls.style.bottom = '0px';
  sidebar.style.display = 'block';
  sidebar.style.left = '0px';
}

// void
function song(name) {
  // // fixme via id3 tags
  // if (name.length > 28) {
  //   name = name.substring(0, 25) + '...'
  // }

  let div = document.createElement('div');
  div.className = 'song';
  div.innerText = name;
  sidebar.appendChild(div);

  div.addEventListener('click', (event) => {
    let id = parseInt(event.target.dataset.id);
    // player.play(id).bind(player);
    player.play(id);
    setActiveSong(id);
  });

  return div;
}

// input: id
// void
function setActiveSong(id) {
  let songDivs = document.getElementsByClassName('song');
  for (let i = 0; i < songDivs.length; i++) {
    if (parseInt(songDivs[i].dataset.id) === id) {
      songDivs[i].className = 'song active';
      setBackground(i);
    } else {
      songDivs[i].className = 'song';
    }
  }
}

// input: song File id
// void
// ref: https://stackoverflow.com/a/20756091
function setBackground(id) {
  let format = player.songs[id].tag.tags.picture.format;
  let bytes = player.songs[id].tag.tags.picture.data;

  function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  let b64 = arrayBufferToBase64(bytes);
  background.style.backgroundImage = `url("data:${format};base64,${b64}")`;
}

// locked and loaded
console.log('loaded js/fileHander.js');
