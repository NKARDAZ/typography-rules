import { newRule } from '@/api';

export default [
	newRule('/ænglisċ/articles/þe', /\s+The\s+/g, ` Þ\u0364 `),
	newRule('/ænglisċ/articles/þe', /\s+the\s+/g, ` þ\u0364 `),
	newRule('/ænglisċ/articles/þe', /\s+Þe\s+/g, ` Þ\u0364 `),
	newRule('/ænglisċ/articles/þe', /\s+þe\s+/g, ` þ\u0364 `),
];
