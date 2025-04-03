export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export interface Location extends Category {}

export interface ItemResponse {
    id: number;
    category_id: number;
    location_id: number;
    name: string;
    description: string | null;
    image: string | null;
    created_at: string;
}