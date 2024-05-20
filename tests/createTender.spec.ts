import { DateTime } from 'luxon';
import { test, expect, pages, testData } from '../fixtures/fixture';

const photosDirName = 'data/createTenderData';
const userLoginCredentials = {
    "email": String(process.env.USER_EMAIL),
    "phoneNumber": String(process.env.USER_PHONE_NUMBER),
    "password": String(process.env.USER_PASSWORD)
}
const fieldsByTab = {
    "generalInfo": ["tenderName", "serviceName", "startDate", "endDate", "workExecutionPeriod", "declaredBudget", "worksLocation", "additionalInfo"],
    "documentation": ["fileUpload"],
    "contacts": ["surname", "name", "phone"]
};
let createdTenderName: string;

async function verifyTabOpened(createTender: pages['createTender'], createTenderData: testData['createTenderData'], tabName: 'generalInfo' | 'documentation' | 'contacts') {
    await expect(createTender.getSectionTitle(tabName)).toBeVisible();
    await expect((await createTender.handleTab(tabName, 'get'))!).toHaveClass(RegExp(createTenderData.tabActiveClass));
}

async function verifyFieldErrorsByTab(generalInfoTab: pages['generalInfoTab'], documentationTab: pages['documentationTab'], contactsTab: pages['contactsTab'], createTenderData: testData['createTenderData'], tabName: 'generalInfo' | 'documentation' | 'contacts') {
    for (const field of fieldsByTab[tabName]) {
        (tabName === "generalInfo" && !["startDate", "workExecutionPeriod"].includes(field)) && await verifyFieldError(generalInfoTab, createTenderData, field as "tenderName" | "serviceName" | "endDate" | "workExecutionPeriod" | "worksLocation" | "additionalInfo" | "tenderProposalPeriod", 'empty');
        (tabName === "documentation") && await verifyDocumentationFieldError(documentationTab, createTenderData, field as 'fileUpload', 'empty');
        (tabName === "contacts") && await verifyContactsFieldError(contactsTab, createTenderData, field as 'surname' | 'name' | 'phone', 'empty');
    }
}

async function verifyFieldError(generalInfoTab: pages['generalInfoTab'], createTenderData: testData['createTenderData'], fieldName: 'tenderName' | 'serviceName' | 'endDate' | 'tenderProposalPeriod' | 'workExecutionPeriod' | 'worksLocation' | 'additionalInfo', errorType: 'less' | 'invalid' | 'empty') {
    let fields: ("tenderName" | "serviceName" | "startDate" | "endDate" | 'workExecutionPeriod' | 'worksLocation' | 'additionalInfo')[] = (fieldName === 'tenderProposalPeriod') ? ['startDate', 'endDate'] : [fieldName];
    for (let field of fields) {
        let input = (field === "additionalInfo" || field === "serviceName" || field === 'endDate') ? generalInfoTab.getInputWrapper(field) : generalInfoTab.getGeneralInfoInput(field);
        await expect(input).toHaveClass(RegExp(createTenderData.fieldsErrorClasses[fieldName]));
    }
    await expect(generalInfoTab.getGeneralInfoInputErrorMsg(fieldName)).toHaveText(createTenderData.fieldsErrorMsgs[fieldName][errorType]);
}

async function verifyDocumentationFieldError(documentationTab: pages['documentationTab'], createTenderData: testData['createTenderData'], fieldName: 'fileUpload', errorType: 'less' | 'invalid' | 'empty') {
    await expect(documentationTab.getFileUploadArea()).toHaveClass(RegExp(createTenderData.fieldsErrorClasses[fieldName]));
    await expect(documentationTab.getFileUploadErrorMsg()).toHaveText(createTenderData.fieldsErrorMsgs[fieldName][errorType]);
}
async function verifyContactsFieldError(contactsTab: pages['contactsTab'], createTenderData: testData['createTenderData'], fieldName: 'surname' | 'name' | 'phone', errorType: 'less' | 'invalid' | 'empty') {
    await expect(contactsTab.getContactsTabInput(fieldName)).toHaveClass(RegExp(createTenderData.fieldsErrorClasses[fieldName]));
    await expect(contactsTab.getContactsTabErrorMsg(fieldName)).toHaveText(createTenderData.fieldsErrorMsgs[fieldName][errorType]);
}

