import { addAction, RedirectionRule, RuleState, useRules } from '../../App';
import { useState } from 'react';

const sendRules = (rules: RedirectionRule[]) => {
  chrome.runtime.sendMessage({ rules }, response => {
    console.log(response);
  });
}

export function Header() {
  const { dispatch, state } = useRules();
  const [ruleName, changeName] = useState('');

  return <>
    <div className={'w-100 d-flex'}>
      <button onClick={() => sendRules(state.rules)}>Update</button>
    </div>
    <div className={'d-flex p-2'}>
      <button className={'btn btn-primary btn-sm me-2'}
              onClick={() => {
                dispatch && dispatch(addAction(ruleName));
                changeName('');
              }}>Add new rule
      </button>
      <input onInput={(e) => changeName((e.target as HTMLInputElement).value)}
             className={'flex'}
             value={ruleName}
             onKeyDown={e => {
               if (e.key === 'Enter') {
                 dispatch && dispatch(addAction(ruleName));
                 changeName('');
               }
             }}/>
    </div>
  </>;
}