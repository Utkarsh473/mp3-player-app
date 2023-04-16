// context in javascript depends on how you call a function

/*
1. When play button is clicked -->
  a. song should play *** Q. How to play song ***
  b. seek slider should move
  c. play icon to be changed to pause icon
2. Next and back buttons
  a. Details should change
    i. playing x of y to be updated 
    ii. track name and track artist
    iii. song file to be updated
3. Seek slider - upon sliding, song play should progress/regress to that time
4. Volume slider - 
  a. up button to increase the volume
  b. down button to decrease the volume
*/

// Define the list of tracks that have to be played
let track_list = [
  {
    name: "Demo1",
    artist: "Broke For Free",
    image: "https://picsum.photos/640/360",
    path: "songs/sample1.mp3"
  },
  {
    name: "Every Morning",
    artist: "Anton Vlasov",
    image: "https://picsum.photos/320/180",
    path: "songs/every-morning-18304.mp3"
  },
  {
    name: "Relax and Sleep",
    artist: "Anton Vlasov",
    image: "https://picsum.photos/480/270",
    path: "songs/relax-and-sleep-18565.mp3",
  },
  {
    name: "Uplifting Day",
    artist: "Lesfm",
    image: "https://picsum.photos/240/180",
    path: "songs/uplifting-day-15583.mp3",
  }
];

// 1. Select all the elements in the HTML page
// and assign them to a variable
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// 2. Specify globally used values
let track_index = 0;
let updateTimerId;
let isPlaying = false;

// 3. Create the audio element for the player
const curr_track = document.createElement('audio');

playpause_btn.addEventListener('click', () => {
  playpauseTrack();
});

next_btn.childNodes[1].addEventListener('click', nextTrack);
prev_btn.childNodes[1].addEventListener('click', prevTrack);

seek_slider.addEventListener('input', seekTo)
volume_slider.addEventListener('input', setVolume);






function loadTrack(track_index) {
  clearInterval(updateTimerId);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();
  now_playing.textContent = `playing ${track_index + 1} of ${track_list.length}`;

  track_name.innerText = `${track_list[track_index].name}`;
  track_artist.textContent = track_list[track_index].artist;
  track_art.style.backgroundImage = `url("${track_list[track_index].image}")`;

  random_bg_color();

  setIntervalId = setInterval(seekUpdate, 1000);

  curr_track.addEventListener('ended', nextTrack);

}

function random_bg_color() {
  let red = setRandom();
  let blue = setRandom();
  let green = setRandom();

  // console.log(red, blue, green);
  document.body.style.backgroundColor = `rgb( ${red},${green},${blue} )`;
}


function setRandom() {
  return (Math.floor(Math.random() * (256 - 64)) + 64);
}

// Function to reset all values to their default
function resetValues() {
  curr_time.innerText = '00.00';
  total_duration.innerText = '00.00';
  now_playing.innerText = `playing ${track_index + 1} of ${track_list.length}`;
}

function playpauseTrack() {
  console.log('playing/pausing');
  const res = (isPlaying == false ? playTrack() : pauseTrack());
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa-solid fa-circle-pause fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = `<i class="fa-solid fa-circle-play fa-5x"></i>`
}

function nextTrack() {
  track_index = (track_index + 1) % track_list.length
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  track_index = (track_index - 1) % track_list.length
  if(track_index <0)
  {
    track_index = track_list.length + track_index;
  }
  loadTrack(track_index);
  playTrack();
}

function seekTo() {

  let seekTime = (curr_track.duration * seek_slider.value / 100);
  curr_track.currentTime = seekTime;

}

function setVolume() {

  let volume = volume_slider.value / 100;
  const lowvolIcon = document.getElementById("volume-low");
  if (volume === 0) {
    
    lowvolIcon.classList.remove('fa-volume-low');
    lowvolIcon.classList.add('fa-volume-xmark');
    
  }
  else{
    lowvolIcon.classList.remove('fa-volume-xmark');
    lowvolIcon.classList.add('fa-volume-low');
  }
  curr_track.volume = volume;

}

function seekUpdate() {

  // Handling output of current time
  let timeCurrent = curr_track.currentTime;
  let currentMins = Math.floor(timeCurrent / 60);
  let currentSec = parseInt(timeCurrent - currentMins * 60);
  let currMinString = `0${currentMins}`.slice(-2);
  let currSecString = `0${currentSec}`.slice(-2);
  curr_time.innerText = `${currMinString}:${currSecString}`


  // Handling output of total time
  let totalTime = curr_track.duration;
  let totalMins = Math.floor(totalTime / 60);
  let totalSec = parseInt(totalTime - totalMins * 60);
  let totalMinString = `0${totalMins}`.slice(-2);
  let totalSecString = `0${totalSec}`.slice(-2);
  total_duration.innerText = `${totalMinString}:${totalSecString}`

  let progress = (curr_track.currentTime * 100 / curr_track.duration);
  seek_slider.value = progress;
}

loadTrack(track_index);
