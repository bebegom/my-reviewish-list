import Container from 'react-bootstrap/Container'
const Pagination = ({ page, changePage, isPreviousData, totalPages = null}) => {
    return (
        <Container className="pagination">
            <button className="btn-primary" disabled={isPreviousData || page <= 1} onClick={() => totalPages ? changePage(page-1) : changePage({
                page: Number(page) - 1,
                })}>
                Previous
            </button>
            <span>{page}/{totalPages ? totalPages : '500'}</span>
            <button className="btn-primary" disabled={isPreviousData || page >= 500 || totalPages && totalPages - page <= 0} onClick={() =>  totalPages ? changePage(page+1) : changePage({
                page: Number(page) + 1,
            })}>
                Next
            </button>
        </Container>
    )
}

export default Pagination