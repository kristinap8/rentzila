import Page from '../page';

const profilePhoto: string = 'div[class*="LeftSideOwnCabinet_container"] img[data-testid="photo"]';
const selectedAdvertismentsItem: string = '//div[@data-testid="variants"]//span[text()="Обрані оголошення"]';

export class MyProfileSideMenu extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getProfilePhotoSrc() {
        return await super.getElementAttribute(profilePhoto, 'src');
    }

    async clickSelectedAdvertismentsItem() {
        await this.clickElement(selectedAdvertismentsItem);
    }

}