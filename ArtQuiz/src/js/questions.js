import Picture from "./picture";
import { stop_quiz } from "./settings.js";
export let set_timer;
import * as generalFn from "./generalFunctions";

class Question {
  constructor(type, question, answers) {
    this.type = type;

    this.picture = new Picture(
      question.name,
      question.author,
      question.imageNum,
      question.year
    );

    if (type == "picture") {
      this.section = document.querySelector(".picture-quiz-section");
      this.correctAnswer = question.author;
      this.answers = this.defineAnswers(question.author, answers);
    } else {
      this.section = document.querySelector(".artist-quiz-section");
      this.correctAnswer = question.imageNum;
      this.answers = this.defineAnswers(question.imageNum, answers);
    }

    this.isCorrect = "notAnswered";
    this.domAnswers = [];
  }

  defineAnswers(correctAnswer, answers) {
    let arrResult = [];
    let countAnswers = 0;
    while (countAnswers < 3) {
      const j = Math.floor(Math.random() * answers.length);
      if (this.type == "picture") {
        if (answers[j].trim() != correctAnswer.trim()) {
          if (!arrResult.includes(answers[j])) {
            arrResult.push(answers[j].trim());
            countAnswers++;
          }
        }
      } else {
        if (
          answers[j].author != this.picture.author &&
          answers[j].imageNum != correctAnswer &&
          !arrResult.includes(answers[j].imageNum)
        ) {
          arrResult.push(answers[j].imageNum);
          countAnswers++;
        }
      }
    }
    arrResult.push(this.correctAnswer);
    arrResult.sort(() => Math.random() - 0.5);

    return arrResult;
  }

  renderPicture(setClass) {
    //show question on screen
    try {
      clearInterval(set_timer);
    } finally {
    this.setClass = setClass;
    const domQuestionImage = this.section.querySelector(".picture-image");

    const answerWrapper = this.section.querySelector(
      ".picture-answers-wrapper"
    );
    const divAnswer = answerWrapper.querySelectorAll(".picture-answer");

    generalFn.setImage(
      domQuestionImage,
      `https://raw.githubusercontent.com/Dairin-dei/art-quiz-images/master/img/${this.picture.imageNum}.jpg`
    );

    divAnswer.forEach((elem) => {
      elem.remove();
    });
    this.domAnswers = [];
    for (let i = 0; i < 4; i++) {
      let domDivAnswer = document.createElement("div");
      domDivAnswer.classList.add("picture-answer");
      domDivAnswer.classList.add("font-answer");
      domDivAnswer.innerHTML = this.answers[i];

      answerWrapper.append(domDivAnswer);
      domDivAnswer.addEventListener("click", () => this.afterClick(i));
      this.domAnswers.push(domDivAnswer);
    }

    if (this.setClass.timerOn) {
      this.engageTimer();
    } else {
      const domTimer = this.section.querySelector(".timer-count");
      domTimer.innerHTML = "";
    }
  }
  }

  renderArtist(setClass) {
    //show question on screen
    try {
      clearInterval(set_timer);
    } finally {
    this.setClass = setClass;
    let domQuestion = this.section.querySelector(".artist-quiz-question");
    domQuestion.innerHTML = `Которую из этих картин написал ${this.picture.author}?`;
    }

    const answerWrapper = this.section.querySelector(".artist-answers-wrapper");
    let divAnswer = answerWrapper.querySelectorAll(".artist-answer");
    divAnswer.forEach((elem) => {
      elem.remove();
    });
    this.domAnswers = [];
    for (let i = 0; i < 4; i++) {
      let domDivAnswer = document.createElement("div");
      domDivAnswer.classList.add("artist-answer");
      domDivAnswer.classList.add("font-answer");

      generalFn.setImage(
        domDivAnswer,
        `https://raw.githubusercontent.com/Dairin-dei/art-quiz-images/master/img/${this.answers[i]}.jpg`
      );

      domDivAnswer.addEventListener("click", () => this.afterClick(i));
      answerWrapper.append(domDivAnswer);
      this.domAnswers.push(domDivAnswer);
    }
    if (this.setClass.timerOn) {
      this.engageTimer();
    } else {
      const domTimer = this.section.querySelector(".timer-count");
      domTimer.innerHTML = "";
    }
  }

  afterClick(index) {
    if (this.type == "picture") {
      if (this.correctAnswer == this.answers[index]) {
        this.domAnswers[index].classList.add("animated");
        this.domAnswers[index].style.backgroundColor = "#10965e";
        this.domAnswers[index].style.color = "#ffffff";
        this.rightAnswer();
      } else {
        this.domAnswers[index].classList.add("animated");
        this.domAnswers[index].style.backgroundColor = "#cf170a";
        this.domAnswers[index].style.color = "#000000";

        this.wrongAnswer();
      }
    } else {
      if (this.correctAnswer == this.answers[index]) {
        this.domAnswers[index].classList.add("artist-answer-right");
        this.rightAnswer();
      } else {
        this.domAnswers[index].classList.add("artist-answer-wrong");
        this.wrongAnswer();
      }
    }

    this.picture.showInfoPage(this.isCorrect, true);
  }

  rightAnswer() {
    try {
      clearInterval(set_timer);
    } finally {
    this.isCorrect = "yes";
    if (this.setClass.soundOn) {
      this.setClass.playAudio(this.setClass.rightAnswerSound);
    }
  }
  }

  wrongAnswer() {
    try {
      clearInterval(set_timer);
    } finally {
    this.isCorrect = "no";
    if (this.setClass.soundOn) {
      this.setClass.playAudio(this.setClass.wrongAnswerSound);
    }
  }
  }

  wrongInfoPage() {
    this.picture.showInfoPage("no", true);
    console.log("wrongInfoPage");
  }

  engageTimer() {
    const domTimer = this.section.querySelector(".timer-count");
    let strTimer = `00:${this.setClass.timerCount.toString().padStart(2, "0")}`;
    domTimer.innerHTML = strTimer;

    let count = this.setClass.timerCount - 1;

    let wrongAnswerTimer = this.wrongAnswer.bind(this);

    let wrongAnswerShowInfoPage = this.wrongInfoPage.bind(this);
    if (!this.section.classList.contains("hide")) {
      set_timer = setInterval(function () {
        if (count <= 0) {
          clearInterval(set_timer);
          wrongAnswerTimer();
          wrongAnswerShowInfoPage();
        } else {
          let strTimer = `00:${count.toString().padStart(2, "0")}`;
          domTimer.innerHTML = strTimer;
        }
        if (!stop_quiz) {
          --count;
        } else {
          clearInterval(set_timer);
        }
      }, 1000);
    }
  }
}

export default Question;
