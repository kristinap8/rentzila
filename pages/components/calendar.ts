import Page from '../page';
import { DateTime } from "luxon";

const calendarDropdownCurrentMonthAndYear = '*[class="react-datepicker__current-month"]';
const calendarDropdownNextBtn = 'button[class*="react-datepicker__navigation--next"]';
const calendarDropdownDay = (day: string, month: string): string => `*[class="react-datepicker__month"] *[class*="react-datepicker__day--0${day}"][aria-label*="${month}"]`;
const calendarDropdownTime = (time: string): string => `//li[contains(@class,"react-datepicker__time-list-item")][text()="${time}"]`;

export class Calendar extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async selectDate(date: Date, selectTime: boolean = true) {
        let dateToSelect = DateTime.fromJSDate(date, { zone: 'utc' }).setLocale('uk');
        const monthAndYear = dateToSelect.toFormat('LLLL yyyy');
        const day = dateToSelect.toFormat('dd');
        const monthNameGenitive = dateToSelect.toFormat('MMMM');

        while (await super.getElementText(calendarDropdownCurrentMonthAndYear) !== monthAndYear) {
            await super.clickElement(calendarDropdownNextBtn);
        }
        await super.clickElement(calendarDropdownDay(day, monthNameGenitive));

        if (selectTime) {
            let time = dateToSelect.toFormat('hh') + ':00';
            await super.clickElement(calendarDropdownTime(time));
        }
    }
}

