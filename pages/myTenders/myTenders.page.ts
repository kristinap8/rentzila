import Page from '../page';

const createTenderBtnWithoutTenders: string = 'button[data-testid="emptyBlockButton"]';
const createTenderBtnWithTenders: string = 'button[class*="OwnerTendersPage_addUnit"]';
const activeTendersTab: string = 'button[id*="Активні"]';
const finishedTendersTab: string = 'button[id*="Завершені"]';
const expectingTendersTab: string = 'button[id*="Очікуючі"]';
const rejectedTendersTab: string = 'button[id*="Відхилені"]';
const searchInput: string = 'div[data-testid="search"] input';
const tenderCards: string = 'div[class*="OwnerTenderCard_tenderCard"]';
const closeBtn: string  = '//button[contains(@data-testid, "customButton")][text()="Завершити"]';
const deleteBtn: string = '//button[contains(@data-testid, "customButton")][text()="Видалити"]';
const nonFoundTenderTitle: string = 'div[class*="EmptyBlockInfo_title"]';

export class MyTenders extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getTenderCards() {
        return super.getElement(tenderCards);
    }

    getNonFoundTenderTitle() {
        return super.getElement(nonFoundTenderTitle);
    }

    async clickCreateTenderBtn() {
        const btnToClick = (await super.getElementsCount(createTenderBtnWithTenders)) ? createTenderBtnWithTenders : createTenderBtnWithoutTenders;
        await super.clickElement(btnToClick);
    }

    async clickBtn(btnName: "close" | "delete") {
        switch (btnName) {
            case "close":
                await super.clickElement(closeBtn);
                break;
            case "delete":
                await super.clickElement(deleteBtn);
                break;
            default:
                throw new Error(`Non valid button name: ${btnName}`);
        }
    }

    async goToTendersTab(tabName: "active" | "expecting" | "rejected" | "finished") {
        switch (tabName) {
            case 'active':
                await super.clickElement(activeTendersTab);
                break;
            case 'expecting':
                await super.clickElement(expectingTendersTab);
                break;
            case 'rejected':
                await super.clickElement(rejectedTendersTab);
                break;
            case 'finished':
                await super.clickElement(finishedTendersTab);
                break;
            default:
                throw new Error(`Non-existing tender tab name: ${tabName}`);
        }
    }

    async fillSearchInput(tenderName: string) {
        await super.fillElement(searchInput, tenderName);
    }
}