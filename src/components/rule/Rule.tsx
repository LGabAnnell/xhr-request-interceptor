import {
  newHeaderAction,
  removeAction,
  updateNameAction, updateRuleActive,
  updateURLAction,
  updateUrlToAction,
  useRules
} from '../../App';
import './Rule.scss'
import { UrlInput } from '../url-input/UrlInput';
import { RuleHeaders } from '../rule-headers/RuleHeaders';
import { RedirectionRule } from '../../model';

export type RuleProps = {
  id: number;
}

export const Rule = ({ id }: RuleProps) => {
  const { state, dispatch } = useRules();
  const currentRule = state.rules.find(rule => rule.id === id) as RedirectionRule;
  const firstRuleName = currentRule.name;
  const ruleUrl = currentRule.urlFrom;
  const urlTo = currentRule.urlTo;
  const ruleHeaders = currentRule.headersToReplace;
  const active = currentRule.active;

  return <div className={'w-100 border border-success m-2 p-2 d-flex flex-column align-items-start'}>
    <div className="form-check form-switch d-flex justify-content-center align-items-center pb-2">
      <input checked={active} className="form-check-input me-1" style={{ height: '1.5em', width: '3em' }}
             onChange={(e) => dispatch && dispatch(updateRuleActive(id, e.target.checked))}
             type="checkbox" role="switch" id={'flexSwitchCheckDefault' + id}/>
      <label className="form-check-label" htmlFor={'flexSwitchCheckDefault' + id}>Enable / disable</label>
    </div>
    <div className={'d-flex w-100'}>
      <input className={'form-control'} value={firstRuleName}
             onChange={e => dispatch && dispatch(updateNameAction(e.target.value, id))}/>
      <button className={'btn btn-danger btn-sm ms-2'} onClick={() => dispatch && dispatch(removeAction(id))}>
        <i className={'bi-trash hover-pointer'}/>
      </button>
    </div>
    <UrlInput labelText={'Url to redirect from'} idx={id} value={ruleUrl as string} actionFunction={updateURLAction} />
    <UrlInput idx={id} labelText={'Url to redirect to'} value={urlTo as string} actionFunction={updateUrlToAction} />
    <button className={'btn btn-primary btn-sm'} onClick={() => dispatch && dispatch(newHeaderAction(id))}>
      Add header to change
    </button>
    { ruleHeaders?.map((h, hIdx) => <RuleHeaders headerIdx={hIdx}
                                                 ruleID={id as number} key={hIdx}
                                                 headerName={h.headerName as string}
                                                 headerValue={h.headerValue as string} />) }
  </div>;
};