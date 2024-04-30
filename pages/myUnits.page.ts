import Page from './page';

const emptyBlockTitle: string = 'div[class*="EmptyBlockInfo_title"]';
const emptyBlockDescription: string = 'div[class*="EmptyBlockInfo_descr"]';
const createUnitBtn: string = 'button[data-testid="emptyBlockButton"]';
const activeTab: string = 'button[id*="Активні"]';
const deactivatedTab: string = 'button[id*="Деактивовані"]';
const pendingTab: string = 'button[id*="Очікуючі"]';
const declinedTab: string = 'button[id*="Відхилені"]';
const unitCardNames: string = 'div[class*="OwnerUnitCard_name"]';
const categoriesDropdownSelectedItem = 'div[class*="SearchPanel_categoryContainer"] span[class*="CustomSelect_value"]';
const categoryDropdownItem = (categoryName: string): string => `//div[contains(@class, 'SearchPanel_categoryContainer')]//span[@data-testid="span-customSelect" and text()="${categoryName}"]`;
const sortDropdownSelectedItem = 'div[class*="SearchPanel_sortContainer"] span[class*="CustomSelect_value"]';
const sortDropdownItem = (sortByName: string): string => `//span[contains(text(), "${sortByName}")][@data-testid="span-customSelect"]`;
const searchInput: string = 'div[data-testid="search"] input';
const clearFiltersBtn: string = 'button[data-testid="emptyBlockButton"]';
const unitCardProposalBtn = (unitName: string): string => `//div[contains(@class, "OwnerUnitCard_name") and text()="${unitName}"]/ancestor::div[@data-testid="unitCard"]//button[text()="Пропозиції"]`;
const unitCardEditBtn = (unitName: string): string => `//div[contains(@class, "OwnerUnitCard_name") and text()="${unitName}"]/ancestor::div[@data-testid="unitCard"]//button[text()="Редагувати"]`;
const unitCardName = (unitName: string): string => `//div[contains(@class, "OwnerUnitCard_name") and text()="${unitName}"]`;

export class MyUnitsPage extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getEmptyBlockTitle() {
        return super.getElement(emptyBlockTitle);
    }

    getEmptyBlockDescription() {
        return super.getElement(emptyBlockDescription);
    }

    getUnitCardNames() {
        return super.getElement(unitCardNames);
    }

    getCategoriesDropdownSelectedItem() {
        return super.getElement(categoriesDropdownSelectedItem);
    }

    getSortDropdownSelectedItem() {
        return super.getElement(sortDropdownSelectedItem);
    }

    getSearchInput() {
        return super.getElement(searchInput);
    }

    async clickCreateUnitBtn() {
        await super.clickElement(createUnitBtn);
    }

    async clickClearFiltersBtn() {
        await super.clickElement(clearFiltersBtn);
    }

    async clickProposalBtn(unitName: string) {
        await super.clickElement(unitCardProposalBtn(unitName));
    }

    async clickEditBtn(unitName: string) {
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            super.clickElement(unitCardEditBtn(unitName))
        ]);
    }

    async clickTab(tabName: 'active' | 'deactivated' | 'pending' | 'declined') {
        switch (tabName) {
            case 'active':
                await super.clickElement(activeTab);
                break;
            case 'deactivated':
                await super.clickElement(deactivatedTab);
                break;
            case 'pending':
                await super.clickElement(pendingTab);
                break;
            case 'declined':
                await super.clickElement(declinedTab);
                break;
            default:
                throw new Error(`Invalid tabName: ${tabName}`);
        }
    }

    async clickUnitCard(name: string) {
        await super.clickElement(unitCardName(name));
    }

    async filterByCategory(categoryName: string) {
        await super.clickElement(categoriesDropdownSelectedItem);
        await super.clickElement(categoryDropdownItem(categoryName));
    }

    async sort(by: string) {
        await super.clickElement(sortDropdownSelectedItem);
        await super.clickElement(sortDropdownItem(by));
    }

    async searchUnit(unitName: string, action: 'noClick' | 'enter'  = 'noClick') {
        await super.clearElement(searchInput);
        if (unitName) {
            await super.type(searchInput, unitName);
        }
        if (action === 'enter') {
            await super.pressEnter();
        } 
    }
}