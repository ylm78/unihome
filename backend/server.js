import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connexion Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Route test pour récupérer des produits (ou autre table que tu as créée)
app.get('/api/test', async (req, res) => {
  const { data, error } = await supabase
    .from('products') // remplace par une table existante si besoin
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(port, () => {
  console.log(`✅ Backend en ligne sur http://localhost:${port}`);
});
