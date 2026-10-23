import SwiftUI

/// Phase 2: pass the phone around and have everyone lock in a side.
struct VoteView: View {
    let session: GameSession

    var body: some View {
        if let round = session.currentRound {
            VStack(spacing: 16) {
                ScrollView {
                    VStack(spacing: 18) {
                        QuestionCard(question: round.question, compact: true)

                        HStack(alignment: .top, spacing: 12) {
                            ForEach(Side.allCases, id: \.self) { side in
                                VStack(spacing: 10) {
                                    AnswerTile(side: side, text: round.answer(for: side))
                                    AvatarStack(players: session.voters(for: side), size: 26)
                                        .frame(height: 26)
                                }
                            }
                        }

                        VStack(spacing: 4) {
                            Text("Pick a side!")
                                .font(.display(24))
                                .foregroundStyle(.white)
                            Text(session.players.count > 1
                                 ? "Pass the phone around. Everyone locks in an answer."
                                 : "Lock in your answer.")
                                .font(.rounded(15, weight: .medium))
                                .foregroundStyle(.white.opacity(0.7))
                                .multilineTextAlignment(.center)
                        }

                        VStack(spacing: 10) {
                            ForEach(session.players) { player in
                                VoteRow(
                                    player: player,
                                    selection: session.votes[player.id],
                                    onVote: { side in
                                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                            session.vote(side, for: player)
                                        }
                                    }
                                )
                            }
                        }
                    }
                    .padding(.bottom, 12)
                }
                .scrollBounceBehavior(.basedOnSize)

                Button("Reveal the Answer") {
                    session.reveal()
                }
                .buttonStyle(PrimaryButtonStyle())
                .disabled(!session.allVotesIn)
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 8)
            .sensoryFeedback(.selection, trigger: session.votes)
        }
    }
}

private struct VoteRow: View {
    let player: Player
    let selection: Side?
    let onVote: (Side) -> Void

    var body: some View {
        HStack(spacing: 12) {
            PlayerAvatar(player: player, size: 38)
            Text(player.name)
                .font(.rounded(18, weight: .bold))
                .foregroundStyle(.white)
                .lineLimit(1)
            Spacer(minLength: 8)
            ForEach(Side.allCases, id: \.self) { side in
                let isSelected = selection == side
                let color = Theme.color(for: side)
                Button {
                    onVote(side)
                } label: {
                    Text(side.label)
                        .font(.display(20))
                        .foregroundStyle(isSelected ? .white : color)
                        .frame(width: 54, height: 46)
                        .background {
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .fill(isSelected ? color : color.opacity(0.12))
                        }
                        .overlay {
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .strokeBorder(color, lineWidth: 2)
                        }
                }
                .buttonStyle(BouncyButtonStyle())
                .accessibilityLabel("\(player.name) votes \(side.label)")
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(RoundedRectangle(cornerRadius: 16, style: .continuous).fill(Theme.surface))
    }
}
