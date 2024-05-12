import Page from '../page';

const generalInfoTab = '//span[@data-testid="labelNumber"][text()="1"]';
const generalInfoForm = '*[class*="CreateTenderInfo_container"]';
const documentationTab = '//span[@data-testid="labelNumber"][text()="2"]';
const documentationSectionTitle = '*[class*="DocumentsChoosing_title"]';
const contactsTab = '//span[@data-testid="labelNumber"][text()="3"]';
const contactsSectionTitle = '*[class*="AuthContactCard_title"]';

const nextBtn = 'button[data-testid="nextButton"]';
const backBtn = 'button[data-testid="prevButton"]';

const tenderConfirmPopUpCrossIcon = '*[class*="PopupLayout_wrapper"] *[data-testid="closeIcon"]';
const tenderConfirmPopUpCancelBtn = '//*[contains(@class, "PopupLayout_wrapper")]//button[text()="Скасувати"]';
const tenderConfirmPopUpCreateBtn = '//*[contains(@class, "PopupLayout_wrapper")]//button[text()="Так, створити"]';
const tenderConfirmPopUpMsg = '*[class*="PopupLayout_wrapper"] *[data-testid="text"]';

export class CreateTender extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getSectionTitle(sectionName: string) {
        switch (sectionName) {
            case 'generalInfo':
                return super.getElement(generalInfoForm);
            case 'documentation':
                return super.getElement(documentationSectionTitle);
            case 'contacts':
                return super.getElement(contactsSectionTitle);
            default:
                throw new Error("Invalid section name");
        }
    }

    async handleTab(tabName: string, action: 'get' | 'click') {
        let tabElement: string;
        switch (tabName) {
            case "generalInfo":
                tabElement = generalInfoTab;
                break;
            case "documentation":
                tabElement = documentationTab;
                break;
            case "contacts":
                tabElement = contactsTab;
                break;
            default:
                throw new Error("Invalid tab name");
        }

        if (action === 'click') {
            await super.clickElement(tabElement);
        } else {
            return super.getElement(tabElement);
        }
    }

    async clickNextBtn() {
        await super.clickElement(nextBtn);
    }

    async clickBackBtn() {
        await super.clickElement(backBtn);
    }

    getTenderConfirmPopUpMsg() {
        return super.getElement(tenderConfirmPopUpMsg);
    }

    async clickTenderConfirmPopUp(button: 'crossIcon' | 'cancel' | 'create') {
        switch (button) {
            case 'crossIcon':
                await super.clickElement(tenderConfirmPopUpCrossIcon);
                break;
            case 'cancel':
                await super.clickElement(tenderConfirmPopUpCancelBtn);
                break;
            case 'create':
                await super.clickElement(tenderConfirmPopUpCreateBtn);
                break;       
            default:
                throw new Error("Invalid button name");
        }
    }
}