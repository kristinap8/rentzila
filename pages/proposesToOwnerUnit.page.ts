import Page from './page';

const proposalDetailsBtns: string = '//button[text()="Деталі пропозиції"]';

export class ProposesToOwnerUnit extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async clickFirstProposalDetalilsBtn() {
        await super.clickElementByIndex(proposalDetailsBtns, 0);
    }
}