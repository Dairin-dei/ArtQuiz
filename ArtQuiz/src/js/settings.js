import Quiz from "./quiz";
import Results from "./results";
import * as generalFn from "./generalFunctions";
import Tuning from "./tuning";
export let stop_quiz = false;

import set_timer from "./questions";
//import * as selfestimation from "./selfestimation";
import { removeEventListener } from "./quiz";

class Settings {
  constructor() {
    this.settingsForm = document.querySelector(".settings-section");
    this.quiz = {};
    this.stop = false;
    this.tuning = new Tuning();
    this.setSettings();
  }

  setSettings() {
   // selfestimation.selfestimation();
    let sectionHome = document.querySelector(".main-section");
    let buttonPictureQuiz = sectionHome.querySelector(".button-main-picture");
    let buttonArtistQuiz = sectionHome.querySelector(".button-main-artist");
    let btnHome = document.querySelector(".icon-home");
    let btnCat = document.querySelector(".icon-categories");
    let btnSettings = sectionHome.querySelector(".button-main-settings");
    let footer = document.querySelector("footer");

    buttonPictureQuiz.addEventListener("click", () => {
      this.type = "picture";
      this.quiz = {};
      try {
        clearInterval(set_timer);
      } finally {
      this.showCategories(this.type);
      }
    });
    buttonArtistQuiz.addEventListener("click", () => {
      this.type = "artist";
      this.quiz = {};
      try {
        clearInterval(set_timer);
      } finally {
      this.showCategories(this.type);
      }
    });
    btnHome.addEventListener("click", () => {
      let domSections = document.querySelectorAll(".section");
      stop_quiz = true;
      let domBtnContinue = document.querySelector(".continue");
      domBtnContinue.removeEventListener("click", removeEventListener);
      try {
        clearInterval(set_timer);
      } finally {
      domSections.forEach((elem) => {
        generalFn.hideDomElementFast(elem);
      });
    }
      generalFn.hideDomElementFast(btnHome.parentNode);
      generalFn.showDomElementFast(sectionHome);
      generalFn.showDomElementFast(footer);
    });

    btnSettings.addEventListener("click", () => {
      this.setTuning();
    });

    btnCat.addEventListener("click", () => {
      stop_quiz = true;
      try {
        if (set_timer) {
    clearInterval(set_timer);
}
        clearInterval(set_timer);
      } finally {
      let domBtnContinue = document.querySelector(".continue");
      domBtnContinue.removeEventListener("click", removeEventListener);
      generalFn.hideDomElementFast(footer);
      let domSections = document.querySelectorAll(".section");

      domSections.forEach((elem) => {
        generalFn.hideDomElementFast(elem);
      });
      this.showCategories(this.type);
    }
    });
  }

  showCategories(type) {
    this.type = type;
   // let header = document.querySelector(".header");
   // let mainSection = document.querySelector(".main-section");
    let categorySection = document.querySelector(".category-section");
    let divCategories = categorySection.querySelectorAll(".category");
   // let footer = document.querySelector(".footer");

    divCategories.forEach((elem) => {
      elem.remove();
    });

    for (let i = 0; i < 12; i++) {
      let hDiv = document.createElement("div");
      hDiv.classList.add(
        "category",
        "wrapper-horizontal",
        "less-opacity",
        "move-down"
      );

      let strCategoryName = (i + 1).toString().padStart(2, "0");
      hDiv.style.backgroundImage = `url('./assets/images/categories/${strCategoryName}${this.type}.PNG')`;
      categorySection.append(hDiv);

      let hName = document.createElement("h3");
      hName.classList.add("category-name", "h3");
      hDiv.append(hName);

      hName.innerHTML = strCategoryName;

      let hResult = document.createElement("h4");
      hResult.classList.add("category-result","h4");
      hDiv.append(hResult);
      hResult.innerHTML = "0 / 10";
    }

    generalFn.hideMainMenu();

    divCategories = categorySection.querySelectorAll(".category");

    divCategories.forEach((elem, index) => {
      elem.addEventListener("click", () => this.chooseCategory(elem));

      elem.addEventListener("showOnScreen", () =>
        this.changeCategoryResults(index + 1, elem)
      );
      let eventShow = new Event("showOnScreen");
      elem.dispatchEvent(eventShow);

      let categoryResult = elem.querySelector(".category-result");
      categoryResult.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showDetailedResult(index);
      });
    });
  }

  async chooseCategory(divCategory) {
    divCategory.classList.add("downscale");
    let numberCategory = Number(
      divCategory.querySelector(".category-name").innerHTML
    );
    this.category = numberCategory;

    let data = await this.getDataFile();
    this.data = data;

    let categorySection = document.querySelector(".category-section");
    divCategory.classList.remove("downscale");

    let domCategories = categorySection.querySelectorAll(".category");
    let h2 = categorySection.querySelector("h2");
    h2.classList.add("move-down");
    for (let i = 0; i < domCategories.length; i++) {
      setTimeout(() => {
        domCategories[i].classList.add("move-down");
      }, 100 * i);
    }

    setTimeout(() => {
      h2.classList.remove("move-down");

      generalFn.hideDomElementFast(categorySection);
      stop_quiz = false;
      this.quiz = new Quiz(this.type, this.category, this.data, this.tuning);
    }, 1500);
  }

  async getDataFile() {
    try {
      const url = `./assets/images/images.json`;
      const res = await fetch(url);
      const data = await res.json();
      return Promise.resolve(data);
    } catch (error) {
      alert(error);
    }
  }

  changeCategoryResults(index, domDiv) {
    let getItem = localStorage.getItem(`dd${this.type}Category${index}Result`);
    let domResult = domDiv.querySelector(".category-result");
    if (getItem != null) {
      if (getItem != undefined) {
        domResult.innerHTML = `${getItem} / 10`;
        domResult.parentNode.classList.remove("less-opacity");
      } else {
        domResult.innerHTML = `0 / 10`;
      }
    } else {
      domResult.innerHTML = `0 / 10`;
    }
  }

  async showDetailedResult(categoryNumber) {
    if (this.data == undefined) {
      let data = await this.getDataFile();
      this.data = data;
    }
    let categorySection = document.querySelector(".category-section");
    generalFn.hideDomElement(categorySection);
    let resultSection = document.querySelector(".category-result-section");
    let result = new Results(this.type, categoryNumber, this.data);
    console.log(result);
    generalFn.showDomElementFast(resultSection);
  }

  setTuning() {
    this.tuning.showTuning();
  }
}
export default Settings;
