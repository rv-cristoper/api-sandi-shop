const baseUrl = "http://localhost:8080";

export default class CommonsUtils {
    static buildResult(opts) {
        const {
            docs,
            limit,
            totalPages,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            sort,
        } = opts
        return {
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: !hasPrevPage ? null : `${baseUrl}/products?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
            nextLink: !hasNextPage ? null : `${baseUrl}/products?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
            sort,
            sortLink: `${baseUrl}/products?page=${page}&limit=${limit}&sort=${sort === 'asc' ? 'desc' : 'asc'}`,
            paginationLink: `${baseUrl}/products?page=numberPage&limit=${limit}${sort ? `&sort=${sort}` : ''}`
        }
    }

    static getFilter(query = {}) {
        const { category, status } = query
        const filter = {}
        if (category) {
            filter.category = category
        }
        if (status) {
            filter.status = status
        }
        return filter
    }
} 