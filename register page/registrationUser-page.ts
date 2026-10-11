import {expect, type Locator, type Page} from '@playwright/test'
import { lstat } from 'node:fs';
export class RegisterPage {
    readonly page: Page;
    readonly input_firstname: Locator;
    readonly input_lastname: Locator;
    readonly input_address: Locator;
    readonly input_city: Locator;
    readonly input_state: Locator;
    readonly input_zipcode: Locator;
    readonly input_phone: Locator;
    readonly input_ssn: Locator;
    readonly input_username: Locator;
    readonly input_password: Locator;
    readonly input_confirm: Locator;

    
    constructor(page: Page){
        this.page = page;
        this.input_firstname = page.locator('[id="customer.firstName"]');
        this.input_lastname = page.locator('[id="customer.lastName"]');
        this.input_address = page.locator('[id="customer.address.street"]');
        this.input_city = page.locator('[id="customer.address.city"]');
        this.input_state = page.locator('[id="customer.address.state"]');
        this.input_zipcode = page.locator('[id="customer.address.zipCode"]');
        this.input_phone = page.locator('[id="customer.phoneNumber"]');
        this.input_ssn = page.locator('[id="customer.ssn"]');
        this.input_username = page.locator('[id="customer.username"]');
        this.input_password = page.locator('[id="customer.password"]');
        this.input_confirm = page.locator('[id="repeatedPassword"]');
    }
async fill_inputFields
   (firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    ssn: string,
    username: string,
    password: string,
    confirm: string,

  ){
    await this.input_firstname.fill(firstName);
    await expect(this.input_firstname).toHaveValue(firstName);

    await this.input_lastname.fill(lastName);
    await expect(this.input_lastname).toHaveValue(lastName);

    await this.input_address.fill(address);
    await expect(this.input_address).toHaveValue(address);

    await this.input_city.fill(city);
    await expect(this.input_city).toHaveValue(city);

    await this.input_state.fill(state);
    await expect(this.input_state).toHaveValue(state);

    await this.input_zipcode.fill(zipCode);
    await expect(this.input_zipcode).toHaveValue(zipCode);

    await this.input_phone.fill(phone);
    await expect(this.input_phone).toHaveValue(phone);

    await this.input_ssn.fill(ssn);
    await expect(this.input_ssn).toHaveValue(ssn);

    await this.input_username.fill(username);
    await expect(this.input_username).toHaveValue(username);

    await this.input_password.fill(password);
    await expect(this.input_password).toHaveValue(password);

    await this.input_confirm.fill(confirm);
    await expect(this.input_confirm).toHaveValue(confirm);
    }

}