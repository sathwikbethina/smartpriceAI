const BaseMobilePage = require('./BaseMobilePage');

class MobileHomeScreen extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.searchBar = 'home_search_bar_input';
    this.pincodeHeader = 'home_pincode_header_btn';
    this.trendingSection = 'home_trending_products_carousel';
    this.bottomNavHome = 'nav_tab_home';
    this.bottomNavSearch = 'nav_tab_search';
    this.bottomNavWatchlist = 'nav_tab_watchlist';
    this.bottomNavHistory = 'nav_tab_history';
    this.bottomNavProfile = 'nav_tab_profile';
  }

  async searchProduct(keyword) {
    await this.clickElement(this.searchBar);
    await this.sendKeys(this.searchBar, keyword);
    await this.hideKeyboard();
  }

  async navigateToTab(tabName) {
    await this.clickElement(`nav_tab_${tabName}`);
  }
}

module.exports = MobileHomeScreen;
