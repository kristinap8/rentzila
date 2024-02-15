import { test, expect } from '@playwright/test';
import { NavBar } from '../pages/components/navbar';
import { ProductsPage } from '../pages/products.page';
import catalogMenuItems from '../fixtures/catalogMenuItems.json';
import catalogMenuVehicles from '../fixtures/catalogMenuVehicles.json';
import catalogMenuServices from '../fixtures/catalogMenuServices.json';


let navBar: NavBar;
let productsPage: ProductsPage;

test.describe('Catalog menu check', () => {
    test.beforeEach(async ({ page }) => {
        navBar = new NavBar(page);
        productsPage = new ProductsPage(page);

        await navBar.openUrl();
        await expect(await navBar.getLogo()).toBeVisible();
    });

    test('C559 - Verify "Каталог"', async () => {
        await expect(await navBar.getCatalogLabel()).toBeVisible();

        for (let i = 0; i < catalogMenuVehicles.subMenu.length; i++) {
            await navBar.clickCatalog();
            await expect(await navBar.getCatalogDropdownMenu()).toBeVisible();

            const firstLvlSubMenuItems = await navBar.getFirstLvlCatalogSubMenuItems();
            for (let j = 0; j < firstLvlSubMenuItems.length; j++) {
                await expect(firstLvlSubMenuItems[j]).toBeVisible();
                await expect(firstLvlSubMenuItems[j]).toHaveText(catalogMenuItems.menuItems[j]);
            }

            await navBar.hoverCatalogElementByLevelAndInd(1, 0);
            const secondLvlSubMenuItems = await navBar.getSecondLvlCatalogSubMenuItems();
            for (let j = 0; j < secondLvlSubMenuItems.length; j++) {
                await expect(secondLvlSubMenuItems[j]).toBeVisible();
                await expect(secondLvlSubMenuItems[j]).toHaveText(catalogMenuVehicles.subMenu[j].name);
            }

            await navBar.clickCatalogElementByLevelAndInd(2, i);
            await expect(productsPage.page).toHaveURL(catalogMenuVehicles.subMenu[i].url);
            await expect(await productsPage.getSelectedFilter()).toHaveText(catalogMenuVehicles.subMenu[i].name);

            await navBar.clickLogo();

            for (let j = 0; j < catalogMenuVehicles.subMenu[i].subMenu.length; j++) {
                await navBar.clickCatalog();
                await navBar.hoverCatalogElementByLevelAndInd(1, 0);
                await navBar.hoverCatalogElementByLevelAndInd(2, i);

                const thirdLvlSubMenuItems = await navBar.getThirdLvlCatalogSubMenuItems();
                for (let k = 0; k < thirdLvlSubMenuItems.length; k++) {
                    await expect(thirdLvlSubMenuItems[k]).toBeVisible();
                    await expect(thirdLvlSubMenuItems[k]).toHaveText(catalogMenuVehicles.subMenu[i].subMenu[k].name);
                }
                await navBar.clickCatalogElementByLevelAndInd(3, j);
                await expect(productsPage.page).toHaveURL(catalogMenuVehicles.subMenu[i].subMenu[j].url);
                await navBar.clickLogo();
            }
        }

        for (let i = 0; i < catalogMenuServices.subMenu.length; i++) {
            await navBar.clickCatalog();
            await navBar.hoverCatalogElementByLevelAndInd(1, 1);

            const secondLvlSubMenuItems = await navBar.getSecondLvlCatalogSubMenuItems();
            for (let j = 0; j < secondLvlSubMenuItems.length; j++) {
                await expect(secondLvlSubMenuItems[j]).toBeVisible();
                await expect(secondLvlSubMenuItems[j]).toHaveText(catalogMenuServices.subMenu[j].name);
            }

            await navBar.hoverCatalogElementByLevelAndInd(2, i);
            const thirdLvlSubMenuItems = await navBar.getThirdLvlCatalogSubMenuItems();
            for (let j = 0; j < thirdLvlSubMenuItems.length; j++) {
                await expect(thirdLvlSubMenuItems[j]).toBeVisible();
                await expect(thirdLvlSubMenuItems[j]).toHaveText(catalogMenuServices.subMenu[i].subMenu[j]);
            }

            const labelInd = catalogMenuServices.subMenu[i].subMenu.indexOf(catalogMenuServices.subMenu[i].searchLabel);
            await navBar.clickCatalogElementByLevelAndInd(3, labelInd);
            await expect(productsPage.page).toHaveURL(/\/products\/$/);
            await expect(await productsPage.getSelectedFilter()).toHaveText(catalogMenuServices.subMenu[i].searchLabel, { ignoreCase: true });

            await navBar.clickLogo();
        }
    })
})