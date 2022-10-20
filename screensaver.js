// ==UserScript==
// @name         Screensaver
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  screensaver for saving the oled screen from burnin
// @author       Paul van der Lei
// @match        https://monitoring.wics.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wics.nl
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /*Creating Image*/
    const imageUrl = "https://nextgen.wics.nl/r200sprint/img/favicon.png";
    const image = document.createElement("img");
    image.src = imageUrl;
    image.style.height = "110vh";
    image.style.position = "fixed";
    image.style.zIndex = "99999999";
    image.style.left = "-100%";
    image.style.top = "-5%";
    image.style.display = "none";
    document.body.appendChild(image);

    /*Creating RGB Cycle Slider*/
    const rgbCycle = document.createElement("div");
    rgbCycle.style.height = "500vh";
    rgbCycle.style.width = "200vw";
    rgbCycle.style.position = "fixed";
    rgbCycle.style.zIndex = "99999999";
    rgbCycle.style.left = "-300%";
    rgbCycle.style.top = "0";
    rgbCycle.style.display = "none";
    rgbCycle.style.background = "linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";
    document.body.appendChild(rgbCycle);


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
    }

    const cycle = () => {
        rgbCycle.display = "block";
        rgbCycle.style.left = parseInt(rgbCycle.style.left) + 1 + "%";
        if (parseInt(rgbCycle.style.left) > 100) {
            rgbCycle.style.left = "0";
            rgbCycle.style.display = "none";
            return;
        }
        requestAnimationFrame(cycle);
    }

    /*timouts for animations*/
    setInterval(() => {
        var date = new Date();

        //quick refresh of all colors to White/orange scheduled every hour
        if (date.getHours() % 2 == 0 && date.getMinutes() == 0) {
            console.log("running screensaver at [" + date + "]");
            roll();
        }

        //full refresh of all colors in full rgb spectrum scheduled every day at 23:59
        if (date.getHours() == 23 && date.getMinutes() == 59) {
            console.log("running RGB screensaver at [" + date + "]");
            cycle();
        }

    }, 60000);

})();