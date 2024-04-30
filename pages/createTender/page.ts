import Page from '../page';

const generalInfoTab: string = '//span[@data-testid="labelNumber"][text()="1"]';
const generalInfoForm: string = 'div[class*="CreateTenderInfo_container"]';
const tenderNameInput: string = 'input[placeholder="Введіть назву тендера"]';
const tenderNameErrorMsg: string = 'input[placeholder="Введіть назву тендера"] ~ div[data-testid="descriptionError"]';
const serviceNameField: string = 'div[class*="CustomSelectWithSearch_searchResult"]';
const serviceNameErrorMsg: string = 'div[class*="CustomSelectWithSearch_errorTextVisible"]';
const serviceDropdownErrorMsg: string = '*[data-testid="p2-notFound-addNewItem"]';
const startDateField: string = '//div[text()="Початок"]/following-sibling::div/div[contains(@class, "DateContainer_dateWrapper")]';
const endDateField: string = '//div[text()="Закінчення"]/following-sibling::div[contains(@class, "pickersWrapper")]/div[contains(@class, "dateWrapper")]';
const endDateErrorMsg: string = '//div[text()="Закінчення"]/following-sibling::div[contains(@class, "DateContainer_errorTextVisible")]';
const tenderProposalPeriodErrorMsg: string = 'div[class*="PeriodOfProposals_errorTextVisible"]';
const declaredBudgetInput: string = 'div[class*="CreateItemPrice"] input';
const declaredBudgetErrorMsg: string = 'div[class*="CreateItemPrice"] div[data-testid="descriptionError"]';
const worksLocationField: string = '*[data-testid="mapLabel"]';
const worksLocationErrorMsg: string = 'div[class*="AddressSelectionBlock_errorTextVisible"]';
const additionalInfoField: string = 'div[data-testid="textAreaDiv"]';
const additionalInfoErrorMsg: string = 'div[data-testid="textAreaError"]';

const documentationTab: string = '//span[@data-testid="labelNumber"][text()="2"]';
const documentationSectionTitle: string = 'div[class*="DocumentsChoosing_title"]';
const fileUploadArea: string = 'div[data-testid="dropDiv"]';
const fileUploadErrorMsg: string = 'div[class*="DocumentsChoosing_errorTextVisible"]';

const contactsTab: string = '//span[@data-testid="labelNumber"][text()="3"]';
const contactsSectionTitle: string = 'div[class*="AuthContactCard_title"]';
const surnameInput: string = 'input[name="fNameOperator"]';
const surnameErrorMsg: string = 'input[name="fNameOperator"] ~ div[data-testid="errorDescr"]';
const nameInput: string = 'input[name="lNameOperator"]';
const nameErrorMsg: string = 'input[name="lNameOperator"] ~ div[data-testid="errorDescr"]';
const phoneInput: string = '#mobile';
const phoneErrorMsg: string = '#mobile ~ *[data-testid="errorMessage"]';

const nextBtn: string = 'button[data-testid="nextButton"]';
const backBtn: string = 'button[data-testid="prevButton"]';

const tenderConfirmPopUpCrossBtn: string = 'div[class*="PopupLayout_wrapper"] div[data-testid="closeIcon"]';
const tenderConfirmPopUpCancelBtn: string = '//div[contains(@class, "PopupLayout_wrapper")]//button[text()="Скасувати"]';
const tenderConfirmPopUpCreateBtn: string = '//div[contains(@class, "PopupLayout_wrapper")]//button[text()="Так, створити"]';
const tenderConfirmPopUpMsg: string = 'div[class*="PopupLayout_wrapper"] div[data-testid="text"]';

export class CreateTender extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getSectionTitle(sectionName: string) {
        switch (sectionName) {
            case 'generalInfo':
                return await super.getElement(generalInfoForm);
            case 'documentation':
                return await super.getElement(documentationSectionTitle);
            case 'contacts':
                return await super.getElement(contactsSectionTitle);
            default:
                throw new Error("Invalid section name");
        }
    }

    async getFieldBoarder(fieldName: string) {
        switch (fieldName) {
            case "tenderName":
                return super.getElement(tenderNameInput);
            case "serviceName":
                return super.getElement(serviceNameField);
            case "startDate":
                return super.getElement(startDateField);
            case "endDate":
                return super.getElement(endDateField);
            case "declaredBudget":
                return super.getElement(declaredBudgetInput);
            case "worksLocation":
                return super.getElement(worksLocationField);
            case "additionalInfo":
                return super.getElement(additionalInfoField);
            case "fileUpload":
                return super.getElement(fileUploadArea);
            case "surname":
                return super.getElement(surnameInput);
            case "name":
                return super.getElement(nameInput);
            case "phone":
                return super.getElement(phoneInput);
            default:
                throw new Error("Invalid field name");
        }
    }

    async getFieldErrorMsg(fieldName: string) {
        switch (fieldName) {
            case "tenderName":
                return await super.getElement(tenderNameErrorMsg);
            case "serviceName":
                return await super.getElement(serviceNameErrorMsg);
            case "serviceDropdown":
                return await super.getElement(serviceDropdownErrorMsg);
            case "endDate":
                return await super.getElement(endDateErrorMsg);
            case "tenderProposalPeriod":
                return await super.getElement(tenderProposalPeriodErrorMsg);
            case "declaredBudget":
                return await super.getElement(declaredBudgetErrorMsg);
            case "worksLocation":
                return await super.getElement(worksLocationErrorMsg);
            case "additionalInfo":
                return await super.getElement(additionalInfoErrorMsg);
            case "fileUpload":
                return await super.getElement(fileUploadErrorMsg);
            case "surname":
                return await super.getElement(surnameErrorMsg);
            case "name":
                return await super.getElement(nameErrorMsg);
            case "phone":
                return await super.getElement(phoneErrorMsg);
            default:
                throw new Error("Invalid field name");
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
            return await super.getElement(tabElement);
        }
    }

    async clickNextBtn() {
        await super.clickElement(nextBtn);
    }

    async clickBackBtn() {
        await super.clickElement(backBtn);
    }

    async getTenderConfirmPopUpMsg() {
        return await super.getElement(tenderConfirmPopUpMsg);
    }

    async clickTenderConfirmPopUp(button: 'cross' | 'cancel' | 'create') {
        switch (button) {
            case 'cross':
                await super.clickElement(tenderConfirmPopUpCrossBtn);
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