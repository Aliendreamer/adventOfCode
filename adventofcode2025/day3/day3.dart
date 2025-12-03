import 'dart:io';

import '../helpers.dart';

Future<void> runDay3({String inputFile = 'day3/input.txt'}) async {
  final lines = await readInput(inputFile);
  if (lines == null) return null;
  final result1 = solve(lines, false);
  final result2 = solve(lines, true);
  stderr.writeln('Day 2 result1: $result1');
  stderr.writeln('Day 2 result2: $result2');
}

int solve(List<String> batteries, bool isPartTwo) {
  int power = 0;
  if (!isPartTwo) {
    for (final battery in batteries) {
      int bestValue = -1;
      int bestI = -1;
      int bestJ = -1;

      for (var i = 0; i < battery.length - 1; i++) {
        final d1 = battery.codeUnitAt(i) - 0x30;
        for (var j = i + 1; j < battery.length; j++) {
          final d2 = battery.codeUnitAt(j) - 0x30;
          final value = d1 * 10 + d2;

          if (value > bestValue) {
            bestValue = value;
            bestI = i;
            bestJ = j;
          }
        }
        stderr.writeln(
          'Battery: $battery, best so far: $bestValue (digits at $bestI and $bestJ)',
        );
      }
      power += bestValue;
    }
  }
  if (isPartTwo) {
    for (var battery in batteries) {
      int batteryPower = int.parse(maxKDigits(battery, 12));
      power += batteryPower;
    }
  }

  return power;
}

String maxKDigits(String digits, int k) {
  if (k <= 0) {
    throw ArgumentError('k must be positive');
  }
  if (k > digits.length) {
    throw ArgumentError('k cannot be greater than number of digits');
  }

  int toRemove = digits.length - k;
  final stack = <String>[];

  for (var i = 0; i < digits.length; i++) {
    final d = digits[i];

    // While we can still remove digits AND the last chosen digit is smaller
    // than current digit, pop it to make the number larger.
    while (toRemove > 0 && stack.isNotEmpty && stack.last.compareTo(d) < 0) {
      stack.removeLast();
      toRemove--;
    }

    stack.add(d);
  }

  if (stack.length > k) {
    stack.length = k;
  }

  return stack.join();
}
