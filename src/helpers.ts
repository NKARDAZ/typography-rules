export const NODE_MARKER = '\uE000\uEDFD\uF43E';
export const PROTECTION_MARKER = '\uE001\uEDF1\uF111';

export const PROTECTED_PATTERNS = [
	/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g, // E-mail
	/https?:\/\/[^\s]+/g, // URL
	/\/[a-zA-Z0-9._\-/]+\.[a-zA-Z0-9]+/g, // Unix path
	/[A-Za-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*/g, // Windows path
	/<\/?[a-zA-Z][^>]*>/g, // HTML/XML tag
	/`[^`\n]+`/g, // Inline code
	/```[\s\S]*?```/g, // Block code
	/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, // UUID
	/\b[0-9a-f]{7,40}\b/gi, // Hash
	/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, // IP
	/[.#][A-Za-z_][\w-]*/g, // Selector
	/--?[a-zA-Z][\w-]*/g, // CLI option
	/\bv?\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?\b/g, // Version
	/\b(?:97[89][- ]?)?(?:\d[- ]?){9}[\dX]\b/g, // ISBN
	/\b\d{4}-\d{3}[\dX]\b/g, // ISSN
	/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/gi, // DOI
	/\b\d{4}-\d{4}-\d{4}-\d{3}[\dX]\b/g, // ORCID
];
