// Main Cakemail API client that composes all sub-APIs

import { CakemailConfig } from './types/cakemail-types.js';
import { BaseApiClient, EnhancedCakemailConfig } from './api/base-client.js';
import { CampaignApi } from './api/campaign-api.js';
import { ContactApi } from './api/contact-api.js';
import { SenderApi } from './api/sender-api.js';
import { TemplateApi } from './api/template-api.js';
import { EmailApi } from './api/email-api.js';
import { AnalyticsApi } from './api/analytics-api.js';
import { AutomationApi } from './api/automation-api.js';
import { AccountApi } from './api/account-api.js';

export class CakemailAPI extends BaseApiClient {
  public campaigns: CampaignApi;
  public contacts: ContactApi;
  public senders: SenderApi;
  public templates: TemplateApi;
  public email: EmailApi;
  public analytics: AnalyticsApi;
  public automations: AutomationApi;
  public account: AccountApi;

  // Legacy property for backward compatibility
  public get transactional(): EmailApi {
    return this.email;
  }

  constructor(config: CakemailConfig | EnhancedCakemailConfig) {
    super(config);
    
    // Initialize all sub-APIs with the same config
    this.campaigns = new CampaignApi(config);
    this.contacts = new ContactApi(config);
    this.senders = new SenderApi(config);
    this.templates = new TemplateApi(config);
    this.email = new EmailApi(config);
    this.analytics = new AnalyticsApi(config);
    this.automations = new AutomationApi(config);
    this.account = new AccountApi(config);
  }

  // Legacy method proxies for backward compatibility
  
  // Campaign methods
  async getCampaigns(params?: any) {
    return this.campaigns.getCampaigns(params);
  }

  async getLatestCampaign(status?: string) {
    return this.campaigns.getLatestCampaign(status);
  }

  async getCampaignsWithDefaults(params?: any) {
    return this.campaigns.getCampaignsWithDefaults(params);
  }

  async getCampaign(id: string) {
    return this.campaigns.getCampaign(id);
  }

  async createCampaign(data: any) {
    return this.campaigns.createCampaign(data);
  }

  async updateCampaign(id: string, data: any) {
    return this.campaigns.updateCampaign(id, data);
  }

  async sendCampaign(id: string) {
    return this.campaigns.sendCampaign(id);
  }

  async deleteCampaign(id: string) {
    return this.campaigns.deleteCampaign(id);
  }

  async debugCampaignAccess(campaignId?: string) {
    return this.campaigns.debugCampaignAccess(campaignId);
  }

  // Contact methods
  async getContacts(params?: any) {
    return this.contacts.getContacts(params);
  }

  async createContact(data: any) {
    return this.contacts.createContact(data);
  }

  async getContact(contactId: string) {
    return this.contacts.getContact(contactId);
  }

  async updateContact(contactId: string, data: any) {
    return this.contacts.updateContact(contactId, data);
  }

  async deleteContact(contactId: string) {
    return this.contacts.deleteContact(contactId);
  }

  // List methods
  async getLists(params?: any) {
    return this.contacts.getLists(params);
  }

  async createList(data: any) {
    return this.contacts.createList(data);
  }

  async getList(listId: string) {
    return this.contacts.getList(listId);
  }

  async updateList(listId: string, data: any) {
    return this.contacts.updateList(listId, data);
  }

  async deleteList(listId: string) {
    return this.contacts.deleteList(listId);
  }

  // Sender methods
  async getSenders() {
    return this.senders.getSenders();
  }

  async createSender(data: any) {
    return this.senders.createSender(data);
  }

  async getSender(senderId: string) {
    return this.senders.getSender(senderId);
  }

  async updateSender(senderId: string, data: any) {
    return this.senders.updateSender(senderId, data);
  }

  async deleteSender(senderId: string) {
    return this.senders.deleteSender(senderId);
  }

  // Template methods
  async getTemplates(params?: any) {
    return this.templates.getTemplates(params);
  }

  async getTemplate(templateId: string) {
    return this.templates.getTemplate(templateId);
  }

  async createTemplate(data: any) {
    return this.templates.createTemplate(data);
  }

  async updateTemplate(templateId: string, data: any) {
    return this.templates.updateTemplate(templateId, data);
  }

  async deleteTemplate(templateId: string) {
    return this.templates.deleteTemplate(templateId);
  }

  // Email methods (updated naming)
  async sendEmail(data: any) {
    return this.email.sendEmail(data);
  }

  async sendTransactionalEmail(data: any) {
    return this.email.sendTransactionalEmail(data);
  }

  async sendMarketingEmail(data: any) {
    return this.email.sendMarketingEmail(data);
  }

  async getEmailStatus(emailId: string) {
    return this.email.getEmailStatus(emailId);
  }

  // Analytics methods
  async getCampaignAnalytics(campaignId: string) {
    return this.analytics.getCampaignAnalytics(campaignId);
  }

  async getTransactionalAnalytics(params?: any) {
    return this.analytics.getTransactionalAnalytics(params);
  }

  async getListAnalytics(listId: string) {
    return this.analytics.getListAnalytics(listId);
  }

  async getAccountAnalytics(params?: any) {
    return this.analytics.getAccountAnalytics(params);
  }

  // Automation methods
  async getAutomations(params?: any) {
    return this.automations.getAutomations(params);
  }

  async getAutomation(automationId: string) {
    return this.automations.getAutomation(automationId);
  }

  async createAutomation(data: any) {
    return this.automations.createAutomation(data);
  }

  async startAutomation(automationId: string) {
    return this.automations.startAutomation(automationId);
  }

  async stopAutomation(automationId: string) {
    return this.automations.stopAutomation(automationId);
  }

  // Account methods
  async getSelfAccount() {
    return this.account.getSelfAccount();
  }

  async patchSelfAccount(data: any) {
    return this.account.patchSelfAccount(data);
  }

  async convertSelfAccountToOrganization() {
    return this.account.convertSelfAccountToOrganization();
  }
}

// Export everything for convenience
export * from './types/cakemail-types.js';
export * from './types/errors.js';
export * from './types/retry.js';
export { BaseApiClient, EnhancedCakemailConfig } from './api/base-client.js';
export { CampaignApi } from './api/campaign-api.js';
export { ContactApi } from './api/contact-api.js';
export { SenderApi } from './api/sender-api.js';
export { TemplateApi } from './api/template-api.js';
export { EmailApi } from './api/email-api.js';
export { AnalyticsApi } from './api/analytics-api.js';
export { AutomationApi } from './api/automation-api.js';
export { AccountApi } from './api/account-api.js';

// Legacy export for backward compatibility
export { EmailApi as TransactionalApi } from './api/email-api.js';
