export function getPopularArticles ({ articles }) {

}

export function getPagination (totalPages, page) {
  if (page < 0 || totalPages <= 1) return [1]
  if (totalPages <= 5) {
    return new Array(totalPages).fill(0).map((_, i) => i + 1)
  }
  if (page <= 3) {
    return [1, 2, 3, '...', totalPages]
  }
  if (totalPages - page < 3) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, '...', +page - 1, +page, +page + 1, '...', totalPages]
}
