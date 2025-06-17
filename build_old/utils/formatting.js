export function formatCampaignResponse(campaign, action = 'retrieved') {
    return {
        content: [
            {
                type: 'text',
                text: `📧 **Campaign ${action} Successfully!**\n\n` +
                    `✅ **Campaign ID:** ${campaign.data.id}\n` +
                    `✅ **Name:** ${campaign.data.name}\n` +
                    `✅ **Subject:** ${campaign.data.subject}\n` +
                    `✅ **Status:** ${campaign.data.status}\n` +
                    `✅ **Created:** ${campaign.data.created_on}\n\n` +
                    `**Full Response:**\n${JSON.stringify(campaign, null, 2)}`,
            },
        ],
    };
}
export function formatSuccessResponse(message, data) {
    const content = `✅ **${message}**\n\n` +
        (data ? `**Full Response:**\n${JSON.stringify(data, null, 2)}` : '');
    return {
        content: [
            {
                type: 'text',
                text: content,
            },
        ],
    };
}
export function formatListResponse(items, title, formatter) {
    const total = items.length;
    const displayItems = items.slice(0, 10);
    return {
        content: [
            {
                type: 'text',
                text: `📋 **${title} (${total} total)**\n\n` +
                    `**Showing ${displayItems.length} items:**\n\n` +
                    (displayItems.map(formatter).join('\n\n') || 'No items found.') +
                    (total > 10 ? `\n\n**... and ${total - 10} more items**` : '') +
                    `\n\n**Full Response:**\n${JSON.stringify(items, null, 2)}`,
            },
        ],
    };
}
//# sourceMappingURL=formatting.js.map