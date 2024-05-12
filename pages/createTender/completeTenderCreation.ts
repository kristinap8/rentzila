import Page from '../page';

const title = '*[class*="SuccessfullyCreatedPage_finishTitle"]';
const message = '*[class*="SuccessfullyCreatedPage_finishText2"]';
const viewInMyTendersBtn = '//*[contains(@class,"SuccessfullyCreatedPage")]//button[text()="Переглянути в моїх тендерах"]';

export class CompleteTenderCreation extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getTitle() {
        return super.getElement(title);
    }

    getMessage() {
        return super.getElement(message);
    }

    async clickViewInMyTendersBtn() {
        await super.clickElement(viewInMyTendersBtn);
    }
}