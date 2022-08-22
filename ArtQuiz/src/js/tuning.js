import * as generalFn from "./generalFunctions";

class Tuning {
  constructor() {
    let soundOn = generalFn.getItemFromLocalStorage("ddSoundOn", "");
    this.soundOn = soundOn ? true : false;

    let soundSettings = document.querySelector(".sound-settings");

    let btnSound = soundSettings.querySelector(".btn-sound");
    if (this.soundOn) {
      this.soundOnOff(btnSound);
    }

    this.rightAnswerSound = this.getAudio("right");
    this.wrongAnswerSound = this.getAudio("wrong");
    this.endSound = this.getAudio("end"); //end of game

    let soundLevel = generalFn.getItemFromLocalStorage("ddSoundLevel", "-1");
    this.soundLevel = Number(soundLevel) > 0 ? Number(soundLevel) : 50;
    this.setListenerOnCloseSettings();

    btnSound.addEventListener("click", () => {
      this.soundOnOff(btnSound, this.domLevelSound);
    });

    //timer settings
    let timerOn = generalFn.getItemFromLocalStorage("ddTimerOn", "false");
    this.timerOn = timerOn == true ? true : false;

    let domTimerSettings = document.querySelector(".time-settings");
    let domTimerOn = domTimerSettings.querySelector(".id-timer");
    domTimerOn.addEventListener("click", () => {
      this.timerOnOff();
    });

    let timerCount = generalFn.getItemFromLocalStorage("ddTimerCount", "-1");
    this.timerCount = Number(timerCount) > 0 ? timerCount : 10;
  }

  showTuning() {
   // let domSections = document.querySelectorAll(".section");
    let sectionSettings = document.querySelector(".settings-section");

    generalFn.showDomElementFast(sectionSettings);

    this.displaySoundSettings();
    this.displayTimerSettings();
  }

  displaySoundSettings() {
    let soundSettings = document.querySelector(".sound-settings");

    this.domLevelSound = soundSettings.querySelector(".soundlevel");
    this.domLevelSound.value = this.soundLevel;
    this.domLevelSound.addEventListener("input", () => {
      this.changeSoundlevel(this.domLevelSound);
    });

    this.setInputColor(this.domLevelSound, this.domLevelSound.value);
  }

  getAudio(soundParam) {
    let audio = new Audio();
    audio.src = `./assets/sound/${soundParam}.mp3`;
    return audio;
  }

  setInputColor(elem, value) {
    elem.style.background = `linear-gradient(
          to right,
          var(--color-violet) ${String(value)}%,
          var(--color-violet) ${String(value)}%,
          var(--color-milk) ${value}%,
          var(--color-milk) 100%)`;
  }

  changeSoundlevel(domLevelSound) {
    this.soundLevel = domLevelSound.value;
    this.setInputColor(domLevelSound, domLevelSound.value);
    generalFn.setItemToLocalStorage("ddSoundLevel", domLevelSound.value);
  }

  soundOnOff(btnSound) {
    btnSound.classList.toggle("mute");
    btnSound.classList.toggle("sound");
    this.soundOn = btnSound.classList.contains("sound");

    generalFn.setItemToLocalStorage(
      "ddSoundOn",
      btnSound.classList.contains("sound")
    );
  }

  setListenerOnCloseSettings() {
    let domSettings = document.querySelector(".settings-section");
    let btnCloseSettings = domSettings.querySelector(".close-window");
    btnCloseSettings.addEventListener("click", () => {
      generalFn.hideDomElementFast(domSettings);
    });
  }

  playAudio(trek) {
    trek.volume = this.soundLevel / 100;
    trek.play();
  }

  stopAudio(trek) {
    trek.pause();
    trek.currentTime = 0;
  }

  //timer functions

  displayTimerSettings() {
    let domtimerSettings = document.querySelector(".time-settings");
    let domTimerOn = domtimerSettings.querySelector(".id-timer");

    domTimerOn.checked = this.timerOn;

    this.domTimerCount = domtimerSettings.querySelector(".timer-count");
    this.domTimerCount.value = this.setValueSomTimer(this.timerCount);
    this.domTimerCount.addEventListener("input", () => {
      this.changeTimerCount(this.domTimerCount);
    });

    this.setInputColor(this.domTimerCount, this.domTimerCount.value);
  }

  setValueSomTimer(paramSec) {
    if (paramSec == 5) {
      return 5;
    } else if (paramSec == 10) {
      return 23;
    } else if (paramSec == 15) {
      return 41;
    } else if (paramSec == 20) {
      return 59;
    } else if (paramSec == 30) {
      return 77;
    } else {
      return 95;
    }
  }

  changeTimerCount(domTimerCount) {
    let curTime = domTimerCount.value;
    if (curTime <= 15) {
      this.timerCount = 5;
      curTime = 5;
    } else if (curTime <= 30) {
      this.timerCount = 10;
      curTime = 23;
    } else if (curTime <= 50) {
      this.timerCount = 15;
      curTime = 41;
    } else if (curTime <= 70) {
      this.timerCount = 20;
      curTime = 59;
    } else if (curTime <= 85) {
      this.timerCount = 25;
      curTime = 77;
    } else {
      this.timerCount = 30;
      curTime = 95;
    }
    domTimerCount.value = curTime;

    this.setInputColor(domTimerCount, domTimerCount.value);
    generalFn.setItemToLocalStorage("ddTimerCount", this.timerCount);
  }

  timerOnOff() {
    let domTimerOn = document.querySelector(".id-timer");
    this.timerOn = domTimerOn.checked;
    generalFn.setItemToLocalStorage("ddTimerOn", this.timerOn);
    this.displayTimerSettings();
  }
}

export default Tuning;
