import Page from '../page';
import { Calendar } from '../../pages/components/calendar';
import { MapPopUp } from '../components/mapPopUp';
import Helper from '../../helper/helper';
import { helpers } from '../../fixtures/fixture';

const tenderNameInput = 'input[placeholder="Введіть назву тендера"]';
const tenderNameInputErrorMsg = 'input[placeholder="Введіть назву тендера"] ~ *[data-testid="descriptionError"]';

const serviceNameInputWrapper = '*[class*="CustomSelectWithSearch_searchResult"]';
const serviceNameInput = 'input[data-testid="input-customSelectWithSearch"]';
const serviceNameCrossIcon = 'button[class*="CustomSelectWithSearch_serviceBtn"][data-testid="closeButton"]';
const serviceNameErrorMsg = '*[class*="CustomSelectWithSearch_errorTextVisible"]';
const serviceNameDropdownItems = '*[data-testid="item-customSelectWithSearch"]';
const serviceNameDropdownErrorMsg = '*[data-testid*="notFound-addNewItem"]';
const createServiceBtn = 'button[data-testid="btn-addNewItem"]';
const serviceCategory = '*[class*="CategoryName_category"]';

const startDateInput = '//*[text()="Початок"]/following-sibling::*[contains(@class, "pickersWrapper")]//input';
const endDateInput = '//*[text()="Закінчення"]/following-sibling::*[contains(@class, "pickersWrapper")]//input';
const endDateInputWrapper = '//*[text()="Закінчення"]/following-sibling::*[contains(@class, "pickersWrapper")]//*[contains(@class,"DateContainer_dateWrapper")]';
const endDateInputErrorMsg = '//*[text()="Закінчення"]/following-sibling::*[contains(@class, "DateContainer_errorTextVisible")]';
const tenderProposalPeriodErrorMsg = '*[class*="PeriodOfProposals_errorTextVisible"]';

const workExecutionPeriodInput = '//*[text()="Період виконання робіт (включно)"]/following-sibling::*[contains(@class, "pickersWrapper")]//input';
const workExecutionPeriodErrorMsg = '//*[text()="Період виконання робіт (включно)"]/following-sibling::*[@data-testid="errorMessage"]';

const declaredBudgetInput = '*[class*="CreateItemPrice"] input';
const declaredBudgetErrorMsg = '*[class*="CreateItemPrice"] *[data-testid="descriptionError"]';

const chooseOnMapBtn = 'button[class*="AddressSelectionBlock_locationBtn"]';
const worksLocationLabel = '*[data-testid="mapLabel"]';
const worksLocationErrorMsg = '*[class*="AddressSelectionBlock_errorTextVisible"]';

const additionalInfoInput = 'textarea[data-testid="textAreaInput"]';
const additionalInfoErrorMsg = '*[data-testid="textAreaError"]';
const additionalInfoInputWrapper = '*[data-testid="textAreaDiv"]';

let calendar: Calendar;
let mapPopUp: MapPopUp;
let helper: Helper;
export class GeneralInfoTab extends Page {
    constructor(page: Page['page']) {
        super(page);
        calendar = new Calendar(page);
        mapPopUp = new MapPopUp(page);
        helper = new Helper();
    }

    getGeneralInfoInput(inputName: 'tenderName' | 'serviceName' | 'startDate' | 'endDate' | 'workExecutionPeriod' | 'declaredBudget' | 'worksLocation' | 'additionalInfo') {
        let input: string;
        switch (inputName) {
            case 'tenderName':
                input = tenderNameInput;
                break;
            case 'serviceName':
                input = serviceNameInput;
                break;
            case 'startDate':
                input = startDateInput;
                break;
            case 'endDate':
                input = endDateInput;
                break;
            case 'workExecutionPeriod':
                input = workExecutionPeriodInput;
                break;
            case 'declaredBudget':
                input = declaredBudgetInput;
                break;
            case 'worksLocation':
                input = worksLocationLabel;
                break;
            case 'additionalInfo':
                input = additionalInfoInput;
                break;
            default:
                throw new Error(`Unsupported input name: ${inputName}`);
        }
        return super.getElement(input);
    }

