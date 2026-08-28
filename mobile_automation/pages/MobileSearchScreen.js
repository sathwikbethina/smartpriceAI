const BaseMobilePage = require('./BaseMobilePage');

class MobileSearchScreen extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.bestDealHero = 'search_best_deal_hero_card';
    this.storeList = 'search_store_comparison_list';
    this.filterButton = 'search_filter_action_btn';
    this.sortDropdown = 'search_sort_dropdown';
    this.aiAlternativesCard = 'search_ai_alternatives_widget';
    this.buyNowBtn = 'store_card_buy_now_btn';
  }

  async selectBestDeal() {
    await this.clickElement(this.bestDealHero);
  }

  async applyStoreFilter(storeName) {
    await this.clickElement(this.filterButton);
    await this.clickElement(`filter_store_${storeName}`);
  }
}

module.exports = MobileSearchScreen;
