// routes/authRoutes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Route auth OK ✅');
});

export default router;
