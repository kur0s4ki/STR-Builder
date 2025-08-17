interface ExchangeRateResponse {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: {
    [key: string]: number;
  };
}

interface ExchangeRateData {
  usdToCAD: number;
  isLive: boolean;
  lastUpdated: string;
}

const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

// Default fallback rate in case API fails
const DEFAULT_USD_TO_CAD_RATE = 1.35;

export class ExchangeRateService {
  private static instance: ExchangeRateService;

  private constructor() {}

  public static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService();
    }
    return ExchangeRateService.instance;
  }

  private async fetchExchangeRate(): Promise<ExchangeRateData> {
    try {
      const response = await fetch(EXCHANGE_RATE_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExchangeRateResponse = await response.json();

      if (data.result !== 'success') {
        throw new Error('API returned unsuccessful result');
      }

      if (!data.rates.CAD) {
        throw new Error('CAD rate not found in API response');
      }

      return {
        usdToCAD: data.rates.CAD,
        isLive: true,
        lastUpdated: data.time_last_update_utc
      };

    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      console.warn(`Using fixed exchange rate (${DEFAULT_USD_TO_CAD_RATE}) due to API failure`);

      return {
        usdToCAD: DEFAULT_USD_TO_CAD_RATE,
        isLive: false,
        lastUpdated: new Date().toUTCString()
      };
    }
  }

  public async getExchangeRate(): Promise<ExchangeRateData> {
    // Always fetch fresh data - no caching
    return await this.fetchExchangeRate();
  }

  public async getUSDToCADRate(): Promise<number> {
    const data = await this.getExchangeRate();
    return data.usdToCAD;
  }

  public async getExchangeRateInfo(): Promise<ExchangeRateData> {
    return await this.getExchangeRate();
  }
}

// Export singleton instance
export const exchangeRateService = ExchangeRateService.getInstance();
