import * as generalFn from "./generalFunctions";
import Picture from "./picture";

class Results {
  constructor(type, categoryNumber, data) {
    this.type = type;
    this.categoryNumber = categoryNumber + 1;
    this.deletePrevious();
    this.arrResults = this.getResultsFromLocalStorage();
    this.pictures = this.getInfoAboutPictures(data, this.arrResults);
    if (this.arrResults != undefined) {
      this.showResults();
    }

    this.setEventListenerOnBackFromResult();
  }

  getResultsFromLocalStorage() {
    let getItem = generalFn.getItemFromLocalStorage(
      `dd${this.type}Category${this.categoryNumber}Result`,
      null
    );
    if (getItem == null) {
      return [];
    } else {
      return generalFn.getItemFromLocalStorage(
        `dd${this.type}${this.categoryNumber}`,
        []
      );
    }
  }

  getInfoAboutPictures(data, arrResults) {
    let arrPictures = [];
    arrResults.forEach((elem, index) => {
      let currentNumber;
      if (this.type == "artist") {
        currentNumber = (this.categoryNumber - 1) * 10 + index;
      } else {
        currentNumber = 120 + (this.categoryNumber - 1) * 10 + index;
      }

      let currentData = data[currentNumber];

      arrPictures.push(
        new Picture(
          currentData.name,
          currentData.author,
          currentData.imageNum,
          currentData.year
        )
      );
    });
    return arrPictures;
  }

  showResults() {
    let headerResults = document.querySelector(".header-results");
    headerResults.textContent = `Результаты ${this.categoryNumber} раунда`;
    let resultWrapper = document.querySelector(".result-wrapper");
    this.arrResults.forEach((elem, index) => {
      setTimeout(() => {
        let divResult = document.createElement("div");

        generalFn.setImage(
          divResult,
          `https://raw.githubusercontent.com/Dairin-dei/art-quiz-images/master/img/${this.pictures[index].imageNum}.jpg`
        );

        resultWrapper.append(divResult);
        divResult.classList.add("result-item");
        if (elem === 0) {
          divResult.classList.add("not-solved");
        }
        divResult.addEventListener("click", () => {
          this.pictures[index].showInfoPage("yes", false);
        });
      }, 300 * index);
    });
  }

  setEventListenerOnBackFromResult() {
    let headerResult = document.querySelector(".header-results");
    headerResult.addEventListener("click", () => {
      let resultSection = document.querySelector(".category-result-section");
      generalFn.hideDomElement(resultSection);
      let categorySection = document.querySelector(".category-section");
      generalFn.showDomElement(categorySection);
    });
  }

  deletePrevious() {
    let divItems = document.querySelectorAll(".result-item");
    divItems.forEach((elem) => {
      elem.remove();
    });
  }
}

export default Results;
