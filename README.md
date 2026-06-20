# Laboratorio de Derivadas Web

Aplicación web didáctica para practicar derivadas, regla de la cadena, derivación implícita, funciones trigonométricas inversas y análisis de pendientes.

El proyecto transforma ejercicios académicos de cálculo diferencial en una herramienta interactiva con explicación paso a paso, renderizado de fórmulas y visualización gráfica.

---

## Objetivo del proyecto

Crear una herramienta visual para reforzar temas de cálculo diferencial mediante ejemplos guiados.

El sistema permite:

- Consultar fórmulas originales.
- Revisar derivadas finales.
- Ver procedimientos paso a paso.
- Evaluar pendientes en puntos específicos.
- Graficar funciones.
- Graficar derivadas.
- Visualizar puntos evaluados y rectas tangentes.
- Guardar la gráfica como imagen PNG.

---

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Canvas API
- MathJax
- GitHub Pages

---

## Estructura del repositorio

```text
laboratorio-derivadas-web/
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

## Ejercicios incluidos

### Reglas básicas

```text
f(x) = x³ - 4x
f'(x) = 3x² - 4
```

### Regla de la cadena

```text
f(x) = √(3 - x²)
f'(x) = -x / √(3 - x²)
```

### Logaritmo natural con raíz

```text
f(x) = ln(√(3 - x²))
f'(x) = -x / (3 - x²)
```

### Derivación implícita

```text
y³ + y² - 5y - x² = -4
dy/dx = 2x / (3y² + 2y - 5)
```

### Arc cot

```text
f(x) = arccot((1 + x) / (1 - x))
f'(x) = -1 / (1 + x²)
```

### Arc tan

```text
f(x) = arctan(3x²)
f'(x) = 6x / (1 + 9x⁴)
```

---

## Cómo usar el proyecto

Abre el archivo:

```text
index.html
```

en cualquier navegador moderno.

No requiere instalación de dependencias locales.

---

## Publicación en GitHub Pages

Este proyecto puede publicarse como sitio estático.

Pasos generales:

1. Subir los archivos al repositorio.
2. Entrar a **Settings**.
3. Abrir **Pages**.
4. Seleccionar la rama `main`.
5. Guardar.
6. Abrir el enlace generado por GitHub Pages.

---

## Enfoque académico

Este laboratorio convierte ejercicios de cálculo diferencial en una experiencia interactiva.

El usuario puede seleccionar un tema, revisar el procedimiento, evaluar pendientes y observar la relación entre la función original y su derivada.

---

## Autora

**Sofía Pacheco**  
GitHub: [SofiPv](https://github.com/SofiPv)

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.
