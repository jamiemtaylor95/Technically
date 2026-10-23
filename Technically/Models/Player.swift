import Foundation

struct Player: Identifiable, Hashable, Codable {
    var id = UUID()
    var name: String
    var colorIndex: Int

    var initial: String {
        name.trimmingCharacters(in: .whitespaces).first.map { String($0).uppercased() } ?? "?"
    }
}

struct GameSettings: Codable, Equatable {
    static let roundOptions = [5, 10, 15, 20]
    static let timerOptions = [15, 30, 60, 90]
    static let maxPlayers = 8

    var rounds = 10
    var timerSeconds = 30
    var categories = Set(Category.allCases)
}
