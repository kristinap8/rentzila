import { test, expect } from '../fixtures/fixture';
import * as endpoints from '../data/endpoints.data.json';
import * as editUnitData from '../data/editUnitData/data.json';

let createdUnitData: any;
const editUnitFormFields: string[] = ['category', 'manufacturer', 'model', 'technical features', 'description', 'location', 'services', 'minimal price', 'payment method'];
const userLoginData = {
    email: String(process.env.USER_EMAIL),
    password: String(process.env.USER_PASSWORD)
};
/**
 * Verifies the success message and notification after editing a unit. 
 * Checks if the edited unit is moved from the active tab to the pending tab.
 * 
 * @param {any} navBar - The navigation bar.
 * @param {any} editUnit - The "Edit Unit" page.
 * @param {any} myUnitsPage - The "My Units" page.
 * @param {string} unitName - Edited unit name.
 */
async function verifyUnitEditing(navBar: any, editUnit: any, myUnitsPage: any, unitName: string) {
    await expect(navBar.getNotificationPopUpTitle()).toHaveText(editUnitData.notificationMsg.save);
    await expect(editUnit.getCompleteEditingTitle()).toHaveText(editUnitData.completeEditingTitle);
    await expect(editUnit.getGoToMyUnitsBtn()).toBeVisible();

    await editUnit.clickGoToMyUnitsBtn();
    await expect(myUnitsPage.getUnitCardNames()).not.toContainText([unitName]);
    await myUnitsPage.clickTab('pending');
    await expect(myUnitsPage.getUnitCardNames()).toContainText([unitName]);
}
/**
 * Edits a unit with invalid data, verifies the associated error message, 
 * and checks if the input field displays a red border indicating an error state. 
 * 
 * @param {any} editUnit - The "Edit Unit" page.
 * @param {'unitName'} inputName - The name of the input field being edited.
 * @param {string} value - The invalid value to be entered into the input field.
 * @param {'empty' | 'less' | 'exceeding'} errorType - The error message type.
 * @param {boolean} [clear] - Clear input before typing into it (optional).
 * @param {boolean} [clearByCrossBtn] - Clear input before typing into it by clicking on cross button(optional).
 * @param {boolean} [dropdown] - The error message is displayed as a dropdown (optional).
 * @param {string} [searchName] - The name that error message contains (optional).
 */
async function editUnitWithInvalidData(editUnit: any, inputName: 'unitName' | 'manufacturer' | 'model', value: string, errorType: 'empty' | 'less' | 'exceeding' | 'nonExisting', clear?: boolean, clearByCrossBtn?: boolean, dropdown: boolean = false, searchName?: string) {
    await editUnit.fillInput(inputName, value, clear, clearByCrossBtn);
    await editUnit.clickSaveBtn();
    await expect(editUnit.getInput(inputName, true)).toHaveClass(RegExp(editUnitData.fieldsErrorClasses[inputName]));
    const errorMsg = searchName ? editUnitData.fieldErrorMsgs[inputName][errorType].replace('{name}', searchName) : editUnitData.fieldErrorMsgs[inputName][errorType];
    await expect(editUnit.getInputErrorMsg(inputName, dropdown)).toHaveText(errorMsg);
}
/**
 * Verify that unit field is changed after editing.
 * 
 * @param {any} unitDetailsPage - The "Unit Details" page.
 * @param {editUnitFormFields} field - Field to verify for changing.
 * @param {any} unitData - Edited unit data.
 */
async function verifyEditedUnitData(unitDetailsPage: any, field: 'category' | 'manufacturer' | 'model' | 'technical features' | 'description' | 'location' | 'services' | 'minimal price' | 'payment method', unitData: any) {
    switch (field) {
        case 'category':
            await expect(unitDetailsPage.getCategory()).toHaveText(unitData.category.name, { ignoreCase: true });
            break;
        case 'manufacturer':
            await expect(unitDetailsPage.getManufacturer()).toHaveText(unitData.manufacturer.name);
            break;
        case 'model':
            unitData.model_name.length > 0 ? await expect(unitDetailsPage.getModel()).toHaveText(unitData.model_name) : await expect(unitDetailsPage.getModel()).toHaveCount(0);
            break;
        case 'technical features':
            unitData.features.length > 0 ? await expect(unitDetailsPage.getTechnicalFeatures()).toHaveText(unitData.features) : await expect(unitDetailsPage.getTechnicalFeatures()).toHaveCount(0);
            break;
        case 'description':
            unitData.description.length > 0 ? await expect(unitDetailsPage.getDescription()).toHaveText(unitData.description) : await expect(unitDetailsPage.getDescription()).toHaveCount(0);
            break;
        case 'location':
            const location = unitData.city + ", " + unitData.region + ", " + unitData.country;
            await expect(unitDetailsPage.getLocation()).toHaveText(location);
            break;
        case 'services':
            await expect(unitDetailsPage.getServices()).toHaveText(unitData.services.map(service => service.name));
            break;
        case 'minimal price':
            const minimalPrice = unitData.minimal_price.toLocaleString('uk-UA', { maximumFractionDigits: 0 }) + " грн";
            await expect(unitDetailsPage.getMinimalPrice()).toHaveText(minimalPrice);
            break;
        case 'payment method':
            await expect(unitDetailsPage.getPaymentMethod()).toHaveText(editUnitData.paymentMethod[unitData.payment_method]);
            break;
        default:
            throw new Error(`Invalid unit field: ${field}`);
    }
}

