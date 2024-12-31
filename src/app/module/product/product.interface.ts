
export interface IProduct extends Document{
    _id?: string;
    name?: string;
    price?: number;
    description?: string;
    stock?: number;
    group?: string;
    productCode?: string;
    isDeleted: boolean;
    
}