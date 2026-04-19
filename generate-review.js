const ALLOWED_VALUES = {
  lang: ['es', 'en'],
  food: {
    es: ['delicioso', 'muy bueno', 'bueno'],
    en: ['delicious', 'very good', 'good']
  },
  service: {
    es: ['excelente', 'amable y atento', 'rápido y amable'],
    en: ['excellent', 'friendly and attentive', 'fast and friendly']
  },
  vibe: {
    es: ['mi pareja', 'mi familia', 'amigos', 'solo', 'un almuerzo de trabajo'],
    en: ['my partner', 'my family', 'friends', 'alone', 'a work lunch']
  }
};

const ALLOWED_ORIGINS = [
  'https://upstari.com',
  'https://www.upstari.com',
  'https://qrupstari.netlify.app'
];

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const origin = event.headers.origin || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  try {
    const { food, service, vibe, lang } = JSON.parse(event.body);

    // Whitelist validation — reject anything not in the allowed lists
    const validLang    = ALLOWED_VALUES.lang.includes(lang) ? lang : 'en';
    const validFood    = ALLOWED_VALUES.food[validLang].includes(food);
    const validService = ALLOWED_VALUES.service[validLang].includes(service);
    const validVibe    = ALLOWED_VALUES.vibe[validLang].includes(vibe);

    if (!validFood || !validService || !validVibe) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': corsOrigin },
        body: JSON.stringify({ error: 'Invalid input values' })
      };
    }

    // ── SUBDESCRIPTORS ──
    const descriptors = {
      es: {
        food: {
          'delicioso': [
            'la comida estaba fresca y bien preparada, se notaba que todo lo preparan al momento',
            'las porciones que sirven son generosas y el sazón es excelente',
            'el sabor estaba muy bueno de verdad, auténtica comida peruana',
            'la comida en este restaurante es increíble, es mi lugar todas las semanas'
          ],
          'muy bueno': [
            'estuvo mejor de lo que esperaba',
            'la comida es de verdad rica, auténtica comida peruana',
            'la calidad está muy bien para el precio que tiene en esta zona',
            'todo fue consistente, nada decepcionó y las porciones fueron suficientes'
          ],
          'bueno': [
            'la comida estuvo buena, todo fresco y bien preparado',
            'se nota que usan ingredientes frescos y el chef sabe lo que hace',
            'buena opción para almorzar rápido en downtown, te deja satisfecho',
            'comida sencilla pero bien hecha, con buen sabor y porciones adecuadas'
          ]
        },
        service: {
          'excelente': [
            'estuvieron pendientes de nuestra mesa todo el tiempo',
            'el servicio fue rápido y atento, ideal cuando tienes poco tiempo para almorzar',
            'el mesero conocía muy bien el menú',
            'la mesera nos atendió muy bien y nos hizo excelentes recomendaciones'
          ],
          'amable y atento': [
            'buena atención, estuvieron atentos durante todo mi almuerzo',
            'amables de verdad, no de los que sonríen por obligación',
            'estuvieron pendientes sin molestar',
            'el trato fue bueno durante toda la comida'
          ],
          'rápido y amable': [
            'la comida llegó rápido, perfecto si no tienes mucho tiempo',
            'perfecto para almorzar rápido, no te hacen perder el tiempo',
            'eficientes y amables, las dos cosas juntas',
            'en menos de una hora estaba comido y listo para seguir el día'
          ]
        },
        vibe: {
          'mi pareja': [
            'tranquilo y sin ruido exagerado, pudimos conversar bien',
            'mi pareja quedó contenta, los visitaremos pronto de nuevo',
            'vine con mi pareja y salimos satisfechos y con ganas de volver',
            'no fue necesario reservar y nuestra cita salió excelente'
          ],
          'mi familia': [
            'vinimos en familia y todos quedaron contentos con lo que pidieron',
            'buen lugar para traer a la familia sin complicarse mucho',
            'a los niños les encantó la comida',
            'buena opción para una comida familiar sin complicaciones ni sorpresas'
          ],
          'amigos': [
            'vine con mis amigos y todos salimos contentos, volveremos',
            'lugar perfecto para venir en grupo',
            'vine con mis amigos y nos gustó todo, buena experiencia',
            'ambiente ideal para juntarte con tus amigos, excelente el happy hour'
          ],
          'solo': [
            'me metí a cenar solo porque vi el lugar y me llamó la atención, 100% lo recomiendo',
            'el lugar es pequeño y eso lo hace más cómodo cuando vas solo',
            'este restaurante es de los que descubres por casualidad y terminas recomendando a todos',
            'buen lugar para almorzar tranquilo sin que nadie te moleste'
          ],
          'un almuerzo de trabajo': [
            'ideal para almorzar en tu break del trabajo',
            'fui con mis amigos de la oficina y todos salieron satisfechos',
            'trabajamos cerca y descubrimos este lugar, todo nos pareció excelente',
            'vinimos por casualidad con mis compañeros de trabajo y ahora venimos casi todas las semanas'
          ]
        }
      },
      en: {
        food: {
          'delicious': [
            'the food was fresh and well prepared, you could tell everything is made to order',
            'the portions are generous and the seasoning is excellent',
            'the flavor was really good, authentic Peruvian food',
            'the food here is incredible, it\'s my spot every week'
          ],
          'very good': [
            'better than I expected',
            'the food is genuinely good, authentic Peruvian cuisine',
            'the quality is great for the price in this area',
            'everything was consistent, nothing disappointed and the portions were more than enough'
          ],
          'good': [
            'the food was good, everything fresh and well prepared',
            'you can tell they use fresh ingredients and the chef knows what he\'s doing',
            'great option for a quick lunch downtown, leaves you satisfied',
            'simple food but well made, good flavor and decent portions'
          ]
        },
        service: {
          'excellent': [
            'they were attentive to our table the whole time',
            'service was fast and attentive, perfect when you don\'t have much time for lunch',
            'the waiter knew the menu really well',
            'the server took great care of us and made excellent recommendations'
          ],
          'friendly and attentive': [
            'good service, they were attentive throughout my whole lunch',
            'genuinely friendly staff, not the kind that smiles just because they have to',
            'they kept an eye on us without being intrusive',
            'the service was good from start to finish'
          ],
          'fast and friendly': [
            'food came out fast, perfect if you don\'t have much time',
            'perfect for a quick lunch, they don\'t waste your time',
            'efficient and friendly, both at the same time',
            'in less than an hour I ate well, paid and left. Exactly what I needed'
          ]
        },
        vibe: {
          'my partner': [
            'quiet and not too noisy, we could actually have a conversation',
            'my partner loved it, we\'ll definitely be back soon',
            'came with my partner and we both left satisfied and wanting to come back',
            'no reservation needed and our date turned out great'
          ],
          'my family': [
            'came as a family and everyone was happy with what they ordered',
            'great place to bring the family without overcomplicating things',
            'the kids loved the food',
            'good option for a family meal with no complications or surprises'
          ],
          'friends': [
            'came with my friends and we all left happy, we\'ll be back',
            'perfect place to come in a group',
            'came with my friends and we loved everything, great time',
            'great spot to meet up with friends, the happy hour is excellent'
          ],
          'alone': [
            'walked in alone because the place caught my eye, 100% recommend',
            'the place is small and that makes it more comfortable when you\'re by yourself',
            'one of those places you discover by accident and end up recommending to everyone',
            'great spot for a quiet lunch without anyone bothering you'
          ],
          'a work lunch': [
            'perfect for lunch during your work break',
            'went with my office friends and everyone left satisfied',
            'we work nearby and discovered this place, everything was excellent',
            'came by chance with my coworkers and now we come almost every week'
          ]
        }
      }
    };

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const d = descriptors[lang] || descriptors['en'];
    const foodDescriptor    = pick(d.food[food]      || d.food['good']);
    const serviceDescriptor = pick(d.service[service] || d.service['friendly and attentive']);
    const vibeDescriptor    = pick(d.vibe[vibe]      || d.vibe['alone']);

    const prompt = lang === 'es'
      ? `Eres una persona real que acaba de comer en un restaurante peruano en Downtown Miami. El lugar es pequeño, casual y conocido entre la gente local de la zona. La comida es la razón principal por la que la gente vuelve — porciones generosas, sabor auténtico y precios que tienen sentido. No es un restaurante de lujo ni pretende serlo.

Basándote en esta experiencia específica:
- Comida: ${food} — ${foodDescriptor}
- Servicio: ${service} — ${serviceDescriptor}
- Viniste con: ${vibe} — ${vibeDescriptor}

Escribe una reseña para Google exactamente como la escribiría esa persona desde su celular — rápido, sin pensar demasiado. Entre 2 y 3 oraciones, con un total de entre 25 y 35 palabras.

El tono debe sonar así (solo como referencia de nivel de lenguaje, NO copies estas frases):
- "Rico de verdad, las porciones son grandes y el servicio estuvo bien. Ya volveré."
- "Fui con mi familia y todos quedaron contentos. La comida buena y el precio razonable."
- "El servicio súper rápido y la comida estaba buena. Lo recomiendo."

Cada reseña que generes debe ser completamente diferente en estructura y contenido. Varía siempre el punto de partida.

Nunca uses lenguaje de crítica gastronómica como "sabores que transportan", "autenticidad culinaria", "fusión de sabores" o similares.
Nunca uses frases que resten valor como "nada del otro mundo", "cumplió", "estuvo bien" o similares.

Sin emojis. Sin guiones. Sin comillas. Sin nombres de platos. Sin nombrar el restaurante. Solo el texto de la reseña.`
      : `You are a real person who just ate at a Peruvian restaurant in Downtown Miami. The place is small, casual and known among locals in the area. The food is the main reason people come back — generous portions, authentic flavor and prices that make sense. It's not a fancy restaurant and doesn't try to be.

Based on this specific experience:
- Food: ${food} — ${foodDescriptor}
- Service: ${service} — ${serviceDescriptor}
- Came with: ${vibe} — ${vibeDescriptor}

Write a Google review exactly the way that person would type it from their phone — fast, without overthinking it. Between 2 and 3 sentences, with a total of between 25 and 35 words.

The tone should sound like this (for style reference only, do NOT copy these):
- "Really good food and the portions are huge. Service was on point too."
- "Went with family and everyone was happy. Good food and fair price, will be back."
- "Super fast service and the food was great. Definitely recommend it."

Every review you generate must be completely different in structure and content. Always vary the opening.

Never use food critic language like "flavors that transport you", "culinary authenticity", "flavor profiles" or similar.
Never use phrases that diminish the experience like "nothing special", "it was ok", "decent" or similar.

No emojis. No dashes of any kind including em dashes and hyphens used as punctuation. No quotes. No dish names. No restaurant name. Only the review text.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const reviewText = data.content?.[0]?.text?.trim() || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin },
      body: JSON.stringify({ review: reviewText })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin },
      body: JSON.stringify({ error: 'Error generating review' })
    };
  }
};
