import { useRules } from '../../App';
import { Rule } from '../rule/Rule';

export const Rules = () => {
  const { state } = useRules();
  return <div>
    {
      state.rules.map((r, idx) => <div className={'w-100 d-flex'} key={idx}>
        <Rule idx={idx} />
      </div>)
    }
  </div>
}