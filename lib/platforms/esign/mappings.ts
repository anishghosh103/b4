import { EsignEventType } from '../../types/unified-events';

export const PANDADOC_EVENT_MAPPINGS: Record<string, EsignEventType> = {
  document_state_changed: 'document.sent',
  recipient_completed: 'document.signed',
  document_completed: 'document.completed',
  document_deleted: 'document.cancelled',
};

export const DOCUSIGN_EVENT_MAPPINGS: Record<string, EsignEventType> = {
  'envelope-sent': 'document.sent',
  'recipient-completed': 'document.signed',
  'envelope-completed': 'document.completed',
  'envelope-voided': 'document.cancelled',
};

export const DOCUMENSO_EVENT_MAPPINGS: Record<string, EsignEventType> = {
  'document.sent': 'document.sent',
  'document.signed': 'document.signed',
  'document.completed': 'document.completed',
};
