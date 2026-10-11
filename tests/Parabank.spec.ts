import {test, expect} from '@playwright/test';
import messages from '../../parabank-project/testData/errorMessages.json';
import { RegisterPage } from '../register page/registrationUser-page';
import { faker } from '@faker-js/faker/locale/en';


test('visbility of all elements 1', async({page}) => {
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await expect(page).toHaveURL('https://parabank.parasoft.com/parabank/index.htm');
    const allElements = [
        page.locator('.logo'),
        page.locator('.leftmenu'),
        page.locator('#leftPanel'),
        page.getByText('Forgot login info?'),
        page.getByText('Register'),
        page.locator('#rightPanel'),
        page.locator('#footermainPanel'),
    ];
     for(let i=0; i < allElements.length; i++) {
      await expect(allElements[i]).toBeVisible();
      };
    })

test('Left menu links verification 2', async({page}) => {
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await expect(page).toHaveURL('https://parabank.parasoft.com/parabank/index.htm');
    const leftMenuOptions = page.locator('.leftmenu li');
    const arrayLeftMenuOptions = await leftMenuOptions.all();


      for(let i=0; i < arrayLeftMenuOptions.length; i++) {
      await expect(arrayLeftMenuOptions[i]).toBeVisible();
      }
      
    const clickableOptions = page.locator('.leftmenu li a');

    const clickableArraye = await clickableOptions.all();
    await expect(clickableOptions).toHaveCount(5);

    for(let i=0 ; i < clickableArraye.length; i++) {
      await clickableArraye[i].click(); //solutions nema a atribut zbog toga krecem od nule
      await expect(page).not.toHaveURL('https://parabank.parasoft.com/parabank/index.htm');
      await page.goBack();
      }

    const expectedText = ['Solutions', 'About Us', 'Services', 'Products', 'Locations', 'Admin Page'];
    const expectedTextArray = await leftMenuOptions.all();

     for(const [index, element] of expectedTextArray.entries()) {
            const expected = expectedText[index];
            await expect(element).toHaveText(expected);
        }


    })

test('Log in section verification 3', async({page}) => {
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await expect(page).toHaveURL('https://parabank.parasoft.com/parabank/index.htm');
    const loginOptions = page.locator('#loginPanel');

    const elements =[
        'input[name="username"]',
        'input[name="password"]',
        'input[value="Log In"]',
        'a:has-text("Forgot login info?")',
        'a:has-text("Register")',
    ];

    for (const element of elements) {
        await expect(loginOptions.locator(element)).toBeVisible();

    }

    const linkForgotLogin = page.getByText('Forgot login info?');
    const linkRegister = page.getByText('Register');
    await linkForgotLogin.click();
    await expect(page).toHaveURL(/\/parabank\/lookup\.htm/); //treba regex jer je demo stranica i test pada zbog jsessionid-a koji se menja svaki put
    await page.goBack();
    await linkRegister.click();
    await expect(page).toHaveURL(/\/parabank\/register\.htm/); 

    });

test('Register section verification 4', async({page}) => {
await page.goto('https://parabank.parasoft.com/parabank/index.htm');
const linkRegister = page.getByText('Register');
await linkRegister.click();
await expect(page).toHaveURL(/\/parabank\/register\.htm/);
const registrationFieldInput = page.locator('#customerForm .input');
await expect(registrationFieldInput).toHaveCount(11);
const registrationButton = page.locator('input[value="Register"]');
await expect(registrationButton).toHaveCount(1);
await registrationButton.click();
const errorMessages = page.locator('.error');

 for(let i=0 ; i < messages.RegistrationErrors.length; i++) {
     await expect(errorMessages.nth(i)).toHaveText(messages.RegistrationErrors[i]); //nth se referise na page locator

    }

    });

