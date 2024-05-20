import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 120000,
  reporter: [['dot']],
  use: {

    baseURL: 'https://stage.rentzila.com.ua/',
    screenshot: 'off',
    video: 'off',
    trace: 'retain-on-failure',
    headless: true,
    locale: 'uk-UA',
    timezoneId: 'Europe/Kiev'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        isMobile: false
      },
      testIgnore: ['**-mobile.spec.ts']
    },
    {
      name: 'Iphone 14 Pro Max',
      use: {
        ...devices['iPhone 14 Pro Max'],
        isMobile: true,
        hasTouch: true
      },
      testMatch: ['**-mobile.spec.ts']
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // }
  ]
});
