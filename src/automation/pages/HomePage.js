const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    // Selectors
    this.searchInput = '#search-input, input[placeholder*="Search"]';
    this.searchButton = '#search-button, button[aria-label="Search"]';
    this.pincodeSelector = '#pincode-trigger, [data-testid="pincode-btn"]';
    this.voiceSearchBtn = '#voice-search-btn';
    this.categoryCards = '.category-card, [data-category]';
    this.trendingItems = '.trending-card, [data-trending]';
    this.themeToggle = '#theme-toggle';
    this.authButton = '#auth-modal-trigger';
    this.navbar = '#main-navbar';
    this.heroSection = '#hero-section';
    this.footer = '#app-footer';
  }

  async open() {
    return await this.navigateTo('');
  }

  async searchProduct(productName) {
    await this.waitForElement(this.searchInput);
    await this.type(this.searchInput, productName);
    await this.click(this.searchButton);
  }

  async openLocationModal() {
    await this.click(this.pincodeSelector);
  }

  async toggleVoiceSearch() {
    await this.click(this.voiceSearchBtn);
  }

  async openAuthModal() {
    await this.click(this.authButton);
  }

  async selectCategory(categoryName) {
    await this.click(`[data-category="${categoryName}"]`);
  }
}

module.exports = HomePage;
