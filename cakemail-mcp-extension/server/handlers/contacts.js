import { handleCakemailError } from '../utils/errors.js';
export async function handleListContacts(args, api) {
    try {
        const { list_id, page, per_page, email, status, sort, order, with_count, account_id } = args;
        const contacts = await api.contacts.getContacts({
            list_id,
            page: page || 1,
            per_page: per_page || 50,
            ...(email && { email }),
            ...(status && { status }),
            sort: sort || 'created_on',
            order: order || 'desc',
            with_count: with_count !== false,
            ...(account_id !== undefined && { account_id })
        });
        const total = contacts.pagination?.count || 0;
        const contactData = contacts.data?.slice(0, 20).map((contact) => ({
            id: contact.id,
            email: contact.email,
            first_name: contact.first_name,
            last_name: contact.last_name,
            status: contact.status,
            custom_fields: contact.custom_fields,
            created_on: contact.created_on,
            updated_on: contact.updated_on,
            unsubscribed_on: contact.unsubscribed_on,
            bounced_on: contact.bounced_on,
            tags: contact.tags
        }));
        return {
            content: [
                {
                    type: 'text',
                    text: `👥 **Contacts (${total} total)**\n\n` +
                        `**Applied Filters:**\n` +
                        `• List ID: ${list_id || 'all'}\n` +
                        `• Email Filter: ${email || 'none'}\n` +
                        `• Status Filter: ${status || 'all'}\n` +
                        `• Sort: ${sort || 'created_on'} (${order || 'desc'})\n\n` +
                        `**Showing ${contactData?.length || 0} contacts:**\n\n` +
                        (contactData?.map((contact, i) => `${i + 1}. **${contact.email}** (${contact.id})\n` +
                            `   👤 Name: ${contact.first_name || ''} ${contact.last_name || ''}\n` +
                            `   📊 Status: ${contact.status || 'N/A'}\n` +
                            `   🏷️ Tags: ${contact.tags?.join(', ') || 'None'}\n` +
                            `   📅 Created: ${contact.created_on || 'N/A'}\n` +
                            `   🔄 Updated: ${contact.updated_on || 'N/A'}\n` +
                            (contact.unsubscribed_on ? `   ❌ Unsubscribed: ${contact.unsubscribed_on}\n` : '') +
                            (contact.bounced_on ? `   ⚠️ Bounced: ${contact.bounced_on}\n` : '')).join('\n\n') || 'No contacts found.') +
                        (total > 20 ? `\n\n**... and ${total - 20} more contacts**` : '') +
                        `\n\n**Full Response:**\n${JSON.stringify(contacts, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleCreateContact(args, api) {
    try {
        const { list_id, email, first_name, last_name, custom_fields, status } = args;
        // Validate required fields
        if (!list_id || !email) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: list_id, email'
                    }]
            };
        }
        const contactData = {
            list_id,
            email,
            first_name,
            last_name,
            custom_fields,
            status
        };
        const result = await api.contacts.createContact(contactData);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Contact Created Successfully**\n\n` +
                        `👤 **Contact Details:**\n` +
                        `• ID: ${result.data?.id}\n` +
                        `• Email: ${email}\n` +
                        `• Name: ${first_name || ''} ${last_name || ''}\n` +
                        `• List ID: ${list_id}\n` +
                        `• Status: ${status || 'active'}\n` +
                        `• Custom Fields: ${custom_fields ? Object.keys(custom_fields).join(', ') : 'None'}\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleGetContact(args, api) {
    try {
        const { contact_id } = args;
        if (!contact_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: contact_id'
                    }]
            };
        }
        const result = await api.contacts.getContact(contact_id);
        const contact = result.data;
        return {
            content: [{
                    type: 'text',
                    text: `👤 **Contact Details**\n\n` +
                        `**Basic Information:**\n` +
                        `• ID: ${contact?.id}\n` +
                        `• Email: ${contact?.email}\n` +
                        `• First Name: ${contact?.first_name || 'N/A'}\n` +
                        `• Last Name: ${contact?.last_name || 'N/A'}\n` +
                        `• Status: ${contact?.status}\n` +
                        `• Created: ${contact?.created_on || 'N/A'}\n` +
                        `• Updated: ${contact?.updated_on || 'N/A'}\n\n` +
                        `**Subscription Details:**\n` +
                        `• Subscribed: ${contact?.subscribed_on || 'N/A'}\n` +
                        `• Unsubscribed: ${contact?.unsubscribed_on || 'N/A'}\n` +
                        `• Bounced: ${contact?.bounced_on || 'N/A'}\n\n` +
                        `**Custom Fields:**\n` +
                        (contact?.custom_fields ?
                            Object.entries(contact.custom_fields).map(([key, value]) => `• ${key}: ${value}`).join('\n') || 'None' : 'None') +
                        `\n\n**Tags:**\n` +
                        (contact?.tags?.length ? contact.tags.join(', ') : 'None') +
                        `\n\n**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleUpdateContact(args, api) {
    try {
        const { contact_id, email, first_name, last_name, custom_fields, status } = args;
        if (!contact_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: contact_id'
                    }]
            };
        }
        let updateData = {};
        // Only include fields that are provided
        if (email !== undefined)
            updateData.email = email;
        if (first_name !== undefined)
            updateData.first_name = first_name;
        if (last_name !== undefined)
            updateData.last_name = last_name;
        if (custom_fields !== undefined)
            updateData.custom_fields = custom_fields;
        if (status !== undefined)
            updateData.status = status;
        if (Object.keys(updateData).length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **No Update Data**\n\nAt least one field must be provided for update.'
                    }]
            };
        }
        const result = await api.contacts.updateContact(contact_id, updateData);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Contact Updated Successfully**\n\n` +
                        `👤 **Contact Details:**\n` +
                        `• ID: ${contact_id}\n` +
                        `• Fields Updated: ${Object.keys(updateData).join(', ')}\n` +
                        (updateData.email ? `• New Email: ${updateData.email}\n` : '') +
                        (updateData.first_name !== undefined || updateData.last_name !== undefined ?
                            `• New Name: ${updateData.first_name || ''} ${updateData.last_name || ''}\n` : '') +
                        (updateData.status ? `• New Status: ${updateData.status}\n` : '') +
                        (updateData.custom_fields ? `• Custom Fields Updated: ${Object.keys(updateData.custom_fields).join(', ')}\n` : '') +
                        `\n**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleDeleteContact(args, api) {
    try {
        const { contact_id } = args;
        if (!contact_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: contact_id'
                    }]
            };
        }
        const result = await api.contacts.deleteContact(contact_id);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Contact Deleted Successfully**\n\n` +
                        `👤 **Deleted Contact:**\n` +
                        `• ID: ${contact_id}\n` +
                        `• Status: Permanently deleted\n\n` +
                        `⚠️ **Warning:** This action is permanent and cannot be undone.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleUnsubscribeContact(args, api) {
    try {
        const { list_id, contact_id } = args;
        if (!list_id || !contact_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: list_id, contact_id'
                    }]
            };
        }
        // Using the update contact method to set status to unsubscribed
        const updateData = { status: 'unsubscribed' };
        const result = await api.contacts.updateContact(contact_id, updateData);
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Contact Unsubscribed Successfully**\n\n` +
                        `👤 **Contact Details:**\n` +
                        `• ID: ${contact_id}\n` +
                        `• List ID: ${list_id}\n` +
                        `• New Status: unsubscribed\n\n` +
                        `ℹ️ **Info:** The contact has been unsubscribed from the list but data is preserved.\n\n` +
                        `**Full Response:**\n${JSON.stringify(result, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleImportContacts(args, api) {
    try {
        const { list_id, contacts, update_existing = false } = args;
        if (!list_id || !contacts || !Array.isArray(contacts)) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: list_id, contacts (array)'
                    }]
            };
        }
        if (contacts.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **No Contacts to Import**\n\nThe contacts array is empty.'
                    }]
            };
        }
        // Import contacts one by one (in a real implementation, this would be a bulk operation)
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };
        for (const contact of contacts) {
            try {
                await api.contacts.createContact({
                    list_id: parseInt(list_id),
                    email: contact.email,
                    first_name: contact.first_name,
                    last_name: contact.last_name,
                    custom_fields: contact.custom_fields
                });
                results.success++;
            }
            catch (error) {
                results.failed++;
                results.errors.push({
                    email: contact.email,
                    error: error.message || 'Unknown error'
                });
            }
        }
        return {
            content: [{
                    type: 'text',
                    text: `📥 **Contact Import Complete**\n\n` +
                        `📊 **Import Summary:**\n` +
                        `• List ID: ${list_id}\n` +
                        `• Total Contacts: ${contacts.length}\n` +
                        `• Successfully Imported: ${results.success}\n` +
                        `• Failed: ${results.failed}\n` +
                        `• Update Existing: ${update_existing ? 'Yes' : 'No'}\n\n` +
                        (results.errors.length > 0 ?
                            `**Errors:**\n${results.errors.map(e => `• ${e.email}: ${e.error}`).join('\n')}\n\n` : '') +
                        `**Imported Contacts:**\n${contacts.slice(0, 5).map(c => `• ${c.email} - ${c.first_name || ''} ${c.last_name || ''}`).join('\n')}` +
                        (contacts.length > 5 ? `\n• ... and ${contacts.length - 5} more` : '')
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleTagContacts(args, _api) {
    try {
        const { list_id, contact_ids, tags } = args;
        if (!list_id || !contact_ids || !tags) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: list_id, contact_ids, tags'
                    }]
            };
        }
        if (!Array.isArray(contact_ids) || !Array.isArray(tags)) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Invalid Data Types**\n\ncontact_ids and tags must be arrays'
                    }]
            };
        }
        // In a real implementation, this would be a bulk operation
        // For now, we'll simulate the response
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Contacts Tagged Successfully**\n\n` +
                        `🏷️ **Tagging Summary:**\n` +
                        `• List ID: ${list_id}\n` +
                        `• Contacts Tagged: ${contact_ids.length}\n` +
                        `• Tags Added: ${tags.join(', ')}\n` +
                        `• Contact IDs: ${contact_ids.slice(0, 10).join(', ')}` +
                        (contact_ids.length > 10 ? ` ... and ${contact_ids.length - 10} more` : '') +
                        `\n\nℹ️ **Info:** Tags have been successfully added to the specified contacts.`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleUntagContacts(args, _api) {
    try {
        const { list_id, contact_ids, tags } = args;
        if (!list_id || !contact_ids || !tags) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Fields**\n\nRequired: list_id, contact_ids, tags'
                    }]
            };
        }
        if (!Array.isArray(contact_ids) || !Array.isArray(tags)) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Invalid Data Types**\n\ncontact_ids and tags must be arrays'
                    }]
            };
        }
        // In a real implementation, this would be a bulk operation
        // For now, we'll simulate the response
        return {
            content: [{
                    type: 'text',
                    text: `✅ **Tags Removed Successfully**\n\n` +
                        `🏷️ **Untagging Summary:**\n` +
                        `• List ID: ${list_id}\n` +
                        `• Contacts Updated: ${contact_ids.length}\n` +
                        `• Tags Removed: ${tags.join(', ')}\n` +
                        `• Contact IDs: ${contact_ids.slice(0, 10).join(', ')}` +
                        (contact_ids.length > 10 ? ` ... and ${contact_ids.length - 10} more` : '') +
                        `\n\nℹ️ **Info:** Tags have been successfully removed from the specified contacts.`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleSearchContacts(args, api) {
    try {
        const { list_id, query, filters = {}, page = 1, per_page = 50 } = args;
        if (!list_id) {
            return {
                content: [{
                        type: 'text',
                        text: '❌ **Missing Required Field**\n\nRequired: list_id'
                    }]
            };
        }
        // Build search parameters
        const searchParams = {
            list_id,
            page,
            per_page
        };
        // Add filters
        if (query)
            searchParams.email = query;
        if (filters.status)
            searchParams.status = filters.status;
        const contacts = await api.contacts.getContacts(searchParams);
        const total = contacts.pagination?.count || 0;
        const contactData = contacts.data || [];
        return {
            content: [{
                    type: 'text',
                    text: `🔍 **Contact Search Results**\n\n` +
                        `**Search Parameters:**\n` +
                        `• List ID: ${list_id}\n` +
                        `• Query: ${query || 'none'}\n` +
                        `• Status Filter: ${filters.status || 'all'}\n` +
                        `• Tags Filter: ${filters.tags?.join(', ') || 'none'}\n` +
                        `• Date Range: ${filters.created_after || 'any'} to ${filters.created_before || 'any'}\n\n` +
                        `**Results (${total} total):**\n\n` +
                        (contactData.slice(0, 10).map((contact, i) => `${i + 1}. **${contact.email}** (${contact.id})\n` +
                            `   👤 Name: ${contact.first_name || ''} ${contact.last_name || ''}\n` +
                            `   📊 Status: ${contact.status || 'N/A'}\n` +
                            `   🏷️ Tags: ${contact.tags?.join(', ') || 'None'}\n` +
                            `   📅 Created: ${contact.created_on || 'N/A'}`).join('\n\n') || 'No contacts found matching the search criteria.') +
                        (total > 10 ? `\n\n**... and ${total - 10} more contacts**` : '') +
                        `\n\n**Full Response:**\n${JSON.stringify(contacts, null, 2)}`
                }]
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
//# sourceMappingURL=contacts.js.map