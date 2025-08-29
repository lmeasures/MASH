export type CurrentPage = 
"landing" | 
"category-selecting" | 
"magic-number-selecting" | 
"selection-summary" | 
"result";

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

