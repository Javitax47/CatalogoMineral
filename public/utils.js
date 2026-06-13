// Utilidades compartidas entre las páginas del catálogo.

// Escapa una cadena para insertarla de forma segura tanto en contenido HTML
// como dentro de un atributo entre comillas. Previene XSS al construir HTML
// con plantillas de texto.
export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Devuelve un color solo si es un hex válido; en caso contrario, un gris por
// defecto. Evita inyección al usar valores en atributos style.
export function safeColor(color) {
  return /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : "#4b5563";
}

// Normaliza los subíndices Unicode de una fórmula a dígitos normales.
export function normalizeFormula(formula) {
  if (!formula) return "";
  const subscriptMap = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  let normalized = "";
  for (const char of formula) normalized += subscriptMap[char] || char;
  return normalized;
}

// Formatea una fórmula química para mostrarla como HTML con subíndices.
// Escapa el contenido antes de envolver los dígitos en <sub> para evitar XSS.
export function formatFormula(formula) {
  if (!formula) return "N/A";
  return escapeHtml(normalizeFormula(formula)).replace(/(\d+)/g, "<sub>$1</sub>");
}