async function fillAndVerifyFieldError(createTender: pages['createTender'], generalInfoTab: pages["generalInfoTab"], createTenderData: testData['createTenderData'], fieldName: 'tenderName' | 'tenderProposalPeriod' | 'workExecutionPeriod' | 'additionalInfo', data: string | Date, errorType: 'less' | 'invalid', clickNextBtn: boolean = true) {
    const field = (fieldName === 'tenderProposalPeriod') ? 'endDate' : fieldName;
    (field !== 'endDate' && field !== 'workExecutionPeriod') && await generalInfoTab.clearGeneralInfoInput(field);
    await generalInfoTab.fillGeneralInfoInput(field, data);
    await expect(generalInfoTab.getGeneralInfoInput(field)).toHaveValue((data instanceof Date) ? DateTime.fromJSDate(data, { zone: 'utc' }).toFormat('dd.MM.yyyy, H:mm') : data);
    if (clickNextBtn) {
        await createTender.clickNextBtn();
        await expect(generalInfoTab.getGeneralInfoInput(field)).toBeInViewport();
    }
    await verifyFieldError(generalInfoTab, createTenderData, fieldName, errorType);
}

async function fillAndCheckIfEmpty(generalInfoTab: pages["generalInfoTab"], fieldName: 'tenderName' | 'serviceName' | 'declaredBudget' | 'additionalInfo', data: string) {
    await generalInfoTab.clearGeneralInfoInput(fieldName);
    await generalInfoTab.fillGeneralInfoInput(fieldName, data);
    await expect(generalInfoTab.getGeneralInfoInput(fieldName)).toHaveValue('');
}

async function fillAndCheckEnteredLength(generalInfoTab: pages["generalInfoTab"], fieldName: 'tenderName' | 'serviceName' | 'declaredBudget', data: string, maxLength: number) {
    await generalInfoTab.clearGeneralInfoInput(fieldName);
    await generalInfoTab.fillGeneralInfoInput(fieldName, data);
    await expect(generalInfoTab.getGeneralInfoInput(fieldName)).toHaveValue(data.slice(0, maxLength));
}

