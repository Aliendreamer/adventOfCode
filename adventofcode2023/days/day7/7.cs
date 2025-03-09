namespace adventofcode2023
{
	using System;
	using System.Data;
	using System.Globalization;
	using System.Linq;

	public static class Day7
	{
		static readonly char[] cardTypes = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

		public class Hand
		{
			public string Cards { get; set; } = string.Empty;
			public int Bid { get; set; }
			// Category: 1 = High card, 2 = One pair, 3 = Two pair, 4 = Three of a kind,
			// 5 = Full house, 6 = Four of a kind, 7 = Five of a kind.
			public int Category { get; set; }
			// Tie-breaker: the list of card values in the order given in the hand string.
			public int[] TieBreaker { get; set; } = [];
			public int OriginalIndex { get; set; }
			public int Rank { get; set; }
		}

		// Determine the hand category based on the frequency of card labels.
		// Categories (from weakest to strongest):
		// 1: High card (all cards distinct)
		// 2: One pair (one pair and three distinct singles)
		// 3: Two pair (two pairs and one single)
		// 4: Three of a kind (three cards same, two singles)
		// 5: Full house (three of a kind and a pair)
		// 6: Four of a kind (four cards same, one kicker)
		// 7: Five of a kind (all cards the same)
		static int GetHandCategory(string hand)
		{
			Dictionary<char, int> freq = new Dictionary<char, int>();
			foreach (char c in hand)
			{
				if (!freq.ContainsKey(c))
					freq[c] = 0;
				freq[c]++;
			}

			int distinct = freq.Count;
			if (distinct == 1)
				return 7; // Five of a kind
			else if (distinct == 2)
			{
				// Possibilities: 4+1 or 3+2
				if (freq.ContainsValue(4))
					return 6; // Four of a kind
				else
					return 5; // Full house
			}
			else if (distinct == 3)
			{
				// Possibilities: 3+1+1 (three-of-a-kind) or 2+2+1 (two pair)
				if (freq.Values.Any(x => x == 3))
					return 4; // Three of a kind
				else
					return 3; // Two pair
			}
			else if (distinct == 4)
				return 2; // One pair
			else
				return 1; // High card (all five cards distinct)
		}

		static int GetHandCategoryWithJokers(string hand)
		{
			// Count jokers and frequency of non-joker cards.
			int jokerCount = 0;
			Dictionary<char, int> freq = new Dictionary<char, int>();
			foreach (char c in hand)
			{
				if (c == 'J')
				{
					jokerCount++;
				}
				else
				{
					if (!freq.ContainsKey(c))
						freq[c] = 0;
					freq[c]++;
				}
			}

			// Helper: get frequency for a given card type (or 0 if not present)
			int GetFreq(char c) => freq.TryGetValue(c, out int value) ? value : 0;

			// Check categories from best (7: Five-of-a-kind) to worst (1: High card).

			// 7: Five of a kind: Some card type X can be made five-of-a-kind.
			foreach (char card in cardTypes)
			{
				if (GetFreq(card) + jokerCount >= 5)
					return 7;
			}
			// If hand is all jokers, it is five-of-a-kind (already caught above).

			// 6: Four of a kind.
			foreach (char card in cardTypes)
			{
				if (GetFreq(card) + jokerCount >= 4)
					return 6;
			}

			// 5: Full house (three of one kind and two of another; the two must be different).
			// Try all pairs (X, Y) with X != Y.
			foreach (char x in cardTypes)
			{
				int neededForTrip = Math.Max(0, 3 - GetFreq(x));
				foreach (char y in cardTypes)
				{
					if (y == x) continue;
					int neededForPair = Math.Max(0, 2 - GetFreq(y));
					if (neededForTrip + neededForPair <= jokerCount)
						return 5;
				}
			}

			// 4: Three of a kind.
			foreach (char card in cardTypes)
			{
				if (GetFreq(card) + jokerCount >= 3)
					return 4;
			}

			// 3: Two pair.
			// We need to choose two distinct card types X and Y such that
			// needed for X (to get a pair) + needed for Y (to get a pair) <= jokerCount.
			for (int i = 0; i < cardTypes.Length; i++)
			{
				for (int j = i + 1; j < cardTypes.Length; j++)
				{
					int neededForFirst = Math.Max(0, 2 - GetFreq(cardTypes[i]));
					int neededForSecond = Math.Max(0, 2 - GetFreq(cardTypes[j]));
					if (neededForFirst + neededForSecond <= jokerCount)
						return 3;
				}
			}

			// 2: One pair.
			foreach (char card in cardTypes)
			{
				if (GetFreq(card) + jokerCount >= 2)
					return 2;
			}

			// 1: High card.
			return 1;
		}

		static readonly Dictionary<char, int> cardValue = new Dictionary<char, int>
		{
			{ 'A', 14 },
			{ 'K', 13 },
			{ 'Q', 12 },
			{ 'J', 11 },
			{ 'T', 10 },
			{ '9', 9 },
			{ '8', 8 },
			{ '7', 7 },
			{ '6', 6 },
			{ '5', 5 },
			{ '4', 4 },
			{ '3', 3 },
			{ '2', 2 }
		};

		static readonly Dictionary<char, int> tieBreakerValue = new Dictionary<char, int>
		{
			{ 'A', 14 },
			{ 'K', 13 },
			{ 'Q', 12 },
			{ 'T', 10 },
			{ '9', 9 },
			{ '8', 8 },
			{ '7', 7 },
			{ '6', 6 },
			{ '5', 5 },
			{ '4', 4 },
			{ '3', 3 },
			{ '2', 2 },
			{ 'J', 1 }  // Joker is the weakest for tie–breakers.
		};

		private static readonly char[] separator = [' ', '\t'];

		public static void Run1()
		{
			Console.WriteLine("Running Day 7 part 1");
			List<Hand> hands = [];
			var inputLines = (string[])Helpers.TaskInput(7, InputFormat.Multiline);
			int index = 0;
			foreach (var line in inputLines)
			{
				var parts = line.Split(separator, StringSplitOptions.RemoveEmptyEntries);
				if (parts.Length < 2)
					continue;

				string handStr = parts[0];
				int bid = int.Parse(parts[1], CultureInfo.InvariantCulture);

				// Create the Hand object
				Hand hand = new Hand
				{
					Cards = handStr,
					Bid = bid,
					OriginalIndex = index
				};
				// Determine the hand's type category
				hand.Category = GetHandCategory(handStr);
				// Build the tie-breaker list from the given card order
				hand.TieBreaker = handStr.Select(c => cardValue[c]).ToArray();

				hands.Add(hand);
				index++;
			}

			// Sort hands from weakest to strongest.
			// The primary sort key is the Category (a lower category number means a weaker type)
			// If two hands have the same type, we compare the tie-breaker values in order.
			List<Hand> sorted = [.. hands];
			sorted.Sort((a, b) =>
			{
				if (a.Category != b.Category)
					return a.Category.CompareTo(b.Category);
				// Compare each card in the tie-breaker array (using the given order)
				for (int i = 0; i < a.TieBreaker.Length; i++)
				{
					if (a.TieBreaker[i] != b.TieBreaker[i])
						return a.TieBreaker[i].CompareTo(b.TieBreaker[i]);
				}
				return 0;
			});

			// Assign ranks: the weakest hand gets rank 1, the next gets rank 2, and so on.
			for (int i = 0; i < sorted.Count; i++)
			{
				sorted[i].Rank = i + 1;
			}

			// Calculate total winnings: for each hand, winnings = bid * rank.
			long totalWinnings = sorted.Sum(h => (long)h.Bid * h.Rank);

			// Output the rank for each hand in the original input order.
			// (Since the same Hand objects are in both lists, their Rank property is updated.)
			Console.WriteLine("Hand Ranks (in input order):");
			foreach (var hand in hands.OrderBy(h => h.OriginalIndex))
			{
				Console.WriteLine($"{hand.Cards} (bid: {hand.Bid}) -> Rank: {hand.Rank}");
			}
			Console.WriteLine("Total Winnings: " + totalWinnings);


		}

		public static void Run2()
		{
			Console.WriteLine("Running Day 7 Part 2");
			List<Hand> hands = [];
			int index = 0;
			var inputLines = (string[])Helpers.TaskInput(7, InputFormat.Multiline);
			foreach (var line in inputLines)
			{
				var parts = line.Split(separator, StringSplitOptions.RemoveEmptyEntries);
				if (parts.Length < 2)
					continue;

				string handStr = parts[0];
				int bid = int.Parse(parts[1], CultureInfo.InvariantCulture);

				Hand hand = new Hand
				{
					Cards = handStr,
					Bid = bid,
					OriginalIndex = index,
					Category = GetHandCategoryWithJokers(handStr),
					// For tie-breakers, map each card using our tieBreakerValue dictionary.
					TieBreaker = handStr.Select(c => tieBreakerValue[c]).ToArray()
				};
				hands.Add(hand);
				index++;
			}
			// Sort hands: primary key is Category (lower category value means weaker hand)
			// then compare tie-breaker arrays lexicographically.
			List<Hand> sorted = hands.ToList();
			sorted.Sort((a, b) =>
			{
				if (a.Category != b.Category)
					return a.Category.CompareTo(b.Category);
				for (int i = 0; i < a.TieBreaker.Length; i++)
				{
					if (a.TieBreaker[i] != b.TieBreaker[i])
						return a.TieBreaker[i].CompareTo(b.TieBreaker[i]);
				}
				return 0;
			});

			// Assign ranks: weakest hand gets rank 1, then increasing.
			for (int i = 0; i < sorted.Count; i++)
			{
				sorted[i].Rank = i + 1;
			}

			// Calculate total winnings: bid multiplied by rank for each hand.
			long totalWinnings = sorted.Sum(h => (long)h.Bid * h.Rank);

			// Output results (ranks in the original input order)
			Console.WriteLine("Hand Ranks (in input order):");
			foreach (var hand in hands.OrderBy(h => h.OriginalIndex))
			{
				Console.WriteLine($"{hand.Cards} (bid: {hand.Bid}) -> Rank: {hand.Rank}, Category: {hand.Category}");
			}
			Console.WriteLine("Total Winnings: " + totalWinnings);
		}
	}
}