import { DefaultDataServiceConfig } from "@ngrx/data";
import { environment } from '../../../environments/environment';

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
    root: environment.apiUrl,
    timeout: 3000, // request timeout
  }