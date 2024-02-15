import { test, expect, Locator } from '@playwright/test';
import { MainPage } from '../pages/mainPage.page';
import feedbackData from '../fixtures/feedbackData.json';
import FeedbackApiHelper from '../helper/feedbackApi.helper';


let mainPage: MainPage;
const feedbackApiHelper = new FeedbackApiHelper();

async function verifyFeedbackFieldErrors(fields: { name: 'Name' | 'Phone', shouldBeError: boolean, errorMsg?: string }[]) {
    for (const field of fields) {
        const input = await mainPage[`getFeedback${field.name}Input`]();
        const error = await mainPage[`getFeedback${field.name}ErrorMsg`]();
        if (field.shouldBeError) {
            await expect(input).toHaveAttribute('class', /ConsultationForm_error/);
            if (field.errorMsg) {
                await expect(error).toHaveText(field.errorMsg);
            }
        } else {
            await expect(input).not.toHaveAttribute('class', /ConsultationForm_error/);
        }
    }
}

test.describe('Feedback check', () => {
    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        await mainPage.openUrl();
    });

    test('C226 - Verify "У Вас залишилися питання?" form', async () => {
        await mainPage.scrollToConsultationForm();
        await expect(await mainPage.getConsultationForm()).toBeVisible();

        await mainPage.orderConsultation();
        await verifyFeedbackFieldErrors([
            { name: 'Name', shouldBeError: true, errorMsg: "Поле не може бути порожнім" },
            { name: 'Phone', shouldBeError: true, errorMsg: "Поле не може бути порожнім" }
        ]);

        await mainPage.orderConsultation({ name: feedbackData.validName });
        await verifyFeedbackFieldErrors([
            { name: 'Name', shouldBeError: false},
            { name: 'Phone', shouldBeError: true}
        ]);

        await mainPage.clickFeedbackPhoneInput();
        await expect(await mainPage.getFeedbackPhoneInput()).toHaveValue('+380');

        await mainPage.orderConsultation({ name: "", phone: feedbackData.validPhoneNumber });
        await verifyFeedbackFieldErrors([
            { name: 'Name', shouldBeError: true},
            { name: 'Phone', shouldBeError: false}
        ]);

        for (const invalidPhoneNumber of feedbackData.invalidPhoneNumbers) {
            await mainPage.orderConsultation({ name: feedbackData.validName, phone: invalidPhoneNumber });
            await verifyFeedbackFieldErrors([
                { name: 'Name', shouldBeError: false},
                { name: 'Phone', shouldBeError: true, errorMsg: "Телефон не пройшов валідацію" }
            ]);
        }
        await mainPage.orderConsultation({ phone: feedbackData.validPhoneNumber });

        const createdFeedback = await feedbackApiHelper.getCreatedFeedback(feedbackData.validName, feedbackData.validPhoneNumber);
        expect(createdFeedback).not.toBeUndefined();
        expect(await feedbackApiHelper.deleteCreatedFeedback(createdFeedback.id)).toBe(204);
    })
})
