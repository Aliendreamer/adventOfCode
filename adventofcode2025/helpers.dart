import 'dart:io';
import 'dart:math' as math;

enum Direction { left, right }

int rotateIndex({
  required int index,
  required int steps,
  required int length,
  required Direction direction,
}) {
  // Right = +steps, Left = -steps
  final signedSteps = direction == Direction.right ? steps : -steps;

  return wrapIndex(index + signedSteps, length);
}

int wrapIndex(int index, int length) {
  if (length <= 0) {
    throw ArgumentError('length must be > 0');
  }
  return ((index % length) + length) % length;
}

/// Reads lines from [fileName] located relative to this script's directory.
Future<List<String>?> readInput(String fileName) async {
  try {
    final inputUri = Platform.script.resolve(fileName);
    final file = File.fromUri(inputUri);
    if (!await file.exists()) {
      stderr.writeln('Error: "${file.path}" not found.');
      return null;
    }
    final input = await file.readAsLines();
    final lines = input
        .map((l) => l.trim())
        .where((l) => l.isNotEmpty)
        .toList();
    return lines;
  } catch (e) {
    stderr.writeln('Failed to read input: $e');
    return null;
  }
}

/// Reads lines from [fileName] located relative to this script's directory.
Future<String?> readInputAsString(String fileName) async {
  try {
    final inputUri = Platform.script.resolve(fileName);
    final file = File.fromUri(inputUri);
    if (!await file.exists()) {
      stderr.writeln('Error: "${file.path}" not found.');
      return null;
    }
    return await file.readAsString();
  } catch (e) {
    stderr.writeln('Failed to read input: $e');
    return null;
  }
}

int concatNumbers(int a, int b) {
  if (b == 0) {
    return a * 10;
  }
  // number of digits in b
  final digits = (math.log(b) / math.ln10).floor() + 1;
  final pow10 = math.pow(10, digits).toInt();

  return a * pow10 + b;
}

bool isValid(int x, int y, int rows, int cols) =>
    x >= 0 && y >= 0 && x < rows && y < cols;

List<(int dr, int dc)> gridMovePatterns = [(-1, 0), (1, 0), (0, -1), (0, 1)];

List<(int dr, int dc)> gridMovePatternsAndDiagonals = [
  (0, 1), // Right
  (0, -1), // Left
  (1, 0), // Down
  (-1, 0), // Up
  (1, 1), // Down-Right
  (1, -1), // Down-Left
  (-1, 1), // Up-Right
  (-1, -1), // Up-Left
];

List<List<T>> deepCopy2D<T>(List<List<T>> grid) {
  return [
    for (final row in grid) [...row],
  ];
}

extension MapIndexedExtension<E> on Iterable<E> {
  Iterable<T> mapIndexed<T>(T Function(int index, E element) f) sync* {
    var i = 0;
    for (final element in this) {
      yield f(i++, element);
    }
  }
}
