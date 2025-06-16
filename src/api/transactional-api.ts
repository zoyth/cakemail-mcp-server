// Transactional Email API operations

import { BaseApiClient } from './base-client.js';
import { 
  TransactionalEmailData,
  TransactionalEmailResponse
} from '../types/cakemail-types.js';

export class TransactionalApi extends BaseApiClient {

  async sendTransactionalEmail(data: TransactionalEmailData): Promise<TransactionalEmailResponse> {
    if (!this.isValidEmail(data.to_email)) {
      throw new Error('Invalid recipient email format');
    }

    // Structure the email data according to Cakemail API specification
    // Based on official docs at https://cakemail.dev/reference/sendemail
    const emailData: any = {
      email: data.to_email,
      sender: {
        id: parseInt(String(data.sender_id))
      },
      content: {
        subject: data.subject,
        encoding: 'utf-8'
      }
    };

    // Add recipient name if provided
    if (data.to_name) {
      emailData.name = data.to_name;
    }

    // Add HTML content if provided
    if (data.html_content) {
      emailData.content.html = data.html_content;
    }

    // Add text content if provided
    if (data.text_content) {
      emailData.content.text = data.text_content;
    }

    // Add template if provided
    if (data.template_id) {
      emailData.content.template = {
        id: parseInt(String(data.template_id))
      };
    }

    // Account ID is typically not needed for /emails endpoint, but include if specified
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/emails${query}`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }
}
