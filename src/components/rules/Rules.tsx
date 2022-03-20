import { useRules } from '../../App';
import { Rule } from '../rule/Rule';

export const Rules = () => {
  const { state } = useRules();
  console.log(state.filter)
  return <div>
    {
      state.rules.filter(r => r.name?.toLowerCase().includes(state.filter))
        .map((r) => <div className={'w-100 d-flex'} key={r.id}>
          <Rule id={r.id} />
        </div>)
    }
  </div>
}