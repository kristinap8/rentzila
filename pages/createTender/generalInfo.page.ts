import Page from '../page';
import DataGenerator from './../../helper/dataGenerator.helper';
import CreateTenderData from './../../fixtures/createTenderData.json';
import { DateTime } from "luxon";

const tenderNameInput: string = 'input[placeholder="Введіть назву тендера"]';
const serviceNameInput: string = 'input[data-testid="input-customSelectWithSearch"]';
const serviceNameCloseIcon: string = 'button[class*="CustomSelectWithSearch_serviceBtn"][data-testid="closeButton"]';
const serviceNameDropdown: string = 'div[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]';
const serviceNameDropdownItems: string = 'div[data-testid="item-customSelectWithSearch"]';
const createServiceBtn: string = 'button[data-testid="btn-addNewItem"]';
const tenderCategoryLabel: string = 'div[data-testid="categoryWrapper"] span';
const startDateInput: string = '//div[text()="Початок"]/following-sibling::div[contains(@class, "pickersWrapper")]//input';
const datePickerDates: string = 'div[class*="datepicker__day"]';
const datePickerTime: string = 'li[class*="datepicker__time"]';
const endDateInput: string = '//div[text()="Закінчення"]/following-sibling::div[contains(@class, "pickersWrapper")]//input';
const workExecutionPeriodInput: string = '//div[text()="Період виконання робіт (включно)"]/following-sibling::div[contains(@class, "pickersWrapper")]//input';
const declaredBudgetInput: string = 'div[class*="CreateItemPrice"] input';
const chooseOnMapBtn: string = 'button[class*="AddressSelectionBlock_locationBtn"]';
const additionalInfoInput: string = 'textarea[data-testid="textAreaInput"]';

const settlementInput: string = 'input[data-testid="cityInput"]';
const settlementDropdownItems: string = '*[data-testid="places"]>li';
const confirmChoiceBtn: string = '//button[text()="Підтвердити вибір"]';

let dataGenerator: DataGenerator;

export class GeneralInfo extends Page {
    constructor(page: Page['page']) {
        super(page);
        dataGenerator = new DataGenerator();
    }

    async getInput(inputName: string) {
        switch (inputName) {
            case "tenderName":
                return super.getElement(tenderNameInput);
            case "serviceName":
                return super.getElement(serviceNameInput);
            case "endDate":
                return super.getElement(endDateInput);
            case "workExecutionPeriod":
                return super.getElement(workExecutionPeriodInput);
            case "declaredBudget":
                return super.getElement(declaredBudgetInput);
            // case "worksLocation":
            //     return super.getElement(worksLocation);
            case "additionalInfo":
                return super.getElement(additionalInfoInput);
            default:
                throw new Error("Invalid input name");
        }
    }

    async fillInput(inputName: string, data: string, selectService: boolean = true, tenderSubmissionPeriodTimeDiff: number = 24) {
        switch (inputName) {
            case "tenderName":
            case "serviceName":
            case "declaredBudget":
            case "additionalInfo":
                await super.fillElement(eval(inputName + 'Input'), data);
                if (selectService && inputName === "serviceName") {
                    await super.clickElementByIndex(serviceNameDropdownItems, 0);
                }
                break;
            case "endDate":
                await this.fillEndDate(tenderSubmissionPeriodTimeDiff);
                break;
            case "workExecutionPeriod":
                await this.fillWorkExecutionPeriod();
                break;
            case "worksLocation":
                await this.fillWorksLocation(data);
                break;
            default:
                throw new Error("Invalid field name");
        }
    }

    async fillEndDate(tenderSubmissionPeriodTimeDiff: number) {
        await super.clickElement(startDateInput);
        await super.clickElementByIndex(datePickerDates, await super.getElementsCount(datePickerDates) - 1);
        await super.clickElementByIndex(datePickerTime, dataGenerator.getRandomInd(await super.getElementsCount(datePickerTime)));

        const newDateTime = DateTime.fromFormat(await super.getElementValue(startDateInput), "dd.MM.yyyy, H:mm").plus({ hours: tenderSubmissionPeriodTimeDiff });
        await super.clickElement(endDateInput);
        await super.clickElementByLocatorAndText(datePickerDates, String(newDateTime.day));
        await super.pause(100);
        await super.clickElementByLocatorAndText(datePickerTime, newDateTime.toFormat("HH:mm"));
        await super.pause(100);
    }

    async fillWorkExecutionPeriod(invalidInput: boolean = false) {
        await super.clickElement(workExecutionPeriodInput);
       // console.log((await super.getElementsArray(datePickerDates)));
        //const res = (await super.getElementsArray(datePickerDates));
        //console.log(await res[res.length - 1].textContent()+"res");
        //console.log(res.allInnerTexts());
        await super.clickElementByIndex(datePickerDates, await super.getElementsCount(datePickerDates) - 1);
        await super.clickElementByIndex(datePickerDates, await super.getElementsCount(datePickerDates) - 1);
    }

    async fillWorksLocation(data: string) {
        await super.clickElement(chooseOnMapBtn);
        await this.fillSettlementInput(data);
        await this.clickFirstSettlementDropdownItem();
        await this.clickConfirmChoiceBtn();
    }

    async fillGeneralInfoExcept(fieldNameToExclude: string = '') {
        const validData = CreateTenderData.validGeneralInfoData;
        for (let inputName in validData) {
            if (inputName !== fieldNameToExclude) {
                await this.fillInput(inputName, validData[inputName]);
            }
        }
    }

    async clearInput(inputName: string) {
        switch (inputName) {
            case "tenderName":
                await super.clearElement(tenderNameInput);
                break;
            case "serviceName":
                await super.clearElement(serviceNameInput);
                break;
            default:
                throw new Error("Invalid input name");
        }
    }

    async getServiceNameDropdown() {
        return await super.getElement(serviceNameDropdown);
    }

    async getServiceNameDropdownItems() {
        return await super.getElement(serviceNameDropdownItems);
    }

    async getTenderCategoryLabel() {
        return await super.getElement(tenderCategoryLabel);
    }

    async clickServiceNameCloseIcon() {
        await super.clickElement(serviceNameCloseIcon);
    }

    async clickCreateServiceBtn() {
        await super.clickElement(createServiceBtn);
    }

    async fillSettlementInput(cityName: string) {
        await super.fillElement(settlementInput, cityName);
    }

    async clickFirstSettlementDropdownItem() {
        await super.clickElementByIndex(settlementDropdownItems, 0);
    }

    async clickConfirmChoiceBtn() {
        await super.clickElement(confirmChoiceBtn);
    }
}