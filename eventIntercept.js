console.log("init");

function installEventMediator() {
  // disable visibilitychange event handlers
  let el = document.createElement("script");
  el.type = 'text/javascript';
  el.innerHTML = `
  var realFn = EventTarget.prototype.addEventListener;
  debugger;

  EventTarget.prototype.addEventListener = function (a, b, c) {
    let super_this = this;
    if (this == document) {
      if (a == "visibilitychange")
        return;
    }
    // call real addEventListener on the correct object
    realFn.call(super_this, a, b, c);
  }
  `;
  document.documentElement.insertBefore(el, document.documentElement.firstChild);
}
installEventMediator();