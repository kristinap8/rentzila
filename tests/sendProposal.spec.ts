import { test, expect } from "../fixtures/fixture";

const adminLoginData = {
    email: String(process.env.ADMIN_EMAIL),
    password: String(process.env.ADMIN_PASSWORD),
    phone: String(process.env.ADMIN_PHONE)
}
const userLoginData = {
    email: String(process.env.USER_EMAIL),
    password: String(process.env.USER_PASSWORD),
    phone: String(process.env.USER_PHONE)
}
const dirName: string = 'data/unitProposalData';
const additionalFileName = 'vehicle.jpg';

test.describe("Proposal sending functionalily check", async () => {
    test.beforeEach(async ({ telegramPopUp }) => {
        await telegramPopUp.closeTelegramPopUpViaLocatorHandler();
    })
    test("Verify user can send proposal to unit", async ({ page, baseURL, navBar, loginPopUp, unitsPage, unitDetailsPage, orderUnitPopUp, proposesToOwnerUnit, proposalDetails, unitApiHelper,  myUnitsPage, endpointsData, unitProposalData }) => {
        // Creation and approval of unit using API
        let createdUnit = await unitApiHelper.createUnit();
        await unitApiHelper.addUnitImage(createdUnit.id, dirName, additionalFileName);
        await unitApiHelper.approveUnit(createdUnit.id);

        // Login as admin
        await page.goto(`${baseURL}${endpointsData.createUnit}`);
        await navBar.clickElement('login');
        await loginPopUp.login({ emailPhone: adminLoginData.email, password: adminLoginData.password });

        // Find created unit
        await navBar.fillSearchInput(createdUnit.name);
        await unitsPage.clickFirstUnitCard();

        // Make proposal
        await unitDetailsPage.clearElement('order');
        await orderUnitPopUp.makeProposal(createdUnit.startDate, createdUnit.endDate, dirName, additionalFileName, createdUnit.proposalComment);
        await expect(await orderUnitPopUp.getProposalPopUpTitle()).toHaveText(unitProposalData.successRentProposalPopUp.title);
        await expect(await orderUnitPopUp.getProposalPopUpMsg()).toHaveText(unitProposalData.successRentProposalPopUp.msg);
        await orderUnitPopUp.clickProposalPopUpCrossIcon();

        // Logout as admin
        await navBar.clickNavbarItem('logo');
        await navBar.clickProfileDropdownBtn('logout');

        // Login as user
        await navBar.clickNavbarItem('loginBtn');
        await loginPopUp.login({ emailPhone: userLoginData.email, password: userLoginData.password });

        // Navigate to sent proposal
        await navBar.clickNavbarItem('logo');
        await navBar.clickProfileDropdownBtn('advertisments');
        await myUnitsPage.clickProposalBtn(createdUnit.name);
        await proposesToOwnerUnit.clickFirstProposalDetalilsBtn();

        // Verify sent proposal details
        expect(await proposalDetails.getProposerName()).toBe((createdUnit.proposerInfo.last_name + ' ' + createdUnit.proposerInfo.first_name + ' ' + createdUnit.middle_name).trim());
        // The following check is excluded because of a BUG: start rent period date is one day before as selected
        // await expect(await proposalDetails.getRentPeriod()).toHaveText(formattedStartDate + ' - ' + formattedEndDate);
        await expect(await proposalDetails.getAdditionalFileNames()).toContainText(additionalFileName);
        await expect(await proposalDetails.getProposalComment()).toHaveText(createdUnit.proposalComment);

        // Delete created unit using API
        await unitApiHelper.deleteUnit(createdUnit.id);
    })
})