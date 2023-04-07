export const session = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products')
    }
    return next()
}