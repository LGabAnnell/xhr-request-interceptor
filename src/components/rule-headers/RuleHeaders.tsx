import { removeHeaderAction, updateHeaderAction, useRules } from '../../App';

export const headerOptions = [
  'Authorization',
  'Content-Type'
];

interface RuleHeaderProps {
  headerName: string;
  headerValue: string;
  ruleID: number;
  headerIdx: number;
}

// @ts-ignore
export const RuleHeaders = ({ headerName, headerValue, ruleID, headerIdx }: RuleHeaderProps) => {
  const { dispatch } = useRules();
  return <div className={'d-flex w-100 mt-2'}>
    <input className={'me-2 form-control '} value={headerName} onChange={e => dispatch && dispatch(updateHeaderAction(
      e.target.value,
      headerValue,
      ruleID,
      headerIdx
    ))}/>
    <input className={'form-control'} value={headerValue} onChange={e => {
      dispatch && dispatch(updateHeaderAction(headerName, e.target.value, ruleID, headerIdx));
    }}/>
    <button className={'btn btn-danger btn-sm ms-2'} onClick={() => {
      dispatch && dispatch(removeHeaderAction(ruleID, headerIdx));
    }}>
      <i className={'bi-trash'}/>
    </button>
  </div>
}