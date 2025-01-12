export default function formatLabel(label) {
  console.log(label);
  const cityMatch = label.match(/^(.*?),/); // Capture city name before comma
  const codeMatch = label.match(/\((.*?)\)/); // Capture code inside parentheses
  if (cityMatch && codeMatch) {
    return `${cityMatch[1]} (${codeMatch[1]})`;
  }
  return label;
}
