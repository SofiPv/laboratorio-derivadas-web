const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

const exerciseSelect = document.getElementById("exerciseSelect");
const formulaOriginal = document.getElementById("formulaOriginal");
const formulaDerivative = document.getElementById("formulaDerivative");
const stepsList = document.getElementById("stepsList");
const exerciseTitle = document.getElementById("exerciseTitle");
const exerciseDescription = document.getElementById("exerciseDescription");
const conceptList = document.getElementById("conceptList");
const exerciseNotes = document.getElementById("exerciseNotes");
const evaluationResult = document.getElementById("evaluationResult");
const evaluateBtn = document.getElementById("evaluateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const toggleStepsBtn = document.getElementById("toggleStepsBtn");

const explicitInputs = document.getElementById("explicitInputs");
const implicitInputs = document.getElementById("implicitInputs");
const xValue = document.getElementById("xValue");
const implicitXValue = document.getElementById("implicitXValue");
const implicitYValue = document.getElementById("implicitYValue");

const margin = 58;
let currentExercise = null;
let stepsVisible = true;
let evaluatedPoint = null;

const exercises = [
  {
    id: "basic",
    title: "Reglas básicas: potencia y suma",
    original: "\\[f(x)=x^3-4x\\]",
    derivative: "\\[f'(x)=3x^2-4\\]",
    description: "Ejercicio básico para practicar regla de la potencia y derivada de una suma.",
    concepts: ["Regla de la potencia", "Derivada de una suma", "Función polinómica", "Pendiente"],
    notes: "La derivada permite conocer la pendiente de la función en cualquier valor de x.",
    steps: [
      "\\[\\frac{d}{dx}(x^3)=3x^2\\]",
      "\\[\\frac{d}{dx}(-4x)=-4\\]",
      "\\[f'(x)=3x^2-4\\]"
    ],
    bounds: { xMin: -4, xMax: 4, yMin: -10, yMax: 10 },
    domain: () => true,
    f: x => x ** 3 - 4 * x,
    fp: x => 3 * x ** 2 - 4,
    mode: "explicit"
  },
  {
    id: "chainSqrt",
    title: "Regla de la cadena: raíz",
    original: "\\[f(x)=\\sqrt{3-x^2}\\]",
    derivative: "\\[f'(x)=\\frac{-x}{\\sqrt{3-x^2}}\\]",
    description: "Ejercicio para derivar una raíz usando composición de funciones.",
    concepts: ["Regla de la cadena", "Radicales", "Dominio restringido", "Pendiente"],
    notes: "La función está definida cuando 3 - x² es mayor o igual a 0.",
    steps: [
      "\\[u=3-x^2\\]",
      "\\[f(x)=\\sqrt{u}=u^{1/2}\\]",
      "\\[f'(x)=\\frac{1}{2}u^{-1/2}\\cdot u'\\]",
      "\\[u'=-2x\\]",
      "\\[f'(x)=\\frac{1}{2\\sqrt{3-x^2}}(-2x)=\\frac{-x}{\\sqrt{3-x^2}}\\]"
    ],
    bounds: { xMin: -2.2, xMax: 2.2, yMin: -6, yMax: 3 },
    domain: x => 3 - x * x >= 0,
    derivativeDomain: x => 3 - x * x > 0,
    f: x => Math.sqrt(3 - x * x),
    fp: x => -x / Math.sqrt(3 - x * x),
    mode: "explicit"
  },
  {
    id: "logSqrt",
    title: "Logaritmo natural con raíz",
    original: "\\[f(x)=\\ln\\left(\\sqrt{3-x^2}\\right)\\]",
    derivative: "\\[f'(x)=\\frac{-x}{3-x^2}\\]",
    description: "Ejercicio de logaritmos y regla de la cadena aplicado a una raíz.",
    concepts: ["Derivada de ln(u)", "Regla de la cadena", "Radicales", "Dominio"],
    notes: "Como hay logaritmo, la raíz debe ser mayor que 0; por eso el dominio es (-√3, √3).",
    steps: [
      "\\[f(x)=\\ln(u)\\]",
      "\\[u=\\sqrt{3-x^2}\\]",
      "\\[\\frac{d}{dx}\\ln(u)=\\frac{u'}{u}\\]",
      "\\[u'=\\frac{-x}{\\sqrt{3-x^2}}\\]",
      "\\[f'(x)=\\frac{\\frac{-x}{\\sqrt{3-x^2}}}{\\sqrt{3-x^2}}\\]",
      "\\[f'(x)=\\frac{-x}{3-x^2}\\]"
    ],
    bounds: { xMin: -2.1, xMax: 2.1, yMin: -8, yMax: 4 },
    domain: x => 3 - x * x > 0,
    f: x => Math.log(Math.sqrt(3 - x * x)),
    fp: x => -x / (3 - x * x),
    mode: "explicit"
  },
  {
    id: "implicit",
    title: "Derivación implícita y pendiente",
    original: "\\[y^3+y^2-5y-x^2=-4\\]",
    derivative: "\\[\\frac{dy}{dx}=\\frac{2x}{3y^2+2y-5}\\]",
    description: "Ejercicio para hallar la pendiente de una curva mediante derivación implícita.",
    concepts: ["Derivación implícita", "Pendiente", "Diferenciación respecto a x", "Curva no despejada"],
    notes: "Para evaluar la pendiente se necesita un punto (x, y) que pertenezca a la curva.",
    steps: [
      "\\[\\frac{d}{dx}(y^3)+\\frac{d}{dx}(y^2)-\\frac{d}{dx}(5y)-\\frac{d}{dx}(x^2)=\\frac{d}{dx}(-4)\\]",
      "\\[3y^2\\frac{dy}{dx}+2y\\frac{dy}{dx}-5\\frac{dy}{dx}-2x=0\\]",
      "\\[(3y^2+2y-5)\\frac{dy}{dx}=2x\\]",
      "\\[\\frac{dy}{dx}=\\frac{2x}{3y^2+2y-5}\\]"
    ],
    bounds: { xMin: -5, xMax: 5, yMin: -4, yMax: 4 },
    implicitF: (x, y) => y ** 3 + y ** 2 - 5 * y - x ** 2 + 4,
    slope: (x, y) => (2 * x) / (3 * y ** 2 + 2 * y - 5),
    mode: "implicit"
  },
  {
    id: "arccot",
    title: "Trigonométrica inversa: arc cot",
    original: "\\[f(x)=\\operatorname{arccot}\\left(\\frac{1+x}{1-x}\\right)\\]",
    derivative: "\\[f'(x)=\\frac{-1}{1+x^2}\\]",
    description: "Ejercicio de derivada de arc cot usando variable interna u.",
    concepts: ["Arc cot", "Regla de la cadena", "Cociente", "Simplificación algebraica"],
    notes: "Se trabaja con u=(1+x)/(1-x). La expresión no está definida en x=1.",
    steps: [
      "\\[u=\\frac{1+x}{1-x}\\]",
      "\\[\\frac{d}{dx}\\operatorname{arccot}(u)=\\frac{-u'}{1+u^2}\\]",
      "\\[u'=\\frac{(1-x)(1)-(1+x)(-1)}{(1-x)^2}=\\frac{2}{(1-x)^2}\\]",
      "\\[1+u^2=1+\\left(\\frac{1+x}{1-x}\\right)^2\\]",
      "\\[1+u^2=\\frac{(1-x)^2+(1+x)^2}{(1-x)^2}=\\frac{2(1+x^2)}{(1-x)^2}\\]",
      "\\[f'(x)=\\frac{-\\frac{2}{(1-x)^2}}{\\frac{2(1+x^2)}{(1-x)^2}}=\\frac{-1}{1+x^2}\\]"
    ],
    bounds: { xMin: -5, xMax: 5, yMin: -4, yMax: 4 },
    domain: x => Math.abs(1 - x) > 0.05,
    f: x => Math.PI / 2 - Math.atan((1 + x) / (1 - x)),
    fp: x => -1 / (1 + x * x),
    mode: "explicit"
  },
  {
    id: "arctan",
    title: "Trigonométrica inversa: arc tan",
    original: "\\[f(x)=\\arctan(3x^2)\\]",
    derivative: "\\[f'(x)=\\frac{6x}{1+9x^4}\\]",
    description: "Ejercicio de derivada de arc tan usando regla de la cadena.",
    concepts: ["Arc tan", "Regla de la cadena", "Potencias", "Funciones trigonométricas inversas"],
    notes: "La derivada correcta de arctan(u) es u'/(1+u²).",
    steps: [
      "\\[u=3x^2\\]",
      "\\[u'=6x\\]",
      "\\[\\frac{d}{dx}\\arctan(u)=\\frac{u'}{1+u^2}\\]",
      "\\[f'(x)=\\frac{6x}{1+(3x^2)^2}\\]",
      "\\[f'(x)=\\frac{6x}{1+9x^4}\\]"
    ],
    bounds: { xMin: -4, xMax: 4, yMin: -3, yMax: 3 },
    domain: () => true,
    f: x => Math.atan(3 * x * x),
    fp: x => (6 * x) / (1 + 9 * x ** 4),
    mode: "explicit"
  }
];

function init() {
  exercises.forEach(exercise => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = exercise.title;
    exerciseSelect.appendChild(option);
  });

  currentExercise = exercises[0];

  exerciseSelect.addEventListener("change", () => {
    currentExercise = exercises.find(exercise => exercise.id === exerciseSelect.value);
    evaluatedPoint = null;
    updateView();
  });

  evaluateBtn.addEventListener("click", evaluateSlope);
  downloadBtn.addEventListener("click", downloadGraph);
  toggleStepsBtn.addEventListener("click", toggleSteps);

  updateView();
}

