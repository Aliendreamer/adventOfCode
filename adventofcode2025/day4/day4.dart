import 'dart:io';
import '../helpers.dart';
import 'dart:collection';

Future<void> runDay4({String inputFile = 'day4/input.txt'}) async {
  final lines = await readInput(inputFile);
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

int solve(List<String> grid, bool isPartTwo) {
  int result = 0;
  int startX = 0;
  int startY = 0;
  final maze = grid.map((row) => row.split('')).toList();
  int cols = maze[0].length;
  int rows = maze.length;
  if (!isPartTwo) {
    final bfsResult = bfsMatrix(maze, startX, startY, rows, cols, false);
    result = bfsResult.count;
  }
  if (isPartTwo) {
    final partTwoResult = solvePartTwo(maze, startX, startY, rows, cols, 0);
    result = partTwoResult;
  }

  return result;
}

int solvePartTwo(
  List<List<String>> grid,
  int startRow,
  int startCol,
  int rows,
  int cols,
  int total,
) {
  final result = bfsMatrix(grid, startRow, startCol, rows, cols, true);
  if (result.count == 0) {
    return total;
  }
  total += result.count;
  return solvePartTwo(result.maze, startRow, startCol, rows, cols, total);
}

/// BFS over a matrix of strings, starting from (startRow, startCol).
({int count, List<List<String>> maze}) bfsMatrix(
  List<List<String>> grid,
  int startRow,
  int startCol,
  int rows,
  int cols,
  bool isPartTwo,
) {
  if (rows == 0) return (count: 0, maze: grid);

  if (!isValid(startRow, startCol, rows, cols)) {
    throw ArgumentError('Start position is out of bounds');
  }
  final mazeCopy = deepCopy2D(grid);

  final visited = List.generate(rows, (_) => List<bool>.filled(cols, false));

  final queue = Queue<(int row, int col)>();
  queue.add((startRow, startCol));
  visited[startRow][startCol] = true;
  int count = 0;

  while (queue.isNotEmpty) {
    final (r, c) = queue.removeFirst();

    // Process current cell
    final value = grid[r][c];
    if (value == '@') {
      final paperCount = gridMovePatternsAndDiagonals
          .map((pattern) {
            final (dr, dc) = pattern;
            final nr = r + dr;
            final nc = c + dc;
            return isValid(nr, nc, rows, cols) ? grid[nr][nc] : null;
          })
          .whereType<String>()
          .where((x) => x == '@')
          .length;
      bool canCollect = paperCount < 4;
      mazeCopy[r][c] = canCollect ? 'x' : "@";
      count += canCollect ? 1 : 0;
    }

    // Explore neighbors
    for (final (dr, dc) in gridMovePatterns) {
      final nr = r + dr;
      final nc = c + dc;

      if (isValid(nr, nc, rows, cols) && !visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.add((nr, nc));
      }
    }
  }
  return (count: count, maze: mazeCopy);
}
