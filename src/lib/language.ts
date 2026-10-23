// A simple, deterministic "is this English?" check (REQ-IN-09). It runs in the page and on the server.
// It compares common English words with common words from other languages that use the Latin alphabet,
// and treats text that is mostly in another alphabet (Cyrillic, Chinese, Arabic, ...) as not English.

const ENGLISH = new Set(
  `the and of to for with on at by from is was were my our an that this will be are or you your we as into across using
  have has had it its their they which who not than also over per`.split(/\s+/),
);

// Words that are common in Spanish, French, German, Portuguese or Italian but not English words themselves.
const OTHER = new Set(
  `de la el los las y en del para con por una que se al como más su sus lo
  le les des et du pour avec dans sur est au aux une
  und der das mit für von zu im ist ein eine auf nicht
  da dos em não uma pelo pela
  il di che della nel gli delle sono`.split(/\s+/),
);

const MIN_LETTERS = 40;

export function looksNonEnglish(text: string): boolean {
  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length < MIN_LETTERS) return false; // too little text to judge

  const latin = letters.filter((ch) => /\p{Script=Latin}/u.test(ch)).length;
  if (latin / letters.length < 0.7) return true;

  let english = 0;
  let other = 0;
  for (const word of text.toLowerCase().match(/\p{L}+/gu) ?? []) {
    if (ENGLISH.has(word)) english++;
    else if (OTHER.has(word)) other++;
  }
  return other >= 3 && other > english;
}
