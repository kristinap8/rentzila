import { test as base } from '@playwright/test';
import { MyProfile } from '../pages/myProfile.page';
import { LoginPopUp } from '../pages/components/loginPopUp';
import { MyProfileSideMenu } from '../pages/components/myProfileSideMenu';
import { NavBar } from '../pages/components/navbar';
import { MapPopUp } from '../pages/components/mapPopUp';
import { TelegramPopUp } from '../pages/components/telegramPopUp';
import { UnitsPage } from '../pages/units.page';
import { UnitDetailsPage } from '../pages/unitDetails.page';
import { OrderUnitPopUp } from '../pages/components/orderUnitPopUp';
import { MyAdvertisments } from '../pages/myAdvertisments.page';
import { ProposesToOwnerUnit } from '../pages/proposesToOwnerUnit.page';
import { ProposalDetails } from '../pages/proposalDetails.page';
import { EditUnit } from '../pages/editUnit.page';
import { MyTenders } from '../pages/myTenders/myTenders.page';
import { CloseTenderPopUp } from '../pages/myTenders/closeTenderPopUp.page';
import { DeleteTenderPopUp } from '../pages/myTenders/deleteTenderPopUp.page';
import { myFavouriteUnitsPage } from '../pages/myFavouriteUnits.page';
import { MyUnitsPage } from '../pages/myUnits.page';
import { MainPage } from '../pages/mainPage.page';

export type pages = {
    myProfile: MyProfile
    loginPopUp: LoginPopUp
    myProfileSideMenu: MyProfileSideMenu
    navBar: NavBar
    mapPopUp: MapPopUp
    telegramPopUp: TelegramPopUp
    unitsPage: UnitsPage
    unitDetailsPage: UnitDetailsPage
    orderUnitPopUp: OrderUnitPopUp
    myAdvertisments: MyAdvertisments
    proposesToOwnerUnit: ProposesToOwnerUnit
    proposalDetails: ProposalDetails
    editUnit: EditUnit
    myTenders: MyTenders
    closeTenderPopUp: CloseTenderPopUp
    deleteTenderPopUp: DeleteTenderPopUp
    myFavouriteUnitsPage: myFavouriteUnitsPage
    myUnitsPage: MyUnitsPage
    mainPage: MainPage
}

const testPages = base.extend<pages>({
    myProfile: async ({ page }, use) => {
        await use(new MyProfile(page));
    },
    loginPopUp: async ({ page }, use) => {
        await use(new LoginPopUp(page));
    },
    myProfileSideMenu: async ({ page }, use) => {
        await use(new MyProfileSideMenu(page));
    },
    navBar: async ({ page, isMobile }, use) => {
        await use(new NavBar(page, isMobile));
    },
    mapPopUp: async ({page}, use) => {
        await use(new MapPopUp(page));
    },
    telegramPopUp: async ({ page, isMobile }, use) => {
        await use(new TelegramPopUp(page, isMobile));
    },
    unitsPage: async ({ page, isMobile }, use) => {
        await use(new UnitsPage(page, isMobile));
    },
    unitDetailsPage: async ({ page }, use) => {
        await use(new UnitDetailsPage(page));
    },
    orderUnitPopUp: async ({ page }, use) => {
        await use(new OrderUnitPopUp(page));
    },
    myAdvertisments: async ({ page }, use) => {
        await use(new MyAdvertisments(page));
    },
    proposesToOwnerUnit: async ({ page }, use) => {
        await use(new ProposesToOwnerUnit(page));
    },
    proposalDetails: async ({ page }, use) => {
        await use(new ProposalDetails(page));
    },
    editUnit: async ({page}, use) => {
        await use(new EditUnit(page));
    },
    myTenders: async ({page}, use) => {
        await use(new MyTenders(page));
    },
    closeTenderPopUp: async ({page}, use) => {
        await use(new CloseTenderPopUp(page));
    },
    deleteTenderPopUp: async ({page}, use) => {
        await use(new DeleteTenderPopUp(page));
    },
    myFavouriteUnitsPage: async ({page}, use) => {
        await use(new myFavouriteUnitsPage(page));
    },
    myUnitsPage: async({page}, use) => {
        await use(new MyUnitsPage(page));
    },
    mainPage: async({page, isMobile}, use) => {
        await use(new MainPage(page, isMobile));
    }
})

export const test = testPages;