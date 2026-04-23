let mySound;

function initSoundButton() {
  const soundButton = document.querySelector(".sound");
  if (!soundButton) return;

  soundButton.addEventListener("click", () => {
    userStartAudio();
    soundButton.classList.toggle("is-open");

    if (soundButton.classList.contains("is-open")) {
      if (!mySound.isPlaying()) {
        mySound.setVolume(0.5, 0.05);
        mySound.loop();
      }
    } else {
      mySound.setVolume(0,0.3); 
      setTimeout(() => {
        mySound.stop();
      }, 300);
    }
  });
}

initSoundButton();

