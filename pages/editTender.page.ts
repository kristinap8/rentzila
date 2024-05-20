import Page from './page';

const tenderNameInput = 'input[placeholder="Введіть назву тендера"]';
const tenderNameInputErrorMsg = 'input[placeholder="Введіть назву тендера"] ~ *[data-testid="descriptionError"]';

const serviceInputCrossIcon = 'button[class*="CustomSelectWithSearch_serviceBtn"]';
const serviceNameInputWrapper = '*[class*="CustomSelectWithSearch_searchResult"]';
const serviceNameInput = '*[class*="CreateTenderInfo_serviceInfo"] ~ *[data-testid*="customSelectWithSearch"] input';
const serviceName = '*[class*="CreateTenderInfo_serviceInfo"] ~ *[data-testid*="customSelectWithSearch"]  *[class*="serviceText"]';
const serviceNameInputErrorMsg = '*[class*="CreateTenderInfo_serviceParagraph"]~*[data-testid*="customSelectWithSearch"]  *[class*="errorTextVisible"]';
const servicesDropdown = '*[class*="searchedServicesCat"]';
const servicesDropdownItems = '*[class*="searchedServicesCat"] *[class*="searchListItem"]';

const startDateInput = '//*[text()="Початок"]/following-sibling::*[contains(@class, "pickersWrapper")]//input';
const endDateInput = '//*[text()="Закінчення"]/following-sibling::*[contains(@class, "pickersWrapper")]//input';
const worksExecutionPeriod = '//*[text()="Період виконання робіт (включно)"]/following-sibling::*[contains(@class, "pickersWrapper")]//input';

const declaredBudgetInput = '*[class*="CreateItemPrice"] input';
const declaredBudgetErrorMsg = '*[class*="CreateItemPrice"] *[data-testid="descriptionError"]';

const additionalInfoInput = 'textarea[data-testid="textAreaInput"]';
const additionalInfoErrorMsg = '*[data-testid="textAreaError"]';
const additionalInfoInputWrapper = '*[data-testid="textAreaDiv"]';

const trashBinBtn = '*[data-testid="deleteFile"]';

const saveChangesBtn = '*[data-testid="nextButton"]';

export class EditTender extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getEditTenderFormInput(inputName: 'tenderName' | 'serviceName' | 'startDate' | 'endDate' | 'worksExecutionPeriod' | 'declaredBudget' | 'additionalInfo') {
        switch (inputName) {
            case 'tenderName':
                return super.getElement(tenderNameInput);
            case 'serviceName':
                return super.getElement(serviceNameInput);
            case 'startDate':
                return super.getElement(startDateInput);
            case 'endDate':
                return super.getElement(endDateInput);
            case 'worksExecutionPeriod':
                return super.getElement(worksExecutionPeriod);
            case 'declaredBudget':
                return super.getElement(declaredBudgetInput);
            case 'additionalInfo':
                return super.getElement(additionalInfoInput);
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }

    getEditTenderFormInputErrorState(inputName: 'tenderName' | 'serviceName' | 'declaredBudget' | 'additionalInfo') {
        switch (inputName) {
            case 'tenderName':
                return super.getElement(tenderNameInput);
            case 'serviceName':
                return super.getElement(serviceNameInputWrapper);
            case 'declaredBudget':
                return super.getElement(declaredBudgetInput);
            case 'additionalInfo':
                return super.getElement(additionalInfoInputWrapper);
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }

    getEditTenderFormInputErrorMsg(inputName: 'tenderName' | 'serviceName' | 'declaredBudget' | 'additionalInfo') {
        switch (inputName) {
            case 'tenderName':
                return super.getElement(tenderNameInputErrorMsg);
            case 'serviceName':
                return super.getElement(serviceNameInputErrorMsg);
            case 'declaredBudget':
                return super.getElement(declaredBudgetErrorMsg);
            case 'additionalInfo':
                return super.getElement(additionalInfoErrorMsg);
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }

    getServiceName() {
        return super.getElement(serviceName);
    }

    getServicesDropdown() {
        return super.getElement(servicesDropdown);
    }

    getServicesDropdownItems() {
        return super.getElement(servicesDropdownItems);
    }

    async getServicesDropdownItemsText() {
        return await super.getElementsArrayTexts(servicesDropdownItems);
    }

    async selectFirstServiceNameFromDropdown() {
        await super.clickElementByIndex(servicesDropdownItems, 0);
    }

    async fillEditTenderFormInput(inputName: 'tenderName' | 'serviceName' | 'declaredBudget' | 'additionalInfo', value: string) {
        switch (inputName) {
            case 'tenderName':
                await super.type(tenderNameInput, value);
                break;
            case 'serviceName':
                await super.fillElement(serviceNameInput, value);
                break;
            case 'declaredBudget':
                await super.fillElement(declaredBudgetInput, value);
                break;
            case 'additionalInfo':
                await super.fillElement(additionalInfoInput, value);
                break;
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }

    async clearEditTenderFormInput(inputName: 'tenderName' | 'serviceName' | 'declaredBudget' | 'additionalInfo') {
        switch (inputName) {
            case 'tenderName':
                await super.clearElement(tenderNameInput);
                break;
            case 'serviceName':
                await super.clickElement(serviceInputCrossIcon);
                break;
            case 'declaredBudget':
                await super.clickElement(declaredBudgetInput);
                break;
            case 'additionalInfo':
                await super.clickElement(additionalInfoInput);
                break;
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }

    async clickSaveChangesBtn() {
        await super.clickElement(saveChangesBtn);
    }
}