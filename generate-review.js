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
            'fresca, hecha al momento',
            'porciones enormes, buen sazón',
            'sabor auténtico peruano',
            'increíble, vuelvo siempre'
          ],
          'muy bueno': [
            'mejor de lo esperado',
            'rica de verdad',
            'buena calidad para el precio',
            'porciones suficientes, nada decepcionó'
          ],
          'bueno': [
            'fresco y bien hecho',
            'ingredientes frescos, se nota',
            'bueno para almorzar rápido',
            'sencillo pero sabroso'
          ]
        },
        service: {
          'excelente': [
            'pendientes todo el tiempo',
            'rápido y atento',
            'conocen bien el menú',
            'buenas recomendaciones'
          ],
          'amable y atento': [
            'amables de verdad',
            'atentos todo el tiempo',
            'buen trato siempre',
            'trato respetuoso, sin apuros'
          ],
          'rápido y amable': [
            'llegó rápido, sin esperar',
            'eficientes y amables',
            'perfecto para almorzar rápido',
            'en menos de una hora'
          ]
        },
        vibe: {
          'mi pareja': [
            'tranquilo, pudimos conversar',
            'mi pareja quedó contenta',
            'salimos con ganas de volver',
            'sin reserva, salió perfecto'
          ],
          'mi familia': [
            'todos contentos con lo suyo',
            'fácil para venir en familia',
            'a los niños les encantó',
            'sin complicaciones, todo bien'
          ],
          'amigos': [
            'todos salimos contentos',
            'perfecto para venir en grupo',
            'nos gustó todo',
            'salimos todos contentos'
          ],
          'solo': [
            'entré por curiosidad, 100% recomendado',
            'cómodo cuando vas solo',
            'lo descubrí por casualidad',
            'tranquilo para almorzar solo'
          ],
          'un almuerzo de trabajo': [
            'ideal para el break',
            'compañeros de oficina satisfechos',
            'trabajamos cerca, venimos seguido',
            'rápido y sin dramas'
          ]
        }
      },
      en: {
        food: {
          'delicious': [
            'fresh, made to order',
            'huge portions, great seasoning',
            'authentic Peruvian flavor',
            'incredible, come back every week'
          ],
          'very good': [
            'better than expected',
            'genuinely good food',
            'great quality for the price',
            'consistent, portions more than enough'
          ],
          'good': [
            'fresh and well made',
            'fresh ingredients, you can tell',
            'good for a quick lunch',
            'simple but tasty'
          ]
        },
        service: {
          'excellent': [
            'attentive the whole time',
            'fast and attentive',
            'know the menu well',
            'great recommendations'
          ],
          'friendly and attentive': [
            'genuinely friendly',
            'attentive the whole time',
            'always good service',
            'respectful, no rushing'
          ],
          'fast and friendly': [
            'food came fast, no waiting',
            'efficient and friendly',
            'perfect for a quick lunch',
            'in and out in under an hour'
          ]
        },
        vibe: {
          'my partner': [
            'quiet, we could actually talk',
            'my partner loved it',
            'left wanting to come back',
            'no reservation needed, went great'
          ],
          'my family': [
            'everyone happy with their order',
            'easy for a family visit',
            'kids loved it',
            'no complications, all good'
          ],
          'friends': [
            'everyone left happy',
            'perfect for a group',
            'we all loved it',
            'great time with friends'
          ],
          'alone': [
            'walked in curious, 100% recommend',
            'comfortable eating alone',
            'discovered it by chance',
            'quiet spot for a solo lunch'
          ],
          'a work lunch': [
            'perfect for a lunch break',
            'coworkers all satisfied',
            'work nearby, come often',
            'quick and no drama'
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

Experiencia:
- Comida: ${food} — ${foodDescriptor}
- Servicio: ${service} — ${serviceDescriptor}
- Viniste con: ${vibe} — ${vibeDescriptor}

Escribe una reseña para Google. MÁXIMO 20 PALABRAS en total. Una o dos oraciones muy cortas.

Ejemplos del tono exacto que buscamos (NO copies estas frases, son solo referencia):
- "Rico de verdad y las porciones enormes. Volveré."
- "Fuimos en familia y todos contentos. Muy buena comida."
- "Servicio rápido y la comida sabrosa. Lo recomiendo."
- "Buena comida peruana y precio justo. 100% recomendado."

Reglas:
- Palabras simples. Frases cortas. Como un mensaje de texto.
- No tienes que mencionar los tres factores.
- Sin emojis. Sin guiones. Sin comillas. Sin nombres de platos. Sin nombrar el restaurante.

Solo el texto de la reseña.`
      : `You are a real person who just ate at a Peruvian restaurant in Downtown Miami. The place is small, casual and known among locals in the area. The food is the main reason people come back — generous portions, authentic flavor and prices that make sense. It's not a fancy restaurant and doesn't try to be.

Experience:
- Food: ${food} — ${foodDescriptor}
- Service: ${service} — ${serviceDescriptor}
- Came with: ${vibe} — ${vibeDescriptor}

Write a Google review. MAXIMUM 20 WORDS total. One or two very short sentences.

Examples of the exact tone we want (do NOT copy these, just use as reference):
- "Really good food and huge portions. Will be back."
- "Went with family, everyone was happy. Great Peruvian food."
- "Fast service and the food was great. Highly recommend."
- "Good food, fair price, big portions. 100% recommend."

Rules:
- Simple words. Short sentences. Like a text message.
- You don't have to mention all three factors.
- No emojis. No dashes. No quotes. No dish names. No restaurant name.

Only the review text.`;

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
