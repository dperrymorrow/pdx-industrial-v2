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

  slider.addEventListener("keyup", ({ code }) => {
    if (code == "ArrowRight") slide("next");
    else if (code == "ArrowLeft") slide("prev");
  });

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
    const $current = slides.find(utils.isInViewport);

    if ($current) {
      const dataset = $current.dataset;
      const { slideIndex, color } = dataset;
      const index = parseInt(slideIndex);

      window.location.hash = $current.dataset.slug;
      document.getElementById("app-container").style.backgroundColor = color;

      if (index === 0) prevButton.classList.add("hidden");
      else prevButton.classList.remove("hidden");

      if (index === slides.length - 1) nextButton.classList.add("hidden");
      else nextButton.classList.remove("hidden");
    }
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
