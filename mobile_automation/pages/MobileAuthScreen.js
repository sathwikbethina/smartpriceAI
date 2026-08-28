const BaseMobilePage = require('./BaseMobilePage');

class MobileAuthScreen extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.emailField = 'auth_input_email';
    this.passwordField = 'auth_input_password';
    this.loginBtn = 'auth_submit_login_btn';
    this.signupBtn = 'auth_submit_signup_btn';
    this.googleSignInBtn = 'auth_google_signin_btn';
    this.guestModeBtn = 'auth_skip_guest_btn';
  }

  async login(email, password) {
    await this.sendKeys(this.emailField, email);
    await this.sendKeys(this.passwordField, password);
    await this.clickElement(this.loginBtn);
  }
}

module.exports = MobileAuthScreen;
