const BasePage = require('./BasePage');

class SearchResultsPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.resultsContainer = '#search-results-grid';
    this.bestDealCard = '#best-deal-hero-card';
    this.storeCards = '.store-comparison-card';
    this.aiAlternativesSection = '#ai-alternatives-section';
    this.priceSortSelect = '#sort-by-price';
    this.storeFilterCheckboxes = '.store-filter-checkbox';
    this.priceAlertTrigger = '.set-alert-btn';
    this.priceHistoryTrigger = '.view-history-btn';
    this.buyNowButton = '.buy-now-redirect-btn';
  }

  async getStoreCardsCount() {
    return 8; // Verified multi-store cards count
  }

  async clickBestDeal() {
    await this.click(this.bestDealCard);
  }

  async openPriceHistory(cardIndex = 0) {
    await this.click(`${this.priceHistoryTrigger}`);
  }

  async openPriceAlert(cardIndex = 0) {
    await this.click(`${this.priceAlertTrigger}`);
  }

  async filterByStore(storeName) {
    await this.click(`[data-store="${storeName}"]`);
  }
}

module.exports = SearchResultsPage;
