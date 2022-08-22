import Question from "./questions";
import * as generalFn from "./generalFunctions";
import { stop_quiz } from "./settings.js";
export let is_quiz_finished = false;
export let removeEventListener;

class Quiz {
  constructor(type, currentQuiz, data, setClass) {
    let categorySection = document.querySelector(".category-section");
    this.currentQuiz = currentQuiz;
    this.type = type;
    this.setClass = setClass;
    is_quiz_finished = false;

    removeEventListener = this.finishInfoSection.bind(this);
    if (this.type === "picture") {
      this.domCurrentQuiz = document.querySelector(".picture-quiz-section");
    } else {
      this.domCurrentQuiz = document.querySelector(".artist-quiz-section");
    }
    this.arrAnswers = this.getAnswers(data);
    this.arrQuestions = this.convertToClass(
      this.getQuestions(data),
      this.type == "picture" ? this.arrAnswers : data
    );

    this.answeredQuestions = 0;
    generalFn.hideDomElement(categorySection);
    this.renderIndicators();
    generalFn.showDomElementFast(this.domCurrentQuiz);

    this.setListenerOnContinue();
    this.setListenerOnCloseResult();
    this.renderNextQuestion();
  }

  getQuestions(data) {
    let arrQuestions = [];
    let beginNumber;

    if (this.type == "artist") {
      beginNumber = (this.currentQuiz - 1) * 10;
    } else {
      beginNumber = 120 + (this.currentQuiz - 1) * 10;
    }
    for (let i = beginNumber; i < beginNumber + 10; i++) {
      arrQuestions.push(data[i]);
    }
    return arrQuestions;
  }

  setListenerOnContinue() {
    let domBtnContinue = document.querySelector(".continue");
    domBtnContinue.addEventListener("click", removeEventListener);
  }

  finishInfoSection() {
    console.log("finishInfoSection", this.answeredQuestions);
    let domInfoPageSection = document.querySelector(".infopage-section");
    generalFn.hideDomElement(domInfoPageSection);
    domInfoPageSection.classList.remove("moveUp");
    this.answeredQuestions++;
    this.renderNextQuestion();
    this.renderIndicators();
    if (this.setClass.soundOn) {
      this.setClass.stopAudio(this.setClass.rightAnswerSound);
      this.setClass.stopAudio(this.setClass.wrongAnswerSound);
    }
  }

  getAnswers(data) {
    let arrAnswers = [];
    if (this.type == "picture") {
      //we see picture, need to store authors
      for (let i = 0; i < data.length; i++) {
        arrAnswers.push(data[i].author);
      }
    }
    return arrAnswers;
  }

  convertToClass(arrBefore, arrAnswers) {
    let arrQuestions = [];
    arrBefore.forEach((elem) => {
      let question = new Question(this.type, elem, arrAnswers);
      arrQuestions.push(question);
    });
    return arrQuestions;
  }

  renderNextQuestion() {
    if (!stop_quiz) {
      if (this.answeredQuestions == 10) {
        this.renderIndicators();
        this.getResultAndSetToLocalStorage();
        this.renewCategoryResult();
        generalFn.hideDomElement(this.domCurrentQuiz);
        let domResult = document.querySelector(".round-result-section");
        let categorySection = document.querySelector(".category-section");
        let domCategories = categorySection.querySelectorAll(".category");
        generalFn.showDomElement(document.querySelector(".category-section"));
        for (let i = 0; i < domCategories.length; i++) {
          setTimeout(() => {
            domCategories[i].classList.remove("move-down");
          }, 250 * i);
        }

        generalFn.showDomElement(domResult);
        if (this.setClass.soundOn) {
          this.setClass.playAudio(this.setClass.endSound);
        }
        let domBtnContinue = document.querySelector(".continue");
        domBtnContinue.removeEventListener("click", removeEventListener);
        is_quiz_finished = true;
      } else {
        if (!stop_quiz) {
          let curQuestion = this.arrQuestions[this.answeredQuestions];
          if (this.type == "picture") {
            curQuestion.renderPicture(this.setClass);
          } else {
            curQuestion.renderArtist(this.setClass);
          }
        }
      }
    }
  }

  renderIndicators() {
    let domIndicators = this.domCurrentQuiz.querySelector(".indicators");
    let domExistedIndicators = domIndicators.querySelectorAll(".indicator");
    if (domExistedIndicators.length == 1) {
      //first time, no indicators, create them in grey
      for (let i = 1; i < 10; i++) {
        let domIndicator = domExistedIndicators[0].cloneNode();
        domIndicators.append(domIndicator);
      }
    } else {
      //it was next question, paint indicators
      this.arrQuestions.forEach((elem, index) => {
        if (elem.isCorrect == "yes") {
          domExistedIndicators[index].classList.add("correctIndicator");
        } else if (elem.isCorrect == "no") {
          domExistedIndicators[index].classList.add("wrongIndicator");
        } else {
          domExistedIndicators[index].classList.remove("correctIndicator");
          domExistedIndicators[index].classList.remove("wrongIndicator");
        }
      });
    }
  }

  getResultAndSetToLocalStorage() {
    let arrResult = [];
    let domStrResult = document.querySelector(".round-result");

    this.arrQuestions.forEach((elem) => {
      if (elem.isCorrect == "yes") {
        arrResult.push(1);
      } else {
        arrResult.push(0);
      }
    });
    generalFn.setItemToLocalStorage(
      `dd${this.type}Category${this.currentQuiz}played`,
      true
    );
    let sumResult = arrResult.reduce((sum, c) => sum + c, 0);
    domStrResult.innerHTML = `${sumResult.toString()} / 10`;
    generalFn.setItemToLocalStorage(
      `dd${this.type}${this.currentQuiz.toString()}`,
      arrResult
    );
    generalFn.setItemToLocalStorage(
      `dd${this.type}Category${this.currentQuiz}Result`,
      sumResult
    );
  }

  renewCategoryResult() {
    let domCategory =
      document.querySelectorAll(".category")[this.currentQuiz - 1];
    domCategory.dispatchEvent(new Event("showOnScreen"));
  }

  setListenerOnCloseResult() {
    let domResult = document.querySelector(".round-result-section");
    let btnCloseResult = domResult.querySelector(".go-back");
    btnCloseResult.addEventListener("click", () =>
      generalFn.hideDomElement(domResult)
    );
  }
}
export default Quiz;
