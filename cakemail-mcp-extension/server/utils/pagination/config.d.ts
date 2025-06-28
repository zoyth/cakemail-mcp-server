import { EndpointPaginationConfig } from './types.js';
export declare class PaginationConfigRegistry {
    private static configs;
    static getConfig(endpoint: string): EndpointPaginationConfig;
    static registerEndpoint(endpoint: string, config: EndpointPaginationConfig): void;
    static getAllConfigs(): Map<string, EndpointPaginationConfig>;
    static hasConfig(endpoint: string): boolean;
    static removeConfig(endpoint: string): boolean;
    static clear(): void;
}
//# sourceMappingURL=config.d.ts.map