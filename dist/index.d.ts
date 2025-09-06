declare interface ApiResponse {
    success: boolean;
    data?: string;
    error?: string;
    status?: number;
}

export declare class Autofill {
    settings: AutofillSettings;
    state: AutofillState;
    constructor(settings?: AutofillSettings);
    private updateStatus;
    autofill(target?: HTMLElement | Element | string): Promise<boolean | void>;
    getElements(target?: HTMLElement | Element | string): GetElementsResult;
    resetState(): void;
    private queryFormElements;
    private getUniqueElements;
    private initializeInputs;
    private determineFunctions;
    private getValues;
    private isLocalGenerationFunction;
    private generateLocalValue;
    private applyValues;
    private applyValueToElement;
    handleError(element: Element, error: string, functionName?: string): void;
    private getAssociatedLabelText;
    private needsSearchApi;
    getDefaultFunctionForInputType(inputType: string): string;
    private getTypeSpecificFallback;
    private createSearchQuery;
    private findFormContainer;
    private showNotification;
    private showDetailedResults;
    private getElementInfo;
    private getInputTypeFunction;
    private getDateTimeFunction;
    private setDateTimeValue;
    private getTextFunction;
    private setTextValue;
    private setTextareaValue;
    private getNumberFunction;
    private setNumberValue;
    private setRangeValue;
    private getCheckboxFunction;
    private setCheckboxValue;
    private getRadioFunction;
    private setRadioValue;
    private getSelectFunction;
    private setSelectValue;
    private generateTime;
    private generateMonth;
    private generateWeek;
    private generateDate;
    private generateDateTime;
}

export declare interface AutofillElement {
    element: Element;
    type: string;
    function: string;
    value: string;
    error: string;
}

export declare interface AutofillSettings {
    mode?: 'auto' | 'manual';
    staggered?: boolean;
    staggerDelay?: number;
    onStatusChange?: (status: string, state: AutofillState) => void;
}

export declare interface AutofillState {
    status: string;
    inputs: AutofillElement[];
}

export declare function callFunc(func: string): Promise<ApiResponse>;

export declare interface GetElementsResult {
    elements: Element[];
    error?: string;
}

export { }
