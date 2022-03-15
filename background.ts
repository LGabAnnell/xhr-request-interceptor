import Rule = chrome.declarativeNetRequest.Rule;
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import ResourceType = chrome.declarativeNetRequest.ResourceType;
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
import { RuleMessage } from './src/model'

chrome.runtime.onMessage.addListener(({ rules }: RuleMessage, _1, sendResponse) => {
  let idIncrementer = 1;
  const promise = new Promise(async resolve => {
    const existingDynamicRules = await chrome.declarativeNetRequest.getDynamicRules();

    let oldRuleIDs: number[];
    if (existingDynamicRules && existingDynamicRules.length > 0) {
      oldRuleIDs = existingDynamicRules.map(r => r.id);
    } else {
      oldRuleIDs = [];
    }

    const redirectRules: Rule[] = [];
    const headerSwapRules: Rule[] = [];
    rules.forEach((rule) => {
      const newRedirectRule: Rule = {
        id: idIncrementer++,
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
          id: idIncrementer++,
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

    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIDs,
        addRules: redirectRules.concat(headerSwapRules)
      });
      resolve({ message: 'OK' });
    } catch (e) {
      resolve({ message: e.message });
    }
  });
  promise.then(sendResponse);
  return true;
});