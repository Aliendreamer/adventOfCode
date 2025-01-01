namespace adventofcode2023
{
	using System.Diagnostics;
	using System.Globalization;
	public static class Helpers
	{
		public static string TaskInput(int day)
		{
			string inputFileName = "input.txt";
			string currentDirectory = Directory.GetCurrentDirectory();
			string dirc = string.Format(CultureInfo.InvariantCulture, "day{0}", day);
			string inputFilePath = Path.Combine(currentDirectory, "days", dirc, inputFileName);
			string input = File.ReadAllText(inputFilePath);
			return input;
		}

		public static void BenchmarkDay(Action func)
		{
			Stopwatch stopwatch = Stopwatch.StartNew();
			try
			{
				func();
			}
			catch (Exception e)
			{

				Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "Exception Happened {0}", e.Message));
			}
			stopwatch.Stop();
			Console.WriteLine($"Day  solution executed in: {stopwatch.ElapsedMilliseconds} ms");
		}

		private static readonly int[][] gridMovePatternsAndDiagonals =
		[
			new int[] {0, 1}, // Right
            new int[] {0, -1}, // Left
            [1, 0], // Down
            new int[] {-1, 0}, // Up
            new int[] {1, 1}, // Down-Right
            new int[] {1, -1}, // Down-Left
            new int[] {-1, 1}, // Up-Right
            new int[] {-1, -1}, // Up-Left
        ];

		private static readonly int[][] gridMovePatterns =
		[
			new int[] {0, 1}, // Right
            new int[] {1, 0}, // Down
            new int[] {0, -1}, // Left
            new int[] {-1, 0}, // Up
        ];

		public static int[][] GridMovePatternsAndDiagonals => gridMovePatternsAndDiagonals;
		public static int[][] GridMovePatterns => gridMovePatterns;

		public static bool IsValid(int x, int y, int rows, int cols) => x >= 0 && y >= 0 && x < rows && y < cols;

		public static void DrawGrid(char[][] grid)
		{
			foreach (var row in grid)
			{
				Console.WriteLine(string.Join("", row));
			}
		}

		public static bool IsWall(char position) => position == '#';

		public static bool IsStart(char position) => position == 'S';
		public static bool IsEnd(char position) => position == 'E';

		public static (int[] startPoint, int[] endPoint) GetStartPoint(char[][] grid)
		{
			int[] startPoint = [];
			int[] endPoint = [];
			for (int i = 0; i < grid.Length; i++)
			{
				for (int j = 0; j < grid[0].Length; j++)
				{
					if (IsStart(grid[i][j]))
					{
						startPoint = [i, j];
					}
					if (IsEnd(grid[i][j]))
					{
						endPoint = [i, j];
					}
				}
			}
			return (startPoint, endPoint);
		}

		public static string ToKey(dynamic value1, dynamic value2) => $"{value1}_{value2}";

		public static string ToKey(dynamic value1, dynamic value2, dynamic value3) => $"{value1}_{value2}_${value3}";
		public static int ConcatNumbers(int a, int b)
		{
			int pow = (int)Math.Floor(Math.Floor(Math.Log10(b) + 1));
			return (int)Math.Floor(a * Math.Pow(10, pow) + b);

		}
	}
}
