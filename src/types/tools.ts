import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export interface ToolHandler {
  (request: any, api: any): Promise<any>;
}

export interface HandlerRegistry {
  [toolName: string]: ToolHandler;
}

export type CallToolRequest = typeof CallToolRequestSchema._type;
