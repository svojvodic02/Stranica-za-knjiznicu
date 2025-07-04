# Library-Page

Tema projekta je stranica knjižnice. Ima mogućnost registracije novog korisnika i funkciju ulogiravanja, te postoji validacija za oba unosa. Kada se korisnik ulogira ima mogućnost dodavanja knjige, njezino ime, pisca i žanr. Žanr se odabire iz pomoćnog izbornika. Ima mogućnost editiranja i brisanja svojih dodanih knjiga. Može posuditi knjige, ali samo one koje nije on dodao. Posuđene knjige se mogu vidjeti u korisnikovom, tamo može vratiti knjigu. Na profilu isto može editirati svoj username i gmail. Ako je korisnik „Admin“ dobiva mogućnost ulaska na „Admin Panel“ stranicu gdje vidi sve korisnike i žanrove. Može editirati i brisati korisnike i žanrove, te može dodavati nove žanrove. Na kraju postoji mogućnost logout-a. 
Iz zahtjeva projekta jedino nedostaje hashiranje lozinka u bazi, jedan custom pipe, zaštićen je pristup API-ju pomoću tokena, i da je korisničko sučelje napravljeno slijeđenjem osnovnih bootstrap principa (ili nekog drugog CSS librarya).

ANGULAR + NODE.JS (max 45 bodova)

Model podataka u bazi – 3
•	Minimalno 3 vrste entiteta koji imaju smisla ne računajući korisnike (tj. tablice odnosno dokumenta u bazi)
•	Tipovi podataka u tablicama imaju smisla
•	Ispravno označena veza među objektima (primarni/strani ključ i/ili embedded dokumenti)

Angular Routing – 2
•	Routing uspješno implementiran
•	Postoji glavni izbornik u aplikaciji
•	Postoji ruta s custom parametrima

CRUD operacije nad svim entitetima kroz aplikaciju – 10
•	Kroz aplikaciju je moguće pročitati podatke za sve entitete (ovisno o dozvolama)
•	Kroz aplikaciju je moguće obavljati CRUD operacije za barem jedan entitet
•	Kroz aplikaciju je moguće unijeti novi podatak za sve entitete (ovisno o dozvolama)
•	Postoji validacija pri unosu podataka (Angular Reactive ili Template forms) sa automatskom dojavom krivog unosa

Autorizacija i autentikacija – 7
•	Korisniku se ispisuju greške pri loginu (krivo korisničko ime, kriva lozinka)
•	Omogućena je registracija korisnika
•	Postoje različite razine prava pristupa (administracijski dio)
•	Implementirana je autentifikacija pomoću tokena

Pipeovi i servisi – 3
•	Definiran je Angular servis za spajanje na API

Server, RESTful API – 10
•	Rute na poslužitelju su definirane na RESTful način
•	Postoji mogućnost dohvata svih entiteta pomoću API-ja
•	API je RESTful za sve entitete
•	Postoji mogućnost dodavanja, izmjene i brisanja barem jednog entiteta putem API-ja (CRUD)
•	Definirana je barem jedna ruta s parametrima na API-ju

Korisničko sučelje – 2
•	Korisničko sučelje je intuitivno i user-friendly

Sturktura projekta – 2
•	Projekt je pravilno i pregledno strukturiran

