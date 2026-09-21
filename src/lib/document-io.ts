import { v4 as uuid } from 'uuid';
import type { ModuleDocument } from './types';
import { validateModule } from './schema';
export const CURRENT_SCHEMA_VERSION = 1;
export interface ImportResult {
    document: ModuleDocument;
    warnings: string[];
}
/**
 * Normalises portable JSON before it enters the editor. The import path is kept
 * outside React so migration and UUID regeneration can be unit-tested.
 */
export function prepareImport(value: unknown): ImportResult {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Import failed: JSON must contain a module object.');
    }
    const raw = structuredClone(value) as Record<string, unknown>;
    const warnings: string[] = [];
    const version = Number(raw.schemaVersion ?? 1);
    if (!Number.isInteger(version) || version < 1) {
        raw.schemaVersion = 1;
        warnings.push('Legacy schemaVersion was migrated to version 1.');
    }
    if (Number(raw.schemaVersion) > CURRENT_SCHEMA_VERSION) {
        throw new Error(`Import failed: schema version ${raw.schemaVersion} is newer than this editor supports.`);
    }
    const checked = validateModule(raw as unknown as ModuleDocument);
    if (!checked.success) {
        throw new Error(checked.error.issues.map((issue) => issue.message).join('\n'));
    }
    const imported = checked.data;
    const regenerated: ModuleDocument = {
        ...imported,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        moduleId: uuid(),
        blocks: imported.blocks.map((block, order): ModuleDocument['blocks'][number] => ({ ...block, id: uuid(), order })),
    };
    warnings.push('Module and block UUIDs were regenerated to avoid ID collisions.');
    return { document: regenerated, warnings };
}
export function serializeForExport(document: ModuleDocument): string {
    const checked = validateModule(document);
    if (!checked.success)
        throw new Error(checked.error.issues.map((issue) => issue.message).join('\n'));
    return JSON.stringify({ ...checked.data, schemaVersion: CURRENT_SCHEMA_VERSION }, null, 2);
}

