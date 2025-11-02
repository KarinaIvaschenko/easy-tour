export class BaseModel {
    assign(data: Record<string, any> | Record<string, any>[]): this | this[] {
        if (Array.isArray(data)) {
            return data.map(item => {
                const instance = new (this.constructor as any)() as this;
                for (const [propName, value] of Object.entries(item)) {
                    instance.setProperty(propName, value);
                }
                return instance;
            });
        } else {
            for (const [propName, value] of Object.entries(data)) {
                this.setProperty(propName, value);
            }
            return this;
        }
    }

    setProperty(name: string, value: any): this {
        const nameParts = name.split('_');
        let camelName = nameParts.shift() || '';

        nameParts.forEach(part => {
            camelName += part.charAt(0).toUpperCase() + part.slice(1);
        });

        if (camelName in this) {
            (this as any)[camelName] = value;
        }
        return this;
    }

    toPlainObject(): Record<string, any> {
        const result: Record<string, any> = {};
        for (const key of Object.keys(this)) {
            const value = (this as any)[key];
            result[key] = value;
        }
        return result;
    }
}
