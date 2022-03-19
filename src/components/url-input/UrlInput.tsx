import { Action, useRules } from '../../App';

interface UrlInputProps {
  actionFunction: (v1: string, v2: number) => Partial<Action>;
  idx: number;
  value: string;
  labelText: string;
}

export const UrlInput = ({ actionFunction, idx, value, labelText }: UrlInputProps) => {
  const { dispatch } = useRules();
  return <div className={'d-flex w-100 mt-2 justify-content-start'}>
    <label htmlFor={labelText + idx} className={'d-flex justify-content-start col-3'}>{labelText}</label>
    <input type="text" id={labelText + idx} defaultValue={value} className={'form-control'}
           onChange={e => dispatch(actionFunction(e.target.value, idx))} />
  </div>;
};