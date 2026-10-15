export interface Address {
    id: number;
    recipient_name: string;
    phone: string;
    label: string;
    full_address: string;

    province_id: string;
    province_name: string;

    city_id: string;
    city_name: string;

    district_id: string;
    district_name: string;

    subdistrict_id?: string | null;
    subdistrict_name?: string | null;

    postal_code: string;

    latitude?: number | null;
    longitude?: number | null;

    is_default: boolean;
}

export interface CreateAddressRequest {
    recipient_name: string;
    phone: string;
    label: string;
    full_address: string;

    province_id: string;
    province_name: string;

    city_id: string;
    city_name: string;

    district_id: string;
    district_name: string;

    subdistrict_id?: string | null;
    subdistrict_name?: string | null;

    postal_code: string;
    latitude?: number | null;
    longitude?: number | null;
    is_default: boolean;
}