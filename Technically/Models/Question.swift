import Foundation

enum Category: String, CaseIterable, Codable, Identifiable, Hashable {
    case animals
    case science
    case space
    case food
    case history
    case myths

    var id: String { rawValue }

    var title: String {
        switch self {
        case .animals: "Animals"
        case .science: "Science"
        case .space: "Space"
        case .food: "Food"
        case .history: "History"
        case .myths: "Myths"
        }
    }

    var emoji: String {
        switch self {
        case .animals: "🦀"
        case .science: "🧪"
        case .space: "🪐"
        case .food: "🍅"
        case .history: "🏛️"
        case .myths: "🤔"
        }
    }
}

/// A two-sided "technically" question: one answer is what most people
/// assume, the other is what's actually true.
struct Question: Identifiable, Hashable {
    let category: Category
    let emoji: String
    let prompt: String
    let correct: String
    let wrong: String
    let fact: String

    var id: String { prompt }
}

enum Side: String, CaseIterable, Codable, Hashable {
    case a
    case b

    var label: String { rawValue.uppercased() }
}

/// A question as it's played in a round, with its answers placed on a side.
struct RoundQuestion: Identifiable, Hashable {
    let question: Question
    let correctSide: Side

    var id: String { question.id }

    func answer(for side: Side) -> String {
        side == correctSide ? question.correct : question.wrong
    }
}
