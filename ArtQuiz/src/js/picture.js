import * as generalFn from "./generalFunctions";

class Picture {
  constructor(picture, author, imageNum, year) {
    this.picture = picture;
    this.author = author;
    this.imageNum = imageNum;
    this.year = year;
  }

  showInfoPage(correctAnswer, quiz = true) {
    //show info about picture
    let domInfoPageSection = document.querySelector(".infopage-section");
    generalFn.showDomElementFast(domInfoPageSection);
    domInfoPageSection.classList.add("moveUp");
    let domInfoImage = domInfoPageSection.querySelector(".image-info");

    let domInfoAuthor = domInfoPageSection.querySelector(".info-author");
    let domInfoPicture = domInfoPageSection.querySelector(".info-picture");

    let domInfoYear = domInfoPageSection.querySelector(".info-year");

    let computedStyle = getComputedStyle(domInfoPageSection);

    domInfoImage.style.backgroundImage = `url("./assets/images/blank.PNG")`;

    let domResultIndicator =
      domInfoPageSection.querySelector(".resultIndicator");

    generalFn.setImage(
      domResultIndicator,
      correctAnswer == "yes"
        ? "./assets/icons/right.png"
        : "./assets/icons/wrong.png"
    );

    generalFn.setImage(
      domInfoImage,
      `https://raw.githubusercontent.com/Dairin-dei/art-quiz-images/master/img/${this.imageNum}.jpg`
    );

    computedStyle = getComputedStyle(domInfoImage);
    domInfoImage.style.height = computedStyle.width;

    domInfoAuthor.innerHTML = this.author;
    domInfoPicture.innerHTML = `"${this.picture}"`;
    domInfoYear.innerHTML = `${this.year}г.`;
    if (!quiz) {
      let domBtnContinue = domInfoPageSection.querySelector(".continue");
      domBtnContinue.innerHTML = "Понятно!";

      domBtnContinue.addEventListener("click", () => {
        domInfoPageSection.classList.remove("moveUp");
        generalFn.hideDomElement(domInfoPageSection);
      });
    }
  }
}

export default Picture;
