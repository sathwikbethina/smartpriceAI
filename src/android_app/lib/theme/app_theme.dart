import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Colors
  static const Color primary = Color(0xFF1A56DB);
  static const Color primaryDark = Color(0xFF1644B2);
  static const Color accent = Color(0xFFFF5A1F);
  static const Color emerald = Color(0xFF10B981);
  static const Color rose = Color(0xFFF43F5E);
  static const Color amber = Color(0xFFF59E0B);

  // Dark Palette
  static const Color darkBg = Color(0xFF0F111A);
  static const Color darkCard = Color(0xFF1E2130);
  static const Color darkCardSubtle = Color(0xFF181B28);
  static const Color darkBorder = Color(0xFF2E3245);
  static const Color darkTextPrimary = Color(0xFFF8FAFC);
  static const Color darkTextSecondary = Color(0xFF94A3B8);

  // Light Palette
  static const Color lightBg = Color(0xFFF8FAFC);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightCardSubtle = Color(0xFFF1F5F9);
  static const Color lightBorder = Color(0xFFE2E8F0);
  static const Color lightTextPrimary = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF64748B);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: lightBg,
    colorScheme: const ColorScheme.light(
      primary: primary,
      secondary: accent,
      surface: lightCard,
      error: rose,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: lightTextPrimary,
    ),
    cardColor: lightCard,
    dividerColor: lightBorder,
    appBarTheme: AppBarTheme(
      backgroundColor: lightCard,
      foregroundColor: lightTextPrimary,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w900,
        color: lightTextPrimary,
      ),
      iconTheme: const IconThemeData(color: lightTextPrimary),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: lightCard,
      selectedItemColor: primary,
      unselectedItemColor: lightTextSecondary,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),
    textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme).apply(
      bodyColor: lightTextPrimary,
      displayColor: lightTextPrimary,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        textStyle: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 14),
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: darkBg,
    colorScheme: const ColorScheme.dark(
      primary: primary,
      secondary: accent,
      surface: darkCard,
      error: rose,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: darkTextPrimary,
    ),
    cardColor: darkCard,
    dividerColor: darkBorder,
    appBarTheme: AppBarTheme(
      backgroundColor: darkCard,
      foregroundColor: darkTextPrimary,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w900,
        color: darkTextPrimary,
      ),
      iconTheme: const IconThemeData(color: darkTextPrimary),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: darkCard,
      selectedItemColor: accent,
      unselectedItemColor: darkTextSecondary,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),
    textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).apply(
      bodyColor: darkTextPrimary,
      displayColor: darkTextPrimary,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: accent,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        textStyle: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 14),
      ),
    ),
  );
}
