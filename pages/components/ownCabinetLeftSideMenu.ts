import Page from '../page';

const profilePhoto = '*[class*="LeftSideOwnCabinet_container"] img[data-testid="photo"]';
const leftSideMenuItem = (menuItem: string): string => `//*[contains(@class,"LeftSideOwnCabinet_container")]//*[@data-testid="leftsideCategory"]//*[text()="${menuItem}"]`;
const logoutBtn = '*[class*="LeftSideOwnCabinet_container"] *[data-testid="logOut"]';
const selectedAdvertismentsItem = '//*[@data-testid="variants"]//span[text()="Обрані оголошення"]';
const myProfileBtn = '*[class*="LeftSideOwnCabinet_container"] *[data-testid="leftsideCategory"]';

export class OwnCabinetLeftSideMenu extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        this.isMobile = isMobile;
    }

     async getProfilePhotoSrc() {
        return await super.getElementAttribute(profilePhoto, 'src');
    }

    async clickSelectedAdvertismentsItem() {
        await this.clickElement(selectedAdvertismentsItem);
    }

    async clickMenuBtn(btnName: 'myProfile' | 'logout') {
        switch (btnName) {
            case 'myProfile':
                const myProfileBtn = leftSideMenuItem('Мій профіль');
                (this.isMobile) ? await Promise.all([
                    super.waitForLoadState('networkidle'),
                    super.tapElement(myProfileBtn)
                 ]) : await super.clickElement(myProfileBtn);
                break;
            case 'logout':
                if (this.isMobile) {
                    await super.tapElement(logoutBtn);
                    await super.pause(2000);
                } else {
                    await super.clickElement(logoutBtn);
                }
                break;
            default:
                throw new Error(`Incorrect button name: ${btnName}`);
        }
    }
}