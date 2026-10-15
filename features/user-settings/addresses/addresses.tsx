"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { addressService } from "@/lib/services/address-service";
import { regionService } from "@/lib/services/region-service";

import { AddressesView } from "@/features/user-settings/addresses/addresses-view";

import type {
    Address,
    CreateAddressRequest,
} from "@/types/address";
import type { Region } from "@/types/region";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

interface AddressFormState extends CreateAddressRequest {
    province_name: string;
    city_name: string;
    district_name: string;
    subdistrict_name: string;
}

function createEmptyForm(): AddressFormState {
    return {
        recipient_name: "",
        phone: "",
        label: "",
        full_address: "",

        province_id: "",
        province_name: "",

        city_id: "",
        city_name: "",

        district_id: "",
        district_name: "",

        subdistrict_id: "",
        subdistrict_name: "",

        postal_code: "",
        latitude: null,
        longitude: null,

        is_default: false,
    };
}

export function Addresses() {

    const token = useAuthStore((state) => state.token);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [cities, setCities] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [subdistricts, setSubdistricts] = useState<Region[]>([]);

    const [form, setForm] = useState<AddressFormState>(
        createEmptyForm()
    );

    const [loading, setLoading] = useState(true);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settingDefaultId, setSettingDefaultId] =
        useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingAddressId, setEditingAddressId] =
        useState<number | null>(null);
    const [addressIdToDelete, setAddressIdToDelete] =
        useState<number | null>(null);

    const loadAddresses = useCallback(async () => {
        if (!token) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await addressService.getAddresses(token);
            setAddresses(response.data ?? []);
        } catch (error) {
            console.error("Failed to load addresses:", error);
            setErrorMessage(
                "Failed to load the address. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            return;
        }

        void loadAddresses();

        let active = true;

        async function loadProvinces(): Promise<void> {
            setLoadingRegions(true);

            try {
                const response = await regionService.getProvinces();

                if (active) {
                    setProvinces(response.data ?? []);
                }
            } catch (error) {
                console.error("Failed to load provinces:", error);
                toast.error("Failed to load provinces.");
            } finally {
                if (active) {
                    setLoadingRegions(false);
                }
            }
        }

        void loadProvinces();

        return () => {
            active = false;
        };
    }, [token, loadAddresses]);

    function updateField<K extends keyof AddressFormState>(
        field: K,
        value: AddressFormState[K]
    ): void {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function openAddressForm(): void {
        setEditingAddressId(null);
        setForm(createEmptyForm());
        setCities([]);
        setDistricts([]);
        setSubdistricts([]);
        setShowForm(true);
    }

    async function openEditForm(address: Address): Promise<void> {
        setEditingAddressId(address.id);
        setShowForm(true);
        setLoadingForm(true);

        setForm({
            recipient_name: address.recipient_name,
            phone: address.phone,
            label: address.label,
            full_address: address.full_address,

            province_id: String(address.province_id),
            province_name: address.province_name,

            city_id: String(address.city_id),
            city_name: address.city_name,

            district_id: String(address.district_id),
            district_name: address.district_name,

            subdistrict_id: address.subdistrict_id
                ? String(address.subdistrict_id)
                : "",
            subdistrict_name: address.subdistrict_name ?? "",

            postal_code: address.postal_code,
            latitude: address.latitude ?? null,
            longitude: address.longitude ?? null,

            is_default: address.is_default,
        });

        try {
            const cityResponse = await regionService.getCities(
                String(address.province_id)
            );
            setCities(cityResponse.data ?? []);

            const districtResponse = await regionService.getDistricts(
                String(address.city_id)
            );
            setDistricts(districtResponse.data ?? []);

            if (address.district_id) {
                const subdistrictResponse =
                    await regionService.getSubdistricts(
                        String(address.district_id)
                    );

                setSubdistricts(subdistrictResponse.data ?? []);
            } else {
                setSubdistricts([]);
            }
        } catch (error) {
            console.error("Failed to load address regions:", error);
            toast.error("Failed to load address region information.");
        } finally {
            setLoadingForm(false);
        }
    }

    function closeAddressForm(): void {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingAddressId(null);
    }

    async function handleProvinceChange(
        provinceId: string
    ): Promise<void> {
        const selectedProvince = provinces.find(
            (region) => String(region.id) === provinceId
        );

        setForm((current) => ({
            ...current,
            province_id: provinceId,
            province_name: selectedProvince?.name ?? "",
            city_id: "",
            city_name: "",
            district_id: "",
            district_name: "",
            subdistrict_id: "",
            subdistrict_name: "",
        }));

        setCities([]);
        setDistricts([]);
        setSubdistricts([]);

        if (!provinceId) {
            return;
        }

        setLoadingRegions(true);

        try {
            const response = await regionService.getCities(provinceId);
            setCities(response.data ?? []);
        } catch (error) {
            console.error("Failed to load cities:", error);
            toast.error("Failed to load cities.");
        } finally {
            setLoadingRegions(false);
        }
    }

    async function handleCityChange(cityId: string): Promise<void> {
        const selectedCity = cities.find(
            (region) => String(region.id) === cityId
        );

        setForm((current) => ({
            ...current,
            city_id: cityId,
            city_name: selectedCity?.name ?? "",
            district_id: "",
            district_name: "",
            subdistrict_id: "",
            subdistrict_name: "",
        }));

        setDistricts([]);
        setSubdistricts([]);

        if (!cityId) {
            return;
        }

        setLoadingRegions(true);

        try {
            const response = await regionService.getDistricts(cityId);
            setDistricts(response.data ?? []);
        } catch (error) {
            console.error("Failed to load districts:", error);
            toast.error("Failed to load districts.");
        } finally {
            setLoadingRegions(false);
        }
    }

    async function handleDistrictChange(
        districtId: string
    ): Promise<void> {
        const selectedDistrict = districts.find(
            (region) => String(region.id) === districtId
        );

        setForm((current) => ({
            ...current,
            district_id: districtId,
            district_name: selectedDistrict?.name ?? "",
            subdistrict_id: "",
            subdistrict_name: "",
        }));

        setSubdistricts([]);

        if (!districtId) {
            return;
        }

        setLoadingRegions(true);

        try {
            const response =
                await regionService.getSubdistricts(districtId);

            setSubdistricts(response.data ?? []);
        } catch (error) {
            console.error("Failed to load subdistricts:", error);
            toast.error("Failed to load subdistricts.");
        } finally {
            setLoadingRegions(false);
        }
    }

    function handleSubdistrictChange(
        subdistrictId: string
    ): void {
        const selectedSubdistrict = subdistricts.find(
            (region) => String(region.id) === subdistrictId
        );

        setForm((current) => ({
            ...current,
            subdistrict_id: subdistrictId,
            subdistrict_name: selectedSubdistrict?.name ?? "",
        }));
    }

    async function handleSave(): Promise<void> {
        if (!token || saving) {
            return;
        }

        const phonePattern = /^(?:\+62|08)[0-9]{8,13}$/;
        const postalCodePattern = /^[0-9]{5}$/;

        if (
            !form.recipient_name.trim() ||
            !form.phone.trim() ||
            !form.label.trim() ||
            !form.full_address.trim() ||
            !form.province_id ||
            !form.city_id ||
            !form.district_id
        ) {
            toast.error("Please complete all required fields.");
            return;
        }

        if (!phonePattern.test(form.phone.trim())) {
            toast.error("Please enter a valid Indonesian phone number.");
            return;
        }

        if (
            form.postal_code &&
            !postalCodePattern.test(form.postal_code)
        ) {
            toast.error("Postal code must contain 5 digits.");
            return;
        }

        const payload: CreateAddressRequest = {
            recipient_name: form.recipient_name.trim(),
            phone: form.phone.trim(),
            label: form.label.trim(),
            full_address: form.full_address.trim(),

            province_id: form.province_id,
            province_name: form.province_name,

            city_id: form.city_id,
            city_name: form.city_name,

            district_id: form.district_id,
            district_name: form.district_name,

            subdistrict_id: form.subdistrict_id || null,
            subdistrict_name: form.subdistrict_name || null,

            postal_code: form.postal_code.trim(),
            latitude: form.latitude,
            longitude: form.longitude,

            is_default: form.is_default,
        };

        setSaving(true);

        try {
            if (editingAddressId === null) {
                await addressService.createAddress(token, payload);
                toast.success("Address created successfully.");
            } else {
                await addressService.updateAddress(
                    token,
                    editingAddressId,
                    payload
                );

                toast.success("Address updated successfully.");
            }

            setShowForm(false);
            setEditingAddressId(null);

            await loadAddresses();
        } catch (error) {
            console.error("Failed to save address:", error);

            toast.error(
                editingAddressId === null
                    ? "Failed to create address. Please try again."
                    : "Failed to update address. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleSetDefault(addressId: number): Promise<void> {
        if (!token || settingDefaultId !== null) {
            return;
        }

        setSettingDefaultId(addressId);

        try {
            await addressService.setDefaultAddress(token, addressId);

            toast.success("Address set as default successfully.");
            await loadAddresses();
        } catch (error) {
            console.error("Failed to set default address:", error);
            toast.error("Failed to set address as default.");
        } finally {
            setSettingDefaultId(null);
        }
    }

    async function handleDelete(): Promise<void> {
        if (!token || addressIdToDelete === null || deleting) {
            return;
        }

        setDeleting(true);

        try {
            await addressService.deleteAddress(
                token,
                addressIdToDelete
            );

            toast.success("Address deleted successfully.");

            setAddressIdToDelete(null);
            await loadAddresses();
        } catch (error) {
            console.error("Failed to delete address:", error);
            toast.error("Failed to delete address. Please try again.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <AddressesView
            addresses={addresses}
            provinces={provinces}
            cities={cities}
            districts={districts}
            subdistricts={subdistricts}
            form={form}
            loading={loading}
            loadingRegions={loadingRegions}
            loadingForm={loadingForm}
            saving={saving}
            settingDefaultId={settingDefaultId}
            deleting={deleting}
            errorMessage={errorMessage}
            showForm={showForm}
            editingAddressId={editingAddressId}
            addressIdToDelete={addressIdToDelete}
            onOpenForm={openAddressForm}
            onEdit={openEditForm}
            onCloseForm={closeAddressForm}
            onFieldChange={updateField}
            onProvinceChange={handleProvinceChange}
            onCityChange={handleCityChange}
            onDistrictChange={handleDistrictChange}
            onSubdistrictChange={handleSubdistrictChange}
            onSave={handleSave}
            onRetry={loadAddresses}
            onSetDefault={handleSetDefault}
            onAskDelete={setAddressIdToDelete}
            onCloseDelete={() => setAddressIdToDelete(null)}
            onConfirmDelete={handleDelete}
        />
    );
}