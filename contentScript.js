const osdElId = "ecotube-info-osd";
const skipDurationSec = 5;
const speedStep = 0.25;
const speedMax = 4;

document.saylor = {};

function getOsdElement() {
  let osdEl = document.getElementById(osdElId);
  if (osdEl == null) {
    osdEl = document.createElement("div");
    osdEl.id = osdElId;
    osdEl.style.display = "none";
    document.getElementById("player-container-id").appendChild(osdEl);
  }
  return osdEl;
}

function updateOsd(text) {
  var osdEl = getOsdElement();
  if (document.saylor.osdTimeout === undefined) {
    document.saylor.osdTimeout = null;
  }
  osdEl.innerText = text;
  osdEl.style.display = "";
  if (document.saylor.osdTimeout != null)
    clearTimeout(document.saylor.osdTimeout);
  document.saylor.osdTimeout = setTimeout(function(){
    document.saylor.osdTimeout = null;
    osdEl.style.display = "none";
  }, 1500);
}

function changeVideoSpeed(videoEl, up) {
  if (up) {
    let newRate = videoEl.playbackRate + speedStep;
    if (newRate <= speedMax) {
      videoEl.playbackRate = newRate;
      updateOsd(`Speed: ${newRate}`);
    }
  } else {
    let newRate = videoEl.playbackRate - speedStep;
    if (newRate >= speedStep) {
      videoEl.playbackRate = newRate;
      updateOsd(`Speed: ${newRate}`);
    }
  }
}

function toggleTheatreMode() {
  const className = "theatre";
  let playerEl = document.getElementById("player-container-id");
  let ytmNextEl = document.querySelector('ytm-single-column-watch-next-results-renderer [section-identifier="related-items"]');
  let teathreOn = playerEl.classList.contains(className);
  if (teathreOn) {
    // turn off
    playerEl.classList.remove(className);
    ytmNextEl.classList.remove(className);
  } else {
    // turn on
    playerEl.classList.add(className);
    ytmNextEl.classList.add(className);
  }
}

// keyboard shortcut
document.addEventListener('keydown', function(keyData) {
  // ignore if path is textarea or input
  if (["INPUT", "TEXTAREA"].indexOf(keyData.path[0].tagName) >= 0)
    return true;
  let videoEl = document.querySelector("video");
  if (videoEl == null)
    return true;
  // check if video has blob loaded
  if (document.querySelector("video").src == "")
    return true;

  // let's do the handling!
  switch (keyData.code) {
    case "KeyF":
      document.querySelector("#player-control-container button.fullscreen-icon").click();
      keyData.preventDefault();
      break;
    case "KeyT":
      toggleTheatreMode();
      break;
    case "Space":
      if (keyData.path[0].tagName != "VIDEO") {
        if (videoEl.paused)
          videoEl.play();
        else
          videoEl.pause();
        keyData.preventDefault();
      }
      break;
    case "ArrowRight":
      if (isNaN(videoEl.duration) || ((videoEl.currentTime + skipDurationSec) < videoEl.duration))
        videoEl.currentTime += skipDurationSec;
      keyData.preventDefault();
      break;
    case "ArrowLeft":
      videoEl.currentTime -= skipDurationSec;
      keyData.preventDefault();
      break;
    case "BracketLeft":
      changeVideoSpeed(videoEl, false);
      break;
    case "BracketRight":
      changeVideoSpeed(videoEl, true);
      break;
  }
  return false;
});

function setVideoObserver(videoEl) {
  document.saylor.videoParentObserver = new MutationObserver(function(mutations) {
    if (videoEl.getAttribute("controls") == null) {
      videoEl.setAttribute("controls", "");
      videoEl.setAttribute("controlslist", "nofullscreen");
    }
  });
  document.saylor.videoParentObserver.observe(videoEl, {attributes: true});
}

function installVideoEventListeners(videoEl) {
  videoEl.addEventListener("focus", function() {
    this.blur();
  }, false);
  var fadeOutTimeout = null;
  videoEl.addEventListener("mousemove", function() {
    var ctrlOverlayEl = document.getElementById("player-control-overlay");
    if (ctrlOverlayEl == null)
      return;
    ctrlOverlayEl.classList.add("fadein");
    videoEl.classList.remove("hide-video-controls");
    if (fadeOutTimeout != null)
      clearTimeout(fadeOutTimeout);
    fadeOutTimeout = setTimeout(function() {
     ctrlOverlayEl.classList.remove("fadein");
     videoEl.classList.add("hide-video-controls");
     fadeOutTimeout = null;
    }, 2000);
  });
}

function setupVideoElement(videoEl) {
  setVideoObserver(videoEl);
  installVideoEventListeners(videoEl);
}

function setupPlayerControlOverlayEvents(el) {
  debugger;
}

(new MutationObserver(function(mutations) {
  for (let mutation of mutations) {
    for (let newNode of mutation.addedNodes) {
      if (newNode.tagName == "VIDEO") {
        setupVideoElement(newNode);
      } else if (newNode.id == "player-control-overlay") {
        setupPlayerControlOverlayEvents(newNode);
      }
    }
  }
})).observe(document.querySelector("#player"), {subtree: true, childList: true});

(function(){
  let videoEl = document.querySelector("video");
  if (videoEl != null) {
    setupVideoElement(videoEl);
  }
})();
