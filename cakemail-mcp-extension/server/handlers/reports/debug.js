import { handleCakemailError } from '../../utils/errors.js';
import { formatSectionHeader, formatKeyValue } from '../../utils/formatting.js';
/**
 * Debug reports API access
 */
export async function handleDebugReportsAccess(args, api) {
    try {
        const { campaign_id } = args;
        const results = await api.reports.debugReportsAccess(campaign_id);
        // Format the response
        let response = `${formatSectionHeader('🔍 Reports API Access Debug')}\n\n`;
        response += `${formatKeyValue('Timestamp', results.timestamp)}\n\n`;
        response += `${formatSectionHeader('📊 Test Results')}\n\n`;
        results.tests.forEach((test, index) => {
            const statusEmoji = test.success ? '✅' : '❌';
            response += `**${index + 1}. ${test.test}** ${statusEmoji}\n`;
            if (test.success) {
                if (test.hasData !== undefined) {
                    response += `   • Has Data: ${test.hasData ? 'Yes' : 'No'}\n`;
                }
                if (test.dataKeys && test.dataKeys.length > 0) {
                    response += `   • Available Fields: ${test.dataKeys.join(', ')}\n`;
                }
                if (test.linksCount !== undefined) {
                    response += `   • Links Found: ${test.linksCount}\n`;
                }
                if (test.exportsCount !== undefined) {
                    response += `   • Exports Available: ${test.exportsCount}\n`;
                }
            }
            else {
                response += `   • Error: ${test.error}\n`;
            }
            response += '\n';
        });
        // Summary
        const successCount = results.tests.filter((t) => t.success).length;
        const totalCount = results.tests.length;
        response += `${formatSectionHeader('📈 Summary')}\n`;
        response += `${formatKeyValue('Tests Passed', `${successCount}/${totalCount}`)}\n`;
        if (successCount === totalCount) {
            response += '\n✅ All reports API endpoints are accessible!\n';
        }
        else {
            response += '\n⚠️ Some reports API endpoints returned errors.\n';
            response += 'This may indicate permission issues or missing data.\n';
        }
        return {
            content: [{
                    type: 'text',
                    text: response
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
//# sourceMappingURL=debug.js.map