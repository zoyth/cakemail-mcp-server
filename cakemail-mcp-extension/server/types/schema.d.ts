import type { paths, components } from "../schema/schema.js";
export type { paths, components };
export type Paths = paths;
export type Components = components;
export type Schemas = components["schemas"];
export type PathParams<T extends keyof paths> = paths[T] extends {
    parameters: {
        path: infer P;
    };
} ? P : never;
export type QueryParams<T extends keyof paths> = paths[T] extends {
    parameters: {
        query: infer Q;
    };
} ? Q : never;
export type RequestBody<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
    requestBody: {
        content: {
            "application/json": infer B;
        };
    };
} ? B : never;
export type ResponseBody<T extends keyof paths, M extends keyof paths[T], S extends number = 200> = paths[T][M] extends {
    responses: {
        [K in S]: {
            content: {
                "application/json": infer B;
            };
        };
    };
} ? B : never;
export type GetOperation<T extends keyof paths> = paths[T]["get"];
export type PostOperation<T extends keyof paths> = paths[T]["post"];
export type PatchOperation<T extends keyof paths> = paths[T]["patch"];
export type DeleteOperation<T extends keyof paths> = paths[T]["delete"];
export type Campaign = Schemas["CampaignFullResponse"];
export type CampaignSummary = Schemas["CampaignSummaryResponse"];
export type Contact = Schemas["ContactFullResponse"];
export type ContactSummary = Schemas["ContactFullResponse"];
export type ContactList = Schemas["ListFullResponse"];
export type Sender = Schemas["SenderFullResponse"];
export type Template = Schemas["TemplateFullResponse"];
export type Account = Schemas["AccountFullResponse"];
export type EmailStatus = Schemas["GetEmailResponse"];
export type Pagination = Schemas["Pagination"];
export type ListCampaignsParams = QueryParams<"/campaigns">;
export type ListCampaignsResponse = ResponseBody<"/campaigns", "get">;
export type GetCampaignResponse = ResponseBody<"/campaigns/{campaign_id}", "get">;
export type CreateCampaignRequest = RequestBody<"/campaigns", "post">;
export type CreateCampaignResponse = ResponseBody<"/campaigns", "post">;
export type UpdateCampaignRequest = RequestBody<"/campaigns/{campaign_id}", "patch">;
export type UpdateCampaignResponse = ResponseBody<"/campaigns/{campaign_id}", "patch">;
export type DeleteCampaignResponse = ResponseBody<"/campaigns/{campaign_id}", "delete">;
export type RenderCampaignParams = QueryParams<"/campaigns/{campaign_id}/render">;
export type RenderCampaignResponse = ResponseBody<"/campaigns/{campaign_id}/render", "get">;
export type SendTestEmailRequest = RequestBody<"/campaigns/{campaign_id}/send-test", "post">;
export type SendTestEmailResponse = ResponseBody<"/campaigns/{campaign_id}/send-test", "post">;
export type ScheduleCampaignRequest = RequestBody<"/campaigns/{campaign_id}/schedule", "post">;
export type ScheduleCampaignResponse = ResponseBody<"/campaigns/{campaign_id}/schedule", "post">;
export type ListSendersResponse = ResponseBody<"/brands/default/senders", "get">;
export type GetSenderResponse = ResponseBody<"/brands/default/senders/{sender_id}", "get">;
export type CreateSenderRequest = RequestBody<"/brands/default/senders", "post">;
export type CreateSenderResponse = ResponseBody<"/brands/default/senders", "post">;
export type UpdateSenderRequest = RequestBody<"/brands/default/senders/{sender_id}", "patch">;
export type UpdateSenderResponse = ResponseBody<"/brands/default/senders/{sender_id}", "patch">;
export type ListContactsParams = QueryParams<"/lists/{list_id}/contacts">;
export type ListContactsResponse = ResponseBody<"/lists/{list_id}/contacts", "get">;
export type GetContactResponse = ResponseBody<"/lists/{list_id}/contacts/{contact_id}", "get">;
export type CreateContactRequest = RequestBody<"/lists/{list_id}/contacts", "post">;
export type CreateContactResponse = ResponseBody<"/lists/{list_id}/contacts", "post">;
export type UpdateContactRequest = RequestBody<"/lists/{list_id}/contacts/{contact_id}", "patch">;
export type UpdateContactResponse = ResponseBody<"/lists/{list_id}/contacts/{contact_id}", "patch">;
export type ListListsParams = QueryParams<"/lists">;
export type ListListsResponse = ResponseBody<"/lists", "get">;
export type GetListResponse = ResponseBody<"/lists/{list_id}", "get">;
export type CreateListRequest = RequestBody<"/lists", "post">;
export type CreateListResponse = ResponseBody<"/lists", "post">;
export type UpdateListRequest = RequestBody<"/lists/{list_id}", "patch">;
export type UpdateListResponse = ResponseBody<"/lists/{list_id}", "patch">;
export type SubmitEmailRequest = RequestBody<"/v2/emails", "post">;
export type SubmitEmailResponse = ResponseBody<"/v2/emails", "post">;
export type GetEmailResponse = ResponseBody<"/v2/emails/{email_id}", "get">;
export type RenderEmailParams = QueryParams<"/v2/emails/{email_id}/render">;
export type RenderEmailResponse = ResponseBody<"/v2/emails/{email_id}/render", "get">;
export type EmailLogsParams = QueryParams<"/v2/logs/emails">;
export type EmailLogsResponse = ResponseBody<"/v2/logs/emails", "get">;
export type EmailStatsParams = QueryParams<"/v2/reports/emails">;
export type EmailStatsResponse = ResponseBody<"/v2/reports/emails", "get">;
export type ListTemplatesParams = QueryParams<"/templates">;
export type ListTemplatesResponse = ResponseBody<"/templates", "get">;
export type GetTemplateResponse = ResponseBody<"/templates/{template_id}", "get">;
export type CreateTemplateRequest = RequestBody<"/templates", "post">;
export type CreateTemplateResponse = ResponseBody<"/templates", "post">;
export type UpdateTemplateRequest = RequestBody<"/templates/{template_id}", "patch">;
export type UpdateTemplateResponse = ResponseBody<"/templates/{template_id}", "patch">;
export type GetAccountResponse = ResponseBody<"/accounts/self", "get">;
export type UpdateAccountRequest = RequestBody<"/accounts/self", "patch">;
export type UpdateAccountResponse = ResponseBody<"/accounts/self", "patch">;
export type CampaignStatsResponse = ResponseBody<"/reports/campaigns/{campaign_id}", "get">;
export type CampaignLinksStatsParams = QueryParams<"/reports/campaigns/{campaign_id}/links">;
export type CampaignLinksStatsResponse = ResponseBody<"/reports/campaigns/{campaign_id}/links", "get">;
export type AccountStatsResponse = ResponseBody<"/reports/accounts/self", "get">;
export type ListStatsResponse = ResponseBody<"/reports/lists/{list_id}", "get">;
export type ListTasksParams = QueryParams<"/tasks">;
export type ListTasksResponse = ResponseBody<"/tasks", "get">;
export type GetTaskResponse = ResponseBody<"/tasks/{task_id}", "get">;
export type ListFormsResponse = ResponseBody<"/forms", "get">;
export type GetFormResponse = ResponseBody<"/forms/{form_id}", "get">;
export type CreateFormRequest = RequestBody<"/forms", "post">;
export type CreateFormResponse = ResponseBody<"/forms", "post">;
export type ListWebhooksResponse = ResponseBody<"/webhooks", "get">;
export type GetWebhookResponse = ResponseBody<"/webhooks/{webhook_id}", "get">;
export type CreateWebhookRequest = RequestBody<"/webhooks", "post">;
export type CreateWebhookResponse = ResponseBody<"/webhooks", "post">;
export type CampaignStatus = Schemas["CampaignStatus"];
export type ContactStatus = Schemas["ContactStatus"];
export declare enum EmailStatusEnum {
    SUBMITTED = "submitted",
    QUEUED = "queued",
    DELIVERED = "delivered",
    REJECTED = "rejected",
    ERROR = "error",
    OPEN = "open",
    CLICK = "click",
    BOUNCE = "bounce",
    SPAM = "spam",
    UNSUBSCRIBE = "unsubscribe",
    GLOBAL_UNSUBSCRIBE = "global_unsubscribe"
}
export type LogType = Schemas["LogType"];
export type EventType = Schemas["EventType"];
export type APIError = Schemas["HTTPBadRequestError"];
export type ValidationError = Schemas["HTTPValidationError"];
//# sourceMappingURL=schema.d.ts.map