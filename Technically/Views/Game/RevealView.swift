import SwiftUI

/// Phase 3: show the real answer, the fun fact, and who got it right.
struct RevealView: View {
    let session: GameSession

    @State private var showAnswer = false

    var body: some View {
        if let round = session.currentRound, let outcome = session.lastOutcome {
            let winners = session.players.filter { outcome.winnerIDs.contains($0.id) }

            VStack(spacing: 16) {
                ScrollView {
                    VStack(spacing: 20) {
                        Text("Technically…")
                            .font(.display(40))
                            .foregroundStyle(.white)
                            .rotationEffect(.degrees(-3))
                            .padding(.top, 4)

                        QuestionCard(question: round.question, compact: true)

                        HStack(spacing: 12) {
                            ForEach(Side.allCases, id: \.self) { side in
                                AnswerTile(
                                    side: side,
                                    text: round.answer(for: side),
                                    status: showAnswer ? (side == outcome.correctSide ? .correct : .wrong) : .neutral
                                )
                            }
                        }

                        if showAnswer {
                            FactCard(fact: round.question.fact)
                                .transition(.move(edge: .bottom).combined(with: .opacity))

                            OutcomeBanner(session: session, outcome: outcome, winners: winners)
                                .transition(.move(edge: .bottom).combined(with: .opacity))
                        }
                    }
                    .padding(.bottom, 12)
                }
                .scrollBounceBehavior(.basedOnSize)

                Button(session.isLastRound ? "See Final Scores" : "Next Question") {
                    session.nextRound()
                }
                .buttonStyle(PrimaryButtonStyle())
                .opacity(showAnswer ? 1 : 0)
                .disabled(!showAnswer)
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 8)
            .task {
                // A short drumroll before the answer lands.
                try? await Task.sleep(for: .milliseconds(700))
                withAnimation(.spring(response: 0.5, dampingFraction: 0.65)) { showAnswer = true }
            }
            .sensoryFeedback(winners.isEmpty ? .error : .success, trigger: showAnswer) { _, new in new }
        }
    }
}

private struct FactCard: View {
    let fact: String

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            Image(systemName: "brain.head.profile")
                .font(.system(size: 26, weight: .bold))
                .foregroundStyle(Theme.pink)
                .frame(width: 48, height: 48)
                .background(Circle().fill(Theme.pink.opacity(0.15)))

            VStack(alignment: .leading, spacing: 4) {
                Text("Fun fact")
                    .font(.rounded(13, weight: .heavy))
                    .textCase(.uppercase)
                    .foregroundStyle(Theme.pink)
                Text(fact)
                    .font(.rounded(17, weight: .medium))
                    .foregroundStyle(.white)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 0)
        }
        .padding(16)
        .background(RoundedRectangle(cornerRadius: 20, style: .continuous).fill(Theme.surface))
        .overlay(RoundedRectangle(cornerRadius: 20, style: .continuous).strokeBorder(Theme.stroke))
        .accessibilityElement(children: .combine)
    }
}

private struct OutcomeBanner: View {
    let session: GameSession
    let outcome: RoundOutcome
    let winners: [Player]

    private var headline: String {
        if winners.isEmpty {
            return session.players.count > 1 ? "Nobody got it! Technically, you're all wrong." : "Not quite! Technically, that's wrong."
        }
        if winners.count == session.players.count {
            return session.players.count > 1 ? "Everyone got it. Suspicious." : "Nailed it!"
        }
        return winners.count == 1 ? "\(winners[0].name) was right!" : "\(winners.count) players were right!"
    }

    var body: some View {
        VStack(spacing: 12) {
            Text(headline)
                .font(.display(20))
                .foregroundStyle(winners.isEmpty ? Theme.red : Theme.yellow)
                .multilineTextAlignment(.center)

            if outcome.underdogBonus {
                Label("Underdog bonus! +\(GameSession.underdogPoints) for going against the crowd.", systemImage: "flame.fill")
                    .font(.rounded(14, weight: .bold))
                    .foregroundStyle(.orange)
                    .multilineTextAlignment(.center)
            }

            if !winners.isEmpty {
                FlowingChips(players: winners, points: outcome.points)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .background(RoundedRectangle(cornerRadius: 20, style: .continuous).fill(Theme.surface))
    }
}

private struct FlowingChips: View {
    let players: [Player]
    let points: [Player.ID: Int]

    var body: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 130), spacing: 8)], spacing: 8) {
            ForEach(players) { player in
                HStack(spacing: 8) {
                    PlayerAvatar(player: player, size: 26)
                    Text(player.name)
                        .font(.rounded(15, weight: .bold))
                        .foregroundStyle(.white)
                        .lineLimit(1)
                    Spacer(minLength: 0)
                    Text("+\(points[player.id, default: 0])")
                        .font(.display(15))
                        .foregroundStyle(Theme.green)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Capsule().fill(Theme.green.opacity(0.12)))
            }
        }
    }
}
