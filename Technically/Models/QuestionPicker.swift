import Foundation

/// Picks questions for a game, preferring ones the group hasn't seen yet.
struct QuestionPicker {
    var bank: [Question]

    func pool(for categories: Set<Category>) -> [Question] {
        let filtered = bank.filter { categories.contains($0.category) }
        return filtered.isEmpty ? bank : filtered
    }

    func pick(
        count: Int,
        categories: Set<Category>,
        seen: Set<String>,
        using rng: inout some RandomNumberGenerator
    ) -> [RoundQuestion] {
        let pool = pool(for: categories)
        let fresh = pool.filter { !seen.contains($0.id) }.shuffled(using: &rng)
        let repeats = pool.filter { seen.contains($0.id) }.shuffled(using: &rng)

        return (fresh + repeats).prefix(max(count, 0)).map { question in
            RoundQuestion(question: question, correctSide: Bool.random(using: &rng) ? .a : .b)
        }
    }

    func pick(count: Int, categories: Set<Category>, seen: Set<String>) -> [RoundQuestion] {
        var rng = SystemRandomNumberGenerator()
        return pick(count: count, categories: categories, seen: seen, using: &rng)
    }
}
