import jwt, { JsonWebTokenError, SignOptions } from "jsonwebtoken";

class AuthRepository {
  createJwtToken(
    payload: {
      userId: string;
    },
    secret: string,
    options?: SignOptions
  ) {
    return jwt.sign(payload, secret, options);
  }

  verifyJwtToken(token: string, secret: string, options?: object) {
    try {
      return jwt.verify(token, secret, options) as string | jwt.JwtPayload;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Invalid token");
    }
  }

  createHash(data: string, saltRounds: number) {
    return jwt.sign(data, saltRounds.toString());
  }

  verifyHash(data: string, hash: string) {
    try {
      jwt.verify(hash, data);
      return true;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        return false;
      }
      throw err;
    }
  }
}

export const authRepository = new AuthRepository();
