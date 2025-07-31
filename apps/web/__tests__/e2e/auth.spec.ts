import { test, expect } from "@playwright/test";

test("Should Login", async ({ page }) => {
  await page.goto("http://localhost:3000/api/auth/signin");

  // Click the login button.
  await page.getByRole("button").click();

  // Wait for redirection to Keycloak
  await page.waitForURL("**/realms/**", { timeout: 1000000 });

  // Verify we're on Keycloak login page
  await expect(page).toHaveURL(/\/realms/);

  // Check for Keycloak login form elements
  await expect(page.locator('#username, input[name="username"]')).toBeVisible();
  await expect(page.locator('#password, input[name="password"]')).toBeVisible();
  await expect(
    page.locator('input[type="submit"], button[type="submit"]')
  ).toBeVisible();

  // Fill in the login form
  await page.fill('#username, input[name="username"]', "david.pardo");
  await page.fill('#password, input[name="password"]', "test_password#");
  await page.click('input[type="submit"], button[type="submit"]');

  // Wait for redirection back to the app
  await page.waitForURL("http://localhost:3000/**");
  await expect(page).toHaveURL(/localhost:3000/);
});

