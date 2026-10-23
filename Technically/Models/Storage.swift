import Foundation

/// Remembers the last group, their settings, and which questions they've seen.
struct Storage {
    private enum Key {
        static let players = "players"
        static let settings = "settings"
        static let seen = "seenQuestionIDs"
    }

    var defaults: UserDefaults = .standard

    var players: [Player] {
        get { decode([Player].self, forKey: Key.players) ?? [] }
        nonmutating set { encode(newValue, forKey: Key.players) }
    }

    var settings: GameSettings {
        get { decode(GameSettings.self, forKey: Key.settings) ?? GameSettings() }
        nonmutating set { encode(newValue, forKey: Key.settings) }
    }

    var seenQuestionIDs: Set<String> {
        get { Set(defaults.stringArray(forKey: Key.seen) ?? []) }
        nonmutating set { defaults.set(Array(newValue), forKey: Key.seen) }
    }

    /// Marks questions as seen. Once every question in `pool` has been seen,
    /// the pool starts over so the deck never runs dry.
    func markSeen(_ ids: [String], pool: [Question]) {
        var seen = seenQuestionIDs.union(ids)
        if pool.allSatisfy({ seen.contains($0.id) }) {
            seen.subtract(pool.map(\.id))
            seen.formUnion(ids)
        }
        seenQuestionIDs = seen
    }

    private func decode<T: Decodable>(_ type: T.Type, forKey key: String) -> T? {
        defaults.data(forKey: key).flatMap { try? JSONDecoder().decode(type, from: $0) }
    }

    private func encode(_ value: some Encodable, forKey key: String) {
        defaults.set(try? JSONEncoder().encode(value), forKey: key)
    }
}
