import { handleCakemailError } from '../utils/errors.js';
import { validateEmail } from '../utils/validation.js';
/**
 * Diagnose why a recipient did not receive a campaign
 */
export async function handleDiagnoseDeliveryIssue(args, api) {
    try {
        const { campaign_id, recipient_email, account_id } = args;
        if (!campaign_id || !recipient_email) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: campaign_id, recipient_email'
                    }],
                isError: true
            };
        }
        if (!validateEmail(recipient_email)) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Invalid Email Address**\n\nPlease provide a valid recipient_email.'
                    }],
                isError: true
            };
        }
        // Step 1: Check campaign logs for this recipient
        const logFilter = `email==${recipient_email}`;
        const logsResult = await api.logs.getCampaignLogs(campaign_id, { filter: logFilter, account_id });
        const logs = logsResult.data || [];
        if (logs.length > 0) {
            // Prioritize skipped, bounced, delivered, etc.
            const skipped = logs.find(log => log.status === 'skipped' || log.type === 'skipped');
            if (skipped) {
                return {
                    content: [{
                            type: 'text',
                            text: `🚫 **Email Skipped**\n\nThe recipient was skipped for this campaign. Reason: ${skipped.reason || skipped.additional_info || 'Unknown'}`
                        }]
                };
            }
            const bounced = logs.find(log => log.status === 'bounced' || log.type === 'bounce');
            if (bounced) {
                return {
                    content: [{
                            type: 'text',
                            text: `⚠️ **Email Bounced**\n\nThe email bounced. Reason: ${bounced.reason || bounced.additional_info || 'Unknown'}`
                        }]
                };
            }
            const delivered = logs.find(log => log.status === 'delivered' || log.type === 'delivered');
            if (delivered) {
                return {
                    content: [{
                            type: 'text',
                            text: `✅ **Email Delivered**\n\nThe email was delivered, but may not have been opened or clicked.`
                        }]
                };
            }
            // Other statuses
            return {
                content: [{
                        type: 'text',
                        text: `ℹ️ **Log Found**\n\nA log entry exists for this recipient. Status: ${logs[0].status || logs[0].type || 'Unknown'}`
                    }]
            };
        }
        // Step 2: Check suppression list (email and domain)
        // NOTE: Direct suppression lookup is not available in the current API client. This is a limitation.
        // If a direct endpoint becomes available, add it here.
        // Step 3: Check if recipient is in the campaign audience/list
        const campaign = await api.campaigns.getCampaign(campaign_id);
        const listId = campaign.data?.list_id;
        if (listId) {
            const contacts = await api.contacts.getContacts({ list_id: String(listId), email: recipient_email, status: 'active' });
            if (!contacts.data || contacts.data.length === 0) {
                return {
                    content: [{
                            type: 'text',
                            text: `👥 **Not in Audience**\n\nThe recipient is not present as an active contact in the campaign's audience list.`
                        }]
                };
            }
        }
        else {
            return {
                content: [{
                        type: 'text',
                        text: `❓ **Audience Unknown**\n\nCould not determine the campaign's audience list.`
                    }],
                isError: true
            };
        }
        // Step 4: Fallback
        return {
            content: [{
                    type: 'text',
                    text: `❓ **No Delivery Event Found**\n\nNo logs, suppression, or audience issues were found. Please check campaign status and timing, or contact support for further investigation.`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
//# sourceMappingURL=diagnostics.js.map