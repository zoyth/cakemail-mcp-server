import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';

export async function handleGetTokenStatus(_args: any, api: CakemailAPI) {
  try {
    const status = api.getTokenStatus();
    
    return {
      content: [
        {
          type: 'text',
          text: `Token Status:\n${JSON.stringify({
            ...status,
            // Format dates for better readability
            expiresAt: status.expiresAt?.toISOString(),
            timeUntilExpiryMinutes: status.timeUntilExpiry ? Math.round(status.timeUntilExpiry / 60000) : null
          }, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleRefreshToken(args: any, api: CakemailAPI) {
  try {
    const { force = false } = args;
    
    // Check if refresh is needed unless forced
    if (!force) {
      const status = api.getTokenStatus();
      if (status.hasToken && !status.needsRefresh) {
        return {
          content: [
            {
              type: 'text',
              text: `Token refresh not needed. Current token expires at: ${status.expiresAt?.toISOString()}\nUse force=true to refresh anyway.`,
            },
          ],
        };
      }
    }
    
    const result = await api.forceRefreshToken();
    
    return {
      content: [
        {
          type: 'text',
          text: `Token Refresh Result:\n${JSON.stringify({
            ...result,
            previousExpiry: result.previousExpiry?.toISOString(),
            newExpiry: result.newExpiry?.toISOString()
          }, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleValidateToken(_args: any, api: CakemailAPI) {
  try {
    const validation = await api.validateToken();
    
    return {
      content: [
        {
          type: 'text',
          text: `Token Validation:\n${JSON.stringify(validation, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetTokenScopes(_args: any, api: CakemailAPI) {
  try {
    const scopes = api.getTokenScopes();
    
    return {
      content: [
        {
          type: 'text',
          text: `Token Scopes and Permissions:\n${JSON.stringify(scopes, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}
