export interface AddProductRequest {
    userId: number;
    categoryId: number;
    name: string;
    price: number;
    description: string;
    
}

export interface Category {
    categoryId: number;
    category: string;
}

export interface ProductPhoto {
    productPhotoId: number,
    link: string;
}

export interface ProductDetails extends AddProductRequest {
    productId: number;
    rating: number | null | undefined, //change this later to remove undefined
    category: string,
}


export interface ProductDetailsWithPhotos extends ProductDetails {
    productPhotos: ProductPhoto[]
}