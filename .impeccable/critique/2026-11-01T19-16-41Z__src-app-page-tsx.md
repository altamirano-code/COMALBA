---
target: página de inicio
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\Asus\\Documents\\Projects_web\\pagina_issac_v3\\pagina_issac\\src\\app\\page.tsx"
target_fingerprint: "sha256:e3283a495cf084e93d0c41fa3ca38b86c02bc31bbb9d7536641a9efdc39137ca"
target_path: "C:\\Users\\Asus\\Documents\\Projects_web\\pagina_issac_v3\\pagina_issac\\src\\app\\page.tsx"
timestamp: 2026-11-01T19-16-41Z
slug: src-app-page-tsx
closed: true
---
# Crítica: página de inicio (src/app/page.tsx)

Method: dual-agent (A: revisión de diseño · B: detector + navegador)

## Calificación Nielsen: 21/32 (66 %, Aceptable). n/a: 7, 10
1 Estado 3 · 2 Lenguaje 3 · 3 Control 3 · 4 Consistencia 2 · 5 Prevención 3 · 6 Reconocimiento 3 · 7 n/a · 8 Estética 2 · 9 Errores 2 · 10 n/a

## Veredicto de especificidad
Contenido propio (selector "¿Qué necesitas hoy?", valuación en 3 pasos, fotos de Morelos). Lenguaje visual genérico de inmobiliaria: azul/dorado/marfil, H2 en Cormorant con cláusula final en cursiva dorada en los 6 títulos, etiquetas espaciadas. El hero no dice ninguna afirmación propia (Cuernavaca, 4 % a 10 años, asesor, certeza jurídica).
Detector: 36 avisos en escritorio / 39 en móvil (URL); el escaneo del código no detecta nada (solo regex).
- Bajo contraste reales: dorado-600 #8f7342 en etiquetas y detalles (3.6–4.0:1), piedra #68717d sobre #ebe7df (4.0:1).
- Texto de 9 px en el subtítulo del Navbar.
- Footer legal sin max-width.
- WhatsApp blanco sobre #25d366 (2:1) en /albavera.
- Falsos positivos o decisiones de marca: cream-palette, kicker-above-heading.

## Problemas prioritarios
- [P0] Cormorant Garamond (font-display) coloca mal los acentos en pantalla y se ve decorativo. Arreglo: Source Serif 4 Variable + Manrope; quitar Cormorant y Brygada; quitar el patrón de cursiva dorada; text-balance en los H2. → typeset
- [P1] 21 tamaños de letra arbitrarios, 3 familias, interlineado del cuerpo 1.88, tracking de eyebrow 0.32em. Arreglo: escala por roles en @theme, cuerpo a ~1.6, tracking a ~0.16em. → typeset
- [P1] El hero no convierte ni diferencia; CTA "Explorar divisiones". Arreglo: titular con Morelos y una afirmación de posicionamiento; CTA principal "Habla con un asesor". → clarify
- [P2] Tarjetas: precio en Cormorant dorado 28px queda debajo del título en Manrope 17/700; falta la clave ALB-xxx. Arreglo: precio en Manrope 700 tabular marino; chip con la clave; WhatsApp con la clave prellenada. → polish
- [P2] Opciones inactivas del selector al 45 % de opacidad (2.9:1) y selección con onMouseEnter. Arreglo: más contraste; seleccionar solo con clic/foco. → harden

## Señales por persona
- Primera visita: tiene que entender la estructura del grupo; el selector está unas 4 pantallas abajo.
- Móvil: el hero de 100svh corta las cifras; el botón flotante de WhatsApp tapa texto; H2 de 3–4 líneas.
- Propietaria que quiere valuar: valuación es la 5.ª sección; no dice si es gratis, cuánto tarda ni quién visita.

## Menores
- Sin CTA "Hablemos" entre 1024 y 1279 px.
- Wordmark redundante junto al logo.
- Cita del footer en Title Case.
- "10+" duplicado.
- Imports de Cormorant 500/700/500-italic que no se usan.

## Preguntas
- ¿Qué afirmación debe llevarse quien solo lea el hero?
- ¿El inicio vende el grupo o lleva una necesidad a una persona?
