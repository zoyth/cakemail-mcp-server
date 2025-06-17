import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';

export async function handleHealthCheck(_args: any, api: CakemailAPI) {
  try {
    const health = await api.healthCheck();
    return {
      content: [
        {
          type: 'text',
          text: `Health Status: ${JSON.stringify(health, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}
