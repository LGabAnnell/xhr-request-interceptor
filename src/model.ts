export interface RedirectionRule {
  name?: string;
  urlFrom?: string;
  urlTo?: string;
  headersToReplace?: {
    headerName?: string,
    headerValue?: string
  }[];
  active?: boolean;
}