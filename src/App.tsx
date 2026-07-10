import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2, Utensils, Facebook, MapPin, Loader2, Gift, Star, Copy, Check, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, submitSheetData, SheetDish, SheetCategory, SHEET_ID } from './services/googleSheets';
import { DEFAULT_MENU_DATA } from './data/menuData';

// ==========================================
// 📋 CONFIGURACIÓN DE LA PLANTILLA DEL MENÚ
// ==========================================
const RESTAURANTE_NAME = "Retablo's cafe";
const RESTAURANTE_SLOGAN = "El hogar del café";
const WHATSAPP_NUMBER = "51995814354"; // Reemplaza con tu número de WhatsApp con código de país (ej: 51 para Perú)
const FACEBOOK_URL = "";
const MAPS_URL = "https://maps.app.goo.gl/6BTrTRa9B8A1o4GC9";
const LOGO_FOOTER_PATH = "/logo.png"; // Reemplaza con la ruta de tu logo en public/ (ej: /logo.png)
const BANNER_PATH = "/banner.png"; // Reemplaza con la ruta de tu banner en public/ (ej: /banner.png)
const MARQUEE_TEXT = "☕ EL HOGAR DEL CAFÉ • PASIÓN EN CADA TAZA • CAFÉ DE ESPECIALIDAD PERUANO 🥐 ";
// ==========================================

// Mapa de imágenes locales por defecto para platos conocidos (vacío por defecto para la plantilla)
const LOCAL_IMAGES: Record<string, string> = {
  "Americano": "/americano.png",
  "Capuccino": "/capuccino.png",
  "C. de Canela": "/c_de_canela.png",
  "Espresso": "/espresso.png",
};

interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

