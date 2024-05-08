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

// async function verifyTabOpened(createTender: pages['createTender'], createTenderData: testData['createTenderData'], tabName: 'generalInfo' | 'documentation' | 'contacts') {
//     await expect(await createTender.getSectionTitle(tabName)).toBeVisible();
//     await expect((await createTender.handleTab(tabName, 'get'))!).toHaveClass(RegExp(createTenderData.tabActiveClass));
// }



// async function verifyFieldErrorsByTab(createTender: pages['createTender'], createTenderData: testData['createTenderData'], tabName: 'generalInfo' | 'documentation' | 'contacts') {
//     for (const field of fieldsByTab[tabName]) {
//         (tabName !== "generalInfo" && !["startDate", "workExecutionPeriod"].includes(field)) && await verifyFieldError(createTender, createTenderData, field);
//     }
// }

async function verifyFieldError(generalInfoTab: pages['generalInfoTab'], createTenderData: testData['createTenderData'], fieldName: 'tenderName' | 'serviceName', errorType: 'less') {
    await expect(generalInfoTab.getGeneralInfoInput(fieldName)).toHaveClass(RegExp(createTenderData.fieldsErrorClasses[fieldName]));
    await expect(generalInfoTab.getGeneralInfoInputErrorMsg(fieldName)).toHaveText(createTenderData.fieldsErrorMsgs[fieldName][errorType]);
}

async function fillAndVerifyFieldError(createTender: pages['createTender'], generalInfoTab: pages["generalInfoTab"], createTenderData: testData['createTenderData'], fieldName: 'tenderName', data: string, errorType: 'less', clickNextBtn: boolean = true) {
    await generalInfoTab.clearGeneralInfoInput(fieldName);
    await generalInfoTab.fillGeneralInfoInput(fieldName, data);
    await expect(generalInfoTab.getGeneralInfoInput(fieldName)).toHaveValue(data);
    if (clickNextBtn) {
        await createTender.clickNextBtn();
        await expect(generalInfoTab.getGeneralInfoInput(fieldName)).toBeInViewport();
    }
    await verifyFieldError(generalInfoTab, createTenderData, fieldName, errorType);
}

async function fillAndCheckIfEmpty(generalInfoTab: pages["generalInfoTab"], fieldName: 'tenderName' | 'serviceName', data: string) {
    await generalInfoTab.clearGeneralInfoInput(fieldName);
    await generalInfoTab.fillGeneralInfoInput(fieldName, data);
    await expect(generalInfoTab.getGeneralInfoInput(fieldName)).toHaveValue('');
}

async function fillAndCheckEnteredLength(generalInfoTab: pages["generalInfoTab"], fieldName: 'tenderName' | 'serviceName', data: string, maxLength: number) {
    await generalInfoTab.clearGeneralInfoInput(fieldName);
    await generalInfoTab.fillGeneralInfoInput(fieldName, data);
    await expect(generalInfoTab.getGeneralInfoInput(fieldName)).toHaveValue(data.slice(0, maxLength));
}

// async function verifyGeneralInfoInputError(inputName: string) {
//     await createTender.clickNextBtn();
//     await verifyTabOpened('generalInfo');
//     await expect(await generalInfo.getInput(inputName)).toBeInViewport();
//     await verifyFieldError(inputName);
// }

// async function verifyServiceDropdownErrorMsg(serviceName: string) {
//     
//     await expect(await createTender.getFieldErrorMsg("serviceDropdown")).toHaveText(errorMsg, { useInnerText: true });
// }