    getInputWrapper(inputName: 'additionalInfo' | 'serviceName' | 'endDate') {
        switch (inputName) {
            case 'additionalInfo':
                return super.getElement(additionalInfoInputWrapper);
            case 'serviceName':
                return super.getElement(serviceNameInputWrapper);
            case 'endDate':
                return super.getElement(endDateInputWrapper);
            default:
                throw new Error(`Unsupported input name wrapper: ${inputName}`);
        }
    }

    getServiceNameInputWrapper() {
        return super.getElement(serviceNameInputWrapper);
    }

    async getGeneralInfoInputValue(inputName: 'startDate' | 'endDate') {
        let input: string;
        switch (inputName) {
            case 'startDate':
                input = startDateInput;
                break;
            case 'endDate':
                input = endDateInput;
                break;
            default:
                throw new Error(`Unsupported input name: ${inputName}`);
        }
        return super.getElementValue(input);
    }

    getGeneralInfoInputErrorMsg(inputName: 'tenderName' | 'serviceName' | 'serviceDropdown' | 'endDate' | 'tenderProposalPeriod' | 'workExecutionPeriod' | 'worksLocation' | 'additionalInfo' | 'declaredBudget') {
        let inputErrorMsg: string;
        switch (inputName) {
            case 'tenderName':
                inputErrorMsg = tenderNameInputErrorMsg;
                break;
            case 'serviceName':
                inputErrorMsg = serviceNameErrorMsg;
                break;
            case 'serviceDropdown':
                inputErrorMsg = serviceNameDropdownErrorMsg;
                break;
            case 'endDate':
                inputErrorMsg = endDateInputErrorMsg;
                break;
            case 'tenderProposalPeriod':
                inputErrorMsg = tenderProposalPeriodErrorMsg;
                break;
            case 'workExecutionPeriod':
                inputErrorMsg = workExecutionPeriodErrorMsg;
                break;
            case 'worksLocation':
                inputErrorMsg = worksLocationErrorMsg;
                break;
            case 'additionalInfo':
                inputErrorMsg = additionalInfoErrorMsg;
                break;
            case 'declaredBudget':
                inputErrorMsg = declaredBudgetErrorMsg;
                break;
            default:
                throw new Error(`Unsupported input name: ${inputName}`);
        }
        return super.getElement(inputErrorMsg);
    }

    getServiceCategory() {
        return super.getElement(serviceCategory);
    }

    getServiceDropdownItems() {
        return super.getElement(serviceNameDropdownItems);
    }

    async clearGeneralInfoInput(inputName: 'tenderName' | 'serviceName' | 'declaredBudget' | 'additionalInfo') {
        let input: string;
        switch (inputName) {
            case 'tenderName':
                input = tenderNameInput;
                break;
            case 'serviceName':
                input = serviceNameInput;
                break;
            case 'declaredBudget':
                input = declaredBudgetInput;
                break;
            case 'additionalInfo':
                input = additionalInfoInput;
                break;
            default:
                throw new Error(`Unsupported input name: ${inputName}`);
        }
        await super.clearElement(input);
    }

