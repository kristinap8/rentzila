import { test, expect } from '../fixtures/fixture';

const folderName = 'createUnitData';
const imageName = 'vehicle.jpg';
const userLoginCredentials = {
    "email": String(process.env.USER_EMAIL),
    "password": String(process.env.USER_PASSWORD)
}

test.describe('Create unit check', () => {
    test('Verify unit creation using API', async ({ unitApiHelper, loginPopUp, myUnitsPage, endpointsData }) => {
        const unitData = await unitApiHelper.createUnit();
        await unitApiHelper.addUnitImage(unitData.id, folderName, imageName);

        await myUnitsPage.openUrl(endpointsData.myUnits);
        await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: userLoginCredentials.password });
        await myUnitsPage.clickTab('pending');
        await myUnitsPage.searchUnit(unitData.name);
        await expect(myUnitsPage.getUnitCardNames()).toHaveCount(1);
        await expect(myUnitsPage.getUnitCardNames()).toHaveText(unitData.name);

        // Postcondition: delete created unit
        await unitApiHelper.deleteUnit(unitData.id);
    });
});