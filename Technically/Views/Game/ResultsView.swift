import SwiftUI

/// The final scoreboard.
struct ResultsView: View {
    let session: GameSession
    let onPlayAgain: () -> Void
    let onExit: () -> Void

    @State private var appeared = false

    private var title: String {
        let winners = session.winners
        if session.players.count == 1 {
            return "Final score"
        }
        if winners.count == 1 {
            return "\(winners[0].name) wins!"
        }
        return "It's a tie!"
    }

    private var subtitle: String {
        if session.players.count == 1 {
            let correct = session.standings.first?.correctCount ?? 0
            return "You got \(correct) of \(session.rounds.count) right."
        }
        return "Technically the smartest person in the room."
    }

    var body: some View {
        VStack(spacing: 20) {
            ScrollView {
                VStack(spacing: 22) {
                    ZStack {
                        SparkBurst(count: 5, spread: 140, length: 22)
                            .offset(y: -18)
                        Image(systemName: "trophy.fill")
                            .font(.system(size: 88))
                            .foregroundStyle(Theme.yellow.gradient)
                            .shadow(color: Theme.yellow.opacity(0.5), radius: 24)
                            .symbolEffect(.bounce, value: appeared)
                    }
                    .padding(.top, 32)
                    .scaleEffect(appeared ? 1 : 0.4)
                    .opacity(appeared ? 1 : 0)

                    VStack(spacing: 6) {
                        Text(title)
                            .font(.display(36))
                            .foregroundStyle(.white)
                            .multilineTextAlignment(.center)
                        Text(subtitle)
                            .font(.rounded(16, weight: .medium))
                            .foregroundStyle(.white.opacity(0.7))
                            .multilineTextAlignment(.center)
                    }

                    VStack(spacing: 10) {
                        ForEach(session.standings) { standing in
                            StandingRow(standing: standing, total: session.rounds.count)
                        }
                    }
                }
                .padding(.bottom, 12)
            }
            .scrollBounceBehavior(.basedOnSize)

            VStack(spacing: 12) {
                Button("Play Again", action: onPlayAgain)
                    .buttonStyle(PrimaryButtonStyle())
                Button("Back to Home", action: onExit)
                    .buttonStyle(SecondaryButtonStyle())
            }
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 8)
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.6).delay(0.15)) { appeared = true }
        }
        .sensoryFeedback(.success, trigger: appeared)
    }
}

private struct StandingRow: View {
    let standing: Standing
    let total: Int

    private var isLeader: Bool { standing.rank == 1 }

    var body: some View {
        HStack(spacing: 14) {
            Text("\(standing.rank)")
                .font(.display(20))
                .foregroundStyle(isLeader ? Theme.navyDeep : .white.opacity(0.7))
                .frame(width: 34, height: 34)
                .background(Circle().fill(isLeader ? Theme.yellow : Theme.surface))

            PlayerAvatar(player: standing.player, size: 40)

            VStack(alignment: .leading, spacing: 2) {
                Text(standing.player.name)
                    .font(.rounded(18, weight: .bold))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                Text("\(standing.correctCount)/\(total) correct")
                    .font(.rounded(13, weight: .medium))
                    .foregroundStyle(.white.opacity(0.6))
            }

            Spacer()

            Text("\(standing.score)")
                .font(.display(24))
                .foregroundStyle(isLeader ? Theme.yellow : .white)
                .monospacedDigit()
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(isLeader ? Theme.yellow.opacity(0.12) : Theme.surface)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .strokeBorder(isLeader ? Theme.yellow.opacity(0.6) : .clear, lineWidth: 1.5)
        )
        .accessibilityElement(children: .combine)
    }
}
