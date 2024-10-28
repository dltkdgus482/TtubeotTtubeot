import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

class JWTParser {
  static parseUserIdFromJWT(token: string): number {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const userId = (decoded as any).user_id;

      return userId;
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return -1;
    }
  }
}

export default JWTParser;