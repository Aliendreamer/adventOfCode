import 'dart:io';

import '../helpers.dart';

class Range {
  final BigInt start;
  final BigInt end;

  Range(this.start, this.end);
}

Future<void> runDay5({String inputFile = 'day5/input.txt'}) async {
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

BigInt solve(List<String> inputs, bool isPartTwo) {
  final emptyIndex = inputs.indexOf('');
  final ranges = inputs.sublist(0, emptyIndex);
  final indexes = inputs.sublist(emptyIndex + 1);
  List<int> spoiled = List<int>.empty(growable: true);
  BigInt total = BigInt.zero;
  final partTwo = <Range>[];
  for (final range in ranges) {
    final parts = range.split('-');
    final start = int.parse(parts[0]);
    final end = int.parse(parts[1]);
    if (isPartTwo) {
      final start = BigInt.parse(parts[0]);
      final end = BigInt.parse(parts[1]);
      partTwo.add(Range(start, end));
      continue;
    }

    for (final index in indexes) {
      final idx = int.parse(index);
      final checked = spoiled.any((x) => x == idx);
      final isSpoiled = start <= idx && idx <= end;
      if (isSpoiled && !checked) {
        spoiled.add(idx);
      }
    }
  }
  if (isPartTwo) {
    partTwo.sort((a, b) {
      final cs = a.start.compareTo(b.start);
      return cs != 0 ? cs : a.end.compareTo(b.end);
    });

    // 3. Merge overlapping ranges
    final merged = <Range>[];
    var curStart = partTwo.first.start;
    var curEnd = partTwo.first.end;

    for (var i = 1; i < partTwo.length; i++) {
      final r = partTwo[i];

      // If overlapping or touching
      if (r.start <= curEnd + BigInt.one) {
        if (r.end > curEnd) curEnd = r.end;
      } else {
        // Push merged interval
        merged.add(Range(curStart, curEnd));
        curStart = r.start;
        curEnd = r.end;
      }
    }

    merged.add(Range(curStart, curEnd)); // Last interval

    // 4. Compute total count of all merged ranges

    for (final m in merged) {
      total += (m.end - m.start + BigInt.one);
    }
  }

  return isPartTwo ? total : BigInt.from(spoiled.length);
}
