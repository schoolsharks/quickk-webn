import { NextFunction, Request, Response } from 'express';
import User from '../../user/model/user.model';
import { generateAccessToken, verifyToken } from '../../../utils/jwtUtils';





// Controller for logout 
export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};


// Controller for Refresh Token 

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = verifyToken(refreshToken) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), "USER", user.company.toString());
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
};
