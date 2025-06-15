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

    const emailData = {
      to_email: data.to_email,
      to_name: data.to_name,
      sender_id: parseInt(String(data.sender_id)),
      subject: data.subject,
      html_content: data.html_content,
      text_content: data.text_content,
      template_id: data.template_id,
    };

    // Remove undefined fields
    Object.keys(emailData).forEach(key => {
      if ((emailData as any)[key] === undefined) {
        delete (emailData as any)[key];
      }
    });

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/transactional/send${query}`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }
}
