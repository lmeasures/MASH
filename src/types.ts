export enum Pages {
  Landing = "landing",
  CategorySelecting = "category-selecting",
  MagicNumberSelecting = "magic-number-selecting",
  SelectionSummary = "selection-summary",
  Result = "result"
}

export type CurrentPage = `${Pages}`

/** 
 * Maps a string type to a Key:Value pairing, 
 * where each character in the string becomes a Key, 
 * and it's value type is boolean 
 * 
 * Used to represent whether or not a character has been 'struck out'
 */
export type CharacterBooleanMap<T extends string> = {
  [CHAR in T[number]]: boolean
}

export type Category = {
  id: number,
  name: string,
  values: string[],
  selected: boolean,
  isCustom?: boolean
}