export interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

export interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

export const DEFAULT_MENU_DATA: Category[] = [
  {
    id: "calor-espresso",
    nombre: "Calor espresso",
    items: [
      {
        nombre: "Americano",
        descripcion: "240 ml",
        precio: "S/. 8.00",
        imagen: "/americano.png"
      },
      {
        nombre: "Capuccino",
        descripcion: "150 ml",
        precio: "S/. 10.00",
        imagen: "/capuccino.png"
      },
      {
        nombre: "C. de Canela",
        descripcion: "150 ml",
        precio: "S/. 10.00",
        imagen: "/c_de_canela.png"
      },
      {
        nombre: "Espresso",
        descripcion: "Concentrado con ricos aromas cítricos y cuerpo robusto.",
        precio: "S/. 4.00",
        imagen: "/espresso.png"
      },
      {
        nombre: "Cortado",
        descripcion: "Espresso suavizado con un toque de leche caliente.",
        precio: "S/. 6.50",
        imagen: "/cortado.png"
      },
      {
        nombre: "Latte",
        descripcion: "Espresso con leche vaporizada y un toque de crema espumosa.",
        precio: "S/. 8.00",
        imagen: "/latte.png"
      },
      {
        nombre: "Moccaccino",
        descripcion: "Mezcla de espresso, chocolate y leche cremosa.",
        precio: "S/. 10.00",
        imagen: "/moccaccino.png"
      },
      {
        nombre: "Macciato",
        descripcion: "Espresso con un toque de espuma de leche.",
        precio: "S/. 7.00",
        imagen: "/macciato.png"
      },
      {
        nombre: "Flat white",
        descripcion: "Café suave y cremoso con espresso y leche vaporizada.",
        precio: "S/. 8.00",
        imagen: "/flat_white.png"
      },
      {
        nombre: "Affogato",
        descripcion: "Espresso sobre helado de vainilla.",
        precio: "S/. 10.00",
        imagen: "/affogato.png"
      },
      {
        nombre: "Chocolate",
        descripcion: "Bebida con cacao cremoso y leche caliente.",
        precio: "S/. 15.00",
        imagen: "/chocolate.png"
      }
    ]
  },
  {
    id: "retablo-frio",
    nombre: "Retablo Frio",
    items: [
      {
        nombre: "Iced Americano",
        descripcion: "",
        precio: "S/. 11.00",
        imagen: "/iced_americano.png"
      },
      {
        nombre: "Iced Cappuccino",
        descripcion: "",
        precio: "S/. 17.00",
        imagen: "/iced_cappuccino.png"
      },
      {
        nombre: "Frappe de Matcha",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/frappe_de_matcha.png"
      },
      {
        nombre: "Iced Latte",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: "/iced_latte.png"
      },
      {
        nombre: "Cold Brew de Naranja o maracuyá",
        descripcion: "",
        precio: "S/. 17.00",
        imagen: "/cold_brew.png"
      },
      {
        nombre: "Milkshake",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/milkshake.png"
      },
      {
        nombre: "Frappe de Caramelo",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/frappe_de_caramelo.png"
      },
      {
        nombre: "Frappe de Chocolate",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/frappe_de_chocolate.png"
      },
      {
        nombre: "Frappe de Oreo",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/frappe_de_oreo.png"
      },
      {
        nombre: "Frappe de Frutas",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/frappe_de_frutas.png"
      },
      {
        nombre: "Frappe de Menta",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/frappe_de_menta.png"
      },
      {
        nombre: "Frappe de choco menta",
        descripcion: "",
        precio: "S/. 20.00",
        imagen: "/frappe_de_choco_menta.png"
      }
    ]
  },
  {
    id: "metodos-filtrados",
    nombre: "Metodos Filtrados",
    items: [
      {
        nombre: "Cafetera Italiana",
        descripcion: "Método de filtrado que resalta sabores limpios y brillantes en cada taza.",
        precio: "S/. 12.00",
        imagen: "/cafetera_italiana.png"
      },
      {
        nombre: "Francesa",
        descripcion: "Filtrado que produce un café suave y equilibrado con cuerpo ligero.",
        precio: "S/. 12.00",
        imagen: "/francesa.png"
      },
      {
        nombre: "Chemex",
        descripcion: "Extracción completa para un café con cuerpo intenso y aceites naturales.",
        precio: "S/. 12.00",
        imagen: "/chemex.png"
      },
      {
        nombre: "V60",
        descripcion: "Café concentrado al estilo tradicional, con un sabor profundo y aromático.",
        precio: "S/. 12.00",
        imagen: ""
      }
    ]
  },
  {
    id: "otras-bebidas",
    nombre: "Otras Bebidas",
    items: [
      {
        nombre: "Agua mineral sin gas",
        descripcion: "",
        precio: "S/. 3.50",
        imagen: "/agua_mineral_sin_gas.png"
      },
      {
        nombre: "Agua mineral con gas",
        descripcion: "",
        precio: "S/. 3.50",
        imagen: "/agua_mineral_con_gas.png"
      },
      {
        nombre: "Viejas confiables (Inka o Coca Cola)",
        descripcion: "",
        precio: "S/. 4.00",
        imagen: "/viejas_confiables.jpg"
      },
      {
        nombre: "Refresco de Chicha o Maracuyá",
        descripcion: "",
        precio: "S/. 4.00",
        imagen: ""
      }
    ]
  },
  {
    id: "infusiones",
    nombre: "Infusiones",
    items: [
      {
        nombre: "Flor de jamaica, naranja, canela y clavo",
        descripcion: "Regula la presion arterial, elimina liquidos retenidos, limpia el higado, mejora la digestion y previene el estreñimiento.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Anís, Hierba Luisa y Naranja",
        descripcion: "Mejora la digestión después de comidas. Reduce gases e inflamacion abdominal. Aporta sensación de ligereza. Relajación digestiva suave.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Boldo con Limón",
        descripcion: "Favorece la digestión, alivia los gases después de las comidas. Apoya el buen funcionamiento del hígado. El toque de limón aporta vitamina C y antioxidantes que refuerzan las defensas.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Hierba Luisa, Naranja, canela y clavo",
        descripcion: "Ayuda al insomnio. Alivia cólicos menstruales y malestares digestivos. Regula la presión arterial y mejora la circulación. Relaja el cuerpo y la mente, ideal contra el estrés y la ansiedad.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Té de Jazmín y Limón",
        descripcion: "Relaja el sistema nervioso, ideal contra el estrés y la ansiedad. Mejora el ánimo y combate la depresión leve. Favorece la digestión y alivia malestares estomacales. Refuerza las defensas y protege el sistema respiratorio.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Manzanilla con Naranja",
        descripcion: "Ideal para disminuir el estrés diario y conciliar un sueño reparador. Calma malestares digestivos leves como cólicos o indigestión. La naranja aporta un plus de vitamina C y antioxidantes que cuidan el sistema inmunológico.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Menta, Limón y Arándanos rojos",
        descripcion: "Mejora la digestión and alivia malestares estomacales. Previene infecciones urinarias y limpia las vías urinarias y refuerza el sistema inmunológico. Elimina líquidos retenidos y desinflama.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Cedrón, Muña y Limón",
        descripcion: "Calma el colon irritable. Alivia gases, cólicos y malestares digestivos. Descongestiona las vías respiratorias. Refuerza el sistema inmunológico y reduce el estrés.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Valeriana, Toronjil y Limón",
        descripcion: "Ayuda a conciliar el sueño naturalmente. Disminuye la ansiedad nocturna. Favorece un sueño más profundo y continuo. Ideal para personas con mente acelerada. Es un ritual nocturno relajante.",
        precio: "S/. 10.00",
        imagen: ""
      }
    ]
  },
  {
    id: "jugos",
    nombre: "Jugos",
    items: [
      {
        nombre: "Papaya con piña",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Maracuyá con piña",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Fresa, piña y maracuyá",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Papaya",
        descripcion: "",
        precio: "S/. 13.00",
        imagen: ""
      },
      {
        nombre: "Fresa",
        descripcion: "",
        precio: "S/. 13.00",
        imagen: ""
      },
      {
        nombre: "Plátano",
        descripcion: "",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Piña",
        descripcion: "",
        precio: "S/. 13.00",
        imagen: ""
      },
      {
        nombre: "Maracuyá",
        descripcion: "",
        precio: "S/. 13.00",
        imagen: ""
      },
      {
        nombre: "Mango",
        descripcion: "",
        precio: "S/. 13.00",
        imagen: ""
      },
      {
        nombre: "Lúcuma",
        descripcion: "",
        precio: "S/. 13.00",
        imagen: ""
      },
      {
        nombre: "Plátano con leche",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Especial",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Fresa con leche",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      }
    ]
  },
  {
    id: "croissants-salados",
    nombre: "Croissants Salados",
    items: [
      {
        nombre: "De Pollo",
        descripcion: "Pollo, mayonesa, apio y pecanas.",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "De Piña",
        descripcion: "Pollo, mayonesa, piña y apio.",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "De Durazno",
        descripcion: "Pollo, mayonesa, durazno y apio.",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Clásico Jamón del país y queso",
        descripcion: "",
        precio: "S/. 12.00",
        imagen: ""
      },
      {
        nombre: "Capresse",
        descripcion: "Pan tostado con rodajas de tomate fresco, mozarella y albahaca.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Jamón y queso",
        descripcion: "Pan tostado con aceite de oliva, jamón y queso gouda.",
        precio: "S/. 12.00",
        imagen: ""
      }
    ]
  },
  {
    id: "croissants-dulces",
    nombre: "Croissants Dulces",
    items: [
      {
        nombre: "Dulce tentación de fresa",
        descripcion: "Con crema pastelera, chantilli y fresa.",
        precio: "S/. 17.00",
        imagen: ""
      },
      {
        nombre: "Beso de crema",
        descripcion: "Relleno con crema pastelera y azúcar impalpable.",
        precio: "S/. 14.00",
        imagen: ""
      }
    ]
  },
  {
    id: "joyas-de-la-casa",
    nombre: "Joyas de la Casa",
    items: [
      {
        nombre: "Club Sandwich",
        descripcion: "Pollo, jamón, tocino, queso mozarella y gouda, tomate, lechuga y papas caporales.",
        precio: "S/. 27.00",
        imagen: ""
      },
      {
        nombre: "Retablo's Pizza",
        descripcion: "Pan tradicional, salsa pizzera, tomate, cabanossi, pepperoni, queso mozzarella y oregano al gusto.",
        precio: "S/. 25.00",
        imagen: ""
      },
      {
        nombre: "Salchipapa",
        descripcion: "Clásica combinación de papas caporales y jugosas salchichas, acompañadas de salsas.",
        precio: "S/. 13.00",
        imagen: ""
      },
      {
        nombre: "Salchi Royal",
        descripcion: "Papas caporales y jugosas salchichas, toppings especiales.",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Choripapa",
        descripcion: "Papas caporales acompañadas de chorizos artesanales y salsas al gusto.",
        precio: "S/. 14.00",
        imagen: ""
      },
      {
        nombre: "Porción de papas caporales",
        descripcion: "Papas nativas peruanas crujientes, sazonadas con orégano y perfectas para compartir.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Salchi Ya Vuelta",
        descripcion: "Hecha con productos típicos de la selva como chorizo amazónico, cecina, platano maduro y aji de cocona.",
        precio: "S/. 18.50",
        imagen: ""
      },
      {
        nombre: "Sándwich con filete de pollo",
        descripcion: "Un filete de pollo grillado dentro de un pan Ciabatta con semillas de ajonjolí, salsa honey, tomate y palta.",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Alitas",
        descripcion: "Crujientes alitas bañadas en tu salsa favorita (BBQ, maracuyá, maracumango o búfalo).",
        precio: "S/. 22.00",
        imagen: ""
      }
    ]
  },
  {
    id: "dulce-tradicion",
    nombre: "Dulce Tradición",
    items: [
      {
        nombre: "Choco Capricho",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Delicia de zanahoria",
        descripcion: "",
        precio: "S/. 15.00",
        imagen: ""
      },
      {
        nombre: "Bocado de Limón",
        descripcion: "",
        precio: "S/. 12.00",
        imagen: ""
      },
      {
        nombre: "Wafle frutado",
        descripcion: "",
        precio: "S/. 17.00",
        imagen: ""
      },
      {
        nombre: "Cucharon de fresa",
        descripcion: "",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Cucharon de durazno",
        descripcion: "",
        precio: "S/. 10.00",
        imagen: ""
      }
    ]
  },
  {
    id: "helados",
    nombre: "Helados",
    items: [
      {
        nombre: "Una Bola",
        descripcion: "Elige entre cono o copa.",
        precio: "S/. 5.00",
        imagen: ""
      },
      {
        nombre: "Dos Bolas",
        descripcion: "Elige entre cono o copa.",
        precio: "S/. 8.00",
        imagen: ""
      }
    ]
  }
];