test.describe("Edit unit functionality check", async () => {
    test.beforeEach(async ({ unitApiHelper, telegramPopUp, loginPopUp, myUnitsPage }) => {
        //Navigate to My Advertisments page and login as a user
        await myUnitsPage.openUrl(endpoints.myAdvertisments);
        await loginPopUp.login(userLoginData.email, userLoginData.password);
        await telegramPopUp.closeTelegramPopUp();

        // Creation of unit using API
        let response = await unitApiHelper.createUnit();
        expect(response.status()).toBe(201);
        createdUnitData = await response.json();
        response = await unitApiHelper.addUnitImage(createdUnitData.id);
        expect(response.status()).toBe(201);

        // Approval of unit using API
        response = await unitApiHelper.approveUnit(createdUnitData.id);
        expect(response.status()).toBe(200);

        await myUnitsPage.refresh();
        await myUnitsPage.clickTab('active');
        await expect(myUnitsPage.getUnitCardNames()).toContainText([createdUnitData.name]);
    });

    test("Edit unit without changes", async ({ myUnitsPage, editUnit, navBar, unitDetailsPage }) => {
        await myUnitsPage.clickEditBtn(createdUnitData.name);
        await expect(editUnit.getTitle()).toHaveText(editUnitData.title);

        await editUnit.handleDialog('accept');
        await editUnit.clickCancelChangesBtn();
        await expect(myUnitsPage.getUnitCardNames()).toContainText([createdUnitData.name]);

        await myUnitsPage.clickEditBtn(createdUnitData.name);
        await editUnit.clickSaveBtn();
        await verifyUnitEditing(navBar, editUnit, myUnitsPage, createdUnitData.name);

        await myUnitsPage.clickUnitCard(createdUnitData.name);
        // Verify that unit information didn't change
        for (const field of editUnitFormFields) {
            await verifyEditedUnitData(unitDetailsPage, field as 'category' | 'manufacturer' | 'model' | 'technical features' | 'description' | 'location' | 'services' | 'minimal price' | 'payment method', createdUnitData);
        }
    });
    test("Check 'Назва оголошення' input field", async ({ myUnitsPage, editUnit, navBar, dataGenerator }) => {
        await myUnitsPage.clickEditBtn(createdUnitData.name);

        await editUnitWithInvalidData(editUnit, 'unitName', '', 'empty');

        for (const symbol of editUnitData.invalidData.unitName.notAllowed) {
            await editUnit.fillInput('unitName', symbol);
            await expect(editUnit.getInput('unitName')).toHaveValue('');
            await expect(editUnit.getInput('unitName')).toHaveAttribute('placeholder', 'Введіть назву оголошення');
        }

        await editUnitWithInvalidData(editUnit, 'unitName', editUnitData.invalidData.unitName.less, 'less');
        await editUnitWithInvalidData(editUnit, 'unitName', editUnitData.invalidData.unitName.exceeding, 'exceeding');

        const newUnitName = "unit " + dataGenerator.generateRandomUUID();
        await editUnit.fillInput('unitName', newUnitName);
        await expect(editUnit.getInput('unitName', true)).not.toHaveClass(RegExp(editUnitData.fieldsErrorClasses.unitName));
        await editUnit.clickSaveBtn();
        await verifyUnitEditing(navBar, editUnit, myUnitsPage, newUnitName);
    });
    test('Check "Виробник транспортного засобу" input field', async ({ myUnitsPage, editUnit, navBar, unitDetailsPage, dataGenerator, apiHelper }) => {
        await myUnitsPage.clickEditBtn(createdUnitData.name);

        await editUnitWithInvalidData(editUnit, 'manufacturer', '', 'empty', false, true);

        for (const symbol of editUnitData.invalidData.manufacturer.notAllowed) {
            await editUnit.fillInput('manufacturer', symbol, false);
            await expect(editUnit.getInput('manufacturer')).toHaveValue('');
        }

        await editUnitWithInvalidData(editUnit, 'manufacturer', editUnitData.invalidData.manufacturer.nonExisting, 'nonExisting', false, false, true, editUnitData.invalidData.manufacturer.nonExisting);

        createdUnitData.manufacturer = dataGenerator.getRandomManufacturer(await apiHelper.getData('manufacturers'));
        await editUnit.fillInput('manufacturer', createdUnitData.manufacturer.name);
        await expect(editUnit.getManufacturerDropdownItems()).toContainText([createdUnitData.manufacturer.name]);
        await editUnit.selectManufacturerItem(createdUnitData.manufacturer.name);
        await expect(editUnit.getInputErrorMsg('manufacturer')).toHaveCount(0);
        await expect(editUnit.getManufacturerText()).toHaveText(createdUnitData.manufacturer.name);
        await expect(editUnit.getManufacturerInputCloseBtn()).toBeVisible();
        await editUnit.clickSaveBtn();

        await verifyUnitEditing(navBar, editUnit, myUnitsPage, createdUnitData.name);
        await myUnitsPage.clickUnitCard(createdUnitData.name);
        await verifyEditedUnitData(unitDetailsPage, 'manufacturer', createdUnitData);
    });
    test('Check "Назва моделі" input field', async ({ myUnitsPage, editUnit, navBar, unitDetailsPage, dataGenerator }) => {
        await myUnitsPage.clickEditBtn(createdUnitData.name);

        for (const symbol of editUnitData.invalidData.model.notAllowed) {
            await editUnit.fillInput('model', symbol);
            await expect(editUnit.getInput('model')).toHaveValue('');
            await expect(editUnit.getInput('model')).toHaveAttribute('placeholder', 'Введіть назву моделі');
        }

        await editUnitWithInvalidData(editUnit, 'model', editUnitData.invalidData.model.exceeding, 'exceeding');

        createdUnitData.model_name = dataGenerator.generateRandomText(1, 15);
        await editUnit.fillInput('model', createdUnitData.model_name);
        await editUnit.clickSaveBtn();
        await verifyUnitEditing(navBar, editUnit, myUnitsPage, createdUnitData.name);
        await myUnitsPage.clickUnitCard(createdUnitData.name);
        await verifyEditedUnitData(unitDetailsPage, 'model', createdUnitData);
    });
    test('Check "Технічні характеристики" input field', async ({ myUnitsPage, editUnit, navBar, unitDetailsPage, dataGenerator }) => {
        await myUnitsPage.clickEditBtn(createdUnitData.name);

        createdUnitData.features = '';
        await editUnit.fillInput('technical features', createdUnitData.features);
        await editUnit.clickSaveBtn();

        await verifyUnitEditing(navBar, editUnit, myUnitsPage, createdUnitData.name);
        await myUnitsPage.clickUnitCard(createdUnitData.name);
        await verifyEditedUnitData(unitDetailsPage, 'technical features', createdUnitData);

        await unitDetailsPage.clickEditBtn();
        for (const symbol of editUnitData.invalidData["technical features"].notAllowed) {
            await editUnit.fillInput('technical features', symbol);
            await expect(editUnit.getInput('technical features')).toHaveValue('');
        }
        createdUnitData.features = dataGenerator.generateRandomText(40, 90);
        await editUnit.fillInput('technical features', createdUnitData.features);
        await editUnit.clickSaveBtn();
        await verifyUnitEditing(navBar, editUnit, myUnitsPage, createdUnitData.name);
        await myUnitsPage.clickUnitCard(createdUnitData.name);
        await verifyEditedUnitData(unitDetailsPage, 'technical features', createdUnitData);
    });
    test('Check "Опис" input field', async ({ myUnitsPage, editUnit, navBar, unitDetailsPage, dataGenerator }) => {
        await myUnitsPage.clickEditBtn(createdUnitData.name);

        createdUnitData.description = '';
        await editUnit.fillInput('description', createdUnitData.description);
        await editUnit.clickSaveBtn();

        await verifyUnitEditing(navBar, editUnit, myUnitsPage, createdUnitData.name);
        await myUnitsPage.clickUnitCard(createdUnitData.name);
        await verifyEditedUnitData(unitDetailsPage, 'description', createdUnitData);

        await unitDetailsPage.clickEditBtn();
        for (const symbol of editUnitData.invalidData.description.notAllowed) {
            await editUnit.fillInput('description', symbol);
            await expect(editUnit.getInput('description')).toHaveValue('');
        }
        createdUnitData.description = dataGenerator.generateRandomText(40, 90);
        await editUnit.fillInput('description', createdUnitData.description);
        await editUnit.clickSaveBtn();
        await verifyUnitEditing(navBar, editUnit, myUnitsPage, createdUnitData.name);
        await myUnitsPage.clickUnitCard(createdUnitData.name);
        await verifyEditedUnitData(unitDetailsPage, 'description', createdUnitData);
    });
    test('Check "Місце розташування технічного засобу" functionality', async ({ myUnitsPage, editUnit, mapPopUp }) => {
        await myUnitsPage.clickEditBtn(createdUnitData.name);

        await editUnit.clickChooseOnMapBtn();
        await expect.soft(mapPopUp.getMapZoom()).toHaveAttribute('style', '');
       // await expect.soft(mapPopUp.getMapZoom()).toHaveAttribute('style', '');
        console.log((await mapPopUp.getMapZoom().getAttribute('style'))!.match(/scale\((\d+)\)/));
        console.log('');
    });
});