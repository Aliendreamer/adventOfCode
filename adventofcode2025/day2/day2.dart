import 'dart:io';

import '../helpers.dart';

Future<void> runDay2({String inputFile = 'day2/input.txt'}) async {
  final lines = await readInputAsString(inputFile);
  if (lines == null) return null;
  final stopwatchOne = Stopwatch()..start();
  final result1 = solve(lines, false);
  stopwatchOne.stop();
  final stopwatchTwo = Stopwatch()..start();
  final result2 = solve(lines, true);
  stopwatchTwo.stop();
  stderr.writeln(
    'Day 2 result1: $result1  in ${stopwatchOne.elapsed.inMilliseconds} milliseconds',
  );
  stderr.writeln(
    'Day 2 result2: $result2  in ${stopwatchOne.elapsed.inMilliseconds} milliseconds',
  );
}

int solve(String input, bool isPartTwo) {
  // create the array of the dial
  int sum = 0;
  var ranges = input.split(",");
  for (var range in ranges) {
    final parts = range.split('-');
    if (parts.length != 2) {
      throw FormatException('Invalid range: $range');
    }

    final start = int.parse(parts[0]);
    final end = int.parse(parts[1]);

    for (var id = start; id <= end; id++) {
      if (isTandemRepeat(id)) {
        sum += id;
      } else if (isRepeatedPattern(id) && isPartTwo) {
        sum += id;
      }
    }
  }
  return sum;
}

bool isTandemRepeat(int n) {
  final s = n.toString();
  if (s.length.isOdd) return false;

  final half = s.length ~/ 2;
  final first = s.substring(0, half);
  final second = s.substring(half);

  return first == second;
}

bool isRepeatedPattern(int n) {
  final s = n.toString();
  final length = s.length;

  if (length < 2) return false; // must be at least 2 digits

  for (var blockLen = 1; blockLen <= length ~/ 2; blockLen++) {
    if (length % blockLen != 0) continue;

    final repeatCount = length ~/ blockLen;
    if (repeatCount < 2) continue; // must be repeated at least twice

    final block = s.substring(0, blockLen);
    var ok = true;

    for (var i = blockLen; i < length; i += blockLen) {
      if (s.substring(i, i + blockLen) != block) {
        ok = false;
        break;
      }
    }

    if (ok) return true;
  }
  return false;
}