test.describe('Create tender functionality check', () => {
    test.beforeEach(async ({ loginPopUp, myTenders, telegramPopUp, endpointsData }) => {
        await loginPopUp.openUrl(endpointsData["myTenders"]);
        await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: userLoginCredentials.password });
        await myTenders.waitForPageLoad();
        await telegramPopUp.closeTelegramPopUp();

        await myTenders.clickCreateTenderBtn();
    })

    test("TC017 - Create tender with empty fields", async ({ createTender, contactsTab, createTenderData }) => {
        const tabs = ['generalInfo', 'documentation', 'contacts'] as const;

        for (let tab of tabs) {
            (tab !== "generalInfo") && await createTender.handleTab(tab, 'click');
            await verifyTabOpened(createTender, createTenderData, tab);
            await createTender.clickNextBtn();
            (tab === "contacts") && await verifyTabOpened(createTender, createTenderData, tabs[0]);
            (tab !== "contacts") && await verifyFieldErrorsByTab(createTender, createTenderData, tab);
        }

        await createTender.handleTab(tabs[2], 'click');
        await verifyTabOpened(createTender, createTenderData, tabs[2]);
        await contactsTab.unckeckContactPersonCheckbox();
        await verifyFieldErrorsByTab(createTender, createTenderData, tabs[2]);
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

    test("TC021 - Create tender with invalid tender proposal submission period", async ({ generalInfoTab, dataGenerator }) => {
        const fieldToCheck = 'endDate';
        await generalInfoTab.fillGeneralInfoWithRndData(dataGenerator, fieldToCheck);

        
    })
    //     await generalInfo.fillGeneralInfoExcept('tenderName');

    //     await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[0]);
    //     await expect(await generalInfo.getInput('tenderName')).toHaveValue(createTenderData.invalidTenderNames[0]);
    //     await verifyGeneralInfoInputError('tenderNaame');
    //     await generalInfo.clearInput('tenderName');

    //     await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[1]);
    //     await expect(await generalInfo.getInput('tenderName')).toHaveValue('');
    //     await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[2]);
    //     await expect(await generalInfo.getInput('tenderName')).toHaveValue('');

    //     await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[3]);
    //     await expect(await generalInfo.getInput('tenderName')).toHaveValue(createTenderData.invalidTenderNames[3].substring(0, 70));
    // })

    // test.skip("Create tender with invalid service name", async () => {
    //     await generalInfo.fillGeneralInfoExcept('serviceName');

    //     await generalInfo.fillInput('serviceName', createTenderData.invalidServiceNames[0], false);
    //     await expect(await generalInfo.getInput('serviceName')).toHaveValue(createTenderData.invalidServiceNames[0].substring(0, 100));
    //     await verifyGeneralInfoInputError('serviceName');
    //     await verifyServiceDropdownErrorMsg(createTenderData.invalidServiceNames[0]);
    //     await generalInfo.clearInput("serviceName");

    //     await generalInfo.fillInput('serviceName', createTenderData.invalidServiceNames[1]);
    //     await expect(await generalInfo.getInput('serviceName')).toHaveValue('');
    //     await generalInfo.fillInput('serviceName', createTenderData.invalidServiceNames[2]);
    //     await expect(await generalInfo.getInput('serviceName')).toHaveValue('');
    // })

    // test.skip("Create tender with non-existing service", async () => {
    //     await generalInfo.fillInput('serviceName', createTenderData.nonExistingServiceName);
    //     await expect(await generalInfo.getInput('serviceName')).toHaveValue(createTenderData.nonExistingServiceName);
    //     await verifyServiceDropdownErrorMsg(createTenderData.nonExistingServiceName);

    //     await generalInfo.clickCreateServiceBtn();
    //     await expect(await generalInfo.getServiceNameDropdown()).toHaveCount(0);
    //     await expect(await generalInfo.getTenderCategoryLabel()).toHaveText('Користувацькі');

    //     await generalInfo.clickServiceNameCloseIcon();
    //     await expect(await generalInfo.getInput('serviceName')).toHaveValue('');

    //     await generalInfo.fillInput('serviceName', createTenderData.nonExistingServiceName);
    //     await expect(await generalInfo.getServiceNameDropdownItems()).toHaveText(createTenderData.nonExistingServiceName);

    //     const status = await createTenderApiHelper.deleteService('Service test');
    //     expect(status).toEqual(204);
    // })

    // test.skip("Create tender with invalid tender proposal submission period", async () => {
    //     await generalInfo.fillGeneralInfoExcept('endDate');

    //     await generalInfo.fillEndDate(23);
    //     await createTender.clickNextBtn();
    //     await verifyTabOpened('generalInfo');
    //     await expect(await generalInfo.getInput('endDate')).toBeInViewport();
    //     await expect(await createTender.getFieldBoarder('endDate')).toHaveClass(RegExp(createTenderData.fieldsErrorClasses['endDate']));
    //     await expect(await createTender.getFieldBoarder('endDate')).toHaveClass(RegExp(createTenderData.fieldsErrorClasses['endDate']));
    //     await expect(await createTender.getFieldErrorMsg('tenderProposalPeriod')).toHaveText(createTenderData.fieldsErrorMsgs.tenderProposalPeriod);
    // })

    // test.skip("Create tender with invalid work execution period", async () => {
    //     await generalInfo.fillGeneralInfoExcept();

    //     const endProposalSubmissionDate = await (await generalInfo.getInput('endDate')).inputValue();
    //     const startDate = await generalInfo.fillWorkExecutionPeriod(true);
    //     console.log(startDate);
    //     await expect(await generalInfo.getInput('workExecutionPeriod')).toHaveValue("31.03.2024 - ");
    //     await generalInfo.pause(5000);

    // })

    // test.skip("Create tender with invalid documents", async () => {
    //     async function uploadFilesAndVerifyPopUp(fileNames: string[], errorMsg?: string) {
    //         await documentation.uploadDocumentationFiles(dirName, fileNames);
    //         if (errorMsg) {
    //             await expect(await documentation.getNonValidImgPopUp()).toBeVisible();
    //             await expect(await documentation.getNonValidImgPopUpTitle()).toHaveText(createTenderData.uploadFilePopUpTitle);
    //             await expect(await documentation.getNonValidImagePopUpErrorMsg()).toHaveText(errorMsg);
    //             await documentation.clickConfirmNonValidImgPopUpBtn();
    //             await expect(await documentation.getNonValidImgPopUp()).toHaveCount(0);
    //         }
    //     }

    //     async function verifyUploadedFiles(filesCount: number, fileNames?: string[]) {
    //         await expect(await documentation.getUploadedDocumentNames()).toHaveCount(filesCount);
    //         if (filesCount != 0 && fileNames) {
    //             await expect(await documentation.getUploadedDocumentNames()).toHaveText(fileNames);
    //         }
    //     }

    //     await createTender.handleTab('documentation', 'click');
    //     await verifyTabOpened('documentation');

    //     for (const invalidFile of createTenderData.invalidFiles) {
    //         await uploadFilesAndVerifyPopUp([invalidFile], createTenderData.uploadFilePopUpErrorMsgs.invalidFormatOrLarge);
    //         await verifyUploadedFiles(0);
    //     }

    //     await uploadFilesAndVerifyPopUp([createTenderData.validFiles[0]]);
    //     await verifyUploadedFiles(1, [createTenderData.validFiles[0]]);
    //     await uploadFilesAndVerifyPopUp([createTenderData.validFiles[0]], createTenderData.uploadFilePopUpErrorMsgs.sameFiles);
    //     await verifyUploadedFiles(1, [createTenderData.validFiles[0]]);

    //     await uploadFilesAndVerifyPopUp(createTenderData.validFiles.slice(1), createTenderData.uploadFilePopUpErrorMsgs.maxFilesExceeded);
    //     await verifyUploadedFiles(createTenderData.validFiles.length - 1, createTenderData.validFiles.slice(0, -1));

    //     for (let i = 0; i < createTenderData.validFiles.length - 1; i++) {
    //         await documentation.deleteFirstUploadedFile();
    //         await expect(await documentation.getUploadedDocumentNames()).toHaveCount(createTenderData.validFiles.length - i - 2);
    //     }

    //     await createTender.clickNextBtn();
    //     await verifyFieldError('fileUpload');
    // })

    // test("Cancel tender creation", async () => {
    //     await verifyTabOpened('generalInfo');

    //     await createTender.handleTab('contacts', 'click');
    //     await verifyTabOpened('contacts');

    //     await createTender.clickBackBtn();
    //     await verifyTabOpened('documentation');

    //     await createTender.clickBackBtn();
    //     await verifyTabOpened('generalInfo');

    //     await createTender.handleDialog('Ви впевнені, що хочете перейти на іншу сторінку? Внесені дані не збережуться!', 'accept');
    //     await createTender.clickBackBtn();
    //     await expect(await myTenders.getPageTitle()).toHaveText('Мої тендери');

    //     await myTenders.clickCreateTenderBtn();
    //     await createTender.handleDialog('Ви впевнені, що хочете перейти на іншу сторінку? Внесені дані не збережуться!', 'dismiss');
    //     await createTender.clickBackBtn();

    //     await generalInfo.fillGeneralInfoExcept();
    //     await createTender.clickNextBtn();
    //     await documentation.uploadDocumentationFiles(dirName, ["municipalVenicle.png"]);
    //     await createTender.clickNextBtn();

    //     await createTender.clickNextBtn();
    //     await expect(await createTender.getTenderConfirmPopUpMsg()).toContainText("За створення тендера з вашого рахунку буде знято 10 балів, вони будуть повернуті у разі успішного завершення тендера.\
    //     Ви підтверджуєте створення тендера?", {useInnerText: true});
    //     await createTender.clickTenderConfirmPopUp('cross');
    //     await verifyTabOpened('contacts');

    //     await createTender.clickNextBtn();
    //     await createTender.handleDialog('Ви впевнені, що хочете перейти на іншу сторінку? Внесені дані не збережуться!', 'accept');
    //     await createTender.clickTenderConfirmPopUp('cancel');
    //     await expect(await myTenders.getPageTitle()).toHaveText('Мої тендери');
    // })
});