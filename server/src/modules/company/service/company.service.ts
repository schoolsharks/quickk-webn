import generateCompanyCode from '../../../utils/generateCompanyCode';
import Company, { ICompany } from '../model/company.model';

export default class CompanyService {
  // Method to create a new company
  async createCompany(
    companyName: string,
    companyCode: string
  ): Promise<ICompany> {
    try {
      const company = new Company({ companyName, companyCode });
      return await company.save(); // this returns the full document
    } catch (error: any) {
      throw new Error(`Error creating company: ${error.message}`);
    }
  }

  // Method to generate a unique company code
  async generateUniqueCompanyCode(): Promise<string> {

    let companyCode: string = '';
    let isUnique = false;

    while (!isUnique) {
      companyCode = generateCompanyCode();
      // Check if a company with this code already exists
      // eslint-disable-next-line no-await-in-loop
      isUnique = !(await Company.exists({ companyCode }));
    }

    return companyCode;
  }

}


