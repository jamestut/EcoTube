function installEventMediator() {
  // disable visibilitychange and video control event handlers
  let el = document.createElement("script");
  el.type = 'text/javascript';
  el.innerHTML = `
  var realFn = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function (a, b, c) {
    let super_this = this;
    if (this == document) {
      if (a == "visibilitychange")
        return;
    } else if (this.tagName == "VIDEO") {
      switch (a) {
        case "play":
        case "pause":
        case "keyup":
        case "keydown":
        case "keypress":
          return;
      }
    }
    // call real addEventListener on the correct object
    realFn.call(super_this, a, b, c);
  }
  `;
  document.documentElement.insertBefore(el, document.documentElement.firstChild);
}
installEventMediator();