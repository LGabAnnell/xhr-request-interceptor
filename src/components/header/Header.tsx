import { addAction, useRules } from '../../App';
import { useState } from 'react';
import { RedirectionRule } from '../../model';

export function Header() {
  const { dispatch, state } = useRules();
  const [ruleName, changeName] = useState('');
  const [updateOk, updateUpdateOk] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const sendRules = (rules: RedirectionRule[]) => {
    chrome.runtime.sendMessage({ rules }, response => {
      if (response === 'OK') {
        updateUpdateOk(true);
        setTimeout(() => {
          updateUpdateOk(false);
        }, 1000);
      } else {
        setErrorMessage(response);
      }
    });
  }

  return <>
    <div className={'w-100 d-flex p-2'}>
      <button className={'btn btn-primary btn-sm'} onClick={() => sendRules(state.rules.filter(rule => rule.active))}>
        Update
      </button>
      <span className={'d-flex justify-content-center align-items-center'}>
        {updateOk ? <i className={'bi-check-lg text-success ms-2'} /> : errorMessage}
      </span>
    </div>
    <div className={'d-flex p-2'}>
      <button className={'btn btn-primary btn-sm me-2'}
              onClick={() => {
                dispatch && dispatch(addAction(ruleName));
                changeName('');
              }}>
        Add new rule
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