import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker/locale/en';
 
 
test.describe('API test', () => {
    //get all book test API
    test('Get all books', async({page, request}) => { //request je nas objekat nad kojim cemo pozivati nase metode
        //1.URL kako treba da izgleda -> https://demoqa.com/BookStore/v1/Books
        //2.HTTP metod -> GET
        await request.get('https://demoqa.com/BookStore/v1/Books');
        //response -> objekat koji sadrzi odgovor koji server vraca
        const response = await request.get('https://demoqa.com/BookStore/v1/Books'); //endpoint stavljamo ovde URL
        //provera da li je response dobar -> provera status koda -> non retrying asertacije
        expect(response.status()).toBe(200); //ocekujem da status code bude 200
        //toBeTruthy() - mozemo i sa ovim da proverimo
        expect(response).toBeOK(); //statusi od 200 do 299 (tj. OK statusi)
        //koristimo dalje nas response objekat
        //response.json() -> uzima ceo body i pretvara(parsira) ga u JSON
        const data = await response.json();
        console.log(data); //stampanje odgovora prevedenog u JSON
        //iz reponse-a dobavimo broj ocekivanih knjiga -> idemo na stranicu i verifikujemo da je taj br knjiga prikazan
        //iz data dela izvlacimo books
        const booksCount = data.books.length; //length svojstvo koje proveravamo nad nizovima -> koliko knjiga ima u nasem repsonse-u i to postaje nas ocekivani rez
        //UI deo testa na stranici
        await page.goto('https://demoqa.com/books');
        //prikupljamo sve knjige
        const allBooksDisplayed = page.locator('tbody tr');
        //tbody je roditeljski tag a tr je child i mozemo samo tako da uzmemo selektor po tagu
        await expect(allBooksDisplayed).toHaveCount(booksCount);
 
    })
 
    test('Register user', async({page, request}) => {
        //unikatni username / sifru treba da imamo
        const username = faker.internet.username({firstName: 'Lenka'}); //dajem svoje ime da faker napravi neke varijante random od toga
        //zelim dodatnu sigurnost da ce biti jedinstven username
         //timestamp -> Date.now() -> vreme u ms koje je proslo od 01.01.1970. (Unix epoha)
         const uniqueUsername = `${username}_${Date.now()}`;
         //const username = `${faker.internet.username({ firstName: 'Lenka' })}_${Date.now()}`; - moglo je u jednoj liniji

 
        const password = faker.internet.password({length: 12, prefix: 'Aa#1'}); //dali smo prva 4 slova nase sifre
        //Na sajtu ovom je obavezno 1 veliko slovo, 1 malo i 1 specijalan karakter, 1 br. i min 12 karaktera
        console.log(`${uniqueUsername}, ${password}`);
        //registracija kroz API
        //request post saljemo da se uradi registracija
        const response = await request.post('https://demoqa.com/Account/v1/User', { //endpoint
            //objekat -> username i sifru ce imati -> ovo je body
            data: {
                userName: uniqueUsername,
                password: password
            }
 
        })
 
        //nakon ovog zahteva ako je uspenas na serveru je nas novi korisnik
        expect(response.status()).toBe(201);
        //expect(response).toBeOK();
 
        //da li sad novi korisnik moze da se uloguje kada smo ga napravili?
        //Kroz API verifikujemo da moze login
        const loginResponse = await request.post('https://demoqa.com/Account/v1/Login', {
            data: {
                userName: uniqueUsername,
                password: password
            }
        })
 
        expect(loginResponse.status()).toBe(200);
        //Idealno bi bilo da obrisemo korisnika, ali nemamo permisije
 
 
 
 
 
 
 
 
    })
 
 
 
 
})
 
test.describe('Intercept', () => {
    test('No available books', async({page}) => {
        //Komanda za intercept -> page.route
        //pre goto() -> definisemo koji zahtev zelimo da presretnemo i na koji nacin zelimo da ga izmenimo
        await page.route('https://demoqa.com/BookStore/v1/Books', async(route) => {
            //zahtev nece ni stici do servera. mi cemo ga zaustaviti
            //simuliramo odgovor
            //route.fulfill
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({books: []}) //Ovde cemo umesto books da stavimo sta mi hocemo tj prazno da ostavimo
//await route.abort() ->
            })
        })
        //ocekivani rezultat definisemo
        //najbolji slucaj je da nema nijedne knjige da aplikacija zna da reaguje u toj situaciji, kada smo joj prazno prosledili
        await page.goto('https://demoqa.com/books');
        //nakon dolaska na stranicu se aktivira intercept -> u ovom momentu se salje browseru izmenjeni
        const allBooksDisplayed = page.locator('tbody tr');
        await expect(allBooksDisplayed).toHaveCount(0);
 
    })
 
    test('Inject test book to the list', async({page}) => {
        //get all books zahtev
        await page.route('https://demoqa.com/BookStore/v1/Books', async(route) => {
            //fetch() -> dobavlja odg sa servera onakav kakav je, ali cemo mi da ga promenimo
            const originalResponse = await route.fetch(); //stvarni odgovor
            const originalDara = await originalResponse.json();
 
            //dodajemo neki testni podatak (edge case, nedostajuci podatak)
            const testBook = { "isbn": "9",
            "title": "Git Pocket Guide",
            "subTitle": "A Working Introduction",
            "author": "Richard E. Silverman",
            "publish_date": "2020-06-04T08:48:39.000Z",
            "publisher": "O'Reilly Media",
            "pages": 234,
            "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
            "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
 
            }
 
            //dodajem testnu knjigu nizu original data
            //push -> na kraju niza
            //unshfit -> na pocetak
            originalDara.books.unshfit(testBook);
 
            //vracamo izmenjeni odgovor
            await route.fulfill({
                status: originalResponse.status(),
                headers: originalResponse.headers(),
                contentType: 'application/json',
                body: JSON.stringify(originalDara) //ovo je ustvari promenjen kontent jer smo izmenili original datu
 
            })
 
        })
    })
   
})
 
//3rd party -> da ne radi PayPal - PW savetuje preskakanje toka unutar 3rd party
//dodajemo nesto odgovoru sa servera
 