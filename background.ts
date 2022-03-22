import Rule = chrome.declarativeNetRequest.Rule;
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import ResourceType = chrome.declarativeNetRequest.ResourceType;
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
import { RuleMessage } from './src/model'

chrome.runtime.onMessage.addListener(({ rules }: RuleMessage, _, sendResponse) => {
  // start at one, rules can't have an ID less than one
  let idIncrementer = 1;
  const updateRules = new Promise<{ message: string }>(async resolve => {
    // get all rules, so we can remove them
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
        priority: 1,
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
      };

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
              };
            })
          },
          condition: {
            regexFilter: rule.urlFrom,
            resourceTypes: [ResourceType.XMLHTTPREQUEST]
          }
        };
        headerSwapRules.push(newHeaderRule);
      }
    });

    try {
      // as per https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#method-updateDynamicRules,
      /*
        Modifies the current set of dynamic rules for the extension.
        The rules with IDs listed in options.removeRuleIds are first removed,
        and then the rules given in options.addRules are added.
       */
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIDs,
        addRules: redirectRules.concat(headerSwapRules)
      });
      resolve({ message: 'OK' });
    } catch (e: any) {
      resolve({ message: e.message });
    }
  });
  updateRules.then(sendResponse);
  /*
   * Tells onMessage to wait for async response (use false or don't return anything if synchronous)
   */
  return true;
});
