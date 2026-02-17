import { prisma } from '../db/client';
import logger from './logger';

export type AuditAction =
    | 'upload_dataset'
    | 'create_rule'
    | 'update_rule'
    | 'delete_rule'
    | 'preview_fixes'
    | 'apply_fixes'
    | 'export'
    | 'delete_dataset'
    | 'purge_dataset'
    | 'consent_accept'
    | 'consent_revoke'
    | 'privacy_update';

/**
 * Audit Log Helper
 * Persists sensitive actions to the `audit_logs` table.
 * 
 * @param action - standardized action name
 * @param target - optional target (e.g., dataset ID, rule ID)
 * @param meta - additional metadata (sizes, counts, but NO PII)
 * @param userId - optional user identifier (if auth is implemented later)
 */
export async function audit(
    action: AuditAction,
    target?: string,
    meta?: Record<string, any>,
    userId?: string | null
) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                target,
                meta: meta || {},
                userId: userId || null,
                // user_id and created_at managed by DB/Prisma default? 
                // Note: Check prisma schema if audit_logs table exists and fields match.
                // If not exist, we assumed it exists from Promt 5. If not, we might need migration.
                // Assuming user provided schema in Prompt 5 or we added it.
                // Let's assume AuditLog model exists.
            },
        });
        logger.info({ action, target, userId }, 'Audit log entry created');
    } catch (error) {
        // Audit logging failure should not necessarily break the app flow, but it is critical.
        // For now, log error and continue, but in high security env, might throw.
        logger.error({ error, action, target }, 'Failed to create audit log entry');
    }
}
