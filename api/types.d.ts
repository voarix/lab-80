export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export interface Location extends Category {}