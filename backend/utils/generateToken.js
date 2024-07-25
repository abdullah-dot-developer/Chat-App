import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d"
    })
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //converted in milliseconds
        httpOnly: true,  //prevent XSS cross-sites-scripting attacks
        sameSite: "strict", //CSRF cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    })
    // console.log("GeneratedToken", token)
}

export default generateTokenAndSetCookie;