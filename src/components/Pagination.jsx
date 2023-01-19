const Pagination = ({ page, changePage, isPreviousData}) => {
    return (
        <div className="pagination">
            <button className="btn-primary" disabled={isPreviousData || page <= 1} onClick={() => changePage({
                page: Number(page) - 1,
                })}>
                Previous
            </button>
            <span>{page}/500</span>
            <button className="btn-primary" disabled={isPreviousData || page >= 500} onClick={() => changePage({
                page: Number(page) + 1,
            })}>
                Next
            </button>
        </div>
    )
}

export default Pagination