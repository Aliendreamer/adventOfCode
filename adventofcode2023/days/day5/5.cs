namespace adventofcode2023
{
	using System;
	using System.Data;
	using System.Globalization;
	using System.Linq;
	public static class Day5
	{

		static long MapValue(long x, List<(long dest, long src, long len)> rules)
		{
			foreach (var rule in rules)
			{
				if (x >= rule.src && x < rule.src + rule.len)
				{
					return rule.dest + (x - rule.src);
				}
			}
			return x;
		}

		public static void Run1()
		{
			Console.WriteLine("Running Day 5 part 1");
			var input = (string[])Helpers.TaskInput(5, InputFormat.Multiline);
			var allLines = input.ToList();
			while (allLines.Count > 0 && string.IsNullOrWhiteSpace(allLines[0]))
				allLines.RemoveAt(0);

			// --- Parse the Seeds ---
			List<long> seeds = new List<long>();
			if (allLines.Count > 0 && allLines[0].StartsWith("seeds:", StringComparison.InvariantCulture))
			{
				var seedLine = allLines[0];
				seeds = seedLine.Split(' ', StringSplitOptions.RemoveEmptyEntries)
								.Skip(1) // skip the "seeds:" token
								.Select(long.Parse)
								.ToList();
				allLines.RemoveAt(0);
			}

			// --- PART 2: Parse the Mapping Sections ---
			var mappingSections = new Dictionary<string, List<(long dest, long src, long len)>>();
			int idx = 0;
			while (idx < allLines.Count)
			{
				if (string.IsNullOrWhiteSpace(allLines[idx]))
				{
					idx++;
					continue;
				}
				// Read header line.
				string headerLine = allLines[idx].Trim();
				idx++;
				string sectionName = headerLine.EndsWith(" map:", StringComparison.InvariantCulture) ?
								headerLine.Substring(0, headerLine.Length - " map:".Length) :
								headerLine;
				List<(long dest, long src, long len)> rules = new List<(long dest, long src, long len)>();
				while (idx < allLines.Count && !string.IsNullOrWhiteSpace(allLines[idx]))
				{
					var parts = allLines[idx].Split(' ', StringSplitOptions.RemoveEmptyEntries);
					if (parts.Length == 3)
					{
						long dest = long.Parse(parts[0], CultureInfo.InvariantCulture);
						long src = long.Parse(parts[1], CultureInfo.InvariantCulture);
						long len = long.Parse(parts[2], CultureInfo.InvariantCulture);
						rules.Add((dest, src, len));
					}
					idx++;
				}
				mappingSections[sectionName] = rules;
			}

			// --- PART 3: Define the Mapping Chain Order ---
			string[] chain =
			[
				"seed-to-soil",
				"soil-to-fertilizer",
				"fertilizer-to-water",
				"water-to-light",
				"light-to-temperature",
				"temperature-to-humidity",
				"humidity-to-location"
			];

			// --- PART 4: Process Each Seed Through the Mapping Chain ---
			List<long> finalLocations = new List<long>();
			foreach (var seed in seeds)
			{
				long current = seed;
				foreach (var mapName in chain)
				{
					if (mappingSections.TryGetValue(mapName, out var rules))
					{
						current = MapValue(current, rules);
					}

				}
				finalLocations.Add(current);
				Console.WriteLine($"Seed {seed} => Final Location: {current}");
			}

			// --- PART 5: Find the Lowest Location ---
			long lowest = finalLocations.Min();
			Console.WriteLine($"\nLowest location among seeds: {lowest}");
		}

		sealed class Interval
		{
			public long Low;
			public long High;
			public long Offset;
		}

		static List<Interval> ApplyMappingStageEx(List<Interval> intervals, List<(long dest, long src, long len)> rules)
		{
			var result = new List<Interval>();

			foreach (var iv in intervals)
			{
				var boundaries = new SortedSet<long>();
				boundaries.Add(iv.Low);
				boundaries.Add(iv.High);

				foreach (var rule in rules)
				{
					long startDom = rule.src - iv.Offset;
					long endDom = rule.src + rule.len - iv.Offset;
					// Only add if they lie within our interval.
					if (startDom > iv.Low && startDom < iv.High)
						boundaries.Add(startDom);
					if (endDom > iv.Low && endDom < iv.High)
						boundaries.Add(endDom);
				}

				var boundsList = boundaries.ToList();
				for (int i = 0; i < boundsList.Count - 1; i++)
				{
					long subLow = boundsList[i];
					long subHigh = boundsList[i + 1];
					long fval = subLow + iv.Offset;

					(long dest, long src, long len)? ruleApplied = null;
					foreach (var rule in rules)
					{
						if (fval >= rule.src && fval < rule.src + rule.len)
						{
							ruleApplied = rule;
							break;
						}
					}
					long newOffset = iv.Offset;
					if (ruleApplied.HasValue)
					{
						newOffset += (ruleApplied.Value.dest - ruleApplied.Value.src);
					}
					result.Add(new Interval { Low = subLow, High = subHigh, Offset = newOffset });
				}
			}

			return result;
		}

		public static void Run2()
		{
			Console.WriteLine("Running Day 5 Part 2");


			var lines = (string[])Helpers.TaskInput(5, InputFormat.Multiline);
			var allLines = lines.ToList();
			while (allLines.Count > 0 && string.IsNullOrWhiteSpace(allLines[0]))
				allLines.RemoveAt(0);

			List<Interval> seedIntervals = new List<Interval>();
			if (allLines.Count > 0 && allLines[0].StartsWith("seeds:", StringComparison.InvariantCulture))
			{
				var seedLine = allLines[0];
				var tokens = seedLine.Split(' ', StringSplitOptions.RemoveEmptyEntries).Skip(1).ToArray();
				for (int i = 0; i < tokens.Length; i += 2)
				{
					long start = long.Parse(tokens[i], CultureInfo.InvariantCulture);
					long length = long.Parse(tokens[i + 1], CultureInfo.InvariantCulture);
					seedIntervals.Add(new Interval { Low = start, High = start + length, Offset = 0 });
				}
				allLines.RemoveAt(0);
			}
			Console.WriteLine($"Parsed {seedIntervals.Count} seed intervals.");

			var mappingSections = new Dictionary<string, List<(long dest, long src, long len)>>();
			int idx = 0;
			while (idx < allLines.Count)
			{
				if (string.IsNullOrWhiteSpace(allLines[idx]))
				{
					idx++;
					continue;
				}
				string headerLine = allLines[idx].Trim();
				idx++;
				string sectionName = headerLine.EndsWith(" map:", StringComparison.InvariantCulture)
										? headerLine.Substring(0, headerLine.Length - " map:".Length)
										: headerLine;
				List<(long dest, long src, long len)> rules = new List<(long dest, long src, long len)>();
				while (idx < allLines.Count && !string.IsNullOrWhiteSpace(allLines[idx]))
				{
					var parts = allLines[idx].Split(' ', StringSplitOptions.RemoveEmptyEntries);
					if (parts.Length == 3)
					{
						long dest = long.Parse(parts[0], CultureInfo.InvariantCulture);
						long src = long.Parse(parts[1], CultureInfo.InvariantCulture);
						long len = long.Parse(parts[2], CultureInfo.InvariantCulture);
						rules.Add((dest, src, len));
					}
					idx++;
				}
				mappingSections[sectionName] = rules;
			}
			Console.WriteLine($"Parsed {mappingSections.Count} mapping sections.");

			string[] chain =
			[
				"seed-to-soil",
				"soil-to-fertilizer",
				"fertilizer-to-water",
				"water-to-light",
				"light-to-temperature",
				"temperature-to-humidity",
				"humidity-to-location"
			];

			foreach (var mapName in chain)
			{
				if (mappingSections.TryGetValue(mapName, out var rules))
				{
					seedIntervals = ApplyMappingStageEx(seedIntervals, rules);
				}
			}

			long best = long.MaxValue;
			foreach (var iv in seedIntervals)
			{
				long candidate = iv.Low + iv.Offset;
				if (candidate < best)
					best = candidate;
			}
			Console.WriteLine($"\nLowest location among all seeds: {best}");
		}
	}
}