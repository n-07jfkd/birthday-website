const BIRTHDAY_PASSWORD = "102605";

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  const digitInputs = [...document.querySelectorAll(".digit")];

  const unlockButton = document.getElementById("unlock-button");
  const passwordError = document.getElementById("password-error");
  const restartButton = document.getElementById("restart-button");

  const cakeButton = document.getElementById("cake-button");
  const makeWishButton = document.getElementById("make-wish-button");
  const cakeInstruction = document.getElementById("cake-instruction");
  const wishResult = document.getElementById("wish-result");
  const confettiLayer = document.getElementById("confetti-layer");

  const twistStart = document.getElementById("twist-start");
  const twistPanel = document.getElementById("twist-panel");

  let wishMade = false;
  let wishTimer = null;
  let twistTimer = null;
  let confettiTimer = null;

  // Show one screen and hide the others.
  function showScreen(screenId) {
    screens.forEach((screen) => {
      const isActive = screen.id === screenId;

      screen.hidden = !isActive;
      screen.classList.toggle("active", isActive);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // PASSWORD SCREEN
  function unlockWebsite() {
    const enteredPassword = digitInputs
      .map((input) => input.value)
      .join("");

    if (enteredPassword.length !== 6) {
      passwordError.textContent =
        "kulang pa ng digits, ay talaga naman. six digits dapat!";

      const firstEmpty = digitInputs.find(
        (input) => !input.value
      );

      if (firstEmpty) firstEmpty.focus();
      return;
    }

    if (enteredPassword === BIRTHDAY_PASSWORD) {
      passwordError.textContent = "";
      showScreen("screen-welcome");
    } else {
      passwordError.textContent = "nawh, mali pa";

      digitInputs.forEach((input) => {
        input.value = "";
      });

      digitInputs[0].focus();

      const digitRow = document.querySelector(".digit-row");

      if (digitRow) {
        digitRow.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(-3px)" },
            { transform: "translateX(0)" }
          ],
          {
            duration: 300,
            iterations: 1
          }
        );
      }
    }
  }

  if (unlockButton) {
    unlockButton.addEventListener("click", unlockWebsite);
  }

  digitInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(-1);

      if (input.value && index < digitInputs.length - 1) {
        digitInputs[index + 1].focus();
      }

      if (passwordError) {
        passwordError.textContent = "";
      }
    });

    input.addEventListener("keydown", (event) => {
      if (
        event.key === "Backspace" &&
        !input.value &&
        index > 0
      ) {
        digitInputs[index - 1].focus();
      }

      if (event.key === "Enter") {
        unlockWebsite();
      }

      if (event.key === "ArrowLeft" && index > 0) {
        digitInputs[index - 1].focus();
      }

      if (
        event.key === "ArrowRight" &&
        index < digitInputs.length - 1
      ) {
        digitInputs[index + 1].focus();
      }
    });

    input.addEventListener("paste", (event) => {
      event.preventDefault();

      const pasted = event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

      pasted.split("").forEach((digit, digitIndex) => {
        if (digitInputs[digitIndex]) {
          digitInputs[digitIndex].value = digit;
        }
      });

      const nextEmpty = digitInputs.find(
        (box) => !box.value
      );

      (nextEmpty || digitInputs[digitInputs.length - 1]).focus();

      if (passwordError) {
        passwordError.textContent = "";
      }
    });
  });

  // DEVELOPER LETTER PLOT TWIST
  if (twistStart && twistPanel) {
    twistStart.addEventListener("click", () => {
      if (twistStart.disabled || !twistPanel.hidden) return;

      twistStart.disabled = true;
      twistStart.textContent = "loading... (3mins)";

      twistTimer = window.setTimeout(() => {
        twistStart.hidden = true;
        twistPanel.hidden = false;

        twistPanel.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        twistTimer = null;
      }, 3000);
    });
  }

  // CONFETTI

  function launchConfetti() {
    if (!confettiLayer) return;

    if (confettiTimer !== null) {
      window.clearTimeout(confettiTimer);
      confettiTimer = null;
    }

    confettiLayer.replaceChildren();

    const colors = [
      "#E9A8C5",
      "#FCE7F3",
      "#D783A8",
      "#F4C7DC",
      "#D8B5D8",
      "#FFFFFF"
    ];

    for (let i = 0; i < 100; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;

      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.setProperty(
        "--fall-time",
        `${2 + Math.random() * 2.2}s`
      );

      piece.style.setProperty(
        "--drift",
        `${Math.random() * 180 - 90}px`
      );

      piece.style.setProperty(
        "--rotation",
        `${Math.random() * 360}deg`
      );

      piece.style.animationDelay = `${Math.random() * 0.7}s`;

      if (Math.random() > 0.5) {
        piece.style.borderRadius = "50%";
        piece.style.width = "7px";
        piece.style.height = "7px";
      }

      confettiLayer.appendChild(piece);
    }

    confettiTimer = window.setTimeout(() => {
      confettiLayer.replaceChildren();
      confettiTimer = null;
    }, 5500);
  }

  // =========================================
  // MAKE A WISH
  // =========================================

  function submitWish() {
    if (wishMade) return;

    wishMade = true;

    if (cakeButton) {
      cakeButton.classList.add("blown-out");
      cakeButton.setAttribute(
        "aria-label",
        "The candles are blown out. Your wish is submitted."
      );
    }

    if (makeWishButton) {
      makeWishButton.disabled = true;
      makeWishButton.textContent =
        "sending wish to the universe... ♡";
    }

    if (cakeInstruction) {
      cakeInstruction.textContent =
        "whoooosh 💨 wish incoming to the universe!";
    }

    launchConfetti();

    wishTimer = window.setTimeout(() => {
      if (wishResult) {
        wishResult.hidden = false;
      }

      if (cakeInstruction) {
        cakeInstruction.textContent =
          "wish sent successfully. universe, ikaw na bahala. ♡";
      }

      if (makeWishButton) {
        makeWishButton.hidden = true;
      }

      if (wishResult) {
        wishResult.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      wishTimer = null;
    }, 1800);
  }

  // One shared handler only — no duplicate cake interaction.
  if (makeWishButton) {
    makeWishButton.addEventListener("click", submitWish);
  }

  if (cakeButton) {
    cakeButton.addEventListener("click", submitWish);
  }

  // NEXT SCREEN BUTTONS
  document.querySelectorAll(".next-button").forEach((button) => {
    button.addEventListener("click", () => {
      const nextScreen = button.dataset.next;

      if (!nextScreen) return;

      if (
        nextScreen === "screen-ending" &&
        !wishMade
      ) {
        if (cakeInstruction) {
          cakeInstruction.textContent =
            "teka lang 😭 make a wish muna by tapping the cake!";

          cakeInstruction.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }

        return;
      }

      showScreen(nextScreen);
    });
  });

  // FULL RESTART — RESET EVERYTHING ♡
  function restartWebsite() {
    // Cancel pending actions from the previous playthrough.
    if (wishTimer !== null) {
      window.clearTimeout(wishTimer);
      wishTimer = null;
    }

    if (twistTimer !== null) {
      window.clearTimeout(twistTimer);
      twistTimer = null;
    }

    if (confettiTimer !== null) {
      window.clearTimeout(confettiTimer);
      confettiTimer = null;
    }

    // Reset wish interaction.
    wishMade = false;

    if (cakeButton) {
      cakeButton.classList.remove("blown-out");

      cakeButton.setAttribute(
        "aria-label",
        "Tap to blow out the birthday cake candles"
      );
    }

    if (makeWishButton) {
      makeWishButton.hidden = false;
      makeWishButton.disabled = false;
      makeWishButton.textContent = "make a wish ♡";
    }

    if (wishResult) {
      wishResult.hidden = true;
    }

    if (cakeInstruction) {
      cakeInstruction.textContent = "🎂 make a wish!";
    }

    // Clear the old confetti completely.
    if (confettiLayer) {
      confettiLayer.replaceChildren();
    }

    // Reset the developer-letter plot twist.
    if (twistStart) {
      twistStart.hidden = false;
      twistStart.disabled = false;
      twistStart.textContent = "okay...";
    }

    if (twistPanel) {
      twistPanel.hidden = true;
    }

    // Reset the password inputs and error message.
    digitInputs.forEach((input) => {
      input.value = "";
    });

    if (passwordError) {
      passwordError.textContent = "";
    }

    // Return to the first screen.
    showScreen("screen-password");

    if (digitInputs.length > 0) {
      digitInputs[0].focus({ preventScroll: true });
    }
  }

  if (restartButton) {
    restartButton.addEventListener("click", restartWebsite);
  }

  // Start fresh whenever the website first opens.
  restartWebsite();
});
