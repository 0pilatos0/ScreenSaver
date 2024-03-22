// ==UserScript==
// @name         Screensaver
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  screensaver for saving the oled screen from burnin
// @author       Paul van der Lei
// @match        https://monitoring.wics.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wics.nl
// @grant        GM_log
// ==/UserScript==

(function () {
  "use strict";

  /*Creating Image*/
  const imageUrl = "https://development.wics.nl/3sprint/img/favicon.png";
  const image = document.createElement("img");
  image.src = imageUrl;
  image.style.height = "110vh";
  image.style.position = "fixed";
  image.style.zIndex = "99999999";
  image.style.left = "-100%";
  image.style.top = "-5%";
  image.style.display = "none";
  document.body.appendChild(image);

  const santa = document.createElement("img");
  santa.src =
    "https://www.pngall.com/wp-content/uploads/5/Santa-Sleigh-PNG.png";
  santa.style.position = "fixed";
  santa.style.zIndex = "99999998";
  santa.style.height = "30vh";
  santa.style.bottom = "-8vh";
  santa.style.display = "none";
  santa.style.left = "-100%";

  document.body.appendChild(santa);

  const christmas = document.createElement("img");
  christmas.src =
    "https://cdn.pixabay.com/photo/2016/11/10/18/48/christmas-decorations-1814927_960_720.png";
  christmas.style.position = "fixed";
  christmas.style.zIndex = "99999998";
  christmas.style.height = "30vh";
  christmas.style.right = "0";
  christmas.style.display = "none";
  christmas.style.top = "0";

  document.body.appendChild(christmas);

  const sinterklaas = document.createElement("img");
  sinterklaas.src =
    "https://miamary.clubs.nl/afbeeldingen/album/21867269/3602827-sinterklaas-paard.png";
  sinterklaas.style.position = "fixed";
  sinterklaas.style.zIndex = "99999998";
  sinterklaas.style.height = "30vh";
  sinterklaas.style.bottom = "-4vh";
  sinterklaas.style.display = "none";
  sinterklaas.style.left = "-100%";

  document.body.appendChild(sinterklaas);

  const birthDay = document.createElement("img");
  birthDay.src =
    "https://www.pngall.com/wp-content/uploads/5/Birthday-Decoration-PNG-Download-Image.png";
  birthDay.style.position = "fixed";
  birthDay.style.zIndex = "99999998";
  birthDay.style.width = "100vw";
  birthDay.style.top = "-100%";
  birthDay.style.display = "none";
  birthDay.style.left = "0";

  document.body.appendChild(birthDay);

  const snow = document.createElement("div");
  snow.id = "snow";

  document.body.appendChild(snow);

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

  /*defining animations*/
  const roll = () => {
    image.style.display = "block";
    image.style.left = parseInt(image.style.left) + 1 + "%";
    image.style.transform = `rotate(${parseInt(image.style.left) * 2}deg)`;
    if (parseInt(image.style.left) > 100) {
      image.style.left = "-100%";
      image.style.display = "none";
      return;
    }
    requestAnimationFrame(roll);
  };

  const santaCycle = () => {
    santa.style.display = "block";
    santa.style.left = parseInt(santa.style.left) + 1 + "%";
    if (parseInt(santa.style.left) > 100) {
      santa.style.left = "-100%";
      santa.style.display = "none";
      return;
    }
    requestAnimationFrame(santaCycle);
  };

  const sinterklaasCycle = () => {
    sinterklaas.style.display = "block";
    sinterklaas.style.left = parseInt(sinterklaas.style.left) + 1 + "%";
    if (parseInt(sinterklaas.style.left) > 100) {
      sinterklaas.style.left = "-100%";
      sinterklaas.style.display = "none";
      return;
    }
    requestAnimationFrame(sinterklaasCycle);
  };

  const birthDayCycle = () => {
    birthDay.style.display = "block";
    birthDay.style.top = parseInt(birthDay.style.top) + 1 + "%";
    if (parseInt(birthDay.style.top) > 0) {
      requestAnimationFrame(birthDayCycleReverse);
      return;
    }
    requestAnimationFrame(birthDayCycle);
  };

  const birthDayCycleReverse = () => {
    birthDay.style.display = "block";
    birthDay.style.top = parseInt(birthDay.style.top) - 1 + "%";
    if (parseInt(birthDay.style.top) < -100) {
      birthDay.style.display = "none";
      birthDay.style.top = "-100%";
      return;
    }
    requestAnimationFrame(birthDayCycleReverse);
  };

  var date = new Date();

  //quick refresh of all colors to White/orange scheduled every hour
  if (date.getHours() % 2 == 0 && date.getMinutes() == 0) {
    roll();
  }

  //if it's christmas, run santa every 30 minutes
  if (date.getMonth() + 1 == 12 && date.getDate() >= 6) {
    if (date.getMinutes() % 30 == 0) {
      santaCycle();
    }
    document.getElementById("snow").style.display = "block";
    christmas.style.display = "block";
  } else {
    document.getElementById("snow").style.display = "none";
    christmas.style.display = "none";
  }

  if (date.getMonth() + 1 == 12 && date.getDate() == 5) {
    if (date.getMinutes() % 30 == 0) {
      sinterklaasCycle();
    }
  }

  /*timouts for animations*/
  setInterval(() => {
    var date = new Date();

    //quick refresh of all colors to White/orange scheduled every hour
    if (date.getHours() % 2 == 0 && date.getMinutes() == 0) {
      roll();
    }

    //if it's christmas, run santa every 30 minutes
    if (date.getMonth() + 1 == 12 && date.getDate() >= 6) {
      if (date.getMinutes() % 30 == 0) {
        santaCycle();
      }
      document.getElementById("snow").style.display = "block";
      christmas.style.display = "block";
    } else {
      document.getElementById("snow").style.display = "none";
      christmas.style.display = "none";
    }

    if (date.getMonth() + 1 == 12 && date.getDate() == 5) {
      if (date.getMinutes() % 30 == 0) {
        sinterklaasCycle();
      }
    }
  }, 60000);

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

  // This function allows you to turn on and off the snow
  function toggle_snow() {
    let check_box = document.getElementById("toggle_snow");
    if (check_box.checked == true) {
      document.getElementById("snow").style.display = "block";
    } else {
      document.getElementById("snow").style.display = "none";
    }
  }

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

  function checkEvents() {
    //poll to events.paulvanderlei.com/events
    console.log("checking events");
    const pollLocation = "https://events.paulvanderlei.com/events";

    var headers = {};

    //get the events
    fetch(pollLocation, {
      method: "GET",
      mode: "cors",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let currentEvent = data.events[0];

        if (currentEvent == undefined) {
          return;
        }

        document.getElementById("event").style.display = "block";
        document.getElementById("eventText").innerHTML = currentEvent.name;
        let eventTime = new Date(currentEvent.time * 1000);
        document.getElementById("eventTime").innerHTML =
          eventTime.getHours() + ":" + eventTime.getMinutes();
      });
  }

  checkEvents();
})();
