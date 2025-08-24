declare interface ApiResponse {
    success: boolean;
    data?: string;
    error?: string;
    status?: number;
}

export declare function autofill(target?: HTMLElement | Element): Promise<boolean | void>;

export declare function callFunc(func: string): Promise<ApiResponse>;

export declare interface Func {
    value: string;
    display: string;
    category: string;
}

export declare function getFuncs(): Func[];

export declare function hasFunc(name: string): boolean;

export { }
