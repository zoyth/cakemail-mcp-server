import { HTTPBadRequestError, HTTPValidationError, ValidationErrorDetail, EmailAPIErrorDetails } from './cakemail-types.js';
import type { Response } from 'node-fetch';
export declare class CakemailError extends Error {
    readonly statusCode: number;
    readonly response?: any;
    constructor(message: string, statusCode: number, response?: any);
}
export declare class CakemailAuthenticationError extends CakemailError {
    constructor(message: string, response?: any);
}
export declare class CakemailBadRequestError extends CakemailError {
    readonly detail: string;
    constructor(errorResponse: HTTPBadRequestError);
}
export declare class CakemailValidationError extends CakemailError {
    readonly validationErrors: ValidationErrorDetail[];
    constructor(errorResponse: HTTPValidationError);
    private static formatValidationErrors;
    getFieldErrors(fieldName: string): ValidationErrorDetail[];
}
export declare class CakemailForbiddenError extends CakemailError {
    constructor(message?: string, response?: any);
}
export declare class CakemailNotFoundError extends CakemailError {
    constructor(message?: string, response?: any);
}
export declare class CakemailConflictError extends CakemailError {
    constructor(message?: string, response?: any);
}
export declare class CakemailRateLimitError extends CakemailError {
    readonly retryAfter: number | undefined;
    constructor(message?: string, retryAfter?: number, response?: any);
}
export declare class CakemailServerError extends CakemailError {
    constructor(message?: string, statusCode?: number, response?: any);
}
export declare class CakemailNetworkError extends CakemailError {
    constructor(message?: string, originalError?: Error);
}
/**
 * Email API specific error class
 * Extends the base CakemailError with email-specific context
 */
export declare class EmailAPIError extends CakemailError {
    readonly emailId: string | undefined;
    readonly errorCode: string | undefined;
    readonly errorDetails: EmailAPIErrorDetails[] | undefined;
    constructor(message: string, statusCode?: number, emailId?: string, errorCode?: string, errorDetails?: EmailAPIErrorDetails[]);
    /**
     * Create an EmailAPIError from HTTP validation errors
     */
    static fromValidationError(validationError: any, statusCode?: number): EmailAPIError;
    /**
     * Create an EmailAPIError for invalid email format
     */
    static forInvalidEmail(email: string): EmailAPIError;
    /**
     * Create an EmailAPIError for missing content
     */
    static forMissingContent(): EmailAPIError;
    /**
     * Get a user-friendly error message
     */
    getUserFriendlyMessage(): string;
    /**
     * Get all error details formatted for display
     */
    getFormattedDetails(): string;
}
export declare function createCakemailError(response: Response, errorBody: any): CakemailError;
//# sourceMappingURL=errors.d.ts.map