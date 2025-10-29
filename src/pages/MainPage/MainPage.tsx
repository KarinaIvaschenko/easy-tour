import {useEffect, useState} from "react";
import type {CountriesMap, Country} from "../../helpers/types.ts";
import {getCountries} from "../../api/api.js";
import SearchForm from "../../components/SearchForm/SearchForm.tsx";
import "./mainPage.scss";
import {handleApiResponse} from "../../api/apiRequest.ts";

const MainPage = () => {
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const data = await handleApiResponse<CountriesMap>(getCountries());
                setCountries(Object.values(data));
            } catch (err) {
                console.error(err);
            }
        };

        void loadCountries();
    }, []);

    return (
        <div className="main-page">
            <SearchForm countries={countries}/>
        </div>
    );
};

export default MainPage;