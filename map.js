import fetch from "node-fetch";

Array.prototype.mojMap = function (callback) {
  let newArray = this;

  // nema el. u polju
  if (this.length === 0) return [];
  // nije proslijeđena funkcija
  if (typeof callback === "undefined") return [];

  for (let index = 0; index < this.length; index++) {
    newArray[index] = callback(this[index], index, this);
  }

  return newArray;
};

/**
 * Primjer 1.1 - Polje brojeva
 *
 * Funkcija uzima polje brojeva, svaki broj množi sa dva
 * i vraća polje rezultata
 */
const array = [1, 5, 2, 10, 25, 62];

console.log("-----------------------------");
console.log("Primjer .map() funkcije za polje brojeva");
console.log("-----------------------------\n");
console.log("Zadano polje: ", array);

// Ugrađena funkcija map
let rezultat_1 = array.map((x) => {
  return x * 2;
});
console.log("Rezultat .map(): ", rezultat_1);

// Moja funkcija map
let rezultat_2 = array.mojMap((x) => {
  return x * 2;
});
console.log("Rezultat .mojMap(): ", rezultat_2);

/**
 * Primjer 1.2. - array brojeva (edge case)
 *
 * primjer za neke neuobičajene slučajeve,
 * kao što je npr. prosljeđivanje praznog ili nedefiniranog elementa
 */
const array2 = [1, "5", null, 10, undefined, 62];
console.log("\nZadano polje 2: ", array2);

let rezultat_3 = array2.map(function (x) {
  return x * 2;
});
console.log("Rezultat .map(): ", rezultat_3);

let rezultat_4 = array2.mojMap(function (x) {
  return x * 2;
});
console.log("Rezultat .mojMap(): ", rezultat_4);

/**
 * Primjer 2.1. - Dohvaćanje podataka za newsltetter
 *
 * Funkcija prima polje korisnika i kreira novo polje
 * objekata koji že sadržavati samo puno ime i adresu korisnika
 */
console.log("\n\n-----------------------------");
console.log("Primjer .map() funkcije za polje korisnika");
console.log("-----------------------------\n");

let postsArray = await fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((json) => {
    return json;
  });

console.log("Dohvaćeno je ", postsArray.length, " korisnika!");
console.log("Dohvaćeni korisnici su sljedećeg oblika:");
console.log(postsArray[0]);

let newsletter = postsArray.map((post) => {
  return {
    full_name: post.name,
    full_address: `${post.address.street}, ${post.address.city} ${post.address.zipcode}, ${post.address.suite}`,
  };
});

console.log("\nBroj zapisa u novokreiranom polju je ", newsletter.length);
console.log("Rezultat mapiranja korisnika je sljedeći: ");
console.log(newsletter);
console.log("\n----------------------------------");
