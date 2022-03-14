let requestFunctions = [];
let headerFunctions = [];

chrome.runtime.onMessage.addListener(({rules}, _1, sendResponse) => {
  requestFunctions.forEach(fn => {
    chrome.webRequest.onBeforeRequest.removeListener(fn)
  });
  headerFunctions.forEach(fn => {
    chrome.webRequest.onBeforeSendHeaders.removeListener(fn);
  });
  requestFunctions = [];
  headerFunctions = [];

  rules.forEach(rule => {
    console.log(rule)
    const fn = (info) => {
      console.log(info)
      const trailing = info.url.replace(rule.urlFrom, '');
      return {
        redirectUrl: rule.urlTo + trailing,
      }
    }
    requestFunctions.push(fn);

    const headerFn = (info) => {
      console.log(info)
      rule.headersToReplace.forEach(header => {
        const headerFromDetails = info.requestHeaders.find(h => {
          return h.name === header.headerName;
        })
        if (headerFromDetails) {
          headerFromDetails.value = header.headerValue;
        } else {
          info.requestHeaders.push({
            name: header.headerName,
            value: header.headerValue
          });
        }
      });
      return {
        requestHeaders: info.requestHeaders
      }
    }

    headerFunctions.push(headerFn);

    chrome.webRequest.onBeforeRequest.addListener(fn, {urls: [rule.urlFrom + '*']}, ['blocking']);
    chrome.webRequest.onBeforeSendHeaders.addListener(headerFn, {urls: [rule.urlTo + '/*']},
      ['requestHeaders', 'blocking']);
  })
  sendResponse('OK');
})