import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

// interface Decoded extends JwtPayload{
//     userId?: string;
// }


export function middleware(req:Request, res:Response, next:NextFunction){
    const token = req.headers["authorization"] ?? " " ;

    if(token==" "){
        return res.status(401).json({
            message:"Unauthorized!"
        })
    }
    

    // /// IF ABOVE CODE not there jwt malformed error
    // JsonWebTokenError: jwt malformed
    // at module.exports [as verify] (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\jsonwebtoken@9.0.3\node_modules\jsonwebtoken\verify.js:70:17)     
    // at middleware (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\apps\http-backend\dist\middleware.js:17:44)
    // at Layer.handleRequest (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\lib\layer.js:152:17)
    // at next (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\lib\route.js:157:13)
    // at Route.dispatch (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\lib\route.js:117:3)
    // at handle (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\index.js:435:11)
    // at Layer.handleRequest (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\lib\layer.js:152:17)
    // at C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\index.js:295:15
    // at processParams (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\index.js:582:12)
    // at next (C:\Users\swaro\Desktop\cohort\WebDev_DevOps\Week22\exdraw\node_modules\.pnpm\router@2.2.0\node_modules\router\index.js:291:5)





    //what is the better solution to this instead of manual typecasting --- ig generic typecasting like the one in cpp
    const decoded = jwt.verify(token, JWT_SECRET ) as JwtPayload;

    if(decoded){
        //extend request object to avoid this.
        //this should be the same var as the one you feed to sign token userId 
        req.userId = decoded.userId;
        next();
    }else{
        return res.status(401).json({
            message: "Unauthorized!"
        })
    }
}