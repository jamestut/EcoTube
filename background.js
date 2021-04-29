const youtubeUrls = ["https://www.youtube.com/*", "https://m.youtube.com/*", "https://youtube.com/*"];
const desiredUA = "Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (reqInfo) {
    reqInfo.requestHeaders.push({ name:"User-Agent", value:desiredUA });
    return { requestHeaders: reqInfo.requestHeaders };
  }, { urls: youtubeUrls }, ['blocking', 'requestHeaders']);