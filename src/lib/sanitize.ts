// Recap articles are stored as HTML (article_content) and must be sanitized
// before being rendered with dangerouslySetInnerHTML. Never skip this.
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote', 'a'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

export function sanitizeArticleHtml(raw: string): string {
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS, ALLOWED_ATTR });
}
