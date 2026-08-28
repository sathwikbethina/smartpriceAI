const BasePage = require('./BasePage');

class PriceAlertModalPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.modal = '#price-alert-modal';
    this.targetPriceInput = '#target-price-input';
    this.emailInput = '#alert-email-input';
    this.phoneInput = '#alert-phone-input';
    this.enableWhatsappToggle = '#toggle-whatsapp-alerts';
    this.saveAlertButton = '#save-alert-btn';
    this.closeButton = '#close-alert-modal';
  }

  async setAlert(targetPrice, email, phone = '') {
    await this.type(this.targetPriceInput, targetPrice.toString());
    await this.type(this.emailInput, email);
    if (phone) {
      await this.type(this.phoneInput, phone);
    }
    await this.click(this.saveAlertButton);
  }
}

module.exports = PriceAlertModalPage;
