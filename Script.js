document.addEventListener("DOMContentLoaded", () => {

  const passwordScreen = document.getElementById("password-screen");
  const passwordForm = document.getElementById("password-form");
  const passwordInput = document.getElementById("password-input");
  const passwordError = document.getElementById("password-error");

  const welcomeScreen = document.getElementById("welcome-screen");
  const flowerScreen = document.getElementById("flower-screen");
  const bookScreen = document.getElementById("book-screen");

  const openButton = document.getElementById("openBtn");
  const flowerNext = document.getElementById("flower-next");
  const bookCover = document.getElementById("book-cover");
  const bookContent = document.getElementById("book-content");

  const nextButton = document.getElementById("nextPage");
  const prevButton = document.getElementById("prevPage");
  const pageStatus = document.getElementById("page-status");

  const finalQuestion = document.getElementById("final-question");
  const finalYes = document.getElementById("final-yes");
  const finalNo = document.getElementById("final-no");
  const noMessage = document.getElementById("no-message");

  const specialSurprise = document.getElementById("special-surprise");
  const specialAudio = document.getElementById("special-audio");

  specialAudio.src = "حكمه الايام.mp3";

  // عدّل نصوص الأسئلة والاختيارات من هنا فقط.
  const LOVE_QUESTIONS = [
    {
      question: "What's your favorite thing about us? 💗",
      answers: [
        "Our memories ❤️",
        "Your smile 🥹",
        "Everything about us 💕"
      ]
    },
    {
      question: "What's one moment with me that makes you smile? 🌷",
      answers: [
        "Our first moments 🥰",
        "Our silly laughs 😂",
        "Every moment together ❤️"
      ]
    },
    {
      question: "What would you love us to do together next? ✨",
      answers: [
        "A romantic date 🌹",
        "A new adventure 🌍",
        "A cozy day together 🧸"
      ]
    }
  ];

  const TELEGRAM_WORKER_URL =
    "https://birthday-gift-notify.sonyoussef6.workers.dev";

  const openLoveQuestionsButton =
    document.getElementById("open-love-questions");

  const loveQuestions =
    document.getElementById("love-questions");

  const questionCounter =
    document.getElementById("question-counter");

  const questionText =
    document.getElementById("question-text");

  const answerOptions =
    document.getElementById("answer-options");

  const questionStatus =
    document.getElementById("question-status");

  const nextLoveQuestionButton =
    document.getElementById("next-love-question");

  let currentLoveQuestion = 0;
  let isSendingAnswer = false;

  const bookHint = document.querySelector(".book-hint");
  const pageControls = document.querySelector(".page-controls");
  const oldSongAudio = document.getElementById("song-audio");

  const spreads = [
    document.getElementById("spread-1"),
    document.getElementById("spread-2"),
    document.getElementById("spread-3")
  ];

  let currentPage = 0;
  let isAnimating = false;
  let coverOpened = false;
  let turnTimer = null;

  const TURN_DURATION = 1000;

  // Password
  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (passwordInput.value.trim() === "22112008") {
      passwordScreen.hidden = true;
      welcomeScreen.hidden = false;
      passwordError.hidden = true;
    } else {
      passwordError.hidden = false;
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  // Welcome screen
  openButton.addEventListener("click", () => {
    welcomeScreen.hidden = true;
    flowerScreen.hidden = false;
  });

  // Flower screen and reset
  flowerNext.addEventListener("click", () => {
    flowerScreen.hidden = true;
    bookScreen.hidden = false;

    currentPage = 0;
    isAnimating = false;
    coverOpened = false;

    if (turnTimer !== null) {
      clearTimeout(turnTimer);
      turnTimer = null;
    }

    bookContent.querySelectorAll(".flip-sheet").forEach((sheet) => {
      sheet.remove();
    });

    spreads.forEach((spread, index) => {
      spread.hidden = index !== 0;
      spread.style.zIndex = "";
    });

    bookCover.hidden = false;
    bookCover.classList.remove("opened");
    bookCover.setAttribute("aria-expanded", "false");

    finalQuestion.hidden = true;
    specialSurprise.hidden = true;
    noMessage.hidden = true;

    openLoveQuestionsButton.hidden = false;
    loveQuestions.hidden = true;

    currentLoveQuestion = 0;
    isSendingAnswer = false;

    questionStatus.textContent = "";
    questionStatus.className = "question-status";

    nextLoveQuestionButton.hidden = true;

    bookContent.hidden = false;
    bookHint.hidden = false;
    pageControls.hidden = false;

    if (specialAudio) {
      specialAudio.pause();
      specialAudio.currentTime = 0;
    }

    if (oldSongAudio) {
      oldSongAudio.pause();
    }

    updateControls();
  });

  // Open book cover
  function openCover() {
    if (coverOpened || isAnimating) return;

    coverOpened = true;

    bookCover.classList.add("opened");
    bookCover.setAttribute("aria-expanded", "true");

    window.setTimeout(() => {
      if (coverOpened) {
        bookCover.hidden = true;
      }
    }, 1200);

    updateControls();
  }

  bookCover.addEventListener("click", openCover);

  bookCover.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCover();
    }
  });

  // Page controls
  function updateControls() {
    prevButton.disabled =
      currentPage === 0 || isAnimating || !coverOpened;

    nextButton.disabled =
      currentPage === spreads.length - 1 ||
      isAnimating ||
      !coverOpened;

    pageStatus.textContent =
      `Page ${currentPage + 1} of ${spreads.length}`;
  }

  // Create page flip animation
  function cloneFace(element, extraClass) {
    const clone = element.cloneNode(true);

    clone.classList.remove("right-page", "left-page");
    clone.classList.add("flip-face", extraClass);

    clone.querySelectorAll("audio").forEach((player) => {
      player.removeAttribute("autoplay");
    });

    return clone;
  }

  function makeFlipSheet(
    direction,
    frontElement,
    backElement,
    fullSheet
  ) {
    const sheet = document.createElement("div");

    sheet.className =
      `flip-sheet ${direction}` +
      (fullSheet ? " full-sheet" : "");

    sheet.appendChild(cloneFace(frontElement, "flip-front"));
    sheet.appendChild(cloneFace(backElement, "flip-back"));

    bookContent.appendChild(sheet);

    return sheet;
  }

  function getFaceForSpread(spread, side) {
    if (!spread) return null;

    if (side === "right") {
      return spread.querySelector(".right-page");
    }

    if (side === "left") {
      return spread.querySelector(".left-page");
    }

    return spread.querySelector(".end-cover") || spread;
  }

  function showFinalQuestion() {
    finalQuestion.hidden = false;
    noMessage.hidden = true;

    bookHint.hidden = true;
    pageControls.hidden = true;
  }

  function turnPage(direction) {
    if (isAnimating || !coverOpened) return;

    const nextIndex = direction === "forward"
      ? currentPage + 1
      : currentPage - 1;

    if (nextIndex < 0 || nextIndex >= spreads.length) return;

    const oldSpread = spreads[currentPage];
    const newSpread = spreads[nextIndex];

    isAnimating = true;
    updateControls();

    newSpread.hidden = false;
    oldSpread.style.zIndex = "2";
    newSpread.style.zIndex = "1";

    let frontElement;
    let backElement;
    let fullSheet = false;

    if (direction === "forward") {
      frontElement = getFaceForSpread(oldSpread, "right");
      backElement = getFaceForSpread(newSpread, "left");
    } else {
      frontElement = getFaceForSpread(oldSpread, "left");
      backElement = getFaceForSpread(newSpread, "right");
    }

    if (!frontElement || !backElement) {
      fullSheet = true;

      frontElement = getFaceForSpread(oldSpread, "full");
      backElement = getFaceForSpread(newSpread, "full");
    }

    if (!frontElement || !backElement) {
      oldSpread.style.zIndex = "";
      newSpread.style.zIndex = "";
      newSpread.hidden = true;

      isAnimating = false;
      updateControls();
      return;
    }

    const originalVisibility = frontElement.style.visibility;

    const sheet = makeFlipSheet(
      direction,
      frontElement,
      backElement,
      fullSheet
    );

    frontElement.style.visibility = "hidden";

    void sheet.offsetWidth;

    let finished = false;

    function finishTurn() {
      if (finished) return;

      finished = true;

      if (turnTimer !== null) {
        clearTimeout(turnTimer);
        turnTimer = null;
      }

      frontElement.style.visibility = originalVisibility;
      sheet.remove();

      currentPage = nextIndex;

      spreads.forEach((spread, index) => {
        spread.hidden = index !== currentPage;
        spread.style.zIndex = "";
      });

      isAnimating = false;
      updateControls();

      if (currentPage === 2) {
        setTimeout(() => {
          showFinalQuestion ();
          
        },7000);
      }
    }

    sheet.addEventListener(
      "animationend",
      finishTurn,
      { once: true }
    );

    turnTimer = window.setTimeout(
      finishTurn,
      TURN_DURATION + 300
    );
  }

  nextButton.addEventListener("click", () => {
    turnPage("forward");
  });

  prevButton.addEventListener("click", () => {
    turnPage("backward");
  });

  // Final question buttons
  finalNo.addEventListener("click", () => {
    noMessage.hidden = false;
  });

  finalYes.addEventListener("click", () => {
    finalQuestion.hidden = true;

    bookContent.hidden = true;
    bookHint.hidden = true;
    pageControls.hidden = true;

    if (oldSongAudio) {
      oldSongAudio.pause();
    }

    specialSurprise.hidden = false;
  });

  // Show a question
  function renderLoveQuestion() {
    const item = LOVE_QUESTIONS[currentLoveQuestion];

    questionCounter.textContent =
      `Question ${currentLoveQuestion + 1} of ${LOVE_QUESTIONS.length}`;

    questionText.textContent = item.question;

    questionStatus.textContent = "";
    questionStatus.className = "question-status";

    answerOptions.replaceChildren();

    nextLoveQuestionButton.hidden = true;

    item.answers.forEach((answer) => {
      const optionButton = document.createElement("button");

      optionButton.type = "button";
      optionButton.className = "answer-option";
      optionButton.textContent = answer;
      optionButton.dataset.answer = answer;

      answerOptions.appendChild(optionButton);
    });
  }

  // Open the questions section
  openLoveQuestionsButton.addEventListener("click", () => {
    openLoveQuestionsButton.hidden = true;
    loveQuestions.hidden = false;

    currentLoveQuestion = 0;

    renderLoveQuestion();

    loveQuestions.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  // Send the selected answer to Telegram
  answerOptions.addEventListener("click", async (event) => {
    const selectedButton = event.target.closest(".answer-option");

    if (!selectedButton || isSendingAnswer) return;

    const selectedAnswer = selectedButton.dataset.answer;
    const selectedQuestion = LOVE_QUESTIONS[currentLoveQuestion];

    if (!selectedAnswer || !selectedQuestion) return;

    isSendingAnswer = true;

    answerOptions.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });

    questionStatus.textContent = "Sending your answer... ❤️";
    questionStatus.className = "question-status is-sending";

    try {
      const response = await fetch(TELEGRAM_WORKER_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: selectedQuestion.question,
          answer: selectedAnswer
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("The answer could not be sent.");
      }

      selectedButton.classList.add("selected-answer");

      questionStatus.textContent =
        "Your answer has been sent successfully ❤️";

      questionStatus.className =
        "question-status is-success";

      nextLoveQuestionButton.textContent =
        currentLoveQuestion === LOVE_QUESTIONS.length - 1
          ? "Finish ❤️"
          : "Next Question ♡";

      nextLoveQuestionButton.hidden = false;

    } catch (error) {

      questionStatus.textContent =
        "Sorry, the answer could not be sent. Please try again 💔";

      questionStatus.className =
        "question-status is-error";

      answerOptions.querySelectorAll("button").forEach((button) => {
        button.disabled = false;
      });

    } finally {
      isSendingAnswer = false;
    }
  });

  // Move to next question or finish
  nextLoveQuestionButton.addEventListener("click", () => {

    if (currentLoveQuestion < LOVE_QUESTIONS.length - 1) {
      currentLoveQuestion += 1;

      renderLoveQuestion();

      loveQuestions.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    questionCounter.textContent = "All done ♡";

    questionText.textContent =
      "Thank you for answering my questions! ❤️";

    answerOptions.replaceChildren();

    questionStatus.textContent =
      "You made this little surprise even more special. 💗";

    questionStatus.className =
      "question-status is-success";

    nextLoveQuestionButton.hidden = true;
  });

  // Initial page setup
  spreads.forEach((spread, index) => {
    spread.hidden = index !== 0;
  });

  updateControls();

  // Photo lightbox
  const photoLightbox =
    document.getElementById("photo-lightbox");

  const photoLightboxImage =
    document.getElementById("photo-lightbox-image");

  const photoCloseButton =
    document.querySelector(".photo-lightbox-close");

  const photoButtons =
    document.querySelectorAll(
      ".photo-placeholder[data-full-image]"
    );

  photoButtons.forEach((photoButton) => {
    photoButton.addEventListener("click", () => {

      const imagePath =
        photoButton.getAttribute("data-full-image");

      const thumbnail =
        photoButton.querySelector("img");

      photoLightboxImage.src = imagePath;

      photoLightboxImage.alt =
        thumbnail?.alt || "صورة مكبرة";

      photoLightbox.hidden = false;

      document.body.classList.add("photo-view-open");

      photoCloseButton.focus();
    });
  });

  function closePhotoLightbox() {
    if (!photoLightbox || photoLightbox.hidden) return;

    photoLightbox.hidden = true;
    photoLightboxImage.src = "";

    document.body.classList.remove("photo-view-open");
  }

  photoCloseButton.addEventListener(
    "click",
    closePhotoLightbox
  );

  photoLightbox.addEventListener("click", (event) => {
    if (event.target === photoLightbox) {
      closePhotoLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePhotoLightbox();
    }
  });

});