/**
 * Password gate — change PASSWORD if you ever need a different secret word.
 * Note: In a static site, this is for fun only; it is not secure storage.
 */
(function () {
  var PASSWORD = "NETHMA";

  var gate = document.getElementById("gate");
  var form = document.getElementById("gate-form");
  var input = document.getElementById("password-input");
  var error = document.getElementById("gate-error");

  if (!form || !input || !gate || !error) return;

  function normalize(s) {
    return String(s || "")
      .trim()
      .toUpperCase();
  }

  function initGateCarousel() {
    var slidesEl = document.getElementById("gate-slides");
    var prevBtn = document.getElementById("gate-slide-prev");
    var nextBtn = document.getElementById("gate-slide-next");
    var dotsEl = document.getElementById("gate-dots");
    if (!slidesEl || !prevBtn || !nextBtn || !dotsEl) return;

    var slides = slidesEl.querySelectorAll(".gate__slide");
    var n = slides.length;
    if (n === 0) return;

    var current = 0;
    var timer = null;

    function show(i) {
      current = ((i % n) + n) % n;
      var s;
      for (s = 0; s < n; s++) {
        slides[s].classList.toggle("gate__slide--active", s === current);
        slides[s].setAttribute("aria-hidden", s === current ? "false" : "true");
      }
      var dots = dotsEl.querySelectorAll(".gate__dot");
      for (s = 0; s < dots.length; s++) {
        dots[s].classList.toggle("gate__dot--active", s === current);
        dots[s].setAttribute("aria-selected", s === current ? "true" : "false");
      }
    }

    var j;
    for (j = 0; j < n; j++) {
      (function (index) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "gate__dot" + (index === 0 ? " gate__dot--active" : "");
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Photo " + (index + 1) + " of " + n);
        b.setAttribute("aria-selected", index === 0 ? "true" : "false");
        b.addEventListener("click", function () {
          show(index);
          restartAutoplay();
        });
        dotsEl.appendChild(b);
      })(j);
    }

    for (j = 0; j < n; j++) {
      slides[j].setAttribute("aria-hidden", j === 0 ? "false" : "true");
    }

    function next() {
      show(current + 1);
    }
    function prev() {
      show(current - 1);
    }

    prevBtn.addEventListener("click", function () {
      prev();
      restartAutoplay();
    });
    nextBtn.addEventListener("click", function () {
      next();
      restartAutoplay();
    });

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, 5500);
    }
    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    slidesEl.addEventListener("mouseenter", stopAutoplay);
    slidesEl.addEventListener("mouseleave", startAutoplay);
    var bar = slidesEl.parentElement && slidesEl.parentElement.querySelector(".gate__carousel-bar");
    if (bar) {
      bar.addEventListener("mouseenter", stopAutoplay);
      bar.addEventListener("mouseleave", startAutoplay);
    }

    startAutoplay();
  }

  function goToNotePage() {
    window.location.href = "note.html";
  }

  function showGatePage() {
    gate.classList.remove("gate--hidden");
    input.value = "";
    error.hidden = true;
    try {
      sessionStorage.removeItem("birthday_unlocked");
    } catch (e) {
      /* ignore */
    }
  }

  initGateCarousel();

  var query = new URLSearchParams(window.location.search);
  if (query.get("back") === "1") {
    showGatePage();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (normalize(input.value) === normalize(PASSWORD)) {
      error.hidden = true;
      goToNotePage();
    } else {
      error.hidden = false;
      input.select();
    }
  });
  })();
  