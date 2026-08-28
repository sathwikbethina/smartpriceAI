const BaseMobilePage = require('./BaseMobilePage');

class MobileWatchlistScreen extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.watchlistList = 'watchlist_items_listview';
    this.emptyStateView = 'watchlist_empty_state_container';
    this.editAlertBtn = 'watchlist_edit_target_price_btn';
    this.deleteItemBtn = 'watchlist_delete_item_btn';
    this.trackNewBtn = 'watchlist_add_new_product_btn';
  }

  async removeItem(index = 0) {
    await this.clickElement(`watchlist_delete_item_${index}`);
  }
}

module.exports = MobileWatchlistScreen;
