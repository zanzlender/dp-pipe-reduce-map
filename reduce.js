import fetch from "node-fetch";

// ...args(agregator, trenutnaVrijednost, index, polje)
Array.prototype.mojReduce = function (...args) {
  const hasStartingValue = args.length > 1;

  if (!hasStartingValue && this.length === 0) {
    throw new Error();
  }

  let result = hasStartingValue ? args[1] : this[0];

  for (let i = hasStartingValue ? 0 : 1; i < this.length; i++) {
    result = args[0](result, this[i], i, this);
  }

  return result;
};

/**
 * Primjer 1.1. - Dohvaćanje podataka za newsltetter
 *
 * Funkcija prima polje brojeva i vraća njihovu sumu
 */
const array = [1, 5, 2, 10, 25, 62];

console.log("-----------------------------");
console.log("Primjer .map() funkcije za polje brojeva");
console.log("-----------------------------\n");
console.log("Zadano polje: ", array);

let rezultat_1 = array.reduce((prev, current) => {
  return prev + current;
});
console.log("Rezultat .reduce(): ", rezultat_1);

let rezultat_2 = array.mojReduce((prev, current) => {
  return prev + current;
});
console.log("Rezultat .mojReduce(): ", rezultat_2);

/**
 * Primjer 1.2. - array brojeva (edge case)
 *
 * primjer za neke neuobičajene slučajeve,
 * kao što je npr. prosljeđivanje praznog ili nedefiniranog elementa
 */
const array2 = [1, "5", null, 10, undefined, 62];
console.log("\nZadano polje 2: ", array2);

let rezultat_3 = array2.reduce(function (prev, current) {
  return prev + current;
});
console.log("Rezultat .reduce(): ", rezultat_3);

let rezultat_4 = array2.mojReduce(function (prev, current) {
  return prev + current;
});
console.log("Rezultat .mojReduce(): ", rezultat_4);

/**
 * Primjer 2.1. - Dohvaćanje podataka za o TODO zadacima
 *
 * Funkcija prima polje od 100 zadataka i vraća objekt tipa
 * { done: 0, todo: 0}
 * gdje done reprezentira sumu odrađenih zadataka, a todo neodrađenih
 */
console.log("\n\n-----------------------------");
console.log("Primjer .map() funkcije za polje zadataka");
console.log("-----------------------------\n");

let commentsArray = await fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => response.json())
  .then((json) => {
    return json;
  });

console.log("Dohvaćeno je ", commentsArray.length, " zadataka!");
console.log("Dohvaćeni zadaci su sljedećeg oblika:");
console.log(commentsArray[0]);

let tasks = commentsArray.reduce(
  (sum, current) => {
    if (current.completed == true) sum.done += 1;
    if (current.completed == false) sum.todo += 1;

    return sum;
  },
  { done: 0, todo: 0 }
);

console.log("\nRezultat mapiranja je:");
console.log(tasks);
console.log("\n----------------------------------");
