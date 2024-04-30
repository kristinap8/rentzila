import { test, expect } from "../fixtures/fixture";
import * as endpoints from '../data/endpoints.data.json';
import * as myTendersData from '../data/tenderData/myTenders.json';

const userLoginData = {
    email: String(process.env.USER_EMAIL),
    password: String(process.env.USER_PASSWORD)
};
let tenderData: any;

async function checkTenderResults(myTenders: any, tabName: string) {
    await myTenders.goToTendersTab(tabName);
    await myTenders.fillSearchInput(tenderData.name);
    await expect(myTenders.getTenderCards()).toHaveCount(1);
}

test.describe("Tender operations check", async () => {
    test.beforeEach(async ({ tenderApiHelper, telegramPopUp, myTenders, loginPopUp }) => {
        let response = await tenderApiHelper.createTender();
        expect(response.status()).toBe(201);
        tenderData = await response.json();
        response = await tenderApiHelper.addTenderAttachment(tenderData.id);
        expect(response.status()).toBe(201);

        await myTenders.openUrl(endpoints.myTenders);
        await loginPopUp.login(userLoginData.email, userLoginData.password);
        await telegramPopUp.closeTelegramPopUp();

        await checkTenderResults(myTenders, "expecting");
    })

    test("Approve the tender", async ({ tenderApiHelper, myTenders }) => {
        const response = await tenderApiHelper.moderateTender(tenderData.id, 'approved');
        expect(response.status()).toBe(202);

        await myTenders.refresh();
        await checkTenderResults(myTenders, "active");
    })

    test("Reject the tender", async ({ tenderApiHelper, myTenders }) => {
        const response = await tenderApiHelper.moderateTender(tenderData.id, 'declined');
        expect(response.status()).toBe(202);

        await myTenders.refresh();
        await checkTenderResults(myTenders, "rejected");
    })

    test("Close the tender", async ({ myTenders, closeTenderPopUp, navBar }) => {
        await myTenders.clickBtn("close");
        expect(closeTenderPopUp.getTitle()).toHaveText(myTendersData.finishTenderPopupTitle);
        await closeTenderPopUp.clickCloseBtn();
        await expect(navBar.getNotificationPopUpTitle()).toHaveText(myTendersData.notificationMsg.finish);
        await checkTenderResults(myTenders, "finished");
    })

    test("Close the tender via API", async ({ tenderApiHelper, myTenders }) => {
        const response = await tenderApiHelper.closeTender(tenderData.id);
        expect(response.status()).toBe(202);

        await myTenders.refresh();
        await checkTenderResults(myTenders, "finished");
    })

    test("Delete the tender via API", async ({ tenderApiHelper }) => {
        let response = await tenderApiHelper.closeTender(tenderData.id);
        expect(response.status()).toBe(202);
        response = await tenderApiHelper.deleteTender(tenderData.id);
        expect(response.status()).toBe(204);
        response = await tenderApiHelper.getTender(tenderData.id);
        expect(response.status()).toBe(404);
    })

    test("Delete the tender", async ({ tenderApiHelper, myTenders, deleteTenderPopUp, navBar }) => {
        const response = await tenderApiHelper.closeTender(tenderData.id);
        expect(response.status()).toBe(202);

        await myTenders.refresh();
        await checkTenderResults(myTenders, "finished");
        await myTenders.clickBtn("delete");
        await expect(deleteTenderPopUp.getTitle()).toHaveText(myTendersData.deleteTenderPopupTitle);
        await deleteTenderPopUp.clickDeleteBtn();
        await expect(navBar.getNotificationPopUpTitle()).toHaveText(myTendersData.notificationMsg.delete);
        await expect(myTenders.getNonFoundTenderTitle()).toHaveText(myTendersData.nonFoundTendersMsg.replace("{name}", tenderData.name));
    })

    test.afterEach(async ({ tenderApiHelper }) => {
        let response = await tenderApiHelper.getTender(tenderData.id);
        const isTenderExist = response.status() === 200;
        if (isTenderExist) {
            response = await tenderApiHelper.deleteTender(tenderData.id);
            expect(response.status()).toBe(204);
        }
    })
})