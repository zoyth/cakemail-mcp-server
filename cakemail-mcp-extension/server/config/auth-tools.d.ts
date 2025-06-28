export declare const authTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            force?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            force: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: never[];
    };
})[];
//# sourceMappingURL=auth-tools.d.ts.map