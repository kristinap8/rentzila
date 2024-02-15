import { test, expect, Locator } from '@playwright/test';
import { Footer } from '../pages/components/footer';
import { NavBar } from '../pages/components/navbar';
import { MainPage } from '../pages/mainPage.page';

let footer: Footer;
let navBar: NavBar;
let mainPage: MainPage;

test.describe('Footer check', () => {
    test.beforeEach(async ({ page }) => {
        footer = new Footer(page);
        mainPage = new MainPage(page);
        navBar = new NavBar(page);

        await mainPage.openUrl();
    });

    test("C214 - Verify that all elements on the footer are displayed and all links are clickable", async () => {
        async function clickFooterLinkAndVerify(clickMethod: () => Promise<void>, getLinkMethod: () => Promise<Locator>, urlRegex: RegExp, check: 'placeholder' | 'title', expectedText: string) {
            await footer.scrollToFooter();
            await clickMethod();
            await expect(footer.page).toHaveURL(urlRegex);
            await expect(await getLinkMethod()).toBeVisible();
            if (check === 'placeholder') {
                await expect(await getLinkMethod()).toHaveAttribute('placeholder', expectedText);
                await navBar.clickLogo();

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
        await navBar.clickLogo();
        await expect(await mainPage.getPageTitle()).toBeVisible();
        await footer.scrollToFooter();
        await expect(await footer.getEmail()).toHaveAttribute('href', /mailto/);
    })
});