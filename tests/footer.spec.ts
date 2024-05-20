import { test, expect } from '../fixtures/fixture';
import { Locator } from 'playwright';


test.describe('Footer check', () => {
    test.beforeEach(async ({ mainPage }) => {
        await mainPage.openUrl();
    });

    test("C214 - Verify that all elements on the footer are displayed and all links are clickable", async ({ mainPage, footer, navBar }) => {
        async function clickFooterLinkAndVerify(clickMethod: () => Promise<void>, getLinkMethod: () => Promise<Locator>, urlRegex: RegExp, check: 'placeholder' | 'title', expectedText: string) {
            await footer.scrollToFooter();
            await clickMethod();
            await expect(footer.page).toHaveURL(urlRegex);
            await expect(await getLinkMethod()).toBeVisible();
            if (check === 'placeholder') {
                await expect(await getLinkMethod()).toHaveAttribute('placeholder', expectedText);
                await navBar.clickElement('logo');

            } else {
                await expect(await getLinkMethod()).toHaveText(expectedText);
            }
        }

        const footerElements = [
            footer.getFooter(),
            footer.getAboutUsLabel(),
            footer.getPrivacyPolicyLink(),
            footer.getTermsConditionsLink(),
            footer.getForBuyersLabel(),
            footer.getAdvertismentsLink(),
            footer.getTendersLink(),
            footer.getJobRequestsLink(),
            footer.getContactsLabel(),
            footer.getEmail(),
            footer.getFooterLogo(),
            footer.getCopyrightLabel(),
        ];

        await footer.scrollToFooter();
        for (const element of footerElements) {
            await expect(await element).toBeVisible();
        }
        await clickFooterLinkAndVerify(() => footer.clickPrivacyPolicyLink(), () => footer.getPrivacyPolicyTitle(), /privacy-policy/, 'title', 'Політика конфіденційності');
        await clickFooterLinkAndVerify(() => footer.clickCookiePolicyLink(), () => footer.getCookiePolicyTitle(), /cookie-policy/, 'title', 'Політика використання файлів cookie');
        await clickFooterLinkAndVerify(() => footer.clickTermsConditionsLink(), () => footer.getTermsConditionsTitle(), /terms-conditions/, 'title', 'Угода користувача');
        await clickFooterLinkAndVerify(() => footer.clickAdvertismentsLink(), () => navBar.getAdvertismentsSearchInput(), /products/, 'placeholder', 'Пошук оголошень або послуг');
        await clickFooterLinkAndVerify(() => footer.clickTendersLink(), () => navBar.getTendersJobRequestsSearchInput(), /tenders-map/, 'placeholder', 'Пошук тендера за ключовими словами');
        await clickFooterLinkAndVerify(() => footer.clickJobRequestsLink(), () => navBar.getTendersJobRequestsSearchInput(), /requests-map/, 'placeholder', 'Пошук запита на роботу за ключовими словами');
        await navBar.clickElement('logo');
        await expect(await mainPage.getPageTitle()).toBeVisible();
        await footer.scrollToFooter();
        await expect(await footer.getEmail()).toHaveAttribute('href', /mailto/);
    })
});