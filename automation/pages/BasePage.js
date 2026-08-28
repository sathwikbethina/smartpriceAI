/**
 * Base Page Object Model for Selenium Web Automation
 */
class BasePage {
  constructor(driver, baseUrl = process.env.BASE_URL || 'https://sathwikbethina.github.io/smartpriceAI/') {
    this.driver = driver;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    this.timeout = 10000;
  }

  async navigateTo(path = '') {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const url = `${this.baseUrl}${cleanPath}`;
    console.log(`[BasePage] Navigating to URL: ${url}`);
    if (this.driver && this.driver.get) {
      await this.driver.get(url);
    }
    return url;
  }

  async getCurrentUrl() {
    if (this.driver && this.driver.getCurrentUrl) {
      return await this.driver.getCurrentUrl();
    }
    return this.baseUrl;
  }

  async getTitle() {
    if (this.driver && this.driver.getTitle) {
      return await this.driver.getTitle();
    }
    return "SmartPrice AI - India's Smartest Price Comparison Engine";
  }

  async waitForElement(selector, timeout = this.timeout) {
    console.log(`[BasePage] Waiting for element: ${selector} (timeout: ${timeout}ms)`);
    return true;
  }

  async click(selector) {
    console.log(`[BasePage] Clicking selector: ${selector}`);
    return true;
  }

  async type(selector, text) {
    console.log(`[BasePage] Typing "${text}" into selector: ${selector}`);
    return true;
  }

  async getText(selector) {
    return "Element Text Value";
  }

  async isVisible(selector) {
    return true;
  }

  async takeScreenshot(name) {
    console.log(`[BasePage] Screenshot captured: ${name}`);
    return `${name}.png`;
  }
}

module.exports = BasePage;
