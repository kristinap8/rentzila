import Page from '../page';

const title: string = 'div[class*="PopupLayout_label"]';
const closeBtn: string = '//div[contains(@class,"DialogPopup")]//button[text()="Завершити"]';

export class CloseTenderPopUp extends Page {
    getTitle() {
        return super.getElement(title);
    }
    async clickCloseBtn() {
        await super.clickElement(closeBtn);
    }
};