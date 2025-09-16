export declare class Autofill {
    settings: AutofillSettings;
    state: AutofillState;
    constructor(settings?: AutofillSettings);
    updateSettings(settings: AutofillSettings): void;
    fill(target?: HTMLElement | Element | string): Promise<AutofillResults>;
    setElements(target?: HTMLElement | Element | string): void;
    shouldSkipElement(element: Element): boolean;
    private getElementType;
    getElementSearch(el: Element): string;
    setElementFunctions(): Promise<void>;
    getElementFunction(element: Element): string | null;
    private elementTypeNeedsSearch;
    private getElementFunctionFallback;
    getElementValues(): Promise<void>;
    setElementValues(): Promise<void>;
    private setRadioGroup;
    private setElementValue;
    private setGeneralValue;
    private setCheckboxValue;
    private setRadioValue;
    private setSelectValue;
    private showBadge;
    private getScrollableParents;
    private removeBadge;
    private paramsSelect;
    private paramsRadio;
    private convertDateToWeek;
    private convertWeekToDate;
    private paramsDate;
    private paramsWeek;
    private paramsNumber;
    private debug;
    resetState(): void;
    private updateStatus;
    private results;
}

export declare interface AutofillElement {
    id: string;
    name: string;
    element: Element;
    type: string;
    function: string;
    search: string;
    value: string;
    error: string;
}

export declare interface AutofillResult {
    elements: AutofillElement[];
    error?: string;
}

export declare interface AutofillResults {
    success: number;
    failed: number;
    elements: AutofillElement[];
}

export declare interface AutofillSettings {
    mode?: 'auto' | 'manual';
    stagger?: number;
    badges?: number;
    debug?: boolean;
    onStatusChange?: (status: AutofillStatus, elements: AutofillElement[]) => void;
}

export declare interface AutofillState {
    status?: AutofillStatus;
    elements: AutofillElement[];
}

export declare enum AutofillStatus {
    STARTING = "starting",
    FOUND = "found",
    DETERMINED = "determined",
    GENERATED = "generated",
    SET = "set",
    COMPLETED = "completed",
    ERROR = "error"
}

export declare function fetchFunc(func: string, params?: FetchFuncParams): Promise<FetchFuncResponse>;

export declare function fetchFuncMulti(requests: FetchFuncMultiRequest[]): Promise<FetchFuncMultiResponse>;

export declare interface FetchFuncMultiRequest {
    id?: string;
    func: string;
    params?: FetchFuncParams;
}

export declare interface FetchFuncMultiResponse {
    success: boolean;
    data?: FetchFuncMultiResponseItem[];
    error?: string;
    status?: number;
}

export declare interface FetchFuncMultiResponseItem {
    id?: string;
    value: string | number | boolean | null;
    error?: string;
}

export declare interface FetchFuncParams {
    [key: string]: string | number | boolean | string[];
}

export declare interface FetchFuncResponse {
    success: boolean;
    data?: string;
    error?: string;
    status?: number;
}

export declare function fetchFuncSearch(requests: FetchFuncSearchRequest[]): Promise<FetchFuncSearchResponse>;

export declare interface FetchFuncSearchRequest {
    id: string;
    query: string;
}

export declare interface FetchFuncSearchResponse {
    success: boolean;
    data?: FetchFuncSearchResponseItem[];
    error?: string;
    status?: number;
}

export declare interface FetchFuncSearchResponseItem {
    id: string;
    query: string;
    results: FetchFuncSearchResult[];
}

export declare interface FetchFuncSearchResult {
    name: string;
    score: number;
    reasons: string[];
}

export declare function parseFunctionString(func: string): {
    func: string;
    params: FetchFuncParams;
};

export { }
