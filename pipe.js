import fetch from "node-fetch";
import chalk from "chalk";
import { stdout } from "process";

// Implementacija pipe funkcije
const pipe =
  (...functions) =>
  (initialValue) => {
    let result;

    for (let i = 0; i < functions.length; i++) {
      if (i == 0) {
        result = { ...functions[i](initialValue) };
      } else {
        result = { ...functions[i](result) };
      }
    }

    return result;
  };

/**
 * Primjer 1.1. - Dohvaćanje pronalaženje podataka korisnika i albuma
 *
 * Doohvaća se 100 albuma, 10 korisnika i 5000 podatak o slikama albuma.
 * Trebaju se izvršiti sljedeće funkcije:
 *    --> Za svakog korisnika pronaći njegove albume
 *    --> Svakom albumu pridružiti njegovu sliku
 *    --> Provjeriti je li ime albuma napisano velikim početnim slovom
 *    --> Ispisati nazive albuma i url-ove do njihvih prvog korisnika
 */

console.log("-----------------------------");
console.log("Primjer .pipe() funkcije na primjeru korisnika i albuma");
console.log("-----------------------------\n");

let albumsArray = await fetch("https://jsonplaceholder.typicode.com/albums")
  .then((response) => response.json())
  .then((json) => {
    return json;
  });

console.log("Dohvaćeno je ", albumsArray.length, " albuma!");
console.log("Dohvaćeni albumi su sljedećeg oblika:");
console.log(albumsArray[15]);

let usersArray = await fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((json) => {
    return json;
  });

console.log("\nDohvaćeno je ", usersArray.length, " Korisnika!");
console.log("Dohvaćeni korisnici su sljedećeg oblika:");
console.log(usersArray[0]);

let photosArray = await fetch("https://jsonplaceholder.typicode.com/photos")
  .then((response) => response.json())
  .then((json) => {
    return json;
  });

console.log("\nDohvaćeno je ", photosArray.length, " slika!");
console.log("Dohvaćene slike su sljedećeg oblika:");
console.log(photosArray[0]);

function spojiKorisnikeSaAlbumima({ korisnici, albumi, slike }) {
  let korisniciAlbumi = korisnici.map((korisnik) => {
    korisnik.albums = [];
    albumi.forEach((album) => {
      if (korisnik.id == album.userId) {
        korisnik.albums = [
          ...korisnik.albums,
          { id: album.id, title: album.title },
        ];
      }
    });

    return korisnik;
  });

  return { korisnici: korisniciAlbumi, slike };
}

function ProvjeriNaziveAlbuma({ korisnici, slike }) {
  let korisniciAlbumi = korisnici.map((korisnik) => {
    korisnik.albums = korisnik.albums.map((album) => {
      if (!ProvjeriVelikoPocetnoSlovo(album.title)) {
        album.title = PostaviiVelikoPocetnoSlovo(album.title);
      }

      return album;
    });

    return korisnik;
  });

  return { korisnici: korisniciAlbumi, slike };
}

function ProvjeriVelikoPocetnoSlovo(rijec) {
  return rijec.charAt(0) === rijec.charAt(0).toUpperCase();
}

function PostaviiVelikoPocetnoSlovo(rijec) {
  return rijec.charAt(0).toUpperCase() + rijec.slice(1);
}

function SpojiAlbumeSaSlikama({ korisnici, slike }) {
  let korisniciSlike = korisnici.map((korisnik) => {
    korisnik.albums = korisnik.albums.map((album) => {
      album.slika = slike.find((slika) => (slika.albumId = album.id)).url;

      return album;
    });

    return korisnik;
  });

  return korisniciSlike;
}

function IspisiNaziveAlbuma(korisnici) {
  console.log("\n\nFinalni rezultat pipe funkcije je:\n");

  korisnici[0].albums.forEach((album) => {
    stdout.write(`Slika albuma || `);
    stdout.write(chalk.bold(`${album.title}`));
    stdout.write(` || dostupna je na: `);
    stdout.write(chalk.blueBright(`${album.slika} \n`));
  });
}

/**
 * TESTIRANJE FUNKKCIJA
 */

// U ovom dijelu se funkcije izvršavaju redeom kako je definirano u opisu
let rezultat_1 = spojiKorisnikeSaAlbumima({
  korisnici: usersArray,
  albumi: albumsArray,
  slike: photosArray,
});

let rezultat_2 = ProvjeriNaziveAlbuma(rezultat_1);

let rezultat_3 = SpojiAlbumeSaSlikama(rezultat_2);

IspisiNaziveAlbuma(rezultat_3);

// U nastavku slijedi izvršavanje svih funkcije pomoću pipe funkcije
pipe(
  spojiKorisnikeSaAlbumima,
  ProvjeriNaziveAlbuma,
  SpojiAlbumeSaSlikama,
  IspisiNaziveAlbuma
)({ korisnici: usersArray, albumi: albumsArray, slike: photosArray });
