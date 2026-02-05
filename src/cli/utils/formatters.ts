import Table from 'cli-table3';
import chalk from 'chalk';

export function formatTable(headers: string[], rows: string[][]): string {
  const table = new Table({
    head: headers.map((h) => chalk.cyan(h)),
    style: { head: [], border: [] },
  });

  rows.forEach((row) => table.push(row));
  return table.toString();
}

export function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function formatSuccess(message: string): string {
  return chalk.green('✓ ') + message;
}

export function formatError(message: string): string {
  return chalk.red('✗ ') + message;
}

export function formatWarning(message: string): string {
  return chalk.yellow('⚠ ') + message;
}

export function formatInfo(message: string): string {
  return chalk.blue('ℹ ') + message;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
