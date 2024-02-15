import Page from '../page';

const footer: string = '*[class*="Footer_footer__"]';
const footerLogo: string = '*[class*="Footer_footer__"] *[data-testid="logo"]';
const aboutUsLabel: string = '*[class*="RentzilaAbout_title__"]';
const privacyPolicyLink: string = '*[data-testid="politika-konfidenciinosti"] a';
const cookiePolicyLink: string = '*[data-testid="pravila-vikoristannya-failiv-cookie"] a';
const termsConditionsLink: string = '*[data-testid="umovi-dostupu-ta-koristuvannya"] a';
const forBuyersLabel: string = '*[class*="RentzilaForBuyers_title__"]';
const advertismentsLink: string = '*[data-testid="ogoloshennya"]';
const tendersLink: string = '*[data-testid="tenderi"] a';
const jobRequestsLink: string = '*[data-testid="zapiti-na-robotu"]';
const contactsLabel: string = '*[class*="RentzilaContacts_title__"]';
const email: string = '*[class*="RentzilaContacts_email__"]';
const copyrightLabel: string = '*[data-testid="copyright"]';
const privacyPolicyTitle: string = 'h1[class*="PrivacyPolicy_title"]';
const cookiePolicyTitle: string = 'h1[class*="Cookies_title"]';
const termsConditionsTitle: string = 'h1[class*="TermsConditions_title"]';

export class Footer extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getFooter() {
        return await super.getElement(footer);
    }

    async getFooterLogo() {
        return await super.getElement(footerLogo);
    }

    async getAboutUsLabel() {
        return await super.getElement(aboutUsLabel);
    }

    async getPrivacyPolicyLink() {
        return await super.getElement(privacyPolicyLink);
    }

    async getTermsConditionsLink() {
        return await super.getElement(termsConditionsLink);
    }

    async getForBuyersLabel() {
        return await super.getElement(forBuyersLabel);
    }

    async getAdvertismentsLink() {
        return await super.getElement(advertismentsLink);
    }

    async getTendersLink() {
        return await super.getElement(tendersLink);
    }

    async getJobRequestsLink() {
        return await super.getElement(jobRequestsLink);
    }

    async getContactsLabel() {
        return await super.getElement(contactsLabel);
    }

    async getEmail() {
        return await super.getElement(email);
    }

    async getCopyrightLabel() {
        return await super.getElement(copyrightLabel);
    }

    async getPrivacyPolicyTitle() {
        return await super.getElement(privacyPolicyTitle);
    }

    async getCookiePolicyTitle() {
        return await super.getElement(cookiePolicyTitle);
    }

    async getTermsConditionsTitle() {
        return await super.getElement(termsConditionsTitle);
    }

    async clickPrivacyPolicyLink() {
        await super.clickElement(privacyPolicyLink);
    }

    async clickCookiePolicyLink() {
        await super.clickElement(cookiePolicyLink);
    }

    async clickTermsConditionsLink() {
        await super.clickElement(termsConditionsLink);
    }

    async clickAdvertismentsLink() {
        await super.clickElement(advertismentsLink);
    }

    async clickTendersLink() {
        await super.clickElement(tendersLink);
    }

    async clickJobRequestsLink() {
        await super.clickElement(jobRequestsLink);
    }

    async scrollToFooter() {
        await super.scrollToElement(footer);
    }
}