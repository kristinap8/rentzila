import { expect } from '@playwright/test';
import { Page as PlaywrightPage } from 'playwright';

const loaderIcon = '*[data-testid="preloader"]';

export default class Page {

  constructor(public page: PlaywrightPage) {
    this.page = page;
  }

  async openUrl(url: string = '/') {
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async waitForPageLoad() {
    (await this.getElementsCount(loaderIcon) > 0) && await this.waitForSelector(loaderIcon, 'detached');
  }

  // async addLocatorHandler(element: Locator, action: void) {
  //   await this.page.addLocatorHandler(element, async () => {
  //     action;
  //   });
  // }

  getElement(locator: string) {
    return this.page.locator(locator);
  }

  async getElementAttribute(locator: string, attribute: string) {
    return this.page.locator(locator).getAttribute(attribute);
  }

  async getElementByText(text: string) {
    return this.page.getByText(text, { exact: true });
  }

  getElementByLocatorAndText(locator: string, text: string, exact: boolean = true) {
    return this.getElement(locator).getByText(text, { exact: exact });
  }

  async clickElementByLocatorAndText(locator: string, text: string, exact: boolean = true) {
    await this.getElementByLocatorAndText(locator, text, exact).click();
  }

  async getElementByIndex(locator: string, index: number) {
    return this.page.locator(locator).nth(index);
  }

  async getElementsArray(locator: string) {
    return this.page.locator(locator).all();
  }

  async getElementsArrayTexts(locator: string) {
    return this.page.locator(locator).allTextContents();
  }

  async getElementText(locator: string) {
    return await this.page.locator(locator).textContent();
  }

  async getElementValue(locator: string) {
    return await this.page.locator(locator).inputValue();
  }

  async clickElement(locator: string, force: boolean = false) {
    await this.getElement(locator).click({ force });
  }

  async clickElementByIndex(locator: string, index: number) {
    await (await this.getElementByIndex(locator, index)).click();
  }

  async pressEnter() {
    await this.page.keyboard.press('Enter');
  }

  async copy() {
    await this.page.keyboard.press("Control+C");
  }

  async paste() {
    await this.page.keyboard.press("Control+V");
  }

  async scrollToElement(locator: string) {
    await this.getElement(locator).scrollIntoViewIfNeeded();
  }

  async pause(miliseconds: number) {
    await this.page.waitForTimeout(miliseconds);
  }

  async fillElement(locator: string, text: string) {
    await this.page.fill(locator, text);
  }

  async type(locator: string, text: string) {
    await this.getElement(locator).pressSequentially(text);
  }

  async clearElement(locator: string) {
    await this.getElement(locator).clear();
  }

  async clearElementByCharacter(locator: string) {
    const valueLength = (await this.getElementValue(locator)).length;
    for (let i = 0; i < valueLength; i++) {
      await this.getElement(locator).press('ArrowRight');
      await this.getElement(locator).press('Backspace');
    }
  }

  async hoverElementByLocatorAndText(locator: string, text: string) {
    await (this.getElementByLocatorAndText(locator, text)).hover();
  }

  async refresh() {
    await this.page.reload();
  }

  async focus(locator: string) {
    await this.getElement(locator).focus();
  }

  async unfocus(locator: string) {
    await this.getElement(locator).blur();
  }

  async checkFrameElement(frameLocator: string, elementLocator: string) {
    await this.page.frameLocator(frameLocator).locator(elementLocator).click();
  }

  async getElementsCount(locator: string) {
    return await this.getElement(locator).count();
  }

  async uncheckElement(locator: string) {
    await this.getElement(locator).uncheck();
  }

  async uploadFiles(locator: string, files: string[]) {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      await this.getElement(locator).setInputFiles(files)
    ]);
  }

  async handleDialog(action: string, dialogMsg?: string) {
    this.page.once('dialog', async dialog => {
      if (dialogMsg) {
        expect(dialog.message()).toBe(dialogMsg);
      }
      if (action === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    })
  }

  async waitForLoadState(state: "networkidle" | "load" | "domcontentloaded") {
    await this.page.waitForLoadState(state);
  }

  async waitForResponse(url: string, status: number) {
    await this.page.waitForResponse(resp => resp.url().includes(url) && resp.status() === status);
  }

  async waitForSelector(selector: string, state: 'detached' | 'visible' | 'attached') {
    await this.page.waitForSelector(selector, { state: state })
  }

  async waitforUrl(url: string = '') {
    await this.page.waitForURL(url);
  }

  //mobile gestures
  async tapElement(selector: string) {
    await this.getElement(selector).tap();
  }

  async tapElementByIndex(selector: string, index: number) {
    await (await this.getElementByIndex(selector, index)).tap();
  }
}