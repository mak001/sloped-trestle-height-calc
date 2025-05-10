let data;

const getCanvasContext = () => {
  const canvas = document.getElementById("slopeCanvas");
  const ctx = canvas.getContext("2d");
  return {
    canvas,
    ctx,
  };
};

// .getPropertyValue('--bar')
const getStyle = () => {
  return window.getComputedStyle(document.body);
};

const getCSSVar = (varName) => {
  const cssVar = getStyle().getPropertyValue(varName);
  return cssVar ? cssVar : getCSSVar("--color-base-content");
};

const drawTriangle = () => {
  const { canvas, ctx } = getCanvasContext();

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the triangle
  ctx.beginPath();
  ctx.moveTo(50, 10);
  ctx.lineTo(750, 60);
  ctx.lineTo(50, 60);
  ctx.closePath();

  ctx.strokeStyle = getCSSVar("--color-base-content");
  ctx.stroke();
};

const drawSupportingLines = (num) => {
  const { ctx } = getCanvasContext();

  ctx.font = "16px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const angle = calculateDrawnAngle(50, 700);
  const supports = calculateSupportingLines(num, 700, angle);
  for (let i = 0; i < supports.length; i++) {
    const { supportPos, supportHeight } = supports[i];
    const x = 750 - supportPos;
    const y = 60 - (50 - supportHeight);
    console.log(supportPos, supportHeight, x);

    ctx.beginPath();
    ctx.strokeStyle = i % 2 === 0 ? getCSSVar("--color-primary") : getCSSVar("--color-accent");
    ctx.moveTo(x, 60);
    ctx.lineTo(x, y);
    ctx.stroke();

    // draw the label
    ctx.fillStyle = i % 2 === 0 ? getCSSVar("--color-primary") : getCSSVar("--color-accent");
    ctx.fillText(supports.length - i, x, 80);
  }
};

const calculateDrawnAngle = (height, length) => {
  return Math.atan(height / length);
};

const calculateSupportingLines = (supportCount, length, slopeAngle) => {
  const supportDistance = length / (supportCount + 1);
  const supports = [];
  for (let i = 1; i < supportCount + 1; i++) {
    const supportPos = i * supportDistance;
    const supportHeight = (length - (i * supportDistance)) * Math.tan(slopeAngle);
    supports.push({supportPos, supportHeight});
  }
  return supports;
};

const calculate = (form) => {
  const slopePercent = parseFloat(form.elements["slopePercent"].value);
  const slopeAngle = Math.atan(slopePercent / 100);

  const degSlope = (slopeAngle * 180) / Math.PI;

  const endingHeight = parseFloat(form.elements["endingHeight"].value);
  const length = endingHeight / Math.tan(slopeAngle);

  const  numSupports = parseInt(form.elements["numSupports"].value);

  const maxDistance = parseFloat(form.elements["maxDistance"].value);
  
  let supportCount = numSupports;
  let usedMaxDistance = false;
  
  if (!numSupports || (maxDistance && (length / numSupports) > maxDistance)) {
    supportCount = Math.ceil(length / maxDistance) - 1;
    usedMaxDistance = true;
  }
  const supportDistance = length / supportCount;
  const supports = calculateSupportingLines(supportCount, length, slopeAngle);

  const output = {
    slopePercent,
    slopeAngleDeg: degSlope,
    slopeAngleRad: slopeAngle,
    endingHeight,
    length,
    supportCount,
    supportDistance,
    supports,
    usedMaxDistance,
  }
  console.log(output);
  return output;
};

const fillResultTable = (data) => {
  document.getElementById("tableEndingHeight").innerText = data.endingHeight;
  document.getElementById("tableSupportDistance").innerHTML = 
    `${data.supportDistance.toFixed(2)}<span class="tooltiptext">${data.supportDistance}</span>`;
  document.getElementById("tableNumSupports").innerText = data.supportCount;
  document.getElementById("tableSlopeLength").innerText = data.length;

  const table = document.getElementById("supportsBody");
  table.innerHTML = ""; // Clear previous rows
  for (let i = data.supports.length - 1; 0 <= i; i--) {
    const { supportPos, supportHeight } = data.supports[i];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.supports.length - i}</td>
      <td class="tooltip">${supportHeight.toFixed(2)}<span class="tooltiptext">${supportHeight}</span></td>
      <td class="tooltip">${supportPos.toFixed(2)}<span class="tooltiptext">${supportPos}</span></td>
    `;
    table.appendChild(row);
  }
};

const render = () => {
  drawTriangle();
  drawSupportingLines(data.supportCount);
  fillResultTable(data);
}

document.addEventListener("DOMContentLoaded", () => {
  drawTriangle();

  document.addEventListener("submit", (event) => {
    event.preventDefault();
    data = calculate(event.target);
    render();
  });

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', render);
});
 