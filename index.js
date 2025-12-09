require('dotenv').config();
const express = require('express');
const {supabase} = require('./database.js');
const cors = require('cors')
const app = express();
  
app.use(express.json());
app.use(cors())
app.use(express.static('dist'))

app.get('/products', async (request, response)  => {
    const {data} = await supabase
    .from('products')
    .select('*')
    response.json(data)
})

app.get('/products/category/:category_id', async (request, response) => {
  try {
    const { category_id } = request.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category_id);
    
    if (error) {
      return response.status(400).json({ error: error.message });
    }
    
    response.json(data);
  } catch (err) {
    response.status(500).json({ error: 'Server error' });
  }
});

app.get('/categories', async (request, response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')

    if (error) return response.status(400).json({ error: error.message });

    response.json(data);
  } catch (err) {
    response.status(500).json({ error: 'Server error' });
  }
});

app.post('/orders', async (request, response) => {
  try {
    const { session, name, email, phone, datetime } = request.body;

    if (!session || !name || !email || !phone) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          session,
          name,
          email,
          phone,
          datetime: datetime || new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      return response.status(400).json({ error: error.message });
    }

    response.status(201).json({ message: "Order created", order: data[0] });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


