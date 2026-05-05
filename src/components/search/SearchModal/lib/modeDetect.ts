export function isAIQuery(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.includes('?')) return true;
  if (t.split(/\s+/).length > 4) return true;
  const aiStarters =
    /^(who|what|which|how|why|when|where|show|find|list|tell|give|get|are|is|do|does|can|should)\b/i;
  return aiStarters.test(t);
}
