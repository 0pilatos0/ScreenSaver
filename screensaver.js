// ==UserScript==
// @name         Screensaver
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  screensaver for saving the oled screen from burnin
// @author       Paul van der Lei
// @match        https://monitoring.wics.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wics.nl
// @grant        GM_log
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

    const santa = document.createElement("img");
    santa.src = "https://www.pngall.com/wp-content/uploads/5/Santa-Sleigh-PNG.png";
    santa.style.position = "fixed";
    santa.style.zIndex = "99999999";
    santa.style.height = "30vh";
    santa.style.bottom = "-8vh";
    santa.style.display = "none";
    santa.style.left = "-100%";

    document.body.appendChild(santa);

    const christmas = document.createElement("img");
    christmas.src = "https://cdn.pixabay.com/photo/2016/11/10/18/48/christmas-decorations-1814927_960_720.png";
    christmas.style.position = "fixed";
    christmas.style.zIndex = "99999998";
    christmas.style.height = "30vh";
    christmas.style.right = "0";
    christmas.style.display = "none";
    christmas.style.top = "0";

    document.body.appendChild(christmas);

    const sinterklaas = document.createElement("img");
    sinterklaas.src = "https://miamary.clubs.nl/afbeeldingen/album/21867269/3602827-sinterklaas-paard.png";
    sinterklaas.style.position = "fixed";
    sinterklaas.style.zIndex = "99999999";
    sinterklaas.style.height = "30vh";
    sinterklaas.style.bottom = "-4vh";
    sinterklaas.style.display = "none";
    sinterklaas.style.left = "-100%";

    document.body.appendChild(sinterklaas);


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

    const santaCycle = () => {
        santa.style.display = "block";
        santa.style.left = parseInt(santa.style.left) + 1 + "%";
        if (parseInt(santa.style.left) > 100) {
            santa.style.left = "-100%";
            santa.style.display = "none";
            return;
        }
        requestAnimationFrame(santaCycle);
    }

    const sinterklaasCycle = () => {
        sinterklaas.style.display = "block";
        sinterklaas.style.left = parseInt(sinterklaas.style.left) + 1 + "%";
        if (parseInt(sinterklaas.style.left) > 100) {
            sinterklaas.style.left = "-100%";
            sinterklaas.style.display = "none";
            return;
        }
        requestAnimationFrame(sinterklaasCycle);
    }


    /*timouts for animations*/
    setInterval(() => {
        var date = new Date();

        //quick refresh of all colors to White/orange scheduled every hour
        if (date.getHours() % 2 == 0 && date.getMinutes() == 0) {
            roll();
        }

        //if it's christmas, run santa every 30 minutes
        if (date.getMonth() == 11 && date.getDate() >= 6) {
            if (date.getMinutes() % 30 == 0) {
                santaCycle();
            }
            christmas.style.display = "block";
        } else {
            christmas.style.display = "none";
        }

        if (date.getMonth() == 11 && date.getDate() == 5) {
            if (date.getMinutes() % 30 == 0) {
                sinterklaasCycle();
            }
        }


    }, 60000);

})();