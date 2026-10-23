import SwiftUI

/// Hosts a whole game, from the first debate to the final scoreboard.
struct GameView: View {
    let makeRematch: () -> GameSession

    @State private var session: GameSession
    @State private var confirmingQuit = false
    @Environment(\.dismiss) private var dismiss

    init(session: GameSession, makeRematch: @escaping () -> GameSession) {
        _session = State(initialValue: session)
        self.makeRematch = makeRematch
    }

    var body: some View {
        ZStack {
            AppBackground()

            VStack(spacing: 0) {
                if session.phase != .finished {
                    topBar
                }

                Group {
                    switch session.phase {
                    case .debate:
                        DebateView(session: session)
                    case .vote:
                        VoteView(session: session)
                    case .reveal:
                        RevealView(session: session)
                    case .finished:
                        ResultsView(
                            session: session,
                            onPlayAgain: { withAnimation { session = makeRematch() } },
                            onExit: { dismiss() }
                        )
                    }
                }
                .id("\(session.id)-\(session.roundIndex)-\(String(describing: session.phase))")
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .move(edge: .leading).combined(with: .opacity)
                ))
            }
        }
        .animation(.spring(response: 0.45, dampingFraction: 0.85), value: session.phase)
        .animation(.spring(response: 0.45, dampingFraction: 0.85), value: session.roundIndex)
        .confirmationDialog("Quit this game?", isPresented: $confirmingQuit, titleVisibility: .visible) {
            Button("Quit Game", role: .destructive) { dismiss() }
            Button("Keep Playing", role: .cancel) {}
        } message: {
            Text("Scores for this game will be lost.")
        }
    }

    private var topBar: some View {
        HStack {
            Button {
                confirmingQuit = true
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 16, weight: .black))
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(Circle().fill(Theme.surface))
            }
            .buttonStyle(BouncyButtonStyle())
            .accessibilityLabel("Quit game")

            Spacer()

            Text("Question \(session.roundNumber) of \(session.rounds.count)")
                .font(.rounded(15, weight: .heavy))
                .foregroundStyle(.white.opacity(0.8))
                .contentTransition(.numericText())

            Spacer()

            Color.clear.frame(width: 40, height: 40)
        }
        .padding(.horizontal, 20)
        .padding(.top, 8)
    }
}
