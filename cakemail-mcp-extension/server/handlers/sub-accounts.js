import { handleCakemailError } from '../utils/errors.js';
// List sub-accounts with filtering and pagination
export async function handleListSubAccounts(args, api) {
    try {
        const { page, per_page, status, name, recursive, partner_account_id, with_count } = args;
        const params = {};
        // Build pagination parameters
        if (page !== undefined || per_page !== undefined || with_count !== undefined) {
            params.pagination = {
                page: page || 1,
                per_page: per_page || 50,
                with_count: with_count !== false
            };
        }
        // Build filters
        if (status || name) {
            params.filters = {};
            if (status)
                params.filters.status = status;
            if (name)
                params.filters.name = name;
        }
        // Add other parameters
        if (partner_account_id !== undefined)
            params.partner_account_id = partner_account_id;
        if (recursive !== undefined)
            params.recursive = recursive;
        // Default sort by creation date (newest first)
        params.sort = {
            sort: 'created_on',
            order: 'desc'
        };
        const result = await api.subAccounts.listSubAccounts(params);
        const total = result.pagination?.count || 0;
        const subAccountsList = result.data?.slice(0, 20).map((account) => ({
            id: account.id,
            name: account.name || 'N/A',
            status: account.status || 'N/A',
            lineage: account.lineage || 'N/A',
            partner: account.partner || false,
            owner_email: account.account_owner?.email || 'N/A',
            owner_name: account.account_owner?.name || 'N/A',
            created_on: account.created_on || 'N/A',
            expires_on: account.expires_on || 'N/A'
        }));
        return {
            content: [
                {
                    type: 'text',
                    text: `🏢 **Sub-Accounts (${total} total)**\n\n` +
                        `**Applied Filters:**\n` +
                        `• Status: ${status || 'all'}\n` +
                        `• Name Filter: ${name || 'none'}\n` +
                        `• Recursive: ${recursive || false}\n` +
                        `• Partner Account ID: ${partner_account_id || 'none'}\n\n` +
                        `**Showing ${subAccountsList?.length || 0} sub-accounts:**\n\n` +
                        (subAccountsList?.map((acc, i) => `${i + 1}. **${acc.name}** (${acc.id})\n` +
                            `   🏷️ Status: ${acc.status}\n` +
                            `   📧 Owner: ${acc.owner_name} (${acc.owner_email})\n` +
                            `   🔗 Lineage: ${acc.lineage}\n` +
                            `   🤝 Partner: ${acc.partner ? 'Yes' : 'No'}\n` +
                            `   📅 Created: ${acc.created_on}\n` +
                            `   ⏰ Expires: ${acc.expires_on}`).join('\n\n') || 'No sub-accounts found.') +
                        (total > 20 ? `\n\n**... and ${total - 20} more sub-accounts**` : '') +
                        `\n\n**Full Response:**\n${JSON.stringify(result, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Create a new sub-account
export async function handleCreateSubAccount(args, api) {
    try {
        const { name, email, password, company, language, timezone, country, phone, website, description, partner_account_id, skip_verification } = args;
        // Validate required fields
        if (!name || !email || !password) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: name, email, password'
                    }]
            };
        }
        // Build sub-account data
        const subAccountData = {
            name,
            email,
            password
        };
        // Add optional fields if provided
        if (company)
            subAccountData.company = company;
        if (language)
            subAccountData.language = language;
        if (timezone)
            subAccountData.timezone = timezone;
        if (country)
            subAccountData.country = country;
        if (phone)
            subAccountData.phone = phone;
        if (website)
            subAccountData.website = website;
        if (description)
            subAccountData.description = description;
        // Build options
        const options = {};
        if (partner_account_id !== undefined)
            options.partner_account_id = partner_account_id;
        if (skip_verification !== undefined)
            options.skip_verification = skip_verification;
        const result = await api.subAccounts.createSubAccount(subAccountData, options);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Sub-Account Created Successfully**\n\n` +
                        `🏢 **Account Details:**\n` +
                        `• ID: ${result.data?.id}\n` +
                        `• Name: ${name}\n` +
                        `• Email: ${email}\n` +
                        `• Company: ${company || 'N/A'}\n` +
                        `• Language: ${language || 'N/A'}\n` +
                        `• Country: ${country || 'N/A'}\n` +
                        `• Skip Verification: ${skip_verification || false}\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Get specific sub-account details
export async function handleGetSubAccount(args, api) {
    try {
        const { account_id } = args;
        if (!account_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: account_id'
                    }]
            };
        }
        const result = await api.subAccounts.getSubAccount(account_id);
        const account = result.data;
        return {
            content: [{
                    type: 'text',
                    text: `🏢 **Sub-Account Details**\n\n` +
                        `**Account Information:**\n` +
                        `• ID: ${account?.id}\n` +
                        `• Name: ${account?.name || 'N/A'}\n` +
                        `• Status: ${account?.status || 'N/A'}\n` +
                        `• Lineage: ${account?.lineage || 'N/A'}\n` +
                        `• Partner: ${account?.partner ? 'Yes' : 'No'}\n\n` +
                        `**Owner Information:**\n` +
                        `• Name: ${account?.account_owner?.name || 'N/A'}\n` +
                        `• Email: ${account?.account_owner?.email || 'N/A'}\n\n` +
                        `**Dates:**\n` +
                        `• Created: ${account?.created_on || 'N/A'}\n` +
                        `• Expires: ${account?.expires_on || 'N/A'}\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Update sub-account information
export async function handleUpdateSubAccount(args, api) {
    try {
        const { account_id, name, email, company, language, timezone, country, phone, website, description } = args;
        if (!account_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: account_id'
                    }]
            };
        }
        // Build update data with only provided fields
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        if (company !== undefined)
            updateData.company = company;
        if (language !== undefined)
            updateData.language = language;
        if (timezone !== undefined)
            updateData.timezone = timezone;
        if (country !== undefined)
            updateData.country = country;
        if (phone !== undefined)
            updateData.phone = phone;
        if (website !== undefined)
            updateData.website = website;
        if (description !== undefined)
            updateData.description = description;
        if (Object.keys(updateData).length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **No Update Data**\n\nAt least one field must be provided for update.'
                    }]
            };
        }
        const result = await api.subAccounts.updateSubAccount(account_id, updateData);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Sub-Account Updated Successfully**\n\n` +
                        `🏢 **Account Details:**\n` +
                        `• ID: ${account_id}\n` +
                        `• Fields Updated: ${Object.keys(updateData).join(', ')}\n\n` +
                        `**Updated Values:**\n` +
                        Object.entries(updateData).map(([key, value]) => `• ${key}: ${value}`).join('\n') +
                        `\n\n**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Delete a sub-account
export async function handleDeleteSubAccount(args, api) {
    try {
        const { account_id } = args;
        if (!account_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: account_id'
                    }]
            };
        }
        const result = await api.subAccounts.deleteSubAccount(account_id);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Sub-Account Deleted Successfully**\n\n` +
                        `🏢 **Deleted Account:**\n` +
                        `• ID: ${account_id}\n` +
                        `• Status: ${result.data?.deleted ? 'Deleted' : 'Error'}\n\n` +
                        `**⚠️ Warning:** This action is permanent and cannot be undone.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Additional sub-account management handlers
