import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/mainPage.page';
import { NavBar } from '../pages/components/navbar';
import { LoginPopUp } from '../pages/components/loginPopUp';
import { MyAdvertisments } from '../pages/myAdvertisments.page';
import CreateUnitApiHelper from '../helper/createUnitAPI.helper';


let mainPage: MainPage;
let navBar: NavBar;
let loginPopUp: LoginPopUp;
let myAdvertisments: MyAdvertisments;
const createUnitApiHelper = new CreateUnitApiHelper();

test.describe('Create unit check', () => {
    test('Verify unit creation', async ({page}) => {
        mainPage = new MainPage(page);
        navBar = new NavBar(page);
        loginPopUp = new LoginPopUp(page);
        myAdvertisments = new MyAdvertisments(page);
        await mainPage.openUrl();

        const unitData = await createUnitApiHelper.generateUnitData();
        let responseStatus = await createUnitApiHelper.createUnit(unitData);
        expect(responseStatus).toBe(201);
        responseStatus = await createUnitApiHelper.uploadUnitImage();
        expect(responseStatus).toBe(201);

        await navBar.clickLoginBtn();
        await loginPopUp.login(process.env.USER_EMAIL, process.env.USER_PASSWORD);
        await navBar.clickAvatarIcon();
        await navBar.clickAdvertismentsDropdownItem();
        await myAdvertisments.clickExpectedAdvertismentsTab();
        await expect(await myAdvertisments.getExpectedUnitCardNames()).toContainText([unitData.name]);
        
        responseStatus = await createUnitApiHelper.deleteUnit();
        expect(responseStatus).toBe(204);
    });
});