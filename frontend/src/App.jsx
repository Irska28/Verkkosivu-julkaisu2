import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentView, setCurrentView] = useState('etusivu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [session, setSession] = useState("")




//oo
  useEffect(() => {
    fetch("/categories")
      .then(res => res.json())
      .then(data => {
        const allOption = { id: 'all', name: 'Kaikki tuotteet' };
        setCategories([allOption, ...data]);
      })
      .catch(err => console.error("Category fetch error:", err));
  }, []);




  useEffect(() => {
    fetch("/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + parseFloat(item.prize), 0).toFixed(2);
  };

  const getFilteredProducts = () => {
  let filtered = products;

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(
      (product) =>
        product.category_id.toString() === selectedCategory.toString()
    );
  }

  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }

  return filtered;
};




  const cartItemCount = cart.length;



  if (currentView === 'shipping') {
    return (
      <div className="app">
        <header className="header">
          <div className="nav">
            <img src="/branding/logo/ALTERNATE%20LOGO.svg" alt="Logo" style={{ height: '60px' }} />
            <div className="nav-right">
              <h5 onClick={() => setCurrentView('etusivu')} style={{ cursor: 'pointer' }}>Etusivu</h5>
              <div className="cart-icon" onClick={() => setShowCart(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div>
          <div className="shipping-container">
            <h2>Toimitustiedot</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = {
                  session,
                  name,
                  email,
                  phone,
                  datetime: new Date().toISOString(),
                };
                const res = await fetch("/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                });

                if (res.ok) {
                  alert("Tilaus lähetetty onnistuneesti!");
                  setCart([]);
                  setCurrentView("etusivu");
                }
              }}
              className="shipping-form"
            >
              <label>Ordername: </label>
              <input
              type='text'
              required
              value={session}
              onChange={(e) => setSession(e.target.value)}
              />
              <label>Name: </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Sähköposti: </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Puhelin: </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <h3>Yhteenveto</h3>
              <ul>
                {cart.map((item, i) => (
                  <li key={i}>
                    {item.name} - ${item.prize}
                  </li>
                ))}
              </ul>

              <p><strong>Yhteishinta:</strong> ${getTotalPrice()}</p>

              <button type="submit" className="checkout-btn">
                Lähetä tilaus
              </button>
            </form>
          </div>

        </div>

      </div>
    )
  }


  // Etusivu-näkymä
  if (currentView === 'etusivu') {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <div className="landing-nav">
            <img src="/branding/logo/ALTERNATE%20LOGO.svg" alt="Logo" style={{ height: '40px' }} />
            <button onClick={() => setCurrentView('kauppa')} className="etuvisu-btn">
              Kauppaan →
            </button>
          </div>
        </header>


        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Tuoretta lähiruokaa suoraan kotiovellesi!</h1>
            <p className="hero-subtitle">Tuoreimmat • Korkealaatuisimmat • Lähin paikalliset ruokatori-tuotteet</p>
            <button onClick={() => setCurrentView('kauppa')} className="hero-cta-btn">
              Selaa tuotteita
            </button>
          </div>
          <div className="hero-waves">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,50 C300,100 900,0 1200,50 L1200,120 L0,120 Z" fill="#ffffff" />
            </svg>
          </div>
        </section>


        <section className="features-section">
          <h2 className="features-title">Kuinka Se Toimii</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>1. Rekisteröityminen</h3>
              <p>Luotettu verkko-ostopaikka vuosien kokemuksella. Vahvista tunnuksesi sähköpostiosoitteella.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>2. Selaa tuotteita</h3>
              <p>Selaa laajaa valikoimaamme tuoreita tuotteita. Löydä helposti luokkien kautta tai etsi suoraan tuotteita.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>3. Lisää ostoskoriin</h3>
              <p>Lisää haluamasi tuotteet ostoskoriin. Voit muokata määriä tai poistaa tuotteita ennen tilauksen vahvistamista.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>4. Turvallinen maksu</h3>
              <p>Maksa turvallisesti verkossa. Käytämme turvallisinta maksujärjestelmää, joka suojaa henkilökohtaiset tietosi.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👍</div>
              <h3>5. Tilauksen vahvistus</h3>
              <p>Saat välittömän tilausvahvistuksen sähköpostitse. Voit seurata tilauksesi tilaa milloin tahansa.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3>6. Toimitus kotiovelle</h3>
              <p>Tuotteet toimitetaan suoraan kotiovellesi. Nopea ja turvallinen toimitus kaikille alueille.</p>
            </div>

            <div className="feature-card full-width">
              <div className="feature-icon">💝</div>
              <h3>7. Nauti lähiruoasta</h3>
              <p>Tuoreimmat paikalliset tuotteet suoraan pöydällesi. Voit myös arvostella tuotteita ja auttaa muita asiakkaita.</p>
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <p>TAITAJIA 2024</p>
          <p>Iiro Kaulio</p>
          <p>TVTPT2301</p>
        </footer>
      </div>
    );
  }

  // Kauppa-näkymä
  return (
    <div className="app">
      <header className="header">
        <div className="nav">
          <img src="/branding/logo/ALTERNATE%20LOGO.svg" alt="Logo" style={{ height: '60px' }} />
          <div className="nav-right">
            <h5 onClick={() => setCurrentView('etusivu')} style={{ cursor: 'pointer' }}>Etusivu</h5>
            <div className="cart-icon" onClick={() => setShowCart(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="main">
        {loading && <p className="loading">Loading products...</p>}
        {error && <p className="error">Error: {error}</p>}

        {showCart ? (
          <div className="cart-view">
            <h2>Shopping Cart</h2>
            <p className='back-to-shop' onClick={() => setShowCart(false)}>
              Back to Shopping
            </p>
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">${item.prize}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="cart-total">
                  <h3>Total: ${getTotalPrice()}</h3>
                  <button onClick={() => setCurrentView('shipping')} className="checkout-btn">Checkout</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>


            <div className="search-bar">
              <input
                type="text"
                placeholder="Etsi tuotteita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <ul className="products-list">
              {getFilteredProducts().map((item) => (
                <li key={item.id} className="product-card">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-description">{item.description}</p>
                  <div className="product-footer">
                    <p className="product-price">${item.prize}</p>
                    <button
                      onClick={() => addToCart(item)}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <footer className="footer">
        <p>Taituri 2025</p>
        <p>Iiro Kaulio</p>
        <p>Gradia Viitaniemi</p>
      </footer>
    </div>
  );


}

export default App;