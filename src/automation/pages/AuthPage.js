const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.modal = '#auth-modal';
    this.emailInput = '#auth-email';
    this.passwordInput = '#auth-password';
    this.submitButton = '#auth-submit-btn';
    this.tabLogin = '#tab-login';
    this.tabSignup = '#tab-signup';
    this.socialGoogleBtn = '#btn-google-auth';
    this.guestContinueBtn = '#btn-guest-continue';
    this.errorMessage = '.auth-error-msg';
  }

  async login(email, password) {
    await this.click(this.tabLogin);
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async signup(email, password) {
    await this.click(this.tabSignup);
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async continueAsGuest() {
    await this.click(this.guestContinueBtn);
  }
}

module.exports = AuthPage;
