
/* =========================================
   A LITTLE SOMETHING FOR U ♡
   Birthday website interactions
========================================= */

// CHANGE THIS to her birthday in MMDDYY format.
// Example: January 5, 2006 becomes "010506".
const BIRTHDAY_PASSWORD = "102605";

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  const digitInputs = [...document.querySelectorAll(".digit")];

  const unlockButton = document.getElementById("unlock-button");
  const passwordError = document.getElementById("password-error");
  const restartButton = document.getElementById("restart-button");

  const cakeButton = document.getElementById("cake-button");
  const cakeInstruction = document.getElementById("cake-instruction");
  const wishResult = document.getElementById("wish-result");
  const confettiLayer = document.getElementById("confetti-layer");

  let wishMade = false;

  // Show one screen and hide the others.
  function showScreen(screenId) {
    screens.forEach((screen) => {
      const isActive = screen.id === screenId;

      screen.hidden = !isActive;
      screen.classList.toggle("active", isActive);
    });

    // Start each new screen at the top.
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Allow navigation buttons to open the next screen.
  document.querySelectorAll(".next-button").forEach((button) => {
    button.addEventListener("click", () => {
      const nextScreen = button.dataset.next;

      if (!nextScreen) return;

      // Don't let the user skip the cake interaction
      // without making a wish.
      if (
        nextScreen === "screen-ending" &&
        !wishMade
      ) {
        cakeInstruction.textContent =
          "teka lang 😭 make a wish muna by tapping the cake!";
        cakeInstruction.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        return;
      }

      showScreen(nextScreen);
    });
  });

  // Keep the password boxes numeric and move automatically.
  digitInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(-1);

      if (input.value && index < digitInputs.length - 1) {
        digitInputs[index + 1].focus();
      }

      passwordError.textContent = "";
    });

    // Backspace moves to the previous box when empty.
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

    // Support pasting all six digits at once.
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

      (nextEmpty || digitInputs[5]).focus();
      passwordError.textContent = "";
    });
  });

  // Check the birthday password.
  function unlockWebsite() {
    const enteredPassword = digitInputs
      .map((input) => input.value)
      .join("");

    if (enteredPassword.length !== 6) {
      passwordError.textContent =
        "Kulang pa ng digits 😭 six digits dapat!";
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
      passwordError.textContent =
        "Hala, wrong birthday 😭 try again!";

      digitInputs.forEach((input) => {
        input.value = "";
      });

      digitInputs[0].focus();

      // Small shake animation for the password boxes.
      const digitRow = document.querySelector(".digit-row");

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

  unlockButton.addEventListener("click", unlockWebsite);

  // Create a small burst of falling confetti.
  function launchConfetti() {
    if (!confettiLayer) return;

    confettiLayer.replaceChildren();

    const colors = [
      "#efb8a6",
      "#f5d5a8",
      "#d8b5d8",
      "#b9d9c5",
      "#f4a8b8",
      "#fff0a8"
    ];

    const numberOfPieces = 100;

    for (let i = 0; i < numberOfPieces; i++) {
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

    // Clean up after the animation finishes.
    window.setTimeout(() => {
      confettiLayer.replaceChildren();
    }, 5500);
  }

  // Cake interaction: blow out the candles and show the wish.
  if (cakeButton) {
    cakeButton.addEventListener("click", () => {
      if (wishMade) return;

      wishMade = true;

      cakeButton.classList.add("blown-out");
      cakeButton.setAttribute(
        "aria-label",
        "The candles are blown out. Your wish is submitted."
      );

      cakeInstruction.textContent =
        "whoooosh 💨 candles successfully blown out!";

      launchConfetti();

      // Reveal the wish confirmation after a short pause.
      window.setTimeout(() => {
        wishResult.hidden = false;

        cakeInstruction.textContent =
          "okay, the universe has received your request. ♡";

        // Scroll gently to the result.
        wishResult.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 800);
    });
  }

  // Restart the experience from the beginning.
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      wishMade = false;

      digitInputs.forEach((input) => {
        input.value = "";
      });

      passwordError.textContent = "";

      if (cakeButton) {
        cakeButton.classList.remove("blown-out");
        cakeButton.setAttribute(
          "aria-label",
          "Tap to blow out the birthday cake candles"
        );
      }

      if (wishResult) {
        wishResult.hidden = true;
      }

      if (cakeInstruction) {
        cakeInstruction.textContent = "🎂 make a wish!";
      }

      if (confettiLayer) {
        confettiLayer.replaceChildren();
      }

      showScreen("screen-password");
      digitInputs[0].focus({ preventScroll: true });
    });
  }

  // Start at the password screen.
  showScreen("screen-password");
});
