import 'dart:io';
import 'dart:math';

import '../helpers.dart';

Future<void> runDay6({String inputFile = 'day6/test_input.txt'}) async {
  final lines = await readInput(inputFile);
  if (lines == null) return null;
  final stopwatchOne = Stopwatch()..start();
  final result1 = solve(lines, false);
  stopwatchOne.stop();
  final stopwatchTwo = Stopwatch()..start();
  final result2 = solve(lines, true);
  stopwatchTwo.stop();
  stderr.writeln(
    'Day 6 result1: $result1  in ${stopwatchOne.elapsed.inMilliseconds} milliseconds',
  );
  stderr.writeln(
    'Day 6 result2: $result2  in ${stopwatchOne.elapsed.inMilliseconds} milliseconds',
  );
}

int solve(List<String> input, bool isPartTwo) {
  final opLine = input.last.trim();
  final operators = opLine.split(RegExp(r'\s+')); // ["*", "+", "*", "+"]

  final numberLines = input.sublist(0, input.length - 1);

  final matrix = numberLines
      .map((line) => line.trim().split(RegExp(r'\s+')).map(int.parse).toList())
      .toList();

  final columnCount = matrix.first.length;

  return List.generate(columnCount, (col) => col)
      .map(
        (col) => matrix.map((row) => row[col]),
      ) // column values (Iterable<int>)
      .mapIndexed(
        (colIdx, values) => switch (operators[colIdx]) {
          '+' => values.fold<int>(0, (a, b) => a + b),
          '*' => values.fold<int>(1, (a, b) => a * b),
          _ => throw Exception("Invalid operator: ${operators[colIdx]}"),
        },
      )
      .reduce((a, b) => a + b);
}
