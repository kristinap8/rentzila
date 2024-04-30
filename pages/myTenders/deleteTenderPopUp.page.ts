import Page from '../page';

const title: string = 'div[class*="PopupLayout_label"]';
const deleteBtn: string = '//div[contains(@class,"DialogPopup")]//button[text()="Видалити"]';

export class DeleteTenderPopUp extends Page {
    getTitle() {
        return super.getElement(title);
    }
    async clickDeleteBtn() {
        await super.clickElement(deleteBtn);
    }
};