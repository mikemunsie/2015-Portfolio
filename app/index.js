document.addEventListener('DOMContentLoaded', () => {
  SyntaxHighlighter.highlight();

  // Set the selected blog post
  let optionMatchesPath = document.querySelector(".rightWidgets select option[value='" + location.pathname + "']");
  if (optionMatchesPath) optionMatchesPath.setAttribute("selected", "true");

  // When the user changes the article
  document.querySelector(".rightWidgets select").addEventListener("change", (e) => {
    window.location = e.target.value;
  });

 // Pressing right or left can take you to magical places
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 39) {
      let nextPost = document.querySelector(".nextPost .button").getAttribute("href");
      window.location = nextPost;
    }
    if (e.keyCode === 37) {
      let selectedDropdown = document.querySelector(".rightWidgets select option[selected]");
      let prevDropdown = selectedDropdown.previousSibling.previousSibling;
      if (prevDropdown && prevDropdown.tagName === "OPTION") {
        window.location = prevDropdown.value;
      }
    }
  });

  // If there's an image in the content, let's use it and make it the bg!
  const entryImage = document.querySelector(".entry img.feature-image");
  if (entryImage) {
    document.querySelector(".hero .bg").style["background-image"] = `url('${entryImage.src}')`;
  }

  // Right widgets should stay in place as the browser moves
  const handleResize = (e) => {
    let t1, t2, top, width;
    let rightWidgetsXPos;
    const rightWidgets = document.querySelector(".rightWidgets");
    width = window.innerWidth;
    top = document.body.scrollTop;
    if (top > 80 && width >= 840) {
      rightWidgetsXPos = rightWidgets.getBoundingClientRect().left;
      rightWidgets.classList.add("fixed");
      rightWidgets.style.position.left = rightWidgetsXPos
    } else {
      rightWidgets.classList.remove("fixed");
      rightWidgets.style.position.left = "auto";
    }
  }
  window.addEventListener("scroll", handleResize);
  window.addEventListener("resize", handleResize);

});