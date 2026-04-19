import { useState, useEffect, createContext, useContext, useCallback } from "react";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --cream: #f5f0e8; --warm: #e8dfc8; --sand: #c9b99a; --clay: #8b6f5e;
      --bark: #4a3728; --ink: #1a1208; --sage: #7d8c6f; --rust: #b85c38;
      --gold: #c49a3c; --white: #fdfaf5;
    }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
    h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; }
    button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
    input, select { font-family: 'DM Sans', sans-serif; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--warm); }
    ::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 3px; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes slideDown { from { transform:translateY(-20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    .fade-in { animation: fadeIn 0.4s ease both; }
    .slide-down { animation: slideDown 0.3s ease; }
  `}</style>
);

const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const I = {
  cart: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  plus: "M12 5v14M5 12h14", minus: "M5 12h14",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  arrow: "M5 12h14M12 5l7 7-7 7",
  bag: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z",
  orders: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2",
  check: "M20 6 9 17l-5-5",
  lock: "M12 1v6m0 6v6M5 7h14v12H5z M8 7V5a4 4 0 0 1 8 0v2",
  creditCard: "M13 16H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2zm-11-4h8M3 10h18",
  payment: "M1 4m0 0h22v16H1z M1 10h22",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

const MOCK_PRODUCTS = [
  { id:"1", name:"Obsidian Desk Lamp", price:129.99, category:"Lighting", stock:12, rating:4.8, reviews:234, image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80", description:"Minimalist arc lamp with adjustable warm/cool light. Perfect for focused work sessions." },
  { id:"2", name:"Merino Wool Throw", price:89.99, category:"Textiles", stock:30, rating:4.9, reviews:512, image:"https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400&q=80", description:"Ethically sourced merino wool in natural earth tones. Incredibly soft, temperature-regulating." },
  { id:"3", name:"Ceramic Pour-Over Set", price:64.00, category:"Kitchen", stock:8, rating:4.7, reviews:189, image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", description:"Hand-thrown ceramic dripper and carafe set. Each piece is unique, glazed in matte stone." },
  { id:"4", name:"Linen Tote Bag", price:45.00, category:"Accessories", stock:55, rating:4.6, reviews:320, image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80", description:"Heavyweight linen canvas with leather handles. Spacious, durable, effortlessly elegant." },
  { id:"5", name:"Walnut Serving Board", price:78.50, category:"Kitchen", stock:20, rating:4.9, reviews:401, image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", description:"Solid American walnut with juice groove. Heirloom quality, naturally antimicrobial." },
  { id:"6", name:"Handmade Soy Candle", price:32.00, category:"Home", stock:75, rating:4.8, reviews:768, image:"https://images.unsplash.com/photo-1602607921522-11a56fcce174?w=400&q=80", description:"Small-batch soy wax with cedar + amber fragrance. 60-hour burn time, reusable vessel." },
  { id:"7", name:"Brass Bookends", price:55.00, category:"Accessories", stock:18, rating:4.5, reviews:143, image:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", description:"Solid cast brass with an aged patina finish. Weighted base keeps books perfectly upright." },
  { id:"8", name:"Linen Duvet Cover", price:185.00, category:"Textiles", stock:14, rating:4.7, reviews:295, image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80", description:"Stone-washed French linen, gets softer with every wash. Available in 5 natural shades." },
];
const MOCK_CATS = ["All","Accessories","Home","Kitchen","Lighting","Textiles"];

const Store = createContext(null);
const useStore = () => useContext(Store);

const Spinner = () => (
  <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
    <div style={{ width:28, height:28, border:"2px solid var(--warm)", borderTopColor:"var(--clay)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
  </div>
);

const ToastBar = ({ toasts }) => (
  <div style={{ position:"fixed", bottom:20, right:20, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{ background: t.type==="error" ? "var(--rust)" : t.type==="success" ? "var(--sage)" : "var(--bark)", color:"var(--cream)", padding:"11px 18px", borderRadius:4, fontSize:13, fontWeight:500, animation:"fadeIn 0.3s ease", boxShadow:"0 4px 20px rgba(0,0,0,0.2)", maxWidth:280 }}>
        {t.msg}
      </div>
    ))}
  </div>
);

// ── Navbar ─────────────────────────────────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, cartCount, user, onLogout }) => (
  <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(245,240,232,0.96)", backdropFilter:"blur(12px)", borderBottom:"1px solid var(--warm)" }}>
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", height:60, gap:28 }}>
      <button onClick={() => setPage("home")} style={{ background:"none", border:"none", display:"flex", alignItems:"baseline", gap:5 }}>
        <span style={{ fontFamily:"Cormorant Garamond", fontSize:24, fontWeight:600, color:"var(--bark)" }}>Terra</span>
        <span style={{ fontSize:9, letterSpacing:3, color:"var(--clay)", textTransform:"uppercase" }}>goods</span>
      </button>
      <div style={{ display:"flex", gap:24 }}>
        {["Shop","About"].map(l => (
          <button key={l} onClick={() => setPage(l.toLowerCase())} style={{ background:"none", border:"none", fontSize:11, fontWeight:500, letterSpacing:1.5, textTransform:"uppercase", color: page===l.toLowerCase() ? "var(--rust)" : "var(--clay)", transition:"color 0.2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ flex:1 }} />
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {user ? (
          <>
            <span style={{ fontSize:12, color:"var(--clay)", marginRight:4 }}>{user.name}</span>
            <button onClick={() => setPage("orders")} style={{ background:"none", border:"none", padding:7, color:"var(--clay)" }}><Icon d={I.orders} size={18} /></button>
            <button onClick={onLogout} style={{ background:"none", border:"1px solid var(--sand)", fontSize:10, letterSpacing:1, textTransform:"uppercase", color:"var(--clay)", padding:"5px 10px", borderRadius:2 }}>Out</button>
          </>
        ) : (
          <button onClick={() => setPage("auth")} style={{ background:"none", border:"none", padding:7, color:"var(--clay)" }}><Icon d={I.user} size={18} /></button>
        )}
        <button onClick={() => setPage("cart")} style={{ background:"none", border:"none", padding:7, color:"var(--ink)", position:"relative" }}>
          <Icon d={I.cart} size={18} />
          {cartCount > 0 && <span style={{ position:"absolute", top:2, right:2, background:"var(--rust)", color:"#fff", fontSize:8, fontWeight:700, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>}
        </button>
      </div>
    </div>
  </nav>
);

// ── Hero ───────────────────────────────────────────────────────────────────────────────────────
const Hero = ({ setPage }) => (
  <section style={{ position:"relative", minHeight:"85vh", display:"flex", alignItems:"center", background:"linear-gradient(135deg,#f5f0e8 0%,#e8dfc8 50%,#d4c9b0 100%)", overflow:"hidden" }}>
    <div style={{ position:"absolute", right:-60, top:-60, width:420, height:420, borderRadius:"50%", background:"rgba(196,154,60,0.07)", pointerEvents:"none" }} />
    <div style={{ position:"absolute", right:50, bottom:-100, width:260, height:260, borderRadius:"50%", background:"rgba(139,111,94,0.09)", pointerEvents:"none" }} />
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center", width:"100%" }}>
      <div className="fade-in">
        <p style={{ fontSize:10, letterSpacing:4, textTransform:"uppercase", color:"var(--clay)", marginBottom:18, fontWeight:500 }}>Curated Living</p>
        <h1 style={{ fontSize:"clamp(44px,6vw,80px)", lineHeight:0.93, fontWeight:300, color:"var(--ink)", marginBottom:24 }}>
          Objects<br/><em style={{ fontStyle:"italic", color:"var(--clay)" }}>worth</em><br/>keeping.
        </h1>
        <p style={{ fontSize:15, lineHeight:1.75, color:"var(--clay)", maxWidth:360, marginBottom:36, fontWeight:300 }}>
          Handpicked goods made with intention — from artisans who believe in slow, thoughtful craft.
        </p>
        <div style={{ display:"flex", gap:14 }}>
          <button onClick={() => setPage("shop")} style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bark)", color:"var(--cream)", border:"none", padding:"13px 28px", fontSize:11, letterSpacing:2, textTransform:"uppercase", fontWeight:500 }}>
            Shop Now <Icon d={I.arrow} size={14} />
          </button>
          <button onClick={() => setPage("about")} style={{ background:"none", border:"1px solid var(--clay)", color:"var(--clay)", padding:"13px 24px", fontSize:11, letterSpacing:2, textTransform:"uppercase", fontWeight:500 }}>
            Our Story
          </button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, animation:"fadeIn 0.6s 0.25s ease both", opacity:0 }}>
        {["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=280&q=80","https://images.unsplash.com/photo-1602607921522-11a56fcce174?w=280&q=80","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=280&q=80","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=280&q=80"].map((src,i) => (
          <div key={i} style={{ aspectRatio:"1", overflow:"hidden", borderRadius:2, transform: i%2 ? "translateY(18px)" : "none" }}>
            <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>e.target.style.transform="scale(1.06)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Product Card ───────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAdd, onView }) => {
  const [hov, setHov] = useState(false);
  const [adding, setAdding] = useState(false);
  const handleAdd = (e) => { e.stopPropagation(); setAdding(true); onAdd(product); setTimeout(() => setAdding(false), 600); };
  return (
    <div onClick={() => onView(product)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ cursor:"pointer", background:"var(--white)", transition:"transform 0.3s,box-shadow 0.3s", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? "0 14px 36px rgba(74,55,40,0.12)" : "0 2px 8px rgba(74,55,40,0.06)" }}>
      <div style={{ overflow:"hidden", aspectRatio:"4/3", position:"relative" }}>
        <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s", transform: hov ? "scale(1.05)" : "scale(1)" }} />
        <div style={{ position:"absolute", inset:0, background:`rgba(26,18,8,${hov?0.14:0})`, transition:"background 0.3s" }} />
        <button onClick={handleAdd} style={{ position:"absolute", bottom:10, right:10, background:"var(--bark)", color:"var(--cream)", border:"none", width:38, height:38, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", opacity: hov ? 1 : 0, transform: hov ? "scale(1)" : "scale(0.6)", transition:"all 0.25s" }}>
          {adding ? <Icon d={I.check} size={14} /> : <Icon d={I.plus} size={14} />}
        </button>
      </div>
      <div style={{ padding:"14px 16px 18px" }}>
        <p style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"var(--sand)", marginBottom:5, fontWeight:500 }}>{product.category}</p>
        <h3 style={{ fontSize:16, fontWeight:400, color:"var(--ink)", marginBottom:7, lineHeight:1.3 }}>{product.name}</h3>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:17, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--bark)" }}>${product.price.toFixed(2)}</span>
          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
            <Icon d={I.star} size={11} fill="var(--gold)" stroke="var(--gold)" />
            <span style={{ fontSize:11, color:"var(--clay)" }}>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Shop ───────────────────────────────────────────────────────────────────────────────────────
const ShopPage = ({ onAdd, onView }) => {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");

  const filtered = MOCK_PRODUCTS
    .filter(p => (cat === "All" || p.category === cat) && (!search || p.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b) => sort==="price_asc" ? a.price-b.price : sort==="price_desc" ? b.price-a.price : sort==="rating" ? b.rating-a.rating : 0);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"44px 20px" }}>
      <div style={{ marginBottom:36 }}>
        <p style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"var(--clay)", marginBottom:6 }}>The Collection</p>
        <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:300, color:"var(--ink)" }}>All Products</h2>
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:32, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1 1 200px", maxWidth:280 }}>
          <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--sand)", pointerEvents:"none" }}><Icon d={I.search} size={14} /></div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ width:"100%", padding:"9px 10px 9px 32px", border:"1px solid var(--warm)", background:"var(--white)", color:"var(--ink)", fontSize:13, outline:"none", borderRadius:2 }} />
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {MOCK_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding:"7px 14px", fontSize:10, letterSpacing:1, textTransform:"uppercase", fontWeight:500, border:`1px solid ${cat===c?"var(--bark)":"var(--warm)"}`, background: cat===c ? "var(--bark)" : "transparent", color: cat===c ? "var(--cream)" : "var(--clay)", borderRadius:2, transition:"all 0.2s" }}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ marginLeft:"auto", padding:"8px 12px", border:"1px solid var(--warm)", background:"var(--white)", color:"var(--clay)", fontSize:11, letterSpacing:1, outline:"none", borderRadius:2 }}>
          <option value="default">Featured</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      <p style={{ fontSize:11, color:"var(--sand)", marginBottom:20 }}>{filtered.length} items</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:20 }}>
        {filtered.map((p,i) => (
          <div key={p.id} className="fade-in" style={{ animationDelay:`${i*0.06}s` }}>
            <ProductCard product={p} onAdd={onAdd} onView={onView} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Product Detail ────────────────────────────────────────────────────────────────────────────
const ProductDetail = ({ product, onAdd, onBack }) => {
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const handleAdd = () => { for(let i=0;i<qty;i++) onAdd(product); setDone(true); setTimeout(()=>setDone(false),1500); };
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"44px 20px" }} className="fade-in">
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"var(--clay)", fontSize:11, letterSpacing:1.5, textTransform:"uppercase", marginBottom:36 }}>← Back</button>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
        <img src={product.image} alt={product.name} style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", borderRadius:2 }} />
        <div>
          <p style={{ fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"var(--sand)", marginBottom:10 }}>{product.category}</p>
          <h1 style={{ fontSize:38, fontWeight:300, color:"var(--ink)", lineHeight:1.1, marginBottom:14 }}>{product.name}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            {[...Array(5)].map((_,i) => <Icon key={i} d={I.star} size={13} fill={i < Math.floor(product.rating)?"var(--gold)":"none"} stroke="var(--gold)" />)}
            <span style={{ fontSize:12, color:"var(--clay)" }}>{product.rating} · {product.reviews} reviews</span>
          </div>
          <p style={{ fontSize:32, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--bark)", marginBottom:22 }}>${product.price.toFixed(2)}</p>
          <p style={{ fontSize:14, lineHeight:1.85, color:"var(--clay)", marginBottom:30, fontWeight:300 }}>{product.description}</p>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", border:"1px solid var(--warm)", borderRadius:2 }}>
              <button onClick={() => setQty(q=>Math.max(1,q-1))} style={{ background:"none", border:"none", padding:"9px 12px", color:"var(--clay)" }}><Icon d={I.minus} size={13} /></button>
              <span style={{ padding:"0 8px", fontSize:14, minWidth:28, textAlign:"center" }}>{qty}</span>
              <button onClick={() => setQty(q=>Math.min(product.stock,q+1))} style={{ background:"none", border:"none", padding:"9px 12px", color:"var(--clay)" }}><Icon d={I.plus} size={13} /></button>
            </div>
            <span style={{ fontSize:11, color:"var(--sage)" }}>{product.stock} in stock</span>
          </div>
          <button onClick={handleAdd} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", background: done ? "var(--sage)" : "var(--bark)", color:"var(--cream)", border:"none", padding:"15px 28px", fontSize:11, letterSpacing:2, textTransform:"uppercase", fontWeight:500, transition:"background 0.3s" }}>
            {done ? <><Icon d={I.check} size={15}/> Added!</> : <><Icon d={I.bag} size={15}/> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── PAYMENT PAGE (NEW) ────────────────────────────────────────────────────────────────────────
const PaymentPage = ({ cart, total, onPaymentSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("card"); // card, paypal, apple, google
  const [processing, setProcessing] = useState(false);
  
  // Credit card state
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "", name: "" });
  
  // Shipping state
  const [shipping, setShipping] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "" });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "number") formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
    if (name === "expiry") formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2");
    if (name === "cvc") formatted = value.replace(/\D/g, "").slice(0, 4);
    setCardData(prev => ({ ...prev, [name]: formatted }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = async () => {
    if (paymentMethod === "card") {
      if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
        alert("Please fill in all card details");
        return;
      }
    }
    if (!shipping.firstName || !shipping.lastName || !shipping.email || !shipping.address) {
      alert("Please fill in shipping information");
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess({
        method: paymentMethod,
        cardLast4: paymentMethod === "card" ? cardData.number.slice(-4) : null,
        shipping: shipping,
        amount: total
      });
    }, 2000);
  };

  const isValidCard = cardData.number.length === 19 && cardData.expiry.length === 5 && cardData.cvc.length >= 3;

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"44px 20px" }} className="fade-in">
      <h2 style={{ fontSize:38, fontWeight:300, marginBottom:36, color:"var(--ink)" }}>Secure Checkout</h2>
      
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:44 }}>
        
        {/* Left: Payment & Shipping Forms */}
        <div>
          {/* Shipping Information */}
          <div style={{ marginBottom:40 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              <Icon d={I.check} size={20} stroke="var(--sage)" strokeWidth={3} />
              <h3 style={{ fontSize:20, fontWeight:400, color:"var(--ink)" }}>Shipping Address</h3>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <input name="firstName" placeholder="First Name" value={shipping.firstName} onChange={handleShippingChange} style={{color:"var(--ink)", padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none" }} />
              <input name="lastName" placeholder="Last Name" value={shipping.lastName} onChange={handleShippingChange} style={{color:"var(--ink)",
                 padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none" }} />
            </div>
            <input name="email" type="email" placeholder="Email Address" value={shipping.email} onChange={handleShippingChange} style={{color:"var(--ink)", width:"100%", padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none", marginTop:12 }} />
            <input name="phone" placeholder="Phone Number" value={shipping.phone} onChange={handleShippingChange} style={{color:"var(--ink)", width:"100%", padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none", marginTop:12 }} />
            <input name="address" placeholder="Street Address" value={shipping.address} onChange={handleShippingChange} style={{color:"var(--ink)", width:"100%", padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none", marginTop:12 }} />
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:12, marginTop:12 }}>
              <input name="city" placeholder="City" value={shipping.city} onChange={handleShippingChange} style={{color:"var(--ink)", padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none" }} />
              <input name="state" placeholder="State" value={shipping.state} onChange={handleShippingChange} style={{color:"var(--ink)", padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none" }} />
              <input name="zip" placeholder="ZIP Code" value={shipping.zip} onChange={handleShippingChange} style={{color:"var(--ink)", padding:"12px 14px", border:"1px solid var(--warm)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none" }} />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div style={{ marginBottom:40 }}>
            <h3 style={{ fontSize:20, fontWeight:400, color:"var(--ink)", marginBottom:16 }}>Payment Method</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { id:"card", label:"Credit Card", icon:I.creditCard },
                { id:"paypal", label:"PayPal", icon:I.payment },
                { id:"apple", label:"Apple Pay", icon:I.payment },
                { id:"google", label:"Google Pay", icon:I.payment }
              ].map(m => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 16px", border:`2px solid ${paymentMethod===m.id ? "var(--bark)" : "var(--warm)"}`, background:paymentMethod===m.id ? "var(--cream)" : "var(--white)", borderRadius:2, cursor:"pointer", transition:"all 0.2s", color:"var(--ink)", fontSize:13, fontWeight:500 }}>
                  <Icon d={m.icon} size={16} stroke={paymentMethod===m.id ? "var(--bark)" : "var(--clay)"} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === "card" && (
            <div style={{ background:"var(--warm)", padding:24, borderRadius:2, marginBottom:20 }}>
              <h4 style={{ fontSize:14, fontWeight:500, color:"var(--ink)", marginBottom:14 }}>Card Details</h4>
              <input name="name" placeholder="Cardholder Name" value={cardData.name} onChange={handleCardChange} style={{ width:"100%", padding:"12px 14px", border:"1px solid var(--sand)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none", marginBottom:12 }} />
              <input name="number" placeholder="Card Number" value={cardData.number} onChange={handleCardChange} style={{ width:"100%", padding:"12px 14px", border:"1px solid var(--sand)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none", marginBottom:12, fontFamily:"monospace" }} />
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12 }}>
                <input name="expiry" placeholder="MM/YY" value={cardData.expiry} onChange={handleCardChange} style={{ padding:"12px 14px", border:"1px solid var(--sand)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none" }} />
                <input name="cvc" placeholder="CVC" value={cardData.cvc} onChange={handleCardChange} style={{ padding:"12px 14px", border:"1px solid var(--sand)", background:"var(--white)", borderRadius:2, fontSize:13, outline:"none" }} />
              </div>
              <p style={{ fontSize:11, color:"var(--clay)", marginTop:12, display:"flex", alignItems:"center", gap:6 }}>
                <Icon d={I.lock} size={14} stroke="var(--sage)" />
                Your payment information is secure and encrypted
              </p>
            </div>
          )}

          {(paymentMethod === "paypal" || paymentMethod === "apple" || paymentMethod === "google") && (
            <div style={{ background:"var(--warm)", padding:24, borderRadius:2, marginBottom:20, textAlign:"center" }}>
              <p style={{ fontSize:13, color:"var(--clay)", marginBottom:12 }}>
                You will be redirected to {paymentMethod === "paypal" ? "PayPal" : paymentMethod === "apple" ? "Apple Pay" : "Google Pay"} to complete payment.
              </p>
              <p style={{ fontSize:12, color:"var(--sand)" }}>Click 'Complete Payment' to continue</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={processPayment} disabled={processing || (paymentMethod === "card" && !isValidCard)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:processing ? "var(--sand)" : "var(--bark)", color:"var(--cream)", border:"none", padding:"15px", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:500, opacity: processing || (paymentMethod === "card" && !isValidCard) ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}>
              {processing ? <>Processing…</> : <>Complete Payment</>}
            </button>
            <button onClick={onCancel} disabled={processing} style={{ padding:"15px 28px", background:"none", border:"1px solid var(--clay)", color:"var(--clay)", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:500, borderRadius:2, cursor:"pointer", opacity: processing ? 0.5 : 1 }}>
              Back
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div style={{ background:"var(--warm)", padding:24, borderRadius:2, height:"fit-content", position:"sticky", top:70 }}>
          <h3 style={{ fontSize:18, fontWeight:400, color:"var(--ink)", marginBottom:20 }}>Order Summary</h3>
          <div style={{ maxHeight:300, overflowY:"auto", marginBottom:20, paddingBottom:12, borderBottom:"1px solid var(--sand)" }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--clay)", marginBottom:12 }}>
                <span>{item.name} × {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--clay)" }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--clay)" }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--clay)" }}>
              <span>Tax</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div style={{ borderTop:"1px solid var(--sand)", paddingTop:12, display:"flex", justifyContent:"space-between", fontSize:18, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--ink)" }}>
              <span>Total</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>
          <div style={{ marginTop:16, padding:12, background:"rgba(125,140,111,0.1)", borderRadius:2 }}>
            <p style={{ fontSize:10, color:"var(--sage)", display:"flex", alignItems:"center", gap:6 }}>
              <Icon d={I.shield} size={14} stroke="var(--sage)" />
              All transactions are secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Cart ───────────────────────────────────────────────────────────────────────────────────────
const CartPage = ({ cart, updateQty, removeItem, setPage, onCheckout }) => {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s,i) => s + i.qty, 0);
  if (!cart.length) return (
    <div style={{ maxWidth:500, margin:"80px auto", padding:"0 20px", textAlign:"center" }}>
      <p style={{ fontSize:52, marginBottom:16 }}>∅</p>
      <h2 style={{ fontSize:30, fontWeight:300, color:"var(--ink)", marginBottom:10 }}>Your cart is empty</h2>
      <p style={{ color:"var(--clay)", marginBottom:28 }}>Add some beautiful things to it.</p>
      <button onClick={() => setPage("shop")} style={{ background:"var(--bark)", color:"var(--cream)", border:"none", padding:"12px 28px", fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>Shop Now</button>
    </div>
  );
  return (
    <div style={{ maxWidth:1060, margin:"0 auto", padding:"44px 20px" }} className="fade-in">
      <h2 style={{ fontSize:38, fontWeight:300, marginBottom:36, color:"var(--ink)" }}>Your Cart</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 310px", gap:44 }}>
        <div>
          {cart.map((item,i) => (
            <div key={item.id+i} style={{ display:"flex", gap:16, padding:"20px 0", borderBottom:"1px solid var(--warm)", animation:"fadeIn 0.3s ease both", animationDelay:`${i*0.04}s` }}>
              <img src={item.image} alt={item.name} style={{ width:80, height:80, objectFit:"cover", borderRadius:2 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:15, fontWeight:400, color:"var(--ink)", marginBottom:4 }}>{item.name}</p>
                <p style={{ fontSize:15, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--clay)", marginBottom:10 }}>${item.price.toFixed(2)}</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", border:"1px solid var(--warm)", borderRadius:2 }}>
                    <button onClick={() => updateQty(item.id, item.qty-1)} style={{ background:"none", border:"none", padding:"5px 9px", color:"var(--clay)" }}><Icon d={I.minus} size={11}/></button>
                    <span style={{ padding:"0 5px", fontSize:13, minWidth:22, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty+1)} style={{ background:"none", border:"none", padding:"5px 9px", color:"var(--clay)" }}><Icon d={I.plus} size={11}/></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background:"none", border:"none", color:"var(--sand)", fontSize:11, letterSpacing:1 }}>Remove</button>
                </div>
              </div>
              <p style={{ fontSize:15, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--bark)" }}>${(item.price*item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"var(--warm)", padding:24, borderRadius:2, height:"fit-content", position:"sticky", top:70 }}>
          <h3 style={{ fontSize:20, fontWeight:400, marginBottom:20, color:"var(--ink)" }}>Summary</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--clay)" }}><span>Subtotal ({count})</span><span>${total.toFixed(2)}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--clay)" }}><span>Shipping</span><span style={{ color:"var(--sage)" }}>Free</span></div>
            <div style={{ borderTop:"1px solid var(--sand)", paddingTop:10, display:"flex", justifyContent:"space-between", fontSize:17, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--ink)" }}><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button onClick={() => onCheckout(total)} style={{ width:"100%", background:"var(--bark)", color:"var(--cream)", border:"none", padding:"14px", fontSize:11, letterSpacing:2, textTransform:"uppercase", fontWeight:500 }}>Proceed to Payment</button>
          <p style={{ fontSize:10, textAlign:"center", color:"var(--clay)", marginTop:10 }}>Free returns · Secure checkout</p>
        </div>
      </div>
    </div>
  );
};

// ── Auth ───────────────────────────────────────────────────────────────────────────────────────
const AuthPage = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");

  const submit = () => {
    if (!form.email || !form.password || (mode==="register" && !form.name)) { setErr("All fields required"); return; }
    onAuth({ name: mode==="register" ? form.name : form.email.split("@")[0], email: form.email });
  };

  return (
    <div style={{ maxWidth:400, margin:"70px auto", padding:"0 20px" }} className="fade-in">
      <div style={{ background:"var(--white)", padding:"40px 36px", boxShadow:"0 4px 40px rgba(74,55,40,0.08)" }}>
        <h2 style={{ fontSize:32, fontWeight:300, marginBottom:5, color:"var(--ink)", textAlign:"center" }}>{mode==="login" ? "Welcome back" : "Join us"}</h2>
        <p style={{ fontSize:12, color:"var(--sand)", textAlign:"center", marginBottom:32 }}>{mode==="login" ? "Sign in to your account" : "Create your account"}</p>
        {mode==="register" && (
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase", color:"var(--clay)", display:"block", marginBottom:5 }}>Name</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your name" style={{ width:"100%", padding:"11px 12px", border:"1px solid var(--warm)", background:"var(--cream)", fontSize:13, outline:"none", borderRadius:2 }} />
          </div>
        )}
        {["email","password"].map(f => (
          <div key={f} style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase", color:"var(--clay)", display:"block", marginBottom:5 }}>{f}</label>
            <input type={f==="password"?"password":"email"} value={form[f]} onChange={e=>setForm(fm=>({...fm,[f]:e.target.value}))} placeholder={f==="email"?"you@email.com":"••••••••"} onKeyDown={e=>e.key==="Enter"&&submit()} style={{ color:"var(--ink)", width:"100%", padding:"11px 12px", border:"1px solid var(--warm)", background:"var(--cream)", fontSize:13, outline:"none", borderRadius:2 }} />
          </div>
        ))}
        {err && <p style={{ fontSize:12, color:"var(--rust)", marginBottom:12 }}>{err}</p>}
        <button onClick={submit} style={{ width:"100%", background:"var(--bark)", color:"var(--cream)", border:"none", padding:"13px", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginTop:6 }}>
          {mode==="login" ? "Sign In" : "Create Account"}
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:"var(--clay)", marginTop:20 }}>
          {mode==="login" ? "New here? " : "Have an account? "}
          <button onClick={() => { setMode(mode==="login"?"register":"login"); setErr(""); }} style={{ background:"none", border:"none", color:"var(--rust)", fontWeight:500, textDecoration:"underline", fontSize:12 }}>
            {mode==="login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

// ── Orders ─────────────────────────────────────────────────────────────────────────────────────
const OrdersPage = ({ orders, user, setPage }) => {
  if (!user) return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <p style={{ fontSize:14, color:"var(--clay)", marginBottom:20 }}>Sign in to view your orders.</p>
      <button onClick={() => setPage("auth")} style={{ background:"var(--bark)", color:"var(--cream)", border:"none", padding:"11px 24px", fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>Sign In</button>
    </div>
  );
  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"44px 20px" }} className="fade-in">
      <h2 style={{ fontSize:38, fontWeight:300, marginBottom:36, color:"var(--ink)" }}>Your Orders</h2>
      {orders.length === 0 ? (
        <div style={{ textAlign:"center", padding:"50px 0", color:"var(--sand)" }}>
          <p style={{ fontSize:13 }}>No orders yet.</p>
          <button onClick={() => setPage("shop")} style={{ marginTop:18, background:"none", border:"1px solid var(--sand)", color:"var(--clay)", padding:"9px 20px", fontSize:10, letterSpacing:2, textTransform:"uppercase" }}>Start Shopping</button>
        </div>
      ) : orders.map(order => (
        <div key={order.id} style={{ background:"var(--white)", padding:24, marginBottom:14, borderRadius:2, boxShadow:"0 2px 12px rgba(74,55,40,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div>
              <p style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"var(--sand)", marginBottom:3 }}>Order #{order.id}</p>
              <p style={{ fontSize:12, color:"var(--clay)" }}>{order.date}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <span style={{ background:"var(--sage)", color:"#fff", fontSize:9, letterSpacing:1.5, textTransform:"uppercase", padding:"3px 10px", borderRadius:2 }}>Paid</span>
              <p style={{ fontSize:18, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--bark)", marginTop:4 }}>${order.total.toFixed(2)}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {order.items.map((item,i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center" }}>
                <img src={item.image} alt={item.name} style={{ width:46, height:46, objectFit:"cover", borderRadius:2 }} />
                <div><p style={{ fontSize:12, color:"var(--ink)" }}>{item.name}</p><p style={{ fontSize:11, color:"var(--clay)" }}>×{item.qty}</p></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── About ──────────────────────────────────────────────────────────────────────────────────────
const AboutPage = () => (
  <div style={{ maxWidth:720, margin:"70px auto", padding:"0 20px" }} className="fade-in">
    <p style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"var(--clay)", marginBottom:14 }}>Our Story</p>
    <h2 style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:300, lineHeight:1.05, color:"var(--ink)", marginBottom:30 }}>
      We make rooms<br/><em>feel like home.</em>
    </h2>
    {["Terra Goods was founded on a simple belief: your home should tell your story through objects that carry real meaning.", "We work directly with a small network of independent artisans across North America and Europe — makers who prioritize material integrity over mass production.", "Every item in our collection is chosen by hand. We visit workshops, test products in our own homes, and only carry pieces we'd genuinely gift to someone we love."].map((t,i) => (
      <p key={i} style={{ fontSize:16, lineHeight:1.85, color:"var(--clay)", fontWeight:300, marginBottom:16 }}>{t}</p>
    ))}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginTop:50 }}>
      {[["300+","Artisan Partners"],["12","Countries"],["50k+","Happy Homes"]].map(([n,l]) => (
        <div key={l} style={{ textAlign:"center", padding:"24px 16px", background:"var(--warm)" }}>
          <p style={{ fontSize:36, fontFamily:"Cormorant Garamond", fontWeight:600, color:"var(--bark)", marginBottom:5 }}>{n}</p>
          <p style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"var(--clay)" }}>{l}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Footer ─────────────────────────────────────────────────────────────────────────────────────
const Footer = ({ setPage }) => (
  <footer style={{ background:"var(--bark)", padding:"44px 20px 28px" }}>
    <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:50 }}>
      <div>
        <div style={{ display:"flex", alignItems:"baseline", gap:5, marginBottom:12 }}>
          <span style={{ fontFamily:"Cormorant Garamond", fontSize:22, fontWeight:600, color:"var(--cream)" }}>Terra</span>
          <span style={{ fontSize:9, letterSpacing:3, color:"var(--sand)", textTransform:"uppercase" }}>goods</span>
        </div>
        <p style={{ fontSize:12, lineHeight:1.8, color:"var(--sand)", maxWidth:260, fontWeight:300 }}>Slow, beautiful goods for homes with character.</p>
      </div>
      <div>
        <p style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"var(--sand)", marginBottom:14 }}>Navigate</p>
        {["shop","about","orders"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ display:"block", background:"none", border:"none", color:"var(--warm)", fontSize:12, marginBottom:9, textTransform:"capitalize", cursor:"pointer" }}>{p}</button>
        ))}
      </div>
      <div>
        <p style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"var(--sand)", marginBottom:14 }}>Contact</p>
        <p style={{ fontSize:12, color:"var(--warm)", marginBottom:7 }}>hello@terragoods.co</p>
        <p style={{ fontSize:12, color:"var(--warm)" }}>Free shipping over $75</p>
      </div>
    </div>
    <div style={{ maxWidth:1200, margin:"28px auto 0", paddingTop:20, borderTop:"1px solid rgba(201,185,154,0.2)", display:"flex", justifyContent:"space-between" }}>
      <p style={{ fontSize:10, color:"var(--sand)" }}>© 2026 Terra Goods. All rights reserved.</p>
      <p style={{ fontSize:10, color:"var(--sand)" }}>Flask + React + Payments</p>
    </div>
  </footer>
);

// ── App ────────────────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toasts, setToasts] = useState([]);

  const toast = (msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  };

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id===product.id ? {...i, qty: Math.min(i.qty+1, product.stock)} : i);
      return [...c, { ...product, qty:1 }];
    });
    toast(`${product.name} added to cart`);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) setCart(c => c.filter(i => i.id !== id));
    else setCart(c => c.map(i => i.id===id ? {...i, qty} : i));
  };

  const handleCheckout = (total) => {
    setPage("payment");
  };

  const handlePaymentSuccess = (paymentData) => {
    const order = { 
      id: Math.random().toString(36).substr(2,6).toUpperCase(), 
      items:[...cart], 
      total: cart.reduce((s,i)=>s+i.price*i.qty,0),
      date: new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),
      paymentMethod: paymentData.method,
      cardLast4: paymentData.cardLast4,
      shipping: paymentData.shipping
    };
    setOrders(o => [order, ...o]);
    setCart([]);
    toast(`Payment successful! Order #${order.id}`, "success");
    setPage("orders");
  };

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);

  const renderPage = () => {
    if (page==="product" && selectedProduct) return <ProductDetail product={selectedProduct} onAdd={addToCart} onBack={() => setPage("shop")} />;
    if (page==="shop") return <ShopPage onAdd={addToCart} onView={p => { setSelectedProduct(p); setPage("product"); }} />;
    if (page==="cart") return <CartPage cart={cart} updateQty={updateQty} removeItem={id => setCart(c=>c.filter(i=>i.id!==id))} setPage={setPage} onCheckout={handleCheckout} />;
    if (page==="payment") return <PaymentPage cart={cart} total={cartTotal} onPaymentSuccess={handlePaymentSuccess} onCancel={() => setPage("cart")} />;
    if (page==="auth") return <AuthPage onAuth={u => { setUser(u); toast(`Welcome, ${u.name}!`); setPage("shop"); }} />;
    if (page==="orders") return <OrdersPage orders={orders} user={user} setPage={setPage} />;
    if (page==="about") return <AboutPage />;
    return (
      <>
        <Hero setPage={setPage} />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"70px 20px 50px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:30 }}>
            <div>
              <p style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"var(--clay)", marginBottom:6 }}>Featured</p>
              <h2 style={{ fontSize:36, fontWeight:300, color:"var(--ink)" }}>New Arrivals</h2>
            </div>
            <button onClick={() => setPage("shop")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"var(--clay)", fontSize:10, letterSpacing:2, textTransform:"uppercase" }}>
              View All <Icon d={I.arrow} size={13} />
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:18 }}>
            {MOCK_PRODUCTS.slice(0,4).map((p,i) => (
              <div key={p.id} className="fade-in" style={{ animationDelay:`${i*0.08}s` }}>
                <ProductCard product={p} onAdd={addToCart} onView={prod => { setSelectedProduct(prod); setPage("product"); }} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <Store.Provider value={{}}>
      <GlobalStyle />
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <Navbar page={page} setPage={setPage} cartCount={cartCount} user={user} onLogout={() => { setUser(null); toast("Signed out"); }} />
        <main style={{ flex:1 }}>{renderPage()}</main>
        <Footer setPage={setPage} />
      </div>
      <ToastBar toasts={toasts} />
    </Store.Provider>
  );
}
