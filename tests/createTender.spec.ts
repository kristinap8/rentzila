import {test, expect} from '../fixtures/fixture';
import createTenderData from '../fixtures/createTenderData.json';

const dirName = "data";

test.describe('Create tender functionality check', () => {
    test.beforeEach(async ({ loginPopUp, navBar, myTenders }) => {
        await loginPopUp.openUrl();
        await navBar.clickLoginBtn();
        await loginPopUp.login(String(process.env.USER_EMAIL), String(process.env.USER_PASSWORD));
        await navBar.waitForLoggedIn();

        await myTenders.goToMyTenders();
        await myTenders.clickCreateTenderBtn();
        await requestsPopUp.closeTelegramPopUp();
    })

    async function verifyTabOpened(tabName: 'generalInfo' | 'documentation' | 'contacts') {
        await expect(await createTender.getSectionTitle(tabName)).toBeVisible();
        await expect((await createTender.handleTab(tabName, 'get'))!).toHaveClass(/Active/);
    }

    async function verifyFieldError(fieldName: string) {
        await expect(await createTender.getFieldBoarder(fieldName)).toHaveClass(RegExp(createTenderData.fieldsErrorClasses[fieldName]));
        await expect(await createTender.getFieldErrorMsg(fieldName)).toHaveText(createTenderData.fieldsErrorMsgs[fieldName]);
    }

    async function verifyFieldErrorsByTab(tabName: 'generalInfo' | 'documentation' | 'contacts') {
        for (const field of createTenderData.fieldsByTab[tabName]) {
            await verifyFieldError(field);

        }
    }

    test.skip("Create tender with empty fields", async () => {
        await verifyTabOpened('generalInfo');
        await createTender.clickNextBtn();
        await verifyTabOpened('generalInfo');
        await verifyFieldErrorsByTab('generalInfo');

        await createTender.handleTab('documentation', 'click');
        await verifyTabOpened('documentation');
        await createTender.clickNextBtn();
        await verifyFieldErrorsByTab('documentation');

        await createTender.handleTab('contacts', 'click');
        await verifyTabOpened('contacts');
        await createTender.clickNextBtn();
        await verifyTabOpened('generalInfo');

        await createTender.handleTab('contacts', 'click');
        await verifyTabOpened('contacts');
        await contacts.unckeckContactPersonCheckbox();
        await verifyFieldErrorsByTab('contacts');
    });

    async function verifyGeneralInfoInputError(inputName: string) {
        await createTender.clickNextBtn();
        await verifyTabOpened('generalInfo');
        await expect(await generalInfo.getInput(inputName)).toBeInViewport();
        await verifyFieldError(inputName);
    }

    async function verifyServiceDropdownErrorMsg(serviceName: string) {
        const errorMsg = createTenderData.fieldsErrorMsgs["serviceDropdown"].replace('<SERVICE_NAME>', serviceName);
        await expect(await createTender.getFieldErrorMsg("serviceDropdown")).toHaveText(errorMsg, { useInnerText: true });
    }

    test.skip("Create tender with invalid tender name", async () => {
        await generalInfo.fillGeneralInfoExcept('tenderName');

        await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[0]);
        await expect(await generalInfo.getInput('tenderName')).toHaveValue(createTenderData.invalidTenderNames[0]);
        await verifyGeneralInfoInputError('tenderName');
        await generalInfo.clearInput('tenderName');

        await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[1]);
        await expect(await generalInfo.getInput('tenderName')).toHaveValue('');
        await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[2]);
        await expect(await generalInfo.getInput('tenderName')).toHaveValue('');

        await generalInfo.fillInput('tenderName', createTenderData.invalidTenderNames[3]);
        await expect(await generalInfo.getInput('tenderName')).toHaveValue(createTenderData.invalidTenderNames[3].substring(0, 70));
    })

    test.skip("Create tender with invalid service name", async () => {
        await generalInfo.fillGeneralInfoExcept('serviceName');

        await generalInfo.fillInput('serviceName', createTenderData.invalidServiceNames[0], false);
        await expect(await generalInfo.getInput('serviceName')).toHaveValue(createTenderData.invalidServiceNames[0].substring(0, 100));
        await verifyGeneralInfoInputError('serviceName');
        await verifyServiceDropdownErrorMsg(createTenderData.invalidServiceNames[0]);
        await generalInfo.clearInput("serviceName");

        await generalInfo.fillInput('serviceName', createTenderData.invalidServiceNames[1]);
        await expect(await generalInfo.getInput('serviceName')).toHaveValue('');
        await generalInfo.fillInput('serviceName', createTenderData.invalidServiceNames[2]);
        await expect(await generalInfo.getInput('serviceName')).toHaveValue('');
    })

    test.skip("Create tender with non-existing service", async () => {
        await generalInfo.fillInput('serviceName', createTenderData.nonExistingServiceName);
        await expect(await generalInfo.getInput('serviceName')).toHaveValue(createTenderData.nonExistingServiceName);
        await verifyServiceDropdownErrorMsg(createTenderData.nonExistingServiceName);

        await generalInfo.clickCreateServiceBtn();
        await expect(await generalInfo.getServiceNameDropdown()).toHaveCount(0);
        await expect(await generalInfo.getTenderCategoryLabel()).toHaveText('Користувацькі');

        await generalInfo.clickServiceNameCloseIcon();
        await expect(await generalInfo.getInput('serviceName')).toHaveValue('');

        await generalInfo.fillInput('serviceName', createTenderData.nonExistingServiceName);
        await expect(await generalInfo.getServiceNameDropdownItems()).toHaveText(createTenderData.nonExistingServiceName);

        const status = await createTenderApiHelper.deleteService('Service test');
        expect(status).toEqual(204);
    })

    test.skip("Create tender with invalid tender proposal submission period", async () => {
        await generalInfo.fillGeneralInfoExcept('endDate');

        await generalInfo.fillEndDate(23);
        await createTender.clickNextBtn();
        await verifyTabOpened('generalInfo');
        await expect(await generalInfo.getInput('endDate')).toBeInViewport();
        await expect(await createTender.getFieldBoarder('endDate')).toHaveClass(RegExp(createTenderData.fieldsErrorClasses['endDate']));
        await expect(await createTender.getFieldBoarder('endDate')).toHaveClass(RegExp(createTenderData.fieldsErrorClasses['endDate']));
        await expect(await createTender.getFieldErrorMsg('tenderProposalPeriod')).toHaveText(createTenderData.fieldsErrorMsgs.tenderProposalPeriod);
    })

    test.skip("Create tender with invalid work execution period", async () => {
        await generalInfo.fillGeneralInfoExcept();

        const endProposalSubmissionDate = await (await generalInfo.getInput('endDate')).inputValue();
        const startDate = await generalInfo.fillWorkExecutionPeriod(true);
        console.log(startDate);
        await expect(await generalInfo.getInput('workExecutionPeriod')).toHaveValue("31.03.2024 - ");
        await generalInfo.pause(5000);

    })

    test.skip("Create tender with invalid documents", async () => {
        async function uploadFilesAndVerifyPopUp(fileNames: string[], errorMsg?: string) {
            await documentation.uploadDocumentationFiles(dirName, fileNames);
            if (errorMsg) {
                await expect(await documentation.getNonValidImgPopUp()).toBeVisible();
                await expect(await documentation.getNonValidImgPopUpTitle()).toHaveText(createTenderData.uploadFilePopUpTitle);
                await expect(await documentation.getNonValidImagePopUpErrorMsg()).toHaveText(errorMsg);
                await documentation.clickConfirmNonValidImgPopUpBtn();
                await expect(await documentation.getNonValidImgPopUp()).toHaveCount(0);
            }
        }

        async function verifyUploadedFiles(filesCount: number, fileNames?: string[]) {
            await expect(await documentation.getUploadedDocumentNames()).toHaveCount(filesCount);
            if (filesCount != 0 && fileNames) {
                await expect(await documentation.getUploadedDocumentNames()).toHaveText(fileNames);
            }
        }

        await createTender.handleTab('documentation', 'click');
        await verifyTabOpened('documentation');

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
            await documentation.deleteFirstUploadedFile();
            await expect(await documentation.getUploadedDocumentNames()).toHaveCount(createTenderData.validFiles.length - i - 2);
        }

        await createTender.clickNextBtn();
        await verifyFieldError('fileUpload');
    })

    test("Cancel tender creation", async () => {
        await verifyTabOpened('generalInfo');

        await createTender.handleTab('contacts', 'click');
        await verifyTabOpened('contacts');

        await createTender.clickBackBtn();
        await verifyTabOpened('documentation');

        await createTender.clickBackBtn();
        await verifyTabOpened('generalInfo');

        await createTender.handleDialog('Ви впевнені, що хочете перейти на іншу сторінку? Внесені дані не збережуться!', 'accept');
        await createTender.clickBackBtn();
        await expect(await myTenders.getPageTitle()).toHaveText('Мої тендери');

        await myTenders.clickCreateTenderBtn();
        await createTender.handleDialog('Ви впевнені, що хочете перейти на іншу сторінку? Внесені дані не збережуться!', 'dismiss');
        await createTender.clickBackBtn();

        await generalInfo.fillGeneralInfoExcept();
        await createTender.clickNextBtn();
        await documentation.uploadDocumentationFiles(dirName, ["municipalVenicle.png"]);
        await createTender.clickNextBtn();

        await createTender.clickNextBtn();
        await expect(await createTender.getTenderConfirmPopUpMsg()).toContainText("За створення тендера з вашого рахунку буде знято 10 балів, вони будуть повернуті у разі успішного завершення тендера.\
        Ви підтверджуєте створення тендера?", {useInnerText: true});
        await createTender.clickTenderConfirmPopUp('cross');
        await verifyTabOpened('contacts');

        await createTender.clickNextBtn();
        await createTender.handleDialog('Ви впевнені, що хочете перейти на іншу сторінку? Внесені дані не збережуться!', 'accept');
        await createTender.clickTenderConfirmPopUp('cancel');
        await expect(await myTenders.getPageTitle()).toHaveText('Мої тендери');
    })
});