import { updateHeaderAction, useRules } from '../../App';

export const headerOptions = [
  'Authorization',
  'Content-Type'
];

// @ts-ignore
export const RuleHeaders = ({ headerName, headerValue, idx, headerIdx }) => {
  const { dispatch } = useRules();
  return <div className={'d-flex w-100 mt-2'}>
    <select className={'me-2'} value={headerName} onChange={e => dispatch && dispatch(updateHeaderAction(
      e.target.value,
      headerValue,
      idx,
      headerIdx
    ))}>
      {headerOptions.map(o => <option value={o}>{o}</option>)}
    </select>
    <input className={'flex'} value={headerValue} onChange={e => {
      dispatch && dispatch(updateHeaderAction(headerName, e.target.value, idx, headerIdx));
    }}/>
  </div>
}