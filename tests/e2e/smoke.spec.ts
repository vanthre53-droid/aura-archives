import { test, expect } from '@playwright/test'

test.describe('storefront smoke', () => {
  test('home page renders the brand and concierge', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Aura Archives/i)
    // The concierge launcher is mounted on every shop page.
    await expect(page.getByRole('button', { name: /open concierge chat/i })).toBeVisible()
  })

  test('concierge opens on click', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /open concierge chat/i }).click()
    await expect(page.getByRole('dialog', { name: /concierge/i })).toBeVisible()
  })
})
