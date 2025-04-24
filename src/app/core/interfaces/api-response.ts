export interface IApiResponse<T> {
  success: boolean;
  result?: T;
  error?: { code: number };
  errors?: INestedErrors;
}

interface INestedErrors {
  [key: string]: string | INestedErrors;
}
