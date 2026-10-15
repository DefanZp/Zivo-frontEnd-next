"use client";

import type { Address, CreateAddressRequest } from "@/types/address";
import type { Region } from "@/types/region";

interface AddressFormState extends CreateAddressRequest {
    province_name: string;
    city_name: string;
    district_name: string;
    subdistrict_name: string;
}

interface AddressesViewProps {
    addresses: Address[];
    provinces: Region[];
    cities: Region[];
    districts: Region[];
    subdistricts: Region[];
    form: AddressFormState;

    loading: boolean;
    loadingRegions: boolean;
    loadingForm: boolean;
    saving: boolean;
    settingDefaultId: number | null;
    deleting: boolean;

    errorMessage: string;
    showForm: boolean;
    editingAddressId: number | null;
    addressIdToDelete: number | null;

    onOpenForm: () => void;
    onEdit: (address: Address) => void;
    onCloseForm: () => void;

    onFieldChange: (
        field: keyof AddressFormState,
        value: string | boolean | number | null
    ) => void;

    onProvinceChange: (id: string) => void;
    onCityChange: (id: string) => void;
    onDistrictChange: (id: string) => void;
    onSubdistrictChange: (id: string) => void;

    onSave: () => void;
    onRetry: () => void;
    onSetDefault: (id: number) => void;
    onAskDelete: (id: number) => void;
    onCloseDelete: () => void;
    onConfirmDelete: () => void;
}

const inputClassName =
    "mt-2 w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-ink-500 disabled:cursor-not-allowed disabled:bg-ink-50";

