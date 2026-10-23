export type ProductSpecificationValue =
    | string
    | number
    | boolean
    | string[]
    | null;

export type ProductSpecifications = Record<
    string,
    ProductSpecificationValue
>;

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image_path: string;
    image_url: string;
    specifications: ProductSpecifications | null;
    created_at: string;
    updated_at: string;
    category: ProductCategory;
}

export interface GetProductsParams {
    search? : string;
    category? : number;
    sort? : string;
    direction? : 'asc' | 'desc';
    page? : number;
}
