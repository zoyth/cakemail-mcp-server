import { handleCakemailError } from '../utils/errors.js';
import { validateEmail } from '../utils/validation.js';
export async function handleGetSenders(_args, api) {
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
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleCreateSender(args, api) {
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
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleGetSender(args, api) {
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
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleUpdateSender(args, api) {
    try {
        const { sender_id, name: senderName, email, language } = args;
        if (email && !validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        const updateData = {};
        if (senderName)
            updateData.name = senderName;
        if (email)
            updateData.email = email;
        if (language)
            updateData.language = language;
        const sender = await api.senders.updateSender(sender_id, updateData);
        return {
            content: [
                {
                    type: 'text',
                    text: `Sender updated successfully: ${JSON.stringify(sender, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
export async function handleDeleteSender(args, api) {
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
    }
    catch (error) {
        return handleCakemailError(error);
    }
}
//# sourceMappingURL=senders.js.map