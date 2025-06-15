// Custom error classes for Cakemail API

import { HTTPBadRequestError, HTTPValidationError, ValidationErrorDetail } from './cakemail-types.js';
import type { Response } from 'node-fetch';

export class CakemailError extends Error {
  public readonly statusCode: number;
  public readonly response?: any;

  constructor(message: string, statusCode: number, response?: any) {
    super(message);
    this.name = 'CakemailError';
    this.statusCode = statusCode;
    this.response = response;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CakemailError);
    }
  }
}

export class CakemailAuthenticationError extends CakemailError {
  constructor(message: string, response?: any) {
    super(message, 401, response);
    this.name = 'CakemailAuthenticationError';
  }
}

export class CakemailBadRequestError extends CakemailError {
  public readonly detail: string;

  constructor(errorResponse: HTTPBadRequestError) {
    super(`Bad Request: ${errorResponse.detail}`, 400, errorResponse);
    this.name = 'CakemailBadRequestError';
    this.detail = errorResponse.detail;
  }
}

export class CakemailValidationError extends CakemailError {
  public readonly validationErrors: ValidationErrorDetail[];

  constructor(errorResponse: HTTPValidationError) {
    const message = `Validation Error: ${CakemailValidationError.formatValidationErrors(errorResponse.detail)}`;
    super(message, 422, errorResponse);
    this.name = 'CakemailValidationError';
    this.validationErrors = errorResponse.detail;
  }

  private static formatValidationErrors(errors: ValidationErrorDetail[]): string {
    return errors.map(error => {
      const location = error.loc.join('.');
      return `${location}: ${error.msg}`;
    }).join('; ');
  }

  // Helper to get errors for a specific field
  public getFieldErrors(fieldName: string): ValidationErrorDetail[] {
    return this.validationErrors.filter(error => 
      error.loc.includes(fieldName)
    );
  }
}

export class CakemailForbiddenError extends CakemailError {
  constructor(message: string = 'Forbidden: Insufficient permissions', response?: any) {
    super(message, 403, response);
    this.name = 'CakemailForbiddenError';
  }
}

export class CakemailNotFoundError extends CakemailError {
  constructor(message: string = 'Resource not found', response?: any) {
    super(message, 404, response);
    this.name = 'CakemailNotFoundError';
  }
}

export class CakemailConflictError extends CakemailError {
  constructor(message: string = 'Conflict: Resource already exists or operation conflicts with current state', response?: any) {
    super(message, 409, response);
    this.name = 'CakemailConflictError';
  }
}

export class CakemailRateLimitError extends CakemailError {
  public readonly retryAfter: number | undefined;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, response?: any) {
    super(message, 429, response);
    this.name = 'CakemailRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class CakemailServerError extends CakemailError {
  constructor(message: string = 'Internal server error', statusCode: number = 500, response?: any) {
    super(message, statusCode, response);
    this.name = 'CakemailServerError';
  }
}

export class CakemailNetworkError extends CakemailError {
  constructor(message: string = 'Network error occurred', originalError?: Error) {
    super(message, 0, originalError);
    this.name = 'CakemailNetworkError';
  }
}

// Helper function to create appropriate error from response
export function createCakemailError(
  response: Response, 
  errorBody: any
): CakemailError {
  const status = response.status;
  const statusText = response.statusText;

  switch (status) {
    case 400:
      return new CakemailBadRequestError(errorBody as HTTPBadRequestError);
    
    case 401:
      return new CakemailAuthenticationError(
        `Authentication failed: ${errorBody?.detail || errorBody?.error_description || statusText}`,
        errorBody
      );
    
    case 403:
      return new CakemailForbiddenError(
        `Forbidden: ${errorBody?.detail || statusText}`,
        errorBody
      );
    
    case 404:
      return new CakemailNotFoundError(
        `Not found: ${errorBody?.detail || statusText}`,
        errorBody
      );
    
    case 409:
      return new CakemailConflictError(
        `Conflict: ${errorBody?.detail || statusText}`,
        errorBody
      );
    
    case 422:
      return new CakemailValidationError(errorBody as HTTPValidationError);
    
    case 429:
      const retryAfter = response.headers.get('Retry-After');
      return new CakemailRateLimitError(
        `Rate limit exceeded: ${errorBody?.detail || statusText}`,
        retryAfter ? parseInt(retryAfter) : undefined,
        errorBody
      );
    
    case 500:
    case 502:
    case 503:
    case 504:
      return new CakemailServerError(
        `Server error (${status}): ${errorBody?.detail || statusText}`,
        status,
        errorBody
      );
    
    default:
      return new CakemailError(
        `HTTP ${status}: ${errorBody?.detail || statusText}`,
        status,
        errorBody
      );
  }
}
