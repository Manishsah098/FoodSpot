import jwt from 'jsonwebtoken'

const adminAuth = async(req, res,next)  => {
    try {
        const {token} = req.headers
        if(!token){
            return res.json({success:false, message: "unauthorized user"})
        } 
        const token_decoce = jwt.verify(Token, process.env.)
    }
}