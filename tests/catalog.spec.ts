import { test, expect, pages, testData } from "../fixtures/fixture";

async function verifySubmenuItems(navBar: pages["navBar"], level: number, expectedSubMenuItems: testData["menuItems"]) {
    const submenuItems = await navBar.getCatalogSubmenuItemsArray(level);
    for (let i = 0; i < submenuItems.length; i++) {
        await expect(submenuItems[i]).toBeVisible();
        await expect(submenuItems[i]).toHaveText(expectedSubMenuItems[i].name);
    }
}

async function hoverAndVerifyCatalogMenuItems(navBar: pages["navBar"], level: number, menuItemToHover: any) {
    await navBar.hoverCatalogElementByLevelAndName(level, menuItemToHover['name']);
    await verifySubmenuItems(navBar, level + 1, menuItemToHover['subMenu']);
}

async function hoverAndClick(navBar: pages["navBar"], levelToHover: number, names: string[]) {
    for (let i = 1; i <= levelToHover; i++) {
        await navBar.hoverCatalogElementByLevelAndName(i, names[i - 1]);
    }
    await navBar.clickCatalogElementByLevelAndName(levelToHover + 1, names[names.length - 1]);
}

async function returnToMainPage(navBar: pages["navBar"]) {
    await navBar.clickNavbarItem('logo');
    await navBar.clickNavbarItem('catalogBtn');
}

test.describe('Catalog menu check', () => {
    test.beforeEach(async ({ navBar, telegramPopUp }) => {
        await telegramPopUp.closeTelegramPopUp();
        await navBar.openUrl();
        await expect(navBar.getNavbarItem('logo')).toBeVisible();
    });

    test('C559 - Verify "Каталог"', async ({ navBar, unitsPage, menuItems, endpointsData }) => {
        await expect(navBar.getNavbarItem('catalogBtn')).toBeVisible();
        await navBar.clickNavbarItem('catalogBtn');
        await expect(navBar.getCatalogDropdown()).toBeVisible();

        //verify first level catalog menu items
        await verifySubmenuItems(navBar, 1, menuItems);
        for (let i = 0; i < menuItems.length; i++) {
            //verify second level catalog menu items
            await hoverAndVerifyCatalogMenuItems(navBar, 1, menuItems[i]);
            for (let j = 0; j < menuItems[i].subMenu.length; j++) {
                //verify third level catalog menu items
                await hoverAndVerifyCatalogMenuItems(navBar, 2, menuItems[i].subMenu[j]);
            }
        }

        // Verify URL and selected filter for vehicles second level submenu items
        const vehiclesMenuItem = menuItems[0].name;
        const vehiclesSndLvlMenuItems = menuItems[0].subMenu;
        for (let j = 0; j < vehiclesSndLvlMenuItems.length; j++) {
            await hoverAndClick(navBar, 1, [vehiclesMenuItem, vehiclesSndLvlMenuItems[j].name]);
            await expect(unitsPage.page).toHaveURL(vehiclesSndLvlMenuItems[j]['url']);
            await expect(await unitsPage.getSelectedFilter()).toHaveText(vehiclesSndLvlMenuItems[j].name);
            await returnToMainPage(navBar);
        }

        // Verify URL and selected filter for vehicles and services third level submenu items
        for (let i = 0; i < menuItems.length; i++) {
            const sndLvlMenuItems = menuItems[i].subMenu;
            for (let j = 0; j < sndLvlMenuItems.length; j++) {
                const thirdLvlMenuItems = sndLvlMenuItems[j].subMenu;
                for (let k = 0; k < thirdLvlMenuItems.length; k++) {
                    await hoverAndClick(navBar, 2, [menuItems[i].name, sndLvlMenuItems[j].name, thirdLvlMenuItems[k].name]);
                    (i === 0) ? await expect(unitsPage.page).toHaveURL(thirdLvlMenuItems[k]['url']) : await expect(unitsPage.page).toHaveURL(endpointsData["units"]);
                    await expect(await unitsPage.getSelectedFilter()).toHaveText(thirdLvlMenuItems[k].name);
                    await returnToMainPage(navBar);
                }
            }
        }
    })
})