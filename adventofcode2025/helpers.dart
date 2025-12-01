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
