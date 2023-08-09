export const session = (req, res, next) => {
    if (req.cookies.token) {
        return res.redirect('/products')
    }
    return next()
}