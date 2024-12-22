
export interface IProduct extends Document{
    _id?: string;
    name?: string;
    price?: number;
    description?: string;
    quantity?: number;
    group?: string;
    productCode?: string;
    
}