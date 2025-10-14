// Main exports for the Gofakeit Plugin

// autofill functions
export {
  Autofill,
  AutofillStatus,
  type AutofillSettings,
  type AutofillState,
  type AutofillElement,
  type AutofillResult,
  type AutofillResults,
} from './autofill'

// API functions
export {
  fetchFunc,
  fetchFuncSearch,
  fetchFuncMulti,
  type FetchFuncParams,
  type FetchFuncResponse,
  type FetchFuncMultiRequest,
  type FetchFuncMultiResponse,
  type FetchFuncMultiResponseItem,
  type FetchFuncSearchRequest,
  type FetchFuncSearchResponse,
  type FetchFuncSearchResponseItem,
  type FetchFuncSearchResult,
} from './api'
