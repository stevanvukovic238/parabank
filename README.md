# Playwright Test Automation Project

A personal test automation project developed as part of my hands-on learning with **Playwright and TypeScript**. The project includes UI tests for the ParaBank demo banking application and separate API testing exercises using DemoQA.

## Technologies Used

- **Playwright** and **TypeScript**
- **Node.js** and npm
- **Faker.js** for generating test data
- **JSON** for storing expected validation messages
- **Page Object Model (POM)** principles for registration functionality

## Test Coverage

### ParaBank – UI Testing

Automated scenarios cover:

- Visibility of key elements on the home page
- Navigation links and login section checks
- Registration form validation and required fields
- Successful user registration
- Validation of mismatched passwords
- Login with a registered user
- Opening a new bank account

Application under test: https://parabank.parasoft.com/parabank/index.htm

### DemoQA – API Testing

Additional exercises include:

- Sending GET requests and validating response status codes
- Parsing JSON responses and comparing API data with UI content
- Sending POST requests to register users and validating login responses

## Project Structure

```text
tests/
  Parabank.spec.ts       # ParaBank UI tests
  API.spec.ts            # DemoQA API exercises
  example.spec.ts        # Additional practice tests
register page/
  registrationUser-page.ts  # Registration page object
testData/
  errorMessages.json     # Expected validation messages
playwright.config.ts     # Playwright test configuration
package.json
```

## How to Run

**Prerequisites:** Node.js and npm installed.

1. Clone the repository and open the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Run the ParaBank tests:

   ```bash
   npx playwright test tests/Parabank.spec.ts
   ```

5. Run the API tests:

   ```bash
   npx playwright test tests/API.spec.ts
   ```

6. Open the HTML test report:

   ```bash
   npx playwright show-report
   ```

The Playwright configuration includes Chromium, Firefox, and WebKit projects. Test outcomes may depend on the availability and current behavior of the public demo applications.

## About This Project

This is a **personal learning project**, not a commercial automation framework. It demonstrates practical experience writing UI and API test scenarios, working with Playwright locators and assertions, using test data, and organizing part of the UI testing code with Page Object Model principles.
