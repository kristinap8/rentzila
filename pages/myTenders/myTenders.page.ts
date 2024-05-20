import Page from '../page';
import Helper from '../../helper/helper';

const createTenderBtnWithoutTenders = 'button[data-testid="emptyBlockButton"]';
const createTenderBtnWithTenders = 'button[class*="OwnerTendersPage_addUnit"]';
const activeTendersTab = 'button[id*="Активні"]';
const finishedTendersTab = 'button[id*="Завершені"]';
const expectingTendersTab = 'button[id*="Очікуючі"]';
const rejectedTendersTab = 'button[id*="Відхилені"]';
const searchInput = '*[data-testid="search"] input';
const tenderCards = '*[class*="OwnerTenderCard_tenderCard"]';
const closeBtn = '//button[contains(@data-testid, "customButton")][text()="Завершити"]';
const deleteBtn = '//button[contains(@data-testid, "customButton")][text()="Видалити"]';
const editBtn = '//button[contains(@data-testid, "customButton")][text()="Редагувати"]';
const nonFoundTenderTitle = '*[class*="EmptyBlockInfo_title"]';

const tenderCardDeclaredBudget = '*[class*="CurrentItemPrice_price__"]';
const tenderCardCategoryAndService = '*[class*="CurrentItemInfo_category"]';
const tenderCardWorksExecutionPeriod = '(//*[contains(@class, "ParagraphWithIcon_paragraph__")])[1]';
const tenderCardWorksLocation = '(//*[contains(@class, "ParagraphWithIcon_paragraph__")])[2]';

let helper: Helper;
export class MyTenders extends Page {
    constructor(page: Page['page']) {
        super(page);
        helper = new Helper();
    }

    getTenderCards() {
        return super.getElement(tenderCards);
    }

    async getTenderCardInfo(infoType: 'declaredBudget' | 'serviceName' | 'worksExecutionPeriod' | 'worksLocation') {
        switch (infoType) {
            case 'declaredBudget':
                return Number(helper.removeSpaces((await super.getElementText(tenderCardDeclaredBudget))!));
            case 'serviceName': 
                return (await super.getElementText(tenderCardCategoryAndService))!.split('/')[1].trim();
            case 'worksExecutionPeriod':
                return (await super.getElementText(tenderCardWorksExecutionPeriod))!.split(' - ');
            case 'worksLocation':
                return (await super.getElementText(tenderCardWorksLocation))!.split(', ')[0];
            default:
                throw new Error(`Unsupported info type of the tender card: ${infoType}`);
                
        }
    }

    getNonFoundTenderTitle() {
        return super.getElement(nonFoundTenderTitle);
    }

    getTendersTab(tabName: "expecting") {
        switch (tabName) {
            case 'expecting':
                return super.getElement(tabName);
            default:
                throw new Error(`Unsupported tab name: ${tabName}`);
        }
    }

    async clickCreateTenderBtn() {
        const btnToClick = (await super.getElementsCount(createTenderBtnWithTenders)) ? createTenderBtnWithTenders : createTenderBtnWithoutTenders;
        await super.clickElement(btnToClick);
    }

    async clickBtn(btnName: "close" | "delete" | "edit") {
        switch (btnName) {
            case "close":
                await super.clickElement(closeBtn);
                break;
            case "delete":
                await super.clickElement(deleteBtn);
                break;
            case "edit":
                await Promise.all([
                    super.waitForLoadState('networkidle'),
                    super.clickElement(editBtn)
                ]);
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

    async searchTender(tenderName: string) {
        await super.fillElement(searchInput, tenderName);
    }
}