function updateView() {
  exerciseTitle.textContent = currentExercise.title;
  exerciseDescription.textContent = currentExercise.description;
  exerciseNotes.textContent = currentExercise.notes;

  formulaOriginal.innerHTML = currentExercise.original;
  formulaDerivative.innerHTML = currentExercise.derivative;

  stepsList.innerHTML = "";
  currentExercise.steps.forEach(step => {
    const li = document.createElement("li");
    li.innerHTML = step;
    stepsList.appendChild(li);
  });

  conceptList.innerHTML = "";
  currentExercise.concepts.forEach(concept => {
    const li = document.createElement("li");
    li.textContent = concept;
    conceptList.appendChild(li);
  });

  if (currentExercise.mode === "implicit") {
    explicitInputs.classList.add("hidden");
    implicitInputs.classList.remove("hidden");
    evaluationHelp.textContent = "Ingresa un punto (x, y) para evaluar la pendiente implícita.";
  } else {
    explicitInputs.classList.remove("hidden");
    implicitInputs.classList.add("hidden");
    evaluationHelp.textContent = "Ingresa un valor de x para evaluar la derivada y observar la pendiente.";
  }

  evaluationResult.textContent = "";
  draw();

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function toggleSteps() {
  stepsVisible = !stepsVisible;
  stepsList.classList.toggle("hidden", !stepsVisible);
  toggleStepsBtn.textContent = stepsVisible ? "Ocultar pasos" : "Mostrar pasos";
}

function evaluateSlope() {
  if (currentExercise.mode === "implicit") {
    const x = Number(implicitXValue.value);
    const y = Number(implicitYValue.value);
    const denominator = 3 * y ** 2 + 2 * y - 5;

    if (Math.abs(denominator) < 0.000001) {
      evaluationResult.textContent = "No se puede evaluar la pendiente porque el denominador es 0.";
      evaluatedPoint = null;
      draw();
      return;
    }

    const slope = currentExercise.slope(x, y);
    const curveValue = currentExercise.implicitF(x, y);

    evaluatedPoint = { x, y, slope };

    evaluationResult.innerHTML =
      `Pendiente en (${format(x)}, ${format(y)}): <strong>${format(slope)}</strong><br>` +
      `Comprobación en la curva: F(x,y) = ${format(curveValue)}. ` +
      `Si el valor está cerca de 0, el punto pertenece a la curva.`;

    draw();
    return;
  }

  const x = Number(xValue.value);

  if (!currentExercise.domain(x) || (currentExercise.derivativeDomain && !currentExercise.derivativeDomain(x))) {
    evaluationResult.textContent = "La derivada no está definida en ese valor de x.";
    evaluatedPoint = null;
    draw();
    return;
  }

  const y = currentExercise.f(x);
  const slope = currentExercise.fp(x);

  if (!Number.isFinite(y) || !Number.isFinite(slope)) {
    evaluationResult.textContent = "No se puede evaluar la función o la derivada en ese punto.";
    evaluatedPoint = null;
    draw();
    return;
  }

  evaluatedPoint = { x, y, slope };

  evaluationResult.innerHTML =
    `f(${format(x)}) = <strong>${format(y)}</strong><br>` +
    `f'(${format(x)}) = <strong>${format(slope)}</strong><br>` +
    `Interpretación: la pendiente de la función en x = ${format(x)} es ${format(slope)}.`;

  draw();
}

function draw() {
  const width = canvas.width;
  const height = canvas.height;
  const bounds = currentExercise.bounds;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  drawGrid(bounds, width, height);
  drawAxes(bounds, width, height);

  if (currentExercise.mode === "implicit") {
    drawImplicitCurve(bounds, width, height);
  } else {
    drawExplicitFunction(bounds, width, height, currentExercise.f, currentExercise.domain, "#2563eb", 3);
    drawExplicitFunction(
      bounds,
      width,
      height,
      currentExercise.fp,
      x => currentExercise.derivativeDomain ? currentExercise.derivativeDomain(x) : currentExercise.domain(x),
      "#dc2626",
      2
    );
  }

  drawEvaluatedPoint(bounds, width, height);
  drawGraphTitle();
}

function drawGrid(bounds, width, height) {
  ctx.save();
  ctx.strokeStyle = "#ece7f7";
  ctx.lineWidth = 1;

  for (let x = Math.ceil(bounds.xMin); x <= Math.floor(bounds.xMax); x++) {
    const sx = toScreenX(x, bounds, width);
    ctx.beginPath();
    ctx.moveTo(sx, margin);
    ctx.lineTo(sx, height - margin);
    ctx.stroke();
  }

  for (let y = Math.ceil(bounds.yMin); y <= Math.floor(bounds.yMax); y++) {
    const sy = toScreenY(y, bounds, height);
    ctx.beginPath();
    ctx.moveTo(margin, sy);
    ctx.lineTo(width - margin, sy);
    ctx.stroke();
  }

  ctx.restore();
}

function drawAxes(bounds, width, height) {
  ctx.save();
  ctx.strokeStyle = "#312e40";
  ctx.fillStyle = "#312e40";
  ctx.lineWidth = 2;
  ctx.font = "13px Segoe UI";

  const xAxis = toScreenY(0, bounds, height);
  const yAxis = toScreenX(0, bounds, width);

  ctx.beginPath();
  ctx.moveTo(margin, xAxis);
  ctx.lineTo(width - margin, xAxis);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(yAxis, margin);
  ctx.lineTo(yAxis, height - margin);
  ctx.stroke();

  ctx.fillText("x", width - margin + 12, xAxis + 5);
  ctx.fillText("y", yAxis + 8, margin - 12);

  drawTicks(bounds, width, height, xAxis, yAxis);
  ctx.restore();
}

function drawTicks(bounds, width, height, xAxis, yAxis) {
  const xStep = chooseStep(bounds.xMin, bounds.xMax);
  const yStep = chooseStep(bounds.yMin, bounds.yMax);

  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const sx = toScreenX(x, bounds, width);
    ctx.beginPath();
    ctx.moveTo(sx, xAxis - 4);
    ctx.lineTo(sx, xAxis + 4);
    ctx.stroke();

    if (Math.abs(x) > 0.0001) {
      ctx.fillText(format(x), sx - 10, xAxis + 19);
    }
  }

  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const sy = toScreenY(y, bounds, height);
    ctx.beginPath();
    ctx.moveTo(yAxis - 4, sy);
    ctx.lineTo(yAxis + 4, sy);
    ctx.stroke();

    if (Math.abs(y) > 0.0001) {
      ctx.fillText(format(y), yAxis + 8, sy + 4);
    }
  }

  ctx.fillText("0", yAxis + 7, xAxis + 18);
}

