/**
 * Функция для получения 2 первх букв из одного или 2 слов
 * @param title
 */
export function getLetters(title: string) {
  const letters = title.split(' ');
  if (letters.length === 1) {
    return letters[0].substring(0, 2).toUpperCase();
  } else {
    const l = letters.slice(0, 2).map(letter =>
      letter.charAt(0).toUpperCase());
    return l.join('');
  }
}
