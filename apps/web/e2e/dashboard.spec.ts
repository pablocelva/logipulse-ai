import { test, expect } from '@playwright/test';

test.describe('Dashboard Page E2E', () => {
  test('debe cargar la pagina principal con el titulo y secciones principales', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Verificar Header
    await expect(page.locator('h1')).toContainText('LogiPulse');

    // Verificar presencia de secciones
    await expect(page.getByText('Monitoreo GPS en Tiempo Real')).toBeVisible();
    await expect(page.getByText('AI Incident Assistant')).toBeVisible();
    await expect(page.getByText('Órdenes de Despacho')).toBeVisible();
  });
});
