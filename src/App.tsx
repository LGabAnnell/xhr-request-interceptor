import React from 'react'
import './App.css'
import { Header } from './components/header/Header'
import { Rules } from './components/rules/Rules'
import { RedirectionRule } from './model';

export interface RuleState {
  rules: RedirectionRule[];
}

export interface Action {
  type: 'add' | 'remove' | 'updateUrlFrom' | 'updateName' | 'updateUrlTo' | 'updateHeaders' | 'newHeader'
    | 'removeHeader' | 'updateRuleActive';
  idx?: number;
  ruleName?: string;
  ruleUrl?: string;
  urlTo?: string;
  headers?: {
    headerName: string,
    headerValue: string
  };
  headerIdx?: number;
  active?: boolean;
}

export const updateRuleActive = (idx: number, active: boolean): Action => {
  return {
    type: 'updateRuleActive',
    active,
    idx
  }
}

export const updateHeaderAction: (headerName: string, headerValue: string, idx: number, headerIdx: number) => Action =
  (headerName, headerValue, idx, headerIdx) => ({
    type: 'updateHeaders',
    headers: {
      headerName,
      headerValue
    },
    idx,
    headerIdx
  });

export const removeHeaderAction: (ruleIdx: number, headerIdx: number) => Action = (ruleIdx, headerIdx) => {
  return {
    type: 'removeHeader',
    idx: ruleIdx,
    headerIdx
  }
}

export const newHeaderAction = (idx: number) => {
  return {
    type: 'newHeader',
    idx
  } as Action;
};

export const removeAction: (idx: number) => Action = (idx) => {
  return {
    type: 'remove',
    idx
  }
}

export const addAction: (name: string) => Action = name => {
  return {
    type: 'add',
    ruleName: name
  }
}

export const updateURLAction: (url: string, idx: number) => Action = (url, idx) => {
  return {
    type: 'updateUrlFrom',
    idx,
    ruleUrl: url
  }
}

export const updateNameAction: (name: string, idx: number) => Action = (name, idx) => {
  return {
    type: 'updateName',
    idx,
    ruleName: name
  }
}

export const updateUrlToAction: (urlTo: string, idx: number) => Action = (urlTo, idx) => {
  return {
    type: 'updateUrlTo',
    idx,
    urlTo: urlTo
  }
}

const initialRules = localStorage.getItem('RULES')

const RuleContext = React.createContext<{ state: RuleState, dispatch?: (action: Action) => void }>({
  state: {
    rules: initialRules ? JSON.parse(initialRules) : []
  }
})

const ruleReducer = (state: RuleState, action: Action) => {
  switch (action.type) {
    case 'add': {
      const newRules = [...state.rules, { name: action.ruleName }]
      localStorage.setItem('RULES', JSON.stringify(newRules))
      return {
        rules: newRules
      }
    }
    case 'remove': {
      const newRules = state.rules.filter((_, idx) => idx !== action.idx)
      localStorage.setItem('RULES', JSON.stringify(newRules))
      return {
        rules: newRules
      }
    }
    case 'updateUrlFrom': {
      const rules = state.rules
      const idx = rules.findIndex((_, idx) => idx === action.idx)
      rules[idx].urlFrom = action.ruleUrl ?? ''
      localStorage.setItem('RULES', JSON.stringify(rules))
      return {
        rules
      }
    }
    case 'updateName': {
      const rules = state.rules
      const idx = rules.findIndex((_, idx) => idx === action.idx)
      rules[idx].name = action.ruleName ?? ''
      localStorage.setItem('RULES', JSON.stringify(rules))
      return {
        rules
      }
    }
    case 'updateUrlTo': {
      const rules = state.rules
      rules[action.idx as number].urlTo = action.urlTo ?? ''
      localStorage.setItem('RULES', JSON.stringify(rules))
      return {
        rules
      }
    }
    case 'updateHeaders': {
      const rules = state.rules;
      // @ts-ignore
      rules[action.idx].headersToReplace[action.headerIdx] = action.headers as {
        headerName: string,
        headerValue: string
      };
      localStorage.setItem('RULES', JSON.stringify(rules));
      return {
        rules
      };
    }
    case 'newHeader': {
      const rules = state.rules;
      rules[action.idx as number].headersToReplace?.push({
        headerName: 'Authorization',
        headerValue: ''
      });
      localStorage.setItem('RULES', JSON.stringify(rules));
      return {
        rules
      };
    }
    case 'removeHeader': {
      const rules = state.rules;
      //@ts-ignore
      rules[action.idx].headersToReplace = rules[action.idx].headersToReplace
        .filter((_: any, idx: number) => idx !== action.headerIdx);
      localStorage.setItem('RULES', JSON.stringify(rules));
      return {
        rules
      };
    }
    case 'updateRuleActive': {
      const rules = state.rules;
      // @ts-ignore
      rules[action.idx].active = action.active;
      localStorage.setItem('RULES', JSON.stringify(rules));
      return {
        rules
      };
    }
    default:
      return {
        rules: []
      }
  }
}

const RuleProvider = ({ children }: { children: React.ReactElement[] | React.ReactElement }) => {
  const rules = useRules()
  const [state, dispatch] = React.useReducer(ruleReducer, rules.state)

  state.rules.forEach(rule => {
    if (!rule.headersToReplace) {
      rule.headersToReplace = [];
    }
  })

  const value = {
    state: {
      rules: state.rules
    },
    dispatch
  }
  return <RuleContext.Provider value={value}>{children}</RuleContext.Provider>
}

export const useRules = () => {
  const ctx = React.useContext(RuleContext)
  if (ctx === undefined) {
    throw new Error('useRules must be used within a CountProvider')
  }
  return ctx
}

function App() {
  return (
    <div className="App">
      <RuleProvider>
        <Header/>
        <Rules/>
      </RuleProvider>
    </div>
  )
}

export default App
