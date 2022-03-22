import React from 'react'
import './App.css'
import { Header } from './components/header/Header'
import { Rules } from './components/rules/Rules'
import { RedirectionRule, RuleHeader } from './model';

export interface RuleState {
  rules: RedirectionRule[];
  filter: string;
}

const getNewID = (rules: RedirectionRule[]): number => {
  let max = 0;
  rules.forEach(rule => {
    if (rule && rule.id && rule.id > max) {
      max = rule.id;
    }
  });
  return max + 1;
};

export interface Action {
  type: 'add' | 'remove' | 'updateUrlFrom' | 'updateName' | 'updateUrlTo' | 'updateHeaders' | 'newHeader'
    | 'removeHeader' | 'updateRuleActive' | 'updateAllActive' | 'updateFilter';
  ruleName: string;
  id: number;
  ruleUrl: string;
  urlTo: string;
  headers: {
    headerName: string,
    headerValue: string
  };
  headerIdx: number;
  active: boolean;
  filter: string;
}

export const updateActiveAllAction = (enabled: boolean): Partial<Action> => {
  return {
    type: 'updateAllActive',
    active: enabled
  }
}

export const updateRuleActive = (id: number, active: boolean): Partial<Action> => {
  return {
    type: 'updateRuleActive',
    active,
    id
  }
}

export const updateHeaderAction = (headerName: string, headerValue: string, id: number, headerIdx: number):
    Partial<Action> => ({
  type: 'updateHeaders',
  headers: {
    headerName,
    headerValue
  },
  id,
  headerIdx
});

export const removeHeaderAction = (ruleId: number, headerIdx: number): Partial<Action> => {
  return {
    type: 'removeHeader',
    id: ruleId,
    headerIdx
  }
}

export const newHeaderAction = (id: number): Partial<Action> => {
  return {
    type: 'newHeader',
    id
  };
};

export const removeAction = (id: number): Partial<Action> => {
  return {
    type: 'remove',
    id
  }
}

export const addRuleAction = (name: string): Partial<Action> => {
  return {
    type: 'add',
    ruleName: name
  }
}

export const updateURLAction = (url: string, id: number): Partial<Action> => {
  return {
    type: 'updateUrlFrom',
    id,
    ruleUrl: url
  }
}

export const updateNameAction = (name: string, id: number): Partial<Action> => {
  return {
    type: 'updateName',
    id,
    ruleName: name
  }
}

export const updateUrlToAction = (urlTo: string, id: number): Partial<Action> => {
  return {
    type: 'updateUrlTo',
    id,
    urlTo: urlTo
  }
}

export const updateFilter = (filter: string): Partial<Action> => {
  return {
    type: 'updateFilter',
    filter
  }
}

const initialRules = localStorage.getItem('RULES');

const RuleContext = React.createContext<{ state: RuleState, dispatch: React.Dispatch<Partial<Action>> }>({
  state: {
    rules: initialRules ? JSON.parse(initialRules) : [],
    filter: ''
  },
  dispatch: () => {}
});

const ruleReducer = (state: RuleState, action: Partial<Action>) => {
  const rules = state.rules;
  let filter = state.filter ?? '';
  switch (action.type) {
    case 'add': {
      const newRules = [...state.rules, { name: action.ruleName, id: getNewID(state.rules) } as RedirectionRule]
      localStorage.setItem('RULES', JSON.stringify(newRules))
      return {
        rules: newRules,
        filter
      };
    }
    case 'remove': {
      const newRules = state.rules.filter(rule => {
        return rule.id !== action.id
      });
      let start = 1;
      newRules.forEach(rule => {
        rule.id = start++;
      });
      localStorage.setItem('RULES', JSON.stringify(newRules))
      return {
        rules: newRules,
        filter
      };
    }
    case 'updateUrlFrom': {
      const idx = rules.findIndex(rule => rule.id === action.id);
      rules[idx].urlFrom = action.ruleUrl ?? ''
      break;
    }
    case 'updateName': {
      const idx = rules.findIndex(rule => rule.id === action.id);
      rules[idx].name = action.ruleName ?? ''
      break;
    }
    case 'updateUrlTo': {
      const rules = state.rules;
      // @ts-ignore
      rules.find(rule => rule.id === action.id).urlTo = action.urlTo ?? '';
      break;
    }
    case 'updateHeaders': {
      // @ts-ignore
      rules.find(r => r.id === action.id).headersToReplace[action.headerIdx] = action.headers as RuleHeader;
      break;
    }
    case 'newHeader': {
      // @ts-ignore
      rules.find(rule => rule.id === action.id).headersToReplace?.push({
        headerName: 'Authorization',
        headerValue: ''
      });
      break;
    }
    case 'removeHeader': {
      const rule = rules.find(r => r.id === action.id);
      // @ts-ignore
      rule.headersToReplace = rule.headersToReplace
        .filter((_: any, idx: number) => idx !== action.headerIdx);
      break;
    }
    case 'updateRuleActive': {
      // @ts-ignore
      rules.find(r => r.id === action.id).active = action.active;
      break;
    }
    case 'updateAllActive': {
      rules.forEach(rule => {
        rule.active = action.active ?? false;
      });
      break;
    }
    case 'updateFilter': {
      filter = action.filter ?? '';
      break;
    }
    default:
      return {
        rules: [],
        filter
      };
  }
  localStorage.setItem('RULES', JSON.stringify(rules));
  return {
    rules,
    filter
  };
}

const RuleProvider = ({ children }: { children: React.ReactElement[] | React.ReactElement }) => {
  const originalState = useRules();
  const [state, dispatch] = React.useReducer(ruleReducer, originalState.state)

  state.rules.forEach((rule) => {
    if (!rule.headersToReplace) {
      rule.headersToReplace = [];
    }
  });

  const value = {
    state,
    dispatch
  };
  return <RuleContext.Provider value={value}>{children}</RuleContext.Provider>;
}

export const useRules = () => {
  const ctx = React.useContext(RuleContext)
  if (ctx === undefined) {
    throw new Error('useRules must be used within a CountProvider');
  }
  return ctx;
}

function App() {
  return (
    <RuleProvider>
      <div className="App" style={{position: 'relative'}}>
        <Header />
        <Rules />
      </div>
    </RuleProvider>
  )
}

export default App
