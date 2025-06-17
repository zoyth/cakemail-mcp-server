import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';

export async function handleSendEmail(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Email handlers not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}
