import { useRules } from '../../App';
import { Rule } from '../rule/Rule';
import { useState } from 'react';

export const Rules = () => {
  const { state } = useRules();
  const [inputValue, setInputValue] = useState('');
  return <div>
    <div className={'d-flex px-2'}>
      <input className={'form-control'} placeholder={'Filter'}
             onInput={e => setInputValue((e.target as HTMLInputElement).value.toLowerCase())} />
    </div>
    {
      state.rules.filter(r => r.name?.toLowerCase().includes(inputValue))
        .map((r) => <div className={'w-100 d-flex'} key={r.id}>
          <Rule id={r.id as number} />
        </div>)
    }
  </div>
}