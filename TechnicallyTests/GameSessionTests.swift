import Foundation
import Testing
@testable import Technically

private func makePlayers(_ count: Int) -> [Player] {
    (0..<count).map { Player(name: "P\($0)", colorIndex: $0) }
}

private func makeRounds(_ sides: [Side]) -> [RoundQuestion] {
    sides.enumerated().map { index, side in
        RoundQuestion(
            question: Question(category: .science, emoji: "🧪", prompt: "Q\(index)", correct: "Right", wrong: "Wrong", fact: "Fact"),
            correctSide: side
        )
    }
}

struct GameSessionTests {
    @Test func startsInDebate() {
        let session = GameSession(players: makePlayers(2), rounds: makeRounds([.a]), timerSeconds: 30)
        #expect(session.phase == .debate)
        #expect(session.roundNumber == 1)
    }

    @Test func emptyGameIsFinished() {
        let session = GameSession(players: makePlayers(2), rounds: [], timerSeconds: 30)
        #expect(session.phase == .finished)
    }

    @Test func cannotRevealUntilEveryoneVotes() {
        let players = makePlayers(2)
        let session = GameSession(players: players, rounds: makeRounds([.a]), timerSeconds: 30)
        session.startVoting()
        session.vote(.a, for: players[0])
        session.reveal()
        #expect(session.phase == .vote)

        session.vote(.b, for: players[1])
        session.reveal()
        #expect(session.phase == .reveal)
    }

    @Test func votesIgnoredOutsideVotePhase() {
        let players = makePlayers(1)
        let session = GameSession(players: players, rounds: makeRounds([.a]), timerSeconds: 30)
        session.vote(.a, for: players[0])
        #expect(session.votes.isEmpty)
    }

    @Test func awardsPointsToCorrectPlayers() {
        let players = makePlayers(2)
        let session = GameSession(players: players, rounds: makeRounds([.b]), timerSeconds: 30)
        session.startVoting()
        session.vote(.a, for: players[0])
        session.vote(.b, for: players[1])
        session.reveal()

        #expect(session.score(for: players[0]) == 0)
        #expect(session.score(for: players[1]) == GameSession.pointsForCorrect)
        #expect(session.lastOutcome?.underdogBonus == false)
    }

    @Test func underdogBonusWhenRightAnswerIsInTheMinority() {
        let players = makePlayers(3)
        let session = GameSession(players: players, rounds: makeRounds([.a]), timerSeconds: 30)
        session.startVoting()
        session.vote(.a, for: players[0])
        session.vote(.b, for: players[1])
        session.vote(.b, for: players[2])
        session.reveal()

        #expect(session.lastOutcome?.underdogBonus == true)
        #expect(session.score(for: players[0]) == GameSession.pointsForCorrect + GameSession.underdogPoints)
    }

    @Test func noUnderdogBonusWhenNobodyIsRight() {
        let players = makePlayers(3)
        let session = GameSession(players: players, rounds: makeRounds([.a]), timerSeconds: 30)
        session.startVoting()
        players.forEach { session.vote(.b, for: $0) }
        session.reveal()

        #expect(session.lastOutcome?.underdogBonus == false)
        #expect(session.lastOutcome?.points.isEmpty == true)
    }

    @Test func advancesThroughRoundsToFinished() {
        let players = makePlayers(1)
        let session = GameSession(players: players, rounds: makeRounds([.a, .b]), timerSeconds: 30)

        for side in [Side.a, .b] {
            #expect(session.phase == .debate)
            session.startVoting()
            session.vote(side, for: players[0])
            session.reveal()
            session.nextRound()
            #expect(session.votes.isEmpty)
        }

        #expect(session.phase == .finished)
        #expect(session.score(for: players[0]) == 2 * GameSession.pointsForCorrect)
        #expect(session.standings.first?.correctCount == 2)
    }

