const osdElId = "ecotube-info-osd";
const skipDurationSec = 5;
const speedStep = 0.25;
const speedMax = 4;

console.log("hello!");

function getOsdElement() {
  let osdEl = document.getElementById(osdElId);
  if (osdEl == null) {
    osdEl = document.createElement("div");
    osdEl.id = osdElId;
    document.getElementById("player-container-id").appendChild(osdEl);
  }
  return osdEl;
}

function updateOsd(text) {
  var osdEl = getOsdElement();
  if (document.saylor === undefined) {
    document.saylor = {};
  }
  if (document.saylor.osdTimeout === undefined) {
    document.saylor.osdTimeout = null;
  }
  osdEl.innerText = text;
  if (document.saylor.osdTimeout != null)
    clearTimeout(document.saylor.osdTimeout);
  document.saylor.osdTimeout = setTimeout(function(){
    document.saylor.osdTimeout = null;
    osdEl.innerText = "";
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
      if (videoEl.paused)
        videoEl.play();
      else
        videoEl.pause();
      keyData.preventDefault();
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

function pimpPlayerControl(node) {
  // variables for closures
  var fadeOutTimeout = null;

  // add mouseover listener to display OSD
  node.addEventListener('mousemove', function() {
    node.classList.add("fadein");
    if (fadeOutTimeout != null) 
      clearTimeout(fadeOutTimeout);
    fadeOutTimeout = setTimeout(function() {
      node.classList.remove("fadein");
      fadeOutTimeout = null;
    }, 1500);
  });
}

// observe on when to attach mouseover event listeners
var observer = new MutationObserver(function(mutations) {
  let stop = false;
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (addedNode.id == "player-control-overlay") {
        pimpPlayerControl(addedNode);
        stop = true;
        break;
      }
    }
    if (stop)
      break;
  }
});
observer.observe(document.querySelector("#player-control-container ytm-custom-control"), {
  childList: true
});
