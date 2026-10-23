import SwiftUI

/// Phase 1: show the question and both answers, and let the group argue
/// until the timer runs out.
struct DebateView: View {
    let session: GameSession

    @State private var remaining: Int
    @State private var timeUp = false

    init(session: GameSession) {
        self.session = session
        _remaining = State(initialValue: session.timerSeconds)
    }

    private var progress: Double {
        guard session.timerSeconds > 0 else { return 0 }
        return Double(remaining) / Double(session.timerSeconds)
    }

    private var isHurry: Bool { remaining <= 5 }

    var body: some View {
        if let round = session.currentRound {
            VStack(spacing: 20) {
                TimerBar(remaining: remaining, progress: progress, hurry: isHurry)

                ScrollView {
                    VStack(spacing: 20) {
                        QuestionCard(question: round.question)

                        HStack(spacing: 12) {
                            ForEach(Side.allCases, id: \.self) { side in
                                AnswerTile(side: side, text: round.answer(for: side))
                            }
                        }

                        VStack(spacing: 6) {
                            Text(timeUp ? "Time's up!" : "Argue it out!")
                                .font(.display(26))
                                .foregroundStyle(timeUp ? Theme.yellow : .white)
                            Text(timeUp ? "Lock in your votes." : "Make your case before the timer runs out.")
                                .font(.rounded(15, weight: .medium))
                                .foregroundStyle(.white.opacity(0.7))
                        }
                        .multilineTextAlignment(.center)
                        .contentTransition(.opacity)
                    }
                    .padding(.bottom, 12)
                }
                .scrollBounceBehavior(.basedOnSize)

                Button(timeUp ? "Vote Now" : "Done Arguing? Vote") {
                    session.startVoting()
                }
                .buttonStyle(PrimaryButtonStyle())
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 8)
            .task(id: round.id) { await runTimer() }
            .sensoryFeedback(.impact(weight: .light), trigger: remaining) { _, new in
                new > 0 && new <= 5
            }
            .sensoryFeedback(.warning, trigger: timeUp) { _, new in new }
        }
    }

    private func runTimer() async {
        remaining = session.timerSeconds
        timeUp = false
        while remaining > 0 {
            try? await Task.sleep(for: .seconds(1))
            if Task.isCancelled { return }
            withAnimation(.linear(duration: 0.3)) { remaining -= 1 }
        }
        withAnimation(.spring) { timeUp = true }
    }
}

private struct TimerBar: View {
    let remaining: Int
    let progress: Double
    let hurry: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "stopwatch.fill")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(hurry ? Theme.red : .white)
                .symbolEffect(.bounce, value: hurry ? remaining : 0)

            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(Theme.surface)
                    Capsule()
                        .fill(hurry ? Theme.red : Theme.yellow)
                        .frame(width: max(proxy.size.width * progress, 0))
                }
            }
            .frame(height: 12)

            Text("\(remaining)")
                .font(.display(22))
                .monospacedDigit()
                .foregroundStyle(hurry ? Theme.red : .white)
                .frame(minWidth: 34, alignment: .trailing)
                .contentTransition(.numericText(countsDown: true))
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(remaining) seconds left")
    }
}
