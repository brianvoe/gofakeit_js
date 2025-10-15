export interface FetchFuncParams {
    [key: string]: string | number | boolean | string[];
}
export interface FetchFuncResponse {
    result?: string;
    error?: string;
}
export interface FetchFuncMultiRequest {
    id?: string;
    func: string;
    params?: FetchFuncParams;
}
export interface FetchFuncMultiResponseItem {
    id?: string;
    value: string | number | boolean | null;
    error?: string;
}
export interface FetchFuncMultiResponse {
    results?: FetchFuncMultiResponseItem[];
    error?: string;
}
export interface FetchFuncSearchRequest {
    id: string;
    queries: string[];
}
export interface FetchFuncSearchResult {
    name: string;
    score: number;
    reasons: string[];
}
export interface FetchFuncSearchResponseItem {
    id: string;
    results: FetchFuncSearchResult[];
}
export interface FetchFuncSearchResponse {
    results?: FetchFuncSearchResponseItem | FetchFuncSearchResponseItem[];
    error?: string;
}
export declare function fetchFunc(func: string, params?: FetchFuncParams): Promise<FetchFuncResponse>;
export declare function fetchFuncMulti(requests: FetchFuncMultiRequest[]): Promise<FetchFuncMultiResponse>;
export declare function fetchFuncSearch(requests: FetchFuncSearchRequest | FetchFuncSearchRequest[]): Promise<FetchFuncSearchResponse>;
export declare function parseFunctionString(func: string): {
    func: string;
    params: FetchFuncParams;
};
//# sourceMappingURL=api.d.ts.map