interface CartItem {
  nombre: string;
  precio: string;
  cantidad: number;
  temperatura?: string;
  azucar?: string;
  saborAlitas?: string;
  sabor?: string;
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Customization States
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);
  const [customOptions, setCustomOptions] = useState({
    temperatura: 'Helada',
    azucar: 'Normal',
    saborAlitas: 'Barbecue',
    sabor: ''
  });

  // States for Birthday Form
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [isSubmittingBirthday, setIsSubmittingBirthday] = useState(false);
  const [birthdaySuccess, setBirthdaySuccess] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    distrito: '',
    correo: ''
  });

  // States for Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({
    estrellasMozo: 0,
    estrellasComida: 0,
    comentario: ''
  });

  // States for Checkout Form
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [copiedYape, setCopiedYape] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    nombre: '',
    metodoEntrega: 'delivery', // 'delivery' | 'retiro'
    direccion: '',
    coordenadasUrl: '',
    horaRecojo: '',
    metodoPago: 'efectivo' // 'efectivo' | 'tarjeta' | 'yape_plin'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!SHEET_ID) {
          setCategories(DEFAULT_MENU_DATA);
          if (DEFAULT_MENU_DATA.length > 0) {
            setActiveCategory(DEFAULT_MENU_DATA[0].id);
          }
          return;
        }

        const [cats, dishes] = await Promise.all([
          fetchSheetData<SheetCategory>('Categorías'),
          fetchSheetData<SheetDish>('Platos')
        ]);

        if (cats.length === 0 && dishes.length === 0) {
          setCategories(DEFAULT_MENU_DATA);
          if (DEFAULT_MENU_DATA.length > 0) {
            setActiveCategory(DEFAULT_MENU_DATA[0].id);
          }
          return;
        }

        const formattedCategories: Category[] = cats.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: dishes
            .filter(d => d.categoría === c.nombre)
            .map(d => ({
              nombre: d['nombre del plato'],
              descripcion: d.descripción,
              precio: d.precio,
              imagen: LOCAL_IMAGES[d['nombre del plato']] || d['URL de imagen'] || null
            }))
        }));

        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setActiveCategory(formattedCategories[0].id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setCategories(DEFAULT_MENU_DATA);
        if (DEFAULT_MENU_DATA.length > 0) {
          setActiveCategory(DEFAULT_MENU_DATA[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.cantidad, 0), [cart]);

  const addToCart = (dish: Dish) => {
    const isJuice = categories.some(cat => 
      (cat.id === "jugos" || cat.nombre.toLowerCase().includes("jugos")) &&
      cat.items.some(item => item.nombre === dish.nombre)
    );
    const isWings = dish.nombre.toLowerCase().includes("alitas");
    const isColdBrew = dish.nombre.toLowerCase().includes("cold brew");
    const isSoda = dish.nombre.toLowerCase().includes("viejas confiables");
    const isRefreshment = dish.nombre.toLowerCase().includes("refresco de chicha");

    if (isJuice) {
      setCustomizingDish(dish);
      setCustomOptions({
        temperatura: 'Helada',
        azucar: 'Normal',
        saborAlitas: '',
        sabor: ''
      });
      return;
    }

    if (isWings) {
      setCustomizingDish(dish);
      setCustomOptions({
        temperatura: '',
        azucar: '',
        saborAlitas: 'Barbecue',
        sabor: ''
      });
      return;
    }

    if (isColdBrew) {
      setCustomizingDish(dish);
      setCustomOptions({
        temperatura: '',
        azucar: '',
        saborAlitas: '',
        sabor: 'Naranja'
      });
      return;
    }

    if (isSoda) {
      setCustomizingDish(dish);
      setCustomOptions({
        temperatura: '',
        azucar: '',
        saborAlitas: '',
        sabor: 'Inka Cola'
      });
      return;
    }

    if (isRefreshment) {
      setCustomizingDish(dish);
      setCustomOptions({
        temperatura: '',
        azucar: '',
        saborAlitas: '',
        sabor: 'Chicha'
      });
      return;
    }

    addCustomizedToCart(dish, {});
  };

  const addCustomizedToCart = (dish: Dish, options: { temperatura?: string; azucar?: string; saborAlitas?: string; sabor?: string }) => {
    setCart(prev => {
      const existing = prev.find(i => 
        i.nombre === dish.nombre && 
        i.precio === dish.precio &&
        i.temperatura === options.temperatura &&
        i.azucar === options.azucar &&
        i.saborAlitas === options.saborAlitas &&
        i.sabor === options.sabor
      );
      if (existing) {
        return prev.map(i =>
          (i.nombre === dish.nombre && 
           i.precio === dish.precio &&
           i.temperatura === options.temperatura &&
           i.azucar === options.azucar &&
           i.saborAlitas === options.saborAlitas &&
           i.sabor === options.sabor)
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { 
        nombre: dish.nombre, 
        precio: dish.precio, 
        cantidad: 1,
        temperatura: options.temperatura || undefined,
        azucar: options.azucar || undefined,
        saborAlitas: options.saborAlitas || undefined,
        sabor: options.sabor || undefined
      }];
    });
  };

  const updateQuantity = (
    nombre: string, 
    precio: string, 
    delta: number, 
    options?: { temperatura?: string; azucar?: string; saborAlitas?: string; sabor?: string }
  ) => {
    setCart(prev =>
      prev
        .map(i => {
          const matchesOptions = !options || (
            i.temperatura === options.temperatura &&
            i.azucar === options.azucar &&
            i.saborAlitas === options.saborAlitas &&
            i.sabor === options.sabor
          );
          if (i.nombre === nombre && i.precio === precio && matchesOptions) {
            const newQty = i.cantidad + delta;
            return newQty > 0 ? { ...i, cantidad: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const cleanPrice = item.precio.replace(/^[^\d]*/, '');
      const num = parseFloat(cleanPrice) || 0;
      return acc + num * item.cantidad;
    }, 0);
  };

  const sendToWhatsApp = () => {
    const total = calculateTotal();
    let message = `*Hola ${RESTAURANTE_NAME}, deseo realizar un pedido:*\n\n`;
    cart.forEach(item => {
      let opts = [];
      if (item.temperatura) opts.push(`Temp: ${item.temperatura}`);
      if (item.azucar) opts.push(`Azúcar: ${item.azucar}`);
      if (item.saborAlitas) opts.push(`Sabor: ${item.saborAlitas}`);
      if (item.sabor) opts.push(`Sabor: ${item.sabor}`);
      
      const optString = opts.length > 0 ? ` [${opts.join(', ')}]` : '';
      message += `• ${item.cantidad} x ${item.nombre}${optString} (${item.precio})\n`;
    });
    message += `\n*TOTAL: S/.${total.toFixed(2)}*`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getAvailableTimes = () => {
    const times: { label: string; value: string }[] = [];
    const now = new Date();
    
    const generateForDate = (date: Date, isToday: boolean) => {
      const slots: { label: string; value: string }[] = [];
      const currentHour = date.getHours();
      const currentMinute = date.getMinutes();
      
      for (let hour = 8; hour <= 23; hour++) {
        for (let minute of [0, 30]) {
          if (hour === 23 && minute === 30) continue;
          
          if (!isToday || hour > currentHour || (hour === currentHour && minute > currentMinute + 15)) {
            const hh = hour.toString().padStart(2, '0');
            const mm = minute.toString().padStart(2, '0');
            const timeStr = `${hh}:${mm}`;
            slots.push({
              label: `${isToday ? 'Hoy' : 'Mañana'} a las ${timeStr}`,
              value: `${isToday ? 'Hoy' : 'Mañana'} - ${timeStr}`
            });
          }
        }
      }
      return slots;
    };

    const todaySlots = generateForDate(now, true);
    times.push(...todaySlots);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowSlots = generateForDate(tomorrow, false);
    times.push(...tomorrowSlots.slice(0, 12));

    return times;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.");
      return;
    }
    
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setCheckoutData(prev => ({ ...prev, coordenadasUrl: mapsUrl }));
        setGettingLocation(false);
      },
      (error) => {
        console.error(error);
        setGettingLocation(false);
        let errorMsg = "No pudimos obtener tu ubicación.";
        if (error.code === 1) {
          errorMsg = "Por favor, concede permisos de ubicación en tu navegador para obtener tu posición.";
        } else if (error.code === 2) {
          errorMsg = "Ubicación no disponible. Asegúrate de activar el GPS en tu dispositivo.";
        } else if (error.code === 3) {
          errorMsg = "La solicitud de ubicación expiró.";
        }
        alert(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const copyYapeNumber = () => {
    navigator.clipboard.writeText("995814354");
    setCopiedYape(true);
    setTimeout(() => setCopiedYape(false), 2000);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    
    let message = `*Hola ${RESTAURANTE_NAME}, deseo realizar un pedido:*\n\n`;
    message += `👤 *Cliente:* ${checkoutData.nombre}\n`;
    message += `🚚 *Método de entrega:* ${checkoutData.metodoEntrega === 'delivery' ? 'Envío a domicilio' : 'Retiro en tienda'}\n`;
    
    if (checkoutData.metodoEntrega === 'delivery') {
      message += `🏠 *Dirección:* ${checkoutData.direccion}\n`;
      if (checkoutData.coordenadasUrl) {
        message += `🗺️ *Ubicación GPS:* ${checkoutData.coordenadasUrl}\n`;
      }
    } else {
      message += `⏰ *Hora estimada de recojo:* ${checkoutData.horaRecojo}\n`;
    }
    
    const paymentLabels: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta de Crédito/Débito',
      yape_plin: 'Yape / Plin (Titular: Luis Hostos)'
    };
    message += `💳 *Método de pago:* ${paymentLabels[checkoutData.metodoPago] || checkoutData.metodoPago}\n\n`;
    
    message += `*📋 Detalle del Pedido:*\n`;
    cart.forEach(item => {
      let opts = [];
      if (item.temperatura) opts.push(`Temp: ${item.temperatura}`);
      if (item.azucar) opts.push(`Azúcar: ${item.azucar}`);
      if (item.saborAlitas) opts.push(`Sabor: ${item.saborAlitas}`);
      if (item.sabor) opts.push(`Sabor: ${item.sabor}`);
      
      const optString = opts.length > 0 ? ` [${opts.join(', ')}]` : '';
      message += `• ${item.cantidad} x ${item.nombre}${optString} (${item.precio})\n`;
    });
    message += `\n*TOTAL: S/.${total.toFixed(2)}*`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    setShowCheckoutForm(false);
    setCart([]);
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBirthdaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBirthday(true);
    const success = await submitSheetData('Cumpleaños', {
      timestamp: new Date().toLocaleString('es-PE'),
      nombre: birthdayData.nombre,
      telefono: birthdayData.telefono,
      fechaNacimiento: birthdayData.fechaNacimiento,
      distrito: birthdayData.distrito,
      correo: birthdayData.correo || 'No indicado'
    });
    
    setIsSubmittingBirthday(false);
    if (success) {
      setBirthdaySuccess(true);
      setTimeout(() => {
        setShowBirthdayForm(false);
        setBirthdaySuccess(false);
        setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: '', correo: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.estrellasMozo === 0 || reviewData.estrellasComida === 0) {
      alert("Por favor califica ambas opciones con estrellas.");
      return;
    }

    setIsSubmittingReview(true);
    const success = await submitSheetData('Reseñas', {
      timestamp: new Date().toLocaleString('es-PE'),
      estrellasMozo: reviewData.estrellasMozo,
      estrellasComida: reviewData.estrellasComida,
      comentario: reviewData.comentario || 'Sin comentarios'
    });
    
    setIsSubmittingReview(false);
    if (success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
        setReviewData({ estrellasMozo: 0, estrellasComida: 0, comentario: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-slogan text-primary font-bold tracking-widest uppercase text-xs">Cargando delicias...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-[#FAF8F5] via-[#f7f2ea] to-[#FAF8F5] min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Liquid Glass Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -left-[20%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-[#6F4E37]/25 to-[#D4A373]/20 blur-[60px] animate-blob-1" />
        <div className="absolute top-[45%] -right-[20%] w-[280px] h-[280px] rounded-full bg-gradient-to-br from-[#D4A373]/30 to-[#f59e0b]/20 blur-[70px] animate-blob-2" />
        <div className="absolute bottom-[15%] -left-[10%] w-[240px] h-[240px] rounded-full bg-gradient-to-br from-[#6F4E37]/20 to-[#D4A373]/30 blur-[65px] animate-blob-3" />
      </div>

      <header className="sticky top-0 bg-white/45 backdrop-blur-xl z-50 px-5 py-3 flex justify-between items-center border-b border-white/40 relative">
        <div className="flex items-center">
          <img src="/logo.png" alt={RESTAURANTE_NAME} className="h-14 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2">
          {FACEBOOK_URL && (
            <motion.a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#6F4E37] shadow-sm hover:bg-white/60 transition-all cursor-pointer"
            >
              <Facebook size={22} />
            </motion.a>
          )}
          {MAPS_URL && (
            <motion.a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#6F4E37] shadow-sm hover:bg-white/60 transition-all cursor-pointer"
            >
              <MapPin size={22} />
            </motion.a>
          )}
          <motion.div
            onClick={() => cartCount > 0 && setShowSummary(true)}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center relative cursor-pointer text-[#6F4E37] shadow-sm hover:bg-white/60 transition-all"
          >
            <ShoppingBag size={22} className="text-[#6F4E37]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#6F4E37] text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_10px_rgba(111,78,55,0.3)]">
                {cartCount}
              </span>
            )}
          </motion.div>
        </div>
      </header>

      <div className="w-[calc(100%-2.5rem)] mx-auto mt-3 bg-[#6F4E37]/80 backdrop-blur-md py-2.5 px-4 rounded-full overflow-hidden flex items-center border border-white/20 shadow-md relative z-10">
        <div className="animate-marquee flex gap-6 text-white font-slogan font-bold text-[10px] tracking-widest uppercase whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i}>{MARQUEE_TEXT}</span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 relative z-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: ["0px 0px 0px 0px rgba(212,163,115,0.6)", "0px 0px 20px 8px rgba(212,163,115,0)", "0px 0px 0px 0px rgba(212,163,115,0)"] 
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => setShowBirthdayForm(true)}
          className="w-full bg-gradient-to-r from-[#D4A373]/80 via-amber-500/80 to-[#D4A373]/80 backdrop-blur-md text-white py-3 px-4 rounded-[1.8rem] flex items-center justify-center gap-2 font-bold text-[10px] sm:text-[11px] uppercase tracking-wide border border-white/40 relative overflow-hidden group text-center"
        >
          <div className="absolute inset-0 shimmer opacity-30 mix-blend-overlay"></div>
          <Gift size={18} className="animate-bounce shrink-0" />
          <span>¡Celebra tu día en el hogar del café y recibe un dulce regalo cortesía de la casa! 🍰☕ <span className="text-yellow-100 font-black underline">Regístrate aquí</span></span>
        </motion.button>
      </div>

      <div className="px-5 pt-4 pb-3 relative z-10">
        <div className="relative w-full rounded-[2.2rem] overflow-hidden shadow-lg aspect-[2/1] border border-white/50 bg-white/20 backdrop-blur-md flex items-center justify-center">
          {BANNER_PATH ? (
            <img src={BANNER_PATH} alt={RESTAURANTE_NAME} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#D4A373]/20 via-[#6F4E37]/10 to-white/40 flex flex-col items-center justify-center text-center p-6">
              <img src="/logo.png" alt={RESTAURANTE_NAME} className="h-20 w-auto object-contain z-10 animate-fade-in" />
              <p className="font-title text-[#6F4E37] text-xs tracking-widest uppercase mt-3 z-10 font-bold opacity-80">{RESTAURANTE_SLOGAN}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 overflow-x-auto no-scrollbar relative z-10">
        <div className="flex gap-2 w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`px-4.5 py-2.5 rounded-full text-[11px] font-category font-semibold whitespace-nowrap transition-all duration-300 border backdrop-blur-md
                ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#6F4E37] to-[#D4A373] text-white border-white/20 shadow-md shadow-[#6F4E37]/20'
                  : 'bg-white/40 text-[#2C1E16] border-white/50 hover:border-[#6F4E37]/40 hover:text-[#6F4E37]'
                }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 px-5 relative z-10">
        {categories.map(cat => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-28">
            <div className="mb-5 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="text-primary wave-icon" size={22} />
                <h3 className="font-category font-semibold text-primary text-[26px] leading-none tracking-wide category-underline">
                  {cat.nombre}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {cat.items.map((dish, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="liquid-glass rounded-[2rem] overflow-hidden flex flex-col border border-white/50 shadow-md hover:shadow-lg hover:border-white/80 transition-all duration-300 relative z-10"
                >
                  <div className="bg-primary/5 aspect-square flex items-center justify-center relative overflow-hidden p-2.5 border-b border-white/30">
                    {dish.imagen ? (
                      <img src={dish.imagen} alt={dish.nombre} className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-110" />
                    ) : (
                      <span className="font-dish font-bold text-[10px] text-primary uppercase tracking-wider text-center px-2">
                        Retablo's Cafe
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-dish font-bold text-dark text-[13px] leading-tight mb-1">
                      {dish.nombre}
                    </h4>
                    {dish.descripcion && (
                      <p className="text-[10px] text-gray-400 leading-tight mb-2 line-clamp-3">
                        {dish.descripcion}
                      </p>
                    )}
                    <div className="flex-1"></div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-dish font-bold text-primary text-[16px] whitespace-nowrap">
                        {dish.precio}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => addToCart(dish)}
                        className="w-8 h-8 bg-white/60 border border-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-primary hover:bg-[#6F4E37] hover:text-white transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-8 mb-4 border border-white/50 liquid-glass rounded-[2.2rem] p-6 text-center shadow-md relative z-10">
          <h3 className="font-title text-primary text-[22px] leading-tight mb-2">¿Cómo estuvo todo?</h3>
          <p className="text-[11px] text-gray-500 mb-4 px-4">Ayúdanos a mejorar calificando tu experiencia con nosotros</p>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 mx-auto w-full cursor-pointer hover:opacity-95 transition-opacity"
          >
            <Star size={18} className="fill-white" />
            Reseña nuestra comida
          </motion.button>
        </section>

        <footer className="mt-8 pt-8 pb-10 border-t border-white/30 flex flex-col items-center justify-center text-center relative z-10">
          <img src="/logo.png" alt={RESTAURANTE_NAME} className="h-16 w-auto object-contain mb-4" />
          <p className="font-slogan text-xs text-secondary font-bold tracking-wider uppercase mb-2">{RESTAURANTE_SLOGAN}</p>
          <p className="text-[11px] text-gray-400 font-medium">© 2026 Todos los derechos reservados.</p>
        </footer>

        <div className="bg-transparent py-6 flex flex-col items-center justify-center relative z-10 border-t border-white/20">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1.5 opacity-40 text-dark/60">Digital Menu Experience</p>
          <motion.a 
            href="https://tymasolutions.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold text-sm tracking-tight group cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-dark group-hover:text-primary transition-colors duration-200">Hecho por Tyma</span>
            <span className="text-secondary group-hover:text-primary transition-colors duration-200">Solutions</span>
          </motion.a>
        </div>
      </main>

      <AnimatePresence>
        {cartCount > 0 && !showSummary && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 w-full max-w-md p-5 z-40"
          >
            <div className="liquid-glass rounded-[2.2rem] p-4 flex items-center justify-between border border-white/60 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="shimmer absolute inset-0 opacity-20"></div>
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tu Pedido</p>
                  <p className="font-bold text-dark text-lg">{cartCount} Artículos</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(true)}
                className="bg-primary text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/30 font-bold text-sm cursor-pointer hover:opacity-95 transition-opacity"
              >
                Ver Pedido
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 lg:p-0"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-6 max-h-[85vh] overflow-y-auto relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title text-2xl text-primary">Mi Pedido</h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 mb-8">
                {cart.map(item => (
                  <div
                    key={`${item.nombre}-${item.precio}-${item.temperatura || ''}-${item.azucar || ''}-${item.saborAlitas || ''}-${item.sabor || ''}`}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-dish font-semibold text-dark text-sm truncate">{item.nombre}</h4>
                      {(item.temperatura || item.azucar || item.saborAlitas || item.sabor) && (
                        <div className="text-[10px] text-[#6F4E37] font-semibold space-y-0.5 mt-0.5">
                          {item.temperatura && <div>🌡️ {item.temperatura}</div>}
                          {item.azucar && <div>🍬 {item.azucar}</div>}
                          {item.saborAlitas && <div>🍗 Sabor: {item.saborAlitas}</div>}
                          {item.sabor && <div>✨ Sabor: {item.sabor}</div>}
                        </div>
                      )}
                      <p className="font-dish text-xs text-primary font-bold mt-1">{item.precio}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.nombre, item.precio, -1, { temperatura: item.temperatura, azucar: item.azucar, saborAlitas: item.saborAlitas, sabor: item.sabor })} className="text-gray-400 cursor-pointer">
                        <Minus size={16} />
                      </button>
                      <span className="font-dish font-bold text-sm w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.nombre, item.precio, 1, { temperatura: item.temperatura, azucar: item.azucar, saborAlitas: item.saborAlitas, sabor: item.sabor })} className="text-primary cursor-pointer">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.nombre, item.precio, -item.cantidad, { temperatura: item.temperatura, azucar: item.azucar, saborAlitas: item.saborAlitas, sabor: item.sabor })}
                      className="text-red-300 ml-1 cursor-pointer hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-dish text-xl font-bold text-dark">Total a pagar</h3>
                  <h3 className="font-dish text-xl font-bold text-primary">S/.{calculateTotal().toFixed(2)}</h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSummary(false);
                  setShowCheckoutForm(true);
                }}
                className="w-full bg-primary hover:opacity-95 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all font-bold cursor-pointer"
              >
                Continuar con el Pedido
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Plato ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBirthdayForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="liquid-glass w-full max-w-sm rounded-[2.5rem] p-7 border border-white/50 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowBirthdayForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
              >
                <X size={16} className="text-[#6F4E37]" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <Gift size={24} className="text-secondary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Tu Cumpleaños!</h2>
                <p className="text-xs font-semibold text-[#2C1E16]/85">Déjanos tus datos para enviarte una sorpresa en tu día especial.</p>
              </div>

              {birthdaySuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 backdrop-blur-sm text-green-700 p-4 rounded-2xl text-center text-sm font-bold">
                  ¡Gracias! Tus datos han sido guardados.
                </div>
              ) : (
                <form onSubmit={handleBirthdaySubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Nombre Completo</label>
                    <input required type="text" value={birthdayData.nombre} onChange={e => setBirthdayData({...birthdayData, nombre: e.target.value})} className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Teléfono</label>
                    <input required type="tel" minLength={9} maxLength={11} pattern="[0-9]*" value={birthdayData.telefono} onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setBirthdayData({...birthdayData, telefono: val});
                    }} className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all" placeholder="Ej. 987654321" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Fecha de Nacimiento</label>
                    <input required type="date" value={birthdayData.fechaNacimiento} onChange={e => setBirthdayData({...birthdayData, fechaNacimiento: e.target.value})} className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-gray-700" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Distrito</label>
                    <input required type="text" value={birthdayData.distrito} onChange={e => setBirthdayData({...birthdayData, distrito: e.target.value})} className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all" placeholder="Ej. Miraflores" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Correo Electrónico (Opcional)</label>
                    <input type="email" value={birthdayData.correo} onChange={e => setBirthdayData({...birthdayData, correo: e.target.value})} className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all" placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <button disabled={isSubmittingBirthday} type="submit" className="w-full bg-[#6F4E37] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#6F4E37]/20 mt-2 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                    {isSubmittingBirthday ? <Loader2 size={18} className="animate-spin" /> : "Guardar mis datos"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="liquid-glass w-full max-w-sm rounded-[2.5rem] p-7 border border-white/50 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
              >
                <X size={16} className="text-[#6F4E37]" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <Star size={24} className="text-primary fill-primary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Calificanos!</h2>
                <p className="text-xs font-semibold text-[#2C1E16]/85">Tu opinión es muy importante para nosotros.</p>
              </div>

              {reviewSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 backdrop-blur-sm text-green-700 p-4 rounded-2xl text-center text-sm font-bold">
                  ¡Gracias por tu reseña! Nos ayuda a mejorar.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  
                  <div className="bg-white/30 border border-white/30 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center">
                    <p className="text-xs font-bold text-[#6F4E37] mb-2">Atención del Mozo</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasMozo: star})}
                          className="p-1 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star size={28} className={reviewData.estrellasMozo >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/30 border border-white/30 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center">
                    <p className="text-xs font-bold text-[#6F4E37] mb-2">Calidad de la Comida</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasComida: star})}
                          className="p-1 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star size={28} className={reviewData.estrellasComida >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Comentario (Opcional)</label>
                    <textarea 
                      rows={3} 
                      value={reviewData.comentario} 
                      onChange={e => setReviewData({...reviewData, comentario: e.target.value})} 
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none mt-1" 
                      placeholder="Cuéntanos más sobre tu experiencia..." 
                    />
                  </div>
                  
                  <button disabled={isSubmittingReview} type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 mt-2 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                    {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : "Enviar Reseña"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckoutForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="liquid-glass w-full max-w-sm rounded-[2.5rem] p-7 border border-white/50 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowCheckoutForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
              >
                <X size={16} className="text-[#6F4E37]" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag size={24} className="text-secondary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-1">Finalizar Pedido</h2>
                <p className="text-xs font-semibold text-[#2C1E16]/85">Completa los detalles de tu entrega y pago.</p>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Tu Nombre</label>
                  <input
                    required
                    type="text"
                    value={checkoutData.nombre}
                    onChange={e => setCheckoutData({...checkoutData, nombre: e.target.value})}
                    className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    placeholder="Ej. Luis Pérez"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1 mb-1 block">Método de Entrega</label>
                  <div className="grid grid-cols-2 gap-2 bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-white/40">
                    <button
                      type="button"
                      onClick={() => setCheckoutData({...checkoutData, metodoEntrega: 'delivery'})}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        checkoutData.metodoEntrega === 'delivery'
                          ? 'bg-[#6F4E37] text-white shadow-sm'
                          : 'text-[#2C1E16] hover:bg-white/20'
                      }`}
                    >
                      Envío a domicilio
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutData({...checkoutData, metodoEntrega: 'retiro'})}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        checkoutData.metodoEntrega === 'retiro'
                          ? 'bg-[#6F4E37] text-white shadow-sm'
                          : 'text-[#2C1E16] hover:bg-white/20'
                      }`}
                    >
                      Retiro en tienda
                    </button>
                  </div>
                </div>

                {checkoutData.metodoEntrega === 'delivery' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Dirección de Envío</label>
                      <input
                        required={checkoutData.metodoEntrega === 'delivery'}
                        type="text"
                        value={checkoutData.direccion}
                        onChange={e => setCheckoutData({...checkoutData, direccion: e.target.value})}
                        className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                        placeholder="Dirección, departamento o referencia"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1 mb-1 block">Ubicación GPS (Google Maps)</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={gettingLocation}
                          className="flex-1 bg-white/40 border border-white/50 backdrop-blur-md hover:bg-white/60 text-[#6F4E37] py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {gettingLocation ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Navigation size={14} />
                          )}
                          {checkoutData.coordenadasUrl ? "Ubicación obtenida" : "Obtener ubicación actual"}
                        </button>
                        {checkoutData.coordenadasUrl && (
                          <div className="w-9 h-9 bg-green-500/10 border border-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                            <Check size={18} />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-[#2C1E16]/70 mt-1 ml-1">Permite precisar tu ubicación para el repartidor.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1">Hora Estimada de Recojo</label>
                    <select
                      required={checkoutData.metodoEntrega === 'retiro'}
                      value={checkoutData.horaRecojo}
                      onChange={e => setCheckoutData({...checkoutData, horaRecojo: e.target.value})}
                      className="w-full liquid-glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all cursor-pointer block bg-[#FAF8F5]/90"
                    >
                      <option value="">Selecciona una hora</option>
                      {getAvailableTimes().map(slot => (
                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1 mb-1 block">Método de Pago</label>
                  <div className="grid grid-cols-3 gap-1 bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-white/40">
                    <button
                      type="button"
                      onClick={() => setCheckoutData({...checkoutData, metodoPago: 'efectivo'})}
                      className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                        checkoutData.metodoPago === 'efectivo'
                          ? 'bg-[#6F4E37] text-white shadow-sm'
                          : 'text-[#2C1E16] hover:bg-white/20'
                      }`}
                    >
                      Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutData({...checkoutData, metodoPago: 'tarjeta'})}
                      className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                        checkoutData.metodoPago === 'tarjeta'
                          ? 'bg-[#6F4E37] text-white shadow-sm'
                          : 'text-[#2C1E16] hover:bg-white/20'
                      }`}
                    >
                      Tarjeta
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutData({...checkoutData, metodoPago: 'yape_plin'})}
                      className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                        checkoutData.metodoPago === 'yape_plin'
                          ? 'bg-[#6F4E37] text-white shadow-sm'
                          : 'text-[#2C1E16] hover:bg-white/20'
                      }`}
                    >
                      Yape / Plin
                    </button>
                  </div>
                </div>

                {checkoutData.metodoPago === 'yape_plin' && (
                  <div className="bg-[#2C1E16]/90 border border-white/10 backdrop-blur-sm p-4 rounded-2xl text-white shadow-lg space-y-2 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Pago Yape/Plin</p>
                      <button
                        type="button"
                        onClick={copyYapeNumber}
                        className="text-[10px] bg-white/10 border border-white/20 hover:bg-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedYape ? (
                          <>
                            <Check size={11} className="text-green-400" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copiar número</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <p className="text-[15px] font-bold tracking-wider">995 814 354</p>
                      <p className="text-xs text-white/70">A nombre de: <span className="font-bold text-white">Luis Hostos</span></p>
                    </div>
                    <p className="text-[9px] text-white/40 italic">Por favor realiza el yapeo y copia el número de operación para reportarlo.</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#25D366]/90 border border-white/30 backdrop-blur-sm text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-green-500/10 hover:bg-[#25D366] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <ShoppingBag size={18} />
                  Enviar Pedido a WhatsApp
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {customizingDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="liquid-glass w-full max-w-sm rounded-[2.5rem] p-7 border border-white/50 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setCustomizingDish(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer"
              >
                <X size={16} className="text-[#6F4E37]" />
              </button>

              <div className="flex flex-col items-center text-center mb-6 mt-2">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <Utensils size={24} className="text-secondary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-1">Personalizar</h2>
                <p className="text-sm font-bold text-[#6F4E37]">{customizingDish.nombre}</p>
                <p className="text-xs text-gray-500 mt-1">{customizingDish.precio}</p>
              </div>

              <div className="space-y-5">
                {/* Temperature Customization (Only for juices) */}
                {customOptions.temperatura !== '' && (
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1 mb-2 block">Temperatura</label>
                    <div className="grid grid-cols-2 gap-2 bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-white/40">
                      {['Helada', 'Al tiempo'].map(temp => (
                        <button
                          key={temp}
                          type="button"
                          onClick={() => setCustomOptions(prev => ({ ...prev, temperatura: temp }))}
                          className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            customOptions.temperatura === temp
                              ? 'bg-[#6F4E37] text-white shadow-sm'
                              : 'text-[#2C1E16] hover:bg-white/20'
                          }`}
                        >
                          {temp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sugar Customization (Only for juices) */}
                {customOptions.azucar !== '' && (
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1 mb-2 block">Nivel de Azúcar</label>
                    <div className="grid grid-cols-3 gap-1 bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-white/40">
                      {['Sin azúcar', 'Bajo en azúcar', 'Normal'].map(sug => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setCustomOptions(prev => ({ ...prev, azucar: sug }))}
                          className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                            customOptions.azucar === sug
                              ? 'bg-[#6F4E37] text-white shadow-sm'
                              : 'text-[#2C1E16] hover:bg-white/20'
                          }`}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flavor Customization (Only for Wings) */}
                {customOptions.saborAlitas !== '' && (
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1 mb-2 block">Elige el Sabor</label>
                    <div className="grid grid-cols-2 gap-2 bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-white/40">
                      {[
                        { id: 'Barbecue', label: 'Barbecue' },
                        { id: 'Salsa de maracuyá', label: 'Salsa Maracuyá' },
                        { id: 'Salsa de maracumango', label: 'Maracumango' },
                        { id: 'Salsa de búfalo', label: 'Salsa Búfalo' }
                      ].map(sabor => (
                        <button
                          key={sabor.id}
                          type="button"
                          onClick={() => setCustomOptions(prev => ({ ...prev, saborAlitas: sabor.id }))}
                          className={`py-2.5 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer ${
                            customOptions.saborAlitas === sabor.id
                              ? 'bg-[#6F4E37] text-white shadow-sm'
                              : 'text-[#2C1E16] hover:bg-white/20'
                          }`}
                        >
                          {sabor.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generic Sabor Customization (Cold Brew, Soda, Refreshment) */}
                {customOptions.sabor !== '' && customizingDish && (
                  <div>
                    <label className="text-[11px] font-bold text-[#6F4E37] uppercase ml-1 mb-2 block">
                      Elige tu opción
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-white/40">
                      {customizingDish.nombre.toLowerCase().includes("cold brew") &&
                        ['Naranja', 'Maracuyá'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCustomOptions(prev => ({ ...prev, sabor: s }))}
                            className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              customOptions.sabor === s
                                ? 'bg-[#6F4E37] text-white shadow-sm'
                                : 'text-[#2C1E16] hover:bg-white/20'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      {customizingDish.nombre.toLowerCase().includes("viejas confiables") &&
                        ['Inka Cola', 'Coca Cola'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCustomOptions(prev => ({ ...prev, sabor: s }))}
                            className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              customOptions.sabor === s
                                ? 'bg-[#6F4E37] text-white shadow-sm'
                                : 'text-[#2C1E16] hover:bg-white/20'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      {customizingDish.nombre.toLowerCase().includes("refresco de chicha") &&
                        ['Chicha', 'Maracuyá'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCustomOptions(prev => ({ ...prev, sabor: s }))}
                            className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              customOptions.sabor === s
                                ? 'bg-[#6F4E37] text-white shadow-sm'
                                : 'text-[#2C1E16] hover:bg-white/20'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    addCustomizedToCart(customizingDish, {
                      temperatura: customOptions.temperatura || undefined,
                      azucar: customOptions.azucar || undefined,
                      saborAlitas: customOptions.saborAlitas || undefined,
                      sabor: customOptions.sabor || undefined
                    });
                    setCustomizingDish(null);
                  }}
                  className="w-full bg-[#6F4E37] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#6F4E37]/20 mt-4 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Agregar al Pedido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
