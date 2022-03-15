import { addRuleAction, updateActiveAllAction, useRules } from '../../App';
import { useState } from 'react';
import { RedirectionRule } from '../../model';

export function Header() {
  const { dispatch, state } = useRules();
  const [updateOk, updateUpdateOk] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sendRules = (rules: RedirectionRule[]) => {
    chrome.runtime.sendMessage({ rules }, response => {
      if (response.message === 'OK') {
        updateUpdateOk(true);
        setErrorMessage('');
        setTimeout(() => {
          updateUpdateOk(false);
        }, 1000);
      } else {
        setErrorMessage(response.message);
      }
    });
  };

  return <>
    <div className={'w-100 d-flex p-2'}>
      <button className={'btn btn-primary btn-sm'} onClick={() => sendRules(state.rules.filter(rule => rule.active))}>
        Update
      </button>
      <span className={'d-flex justify-content-center align-items-center'}>
        {updateOk ? <i className={'bi-check-lg text-success ms-2'} /> :
          errorMessage && errorMessage.length > 0 ? <span onClick={() => setErrorMessage('')}
                                                          className={'text-danger small px-2'}>
            {errorMessage}
          </span> : null}
      </span>
      <button className={'btn btn-primary btn-sm me-2 ms-2'}
              onClick={() => {
                dispatch && dispatch(addRuleAction('Default name'));
              }}>
        Add new rule
      </button>
    </div>
    <div className={'d-flex p-2'}>
      <div className="form-check form-switch mx-2 d-flex align-items-center">
        <input className="form-check-input me-2" style={{ height: '2em', width: '4em' }}
               type="checkbox" role="switch" id={'deactivateAll'}
               onChange={e => dispatch && dispatch(updateActiveAllAction(e.target.checked))}/>
        <label className="form-check-label" htmlFor={'deactivateAll'}>Enable / disable all</label>
      </div>
    </div>
  </>;
}