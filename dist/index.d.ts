declare interface ApiResponse {
    success: boolean;
    data?: string;
    error?: string;
    status?: number;
}

export declare function autofill(target?: HTMLElement | Element, settings?: AutofillSettings): Promise<boolean | void>;

declare interface AutofillSettings {
    smart?: boolean;
    staggered?: boolean;
    staggerDelay?: number;
}

export declare function callFunc(func: string): Promise<ApiResponse>;

export { }
