export declare const senderTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            name?: never;
            email?: never;
            language?: never;
            sender_id?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                description: string;
            };
            sender_id?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sender_id: {
                type: string;
                description: string;
            };
            name?: never;
            email?: never;
            language?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sender_id: {
                type: string;
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
})[];
//# sourceMappingURL=sender-tools.d.ts.map