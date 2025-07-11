import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import { validateEmail } from '../utils/validation.js';

export async function handleGetSenders(_args: any, api: CakemailAPI) {
  try {
    const senders = await api.senders.getSenders();
    return {
      content: [
        {
          type: 'text',
          text: `Senders: ${JSON.stringify(senders, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCreateSender(args: any, api: CakemailAPI) {
  try {
    const { name: senderName, email, language } = args;
    
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    const sender = await api.senders.createSender({
      name: senderName,
      email,
      language: language || 'en_US',
    });
    
    return {
      content: [
        {
          type: 'text',
          text: `Sender created successfully: ${JSON.stringify(sender, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetSender(args: any, api: CakemailAPI) {
  try {
    const { sender_id } = args;
    const sender = await api.senders.getSender(sender_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Sender details: ${JSON.stringify(sender, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleUpdateSender(args: any, api: CakemailAPI) {
  try {
    const { sender_id, name: senderName, email, language } = args;
    
    if (email && !validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    const updateData: any = {};
    if (senderName) updateData.name = senderName;
    if (email) updateData.email = email;
    if (language) updateData.language = language;
    
    const sender = await api.senders.updateSender(sender_id, updateData);
    
    return {
      content: [
        {
          type: 'text',
          text: `Sender updated successfully: ${JSON.stringify(sender, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDeleteSender(args: any, api: CakemailAPI) {
  try {
    const { sender_id } = args;
    await api.senders.deleteSender(sender_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Sender ${sender_id} deleted successfully`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleListConfirmedSenders(_args: any, api: CakemailAPI) {
  try {
    const confirmedSenders = await api.senders.getConfirmedSenders();
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Confirmed Senders (${confirmedSenders.length} total)**\n\n` +
              (confirmedSenders.length > 0 
                ? confirmedSenders.map((sender: any, i: number) => 
                    `${i + 1}. **${sender.name}** <${sender.email}>\n` +
                    `   🆔 ID: ${sender.id}\n` +
                    `   🌐 Language: ${sender.language || 'en_US'}\n` +
                    `   ✅ Confirmed: Yes\n` +
                    `   📅 Created: ${sender.created_on || 'N/A'}`
                  ).join('\n\n')
                : 'No confirmed senders found. Please confirm a sender in your Cakemail account first.') +
              `\n\n**Note:** Only confirmed senders can be used for lists and campaigns.`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}
