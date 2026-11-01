# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

El sitio de Grupo Comalba atiende a cuatro públicos, todos confirmados como principales. La mayoría vive en Cuernavaca, Morelos, o cerca:

- **Compradores y arrendatarios de vivienda:** buscan casa o departamento para comprar (ALBAVERA) o rentar por año o por vacaciones (CIV Rentas).
- **Propietarios que venden, rentan o valúan:** quieren que Comalba promueva su inmueble, lo rente o les dé un valor de referencia (formulario de venta y proceso de valuación).
- **Inversionistas:** compran inmuebles para rentarlos o para que ganen valor.
- **Clientes de servicios:** vienen por un servicio concreto: cocinas y clósets (AQMEN), mudanzas (Transportes IMMOR), financiamiento inmobiliario, asesoría jurídica o gestoría (Asesoría y Proyectos).

Público secundario: **staff de Comalba** (no técnico), que usa `/admin` para publicar propiedades, elegir las destacadas del inicio, filtrar, mandar a la papelera y exportar a Excel.

## Product Purpose

Un ecosistema inmobiliario que reúne bienes raíces, rentas, proyectos, diseño y soluciones para el espacio bajo una sola marca. El sitio dirige a cada visitante a la división correcta y convierte la visita en una conversación con un asesor, por WhatsApp (número general o el de la división) o con el formulario del área. El éxito es que un contacto calificado llegue a la división correcta.

## Positioning

Lo que Comalba puede afirmar y otra inmobiliaria típica de Cuernavaca no podría copiar con honestidad:

- **Todo en un solo grupo:** compra, renta, financiamiento, muebles y mudanza con el mismo equipo de confianza.
- **Financiamiento propio:** 10 años con tasa preferencial de 4% anual y comprobación de ingresos flexible (comprar, construir, remodelar).
- **Trato personal:** un asesor acompaña desde la primera visita hasta el cierre. El equipo está formado por profesionales jóvenes.
- **Certeza jurídica:** asesoría legal y gestoría propias que revisan la documentación antes de vender o rentar.

## Operating Context

- La conversión pasa por WhatsApp. Cada división puede tener su propio número (`src/lib/site.ts`).
- Cada división abre con su propia herramienta: buscador (ALBAVERA), rentas anuales y vacacionales (CIV), índice de servicios (Asesoría), planos configurables (AQMEN), cotizador de mudanza (IMMOR), calculadora de financiamiento (Financiamiento).
- Valuación en tres pasos: contar sobre el inmueble, visita y análisis de mercado, entrega de un valor de referencia.
- Claves de propiedad visibles (por ejemplo `ALB-004`) que asesor y cliente usan como referencia en común.

## Capabilities and Constraints

- Stack: Next.js 15 (App Router), React 19, Tailwind 4, TypeScript. Las tipografías se alojan en el proyecto con Fontsource.
- Un solo modelo de publicaciones para ALBAVERA, CIV Rentas, AQMEN y el inicio (`src/lib/publicaciones.ts`).
- **Pendiente de decidir:** base de datos y hosting. Por ahora las publicaciones se guardan solo en el navegador (`src/lib/almacenPublicaciones.ts`). Es temporal.
- Instagram todavía no tiene enlace oficial. El ícono queda oculto hasta que lo haya.
- Idioma: español (es-MX).

## Brand Commitments

- Nombres y logos del grupo y sus divisiones: Grupo Comalba, ALBAVERA Bienes Raíces, CIV Rentas, AQMEN Modern Furniture, Transportes IMMOR (`public/logos/`). Financiamiento usa un ícono en lugar del logo de HIR.
- Lema en uso: "Espacios para nuevas posibilidades".
- Misión, visión y valores del inicio: Compromiso · Integridad · Profesionalismo · Responsabilidad.
- El aviso legal obligatorio (medidas, fotos y precios son orientativos y no contractuales) está en `site.ts`.

## Evidence on Hand

- Fotos reales de propiedades y zonas de Morelos: `public/images/` (Cuernavaca, Huitzilac, departamentos Los Volcanes, residencia).
- Logos de todas las divisiones en `public/logos/`.
- Datos de contacto reales: teléfono, correo comalbasadecv@gmail.com, Facebook, ubicación en el mapa.
- **No hay** testimonios, cifras de ventas, lista de clientes ni notas de prensa. No hay que inventarlos.

## Product Principles

1. **Cada visita termina en una conversación con una persona.** WhatsApp y el formulario del área son la meta, no un canal secundario.
2. **Un grupo, puertas claras.** El visitante tiene que saber qué división atiende su necesidad sin entender cómo está organizado el grupo.
3. **Confianza antes que promesas.** Certeza jurídica, un asesor personal y cifras reales (4% a 10 años). Precios y medidas siempre se presentan como aproximados.
4. **Lo administra gente no técnica.** Todo lo que aparece en el sitio debe poder editarse desde `/admin` sin tocar código.
