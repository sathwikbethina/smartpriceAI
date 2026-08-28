import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class LocationPincodeSheet extends StatefulWidget {
  const LocationPincodeSheet({super.key});

  @override
  State<LocationPincodeSheet> createState() => _LocationPincodeSheetState();
}

class _LocationPincodeSheetState extends State<LocationPincodeSheet> {
  final TextEditingController _pincodeController = TextEditingController();
  bool _isLookingUp = false;
  bool _isDetectingGps = false;

  final List<Map<String, String>> _popularLocations = [
    {'city': 'Chennai', 'pincode': '600028', 'area': 'R.A. Puram / Mandaveli'},
    {'city': 'Bangalore', 'pincode': '560001', 'area': 'MG Road / Indiranagar'},
    {'city': 'Mumbai', 'pincode': '400001', 'area': 'Fort / Colaba / BKC'},
    {'city': 'Delhi', 'pincode': '110001', 'area': 'Connaught Place / Central'},
    {'city': 'Hyderabad', 'pincode': '500001', 'area': 'Banjara Hills / Jubilee'},
    {'city': 'Pune', 'pincode': '411001', 'area': 'Shivajinagar / Kothrud'},
    {'city': 'Kolkata', 'pincode': '700001', 'area': 'Park Street / Salt Lake'},
    {'city': 'Ahmedabad', 'pincode': '380001', 'area': 'Navrangpura / Satellite'},
  ];

  void _onDetectGpsLocation(AppProvider provider) async {
    setState(() => _isDetectingGps = true);

    try {
      final coords = await ApiService.getCurrentGpsCoordinates();
      if (coords != null && coords['lat'] != null && coords['lon'] != null) {
        final double lat = (coords['lat'] as num).toDouble();
        final double lon = (coords['lon'] as num).toDouble();

        final geo = await ApiService.reverseGeocode(lat, lon);
        if (geo != null && geo['found'] == true) {
          final city = geo['city'] ?? provider.currentCity;
          final area = geo['area'] ?? 'Current Locality';
          final pincode = geo['pincode'] ?? provider.currentPincode;

          provider.setLocation(pincode, city, area);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Row(
                  children: [
                    const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Exact GPS Location Detected: $area, $city ($pincode)',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
                backgroundColor: AppTheme.emerald,
                duration: const Duration(seconds: 3),
              ),
            );
            Navigator.pop(context);
          }
          return;
        }
      }

      // Fallback if reverse geocoding returned null
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not determine exact address from GPS. Please select your city below or enter PIN code.'),
            backgroundColor: AppTheme.accent,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Location error: $e'),
            backgroundColor: AppTheme.rose,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isDetectingGps = false);
      }
    }
  }

  void _onSetPincode(AppProvider provider) async {
    final pin = _pincodeController.text.trim();
    if (pin.length < 6) return;

    setState(() => _isLookingUp = true);

    try {
      final geo = await ApiService.lookupPincodeGeo(pin);
      if (geo != null && geo['found'] == true) {
        final city = geo['city'] ?? provider.currentCity;
        final area = geo['area'] ?? 'Local Area';
        provider.setLocation(pin, city, area);
      } else {
        provider.setLocation(pin, provider.currentCity, 'Custom Area');
      }
    } catch (_) {
      provider.setLocation(pin, provider.currentCity, 'Custom Area');
    } finally {
      if (mounted) {
        setState(() => _isLookingUp = false);
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade400,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),

          const Row(
            children: [
              Icon(Icons.location_on_rounded, color: AppTheme.accent, size: 22),
              SizedBox(width: 8),
              Text(
                'Select Delivery Location',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Calibrates 10-minute darkstores on Blinkit, Zepto, and BigBasket.',
            style: TextStyle(
              fontSize: 12,
              color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 16),

          // Exact GPS Location Detection Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isDetectingGps ? null : () => _onDetectGpsLocation(provider),
              icon: _isDetectingGps
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Icon(Icons.my_location_rounded, color: Colors.white, size: 18),
              label: Text(
                _isDetectingGps ? 'Detecting exact GPS location...' : 'Detect Exact Current Location',
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.accent,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 2,
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Divider with "OR ENTER PINCODE"
          Row(
            children: [
              Expanded(child: Divider(color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Text(
                  'OR ENTER PINCODE',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey.shade500,
                  ),
                ),
              ),
              Expanded(child: Divider(color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder)),
            ],
          ),
          const SizedBox(height: 14),

          // Custom Pincode Input
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _pincodeController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    hintText: 'Enter 6-digit Pincode (e.g. 560001)',
                    filled: true,
                    fillColor: provider.isDarkMode ? AppTheme.darkCardSubtle : AppTheme.lightCardSubtle,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: _isLookingUp ? null : () => _onSetPincode(provider),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
                child: _isLookingUp
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Set'),
              ),
            ],
          ),
          const SizedBox(height: 18),

          const Text(
            'Popular Metros',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          ),
          const SizedBox(height: 8),

          // Metro Location List
          Flexible(
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: _popularLocations.length,
              itemBuilder: (context, index) {
                final loc = _popularLocations[index];
                final isSelected = provider.currentCity.toLowerCase() == loc['city']!.toLowerCase();

                return Material(
                  color: isSelected
                      ? AppTheme.primary.withValues(alpha: 0.1)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(14),
                  child: ListTile(
                    onTap: () {
                      provider.setLocation(loc['pincode']!, loc['city']!, loc['area']!);
                      Navigator.pop(context);
                    },
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    leading: Icon(
                      Icons.location_city_rounded,
                      color: isSelected ? AppTheme.primary : Colors.grey,
                    ),
                    title: Text(
                      '${loc['city']} (${loc['pincode']})',
                      style: TextStyle(
                        fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                        fontSize: 13,
                        color: isSelected ? AppTheme.primary : (provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary),
                      ),
                    ),
                    subtitle: Text(
                      loc['area']!,
                      style: const TextStyle(fontSize: 11, color: Colors.grey),
                    ),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle_rounded, color: AppTheme.primary, size: 20)
                        : null,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
