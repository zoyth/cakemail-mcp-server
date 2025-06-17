import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import { HandlerRegistry } from '../types/tools.js';

// Import individual handlers
import { handleHealthCheck } from './health.js';
import { 
  handleGetSenders, 
  handleCreateSender, 
  handleGetSender, 
  handleUpdateSender, 
  handleDeleteSender 
} from './senders.js';
import { 
  handleListCampaigns
} from './campaigns.js';

// Create the handler registry (phase 1 - core handlers only)
export const handlerRegistry: HandlerRegistry = {
  // Health
  'cakemail_health_check': handleHealthCheck,
  
  // Senders
  'cakemail_get_senders': handleGetSenders,
  'cakemail_create_sender': handleCreateSender,
  'cakemail_get_sender': handleGetSender,
  'cakemail_update_sender': handleUpdateSender,
  'cakemail_delete_sender': handleDeleteSender,
  
  // Campaigns (basic implementation)
  'cakemail_list_campaigns': handleListCampaigns,
  
  // Note: Additional handlers will be added incrementally as they are fully implemented
};

// Main handler dispatcher
export async function handleToolCall(request: any, api: CakemailAPI) {
  const { name, arguments: args } = request.params;
  
  const handler = handlerRegistry[name];
  if (!handler) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ **Unknown Tool**: ${name}\n\nThis tool is not recognized. Please check the tool name and try again.`,
        },
      ],
      isError: true,
    };
  }
  
  try {
    return await handler(args, api);
  } catch (error) {
    return handleCakemailError(error);
  }
}
