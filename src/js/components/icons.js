// components/icons.js
const siteFeatureIcon = (kind) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${kind === 'document' ? '<path d="M6 3H15L19 7V21H5V3Z"/><path d="M14 3V8H19M8 12H16M8 16H13"/>' : kind === 'label' ? '<path d="M3 5V12L12 21 21 12 12 3H5Z"/><circle cx="8" cy="8" r="1.3"/><path d="M11 12L15 16"/>' : '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9H21M7 13H11M7 16H17"/>'}</svg>`;
