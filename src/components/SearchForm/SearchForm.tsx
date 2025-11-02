import {type ChangeEvent, type FC, useState} from "react";
import type {
    Country, ErrorResponse,
    GeoEntity,
    GeoResponse,
    GetSearchPricesResponse, PriceOffer, SearchState,
    StartSearchResponse
} from "../../helpers/types.ts";
import {getSearchPrices, searchGeo, startSearchPrices} from "../../api/api.js";
import "./searchFormStyles.scss";
import Button from "../Button/Button.tsx";
import Dropdown from "../Dropdown/Dropdown.tsx";
import {handleApiResponse} from "../../api/apiRequest.ts";
import {MAX_RETRIES, waitUntil} from "./helpers.ts";
import UserMessage from "../UserMessage/UserMessage.tsx";
import Loader from "../Loader/Loader.tsx";
import PricesModel from "../../models/PricesModel/PricesModel.ts";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../../redux/types.ts";
import {setPricesList} from "../../redux/PricesReducer/PricesReducer.ts";
import ApiError from "../../helpers/ApiError.ts";

interface ISearchForm {
    countries: Country[];
}

const SearchForm: FC<ISearchForm> = ({countries}) => {
    const [inputValue, setInputValue] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownList, setDropdownList] = useState<GeoEntity[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeoEntity | null>(null);
    const [searchState, setSearchState] = useState<SearchState>({
        status: null,
        error: null,
    });

    const dispatch: AppDispatch = useDispatch()

    const getCountriesList: () => GeoEntity[] = () => countries.map(country => ({...country, type: "country"}));

    const showCountries = () => {
        setDropdownList(getCountriesList());
        setDropdownOpen(true);
    };

    const openDropdown = () => {
        if ((!selectedItem && inputValue.trim() === "") ||
            selectedItem?.type === "country") {
            setDropdownList(getCountriesList());
        } else {
            void fetchSearchResults(inputValue);
        }
        setDropdownOpen(true);
    };

    const closeDropdown = () => {
        setInputValue("");
        setSelectedItem(null);
        setDropdownOpen(false);
        cleanSearchState();
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setSelectedItem(null);

        if (value.trim() === "") {
            showCountries()
        } else {
            void fetchSearchResults(value);
        }
    };

    const fetchSearchResults = async (query: string) => {
        if (!query.trim()) return;
        try {
            const data = await handleApiResponse<GeoResponse>(searchGeo(query));
            setDropdownList(Object.values(data));
            setDropdownOpen(true);
        } catch (err) {
            console.error(err);
            setDropdownList([]);
        }
    };

    const fetchGetSearchPrices = async (
        token: string,
        attempt = 0
    ): Promise<{ prices: PriceOffer[] }> => {
        try {
            const data = await handleApiResponse<GetSearchPricesResponse | ErrorResponse>(
                getSearchPrices(token)
            );

            if ("prices" in data) {
                const { prices } = data;
                return { prices: Object.values(prices) };
            }

            throw new Error(data.message || "Помилка отримання результатів");
        } catch (err) {
            if (attempt < MAX_RETRIES) {
                return fetchGetSearchPrices(token, attempt + 1);
            }

            throw err;
        }
    };

    const fetchStartSearchPrices = async (countryID: string) => {
        setSearchState({status: 'loading', error: null});
        if (!selectedItem) return;
        try {
            const start = await handleApiResponse<StartSearchResponse>(startSearchPrices(countryID));
            const {token, waitUntil: wait} = start;

            await waitUntil(wait);
            const results = await fetchGetSearchPrices(token);

            if (!results.prices || results.prices.length === 0) {
                setSearchState({
                    status: 'emptyState',
                    error: 'За вашим запитом турів не знайдено',
                });
                return;
            }
            const pricesInstances = new PricesModel().assign(results.prices) as PricesModel[];
            const pricesList = pricesInstances.map(price => price.toPlainObject());
            dispatch(setPricesList(pricesList));

            setSearchState({
                status: null,
                error: null,
            });
        } catch (err) {
            if (err instanceof ApiError && err.code === 425 && err.waitUntil){
                setSearchState({status: 'loading', error: null});
                await waitUntil(err.waitUntil);
            }
            setSearchState({
                status: 'error',
                error: err instanceof ApiError ? err.message : 'Помилка пошуку',
            });
        }
    };

    const handleSelectItem = (item: GeoEntity) => {
        setSelectedItem(item);
        setInputValue(item.name);
        setDropdownOpen(false);
    };

    const cleanSearchState = () => {
        setSearchState({status: null, error: null});
    };

    const {status, error} = searchState;
    const isLoading = status === 'loading';

    return (
        <div>
            <form
                className="search-form"
                onSubmit={async e => {
                    e.preventDefault();
                    if (!selectedItem) return;
                    await fetchStartSearchPrices(String(selectedItem.id));
                }}
            >
                <h1 className="search-form__title">Форма пошуку турів</h1>
                <div className="search-form__input">
                    <input
                        className="search-form__field"
                        type="text"
                        value={inputValue}
                        onChange={onInputChange}
                        onClick={openDropdown}
                        placeholder="Оберіть напрямок"
                    />
                    <Button
                        onClick={closeDropdown}
                        text="✕"
                        className="button--transparent search-form__close-btn"
                    />
                </div>
                {dropdownOpen && dropdownList && dropdownList.length > 0 && (
                    <Dropdown dropdownList={dropdownList} handleSelectItem={handleSelectItem}/>
                )}
                <Button text="Знайти" type="submit" btnStyles={{marginTop: 10}}
                        disabled={searchState.status === "loading"}/>
            </form>

            {isLoading && (
                <Loader/>
            )}

            {status && status !== 'loading' &&(
                <UserMessage message={error || ""} type={status}/>
            )}
        </div>
    );
};

export default SearchForm;
