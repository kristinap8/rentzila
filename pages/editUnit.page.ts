import Page from './page';

const title: string = 'div[class*="CreateEditFlowLayout_title"]';
const saveBtn: string = 'button[data-testid="nextButton"]';
const cancelChangesBtn: string = 'button[data-testid="prevButton"]';

const completeEditingTitle: string = 'div[class*="SuccessfullyCreatedPage_finishTitle"]';
const goToMyUnitsBtn: string = 'div[class*="SuccessfullyCreatedPage_buttonWrapper"] button';

const unitNameInput: string = 'input[placeholder="Введіть назву оголошення"]';
const unitNameInputErrorMsg: string = 'input[placeholder="Введіть назву оголошення"]~div[data-testid="descriptionError"]';

const manufacturerInputCloseBtn: string = 'div[class*="SelectManufacturer_wrapper"] button[data-testid="closeButton"]';
const manufacturerInput: string = '*[class*="SelectManufacturer_wrapper"] input';
const manufacturerText: string = '*[class*="SelectManufacturer_wrapper"] div[class*="serviceText"]';
const manufacturerInputBorder: string = 'div[class*="SelectManufacturer_wrapper"] div[class*="searchResult"]';
const nonFoundManufacturerErrorMsg: string = 'div[class*="SelectManufacturer_wrapper"] p[data-testid*="addNewItem"]';
const manufacturerInputErrorMsg: string = 'div[class*="SelectManufacturer_wrapper"] div[class*="errorText"]';
const manufacturerDropdownItems: string = 'div[class*="SelectManufacturer_wrapper"] div[data-testid="item-customSelectWithSearch"]';
const manufacturerDropdownItem =  (manufacturerName: string): string => `//div[contains(@class,"SelectManufacturer_wrapper")]//div[@data-testid="item-customSelectWithSearch" and text()="${manufacturerName}"]`;

const modelInput: string = '//*[text()="Назва моделі"]/..//input';
const modelInputErrorMsg: string = '//*[text()="Назва моделі"]/..//*[@data-testid="descriptionError"]';

const technicalFeaturesInput: string = '//*[text()="Технічні характеристики"]/..//textarea';

const descriptionInput: string = '//*[text()="Детальний опис"]/..//textarea';

const chooseOnMapBtn: string = 'button[class*="locationBtn"]';

export class EditUnit extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getTitle() {
        return super.getElement(title);
    }

    getCompleteEditingTitle() {
        return super.getElement(completeEditingTitle);
    }

    getGoToMyUnitsBtn() {
        return super.getElement(goToMyUnitsBtn);
    }

    getManufacturerDropdownItems() {
        return super.getElement(manufacturerDropdownItems);
    }

    getManufacturerInputCloseBtn() {
        return super.getElement(manufacturerInputCloseBtn);
    }

    getManufacturerText() {
        return super.getElement(manufacturerText);
    }

    async clickSaveBtn() {
        await super.clickElement(saveBtn);
    }

    async clickCancelChangesBtn() {
        await super.clickElement(cancelChangesBtn);
    }

    async clickGoToMyUnitsBtn() {
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            await super.clickElement(goToMyUnitsBtn)
        ]);
    }

    async selectManufacturerItem(manufacturerName: string) {
        await super.clickElement(manufacturerDropdownItem(manufacturerName));
    }

    async clickChooseOnMapBtn() {
        await super.clickElement(chooseOnMapBtn);
    }

    getInput(inputName: 'unitName' | 'manufacturer' | 'model' | 'technical features' | 'description', border: boolean = false) {
        switch (inputName) {
            case 'unitName':
                return super.getElement(unitNameInput);
            case 'manufacturer':
                return border ? super.getElement(manufacturerInputBorder) : super.getElement(manufacturerInput);
            case 'model':
                return super.getElement(modelInput);
            case 'technical features':
                return super.getElement(technicalFeaturesInput);
            case 'description':
                return super.getElement(descriptionInput);
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }

    getInputErrorMsg(inputName: 'unitName' | 'manufacturer' | 'model', dropdown: boolean = false) {
        switch (inputName) {
            case 'unitName':
                return super.getElement(unitNameInputErrorMsg);
            case 'manufacturer':
                return dropdown ? super.getElement(nonFoundManufacturerErrorMsg) : super.getElement(manufacturerInputErrorMsg);
            case 'model':
                return super.getElement(modelInputErrorMsg);
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }

    async fillInput(inputName: 'unitName' | 'manufacturer' | 'model' | 'technical features' | 'description', value: string, clear: boolean=true, clearByCrossBtn?: boolean) {
        switch (inputName) {
            case 'unitName':
                clear && await super.clearElement(unitNameInput);
                await super.type(unitNameInput, value);
                break;
            case 'manufacturer':
                clear && await super.clearElement(manufacturerInput);
                clearByCrossBtn && await super.clickElement(manufacturerInputCloseBtn);
                await super.type(manufacturerInput, value);
                break;
            case 'model':
                clear && await super.clearElement(modelInput);
                await super.type(modelInput, value);
                break;
            case 'technical features':
                clear && await super.clearElement(technicalFeaturesInput);
                await super.fillElement(technicalFeaturesInput, value);
                break;
            case 'description':
                clear && await super.clearElement(descriptionInput);
                await super.fillElement(descriptionInput, value);
                break;
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
    }
}