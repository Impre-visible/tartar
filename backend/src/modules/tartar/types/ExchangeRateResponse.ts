export interface ExchangeRateResponse {
    provider: string;
    rates: {
        "USD": number;
        [key: string]: number;
    };
    base: string;
}