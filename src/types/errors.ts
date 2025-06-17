// Custom error classes for Cakemail API

import { HTTPBadRequestError, HTTPValidationError, ValidationErrorDetail, EmailAPIErrorDetails } from './cakemail-types.js';
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

/**
 * Email API specific error class
 * Extends the base CakemailError with email-specific context
 */
export class EmailAPIError extends CakemailError {
  public readonly emailId: string | undefined;
  public readonly errorCode: string | undefined;
  public readonly errorDetails: EmailAPIErrorDetails[] | undefined;

  constructor(
    message: string, 
    statusCode: number = 500, 
    emailId?: string,
    errorCode?: string,
    errorDetails?: EmailAPIErrorDetails[]
  ) {
    super(message, statusCode);
    this.name = 'EmailAPIError';
    this.emailId = emailId;
    this.errorCode = errorCode;
    this.errorDetails = errorDetails;
  }

  /**
   * Create an EmailAPIError from HTTP validation errors
   */
  static fromValidationError(validationError: any, statusCode: number = 422): EmailAPIError {
    const details: EmailAPIErrorDetails[] = [];
    let mainMessage = 'Validation failed';

    if (validationError.detail && Array.isArray(validationError.detail)) {
      validationError.detail.forEach((err: any) => {
        const field = Array.isArray(err.loc) ? err.loc.join('.') : 'unknown';
        details.push({
          code: err.type || 'validation_error',
          message: err.msg || 'Validation failed',
          field,
          value: err.input,
          suggestion: generateFieldSuggestion(field, err.type)
        });
      });

      mainMessage = `Validation failed for fields: ${details.map(d => d.field).join(', ')}`;
    }

    return new EmailAPIError(
      mainMessage,
      statusCode,
      undefined,
      'VALIDATION_ERROR',
      details
    );
  }

  /**
   * Create an EmailAPIError for invalid email format
   */
  static forInvalidEmail(email: string): EmailAPIError {
    return new EmailAPIError(
      `Invalid email format: ${email}`,
      400,
      undefined,
      'INVALID_EMAIL',
      [{
        code: 'INVALID_EMAIL',
        message: 'Email address format is invalid',
        field: 'to_email',
        value: email,
        suggestion: 'Ensure email follows RFC 5322 format (e.g., user@domain.com)'
      }]
    );
  }

  /**
   * Create an EmailAPIError for missing content
   */
  static forMissingContent(): EmailAPIError {
    return new EmailAPIError(
      'Email content is required',
      400,
      undefined,
      'MISSING_CONTENT',
      [{
        code: 'MISSING_CONTENT',
        message: 'Either html_content, text_content, or template_id must be provided',
        field: 'content',
        suggestion: 'Provide html_content, text_content, or specify a template_id'
      }]
    );
  }

  /**
   * Get a user-friendly error message
   */
  getUserFriendlyMessage(): string {
    if (this.errorDetails && this.errorDetails.length > 0) {
      const primaryError = this.errorDetails[0];
      return `${primaryError.message}${primaryError.suggestion ? `. ${primaryError.suggestion}` : ''}`;
    }
    return this.message;
  }

  /**
   * Get all error details formatted for display
   */
  getFormattedDetails(): string {
    if (!this.errorDetails || this.errorDetails.length === 0) {
      return this.message;
    }

    return this.errorDetails.map((detail, index) => {
      const parts = [`${index + 1}. ${detail.message}`];
      if (detail.field) parts.push(`Field: ${detail.field}`);
      if (detail.value !== undefined) parts.push(`Value: ${detail.value}`);
      if (detail.suggestion) parts.push(`Suggestion: ${detail.suggestion}`);
      return parts.join('\n   ');
    }).join('\n\n');
  }
}

// Helper functions
function generateFieldSuggestion(field: string, errorType?: string): string {
  const suggestions: Record<string, string> = {
    'to': 'Provide a valid email address in format: user@domain.com',
    'to_email': 'Provide a valid email address in format: user@domain.com',
    'sender_id': 'Use a verified sender ID from your account',
    'subject': 'Subject cannot be empty and should be descriptive',
    'html_content': 'Provide valid HTML content for the email body',
    'text_content': 'Provide plain text content for the email body',
    'template_id': 'Use a valid template ID from your account',
    'tags': 'Tags should be an array of strings',
    'metadata': 'Metadata should be a valid JSON object'
  };

  const typeSuggestions: Record<string, string> = {
    'string_type': 'Value must be a string',
    'missing': 'This field is required',
    'value_error': 'Value format is invalid',
    'type_error': 'Incorrect data type provided'
  };

  return suggestions[field] || typeSuggestions[errorType || ''] || 'Check the field value and format';
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
