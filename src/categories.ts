import type { Category } from "./types";

export const defaultCategories: Category[] = [
  { id: 1, name: 'Spouse', values: [{name: "Kier Starmer", struck: false}], selected: false},
  { id: 2, name: 'Kids', values: [{name: "1/2", struck: false}], selected: false},
  { id: 3, name: 'Car', values: [{name: "Pedal-Car", struck: false}], selected: false},
  { id: 4, name: 'Job', values: [{name: "Drying-Paint Watcher", struck: false}], selected: false},
  { id: 5, name: 'Salary', values: [{name: "-£0.13", struck: false}], selected: false},
  { id: 6, name: 'Location', values: [{name: "West Philidelphia", struck: false}], selected: false},
  { id: 7, name: 'Pet', values: [{name: "Pterodactyl", struck: false}], selected: false},
];
