import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  testMatch: ['tests/sections/sections.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 3,
  //workers: process.env.CI ? 1 : undefined,
  timeout: 1200000,
  reporter: [['dot']],// ['allure-playwright']],
  use: {

    baseURL: 'https://stage.rentzila.com.ua/',
    screenshot: 'off',
    video: 'off',
    trace: 'on',
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
      testIgnore: ['sections-mobile.spec.ts']
    },
    {
      name: 'Iphone 14 Pro Max',
      use: {
        ...devices['iPhone 14 Pro Max'],
        isMobile: true,
        hasTouch: true
      },
      testMatch: ['sections-mobile.spec.ts']
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
