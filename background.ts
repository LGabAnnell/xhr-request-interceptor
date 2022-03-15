import Rule = chrome.declarativeNetRequest.Rule;
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import ResourceType = chrome.declarativeNetRequest.ResourceType;

chrome.runtime.onMessage.addListener(({ rules }, _1, sendResponse) => {
  chrome.declarativeNetRequest.getDynamicRules(res => {
    let oldRules;
    if (res && res.length > 0) {
      oldRules = res.map(r => r.id);
    } else {
      oldRules = [];
    }
    const redirectRule: Rule = {
      id: 1,
      action: {
        type: RuleActionType.REDIRECT,
        redirect: {
          regexSubstitution: 'http://localhost:4000'
        }
      },
      condition: {
        regexFilter: '^https://chezgab.ch/lights/protected',
        resourceTypes: [ResourceType.XMLHTTPREQUEST],
      },
      priority: 1
    }
    /*rules.forEach((rule, index) => {
      const redirectRules = [
        {
          "id": index + 1,
          "priority": 1,
          "action": {
            "type": "redirect",
            "redirect": {
              "regexSubstitution": "http://localhost:4000"
            }
          },
          "condition": {
            "regexFilter": "^https://chezgab.ch/lights/protected",
            "resourceTypes": [
              "main_frame", "sub_frame", "xmlhttprequest"
            ],
            "requestMethods": [
              "get",
              "put",
              "post",
              "delete"
            ]
          }
        }
      ];*/
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRules,
        // addRules: redirectRules
      }, () => console.log(chrome.runtime.lastError))
  })


    /*const fn = (info) => {
      const trailing = info.url.replace(rule.urlFrom, '');
      return {
        redirectUrl: rule.urlTo + trailing,
      }
    }
    requestFunctions.push(fn);

    const headerFn = (info) => {
      rule.headersToReplace.forEach((header) => {
        const headerFromDetails = info.requestHeaders.find((h) => {
          return h.name === header.headerName;
        });
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

    chrome.webRequest.onBeforeRequest.addListener(fn, { urls: [rule.urlFrom + '*'] }, ['blocking']);
    chrome.webRequest.onBeforeSendHeaders.addListener(headerFn, { urls: [rule.urlTo + '/!*'] },
      ['requestHeaders', 'blocking']);*/
  sendResponse('OK');
});