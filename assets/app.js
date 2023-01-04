import utils from "./utils.js";

let projects = [];
let slider = null;
let slides = [];

function slide(direction) {
  let left;
  const { scrollLeft, clientWidth } = slider;

  switch (direction) {
    case "prev":
      left = scrollLeft - clientWidth;
      break;
    case "next":
    default:
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

  // disable back button on safari
  window.addEventListener("popstate", (ev) => {
    ev.preventDefault();
  });

  const prevButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");

  prevButton.addEventListener("click", () => slide("prev"));
  nextButton.addEventListener("click", () => slide("next"));

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", ({ target }) => {
      target.parentElement.classList.remove("loader");
      target.classList.add("loaded");
    });
  });

  slides.forEach(($slide) => {
    $slide.addEventListener("click", ({ pageX }) => {
      if (parseInt($slide.dataset.slideIndex) < slides.length - 1)
        slide("next");
    });
  });

  slider.addEventListener("scroll", () => {
    const $current = slides.find((slide) => {
      return utils.isInViewport(slide.querySelector("img"));
    });

    if ($current) {
      const dataset = $current.dataset;
      const { slideIndex, color } = dataset;
      const index = parseInt(slideIndex);

      window.location.hash = $current.dataset.slug;

      document.body.style.backgroundColor = color;

      if (index === 0) prevButton.classList.add("hidden");
      else prevButton.classList.remove("hidden");

      if (index === slides.length - 1) nextButton.classList.add("hidden");
      else nextButton.classList.remove("hidden");
    }
  });
}

export default {
  async startup() {
    // Set a timeout...
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 100);
    });

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
