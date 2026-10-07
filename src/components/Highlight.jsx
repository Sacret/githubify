/**
 *  Highlights all case-insensitive occurrences of search in text
 */
export default function Highlight({ text, search }) {
  if (!search) {
    return text;
  }
  const lowerText = text.toLowerCase();
  const lowerSearch = search.toLowerCase();
  const result = [];
  let start = 0;
  let index = lowerText.indexOf(lowerSearch);
  while (index !== -1) {
    result.push(text.slice(start, index));
    result.push(<mark key={index}>{text.slice(index, index + search.length)}</mark>);
    start = index + search.length;
    index = lowerText.indexOf(lowerSearch, start);
  }
  result.push(text.slice(start));
  return result;
}
