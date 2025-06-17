// New Email Handler for v2 API Support
case 'cakemail_send_email': {
  const emailArgs = args as any;
  
  // Determine if this is v2 format or legacy format
  const isV2Format = emailArgs.email && emailArgs.sender && emailArgs.content;
  
  let emailData: any;
  let recipientEmail: string;
  let subject: string;
  let emailType: string;
  
  if (isV2Format) {
    // v2 API format
    emailData = {
      email: emailArgs.email,
      sender: emailArgs.sender,
      content: emailArgs.content,
      ...(emailArgs.list_id !== undefined && { list_id: emailArgs.list_id }),
      ...(emailArgs.contact_id !== undefined && { contact_id: emailArgs.contact_id }),
      ...(emailArgs.tags && { tags: emailArgs.tags }),
      ...(emailArgs.tracking && { tracking: emailArgs.tracking }),
      ...(emailArgs.additional_headers && { additional_headers: emailArgs.additional_headers }),
      ...(emailArgs.attachment && { attachment: emailArgs.attachment })
    };
    
    recipientEmail = emailArgs.email;
    subject = emailArgs.content.subject;
    emailType = emailArgs.content.type || 'transactional';
  } else {
    // Legacy format
    const { 
      to_email, 
      to_name, 
      sender_id, 
      subject: legacySubject, 
      html_content, 
      text_content, 
      template_id, 
      list_id, 
      email_type 
    } = emailArgs;
    
    emailData = {
      to_email,
      to_name,
      sender_id,
      subject: legacySubject,
      html_content,
      text_content,
      template_id,
      list_id,
      email_type: email_type || 'transactional',
    };
    
    recipientEmail = to_email;
    subject = legacySubject;
    emailType = email_type || 'transactional';
  }
  
  if (!validateEmail(recipientEmail)) {
    throw new Error('Invalid recipient email format');
  }
  
  const email = await api.sendEmail(emailData);
  
  return {
    content: [
      {
        type: 'text',
        text: `📧 **Email sent successfully via Email API v2!**\\n\\n` +
              `✅ **Email ID:** ${email.data?.id}\\n` +
              `✅ **Status:** ${email.data?.status}\\n` +
              `✅ **Type:** ${emailType}\\n` +
              `✅ **Recipient:** ${recipientEmail}\\n` +
              `✅ **Subject:** ${subject}\\n` +
              `✅ **API Format:** ${isV2Format ? 'v2 (New)' : 'Legacy (Converted)'}\\n\\n` +
              `**Full Response:**\\n${JSON.stringify(email, null, 2)}`,
      },
    ],
  };
}