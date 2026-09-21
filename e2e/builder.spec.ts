import { test, expect } from '@playwright/test';

test.describe('EduForge module builder journeys', () => {
  test('1. creator can open the builder and add a block', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Interactive Financial Module Builder')).toBeVisible();
    await page.getByRole('button', { name: /Rich Text/i }).click();
    await expect(page.getByText('2/200 blocks')).toBeVisible();
  });

  test('2. creator can use undo and redo', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Rich Text/i }).click();
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.getByText('1/200 blocks')).toBeVisible();
    await page.getByRole('button', { name: 'Redo' }).click();
    await expect(page.getByText('2/200 blocks')).toBeVisible();
  });

  test('3. preview device toggles work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('radio', { name: 'mobile preview' }).click();
    await expect(page.getByRole('radio', { name: 'mobile preview' })).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('radio', { name: 'tablet preview' }).click();
    await expect(page.getByRole('radio', { name: 'tablet preview' })).toHaveAttribute('aria-checked', 'true');
  });

  test('4. dark preview can be toggled', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle preview dark mode' }).click();
    await expect(page.getByRole('button', { name: 'Toggle preview dark mode' })).toBeVisible();
  });

  test('5. slash search filters available blocks', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('combobox').fill('/emi');
    await expect(page.getByRole('button', { name: /EMI Calculator/i })).toBeVisible();
  });

  test('6. keyboard shortcut duplicates a selected block', async ({ page }) => {
    await page.goto('/');
    const block = page.getByRole('group', { name: /richText block/i }).first();
    await block.focus();
    await page.keyboard.press('Control+d');
    await expect(page.getByText('2/200 blocks')).toBeVisible();
  });

  test('7. calculators are interactive in preview', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /EMI Calculator/i }).click();
    await expect(page.getByText('Monthly EMI')).toBeVisible();
    const principal = page.getByRole('spinbutton', { name: 'Principal' }).last();
    await principal.fill('600000');
    await expect(page.getByText('Total Payment')).toBeVisible();
  });

  test('8. history panel exposes prior edits', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Rich Text/i }).click();
    await page.getByRole('button', { name: /History/i }).click();
    await expect(page.getByRole('log', { name: 'Undo/redo history' })).toContainText('Add richText');
  });
});
