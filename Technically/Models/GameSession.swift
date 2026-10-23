import Foundation
import Observation

enum GamePhase: Equatable {
    /// The group argues while the timer runs.
    case debate
    /// Everyone locks in a side.
    case vote
    /// The real answer and a fun fact.
    case reveal
    case finished
}

struct RoundOutcome: Equatable {
    let correctSide: Side
    let points: [Player.ID: Int]
    /// True when the people who got it right were outnumbered.
    let underdogBonus: Bool

    var winnerIDs: Set<Player.ID> { Set(points.keys) }
}

struct Standing: Identifiable, Equatable {
    let player: Player
    let score: Int
    let correctCount: Int
    let rank: Int

    var id: Player.ID { player.id }
}

@Observable
final class GameSession: Identifiable {
    static let pointsForCorrect = 100
    static let underdogPoints = 50

    let id = UUID()
    let players: [Player]
    let rounds: [RoundQuestion]
    let timerSeconds: Int

    private(set) var roundIndex = 0
    private(set) var phase: GamePhase
    private(set) var votes: [Player.ID: Side] = [:]
    private(set) var scores: [Player.ID: Int] = [:]
    private(set) var correctCounts: [Player.ID: Int] = [:]
    private(set) var lastOutcome: RoundOutcome?

    init(players: [Player], rounds: [RoundQuestion], timerSeconds: Int) {
        self.players = players
        self.rounds = rounds
        self.timerSeconds = timerSeconds
        self.phase = rounds.isEmpty || players.isEmpty ? .finished : .debate
    }

    var currentRound: RoundQuestion? {
        rounds.indices.contains(roundIndex) ? rounds[roundIndex] : nil
    }

    var roundNumber: Int { min(roundIndex + 1, rounds.count) }
    var isLastRound: Bool { roundIndex >= rounds.count - 1 }
    var allVotesIn: Bool { players.allSatisfy { votes[$0.id] != nil } }

    func voters(for side: Side) -> [Player] {
        players.filter { votes[$0.id] == side }
    }

    func score(for player: Player) -> Int { scores[player.id, default: 0] }

    // MARK: - Actions

    func startVoting() {
        guard phase == .debate else { return }
        phase = .vote
    }

    func vote(_ side: Side, for player: Player) {
        guard phase == .vote else { return }
        votes[player.id] = side
    }

    func reveal() {
        guard phase == .vote, allVotesIn, let round = currentRound else { return }

        let right = voters(for: round.correctSide)
        let underdog = !right.isEmpty && right.count * 2 < players.count
        let award = Self.pointsForCorrect + (underdog ? Self.underdogPoints : 0)

        var points: [Player.ID: Int] = [:]
        for player in right {
            points[player.id] = award
            scores[player.id, default: 0] += award
            correctCounts[player.id, default: 0] += 1
        }

        lastOutcome = RoundOutcome(correctSide: round.correctSide, points: points, underdogBonus: underdog)
        phase = .reveal
    }

    func nextRound() {
        guard phase == .reveal else { return }
        votes = [:]
        lastOutcome = nil
        roundIndex += 1
        phase = roundIndex < rounds.count ? .debate : .finished
    }

    // MARK: - Results

    /// Players ordered by score. Tied players share a rank.
    var standings: [Standing] {
        let sorted = players.enumerated().sorted { lhs, rhs in
            let l = score(for: lhs.element), r = score(for: rhs.element)
            return l != r ? l > r : lhs.offset < rhs.offset
        }.map(\.element)

        var result: [Standing] = []
        for (index, player) in sorted.enumerated() {
            let points = score(for: player)
            let rank = result.last.flatMap { $0.score == points ? $0.rank : nil } ?? index + 1
            result.append(Standing(
                player: player,
                score: points,
                correctCount: correctCounts[player.id, default: 0],
                rank: rank
            ))
        }
        return result
    }

    var winners: [Player] {
        standings.filter { $0.rank == 1 }.map(\.player)
    }
}
