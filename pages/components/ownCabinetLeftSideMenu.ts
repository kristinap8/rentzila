import Page from '../page';

//const profilePhoto: string = 'div[class*="LeftSideOwnCabinet_container"] img[data-testid="photo"]';
//const selectedAdvertismentsItem: string = '//div[@data-testid="variants"]//span[text()="Обрані оголошення"]';
const logoutBtn = '*[class*="LeftSideOwnCabinet_container"] *[data-testid="logOut"]';

export class OwnCabinetLeftSideMenu extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async clickBtn(btnName: 'logout') {
        switch (btnName) {
            case 'logout':
                await super.clickElement(logoutBtn);
                break;
            default:
                throw new Error(`Incorrect button name: ${btnName}`);
        }
    }
    

    // async getProfilePhotoSrc() {
    //     return await super.getElementAttribute(profilePhoto, 'src');
    // }

    // async clickSelectedAdvertismentsItem() {
    //     await this.clickElement(selectedAdvertismentsItem);
    // }

}