// ==UserScript==
// @name         Screensaver
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  screensaver for saving the oled screen from burnin
// @author       Paul van der Lei
// @match        https://monitoring.wics.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wics.nl
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const imageUrl = "https://nextgen.wics.nl/r200sprint/img/favicon.png";
    const image = document.createElement("img");
    image.src = imageUrl;
    image.style.height = "110vh";
    image.style.position = "fixed";
    image.style.zIndex = "99999999";
    image.style.left = "-100%";
    image.style.top = "-5%";

    document.body.appendChild(image);

    const roll = () => {
        image.style.left = parseInt(image.style.left) + 1 + "%";
        image.style.transform = `rotate(${parseInt(image.style.left) * 2}deg)`;
        if (parseInt(image.style.left) > 100) {
            image.style.left = "-100%";
            image.style.display = "none";
            return;
        }
        requestAnimationFrame(roll);
    }

    roll();

    //run once every 4 hours
    setInterval(() => {
        image.style.display = "block";
        roll();
    }, 14400 * 1000);
})();