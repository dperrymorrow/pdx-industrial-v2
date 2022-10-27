let projects = [];

function interact() {
  const slider = document.querySelector("[data-slider]");
  const prevButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");

  prevButton.addEventListener("click", () => slide("prev"));
  nextButton.addEventListener("click", () => slide("next"));

  let currentSlide = 0;

  slider.addEventListener("scroll", () => {
    const { width } = document.querySelector("#app").getBoundingClientRect();
    console.log(slider.scrollLeft > slider.offsetWidth);

    // console.log(slider.scrollWidth);

    if (slider.scrollleft > slider.offsetWidth) {
      nextButton.classList.add("hidden");
      console.log("triggered");
    }
    // else nextButton.classList.remove("hidden");
    if (slider.scrollLeft === 0) prevButton.classList.add("hidden");
    else prevButton.classList.remove("hidden");
  });

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
  },
};