// Suspend a sub-account
export async function handleSuspendSubAccount(args, api) {
    try {
        const { account_id } = args;
        if (!account_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: account_id'
                    }]
            };
        }
        const result = await api.subAccounts.suspendSubAccount(account_id);
        return {
            content: [{
                    type: 'text',
                    text: `⏸️ **Sub-Account Suspended Successfully**\n\n` +
                        `🏢 **Account Details:**\n` +
                        `• ID: ${account_id}\n` +
                        `• Suspended: ${result.suspended ? 'Yes' : 'No'}\n\n` +
                        `**Note:** The sub-account has been suspended and cannot access the platform until unsuspended.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Unsuspend a sub-account
export async function handleUnsuspendSubAccount(args, api) {
    try {
        const { account_id } = args;
        if (!account_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: account_id'
                    }]
            };
        }
        const result = await api.subAccounts.unsuspendSubAccount(account_id);
        return {
            content: [{
                    type: 'text',
                    text: `▶️ **Sub-Account Unsuspended Successfully**\n\n` +
                        `🏢 **Account Details:**\n` +
                        `• ID: ${account_id}\n` +
                        `• Unsuspended: ${result.unsuspended ? 'Yes' : 'No'}\n\n` +
                        `**Note:** The sub-account has been reactivated and can now access the platform.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Confirm sub-account creation
export async function handleConfirmSubAccount(args, api) {
    try {
        const { account_id, confirmation_code, password } = args;
        if (!account_id || !confirmation_code) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: account_id, confirmation_code'
                    }]
            };
        }
        const confirmData = { confirmation_code };
        if (password)
            confirmData.password = password;
        const result = await api.subAccounts.confirmSubAccount(account_id, confirmData);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Sub-Account Confirmed Successfully**\n\n` +
                        `🏢 **Account Details:**\n` +
                        `• ID: ${account_id}\n` +
                        `• Confirmed: ${result.data?.confirmed ? 'Yes' : 'No'}\n` +
                        `• Password Updated: ${password ? 'Yes' : 'No'}\n\n` +
                        `**Note:** The sub-account is now confirmed and can be used.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Resend verification email
export async function handleResendVerificationEmail(args, api) {
    try {
        const { email } = args;
        if (!email) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: email'
                    }]
            };
        }
        const result = await api.subAccounts.resendVerificationEmail({ email });
        return {
            content: [{
                    type: 'text',
                    text: `📧 **Verification Email Resent Successfully**\n\n` +
                        `**Email Details:**\n` +
                        `• Recipient: ${email}\n` +
                        `• Resent: ${result.verification_resent ? 'Yes' : 'No'}\n\n` +
                        `**Note:** Please check the inbox (and spam folder) for the verification email.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Convert sub-account to organization
export async function handleConvertSubAccountToOrganization(args, api) {
    try {
        const { account_id, migrate_owner } = args;
        if (!account_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: account_id'
                    }]
            };
        }
        const convertData = { migrate_owner: migrate_owner !== false }; // Default to true
        const result = await api.subAccounts.convertSubAccountToOrganization(account_id, convertData);
        return {
            content: [{
                    type: 'text',
                    text: `🏢 **Sub-Account Converted to Organization Successfully**\n\n` +
                        `**Account Details:**\n` +
                        `• ID: ${account_id}\n` +
                        `• Migrate Owner: ${migrate_owner !== false ? 'Yes' : 'No'}\n` +
                        `• Status: ${result.data?.status || 'N/A'}\n\n` +
                        `**Note:** The sub-account has been converted to an organization type.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Get the latest sub-account
export async function handleGetLatestSubAccount(_args, api) {
    try {
        const result = await api.subAccounts.getLatestSubAccount();
        if (!result || !result.data) {
            return {
                content: [{
                        type: 'text',
                        text: '📭 **No Sub-Accounts Found**\n\nThere are no sub-accounts in the system.'
                    }]
            };
        }
        const account = result.data;
        return {
            content: [{
                    type: 'text',
                    text: `🏢 **Latest Sub-Account**\n\n` +
                        `**Account Information:**\n` +
                        `• ID: ${account.id}\n` +
                        `• Name: ${account.name || 'N/A'}\n` +
                        `• Status: ${account.status || 'N/A'}\n` +
                        `• Owner: ${account.account_owner?.name || 'N/A'} (${account.account_owner?.email || 'N/A'})\n` +
                        `• Created: ${account.created_on || 'N/A'}\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Search sub-accounts by name
export async function handleSearchSubAccountsByName(args, api) {
    try {
        const { name, page, per_page } = args;
        if (!name) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: name'
                    }]
            };
        }
        const result = await api.subAccounts.searchSubAccountsByName(name, {
            page: page || 1,
            per_page: per_page || 50
        });
        const total = result.pagination?.count || 0;
        const accounts = result.data?.map((account) => ({
            id: account.id,
            name: account.name || 'N/A',
            status: account.status || 'N/A',
            owner_email: account.account_owner?.email || 'N/A'
        }));
        return {
            content: [{
                    type: 'text',
                    text: `🔍 **Sub-Account Search Results**\n\n` +
                        `**Search Query:** "${name}"\n` +
                        `**Found:** ${total} matching sub-accounts\n\n` +
                        `**Results:**\n` +
                        (accounts?.map((acc, i) => `${i + 1}. **${acc.name}** (${acc.id})\n` +
                            `   🏷️ Status: ${acc.status}\n` +
                            `   📧 Owner: ${acc.owner_email}`).join('\n\n') || 'No matching sub-accounts found.') +
                        `\n\n**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Get sub-accounts by status
export async function handleGetSubAccountsByStatus(args, api) {
    try {
        const { status, page, per_page } = args;
        if (!status) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: status (pending, active, suspended, inactive)'
                    }]
            };
        }
        const result = await api.subAccounts.getSubAccountsByStatus(status, {
            page: page || 1,
            per_page: per_page || 50
        });
        const total = result.pagination?.count || 0;
        const accounts = result.data?.map((account) => ({
            id: account.id,
            name: account.name || 'N/A',
            status: account.status || 'N/A',
            owner_email: account.account_owner?.email || 'N/A',
            created_on: account.created_on || 'N/A'
        }));
        return {
            content: [{
                    type: 'text',
                    text: `📊 **Sub-Accounts by Status**\n\n` +
                        `**Status Filter:** ${status}\n` +
                        `**Found:** ${total} sub-accounts\n\n` +
                        `**Results:**\n` +
                        (accounts?.map((acc, i) => `${i + 1}. **${acc.name}** (${acc.id})\n` +
                            `   🏷️ Status: ${acc.status}\n` +
                            `   📧 Owner: ${acc.owner_email}\n` +
                            `   📅 Created: ${acc.created_on}`).join('\n\n') || `No sub-accounts found with status '${status}'.`) +
                        `\n\n**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Verify sub-account email (email verification workflows)
export async function handleVerifySubAccountEmail(args, api) {
    try {
        const { account_id, verification_code, email } = args;
        if (!account_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: account_id'
                    }]
            };
        }
        // If verification_code is provided, use confirm endpoint
        if (verification_code) {
            const confirmData = { confirmation_code: verification_code };
            const result = await api.subAccounts.confirmSubAccount(account_id, confirmData);
            return {
                content: [{
                        type: 'text',
                        text: `✅ **Sub-Account Email Verified Successfully**\n\n` +
                            `🏢 **Account Details:**\n` +
                            `• ID: ${account_id}\n` +
                            `• Verified: ${result.data?.confirmed ? 'Yes' : 'No'}\n` +
                            `• Verification Code: ${verification_code}\n\n` +
                            `**Note:** The sub-account email has been verified and the account is now confirmed.\n\n` +
                            `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                    }]
            };
        }
        // If email is provided, trigger resend verification
        if (email) {
            const result = await api.subAccounts.resendVerificationEmail({ email });
            return {
                content: [{
                        type: 'text',
                        text: `📧 **Email Verification Workflow Initiated**\n\n` +
                            `**Email Details:**\n` +
                            `• Account ID: ${account_id}\n` +
                            `• Email: ${email}\n` +
                            `• Verification Resent: ${result.verification_resent ? 'Yes' : 'No'}\n\n` +
                            `**Next Steps:**\n` +
                            `1. Check the inbox (and spam folder) for verification email\n` +
                            `2. Use the verification code with this tool to confirm\n\n` +
                            `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                    }]
            };
        }
        // If neither verification_code nor email provided
        return {
            content: [{
                    type: 'text',
                    text: '❌ **Missing Required Field**\n\nRequired: Either verification_code (to verify) or email (to resend verification)'
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Debug sub-account access
export async function handleDebugSubAccountAccess(args, api) {
    try {
        const { account_id } = args;
        const result = await api.subAccounts.debugSubAccountAccess(account_id);
        let statusEmoji = '✅';
        if (result.access_check === 'failed') {
            statusEmoji = '❌';
        }
        return {
            content: [{
                    type: 'text',
                    text: `${statusEmoji} **Sub-Account Access Debug**\n\n` +
                        `**Access Check:** ${result.access_check}\n` +
                        `**Timestamp:** ${result.timestamp}\n` +
                        `**OpenAPI Compliance:** ${result.openapi_compliance}\n\n` +
                        (account_id ?
                            `**Specific Account Test (${account_id}):**\n` +
                                `• Account Found: ${result.account_found ? 'Yes' : 'No'}\n` +
                                `• Validation: ${result.validation}\n` +
                                (result.account_data ? `• Account Name: ${result.account_data.name}\n` : '') +
                                (result.account_data ? `• Account Status: ${result.account_data.status}\n` : '') :
                            `**General Access Test:**\n` +
                                `• Can List Accounts: ${result.can_list_accounts ? 'Yes' : 'No'}\n` +
                                `• Total Account Count: ${result.account_count}\n` +
                                `• Filter Validation: ${result.filter_validation}\n` +
                                (result.first_few_accounts ?
                                    `• Sample Accounts: ${result.first_few_accounts.map((acc) => acc.name).join(', ')}\n` : '')) +
                        (result.error ? `\n**Error:** ${result.error}` : '') +
                        `\n\n**Full Debug Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
// Export sub-accounts data to CSV or JSON format
export async function handleExportSubAccounts(args, api) {
    try {
        const { format = 'csv', include_usage_stats = true, include_contact_counts = true, include_owner_details = true, status_filter, recursive = false, partner_account_id, filename } = args;
        // Validate format
        if (!['csv', 'json'].includes(format)) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Invalid Format**\n\nSupported formats: csv, json'
                    }]
            };
        }
        // Fetch all sub-accounts with comprehensive data
        const listParams = {
            recursive: recursive,
            pagination: {
                page: 1,
                per_page: 100, // Get larger batches
                with_count: true
            },
            sort: {
                sort: 'created_on',
                order: 'asc' // Oldest first for consistent ordering
            }
        };
        // Apply filters if provided
        if (status_filter || partner_account_id) {
            listParams.filters = {};
            if (status_filter)
                listParams.filters.status = status_filter;
            if (partner_account_id !== undefined)
                listParams.partner_account_id = partner_account_id;
        }
        // Collect all sub-accounts across all pages
        let allSubAccounts = [];
        let currentPage = 1;
        let totalPages = 1;
        let totalCount = 0;
        do {
            listParams.pagination.page = currentPage;
            const response = await api.subAccounts.listSubAccounts(listParams);
            if (response.data && response.data.length > 0) {
                allSubAccounts = allSubAccounts.concat(response.data);
            }
            if (response.pagination) {
                totalCount = response.pagination.count || 0;
                const perPage = response.pagination.per_page || 100;
                totalPages = Math.ceil(totalCount / perPage);
            }
            currentPage++;
        } while (currentPage <= totalPages && totalPages > 1);
        if (allSubAccounts.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: '📭 **No Sub-Accounts Found**\n\nNo sub-accounts match the specified criteria for export.'
                    }]
            };
        }
        // Process each sub-account to gather comprehensive information
        const exportData = await Promise.all(allSubAccounts.map(async (account) => {
            const baseData = {
                id: account.id,
                name: account.name || '',
                status: account.status || '',
                lineage: account.lineage || '',
                is_partner: account.partner || false,
                created_on: account.created_on || '',
                expires_on: account.expires_on || ''
            };
            // Include owner details if requested
            if (include_owner_details && account.account_owner) {
                baseData.owner_name = account.account_owner.name || '';
                baseData.owner_email = account.account_owner.email || '';
            }
            // Include usage statistics if requested
            if (include_usage_stats && account.usage_limits) {
                baseData.emails_per_month = account.usage_limits.per_month || 0;
                baseData.emails_per_campaign = account.usage_limits.per_campaign || 0;
                baseData.emails_remaining = account.usage_limits.remaining || 0;
                baseData.maximum_contacts = account.usage_limits.maximum_contacts || 0;
                baseData.lists_limit = account.usage_limits.lists || 0;
                baseData.users_limit = account.usage_limits.users || 0;
                baseData.use_automations = account.usage_limits.use_automations || false;
                baseData.use_ab_testing = account.usage_limits.use_ab_split || false;
                baseData.use_contact_export = account.usage_limits.use_contact_export || false;
                baseData.use_email_api = account.usage_limits.use_email_api || false;
            }
            // Try to get additional stats if requested (may fail for some accounts)
            if (include_contact_counts) {
                try {
                    // This would require access to lists API for each account
                    // For now, we'll add placeholder fields that could be populated
                    baseData.total_contacts = 'N/A';
                    baseData.active_contacts = 'N/A';
                    baseData.total_lists = 'N/A';
                }
                catch {
                    baseData.total_contacts = 'Error';
                    baseData.active_contacts = 'Error';
                    baseData.total_lists = 'Error';
                }
            }
            return baseData;
        }));
        // Generate filename if not provided
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const exportFilename = filename || `sub-accounts-export-${timestamp}`;
        let exportContent;
        let fileExtension;
        if (format === 'json') {
            exportContent = JSON.stringify({
                export_info: {
                    generated_at: new Date().toISOString(),
                    total_accounts: exportData.length,
                    filters: {
                        status_filter: status_filter || null,
                        partner_account_id: partner_account_id || null,
                        recursive: recursive
                    },
                    includes: {
                        usage_stats: include_usage_stats,
                        contact_counts: include_contact_counts,
                        owner_details: include_owner_details
                    }
                },
                accounts: exportData
            }, null, 2);
            fileExtension = 'json';
        }
        else {
            // Generate CSV
            if (exportData.length === 0) {
                exportContent = 'No data to export';
            }
            else {
                // Get all unique keys from all records for comprehensive headers
                const allKeys = new Set();
                exportData.forEach(record => {
                    Object.keys(record).forEach(key => allKeys.add(key));
                });
                const headers = Array.from(allKeys).sort();
                // Create CSV header
                const csvHeaders = headers.map(header => `"${header}"`).join(',');
                // Create CSV rows
                const csvRows = exportData.map(record => {
                    return headers.map(header => {
                        const value = record[header];
                        if (value === null || value === undefined) {
                            return '""';
                        }
                        // Escape quotes and wrap in quotes
                        return `"${String(value).replace(/"/g, '""')}"`;
                    }).join(',');
                });
                exportContent = [csvHeaders, ...csvRows].join('\n');
            }
            fileExtension = 'csv';
        }
        // Calculate export statistics
        const stats = {
            totalAccounts: exportData.length,
            byStatus: {},
            partnerAccounts: exportData.filter(acc => acc.is_partner).length,
            withUsageStats: exportData.filter(acc => acc.emails_per_month !== undefined).length
        };
        // Count by status
        exportData.forEach(acc => {
            const status = acc.status || 'unknown';
            stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
        });
        return {
            content: [{
                    type: 'text',
                    text: `📊 **Sub-Accounts Export Completed**\n\n` +
                        `**Export Details:**\n` +
                        `• Format: ${format.toUpperCase()}\n` +
                        `• Filename: ${exportFilename}.${fileExtension}\n` +
                        `• Total Accounts: ${stats.totalAccounts}\n` +
                        `• Partner Accounts: ${stats.partnerAccounts}\n` +
                        `• Generated: ${new Date().toISOString()}\n\n` +
                        `**Account Status Breakdown:**\n` +
                        Object.entries(stats.byStatus).map(([status, count]) => `• ${status}: ${count} accounts`).join('\n') +
                        `\n\n**Export Options:**\n` +
                        `• Usage Stats: ${include_usage_stats ? '✅' : '❌'}\n` +
                        `• Contact Counts: ${include_contact_counts ? '✅' : '❌'}\n` +
                        `• Owner Details: ${include_owner_details ? '✅' : '❌'}\n` +
                        `• Recursive: ${recursive ? '✅' : '❌'}\n` +
                        (status_filter ? `• Status Filter: ${status_filter}\n` : '') +
                        (partner_account_id ? `• Partner Account ID: ${partner_account_id}\n` : '') +
                        `\n**Export Preview (first 3 records):**\n\`\`\`\n` +
                        (format === 'json' ?
                            JSON.stringify(exportData.slice(0, 3), null, 2) :
                            exportContent.split('\n').slice(0, 4).join('\n')) +
                        `\n\`\`\`\n\n` +
                        `**Full Export Data:**\n\`\`\`${format}\n${exportContent}\n\`\`\``
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
//# sourceMappingURL=sub-accounts.js.map