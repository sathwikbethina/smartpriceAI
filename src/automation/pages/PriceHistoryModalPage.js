const BasePage = require('./BasePage');

class PriceHistoryModalPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.modal = '#price-history-modal';
    this.chartCanvas = '#price-history-chart, canvas';
    this.lowestPriceBadge = '#lowest-price-recorded';
    this.averagePriceBadge = '#average-price-recorded';
    this.timeframe7Days = '#timeframe-7d';
    this.timeframe30Days = '#timeframe-30d';
    this.timeframe90Days = '#timeframe-90d';
    this.closeButton = '#close-history-modal';
  }

  async selectTimeframe(days) {
    await this.click(`#timeframe-${days}d`);
  }

  async closeModal() {
    await this.click(this.closeButton);
  }
}

module.exports = PriceHistoryModalPage;
