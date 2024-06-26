import { test, expect, pages, testData, helpers } from "../../fixtures/fixture";

const sectionItemsNumber = 7;

async function checkSection(mainPage: pages["mainPage"], navBar: pages["navBar"], unitsPage: pages["unitsPage"], unitDetailsPage: pages["unitDetailsPage"], helper: helpers["helper"], endpoints: testData["endpointsData"], sectionName: "services" | "vehicles", data: testData["servicesData"] | testData["vehiclesData"]) {
    let tabs = await mainPage.getSectionTabsArray(sectionName);

    for (let i = 0; i < tabs.length; i++) {
        await mainPage.scrollToSection(sectionName);
        await mainPage.clickSectionTab(sectionName, i);

        let items = await mainPage.getSectionItems(sectionName);
        await expect(items).toHaveCount(sectionItemsNumber);
        let sectionItemNames = sectionName === 'services' ? data[i]["services"] : data[i]["equipment"].map(item => item.name);
        await expect(items).toHaveText(sectionItemNames);

        for (let j = 0; j < await mainPage.getSectionItemCount(sectionName); j++) {
            await mainPage.clickSectionItem(sectionName, j);
            sectionName === 'services' ? await expect(unitsPage.page).toHaveURL(endpoints.units) : await expect(unitsPage.page).toHaveURL(endpoints.units + data[i]["equipment"][j].lastPathSegment);
            let filterName = sectionName === 'services' ? data[i]["services"][j] : data[i]["equipment"][j].filter;
            await expect(await unitsPage.getSelectedFilter()).toHaveText(filterName);

            await unitsPage.switchToUnitsList();
            let unitCards = await unitsPage.getListUnitCards();
            for (const unitCard of unitCards) {
                await expect(unitCard).toBeVisible();
            }

            if (unitCards.length > 0) {
                await unitsPage.clickFirstUnitCard();
                if (sectionName === 'services') {
                    await expect(unitDetailsPage.getUnitInfo('services')).toContainText([data[i]["services"][j]]);
                } else {
                    let category = helper.capitalizeAndTrim((await unitDetailsPage.getCategoryText())!);
                    expect(data[i]["equipment"][j].categories).toContainEqual(category);
                }
            }
            await navBar.clickNavbarItem('logo');
            await mainPage.scrollToSection(sectionName);
            await mainPage.clickSectionTab(sectionName, i);
        }
    }
}

test.describe('Sections check', () => {
    test.beforeEach(async ({ mainPage, telegramPopUp }) => {
        await telegramPopUp.closeTelegramPopUpViaLocatorHandler();
        await mainPage.openUrl();
    });

    test('C212 - Checking "Послуги" section on the main page', async ({ mainPage, navBar, unitsPage, unitDetailsPage, helper, endpointsData, servicesData }) => {
        await checkSection(mainPage, navBar, unitsPage, unitDetailsPage, helper, endpointsData, "services", servicesData);
    });

    test('C213 - Checking "Спецтехніка" section on the main page', async ({ mainPage, navBar, unitsPage, unitDetailsPage, helper, endpointsData, vehiclesData }) => {
       await checkSection(mainPage, navBar, unitsPage, unitDetailsPage, helper, endpointsData, "vehicles", vehiclesData);
    });
});