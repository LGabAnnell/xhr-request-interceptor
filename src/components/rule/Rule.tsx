import {
  newHeaderAction,
  removeAction,
  updateNameAction,
  updateURLAction,
  updateUrlToAction,
  useRules
} from '../../App';
import './Rule.scss'
import { UrlInput } from '../url-input/UrlInput';
import { RuleHeaders } from '../rule-headers/RuleHeaders';

export type RuleProps = {
  idx: number;
}

export const Rule = ({ idx }: RuleProps) => {
  const { state, dispatch } = useRules();
  const firstRuleName = state.rules[idx].name;
  const ruleUrl = state.rules[idx].urlFrom;
  const urlTo = state.rules[idx].urlTo;
  const ruleHeaders = state.rules[idx].headersToReplace;

  return <div className={'w-100 border border-success m-2 p-2 d-flex flex-column align-items-start'}>
    <div className={'d-flex w-100'}>
      <input className={'flex'} value={firstRuleName}
             onChange={e => dispatch && dispatch(updateNameAction(e.target.value, idx))}/>
      <button className={'btn btn-danger btn-sm ms-2'} onClick={() => dispatch && dispatch(removeAction(idx))}>
        <i className={'bi-trash hover-pointer'}/>
      </button>
    </div>
    <UrlInput labelText={'Url to redirect from'} idx={idx} value={ruleUrl as string} actionFunction={updateURLAction} />
    <UrlInput idx={idx} labelText={'Url to redirect to'} value={urlTo as string} actionFunction={updateUrlToAction} />
    <button className={'btn btn-primary btn-sm'} onClick={() => dispatch && dispatch(newHeaderAction(idx))}>
      Add header to change
    </button>
    { ruleHeaders?.map((h, hIdx) => <RuleHeaders headerIdx={hIdx} idx={idx} key={hIdx}
                                                 headerName={h.headerName} headerValue={h.headerValue} />) }
  </div>;
};