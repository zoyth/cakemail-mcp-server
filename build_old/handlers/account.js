import { handleCakemailError } from '../utils/errors.js';
export async function handleGetSelfAccount(_args, api) {
    try {
        const account = await api.account.getSelfAccount();
        return {
            content: [
                {
                    type: 'text',
                    text: `Account details: ${JSON.stringify(account, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleGetRetryConfig(_args, api) {
    try {
        const config = api.getRetryConfig();
        return {
            content: [
                {
                    type: 'text',
                    text: `🔄 **Current Retry Configuration**\n\n` +
                        `• Max Retries: ${config.maxRetries}\n` +
                        `• Base Delay: ${config.baseDelay}ms\n` +
                        `• Max Delay: ${config.maxDelay}ms\n` +
                        `• Exponential Base: ${config.exponentialBase}\n` +
                        `• Jitter Enabled: ${config.jitter ? 'Yes' : 'No'}\n` +
                        `• Retryable Status Codes: ${config.retryableStatusCodes.join(', ')}\n` +
                        `• Retryable Errors: ${config.retryableErrors.join(', ')}\n\n` +
                        `**Raw Config:**\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
//# sourceMappingURL=account.js.map