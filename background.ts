import Rule = chrome.declarativeNetRequest.Rule;
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import ResourceType = chrome.declarativeNetRequest.ResourceType;
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
import { RedirectionRule } from './src/model'

chrome.runtime.onMessage.addListener(({ rules }: { rules: RedirectionRule[] }, _1, sendResponse) => {
  chrome.declarativeNetRequest.getDynamicRules(res => {
    let oldRules: number[];
    if (res && res.length > 0) {
      oldRules = res.map(r => r.id);
    } else {
      oldRules = [];
    }

    const redirectRules: Rule[] = [];
    const headerSwapRules: Rule[] = [];
    rules.forEach((rule, index) => {
      const newRedirectRule: Rule = {
        id: index + 1,
        action: {
          type: RuleActionType.REDIRECT,
          redirect: {
            regexSubstitution: rule.urlTo
          }
        },
        condition: {
          regexFilter: rule.urlFrom,
          resourceTypes: [ResourceType.XMLHTTPREQUEST]
        },
        priority: 1
      }
      redirectRules.push(newRedirectRule);

      if (rule.headersToReplace && rule.headersToReplace.length > 0) {
        const newHeaderRule: Rule = {
          id: rules.length * (index + 2),
          priority: 1,
          action: {
            type: RuleActionType.MODIFY_HEADERS,
            requestHeaders: rule.headersToReplace.map(r => {
              return {
                header: r.headerName, value: r.headerValue, operation: HeaderOperation.SET
              }
            })
          },
          condition: {
            regexFilter: rule.urlTo,
            resourceTypes: [ResourceType.XMLHTTPREQUEST]
          }
        };
        headerSwapRules.push(newHeaderRule);
      }
    });

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRules,
      addRules: redirectRules.concat(headerSwapRules)
    }, () => {
      console.log(chrome.runtime.lastError);
      if (chrome.runtime.lastError) {
        sendResponse(chrome.runtime.lastError);
      }
    });
  });
  sendResponse('OK');
});