test.describe('Registration, login and open new acount for registered user 5, 7, 8', () => {
const fakerDataUsername = faker.internet.username();
const fakerFirstName = faker.person.firstName();
    test.beforeEach('Registration 5', async({page}) => {
     //pada test zbog first name-a
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    const linkRegister = page.getByText('Register');
    await linkRegister.click();
    const registerPage = new RegisterPage(page);
    await registerPage.fill_inputFields(fakerFirstName, 'Vuk', 'Adressa 1', 'Novi Sad', 'Srbija', '21000', '+381645678900', 'Q', fakerDataUsername, 'Sara543!!!', 'Sara543!!!');
    const registrationButton = page.locator('input[value="Register"]');
    await registrationButton.click();
    const successMessage = page.getByText('Welcome ' + fakerDataUsername);
    await expect(successMessage).toBeVisible(); //test ce pasti nakon drugog pustanja bez fejkera zato sto je korisnik vec registrovan
    //const errorMessageUsername = page.getByText('This username already exists.');
     //if(await successMessage.isVisible()){
    //await expect(successMessage).toBeVisible();
    // }

     //if(await errorMessageUsername.isVisible()){
    //await expect(errorMessageUsername).toBeVisible(); //u slucaju da ne koristimo faker, test ce proci sa ovim uslovom
      //}
    });


    test.beforeEach('Login 7', async({page}) => {
    const logout = page.locator('a[href="logout.htm"]');
    await logout.click();
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await expect(page).toHaveURL('https://parabank.parasoft.com/parabank/index.htm');
    const loginUsername = page.locator('input[name="username"]');
    const loginPassword = page.locator('input[name="password"]')
    await expect(loginUsername).toBeVisible();
    await loginUsername.fill(fakerDataUsername);
    await expect(loginUsername).toHaveValue(fakerDataUsername);
    await loginPassword.fill('Sara543!!!');
    await expect(loginPassword).toHaveValue('Sara543!!!');
    const logInButton = page.locator('input[value="Log In"]');
    await (logInButton).click();
    const welcomeMessage = page.getByText('Welcome ' + fakerFirstName + ' Vuk');
    await expect(welcomeMessage).toBeVisible();
    });

    test('Open new acount for registered user 8', async({page}) => {
    await expect(page).toHaveURL('https://parabank.parasoft.com/parabank/overview.htm'); 
    const accountsOverview = page.locator('a[href="overview.htm"]');
    await accountsOverview.click();
    const numberOfAccounts = page.locator('#accountTable tbody tr td a')
    const openNewAccount = page.locator('a[href="openaccount.htm"]')
    //await page.waitForTimeout(500); prvi put nije hteo bez tajmauta
    await expect(numberOfAccounts).toHaveCount(1);
    await openNewAccount.click();
    await page.locator('#type').selectOption('1');
    //await page.waitForTimeout(500); - prvi put nije hteo bez tajmauta
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    const buttonOpenNewAccount = page.locator('input[value="Open New Account"]')
    await buttonOpenNewAccount.click();
    const messageOpenNewAccount = page.getByText('Account Opened!')
    await expect(messageOpenNewAccount).toBeVisible();
    await accountsOverview.click();
    expect(numberOfAccounts).not.toBe(1);

    });
    });

test('Password and confirm fields no matching 6 test', async({page}) => {
    const fakerDataUsername = faker.internet.username();
    const fakerFirstName = faker.person.firstName(); //pada test zbog first name-a
    const fakerConfirmPassword = faker.internet.password();
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    const linkRegister = page.getByText('Register');
    await linkRegister.click();
    const registerPage = new RegisterPage(page);
    await registerPage.fill_inputFields(fakerFirstName, 'Vuk', 'Adressa 1', 'Novi Sad', 'Srbija', '21000', '+381645678900', 'Q', fakerDataUsername, 'Sara543!!!', fakerConfirmPassword);
    const registrationButton = page.locator('input[value="Register"]');
    await registrationButton.click();
    const errorMessageConfirm = page.getByText('Passwords did not match.');
    await expect(errorMessageConfirm).toBeVisible();

    });