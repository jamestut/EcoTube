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

function installVideoEventListener() {
  var fadeOutTimeout = null;
  let targetEls = [document.querySelector("#player"), document.querySelector("#player-control-container")];
  for(let el of targetEls) {
    el.addEventListener("mousemove", function() {
      var videoEl = document.querySelector("video");
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
}

installVideoEventListener();

(new MutationObserver(function(mutations) {
  let stop = false;
  for (let mutation of mutations) {
    for (let newNode of mutation.addedNodes) {
      if (newNode.tagName == "VIDEO") {
        setVideoObserver(newNode);
        stop = true;
        break;
      }
      if (stop)
        break;
    }
  }
})).observe(document.querySelector("#player"), {subtree: true, childList: true});

(function(){
  let videoEl = document.querySelector("video");
  if (videoEl != null)
    setVideoObserver(videoEl);
})();