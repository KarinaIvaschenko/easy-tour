import type {Country, GeoEntity} from "../../helpers/types.ts";
import type {FC} from "react";
import "./dropdownItemStyles.scss";

interface IDropdownItem {
    item: GeoEntity;
    handleSelectItem: (item: GeoEntity) => void;
}

const DropdownItem:FC<IDropdownItem> = ({item, handleSelectItem}) => {
    return (
        <li
            key={item.id}
            className="dropdown-item"
            onClick={() => handleSelectItem(item)}
        >
            {item.type === "country" && (
                <img src={(item as Country).flag} alt="flag" width={20} style={{marginRight: 5}}/>
            )}
            {item.type === "city" && "🏙️ "}
            {item.type === "hotel" && "🏨 "}
            {item.name}
        </li>
    );
};

export default DropdownItem;