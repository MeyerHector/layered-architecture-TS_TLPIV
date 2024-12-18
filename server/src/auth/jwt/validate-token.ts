import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { envs } from "../../environments/environments";
const { JWT_SECRET_KEY } = envs;

import { UserService } from "../../services/User.service";
import { User } from "../../models";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.headers.authorization) {
      console.log("hola aca ");
      res.status(401).json({ message: "No estas autenticado" });
      return;
    }

    let token = req.headers.authorization;
    token = token?.split(" ")[1];

    if (!token) throw new Error("Inicie sesión para continuar");

    const verifytoken = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    if (!verifytoken) {
      console.log("hola aca 22");
      res.status(401).json({ message: "Token no valido" });
      return;
    }

    let user = await new UserService().getUserById(verifytoken.id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error, "hola acaaa");
    res.status(401).json({ message: error });
  }
};