function drawExplicitFunction(bounds, width, height, fn, domain, color, lineWidth) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  const samples = 1600;
  let started = false;
  let previousY = null;

  for (let i = 0; i <= samples; i++) {
    const x = bounds.xMin + ((bounds.xMax - bounds.xMin) * i) / samples;

    if (!domain(x)) {
      started = false;
      previousY = null;
      continue;
    }

    const y = fn(x);

    if (!Number.isFinite(y) || y < bounds.yMin - 20 || y > bounds.yMax + 20) {
      started = false;
      previousY = null;
      continue;
    }

    const sx = toScreenX(x, bounds, width);
    const sy = toScreenY(y, bounds, height);

    if (previousY !== null && Math.abs(y - previousY) > (bounds.yMax - bounds.yMin) * 0.45) {
      started = false;
    }

    if (!started) {
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }

    previousY = y;
  }

  ctx.stroke();
  ctx.restore();
}

function drawImplicitCurve(bounds, width, height) {
  ctx.save();
  ctx.fillStyle = "#2563eb";

  const xSamples = 500;
  const ySamples = 360;
  const dx = (bounds.xMax - bounds.xMin) / xSamples;
  const dy = (bounds.yMax - bounds.yMin) / ySamples;
  const tolerance = 0.055;

  for (let i = 0; i <= xSamples; i++) {
    const x = bounds.xMin + i * dx;

    for (let j = 0; j <= ySamples; j++) {
      const y = bounds.yMin + j * dy;
      const value = currentExercise.implicitF(x, y);

      if (Math.abs(value) < tolerance) {
        const sx = toScreenX(x, bounds, width);
        const sy = toScreenY(y, bounds, height);
        ctx.fillRect(sx, sy, 2, 2);
      }
    }
  }

  ctx.restore();
}