export function AddressesView({
    addresses,
    provinces,
    cities,
    districts,
    subdistricts,
    form,
    loading,
    loadingRegions,
    loadingForm,
    saving,
    settingDefaultId,
    deleting,
    errorMessage,
    showForm,
    editingAddressId,
    addressIdToDelete,
    onOpenForm,
    onEdit,
    onCloseForm,
    onFieldChange,
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    onSubdistrictChange,
    onSave,
    onRetry,
    onSetDefault,
    onAskDelete,
    onCloseDelete,
    onConfirmDelete,
}: AddressesViewProps) {
    return (
        <>
            <section className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-ink-100 bg-ink-50/50 px-6 py-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-ink-950">
                            {showForm
                                ? editingAddressId !== null
                                    ? "Edit Address"
                                    : "Add New Address"
                                : "Your Addresses"}
                        </h2>

                        <p className="mt-1 text-sm text-ink-500">
                            {showForm
                                ? "Ensure your shipping address is accurate for seamless delivery."
                                : "Manage your saved shipping addresses for faster checkout."}
                        </p>
                    </div>

                    {showForm ? (
                        <button
                            type="button"
                            onClick={onCloseForm}
                            disabled={saving}
                            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 transition hover:bg-ink-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onOpenForm}
                            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 transition hover:bg-ink-50"
                        >
                            + Add Address
                        </button>
                    )}
                </div>

                {showForm ? (
                    <div className="p-6 md:p-8">
                        {loadingForm ? (
                            <div className="py-16 text-center text-sm text-ink-500">
                                Loading address information...
                            </div>
                        ) : (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    onSave();
                                }}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <label className="block text-sm font-medium text-ink-900">
                                        Recipient Name
                                        <input
                                            required
                                            maxLength={255}
                                            value={form.recipient_name}
                                            onChange={(event) =>
                                                onFieldChange(
                                                    "recipient_name",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Example: Defan Zain"
                                            className={inputClassName}
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-ink-900">
                                        Phone / WhatsApp
                                        <input
                                            required
                                            type="tel"
                                            maxLength={20}
                                            pattern="(\+62|08)[0-9]{8,13}"
                                            value={form.phone}
                                            onChange={(event) =>
                                                onFieldChange(
                                                    "phone",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="081234567890"
                                            className={inputClassName}
                                        />
                                    </label>
                                </div>

                                <label className="block text-sm font-medium text-ink-900">
                                    Address Label
                                    <input
                                        required
                                        maxLength={50}
                                        value={form.label}
                                        onChange={(event) =>
                                            onFieldChange(
                                                "label",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Rumah / Kantor"
                                        className={inputClassName}
                                    />
                                </label>

                                <label className="block text-sm font-medium text-ink-900">
                                    Full Address
                                    <textarea
                                        required
                                        rows={3}
                                        value={form.full_address}
                                        onChange={(event) =>
                                            onFieldChange(
                                                "full_address",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Street, house number, RT/RW, landmark..."
                                        className={inputClassName}
                                    />
                                </label>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <label className="block text-sm font-medium text-ink-900">
                                        Province
                                        <select
                                            required
                                            value={form.province_id}
                                            onChange={(event) =>
                                                onProvinceChange(
                                                    event.target.value
                                                )
                                            }
                                            className={inputClassName}
                                        >
                                            <option value="">
                                                Select Province
                                            </option>

                                            {provinces.map((region) => (
                                                <option
                                                    key={region.id}
                                                    value={region.id}
                                                >
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block text-sm font-medium text-ink-900">
                                        City / Regency
                                        <select
                                            required
                                            disabled={
                                                !form.province_id ||
                                                loadingRegions
                                            }
                                            value={form.city_id}
                                            onChange={(event) =>
                                                onCityChange(
                                                    event.target.value
                                                )
                                            }
                                            className={inputClassName}
                                        >
                                            <option value="">
                                                {loadingRegions
                                                    ? "Loading..."
                                                    : "Select City"}
                                            </option>

                                            {cities.map((region) => (
                                                <option
                                                    key={region.id}
                                                    value={region.id}
                                                >
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block text-sm font-medium text-ink-900">
                                        District
                                        <select
                                            required
                                            disabled={
                                                !form.city_id ||
                                                loadingRegions
                                            }
                                            value={form.district_id}
                                            onChange={(event) =>
                                                onDistrictChange(
                                                    event.target.value
                                                )
                                            }
                                            className={inputClassName}
                                        >
                                            <option value="">
                                                Select District
                                            </option>

                                            {districts.map((region) => (
                                                <option
                                                    key={region.id}
                                                    value={region.id}
                                                >
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block text-sm font-medium text-ink-900">
                                        Subdistrict
                                        <select
                                            disabled={
                                                !form.district_id ||
                                                loadingRegions
                                            }
                                            value={form.subdistrict_id ?? ""}
                                            onChange={(event) =>
                                                onSubdistrictChange(
                                                    event.target.value
                                                )
                                            }
                                            className={inputClassName}
                                        >
                                            <option value="">
                                                Select Subdistrict (Optional)
                                            </option>

                                            {subdistricts.map((region) => (
                                                <option
                                                    key={region.id}
                                                    value={region.id}
                                                >
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <label className="block text-sm font-medium text-ink-900 md:w-1/2">
                                    Postal Code
                                    <input
                                        maxLength={5}
                                        pattern="[0-9]{5}"
                                        value={form.postal_code}
                                        onChange={(event) =>
                                            onFieldChange(
                                                "postal_code",
                                                event.target.value
                                            )
                                        }
                                        placeholder="65145"
                                        className={inputClassName}
                                    />
                                </label>

                                <label className="flex cursor-pointer items-center gap-3 pt-2 text-sm text-ink-700">
                                    <input
                                        type="checkbox"
                                        checked={form.is_default}
                                        onChange={(event) =>
                                            onFieldChange(
                                                "is_default",
                                                event.target.checked
                                            )
                                        }
                                        className="h-4 w-4 accent-ink-950"
                                    />

                                    Set as default shipping address
                                </label>

                                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                                    <button
                                        type="button"
                                        onClick={onCloseForm}
                                        disabled={saving}
                                        className="rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-700 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving || loadingRegions}
                                        className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingAddressId !== null
                                              ? "Update Address"
                                              : "Save Address"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="p-6">
                        {loading ? (
                            <div className="py-16 text-center text-sm text-ink-500">
                                Loading addresses...
                            </div>
                        ) : errorMessage ? (
                            <div className="py-12 text-center">
                                <p className="text-sm text-red-600">
                                    {errorMessage}
                                </p>

                                <button
                                    type="button"
                                    onClick={onRetry}
                                    className="mt-4 rounded-lg bg-ink-950 px-5 py-2.5 text-sm text-white"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="text-3xl text-ink-400">
                                    ⌖
                                </div>

                                <p className="mt-3 text-sm font-medium text-ink-600">
                                    No addresses yet.
                                </p>

                                <p className="mt-1 text-xs text-ink-400">
                                    Add a shipping address to make checkout faster.
                                </p>

                                <button
                                    type="button"
                                    onClick={onOpenForm}
                                    className="mt-5 rounded-lg bg-ink-950 px-5 py-2.5 text-sm text-white"
                                >
                                    Add your first address
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {addresses.map((address) => (
                                    <article
                                        key={address.id}
                                        className="rounded-xl border border-ink-100 bg-ink-50/40 p-5 transition hover:border-ink-200 hover:bg-ink-50/80"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <h3 className="text-base font-semibold capitalize text-ink-950">
                                                        {address.label}
                                                    </h3>

                                                    {address.is_default && (
                                                        <span className="rounded-full bg-ink-950 px-2.5 py-0.5 text-xs font-medium uppercase text-white">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-sm text-ink-900">
                                                    <span className="font-semibold">
                                                        {address.recipient_name}
                                                    </span>

                                                    <span className="text-ink-300">
                                                        •
                                                    </span>

                                                    <span className="text-ink-600">
                                                        {address.phone}
                                                    </span>
                                                </div>

                                                <p className="text-sm leading-6 text-ink-600">
                                                    {address.full_address}
                                                </p>

                                                <p className="text-sm leading-6 text-ink-500">
                                                    {[
                                                        address.subdistrict_name,
                                                        address.district_name,
                                                        address.city_name,
                                                        address.province_name,
                                                        address.postal_code,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 border-t border-ink-100 pt-3 text-sm md:border-0 md:pt-0">
                                                {!address.is_default && (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            settingDefaultId !==
                                                            null
                                                        }
                                                        onClick={() =>
                                                            onSetDefault(
                                                                address.id
                                                            )
                                                        }
                                                        className="text-ink-600 transition hover:text-ink-950 disabled:opacity-50"
                                                    >
                                                        {settingDefaultId ===
                                                        address.id
                                                            ? "Setting..."
                                                            : "Set Default"}
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onEdit(address)
                                                    }
                                                    className="text-ink-600 transition hover:text-ink-950"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onAskDelete(address.id)
                                                    }
                                                    className="text-red-600 transition hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>

            {addressIdToDelete !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !deleting) {
                            onCloseDelete();
                        }
                    }}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-address-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h2
                            id="delete-address-title"
                            className="text-lg font-semibold text-ink-950"
                        >
                            Delete this address?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-ink-500">
                            This address will be permanently removed from your saved addresses.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={onCloseDelete}
                                className="rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={onConfirmDelete}
                                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}