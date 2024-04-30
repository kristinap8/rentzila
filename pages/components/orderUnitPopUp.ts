import { DateTime } from 'luxon';
import Page from '../page';
import path from 'path';

const rentPeriodInput: string = 'div[class*="OrderPopup_periodArea"]';
const uploadFilesArea: string = 'div[class*="OrderPopup_filesBlock"] input';
const commentInput: string = 'div[class*="OrderPopup_description"] textarea';
const calendarMonth: string = "(//div[contains(@class, 'current-month')])[1]";
const calendarDays: string = "(//div[contains(@class, 'month')])[1]//div[contains(@class, 'day ') and not(contains(@class, 'outside-month'))]";
const calendarNextBtn: string = 'div[class*="datepicker"] button[class*="next"]';
const sendProposalBtn: string = 'div[class*="OrderPopup_btn"] button';
const proposalPopUpTitle: string = 'div[class*="PopupLayout_label"]';
const proposalPopUpMsg: string = 'div[class*="InfoPopup_addInfo"]';
const proposalPopUpCrossIcon: string = 'div[class*="PopupLayout_closeIcon"]';

export class OrderUnitPopUp extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getProposalPopUpTitle() {
        return await super.getElement(proposalPopUpTitle);
    }

    async getProposalPopUpMsg() {
        return await super.getElement(proposalPopUpMsg);
    }

    async selectPeriod(startDate: Date, endDate: Date) {
        await super.clickElement(rentPeriodInput);

        const startMonthYear = DateTime.fromJSDate(startDate).setLocale('uk').toFormat('LLLL yyyy');
        while (await super.getElementText(calendarMonth) !== startMonthYear) {
            await super.clickElement(calendarNextBtn);
        }
        await super.clickElementByLocatorAndText(calendarDays, startDate.getDate().toString());

        const endMonthYear = DateTime.fromJSDate(endDate).setLocale('uk').toFormat('LLLL yyyy');
        while (await super.getElementText(calendarMonth) !== endMonthYear) {
            await super.clickElement(calendarNextBtn);
        }
        await super.clickElementByLocatorAndText(calendarDays, endDate.getDate().toString());
    }

    async makeProposal(startDate: Date, endDate: Date, dirName: string, filePath: string, comment: string) {
        await this.selectPeriod(startDate, endDate);
        await super.uploadFiles(uploadFilesArea, [path.join(dirName, filePath)]);
        await super.fillElement(commentInput, comment);
        await super.clickElement(sendProposalBtn);
    }

    async clickProposalPopUpCrossIcon() {
        await super.clickElement(proposalPopUpCrossIcon);
    }
}