    @Test func standingsShareRankOnTies() {
        let players = makePlayers(3)
        let session = GameSession(players: players, rounds: makeRounds([.a]), timerSeconds: 30)
        session.startVoting()
        session.vote(.a, for: players[0])
        session.vote(.b, for: players[1])
        session.vote(.a, for: players[2])
        session.reveal()

        let standings = session.standings
        #expect(standings.map(\.rank) == [1, 1, 3])
        #expect(standings.map(\.player) == [players[0], players[2], players[1]])
        #expect(session.winners == [players[0], players[2]])
    }
}

struct QuestionPickerTests {
    private struct SeededGenerator: RandomNumberGenerator {
        var state: UInt64
        mutating func next() -> UInt64 {
            state = state &* 6364136223846793005 &+ 1442695040888963407
            return state
        }
    }

    @Test func picksOnlySelectedCategories() {
        var rng = SeededGenerator(state: 1)
        let picked = QuestionPicker(bank: QuestionBank.all)
            .pick(count: 5, categories: [.space], seen: [], using: &rng)
        #expect(picked.count == 5)
        #expect(picked.allSatisfy { $0.question.category == .space })
    }

    @Test func prefersUnseenQuestions() {
        var rng = SeededGenerator(state: 2)
        let pool = QuestionBank.space
        let seen = Set(pool.dropLast(2).map(\.id))
        let picked = QuestionPicker(bank: QuestionBank.all)
            .pick(count: 2, categories: [.space], seen: seen, using: &rng)
        #expect(Set(picked.map(\.id)) == Set(pool.suffix(2).map(\.id)))
    }

    @Test func fallsBackToSeenQuestionsWhenPoolRunsOut() {
        var rng = SeededGenerator(state: 3)
        let pool = QuestionBank.space
        let picked = QuestionPicker(bank: QuestionBank.all)
            .pick(count: pool.count + 10, categories: [.space], seen: Set(pool.map(\.id)), using: &rng)
        #expect(picked.count == pool.count)
        #expect(Set(picked.map(\.id)).count == pool.count)
    }

    @Test func answerPlacementMatchesCorrectSide() {
        var rng = SeededGenerator(state: 4)
        let picked = QuestionPicker(bank: QuestionBank.all)
            .pick(count: 20, categories: Set(Category.allCases), seen: [], using: &rng)
        for round in picked {
            #expect(round.answer(for: round.correctSide) == round.question.correct)
            #expect(round.answer(for: round.correctSide == .a ? .b : .a) == round.question.wrong)
        }
    }
}

struct QuestionBankTests {
    @Test func everyCategoryHasQuestions() {
        for category in Category.allCases {
            #expect(QuestionBank.all.contains { $0.category == category }, "\(category) is empty")
        }
    }

    @Test func questionIDsAreUnique() {
        #expect(Set(QuestionBank.all.map(\.id)).count == QuestionBank.all.count)
    }

    @Test func answersAreDistinctAndNonEmpty() {
        for question in QuestionBank.all {
            #expect(!question.correct.isEmpty && !question.wrong.isEmpty && !question.fact.isEmpty)
            #expect(question.correct != question.wrong, "\(question.prompt)")
        }
    }
}

struct StorageTests {
    private func makeStorage() -> Storage {
        let suite = "StorageTests-\(UUID().uuidString)"
        return Storage(defaults: UserDefaults(suiteName: suite)!)
    }

    @Test func roundTripsPlayersAndSettings() {
        let storage = makeStorage()
        let players = makePlayers(3)
        var settings = GameSettings()
        settings.rounds = 5
        settings.categories = [.food]

        storage.players = players
        storage.settings = settings

        #expect(storage.players == players)
        #expect(storage.settings == settings)
    }

    @Test func resetsSeenQuestionsOnceThePoolIsExhausted() {
        let storage = makeStorage()
        let pool = QuestionBank.space
        storage.markSeen(pool.dropLast().map(\.id), pool: pool)
        #expect(storage.seenQuestionIDs.count == pool.count - 1)

        storage.markSeen([pool.last!.id], pool: pool)
        #expect(storage.seenQuestionIDs == [pool.last!.id])
    }
}
