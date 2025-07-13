import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: 'Authorization token required' });

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default requireAuth;
