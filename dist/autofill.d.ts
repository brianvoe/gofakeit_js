export declare enum AutofillStatus {
    STARTING = "starting",
    FOUND = "found",
    DETERMINED = "determined",
    GENERATED = "generated",
    SET = "set",
    COMPLETED = "completed",
    ERROR = "error"
}
export interface AutofillSettings {
    mode?: 'auto' | 'manual';
    stagger?: number;
    badges?: number;
    debug?: boolean;
    onStatusChange?: (status: AutofillStatus, elements: AutofillElement[]) => void;
}
export interface AutofillState {
    status?: AutofillStatus;
    elements: AutofillElement[];
}
export interface AutofillElement {
    id: string;
    name: string;
    element: Element;
    type: string;
    function: string;
    params?: Record<string, any>;
    search: string[];
    pattern?: string;
    value: string;
    error: string;
}
export interface AutofillResult {
    elements: AutofillElement[];
    error?: string;
}
export interface AutofillResults {
    success: number;
    failed: number;
    elements: AutofillElement[];
}
export declare class Autofill {
    settings: AutofillSettings;
    state: AutofillState;
    constructor(settings?: AutofillSettings);
    updateSettings(settings: AutofillSettings): void;
    fill(target?: HTMLElement | Element | string, functionName?: string, params?: Record<string, any>): Promise<AutofillResults>;
    setElements(target?: HTMLElement | Element | string): void;
    shouldSkipElement(element: Element): boolean;
    private getElementType;
    private getElementPattern;
    getElementSearch(el: Element): string[];
    setElementFunctions(functionOverride?: string, params?: Record<string, any>): Promise<void>;
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
//# sourceMappingURL=autofill.d.ts.map