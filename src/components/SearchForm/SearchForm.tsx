import {type ChangeEvent, type FC, useState} from "react";
import type {Country, GeoEntity, GeoResponse} from "../../helpers/types.ts";
import {searchGeo} from "../../api/api.js";
import "./searchFormStyles.scss";
import Button from "../Button/Button.tsx";
import Dropdown from "../Dropdown/Dropdown.tsx";
import {handleApiResponse} from "../../api/apiRequest.ts";

interface ISearchForm {
    countries: Country[];
}

const SearchForm: FC<ISearchForm> = ({countries}) => {
    const [inputValue, setInputValue] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownList, setDropdownList] = useState<GeoEntity[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeoEntity | null>(null);

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

    const handleSelectItem = (item: GeoEntity) => {
        setSelectedItem(item);
        setInputValue(item.name);
        setDropdownOpen(false);
    };

    return (
        <form
            className="search-form"
            onSubmit={e => {
                e.preventDefault();
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
            <Button text="Знайти" type="submit" btnStyles={{marginTop: 10}}/>
        </form>
    );
};

export default SearchForm;
