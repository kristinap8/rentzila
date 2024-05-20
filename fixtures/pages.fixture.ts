import { test as base } from '@playwright/test';
import { MyProfile } from '../pages/myProfile.page';
import { LoginPopUp } from '../pages/components/loginPopUp';
import { Calendar } from '../pages/components/calendar';
import { OwnCabinetLeftSideMenu } from '../pages/components/ownCabinetLeftSideMenu';
import { NotificationPopUp } from '../pages/components/notificationPopUp';
import { NavBar } from '../pages/components/navbar';
import { MapPopUp } from '../pages/components/mapPopUp';
import { TelegramPopUp } from '../pages/components/telegramPopUp';
import { UnitsPage } from '../pages/units.page';
import { UnitDetailsPage } from '../pages/unitDetails.page';
import { OrderUnitPopUp } from '../pages/components/orderUnitPopUp';
import { ProposesToOwnerUnit } from '../pages/proposesToOwnerUnit.page';
import { ProposalDetails } from '../pages/proposalDetails.page';
import { EditUnit } from '../pages/editUnit.page';
import { MyTenders } from '../pages/myTenders/myTenders.page';
import { EditTender } from '../pages/editTender.page';
import { CloseTenderPopUp } from '../pages/myTenders/closeTenderPopUp.page';
import { DeleteTenderPopUp } from '../pages/myTenders/deleteTenderPopUp.page';
import { CreateTender } from '../pages/createTender/page';
import { GeneralInfoTab } from '../pages/createTender/generalInfoTab';
import { DocumentationTab } from '../pages/createTender/documentationTab';
import { ContactsTab } from '../pages/createTender/contactsTab';
import { CompleteTenderCreation } from '../pages/createTender/completeTenderCreation';
import { myFavouriteUnitsPage } from '../pages/myFavouriteUnits.page';
import { MyUnitsPage } from '../pages/myUnits.page';
import { MainPage } from '../pages/main.page';
import { Footer } from '../pages/components/footer';

export type pages = {
    myProfile: MyProfile
    loginPopUp: LoginPopUp
    calendar: Calendar
    ownCabinetLeftSideMenu: OwnCabinetLeftSideMenu
    notificationPopUp: NotificationPopUp
    navBar: NavBar
    mapPopUp: MapPopUp
    telegramPopUp: TelegramPopUp
    unitsPage: UnitsPage
    unitDetailsPage: UnitDetailsPage
    orderUnitPopUp: OrderUnitPopUp
    proposesToOwnerUnit: ProposesToOwnerUnit
    proposalDetails: ProposalDetails
    editUnit: EditUnit
    editTender: EditTender
    myTenders: MyTenders
    closeTenderPopUp: CloseTenderPopUp
    deleteTenderPopUp: DeleteTenderPopUp
    createTender: CreateTender
    generalInfoTab: GeneralInfoTab
    documentationTab: DocumentationTab
    contactsTab: ContactsTab
    completeTenderCreation: CompleteTenderCreation
    myFavouriteUnitsPage: myFavouriteUnitsPage
    myUnitsPage: MyUnitsPage
    mainPage: MainPage
    footer: Footer
}

const testPages = base.extend<pages>({
    myProfile: async ({ page }, use) => {
        await use(new MyProfile(page));
    },
    loginPopUp: async ({ page, isMobile }, use) => {
        await use(new LoginPopUp(page, isMobile));
    },
    calendar: async ({ page }, use) => {
        await use(new Calendar(page));
    },
    footer: async ({ page}, use) => {
        await use(new Footer(page));
    },
    ownCabinetLeftSideMenu: async ({ page, isMobile }, use) => {
        await use(new OwnCabinetLeftSideMenu(page, isMobile));
    },
    notificationPopUp: async ({ page }, use) => {
        await use(new NotificationPopUp(page));
    },
    navBar: async ({ page, isMobile }, use) => {
        await use(new NavBar(page, isMobile));
    },
    mapPopUp: async ({ page }, use) => {
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
    proposesToOwnerUnit: async ({ page }, use) => {
        await use(new ProposesToOwnerUnit(page));
    },
    proposalDetails: async ({ page }, use) => {
        await use(new ProposalDetails(page));
    },
    editUnit: async ({ page }, use) => {
        await use(new EditUnit(page));
    },
    myTenders: async ({ page }, use) => {
        await use(new MyTenders(page));
    },
    editTender: async ({ page }, use) => {
        await use(new EditTender(page));
    },
    closeTenderPopUp: async ({ page }, use) => {
        await use(new CloseTenderPopUp(page));
    },
    deleteTenderPopUp: async ({ page }, use) => {
        await use(new DeleteTenderPopUp(page));
    },
    createTender: async ({ page }, use) => {
        await use(new CreateTender(page));
    },
    generalInfoTab: async ({ page }, use) => {
        await use(new GeneralInfoTab(page));
    },
    documentationTab: async ({ page }, use) => {
        await use(new DocumentationTab(page));
    },
    contactsTab: async ({ page }, use) => {
        await use(new ContactsTab(page));
    },
    completeTenderCreation: async ({ page }, use) => {
        await use(new CompleteTenderCreation(page));
    },
    myFavouriteUnitsPage: async ({ page }, use) => {
        await use(new myFavouriteUnitsPage(page));
    },
    myUnitsPage: async ({ page }, use) => {
        await use(new MyUnitsPage(page));
    },
    mainPage: async ({ page, isMobile }, use) => {
        await use(new MainPage(page, isMobile));
    }
})

export const test = testPages;