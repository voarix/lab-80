export interface Base {
    id: number;
    name: string;
    description: string | null;
}

export interface Category extends Base {}
export interface Location extends Base {}

export type CategoryWithoutId = Omit<Category, 'id'>;
export type LocationWithoutId = Omit<Location, 'id'>;

export interface ItemResponse {
    id: number;
    category_id: number;
    location_id: number;
    name: string;
    description: string | null;
    image: string | null;
    created_at: string;
}

export interface ItemWithoutId {
    category_id: number;
    location_id: number;
    name: string;
    description: string | null;
    image: string | null;
    created_at?: string;
}