export interface RedirectionRule {
  name?: string;
  urlFrom?: string;
  urlTo?: string;
  headersToReplace?: RuleHeader[];
  active?: boolean;
  id?: number;
}

export interface RuleHeader {
  headerName?: string,
  headerValue?: string
}

export interface RuleMessage {
  rules: RedirectionRule[];
}