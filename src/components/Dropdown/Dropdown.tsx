import type {FC} from "react";
import type {GeoEntity} from "../../helpers/types.ts";
import DropdownItem from "../DropdownItem/DropdownItem.tsx";
import "./dropdownStyles.scss";

interface IDropdown {
    dropdownList: GeoEntity[];
    handleSelectItem: (item: GeoEntity) => void;
}

const Dropdown: FC<IDropdown> = ({dropdownList, handleSelectItem}) => {
    return (
        <ul className="dropdown">
            {
                dropdownList.map((item: GeoEntity, index: number) => (
                    <DropdownItem key={item.id || index} item={item} handleSelectItem={handleSelectItem}/>
                ))
            }
        </ul>
    );
};

export default Dropdown;