import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    lastPage,
    loading = false,
    onPageChange,
}: PaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    const pageCount = Math.min(5, lastPage);
    const startPage = Math.max(
        1,
        Math.min(currentPage - 2, lastPage - pageCount + 1)
    );

    const pages = Array.from(
        { length: pageCount },
        (_, index) => startPage + index
    );

    return (
        <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
            <button
                type="button"
                disabled={currentPage === 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
                className="rounded-lg border border-ink-200 px-3 py-2 disabled:opacity-40"
            >
                <ChevronLeft size={18} />
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    aria-current={
                        currentPage === page ? "page" : undefined
                    }
                    disabled={loading}
                    onClick={() => onPageChange(page)}
                    className={`size-10 rounded-lg border text-sm ${
                        currentPage === page
                            ? "border-ink-950 bg-ink-950 text-white"
                            : "border-ink-200 hover:bg-ink-100"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                disabled={currentPage === lastPage || loading}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
                className="rounded-lg border border-ink-200 px-3 py-2 disabled:opacity-40"
            >
                <ChevronRight size={18} />
            </button>
        </nav>
    );
}