import { test, expect, pages, testData } from '../fixtures/fixture';

const userLoginCredentials = {
    "email": String(process.env.USER_EMAIL),
    "phoneNumber": String(process.env.USER_PHONE_NUMBER),
    "password": String(process.env.USER_PASSWORD)
}
let tenderData: any;

async function fillAndVerifyFieldError(editTender: pages["editTender"], editTenderData: testData["editTenderData"], fieldName: 'tenderName' | 'serviceName' | 'declaredBudget' | 'additionalInfo', data: string, errorMsg: string, clickSaveChangesBtn: boolean = true) {
    await editTender.clearEditTenderFormInput(fieldName);
    await editTender.fillEditTenderFormInput(fieldName, data);
    await expect(editTender.getEditTenderFormInput(fieldName)).toHaveValue(data);
    if (clickSaveChangesBtn) {
        await editTender.clickSaveChangesBtn();
        await expect(editTender.getEditTenderFormInput(fieldName)).toBeInViewport();
    }
    await expect(editTender.getEditTenderFormInputErrorState(fieldName)).toHaveClass(RegExp(editTenderData.fieldsErrorClasses[fieldName]));
    await expect(editTender.getEditTenderFormInputErrorMsg(fieldName)).toHaveText(editTenderData.fieldsMsgs[fieldName][errorMsg]);
}

async function fillAndCheckEnteredValue(editTender: pages["editTender"], fieldName: 'tenderName' | "declaredBudget" | 'additionalInfo', data: string, enteredLength: number) {
    await editTender.clearEditTenderFormInput(fieldName);
    await editTender.fillEditTenderFormInput(fieldName, data);
    await expect(editTender.getEditTenderFormInput(fieldName)).toHaveValue(data.slice(0, enteredLength));
}

async function fillAndCheckIfEmpty(editTender: pages["editTender"], fieldName: 'declaredBudget', data: string) {
    await editTender.clearEditTenderFormInput(fieldName);
    await editTender.fillEditTenderFormInput(fieldName, data);
    await expect(editTender.getEditTenderFormInput(fieldName)).toHaveValue('');
}  
    

test.describe('Edit tender functionality check', () => {
    test.beforeEach(async ({ tenderApiHelper, loginPopUp, myTenders, telegramPopUp, endpointsData }) => {
        tenderData = await tenderApiHelper.createTender();
        await tenderApiHelper.addTenderAttachment(tenderData.id);
        await myTenders.openUrl(endpointsData.myTenders);
        await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: userLoginCredentials.password });
        await telegramPopUp.closeTelegramPopUp();

        await myTenders.goToTendersTab('expecting');
        await myTenders.searchTender(tenderData.name);
        await expect(myTenders.getTenderCards()).toHaveCount(1);
    })
    test("C237 - Edit the pending tender with valid values (default contact person)", async ({ myTenders, editTender, endpointsData, editTenderData }) => {
        await myTenders.clickBtn('edit');
        await expect(editTender.page).toHaveURL(endpointsData.editTender.replace('{id}', tenderData.id));

        await fillAndVerifyFieldError(editTender, editTenderData, 'tenderName', '', 'empty');
        await fillAndVerifyFieldError(editTender, editTenderData, 'tenderName', editTenderData.invalidTenderNames.less, 'less');
        for (const invalidTenderName of editTenderData.invalidTenderNames.withRestrictedSymbol) {
            await fillAndCheckEnteredValue(editTender, 'tenderName', invalidTenderName, invalidTenderName.length - 1);
        }
        await fillAndCheckEnteredValue(editTender, 'tenderName', editTenderData.invalidTenderNames.exceeding.data, editTenderData.invalidTenderNames.exceeding.allowedLength);

        await fillAndVerifyFieldError(editTender, editTenderData, 'serviceName', '', 'empty');
        await editTender.fillEditTenderFormInput('serviceName', editTenderData.serviceName);
        await expect(editTender.getServicesDropdown()).toBeVisible();
        const searchResults = await editTender.getServicesDropdownItemsText();
        for (const searchResult of searchResults) {
            expect(searchResult).toContain(editTenderData.serviceName);
        }
        await editTender.selectFirstServiceNameFromDropdown();
        await expect(editTender.getServiceName()).toHaveText(searchResults[0]);

        for (const input of ['endDate', 'startDate', 'worksExecutionPeriod'] as const) {
            await expect(editTender.getEditTenderFormInput(input)).toHaveAttribute('readonly');
        }

        await fillAndVerifyFieldError(editTender, editTenderData, 'declaredBudget', '', 'empty');
        for (const restrictedSymbol of editTenderData.invalidDeclaredBudgets.restrictedSymbols) {
            await fillAndCheckIfEmpty(editTender, 'declaredBudget', restrictedSymbol);
        }
        await fillAndCheckEnteredValue(editTender, "declaredBudget", editTenderData.invalidDeclaredBudgets.exceeding.data, editTenderData.invalidDeclaredBudgets.exceeding.allowedLength);

        await fillAndVerifyFieldError(editTender, editTenderData, 'additionalInfo', '', 'empty');
        await fillAndVerifyFieldError(editTender, editTenderData, 'additionalInfo', editTenderData.invalidAdditionalInfo.less, 'less');
        for (const invalidAdditionalInfo of editTenderData.invalidAdditionalInfo.withRestrictedSymbol) {
            await fillAndCheckEnteredValue(editTender, 'additionalInfo', invalidAdditionalInfo, invalidAdditionalInfo.length - 1);
        }
        await fill
    })

    test.afterEach(async ({ tenderApiHelper }) => {
        await tenderApiHelper.closeTender(tenderData.id);
        await tenderApiHelper.deleteTender(tenderData.id);
    })
})