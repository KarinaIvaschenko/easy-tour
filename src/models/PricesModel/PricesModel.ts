import {BaseModel} from "../BaseModel.ts";
import {formattedDate} from "../../helpers/formattedDate.ts";

class PricesModel extends BaseModel{
    id: string | null = null;
    amount: string | null = null;
    currency: string | null = null;
    startDate: string | null = null;
    endDate: string | null = null;
    hotelID: string | null = null;

    setProperty(name: string, value: any): this {
        if (name === 'startDate' || name === 'endDate') {
            value = formattedDate(value);
        }
        return super.setProperty(name, value);
    }
}

export default PricesModel;