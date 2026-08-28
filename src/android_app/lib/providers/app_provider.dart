import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../services/supabase_service.dart';

class AppProvider extends ChangeNotifier {
  // Auth state
  UserProfile? _currentUser;
  bool _isAuthenticated = false;
  bool _isGuest = false;

  // Search & Comparison state
  String _currentQuery = '';
  List<Product> _searchResults = [];
  List<AIAlternative> _alternatives = [];
  bool _isLoading = false;
  bool _isLoadingAi = false;
  String _errorMessage = '';

  // Filters & Sorting state
  String _activeFilter = 'all'; // 'all', 'fastest', 'lowest', 'instock'
  List<String> _selectedStores = [];
  String _sortBy = 'price_asc'; // 'price_asc', 'price_desc', 'rating'

  // User-specific data lists
  List<Product> _watchlist = [];
  List<SearchRecord> _searches = [];

  // Location & Preferences
  String _currentPincode = '600028';
  String _currentCity = 'Chennai';
  String _currentArea = 'R.A. Puram / Mandaveli';
  bool _isDarkMode = true;
  int _activeTabIndex = 0; // 0: Home, 1: Search, 2: Watchlist, 3: History, 4: Profile

  // Getters
  UserProfile? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  bool get isGuest => _isGuest;

  String get currentQuery => _currentQuery;
  List<Product> get searchResults => _searchResults;
  List<AIAlternative> get alternatives => _alternatives;
  bool get isLoading => _isLoading;
  bool get isLoadingAi => _isLoadingAi;
  String get errorMessage => _errorMessage;

  String get activeFilter => _activeFilter;
  List<String> get selectedStores => _selectedStores;
  String get sortBy => _sortBy;

  List<Product> get watchlist => _watchlist;
  List<SearchRecord> get searches => _searches;

  String get currentPincode => _currentPincode;
  String get currentCity => _currentCity;
  String get currentArea => _currentArea;
  bool get isDarkMode => _isDarkMode;
  int get activeTabIndex => _activeTabIndex;

  AppProvider() {
    _initApp();
  }

  Future<void> _initApp() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool('smartprice_theme_dark') ?? true;
    _currentPincode = prefs.getString('smartprice_pincode') ?? '600028';
    _currentCity = prefs.getString('smartprice_city') ?? 'Chennai';
    _currentArea = prefs.getString('smartprice_area') ?? 'R.A. Puram / Mandaveli';

    final savedUserJson = prefs.getString('smartprice_current_user');
    final isAuth = prefs.getBool('smartprice_is_auth') ?? false;

    if (isAuth && savedUserJson != null) {
      try {
        _currentUser = UserProfile.fromJson(jsonDecode(savedUserJson));
        _isAuthenticated = true;
        _isGuest = _currentUser?.isGuest ?? false;
      } catch (_) {
        _currentUser = null;
        _isAuthenticated = false;
        _isGuest = false;
      }
    } else {
      _currentUser = null;
      _isAuthenticated = false;
      _isGuest = false;
    }

