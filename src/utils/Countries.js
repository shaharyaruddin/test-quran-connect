import { countries } from "countries-list";

export const countriesList = Object.entries(countries).map(([code, details]) => ({
    code,
    capital: details.capital,
    continent: details.continent,
    currency: details.currency,
    languages: details.languages,
    name: details.name,
    native: details.native,
    phone: details.phone,
}));