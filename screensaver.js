// ==UserScript==
// @name         Screensaver
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  screensaver for saving the oled screen from burnin
// @author       Paul van der Lei
// @match        https://monitoring.wics.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wics.nl
// @grant        GM_log
// ==/UserScript==

(function () {
  "use strict";

  // ===== DOM ELEMENTS SETUP =====

  // Main screensaver logo image
  const imageUrl = "https://development.wics.nl/3sprint/dist/img/favicon.png";
  const image = document.createElement("img");
  image.src = imageUrl;
  image.style.height = "110vh";
  image.style.position = "fixed";
  image.style.zIndex = "99999999";
  image.style.left = "-100%";
  image.style.top = "-5%";
  image.style.display = "none";
  document.body.appendChild(image);

  // Santa sleigh for Christmas season
  const santa = document.createElement("img");
  santa.src = "https://www.pngall.com/wp-content/uploads/5/Santa-Sleigh-PNG.png";
  santa.style.position = "fixed";
  santa.style.zIndex = "99999998";
  santa.style.height = "30vh";
  santa.style.bottom = "0vh"; // Raised from -8vh to be more visible
  santa.style.display = "none";
  santa.style.left = "-100%";

  document.body.appendChild(santa);

  // Christmas decoration in corner
  const christmas = document.createElement("img");
  christmas.src = "https://cdn.pixabay.com/photo/2016/11/10/18/48/christmas-decorations-1814927_960_720.png";
  christmas.style.position = "fixed";
  christmas.style.zIndex = "99999998";
  christmas.style.height = "30vh";
  christmas.style.right = "0";
  christmas.style.display = "none";
  christmas.style.top = "0";
  christmas.style.animation = "christmasGlow 3s ease-in-out infinite";

  document.body.appendChild(christmas);

  // Add CSS animation for Christmas decoration glow
  const christmasGlowStyle = document.createElement("style");
  christmasGlowStyle.textContent = `
    @keyframes christmasGlow {
      0%, 100% {
        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
      }
      50% {
        filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
      }
    }
  `;
  document.head.appendChild(christmasGlowStyle);

  // Sinterklaas on horse for December 5th
  const sinterklaas = document.createElement("img");
  sinterklaas.src = "https://comicvine.gamespot.com/a/uploads/scale_small/11113/111139104/3602827-sinterklaas-paard.png";
  sinterklaas.style.position = "fixed";
  sinterklaas.style.zIndex = "99999998";
  sinterklaas.style.height = "30vh";
  sinterklaas.style.bottom = "2vh"; // Raised from -4vh to be more visible
  sinterklaas.style.display = "none";
  sinterklaas.style.left = "-100%";

  document.body.appendChild(sinterklaas);

  // ===== PARTICLE CONTAINERS =====
  // Container for pepernoten particles (Sinterklaas)
  const pepernotenContainer = document.createElement("div");
  pepernotenContainer.id = "pepernoten-container";
  pepernotenContainer.style.position = "fixed";
  pepernotenContainer.style.top = "0";
  pepernotenContainer.style.left = "0";
  pepernotenContainer.style.width = "100vw";
  pepernotenContainer.style.height = "100vh";
  pepernotenContainer.style.pointerEvents = "none";
  pepernotenContainer.style.zIndex = "99999997";
  document.body.appendChild(pepernotenContainer);

  // Container for present particles (Santa)
  const presentsContainer = document.createElement("div");
  presentsContainer.id = "presents-container";
  presentsContainer.style.position = "fixed";
  presentsContainer.style.top = "0";
  presentsContainer.style.left = "0";
  presentsContainer.style.width = "100vw";
  presentsContainer.style.height = "100vh";
  presentsContainer.style.pointerEvents = "none";
  presentsContainer.style.zIndex = "99999997";
  document.body.appendChild(presentsContainer);

  // Birthday decoration
  const birthDay = document.createElement("img");
  birthDay.src = "https://www.pngall.com/wp-content/uploads/5/Birthday-Decoration-PNG-Download-Image.png";
  birthDay.style.position = "fixed";
  birthDay.style.zIndex = "99999998";
  birthDay.style.width = "100vw";
  birthDay.style.top = "-100%";
  birthDay.style.display = "none";
  birthDay.style.left = "0";

  document.body.appendChild(birthDay);

  // Snow effect container
  const snow = document.createElement("div");
  snow.id = "snow";
  document.body.appendChild(snow);

  // Event notification display
  const event = document.createElement("div");
  event.id = "event";
  event.style.position = "fixed";
  event.style.zIndex = "99999998";
  event.style.width = "200px";
  event.style.bottom = "10px";
  event.style.right = "10px";
  event.style.display = "none";
  event.style.backgroundColor = "rgba(0,0,0,0.5)";
  event.style.color = "white";
  event.style.fontSize = "16px";
  event.style.textAlign = "center";
  event.style.padding = "10px";
  event.style.fontFamily = "Arial, Helvetica, sans-serif";

  //add event text and time element to event div
  const eventText = document.createElement("div");
  eventText.id = "eventText";
  eventText.style.fontSize = "16px";
  eventText.style.textAlign = "center";
  eventText.style.fontFamily = "Arial, Helvetica, sans-serif";
  eventText.style.color = "white";

  event.appendChild(eventText);

  const eventTime = document.createElement("div");
  eventTime.id = "eventTime";
  eventTime.style.fontSize = "12px";
  eventTime.style.textAlign = "center";
  eventTime.style.fontFamily = "Arial, Helvetica, sans-serif";
  eventTime.style.color = "white";

  event.appendChild(eventTime);

  document.body.appendChild(event);

  // ===== ANIMATION FUNCTIONS =====

  // Animation state flags to prevent multiple simultaneous animations
  let isRollAnimating = false;
  let isSantaAnimating = false;
  let isSinterklaasAnimating = false;
  let isBirthdayAnimating = false;

  // Helper function to create falling pepernoten (gingerbread cookies)
  function createPepernoet(x, y) {
    const pepernoet = document.createElement("div");
    pepernoet.textContent = "🍪";
    pepernoet.style.position = "absolute";
    pepernoet.style.left = x + "px";
    pepernoet.style.top = y + "px";
    pepernoet.style.fontSize = "20px";
    pepernoet.style.opacity = "1";
    pepernoet.style.transition = "transform 0.1s ease-out";
    pepernotenContainer.appendChild(pepernoet);

    let fallPos = 0;
    let opacity = 1;
    let rotation = Math.random() * 360; // Random starting rotation
    let rotationSpeed = (Math.random() - 0.5) * 4; // Random rotation speed between -2 and +2
    const swaySpeed = 0.02 + Math.random() * 0.01; // Vary sway speed per cookie
    const swayAmount = 15 + Math.random() * 10; // Vary sway amount (15-25px)

    const animatePepernoet = () => {
      // Slower fall with slight acceleration
      fallPos += 1.2 + (fallPos * 0.003); // Starts at 1.2, gradually accelerates
      opacity -= 0.006; // Much slower fade
      rotation += rotationSpeed; // Gentle tumbling

      // More natural sway pattern
      const sway = Math.sin(fallPos * swaySpeed) * swayAmount;

      pepernoet.style.top = (y + fallPos) + "px";
      pepernoet.style.left = (x + sway) + "px";
      pepernoet.style.opacity = opacity.toString();
      pepernoet.style.transform = `rotate(${rotation}deg)`;

      if (opacity <= 0 || (y + fallPos) > window.innerHeight + 50) {
        pepernoet.remove();
        return;
      }
      requestAnimationFrame(animatePepernoet);
    };
    requestAnimationFrame(animatePepernoet);
  }

  // Helper function to create falling presents
  function createPresent(x, y) {
    const presentEmojis = ["🎁", "🎀", "📦"];
    const present = document.createElement("div");
    present.textContent = presentEmojis[Math.floor(Math.random() * presentEmojis.length)];
    present.style.position = "absolute";
    present.style.left = x + "px";
    present.style.top = y + "px";
    present.style.fontSize = "26px";
    present.style.opacity = "1";
    present.style.transition = "transform 0.1s ease-out";
    presentsContainer.appendChild(present);

    let fallPos = 0;
    let opacity = 1;
    let rotation = Math.random() * 360; // Random starting rotation
    let rotationSpeed = (Math.random() - 0.5) * 6; // Random rotation speed between -3 and +3
    const swaySpeed = 0.015 + Math.random() * 0.01; // Vary sway speed per present
    const swayAmount = 20 + Math.random() * 15; // Vary sway amount (20-35px)
    const fallSpeed = 1.5 + Math.random() * 0.5; // Slightly random fall speed (1.5-2.0)

    const animatePresent = () => {
      // Presents fall a bit faster than cookies but still graceful
      fallPos += fallSpeed + (fallPos * 0.002); // Slight acceleration
      opacity -= 0.005; // Slow fade
      rotation += rotationSpeed; // Tumbling

      // More natural sway pattern with slight wobble
      const sway = Math.sin(fallPos * swaySpeed) * swayAmount;
      const wobble = Math.cos(fallPos * swaySpeed * 2.3) * (swayAmount * 0.3);

      present.style.top = (y + fallPos) + "px";
      present.style.left = (x + sway + wobble) + "px";
      present.style.opacity = opacity.toString();
      present.style.transform = `rotate(${rotation}deg) scale(${1 + Math.sin(fallPos * 0.05) * 0.1})`;

      if (opacity <= 0 || (y + fallPos) > window.innerHeight + 50) {
        present.remove();
        return;
      }
      requestAnimationFrame(animatePresent);
    };
    requestAnimationFrame(animatePresent);
  }

  const roll = () => {
    // Prevent multiple simultaneous roll animations
    if (!isRollAnimating) {
      isRollAnimating = true;
    }

    image.style.display = "block";
    const leftPos = parseFloat(image.style.left) + 0.6; // Use parseFloat to preserve decimals
    image.style.left = leftPos + "%";
    image.style.transform = `rotate(${leftPos * 2}deg)`;
    if (leftPos > 100) {
      image.style.left = "-100%";
      image.style.display = "none";
      isRollAnimating = false;
      return;
    }
    requestAnimationFrame(roll);
  };

  // Animation state tracking for Santa
  let santaAnimationFrame = 0;

  const santaCycle = () => {
    // Prevent multiple simultaneous Santa animations
    if (!isSantaAnimating) {
      isSantaAnimating = true;
      santaAnimationFrame = 0;
    }

    santa.style.display = "block";
    const leftPos = parseFloat(santa.style.left) + 0.5; // Use parseFloat to preserve decimals
    santa.style.left = leftPos + "%";

    // Add flying bobbing effect (sine wave) - slower, more graceful
    const bob = Math.sin(santaAnimationFrame * 0.05) * 3; // Reduced from 0.1 to 0.05 for slower bob
    santa.style.bottom = (0 + bob) + "vh";

    // Drop presents occasionally (every 24 frames for very subtle effect)
    // Only spawn when Santa is on-screen (between 5% and 90%)
    if (santaAnimationFrame % 24 === 0 && leftPos > 5 && leftPos < 90) {
      const santaRect = santa.getBoundingClientRect();
      // Spawn at a visible height (65% down from top) to ensure particles are visible
      const visibleY = Math.min(santaRect.top, window.innerHeight * 0.65);
      createPresent(
        santaRect.left + santaRect.width / 2,
        visibleY
      );
    }

    santaAnimationFrame++;

    if (leftPos > 100) {
      santa.style.left = "-100%";
      santa.style.bottom = "0vh";
      santa.style.display = "none";
      santaAnimationFrame = 0;
      isSantaAnimating = false;
      return;
    }
    requestAnimationFrame(santaCycle);
  };

  // Animation state tracking for Sinterklaas
  let sinterklaasAnimationFrame = 0;

  const sinterklaasCycle = () => {
    // Prevent multiple simultaneous Sinterklaas animations
    if (!isSinterklaasAnimating) {
      isSinterklaasAnimating = true;
      sinterklaasAnimationFrame = 0;
    }

    sinterklaas.style.display = "block";
    const leftPos = parseFloat(sinterklaas.style.left) + 0.5; // Use parseFloat to preserve decimals
    sinterklaas.style.left = leftPos + "%";

    // Add galloping bounce effect (sine wave) - slower, more graceful gallop
    const bounce = Math.sin(sinterklaasAnimationFrame * 0.08) * 2.5; // Reduced from 0.15 to 0.08, increased amplitude slightly
    sinterklaas.style.bottom = (2 + bounce) + "vh";

    // Drop pepernoten occasionally (every 16 frames for subtle effect)
    // Only spawn when Sinterklaas is on-screen (between 5% and 90%)
    if (sinterklaasAnimationFrame % 16 === 0 && leftPos > 5 && leftPos < 90) {
      const sinterklaasRect = sinterklaas.getBoundingClientRect();
      // Spawn at a visible height (70% down from top) to ensure particles are visible
      const visibleY = Math.min(sinterklaasRect.top, window.innerHeight * 0.7);
      createPepernoet(
        sinterklaasRect.left + sinterklaasRect.width / 2,
        visibleY
      );
    }

    sinterklaasAnimationFrame++;

    if (leftPos > 100) {
      sinterklaas.style.left = "-100%";
      sinterklaas.style.bottom = "2vh";
      sinterklaas.style.display = "none";
      sinterklaasAnimationFrame = 0;
      isSinterklaasAnimating = false;
      return;
    }
    requestAnimationFrame(sinterklaasCycle);
  };

  const birthDayCycle = () => {
    // Prevent multiple simultaneous birthday animations
    if (!isBirthdayAnimating) {
      isBirthdayAnimating = true;
    }

    birthDay.style.display = "block";
    const topPos = parseFloat(birthDay.style.top) + 1;
    birthDay.style.top = topPos + "%";
    if (topPos > 0) {
      requestAnimationFrame(birthDayCycleReverse);
      return;
    }
    requestAnimationFrame(birthDayCycle);
  };

  const birthDayCycleReverse = () => {
    birthDay.style.display = "block";
    const topPos = parseFloat(birthDay.style.top) - 1;
    birthDay.style.top = topPos + "%";
    if (topPos < -100) {
      birthDay.style.display = "none";
      birthDay.style.top = "-100%";
      isBirthdayAnimating = false;
      return;
    }
    requestAnimationFrame(birthDayCycleReverse);
  };

setTimeout(() => {
  // ===== CONSOLE DEBUGGING / TESTING API =====

  // Helper function to show all available commands
  unsafeWindow.screensaverHelp = () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║           SCREENSAVER DEBUG & TESTING COMMANDS                 ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ANIMATIONS:                                                   ║
║    startRoll()         - Start the rolling logo animation     ║
║    startSanta()        - Start Santa's sleigh animation       ║
║    startSinterklaas()  - Start Sinterklaas animation          ║
║    startBirthday()     - Start birthday decoration animation  ║
║                                                                ║
║  CONTROLS:                                                     ║
║    snow = true/false            - Toggle snow effect          ║
║    christmasDecoration = true/false - Toggle decoration       ║
║    christmasGlow = true/false   - Toggle decoration glow      ║
║                                                                ║
║  INFORMATION:                                                  ║
║    screensaverStatus() - Show current state and config        ║
║    screensaverHelp()   - Show this help menu                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
  };

  // Status function to show current configuration and state
  unsafeWindow.screensaverStatus = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const isChristmas = month === 12 && day >= 6;
    const isSinterklaasDay = month === 12 && day === 5;
    const decorationVisible = christmas.style.display !== "none";
    const glowActive = christmas.style.animation.includes("christmasGlow");

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    SCREENSAVER STATUS                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Version: 0.17                                                 ║
║  Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}                      ║
║                                                                ║
║  CONFIGURATION:                                                ║
║    Roll frequency: Every ${config.screensaver.rollFrequency} hours                        ║
║    Sinterklaas: Dec ${config.sinterklaas.day} (every ${config.sinterklaas.frequency} min)               ║
║    Christmas: Dec ${config.christmas.startDay}-31 (every ${config.christmas.frequency} min)             ║
║                                                                ║
║  CURRENT STATE:                                                ║
║    Roll animating: ${isRollAnimating ? 'YES' : 'NO'}                                  ║
║    Santa animating: ${isSantaAnimating ? 'YES' : 'NO'}                                ║
║    Sinterklaas animating: ${isSinterklaasAnimating ? 'YES' : 'NO'}                         ║
║    Birthday animating: ${isBirthdayAnimating ? 'YES' : 'NO'}                            ║
║    Snow active: ${document.getElementById("snow").style.display === "block" ? 'YES' : 'NO'}                                   ║
║    Christmas decoration visible: ${decorationVisible ? 'YES' : 'NO'}                   ║
║    Christmas decoration glow: ${glowActive ? 'YES' : 'NO'}                      ║
║    Christmas mode: ${isChristmas ? 'YES' : 'NO'}                                ║
║    Sinterklaas day: ${isSinterklaasDay ? 'YES' : 'NO'}                              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
  };

  // Wrap animation functions with console feedback
  unsafeWindow.startRoll = () => {
    console.log("🔄 Starting roll animation...");
    if (isRollAnimating) {
      console.warn("⚠️  Roll animation already in progress!");
      return;
    }
    roll();
  };

  unsafeWindow.startSanta = () => {
    console.log("🎅 Starting Santa animation...");
    if (isSantaAnimating) {
      console.warn("⚠️  Santa animation already in progress!");
      return;
    }
    santaCycle();
  };

  unsafeWindow.startSinterklaas = () => {
    console.log("🐴 Starting Sinterklaas animation...");
    if (isSinterklaasAnimating) {
      console.warn("⚠️  Sinterklaas animation already in progress!");
      return;
    }
    sinterklaasCycle();
  };

  unsafeWindow.startBirthday = () => {
    console.log("🎂 Starting birthday animation...");
    if (isBirthdayAnimating) {
      console.warn("⚠️  Birthday animation already in progress!");
      return;
    }
    birthDayCycle();
  };

  // Log initialization complete
  console.log("%c🎬 Screensaver v0.17 loaded!", "color: #4CAF50; font-weight: bold; font-size: 14px;");
  console.log("%cType screensaverHelp() for available commands", "color: #2196F3; font-style: italic;");
}, 1000);


  // Expose snow control with feedback
  Object.defineProperty(unsafeWindow, 'snow', {
    get: () => document.getElementById("snow").style.display === "block",
    set: (value) => {
      const snowElement = document.getElementById("snow");
      if (value) {
        snowElement.style.display = "block";
        console.log("❄️  Snow enabled");
      } else {
        snowElement.style.display = "none";
        console.log("☀️  Snow disabled");
      }
    }
  });

  // Expose Christmas decoration control with feedback
  Object.defineProperty(unsafeWindow, 'christmasDecoration', {
    get: () => christmas.style.display !== "none",
    set: (value) => {
      if (value) {
        christmas.style.display = "block";
        console.log("🎄 Christmas decoration enabled");
      } else {
        christmas.style.display = "none";
        console.log("🚫 Christmas decoration disabled");
      }
    }
  });

  // Expose Christmas decoration glow control with feedback
  Object.defineProperty(unsafeWindow, 'christmasGlow', {
    get: () => christmas.style.animation.includes("christmasGlow"),
    set: (value) => {
      if (value) {
        christmas.style.animation = "christmasGlow 3s ease-in-out infinite";
        console.log("✨ Christmas decoration glow enabled");
      } else {
        christmas.style.animation = "none";
        console.log("🔅 Christmas decoration glow disabled");
      }
    }
  });

  // ===== CONFIGURATION =====
  const config = {
    screensaver: {
      interval: 60000, // Check every minute
      rollFrequency: 2, // Every 2 hours
    },
    sinterklaas: {
      month: 12,
      day: 5,
      frequency: 30, // Every 30 minutes
    },
    christmas: {
      month: 12,
      startDay: 6,
      frequency: 30, // Every 30 minutes
    }
  };

  // ===== HELPER FUNCTIONS =====
  function checkAndRunAnimations() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Roll animation every 2 hours at :00 (only if not already animating)
    if (hours % config.screensaver.rollFrequency === 0 && minutes === 0 && !isRollAnimating) {
      console.log("🔄 Auto-starting roll animation (scheduled)");
      roll();
    }

    // Sinterklaas (December 5th only, only if not already animating)
    if (month === config.sinterklaas.month && day === config.sinterklaas.day) {
      if (minutes % config.sinterklaas.frequency === 0 && !isSinterklaasAnimating) {
        console.log("🐴 Auto-starting Sinterklaas animation (scheduled)");
        sinterklaasCycle();
      }
    }

    // Christmas (December 6-31)
    const isChristmasSeason = month === config.christmas.month && day >= config.christmas.startDay;
    if (isChristmasSeason) {
      // Only start Santa if not already animating
      if (minutes % config.christmas.frequency === 0 && !isSantaAnimating) {
        console.log("🎅 Auto-starting Santa animation (scheduled)");
        santaCycle();
      }
      document.getElementById("snow").style.display = "block";
      christmas.style.display = "block";
    } else {
      document.getElementById("snow").style.display = "none";
      christmas.style.display = "none";
    }
  }

  // Run on initial load
  checkAndRunAnimations();

  // Run every minute
  setInterval(checkAndRunAnimations, config.screensaver.interval);

  let snowflakes_count = 40;

  let base_css = `
    body{
        overflow: hidden;
    }
    .snowflake {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(white, white);
  border-radius: 50%;
  filter: drop-shadow(0 0 10px white);
}`; // Put your custom base css here

  if (typeof total !== "undefined") {
    snowflakes_count = total;
  }

  // ===== SNOW FUNCTIONS =====
  // Creating snowflakes
  function spawn_snow(snow_density = 200) {
    snow_density -= 1;

    for (let x = 0; x < snow_density; x++) {
      let board = document.createElement("div");
      board.className = "snowflake";

      document.getElementById("snow").appendChild(board);
    }
  }

  // Append style for each snowflake to the head
  function add_css(rule) {
    let css = document.createElement("style");
    css.type = "text/css";
    css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName("head")[0].appendChild(css);
  }

  // Math
  function random_int(value = 100) {
    return Math.floor(Math.random() * value) + 1;
  }

  function random_range(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Create style for snowflake
  function spawnSnowCSS(snow_density = 200) {
    let snowflake_name = "snowflake";
    let rule = ``;
    if (typeof base_css !== "undefined") {
      rule = base_css;
    }

    for (let i = 1; i < snow_density; i++) {
      let random_x = Math.random() * 100; // vw
      let random_offset = random_range(-100000, 100000) * 0.0001; // vw;
      let random_x_end = random_x + random_offset;
      let random_x_end_yoyo = random_x + random_offset / 2;
      let random_yoyo_time = random_range(30000, 80000) / 100000;
      let random_yoyo_y = random_yoyo_time * 100; // vh
      let random_scale = Math.random();
      let fall_duration = random_range(10, 30) * 1; // s
      let fall_delay = random_int(30) * -1; // s
      let opacity_ = Math.random();

      rule += `
        .${snowflake_name}:nth-child(${i}) {
            opacity: ${opacity_};
            transform: translate(${random_x}vw, -10px) scale(${random_scale});
            animation: fall-${i} ${fall_duration}s ${fall_delay}s linear infinite;
        }

        @keyframes fall-${i} {
            ${random_yoyo_time * 100}% {
                transform: translate(${random_x_end}vw, ${random_yoyo_y}vh) scale(${random_scale});
            }

            to {
                transform: translate(${random_x_end_yoyo}vw, 100vh) scale(${random_scale});
            }

        }
        `;
    }

    add_css(rule);
  }

  setTimeout(() => {
    spawnSnowCSS(snowflakes_count);
    spawn_snow(snowflakes_count);
  }, 3000);
})();
