# Rentzila -- testing using Playwright + TypeScript

## Table of Contents

1. [Summary of Repo](#summary-of-repo)
2. [Requirements](#requirements)
3. [Steps to Install](#steps-to-install)
4. [Steps to Launch](#steps-to-launch)
5. [Create a Report](#create-a-report)

## Summary of Repo

This repository contains automated tests for Rentzila website implemented using Playwright. <br>
The deployed GitHub Pages allure report can be found with the following [link](https://kristinap8.github.io/rentzila-playwright/5/).

## Requirements

- **Node.js:** Make sure you have Node.js installed.
- **Java 8 or higher:** Required for working with Allure.
- **Other dependencies:** Check the `package.json` file for additional dependencies.

## Steps to Install

1. Clone This Repository:

```bash
git clone https://github.com/kristinap8/rentzila-playwright.git
```

2. Navigate to the Project Directory:

```bash
cd rentzila-playwright
```

3. Install Project Dependencies:

```bash
npm install
```

## Steps to Launch:

1. Run All Tests in Chrome:

```bash
npm run test
```

2. Run All Tests in Chrome in headed mode:

```bash
npm run test-with-ui
```


## Create a report

1. Create an Allure Report for Tests Run in Chrome Browser:

```bash
npm run generate-allure-report
```

2. Open Allure Report:

```bash
npm run open-allure-report
```

5. Run All Tests in Chrome Browser, Generate and Open Allure Report:

```bash
npm run test-and-report
```