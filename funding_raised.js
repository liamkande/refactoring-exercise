const parseCsvSync = require('csv-parse/lib/sync');
const fs = require('fs').promises;
const path = require('path');

class FundingRaised {
  static async asyncWhere(options = {}) {
    try {
      const csv_data = await this.readAndParseCsv();
      return csv_data.map(this.mapRow);
    } catch (error) {
      throw error;
    }
  }

  static async where(options = {}) {
    try {
      const csv_data = await this.readAndParseCsv();
      const filteredData = this.filterData(csv_data, options);
      return filteredData.map(this.mapRow);
    } catch (error) {
      throw error;
    }
  }

  static async findBy(options = {}) {
    try {
      const csv_data = await this.readAndParseCsv();
      const filteredData = this.filterData(csv_data, options);

      if (filteredData.length > 0) {
        return this.mapRow(filteredData[0]);
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  static async readAndParseCsv() {
    const funding_file = 'startup_funding.csv';
    const file_data = await fs.readFile(path.join(__dirname, '..', funding_file));
    return parseCsvSync(file_data);
  }

  static filterData(csv_data, options) {
    let filteredData = [...csv_data];

    if (options.company_name) {
      filteredData = filteredData.filter(row => options.company_name === row[1]);
    }

    if (options.city) {
      filteredData = filteredData.filter(row => options.city === row[4]);
    }

    if (options.state) {
      filteredData = filteredData.filter(row => options.state === row[5]);
    }

    if (options.round) {
      filteredData = filteredData.filter(row => options.round === row[9]);
    }

    return filteredData;
  }

  static mapRow(row) {
    return {
      permalink: row[0],
      company_name: row[1],
      number_employees: row[2],
      category: row[3],
      city: row[4],
      state: row[5],
      funded_date: row[6],
      raised_amount: row[7],
      raised_currency: row[8],
      round: row[9]
    };
  }
}

module.exports = FundingRaised;
