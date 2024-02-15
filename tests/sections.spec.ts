import { test, expect, Locator } from "@playwright/test";
import { NavBar } from "../pages/components/navbar";
import { ProductsPage } from "../pages/products.page";
import { MainPage } from "../pages/mainPage.page";
import { UnitDetailsPage } from "../pages/unitDetails.page";
import { servicesData } from "../fixtures/servicesData.json";
import { vehiclesData } from "../fixtures/vehiclesData.json";

let navBar: NavBar;
let productsPage: ProductsPage;
let mainPage: MainPage;
let unitDetailsPage: UnitDetailsPage;

async function checkSection(tabFunction: () => Promise<Locator[]>, sectionName: string, data: any[]) {
    const tabs = await tabFunction();
    for (let i = 0; i < tabs.length; i++) {
        await mainPage.scrollToSection(sectionName);
        await mainPage.clickSectionTab(sectionName, i);

        const items = await mainPage.getSectionItems(sectionName);
        await expect(items).toHaveCount(7);
        const sectionItemNames = sectionName === 'services' ? data[i].services : data[i].equipment.map(item => item.name);
        await expect(items).toHaveText(sectionItemNames);

        for (let j = 0; j < await mainPage.getSectionItemCount(sectionName); j++) {
            await mainPage.clickSectionItem(sectionName, j);
            await expect(productsPage.page).toHaveURL(/products/);
            const filterName = sectionName === 'services' ? data[i].services[j] : data[i].equipment[j].filter;
            await expect(await productsPage.getSelectedFilter()).toHaveText(filterName);

            const unitCards = await productsPage.getUnitCards();
            for (const unitCard of unitCards) {
                await expect(unitCard).toBeVisible();
            }

            if (unitCards.length > 0) {
                await productsPage.clickFirstUnitCard();
                if (sectionName === 'services') {
                    await expect(await unitDetailsPage.getServices()).toContainText([servicesData[i].services[j]]);
                } else {
                    const category = await unitDetailsPage.getCategoryName();
                    expect(data[i].equipment[j].categories).toContainEqual(category?.replace(/./, c => c.toUpperCase()).trim());
                }
            }
            await navBar.clickLogo();
            await mainPage.scrollToSection(sectionName);
            await mainPage.clickSectionTab(sectionName, i);
        }
    }
}

test.describe('Sections check', () => {
    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        navBar = new NavBar(page);
        productsPage = new ProductsPage(page);
        unitDetailsPage = new UnitDetailsPage(page);

        await mainPage.openUrl();
    });

    test('C212 - Checking "Послуги" section on the main page', async () => {
        await checkSection(async () => await mainPage.getServicesTabs(), "services", servicesData);
    });
    
    test('C213 - Checking "Спецтехніка" section on the main page', async () => {
        await checkSection(async () => await mainPage.getVehiclesTabs(), "vehicles", vehiclesData);
    });
});