import utils from "./utils.js";

let projects = [];
let slider = null;
let slides = [];
let currentSlide = 0;

function slide(direction) {
  let left;
  const { scrollLeft, clientWidth } = slider;

  switch (direction) {
    case "prev":
      currentSlide--;
      left = scrollLeft - clientWidth;
      break;
    case "next":
    default:
      currentSlide++;
      left = scrollLeft + clientWidth;
      break;
  }

  slider.scroll({
    left,
    behavior: "smooth",
  });
}

function deepLink() {
  const hash = window.location.hash;
  if (hash) {
    const $slide = document.querySelector(
      `.project[data-slug=${hash.replace("#", "")}]`
    );
    if ($slide) $slide.scrollIntoView();
  } else {
    slider.classList.add("intro");
    window.location.hash = slides[0].dataset.slug;
  }
}

function interact() {
  slider = document.querySelector("[data-slider]");
  slides = Array.from(slider.querySelectorAll(".project"));

  const prevButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");

  prevButton.addEventListener("click", () => slide("prev"));
  nextButton.addEventListener("click", () => slide("next"));

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", ({ target }) => {
      target.classList.add("loaded");
    });
  });

  slider.addEventListener("scroll", () => {
    const { width } = document.querySelector("#app").getBoundingClientRect();
    if (slider.scrollleft > slider.offsetWidth) {
      nextButton.classList.add("hidden");
      console.log("triggered");
    }
    // else nextButton.classList.remove("hidden");
    if (slider.scrollLeft === 0) prevButton.classList.add("hidden");
    else prevButton.classList.remove("hidden");

    slides.forEach(($slide) => {
      if (utils.isInViewport($slide)) {
        window.location.hash = $slide.dataset.slug;
      }
    });
  });
}

export default {
  async startup() {
    const tplRes = await fetch("./assets/projects.hbs");
    const dataRes = await fetch("./assets/data/projects.json");

    const tpl = await tplRes.text();
    const template = Handlebars.compile(tpl);

    projects = await dataRes.json();
    document.querySelector("#app").innerHTML = template({ projects });

    interact();
    deepLink();
  },
};
