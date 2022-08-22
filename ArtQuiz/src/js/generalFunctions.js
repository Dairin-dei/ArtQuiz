export function hideDomElement(domElement) {
  domElement.classList.add("hide");
  setTimeout(() => {
    domElement.classList.add("hide-display");
  }, 500);
}

export function hideDomElementFast(domElement) {
  domElement.classList.add("hide");
  domElement.classList.add("hide-display");
}

export function showDomElement(domElement) {
  setTimeout(() => {
    domElement.classList.remove("hide");
    domElement.classList.add("show");
    domElement.classList.remove("hide-display");
  }, 500);
}

export function showDomElementFast(domElement) {
  domElement.classList.remove("hide");
  domElement.classList.remove("hide-display");
  domElement.classList.add("show");
}

export function getItemFromLocalStorage(itemLS, returnNot) {
  let getItem = localStorage.getItem(itemLS);
  if (getItem != null) {
    if (getItem != undefined) {
      return JSON.parse(getItem);
    }
  }
  return returnNot;
}

export function setItemToLocalStorage(itemLS, value) {
  localStorage.setItem(itemLS, JSON.stringify(value));
}

export function setImage(domElement, url) {
  const img = new Image();
  img.src = url;
  img.onload = () => {
    domElement.style.backgroundImage = "url(" + img.src + ")";
  };
}

export function hideMainMenu() {
  let mainSection = document.querySelector(".main-section");
  let btnPicture = mainSection.querySelector(".button-main-picture");
  let btnArtist = mainSection.querySelector(".button-main-artist");
  let btnSettings = mainSection.querySelector(".button-main-settings");
  //let h1 = mainSection.querySelector("h1");
  //let logo = mainSection.querySelector(".logo-image");
  let header = document.querySelector(".header");
  let footer = document.querySelector(".footer");
  let categorySection = document.querySelector(".category-section");
  let domCategories = categorySection.querySelectorAll(".category");

  if (!mainSection.classList.contains("hide")) {
    btnArtist.classList.add("move-left");
    btnPicture.classList.add("move-right");
    btnSettings.classList.add("move-down");
    hideDomElement(footer);
    setTimeout(() => {
      hideDomElementFast(mainSection);
      btnArtist.classList.remove("move-left");
      btnPicture.classList.remove("move-right");
      btnSettings.classList.remove("move-down");

      showDomElementFast(header);
      showDomElementFast(categorySection);
      for (let i = 0; i < domCategories.length; i++) {
        setTimeout(() => {
          domCategories[i].classList.remove("move-down");
        }, 250 * i);
      }
    }, 1500);
  } else {
    showDomElementFast(header);
    showDomElementFast(categorySection);
    for (let i = 0; i < domCategories.length; i++) {
      setTimeout(() => {
        domCategories[i].classList.remove("move-down");
      }, 150 * i);
    }
  }

  setTimeout(() => {
    showDomElement(footer);
  }, 2000);
}
