export function rowsToCsv(rows: Array<Record<string, unknown>>): string {
    if (!rows.length)
        return '';
    const headers = Object.keys(rows[0]);
    const esc = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
    return [headers.join(','), ...rows.map(row => headers.map(h => esc(row[h])).join(','))].join('\n');
}
export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
    const blob = new Blob([rowsToCsv(rows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

