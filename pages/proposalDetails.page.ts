import Page from './page';

const proposerName: string = 'div[data-testid="selectedUserTitle"]';
const rentPeriod: string = 'div[class*="InfoOrderPeriod_wrapper"]';
const additionalFileNames: string = 'div[class*="AdditionalFilesList_fileName"]';
const proposalComment: string = 'div[class*="OrderDetails_comment"]';

export class ProposalDetails extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getProposerName() {
        return (await super.getElementText(proposerName))!.split(",")[0];
    }

    async getRentPeriod() {
        return super.getElement(rentPeriod);
    }

    async getAdditionalFileNames() {
        return super.getElement(additionalFileNames);
    }

    async getProposalComment() {
        return super.getElement(proposalComment);
    }
}