import 'dart:io';

import '../helpers.dart';

Future<void> runDay6({String inputFile = 'day5/input.txt'}) async {
  final lines = await readInputAsString(inputFile);
  if (lines == null) return null;
  final stopwatchOne = Stopwatch()..start();
  final result1 = solve(lines, false);
  stopwatchOne.stop();
  final stopwatchTwo = Stopwatch()..start();
  final result2 = solve(lines, true);
  stopwatchTwo.stop();
  stderr.writeln(
    'Day 4 result1: $result1  in ${stopwatchOne.elapsed.inMilliseconds} milliseconds',
  );
  stderr.writeln(
    'Day 4 result2: $result2  in ${stopwatchOne.elapsed.inMilliseconds} milliseconds',
  );
}

int solve(String input, bool isPartTwo) {
  return 0;
}