    async fillGeneralInfoInput(inputName: 'tenderName' | 'serviceName' | 'startDate' | 'endDate' | 'workExecutionPeriod' | 'declaredBudget' | 'worksLocation' | 'additionalInfo', value?: string | Date | number | any[], dataGenerator?: helpers["dataGenerator"]) {
        let inputValue: string | Date | number | Date[];
        switch (inputName) {
            case 'tenderName':
                inputValue = value as string ?? dataGenerator!.generateRandomText(10, 70);
                await super.type(tenderNameInput, inputValue);
                break;
            case 'serviceName':
                inputValue = value as string ?? await dataGenerator!.getRandomServiceName();
                await super.type(serviceNameInput, inputValue);
                break;
            case 'startDate':
                inputValue = value as Date ?? dataGenerator!.generateFutureDate();
                await super.clickElement(startDateInput);
                await calendar.selectDate(inputValue);
                break;
            case 'endDate':
                if (!value) {
                    let startDate = await this.getGeneralInfoInputValue('startDate');
                    let hoursDifference = dataGenerator!.generateHoursDifference();
                    inputValue = helper.addHoursToDate(startDate, hoursDifference, true);
                } else {
                    inputValue = value as Date;
                }
                await super.clickElement(endDateInput);
                await calendar.selectDate(inputValue);
                break;
            case 'workExecutionPeriod':
                let startWorkExecutionDate: Date;
                let endWorkExecutionDate: Date;
                if (!value) {
                    let endDate = await this.getGeneralInfoInputValue('endDate');
                    startWorkExecutionDate = helper.addDaysToDate(endDate, dataGenerator!.generateDaysDifference(1), true);
                    endWorkExecutionDate = helper.addDaysToDate(startWorkExecutionDate, dataGenerator!.generateDaysDifference(), false, false);
                }
                else {
                    startWorkExecutionDate = value[0];
                    endWorkExecutionDate = value[1];
                }
                await super.clickElement(workExecutionPeriodInput);
                startWorkExecutionDate && await calendar.selectDate(startWorkExecutionDate, false);
                endWorkExecutionDate && await calendar.selectDate(endWorkExecutionDate, false);
                inputValue = [startWorkExecutionDate, endWorkExecutionDate];
                break;
            case 'declaredBudget':
                inputValue = value as number ?? dataGenerator!.generateDeclaredBudget();
                await super.fillElement(declaredBudgetInput, String(inputValue));
                break;
            case 'worksLocation':
                inputValue = value as string ?? dataGenerator!.generateCity();
                await super.clickElement(chooseOnMapBtn);
                await mapPopUp.enterCity(inputValue);
                await mapPopUp.clickConfirmChoiceBtn();
                break;
            case 'additionalInfo':
                inputValue = value as string ?? dataGenerator!.generateRandomText(40, 50);
                await super.type(additionalInfoInput, inputValue);
                break;
            default:
                throw new Error(`Unsupported input name: ${inputName}`);
        }
        return { input: inputName, value: inputValue!};
    }

    async fillGeneralInfoWithRndData(dataGenerator: helpers["dataGenerator"], fieldToSkip: 'tenderName' | 'serviceName' | 'endDate' | "workExecutionPeriod" | "declaredBudget" | 'worksLocation' | 'additionalInfo' | undefined) {
        const fields = ["tenderName", "serviceName", "startDate", "endDate", "workExecutionPeriod", "declaredBudget", "worksLocation", "additionalInfo"] as const;
        const enteredData: any[] = [];
        for (let field of fields) {
            if (field !== fieldToSkip && !(fieldToSkip === 'endDate' && field === 'workExecutionPeriod')) {
                if (field === 'serviceName') {
                    enteredData.push(await this.selectServiceName(undefined, dataGenerator));
                } else {
                    enteredData.push(await this.fillGeneralInfoInput(field, undefined, dataGenerator));
                }
            }
        }
        return enteredData;
    }

    async selectServiceName(value?: string, dataGenerator?: helpers["dataGenerator"]) {
        const enteredData = value ? await this.fillGeneralInfoInput('serviceName', value) : await this.fillGeneralInfoInput('serviceName', undefined, dataGenerator);
        await super.clickElementByIndex(serviceNameDropdownItems, 0);
        return enteredData;
    }

    async clickServiceNameInputCrossIcon() {
        await super.clickElement(serviceNameCrossIcon);
    }

    async clickCreateServiceBtn() {
        await super.clickElement(createServiceBtn);
    }

    async clickChooseOnMapBtn() {
        await super.clickElement(chooseOnMapBtn);
    }
}