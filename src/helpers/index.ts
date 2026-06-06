/**
 * Private Use Area (PUA) marker sequence used to identify AST nodes.
 *
 * This marker is embedded into text during preprocessing stages
 * to preserve structural boundaries through transformations.
 *
 * Must remain unique and never appear in natural text.
 */
export const NODE_MARKER = '\uE000\uEDFD\uF43E';

/**
 * Private Use Area (PUA) marker sequence used for protected regions.
 *
 * Used to temporarily wrap substrings that must not be modified
 * during typography or text-processing pipelines.
 *
 * Typically applied before regex-based transformations.
 */
export const PROTECTION_MARKER = '\uE001\uEDF1\uF111';

/**
 * RegExp matcher for NODE_MARKER sequences.
 *
 * Used to locate and remove node markers during cleanup phase
 * of text processing pipeline.
 */
export const NODE_MARKER_REGEX = new RegExp(NODE_MARKER, 'g');

/**
 * RegExp matcher for PROTECTION_MARKER sequences.
 *
 * Used to detect protected regions in processed text
 * and restore original content where necessary.
 */
export const PROTECTION_MARKER_REGEX = new RegExp(PROTECTION_MARKER, 'g');

/**
 * Registry of protected regex patterns used in text preprocessing.
 *
 * These patterns are temporarily excluded from typography transformations
 * by wrapping matches with protection markers.
 *
 * Includes:
 * - URLs and emails
 * - filesystem paths (Unix / Windows)
 * - code blocks and inline code
 * - identifiers (UUID, hashes, ORCID, DOI)
 * - network addresses (IPv4, IPv6, MAC)
 * - programming-related syntax (selectors, CLI flags, versions)
 * - publishing identifiers (ISBN, ISSN)
 *
 * This system ensures that structured technical content
 * is not corrupted by typographic transformations.
 */
export const PROTECTED_PATTERNS = {
	email: /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g,
	url: /https?:\/\/[^\s]+/g,
	unixPath: /\/[a-zA-Z0-9._\-/]+\.[a-zA-Z0-9]+/g,
	windowsPath: /[A-Za-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*/g,
	xmlTag: /<\/?[a-zA-Z][^>]*>/g,
	inlineCode: /`[^`\n]+`/g,
	blockCode: /```[\s\S]*?```/g,
	uuid: /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi,
	hash: /\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b/gi,
	ipv4: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
	ipv6: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
	mac: /\b(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}\b/g,
	selector: /[.#][A-Za-z_][\w-]*/g,
	cliOption: /--?[a-zA-Z][\w-]*/g, //
	version: /\bv?\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?\b/g,
	isbn: /\b(?:97[89][- ]?)?(?:\d[- ]?){9}[\dX]\b/g,
	issn: /\b\d{4}-\d{3}[\dX]\b/g,
	doi: /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/gi,
	orcid: /\b\d{4}-\d{4}-\d{4}-\d{3}[\dX]\b/g,

	/**
	 * Returns all RegExp patterns from the protection registry.
	 *
	 * Filters out computed properties and non-RegExp entries.
	 * Used when applying batch protection in preprocessing pipelines.
	 */
	get values(): RegExp[] {
		return (Object.keys(this) as (keyof typeof PROTECTED_PATTERNS)[])
			.filter((key) => {
				const desc = Object.getOwnPropertyDescriptor(this, key);
				return desc?.value instanceof RegExp;
			})
			.map((key) => this[key] as RegExp);
	},

	/**
	 * Iterator over all RegExp patterns in the protection registry.
	 *
	 * Enables usage in:
	 * for..of loops, spreading, and pipeline-based processing.
	 *
	 * Only yields valid RegExp entries, excluding computed properties.
	 */
	*[Symbol.iterator]() {
		for (const key of Object.keys(this) as (keyof typeof PROTECTED_PATTERNS)[]) {
			const desc = Object.getOwnPropertyDescriptor(this, key);
			if (desc?.value instanceof RegExp) {
				yield this[key];
			}
		}
	},
} as const;