test.describe('Create tender functionality check', () => {
    test.beforeEach(async ({ loginPopUp, myTenders, telegramPopUp, endpointsData }) => {
        await loginPopUp.openUrl(endpointsData["myTenders"]);
        await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: userLoginCredentials.password });
        await myTenders.waitForPageLoad();
        await telegramPopUp.closeTelegramPopUp();

        await myTenders.clickCreateTenderBtn();
    })

    test("TC017 - Create tender with empty fields", async ({ createTender, generalInfoTab, documentationTab, contactsTab, createTenderData }) => {
        const tabs = Object.keys(fieldsByTab) as ('generalInfo' | 'documentation' | 'contacts')[];;
        for (let tab of tabs) {
            (tab !== "generalInfo") && await createTender.handleTab(tab, 'click');
            await verifyTabOpened(createTender, createTenderData, tab);
            await createTender.clickNextBtn();
            (tab === "contacts") && await verifyTabOpened(createTender, createTenderData, tabs[0]);
            (tab !== "contacts") && await verifyFieldErrorsByTab(generalInfoTab, documentationTab, contactsTab, createTenderData, tab);
        }

        await createTender.handleTab(tabs[2], 'click');
        await verifyTabOpened(createTender, createTenderData, tabs[2]);
        await contactsTab.unckeckContactPersonCheckbox();
        await verifyFieldErrorsByTab(generalInfoTab, documentationTab, contactsTab, createTenderData, tabs[2]);
    });

    test("TC018 - Create tender with invalid tender name", async ({ createTender, generalInfoTab, dataGenerator, createTenderData }) => {
        const fieldToCheck = 'tenderName';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        await fillAndVerifyFieldError(createTender, generalInfoTab, createTenderData, fieldToCheck, createTenderData.invalidTenderNames.less, 'less');
        for (let data of createTenderData.invalidTenderNames.notAccepted) {
            await fillAndCheckIfEmpty(generalInfoTab, fieldToCheck, data);
        }
        await fillAndCheckEnteredLength(generalInfoTab, fieldToCheck, createTenderData.invalidTenderNames.exceeding.data, createTenderData.invalidTenderNames.exceeding.allowedLength);
    });

    test("TC019 - Create tender with invalid service name", async ({ generalInfoTab, createTenderData, dataGenerator }) => {
        const fieldToCheck = 'serviceName';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        await fillAndCheckEnteredLength(generalInfoTab, fieldToCheck, createTenderData.invalidServiceNames.exceeding.data, createTenderData.invalidServiceNames.exceeding.allowedLength);
        for (let data of createTenderData.invalidServiceNames.notAccepted) {
            await fillAndCheckIfEmpty(generalInfoTab, fieldToCheck, data);
        }
    });

    test("TC020 - Create tender with non-existing service", async ({ createTender, generalInfoTab, createTenderData, dataGenerator, apiHelper }) => {
        const elementsToCheck = ['serviceName', 'serviceDropdown'] as const;
        const serviceName = createTenderData.nonExistingServiceName.name;
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, elementsToCheck[0]);

        await generalInfoTab.fillGeneralInfoInput(elementsToCheck[0], serviceName);
        await expect(generalInfoTab.getGeneralInfoInput(elementsToCheck[0])).toHaveValue(serviceName);
        const serviceDropdownErrorMsg = createTenderData.fieldsErrorMsgs[elementsToCheck[1]].nonExisting.replace('<SERVICE_NAME>', serviceName);
        await expect(generalInfoTab.getGeneralInfoInputErrorMsg(elementsToCheck[1])).toHaveText(serviceDropdownErrorMsg);

        await generalInfoTab.clickCreateServiceBtn();
        await expect(generalInfoTab.getServiceCategory()).toHaveText(createTenderData.nonExistingServiceName.category);

        await generalInfoTab.clickServiceNameInputCrossIcon();
        await expect(generalInfoTab.getGeneralInfoInput(elementsToCheck[0])).toHaveValue('');

        await generalInfoTab.fillGeneralInfoInput(elementsToCheck[0], serviceName);
        await expect(generalInfoTab.getServiceDropdownItems()).toHaveText([serviceName]);
        //POSTCONDITION: delete created service
        await apiHelper.deleteServiceByName(serviceName);
    });

    test("TC021 - Create tender with invalid tender proposal submission period", async ({ createTender, generalInfoTab, createTenderData, dataGenerator, helper }) => {
        const fieldToCheck = 'endDate';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        const invalidEndDate = helper.addHoursToDate(await generalInfoTab.getGeneralInfoInputValue('startDate'), createTenderData.invalidEndDate.hoursDifference, true);
        await fillAndVerifyFieldError(createTender, generalInfoTab, createTenderData, 'tenderProposalPeriod', invalidEndDate, 'invalid');
    });

    test("TC022 - Create tender with invalid work execution period", async ({ createTender, createTenderData, generalInfoTab, dataGenerator, helper }) => {
        const fieldToCheck = 'workExecutionPeriod';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        let endDate = await generalInfoTab.getGeneralInfoInputValue('endDate');
        let startWorkExecutionDate = helper.addDaysToDate(endDate, dataGenerator!.generateDaysDifference(2), true);
        await generalInfoTab.fillGeneralInfoInput('workExecutionPeriod', [startWorkExecutionDate, undefined]);
        await createTender.clickNextBtn();
        await expect(generalInfoTab.getGeneralInfoInput(fieldToCheck)).toBeInViewport();
        await verifyFieldError(generalInfoTab, createTenderData, fieldToCheck, 'invalid');
        await expect(generalInfoTab.getGeneralInfoInput(fieldToCheck)).toHaveValue(`${DateTime.fromJSDate(startWorkExecutionDate, { zone: 'utc' }).toFormat('dd.MM.yyyy')} - `);

        let endWorkExecutionDate = helper.subtractDaysFromDate(startWorkExecutionDate, 1, true, false);
        await generalInfoTab.fillGeneralInfoInput('workExecutionPeriod', [undefined, endWorkExecutionDate]);
        await expect(generalInfoTab.getGeneralInfoInput(fieldToCheck)).toHaveValue(`${DateTime.fromJSDate(endWorkExecutionDate, { zone: 'utc' }).toFormat('dd.MM.yyyy')} - `);
    });

    test("TC023 - Create tender with invalid declared budget", async ({ generalInfoTab, dataGenerator, createTenderData }) => {
        const fieldToCheck = 'declaredBudget';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        for (let invalidDeclaredBudget of createTenderData.invalidDeclaredBudget.notAccepted) {
            await fillAndCheckIfEmpty(generalInfoTab, fieldToCheck, invalidDeclaredBudget);
        }
        await fillAndCheckEnteredLength(generalInfoTab, fieldToCheck, createTenderData.invalidDeclaredBudget.exceeding.data, createTenderData.invalidDeclaredBudget.exceeding.allowedLength);
    })

    test("TC024 - Verify location of works field", async ({ generalInfoTab, mapPopUp, createTenderData, dataGenerator }) => {
        const fieldToCheck = 'worksLocation';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        await generalInfoTab.fillGeneralInfoInput(fieldToCheck, createTenderData.worksLocation.outside);
        await expect(generalInfoTab.getGeneralInfoInput(fieldToCheck)).toHaveText(createTenderData.worksLocation.default);

        await generalInfoTab.clickChooseOnMapBtn();
        while (await mapPopUp.getMapZoomButtonAccessability('out') !== "true") {
            let zoomBefore = await mapPopUp.getMapZoom();
            await mapPopUp.mapZoomOut();
            await mapPopUp.pause(500);
            let zoomAfter = await mapPopUp.getMapZoom();
            expect(zoomAfter).toEqual(zoomBefore / 2);
        }
        while (await mapPopUp.getMapZoomButtonAccessability('in') !== "true") {
            let zoomBefore = await mapPopUp.getMapZoom();
            await mapPopUp.mapZoomIn();
            await mapPopUp.pause(500);
            let zoomAfter = await mapPopUp.getMapZoom();
            expect(zoomAfter).toEqual(zoomBefore * 2);
        }
        await mapPopUp.selectLocationOutsideUkraine();
        await mapPopUp.clickConfirmChoiceBtn();
        await verifyFieldError(generalInfoTab, createTenderData, fieldToCheck, 'empty');

        const clicks = ['cancelBtn', 'crossIcon'] as const;
        for (const click of clicks) {
            await generalInfoTab.clickChooseOnMapBtn();
            await expect(mapPopUp.getMapPopUp()).toBeVisible();
            await mapPopUp.closeMapPopUp(click);
            await expect(mapPopUp.getMapPopUp()).toHaveCount(0);
            await expect(generalInfoTab.getGeneralInfoInput(fieldToCheck)).toHaveText(createTenderData.worksLocation.empty);
        }
    });

    test("TC025 - Create tender with invalid additional information", async ({ createTender, generalInfoTab, dataGenerator, createTenderData }) => {
        const fieldToCheck = 'additionalInfo';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        for (let invalidAdditionalInfo of createTenderData.invalidAddtionalInfo.notAccepted) {
            await fillAndCheckIfEmpty(generalInfoTab, fieldToCheck, invalidAdditionalInfo);
        }
        for (let invalidAdditionalInfo of createTenderData.invalidAddtionalInfo.less) {
            await fillAndVerifyFieldError(createTender, generalInfoTab, createTenderData, fieldToCheck, invalidAdditionalInfo, 'less');
        }
    });

    test("TC026 - Create tender with invalid documents", async ({ createTender, createTenderData, documentationTab }) => {
        await createTender.handleTab('documentation', 'click');
        await verifyTabOpened(createTender, createTenderData, 'documentation');

        async function uploadFilesAndVerifyPopUp(fileNames: string[], errorMsg?: string) {
            await documentationTab.uploadDocumentationFiles(photosDirName, fileNames);
            if (errorMsg) {
                await expect(documentationTab.getNonValidImgPopUp()).toBeVisible();
                await expect(documentationTab.getNonValidImgPopUpTitle()).toHaveText(createTenderData.uploadFilePopUpTitle);
                await expect(documentationTab.getNonValidImagePopUpErrorMsg()).toHaveText(errorMsg);
                await documentationTab.clickConfirmNonValidImgPopUpBtn();
                await expect(documentationTab.getNonValidImgPopUp()).toHaveCount(0);
            }
        }

        async function verifyUploadedFiles(filesCount: number, fileNames?: string[]) {
            await expect(documentationTab.getUploadedDocumentNames()).toHaveCount(filesCount);
            if (filesCount != 0 && fileNames) {
                await expect(documentationTab.getUploadedDocumentNames()).toHaveText(fileNames);
            }
        }

        for (const invalidFile of createTenderData.invalidFiles) {
            await uploadFilesAndVerifyPopUp([invalidFile], createTenderData.uploadFilePopUpErrorMsgs.invalidFormatOrLarge);
            await verifyUploadedFiles(0);
        }

        await uploadFilesAndVerifyPopUp([createTenderData.validFiles[0]]);
        await verifyUploadedFiles(1, [createTenderData.validFiles[0]]);
        await uploadFilesAndVerifyPopUp([createTenderData.validFiles[0]], createTenderData.uploadFilePopUpErrorMsgs.sameFiles);
        await verifyUploadedFiles(1, [createTenderData.validFiles[0]]);
        await uploadFilesAndVerifyPopUp(createTenderData.validFiles.slice(1), createTenderData.uploadFilePopUpErrorMsgs.maxFilesExceeded);
        await verifyUploadedFiles(createTenderData.validFiles.length - 1, createTenderData.validFiles.slice(0, -1));

        for (let i = 0; i < createTenderData.validFiles.length - 1; i++) {
            await documentationTab.deleteFirstUploadedFile();
            await expect(documentationTab.getUploadedDocumentNames()).toHaveCount(createTenderData.validFiles.length - i - 2);
        }

        await createTender.clickNextBtn();
        await verifyDocumentationFieldError(documentationTab, createTenderData, 'fileUpload', 'empty');
    });

    test("TC028 - Cancel tender creation", async ({ myTenders, createTender, generalInfoTab, documentationTab, dataGenerator, createTenderData, endpointsData }) => {
        await verifyTabOpened(createTender, createTenderData, 'generalInfo');
        await createTender.handleTab('contacts', 'click');
        await verifyTabOpened(createTender, createTenderData, 'contacts');
        for (const tab of ['documentation', 'generalInfo'] as const) {
            await createTender.clickBackBtn();
            await verifyTabOpened(createTender, createTenderData, tab);
        }
        await createTender.handleDialog('accept', createTenderData.cancelTenderDialogMsg);
        await createTender.clickBackBtn();
        await expect(myTenders.page).toHaveURL(endpointsData.myTenders);

        await myTenders.waitForPageLoad();
        await myTenders.clickCreateTenderBtn();
        await createTender.handleDialog('dismiss', createTenderData.cancelTenderDialogMsg);
        await createTender.clickBackBtn();
        await expect(createTender.page).toHaveURL(endpointsData.createTender);

        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, undefined);
        await generalInfoTab.pause(500);
        await createTender.clickNextBtn();
        await documentationTab.uploadDocumentationFiles(photosDirName, [createTenderData.validFiles[0]]);
        await createTender.clickNextBtn();
        await createTender.clickNextBtn();
        await expect(createTender.getTenderConfirmPopUpMsg()).toContainText(createTenderData.tenderCreationPopUpMsg);
        await createTender.clickTenderConfirmPopUp('crossIcon');
        await verifyTabOpened(createTender, createTenderData, 'contacts');
        await createTender.clickNextBtn();
        await createTender.handleDialog('accept', createTenderData.cancelTenderDialogMsg);
        await createTender.clickTenderConfirmPopUp('cancel');
        await expect(myTenders.page).toHaveURL(endpointsData.myTenders);
    });

    test("TC029 - Create tender with valid data and user as a contact person", async ({ createTender, generalInfoTab, documentationTab, completeTenderCreation, notificationPopUp, navBar, myTenders, dataGenerator, createTenderData, notificationMsgs, endpointsData, helper }) => {
        let userBalanceBefore = Number(await navBar.getProfileDropdownBalance());
        let enteredData = await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, undefined);
        await generalInfoTab.pause(700);
        await createTender.clickNextBtn();
        await documentationTab.uploadDocumentationFiles(photosDirName, [createTenderData.validFiles[0]]);
        await createTender.clickNextBtn();
        await createTender.clickNextBtn();
        await expect(createTender.getTenderConfirmPopUpMsg()).toContainText(createTenderData.tenderCreationPopUpMsg);
        await createTender.clickTenderConfirmPopUp('create');

        await expect(completeTenderCreation.getTitle()).toHaveText(createTenderData.successfulCreation.title);
        await expect(completeTenderCreation.getMessage()).toHaveText(createTenderData.successfulCreation.message);
        await expect(notificationPopUp.getNotificationPopUpMsg()).toHaveText(notificationMsgs.toastNotificationMsgs.createTender);
        expect(Number(await navBar.getProfileDropdownBalance())).toEqual((userBalanceBefore - 10) > 10 ? userBalanceBefore - 10 : 100);

        await completeTenderCreation.clickViewInMyTendersBtn();
        await expect(myTenders.page).toHaveURL(endpointsData.myTenders);

        await myTenders.refresh();
        await navBar.clickNavbarItem('notificationMenuIcon');
        await expect(await navBar.getLastNoticationMsg()).toHaveText(notificationMsgs.navBarNotificationDropdownMsgs.createTender);

        await myTenders.goToTendersTab('expecting');
        createdTenderName = enteredData.find(item => item.input === 'tenderName').value;
        await myTenders.searchTender(createdTenderName);
        await expect(myTenders.getTenderCards()).toHaveCount(1);
        expect(await myTenders.getTenderCardInfo('serviceName')).toEqual(enteredData.find(item => item.input === 'serviceName').value);
        expect(await myTenders.getTenderCardInfo('declaredBudget')).toEqual(enteredData.find(item => item.input === 'declaredBudget').value);
        expect(await myTenders.getTenderCardInfo('worksExecutionPeriod')).toEqual(enteredData.find(item => item.input === 'workExecutionPeriod').value.map(item => helper.convertDateToString(item)));
        expect(await myTenders.getTenderCardInfo('worksLocation')).toEqual(enteredData.find(item => item.input === 'worksLocation').value);
    });

    test.afterAll(async ({ tenderApiHelper }) => {
        const tenderId = await tenderApiHelper.getTenderIdByName(createdTenderName);
        if (tenderId) {
            await tenderApiHelper.deleteTender(tenderId);
        }
    });
});