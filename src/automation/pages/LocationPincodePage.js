const BasePage = require('./BasePage');

class LocationPincodePage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.modal = '#pincode-modal';
    this.pincodeInput = '#pincode-input-field';
    this.detectLocationBtn = '#detect-gps-location-btn';
    this.cityChips = '.city-chip-btn';
    this.applyButton = '#apply-pincode-btn';
    this.statusMessage = '#pincode-status-text';
  }

  async enterPincode(pincode) {
    await this.type(this.pincodeInput, pincode);
    await this.click(this.applyButton);
  }

  async selectCity(cityName) {
    await this.click(`[data-city="${cityName}"]`);
  }
}

module.exports = LocationPincodePage;
