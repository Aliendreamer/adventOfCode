import 'dart:io';

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
    return await file.readAsLines();
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