function drawEvaluatedPoint(bounds, width, height) {
  if (!evaluatedPoint) return;

  const { x, y, slope } = evaluatedPoint;

  if (!isInside(x, y, bounds)) return;

  const sx = toScreenX(x, bounds, width);
  const sy = toScreenY(y, bounds, height);

  ctx.save();

  ctx.fillStyle = "#f59e0b";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(sx, sy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawTangentLine(x, y, slope, bounds, width, height);

  ctx.fillStyle = "#231b35";
  ctx.font = "13px Segoe UI";
  ctx.fillText(`(${format(x)}, ${format(y)})`, sx + 10, sy - 10);

  ctx.restore();
}

function drawTangentLine(x, y, slope, bounds, width, height) {
  if (!Number.isFinite(slope)) return;

  const delta = (bounds.xMax - bounds.xMin) * 0.13;
  const x1 = x - delta;
  const y1 = y - slope * delta;
  const x2 = x + delta;
  const y2 = y + slope * delta;

  ctx.save();
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  ctx.beginPath();
  ctx.moveTo(toScreenX(x1, bounds, width), toScreenY(y1, bounds, height));
  ctx.lineTo(toScreenX(x2, bounds, width), toScreenY(y2, bounds, height));
  ctx.stroke();

  ctx.restore();
}

function drawGraphTitle() {
  ctx.save();
  ctx.fillStyle = "#231b35";
  ctx.font = "bold 19px Segoe UI";
  ctx.fillText(currentExercise.title, 22, 34);
  ctx.restore();
}

function downloadGraph() {
  const link = document.createElement("a");
  link.download = "grafica-derivada.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function toScreenX(x, bounds, width) {
  const ratio = (x - bounds.xMin) / (bounds.xMax - bounds.xMin);
  return margin + ratio * (width - margin * 2);
}

function toScreenY(y, bounds, height) {
  const ratio = (y - bounds.yMin) / (bounds.yMax - bounds.yMin);
  return height - margin - ratio * (height - margin * 2);
}

function chooseStep(min, max) {
  const range = max - min;

  if (range <= 5) return 0.5;
  if (range <= 12) return 1;
  if (range <= 25) return 2;

  return 5;
}

function isInside(x, y, bounds) {
  return x >= bounds.xMin && x <= bounds.xMax && y >= bounds.yMin && y <= bounds.yMax;
}

function format(value) {
  if (!Number.isFinite(value)) return "No definido";

  const rounded = Math.round(value * 1000) / 1000;

  if (Object.is(rounded, -0)) return "0";

  return String(rounded);
}

init();
