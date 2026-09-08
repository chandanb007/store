const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems = 0,
    pageSize = 20,
}) => {

    const startItem =
        totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

    const endItem = Math.min(
        currentPage * pageSize,
        totalItems
    );

    const handlePageChange = (page) => {
        if (
            page >= 1 &&
            page <= totalPages &&
            page !== currentPage
        ) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-between mt-4 text-xs">

            {/* Pagination Buttons */}
            <div className="flex items-center gap-1">

                {/* Previous */}
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {/* Page Numbers */}
                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 rounded-lg border transition-colors ${
                            currentPage === page
                                ? "bg-gold-600 text-white border-gold-600"
                                : "border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next */}
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>

            </div>

            {/* Showing */}
            <span className="text-stone-500 dark:text-stone-400">
                Showing {startItem}–{endItem} of {totalItems}
            </span>

        </div>
    );
};

export default Pagination;