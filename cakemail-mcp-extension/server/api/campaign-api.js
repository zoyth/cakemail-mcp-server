// Campaign API operations with corrected parameter syntax
import { BaseApiClient } from './base-client.js';
import logger from '../utils/logger.js';
export class CampaignApi extends BaseApiClient {
    // FIXED: Campaign API methods with correct parameter syntax - Legacy method (deprecated)
    async getCampaigns(params) {
        let apiParams = {};
        let filters = [];
        // 1. Handle sorting with correct API syntax ([-|+]term)
        if (params?.sort) {
            const direction = params?.order === 'desc' ? '-' : '+';
            apiParams.sort = `${direction}${params.sort}`;
        }
        else {
            // Default to latest first using correct API syntax
            apiParams.sort = '-created_on';
        }
        // 2. Handle filtering with correct API syntax (term==value;term2==value2)
        if (params?.status) {
            filters.push(`status==${params.status}`);
        }
        if (params?.name) {
            filters.push(`name==${params.name}`);
        }
        if (params?.type) {
            filters.push(`type==${params.type}`);
        }
        if (params?.list_id) {
            filters.push(`list_id==${params.list_id}`);
        }
        if (filters.length > 0) {
            apiParams.filter = filters.join(';');
        }
        // 3. Handle valid direct parameters
        if (params?.page)
            apiParams.page = params.page;
        if (params?.per_page)
            apiParams.per_page = params.per_page;
        if (params?.with_count)
            apiParams.with_count = params.with_count;
        // 4. Add account_id support for proper scoping
        if (params?.account_id) {
            apiParams.account_id = params.account_id;
        }
        else {
            // Try to get current account ID for better results
            const accountId = await this.getCurrentAccountId();
            if (accountId) {
                apiParams.account_id = accountId;
            }
        }
        // 5. Validate parameters against API specification
        const validSortTerms = ['name', 'created_on', 'scheduled_for', 'scheduled_on', 'updated_on', 'type'];
        if (params?.sort && !validSortTerms.includes(params.sort)) {
            throw new Error(`Invalid sort term '${params.sort}'. Valid terms: ${validSortTerms.join(', ')}`);
        }
        // 6. Validate pagination limits
        if (apiParams.per_page && apiParams.per_page > 50) {
            throw new Error('per_page cannot exceed 50 (API limit)');
        }
        const query = Object.keys(apiParams).length > 0 ? `?${new URLSearchParams(apiParams)}` : '';
        if (this.debugMode) {
            logger.info(`[Campaign API] Final query parameters:`, apiParams);
            logger.info(`[Campaign API] Final URL: GET /campaigns${query}`);
        }
        return this.makeRequest(`/campaigns${query}`);
    }
    // NEW: Unified pagination method for campaigns
    async getCampaignsPaginated(options = {}, 
    // Filters are processed inline rather than using a dedicated object
    additionalFilters = {}) {
        const accountId = await this.getCurrentAccountId();
        const params = {
            account_id: additionalFilters.account_id || accountId
        };
        // Handle sorting with correct API syntax ([-|+]term)
        if (additionalFilters.sort) {
            const direction = additionalFilters.order === 'desc' ? '-' : '+';
            params.sort = `${direction}${additionalFilters.sort}`;
        }
        else {
            params.sort = '-created_on'; // Default sort
        }
        // Handle filtering with correct API syntax (term==value;term2==value2)
        const filterParts = [];
        if (additionalFilters.status)
            filterParts.push(`status==${additionalFilters.status}`);
        if (additionalFilters.name)
            filterParts.push(`name==${additionalFilters.name}`);
        if (additionalFilters.type)
            filterParts.push(`type==${additionalFilters.type}`);
        if (additionalFilters.list_id)
            filterParts.push(`list_id==${additionalFilters.list_id}`);
        if (filterParts.length > 0) {
            params.filter = filterParts.join(';');
        }
        return this.fetchPaginated('/campaigns', 'campaigns', options, params);
    }
    // NEW: Iterator for automatic pagination through campaigns
    getCampaignsIterator(options = {}, campaignFilters = {}) {
        // Use campaignFilters to build query parameters
        const queryParams = {
            ...campaignFilters
        };
        return this.createRobustIterator('/campaigns', 'campaigns', {
            ...options,
            validateResponse: (response) => {
                return response && (Array.isArray(response.data) || (response.data && Array.isArray(response.data.data)));
            },
            onError: (error, attempt) => {
                if (this.debugMode) {
                    logger.info(`[Campaign API] Attempt ${attempt} failed:`, error.message);
                }
            }
        }, 
        // Pass queryParams to be used by the iterator
        queryParams);
    }
    // NEW: Get all campaigns with automatic pagination
    async getAllCampaigns(options = {}, filters = {}) {
        const iterator = this.getCampaignsIterator(options, filters);
        return iterator.toArray();
    }
    // NEW: Process campaigns in batches
    async processCampaignsInBatches(processor, options = {}, filters = {}) {
        const iterator = this.getCampaignsIterator(options, filters);
        for await (const batch of iterator.batches()) {
            await processor(batch);
        }
    }
    // Update sendCampaign to use the new scheduleCampaign method
    async sendCampaign(id) {
        return this.scheduleCampaign(id);
    }
    // FIXED: Enhanced getLatestCampaign with correct API usage
    async getLatestCampaign(status) {
        if (this.debugMode) {
            logger.info(`[Campaign API] Getting latest campaign with status filter: ${status || 'none'}`);
        }
        const params = {
            sort: 'created_on',
            order: 'desc', // Will be converted to sort='-created_on'
            per_page: 1,
            page: 1
        };
        if (status) {
            params.status = status; // Will be converted to filter='status==<value>'
        }
        // Try with account scoping first
        try {
            const accountId = await this.getCurrentAccountId();
            if (accountId) {
                params.account_id = accountId;
            }
            const result = await this.getCampaigns(params);
            if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                if (this.debugMode) {
                    logger.info(`[Campaign API] Latest campaign found: ${result.data[0].id}`);
                }
                return result.data[0];
            }
        }
        catch (error) {
            if (this.debugMode) {
                logger.info(`[Campaign API] Failed to get latest campaign:`, error.message);
            }
        }
        // Fallback: try without account scoping
        if (params.account_id) {
            delete params.account_id;
            try {
                const result = await this.getCampaigns(params);
                if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                    if (this.debugMode) {
                        logger.info(`[Campaign API] Latest campaign found (fallback): ${result.data[0].id}`);
                    }
                    return result.data[0];
                }
            }
            catch (error) {
                if (this.debugMode) {
                    logger.info(`[Campaign API] Fallback also failed:`, error.message);
                }
            }
        }
        if (this.debugMode) {
            logger.info(`[Campaign API] No latest campaign found`);
        }
        return null;
    }
    // Enhanced getCampaignsWithDefaults for backward compatibility
    async getCampaignsWithDefaults(params) {
        // Apply smart defaults for better UX
        const enhancedParams = {
            sort: 'created_on',
            order: 'desc',
            ...params
        };
        if (this.debugMode) {
            logger.info(`[Campaign API] Getting campaigns with defaults:`, enhancedParams);
        }
        return this.getCampaigns(enhancedParams);
    }
    // Individual campaign retrieval
    async getCampaign(id, options) {
        // Use provided account_id or get current account ID
        const accountId = options?.account_id || await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}${query}`);
    }
    // FIXED: Campaign creation with exact API spec structure
    async createCampaign(data) {
        // 1. Require and validate list_id
        if (!data.list_id) {
            throw new Error('list_id is required to create a campaign (audience.list_id)');
        }
        // Build campaign data according to exact API specification
        const campaignData = {
            name: data.name,
            audience: {
                list_id: parseInt(String(data.list_id))
            }
        };
        // Add segment_id if provided
        if (data.segment_id) {
            campaignData.audience.segment_id = parseInt(String(data.segment_id));
        }
        // 2. Tracking - with defaults matching API spec
        campaignData.tracking = {
            opens: true,
            clicks_html: true,
            clicks_text: true,
            ...(data.tracking || {}) // Allow override of tracking settings
        };
        // 3. Sender - required structure with id and optional name
        if (data.sender_id) {
            campaignData.sender = {
                id: String(data.sender_id)
            };
            if (data.from_name) {
                campaignData.sender.name = data.from_name;
            }
        }
        // 4. Reply-to email (separate from sender)
        if (data.reply_to) {
            campaignData.reply_to_email = data.reply_to;
        }
        // 5. Content - always set with at least a type
        campaignData.content = { type: 'html' };
        if (data.subject) {
            campaignData.content.subject = data.subject;
        }
        if (data.html_content) {
            campaignData.content.html = data.html_content;
        }
        if (data.text_content) {
            campaignData.content.text = data.text_content;
        }
        // JSON content for BEE editor
        if (data.json_content) {
            campaignData.content.json = data.json_content;
            campaignData.content.type = 'bee';
        }
        // Template reference
        if (data.template_id) {
            campaignData.content.template = {
                id: parseInt(String(data.template_id))
            };
        }
        // Blueprint reference
        if (data.blueprint_id) {
            campaignData.content.blueprint = {
                id: parseInt(String(data.blueprint_id))
            };
        }
        // Content type - allow override from input
        if (data.content_type) {
            campaignData.content.type = data.content_type;
        }
        // Encoding
        if (data.encoding) {
            campaignData.content.encoding = data.encoding;
        }
        // Default unsubscribe link
        if (data.default_unsubscribe_link !== undefined) {
            campaignData.content.default_unsubscribe_link = data.default_unsubscribe_link;
        }
        // Remove undefined fields from content
        Object.keys(campaignData.content).forEach(key => {
            if (campaignData.content[key] === undefined) {
                delete campaignData.content[key];
            }
        });
        // Use explicit account_id if provided, otherwise get current account ID
        const accountId = data.account_id || await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns${query}`, {
            method: 'POST',
            body: JSON.stringify(campaignData)
        });
    }
    // FIXED: Campaign update with exact API spec structure
    async updateCampaign(id, data) {
        const updateData = {};
        // Only include fields that are provided
        if (data.name !== undefined) {
            updateData.name = data.name;
        }
        // Sender - structured object with id and optional name
        if (data.sender_id !== undefined || data.from_name !== undefined) {
            updateData.sender = {};
            if (data.sender_id !== undefined) {
                updateData.sender.id = String(data.sender_id);
            }
            if (data.from_name !== undefined) {
                updateData.sender.name = data.from_name;
            }
        }
        // Reply-to email
        if (data.reply_to !== undefined) {
            updateData.reply_to_email = data.reply_to;
        }
        // Tracking - structured object if provided
        if (data.tracking !== undefined) {
            updateData.tracking = data.tracking;
        }
        // Content - structured according to PatchCampaignContent schema
        const contentFields = ['subject', 'html_content', 'text_content', 'json_content', 'template_id', 'blueprint_id', 'content_type', 'encoding', 'default_unsubscribe_link'];
        const hasContentUpdate = contentFields.some(field => data[field] !== undefined);
        if (hasContentUpdate) {
            updateData.content = {};
            if (data.subject !== undefined) {
                updateData.content.subject = data.subject;
            }
            if (data.html_content !== undefined) {
                updateData.content.html = data.html_content;
            }
            if (data.text_content !== undefined) {
                updateData.content.text = data.text_content;
            }
            // JSON content for BEE editor
            if (data.json_content !== undefined) {
                updateData.content.json = data.json_content;
                updateData.content.type = 'bee';
            }
            // Template reference
            if (data.template_id !== undefined) {
                updateData.content.template = {
                    id: parseInt(String(data.template_id))
                };
            }
            // Blueprint reference
            if (data.blueprint_id !== undefined) {
                updateData.content.blueprint = {
                    id: parseInt(String(data.blueprint_id))
                };
            }
            // Content type
            if (data.content_type !== undefined) {
                updateData.content.type = data.content_type;
            }
            else if (data.html_content !== undefined && !data.json_content) {
                updateData.content.type = 'html';
            }
            // Encoding
            if (data.encoding !== undefined) {
                updateData.content.encoding = data.encoding;
            }
            // Default unsubscribe link
            if (data.default_unsubscribe_link !== undefined) {
                updateData.content.default_unsubscribe_link = data.default_unsubscribe_link;
            }
        }
        // Use explicit account_id if provided, otherwise get current account ID
        const accountId = data.account_id || await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}${query}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });
    }
    async deleteCampaign(id) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}${query}`, {
            method: 'DELETE'
        });
    }
    // Campaign rendering (preview)
    async renderCampaign(id, options) {
        const accountId = options?.account_id || await this.getCurrentAccountId();
        const params = {};
        if (options?.contact_id)
            params.contact_id = options.contact_id;
        if (accountId)
            params.account_id = accountId;
        const query = Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : '';
        return this.makeRequest(`/campaigns/${id}/render${query}`);
    }
    // Send test email
    async sendTestEmail(id, data) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/send-test${query}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    // Campaign scheduling operations
    async scheduleCampaign(id, data) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        const requestOptions = {
            method: 'POST'
        };
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
        return this.makeRequest(`/campaigns/${id}/schedule${query}`, requestOptions);
    }
    async unscheduleCampaign(id) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/unschedule${query}`, {
            method: 'POST'
        });
    }
    async rescheduleCampaign(id, data) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/reschedule${query}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    // Campaign control operations
    async suspendCampaign(id) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/suspend${query}`, {
            method: 'POST'
        });
    }
    async resumeCampaign(id) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/resume${query}`, {
            method: 'POST'
        });
    }
    async cancelCampaign(id) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/cancel${query}`, {
            method: 'POST'
        });
    }
    // Campaign archiving operations
    async archiveCampaign(id) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/archive${query}`, {
            method: 'POST'
        });
    }
    async unarchiveCampaign(id) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/campaigns/${id}/unarchive${query}`, {
            method: 'POST'
        });
    }
    // Campaign revisions
    async getCampaignRevisions(id, params) {
        const accountId = await this.getCurrentAccountId();
        const apiParams = {
            page: params?.page || 1,
            per_page: params?.per_page || 50,
            with_count: params?.with_count !== false
        };
        if (accountId)
            apiParams.account_id = accountId;
        const query = `?${new URLSearchParams(apiParams)}`;
        return this.makeRequest(`/campaigns/${id}/revisions${query}`);
    }
    // Campaign links
    async getCampaignLinks(id, params) {
        const accountId = await this.getCurrentAccountId();
        const apiParams = {
            page: params?.page || 1,
            per_page: params?.per_page || 50,
            with_count: params?.with_count !== false
        };
        if (accountId)
            apiParams.account_id = accountId;
        const query = `?${new URLSearchParams(apiParams)}`;
        return this.makeRequest(`/campaigns/${id}/links${query}`);
    }
    // Debug method to test different campaign access patterns
    async debugCampaignAccess(campaignId) {
        const results = {
            timestamp: new Date().toISOString(),
            tests: []
        };
        // Test 1: Get campaigns with default parameters
        try {
            const campaigns = await this.getCampaigns();
            results.tests.push({
                test: 'default-campaigns',
                success: true,
                campaignCount: Array.isArray(campaigns.data) ? campaigns.data.length : 0,
                firstCampaignId: Array.isArray(campaigns.data) && campaigns.data.length > 0 ? campaigns.data[0].id : null
            });
        }
        catch (error) {
            results.tests.push({
                test: 'default-campaigns',
                success: false,
                error: error.message
            });
        }
        // Test 2: Get campaigns with explicit account ID
        try {
            const accountId = await this.getCurrentAccountId();
            if (accountId) {
                const campaigns = await this.getCampaigns({ account_id: accountId });
                results.tests.push({
                    test: 'account-scoped-campaigns',
                    success: true,
                    accountId,
                    campaignCount: Array.isArray(campaigns.data) ? campaigns.data.length : 0,
                    firstCampaignId: Array.isArray(campaigns.data) && campaigns.data.length > 0 ? campaigns.data[0].id : null
                });
            }
        }
        catch (error) {
            results.tests.push({
                test: 'account-scoped-campaigns',
                success: false,
                error: error.message
            });
        }
        // Test 3: Get specific campaign if ID provided
        if (campaignId) {
            try {
                const campaign = await this.getCampaign(campaignId);
                results.tests.push({
                    test: 'specific-campaign',
                    success: true,
                    campaignId,
                    found: !!campaign.data
                });
            }
            catch (error) {
                results.tests.push({
                    test: 'specific-campaign',
                    success: false,
                    campaignId,
                    error: error.message
                });
            }
        }
        return results;
    }
}
//# sourceMappingURL=campaign-api.js.map