    await _loadUserIsolatedData();
    notifyListeners();
  }

  // --- USER DATA ISOLATION KEYS ---
  String _getWatchlistKey(String? userId) => 'smartprice_watchlist_${userId ?? "guest"}';
  String _getSearchesKey(String? userId) => 'smartprice_searches_${userId ?? "guest"}';

  Future<void> _loadUserIsolatedData() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = _currentUser?.id;

    // Load user's isolated watchlist
    final watchlistKey = _getWatchlistKey(userId);
    final savedWatchlist = prefs.getStringList(watchlistKey) ?? [];
    _watchlist = [];
    for (final item in savedWatchlist) {
      try {
        _watchlist.add(Product.fromJson(jsonDecode(item)));
      } catch (_) {}
    }

    // Load user's isolated search history
    final searchesKey = _getSearchesKey(userId);
    final savedSearches = prefs.getStringList(searchesKey) ?? [];
    _searches = [];
    for (final item in savedSearches) {
      try {
        _searches.add(SearchRecord.fromJson(jsonDecode(item)));
      } catch (_) {}
    }
  }

  // --- AUTHENTICATION FLOWS ---
  Future<void> login(String email, String password, {String? fullName, String? phone}) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Check if user account already exists in registered users registry
    final registeredUsersStr = prefs.getString('smartprice_registered_users');
    Map<String, dynamic> registeredUsers = {};
    if (registeredUsersStr != null) {
      try {
        registeredUsers = jsonDecode(registeredUsersStr);
      } catch (_) {}
    }

    UserProfile profile;
    final normalizedEmail = email.trim().toLowerCase();

    if (registeredUsers.containsKey(normalizedEmail)) {
      final existingData = registeredUsers[normalizedEmail] as Map<String, dynamic>;
      profile = UserProfile.fromJson(existingData);
    } else {
      // Create new unique user ID
      final newId = 'user_${DateTime.now().millisecondsSinceEpoch}';
      profile = UserProfile(
        id: newId,
        fullName: fullName ?? (normalizedEmail.contains('@') ? normalizedEmail.split('@')[0] : 'User'),
        email: normalizedEmail,
        phone: phone ?? '+91 98765 43210',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=${Uri.encodeComponent(normalizedEmail)}',
        city: _currentCity,
        pincode: _currentPincode,
        darkMode: _isDarkMode,
        totalSavings: 0.0,
        isGuest: false,
      );
      registeredUsers[normalizedEmail] = profile.toJson();
      await prefs.setString('smartprice_registered_users', jsonEncode(registeredUsers));
    }

    _currentUser = profile;
    _isAuthenticated = true;
    _isGuest = false;

    // Persist session
    await prefs.setString('smartprice_current_user', jsonEncode(profile.toJson()));
    await prefs.setBool('smartprice_is_auth', true);

    // Load isolated data for this account only
    await _loadUserIsolatedData();
    notifyListeners();
  }

  Future<void> signup(String email, String password, {String? fullName, String? phone}) async {
    final prefs = await SharedPreferences.getInstance();
    final normalizedEmail = email.trim().toLowerCase();

    final newId = 'user_${DateTime.now().millisecondsSinceEpoch}';
    final profile = UserProfile(
      id: newId,
      fullName: fullName ?? (normalizedEmail.contains('@') ? normalizedEmail.split('@')[0] : 'Shopper'),
      email: normalizedEmail,
      phone: phone ?? '+91 98765 43210',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=${Uri.encodeComponent(normalizedEmail)}',
      city: _currentCity,
      pincode: _currentPincode,
      darkMode: _isDarkMode,
      totalSavings: 0.0,
      isGuest: false,
    );

    // Save to registered users
    final registeredUsersStr = prefs.getString('smartprice_registered_users');
    Map<String, dynamic> registeredUsers = {};
    if (registeredUsersStr != null) {
      try {
        registeredUsers = jsonDecode(registeredUsersStr);
      } catch (_) {}
    }
    registeredUsers[normalizedEmail] = profile.toJson();
    await prefs.setString('smartprice_registered_users', jsonEncode(registeredUsers));

    _currentUser = profile;
    _isAuthenticated = true;
    _isGuest = false;

    // Persist session
    await prefs.setString('smartprice_current_user', jsonEncode(profile.toJson()));
    await prefs.setBool('smartprice_is_auth', true);

    // New accounts start completely fresh (empty watchlist and history)
    _watchlist = [];
    _searches = [];
    await prefs.setStringList(_getWatchlistKey(profile.id), []);
    await prefs.setStringList(_getSearchesKey(profile.id), []);

    notifyListeners();
  }

  Future<void> continueAsGuest() async {
    final guestProfile = UserProfile.guest();
    _currentUser = guestProfile;
    _isAuthenticated = true;
    _isGuest = true;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('smartprice_current_user', jsonEncode(guestProfile.toJson()));
    await prefs.setBool('smartprice_is_auth', true);

    await _loadUserIsolatedData();
    notifyListeners();
  }

  Future<void> loginWithGoogle() async {
    await login(
      'srinivas.r@gmail.com',
      'google_oauth_token',
      fullName: 'Srinivas R',
      phone: '+91 98765 43210',
    );
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('smartprice_current_user');
    await prefs.setBool('smartprice_is_auth', false);

    // Purge in-memory state completely
    _currentUser = null;
    _isAuthenticated = false;
    _isGuest = false;
    _watchlist = [];
    _searches = [];
    _searchResults = [];
    _alternatives = [];
    _currentQuery = '';

    notifyListeners();
  }

  // --- NAVIGATION TAB ---
  void setActiveTab(int index) {
    _activeTabIndex = index;
    notifyListeners();
  }

  // --- THEME ---
  void toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('smartprice_theme_dark', _isDarkMode);
  }

  // --- LOCATION ---
  void setLocation(String pincode, String city, String area) async {
    _currentPincode = pincode;
    _currentCity = city;
    _currentArea = area;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('smartprice_pincode', pincode);
    await prefs.setString('smartprice_city', city);
    await prefs.setString('smartprice_area', area);

    // If query exists, re-run search for new location
    if (_currentQuery.isNotEmpty) {
      search(_currentQuery);
    }
  }

  // --- FILTERS & SORTING ---
  void setFilter(String filter) {
    _activeFilter = filter;
    notifyListeners();
  }

  void toggleStoreFilter(String store) {
    if (_selectedStores.contains(store)) {
      _selectedStores.remove(store);
    } else {
      _selectedStores.add(store);
    }
    notifyListeners();
  }

  void setSortBy(String sort) {
    _sortBy = sort;
    notifyListeners();
  }

  void resetFilters() {
    _activeFilter = 'all';
    _selectedStores = [];
    _sortBy = 'price_asc';
    notifyListeners();
  }

  // Available unique store names in current search
  List<String> get availableStores {
    final set = <String>{};
    for (final p in _searchResults) {
      set.add(p.platform);
    }
    return set.toList();
  }

  // Processed & Filtered Product Results
  List<Product> get processedProducts {
    var list = List<Product>.from(_searchResults);

    // Filter by store selection
    if (_selectedStores.isNotEmpty) {
      list = list.where((p) => _selectedStores.contains(p.platform)).toList();
    }

    // Quick filter
    if (_activeFilter == 'fastest') {
      list.sort((a, b) {
        final aFast = a.delivery.toLowerCase().contains('min') ? 1 : a.delivery.toLowerCase().contains('same') ? 2 : 3;
        final bFast = b.delivery.toLowerCase().contains('min') ? 1 : b.delivery.toLowerCase().contains('same') ? 2 : 3;
        return aFast.compareTo(bFast);
      });
    } else if (_activeFilter == 'instock') {
      list = list.where((p) => p.inStock).toList();
    } else if (_activeFilter == 'lowest') {
      list.sort((a, b) => a.price.compareTo(b.price));
    }

    // Sorting
    if (_sortBy == 'price_asc') {
      list.sort((a, b) => a.price.compareTo(b.price));
    } else if (_sortBy == 'price_desc') {
      list.sort((a, b) => b.price.compareTo(a.price));
    } else if (_sortBy == 'rating') {
      list.sort((a, b) => b.rating.compareTo(a.rating));
    }

    return list;
  }

  Product? get bestDeal {
    final list = processedProducts;
    return list.isNotEmpty ? list.first : null;
  }

  // --- SEARCH EXECUTION ---
  Future<void> search(String query) async {
    final q = query.trim();
    if (q.isEmpty) return;

    _currentQuery = q;
    _isLoading = true;
    _isLoadingAi = true;
    _errorMessage = '';
    _searchResults = [];
    _alternatives = [];
    notifyListeners();

    try {
      final results = await ApiService.searchProducts(q, city: _currentCity);
      _searchResults = results;

      // Record in current account's search history
      await _recordSearch(q, results.length);

      // Detect category for AI alternatives
      final cat = results.isNotEmpty ? results.first.category : 'general';

      // Fetch AI Alternatives in parallel
      ApiService.fetchAlternatives(q, category: cat).then((alts) {
        _alternatives = alts;
        _isLoadingAi = false;
        notifyListeners();
      }).catchError((_) {
        _isLoadingAi = false;
        notifyListeners();
      });
    } catch (e) {
      _errorMessage = 'Could not fetch prices. Make sure backend is running.';
      _searchResults = [];
      _isLoadingAi = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // --- SEARCH HISTORY (ISOLATED PER USER) ---
  Future<void> _recordSearch(String query, int count) async {
    final newRecord = SearchRecord(
      id: DateTime.now().millisecondsSinceEpoch,
      query: query,
      city: _currentCity,
      resultCount: count,
      searchedAt: DateTime.now(),
    );

    _searches.removeWhere((s) => s.query.toLowerCase() == query.toLowerCase());
    _searches.insert(0, newRecord);

    final prefs = await SharedPreferences.getInstance();
    final key = _getSearchesKey(_currentUser?.id);
    final encoded = _searches.map((s) => jsonEncode(s.toJson())).toList();
    await prefs.setStringList(key, encoded);

    // Sync to Supabase in background
    SupabaseService.recordSearch(query, _currentCity, count, userId: _currentUser?.id);
  }

  Future<void> deleteSearchItem(int id) async {
    _searches.removeWhere((s) => s.id == id);
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final key = _getSearchesKey(_currentUser?.id);
    final encoded = _searches.map((s) => jsonEncode(s.toJson())).toList();
    await prefs.setStringList(key, encoded);
  }

  Future<void> clearSearches() async {
    _searches.clear();
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final key = _getSearchesKey(_currentUser?.id);
    await prefs.remove(key);
  }

  // --- WATCHLIST (ISOLATED PER USER) ---
  bool isInWatchlist(Product product) {
    return _watchlist.any((p) => p.platform == product.platform && p.name == product.name);
  }

  Future<void> toggleWatchlist(Product product) async {
    final exists = isInWatchlist(product);
    if (exists) {
      _watchlist.removeWhere((p) => p.platform == product.platform && p.name == product.name);
      SupabaseService.removeFromWatchlist(product, userId: _currentUser?.id);
    } else {
      _watchlist.insert(0, product);
      SupabaseService.addToWatchlist(product, userId: _currentUser?.id);
    }
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final key = _getWatchlistKey(_currentUser?.id);
    final encoded = _watchlist.map((p) => jsonEncode(p.toJson())).toList();
    await prefs.setStringList(key, encoded);
  }

  Future<void> removeFromWatchlist(Product product) async {
    _watchlist.removeWhere((p) => p.platform == product.platform && p.name == product.name);
    SupabaseService.removeFromWatchlist(product, userId: _currentUser?.id);
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final key = _getWatchlistKey(_currentUser?.id);
    final encoded = _watchlist.map((p) => jsonEncode(p.toJson())).toList();
    await prefs.setStringList(key, encoded);
  }
}
