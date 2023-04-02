class CookieController {

    static async setCookie(req, res) {
        res.cookie('sandiCookies', 'Esta es una cookie', { maxAge: 50000, signed: true }).send('Cookie')
    }

    static async getCookie(req, res) {
        res.send(req.signedCookies)
    }

    static async deleteCookie(req, res) {
        res.clearCookie('sandiCookies').send('Cookie removed')
    }


}
export default CookieController;