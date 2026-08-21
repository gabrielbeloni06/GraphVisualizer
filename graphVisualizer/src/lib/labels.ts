export function nextLabel(existingLabels: string[]): string {
  const used = new Set(existingLabels);
  let round = 1;
  while (true) {
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(97 + i);
      const candidate = round === 1 ? letter : `${letter}${round}`;
      if (!used.has(candidate)) return candidate;
    }
    round++;
  }
}