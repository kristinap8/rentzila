// import { test, expect } from '../fixtures/fixtures';
// import { DateTime } from 'luxon';
// import * as endpoints from '../data/endpoints.data.json';
// import * as proposalData from '../data/unitProposalData/data.json';


// const adminLoginData = {
//     email: String(process.env.ADMIN_EMAIL),
//     password: String(process.env.ADMIN_PASSWORD),
//     phone: String(process.env.ADMIN_PHONE)
// }
// const userLoginData = {
//     email: String(process.env.USER_EMAIL),
//     password: String(process.env.USER_PASSWORD),
//     phone: String(process.env.USER_PHONE)
// }
// const dirName: string = 'data/unitProposalData';
// const additionalFileName = 'vehicle.jpg';

// test.describe("Proposal sending functionalily check", async () => {
//     test.beforeEach(async ({ page, telegramPopUp }) => {
//         await page.addLocatorHandler(await telegramPopUp.getTelegramPopUp(), async () => {
//             await telegramPopUp.closeTelegramPopUp();
//         });
//     })
//     test("Verify user can send proposal to unit", async ({ page, baseURL, navBar, loginPopUp, unitsPage, unitDetailsPage, orderUnitPopUp, myAdvertisments, proposesToOwnerUnit, proposalDetails, createUnitApiHelper, userApiHelper, dataGenerator }) => {
//         const unitData = await createUnitApiHelper.generateUnitData();
//         const proposerInfo = await userApiHelper.getLoggedInUserInfo(adminLoginData.email, adminLoginData.password, adminLoginData.phone);
//         const proposalComment = dataGenerator.generateComment();
//         const { startDate, endDate } = dataGenerator.generateOrderUnitPeriod();
//         const formattedStartDate = DateTime.fromJSDate(startDate).toFormat('dd.MM.yyyy');
//         const formattedEndDate = DateTime.fromJSDate(endDate).toFormat('dd.MM.yyyy');

//         // Creation and approval of unit using API
//         let responseStatus = await createUnitApiHelper.createUnit(unitData);
//         expect(responseStatus).toBe(201);
//         responseStatus = await createUnitApiHelper.uploadUnitImage(dirName, additionalFileName);
//         expect(responseStatus).toBe(201);
//         responseStatus = await createUnitApiHelper.approveUnit();
//         expect(responseStatus).toBe(200);

//         // Login as admin
//         await page.goto(`${baseURL}${endpoints.units}`);
//         await navBar.clickLoginBtn();
//         await loginPopUp.login(adminLoginData.email, adminLoginData.password);
        
//         // Find created unit
//         await navBar.searchItem(unitData.name);
//         await unitsPage.clickFirstUnitCard();

//         // Make proposal
//         await unitDetailsPage.clickOrderBtn();
//         await orderUnitPopUp.makeProposal(startDate, endDate, dirName, additionalFileName, proposalComment);
//         await expect(await orderUnitPopUp.getProposalPopUpTitle()).toHaveText(proposalData.successRentProposalPopUp.title);
//         await expect(await orderUnitPopUp.getProposalPopUpMsg()).toHaveText(proposalData.successRentProposalPopUp.msg);
//         await orderUnitPopUp.clickProposalPopUpCrossIcon();

//         // Logout as admin
//         await navBar.clickAvatarIcon();
//         await navBar.clickLogoutDropdownItem();

//         // Login as user
//         await navBar.clickLoginBtn();
//         await loginPopUp.login(userLoginData.email, userLoginData.password);

//         // Navigate to sent proposal
//         await navBar.clickAvatarIcon();
//         await navBar.clickAdvertismentsDropdownItem();
//         await myAdvertisments.clickProposalBtn(unitData.name);
//         await proposesToOwnerUnit.clickFirstProposalDetalilsBtn();

//         // Verify sent proposal details
//         expect(await proposalDetails.getProposerName()).toBe((proposerInfo.last_name + ' ' + proposerInfo.first_name + ' ' + proposerInfo.middle_name).trim());
//         // The following check is excluded because of a BUG: start rent period date is one day before as selected
//         // await expect(await proposalDetails.getRentPeriod()).toHaveText(formattedStartDate + ' - ' + formattedEndDate);
//         await expect(await proposalDetails.getAdditionalFileNames()).toContainText(additionalFileName);
//         await expect(await proposalDetails.getProposalComment()).toHaveText(proposalComment);

//         // Delete created unit using API
//         responseStatus = await createUnitApiHelper.deleteUnit();
//         expect(responseStatus).toBe(204);
//     })
// })