import 'dart:io';

import '../helpers.dart';

/// Reads input and runs the solver. Returns the output as a String.
Future<void> runDay1({String inputFile = 'day1/input.txt'}) async {
  final lines = await _readInput(inputFile);
  if (lines == null) return null;
  final result1 = solve(lines, false);
  final result2 = solve(lines, true);
  stderr.writeln('Day 1 result1: $result1');
  stderr.writeln('Day 1 result2: $result2');
}

/// Reads lines from [fileName] located relative to this script's directory.
Future<List<String>?> _readInput(String fileName) async {
  try {
    final inputUri = Platform.script.resolve(fileName);
    final file = File.fromUri(inputUri);
    if (!await file.exists()) {
      stderr.writeln('Error: "${file.path}" not found.');
      return null;
    }
    return await file.readAsLines();
  } catch (e) {
    stderr.writeln('Failed to read input: $e');
    return null;
  }
}

/// Implement your puzzle logic here.
int solve(List<String> lines, bool isPartTwo) {
  // create the array of the dial
  final numbers = List.generate(100, (index) => index);
  final int startMarker = 50;
  final int measurePoint = 0;
  int currentPosition = numbers.indexOf(startMarker);
  int count = 0;

  for (final command in lines) {
    bool isLeft = command.startsWith('L');
    int rotation = int.parse(command.substring(1));
    var direction = isLeft ? Direction.left : Direction.right;
    int rotationIndex = rotateIndex(
      index: currentPosition,
      steps: rotation,
      length: numbers.length,
      direction: direction,
    );
    // if part 2 and new or old index we have to check
    // and if it passes through 0 not only if it ends there
    if (isPartTwo) {
      count += _zerosDuringRotation(
        currentPosition,
        rotation,
        direction,
        numbers.length,
      );
    }
    if (!isPartTwo && numbers[rotationIndex] == measurePoint) {
      count++;
    }
    currentPosition = rotationIndex;
  }
  return count;
}

int _zerosDuringRotation(int pos, int steps, Direction dir, int size) {
  if (steps <= 0) return 0;

  int i0 = 0;
  if (dir == Direction.left) {
    i0 = (pos == 0) ? size : pos;
  }
  if (dir == Direction.right) {
    i0 = (pos == 0) ? size : (size - pos);
  }

  if (steps < i0) return 0;

  return 1 + (steps - i0) ~/ size;
}
