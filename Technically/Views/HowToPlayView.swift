import SwiftUI

struct HowToPlayView: View {
    @Environment(\.dismiss) private var dismiss

    private let steps: [(icon: String, color: Color, title: String, detail: String)] = [
        ("bubble.left.and.bubble.right.fill", Theme.yellow, "Debate your take",
         "Every question has two answers: the one everyone assumes and the one that's technically true. Argue about which is which."),
        ("stopwatch.fill", .white, "Beat the timer",
         "You only get so long to make your case. When time's up, or when you're done yelling, it's time to vote."),
        ("hand.tap.fill", Theme.blue, "Lock in your answer",
         "Pass the phone around. Everyone picks A or B."),
        ("trophy.fill", Theme.yellow, "See the real answer",
         "Right answers score \(GameSession.pointsForCorrect) points. Side with the minority and win, and you get a +\(GameSession.underdogPoints) underdog bonus."),
        ("brain.head.profile", Theme.pink, "Learn fun facts",
         "Every answer comes with the story behind it, so you can be insufferable at your next party."),
    ]

    var body: some View {
        ZStack {
            AppBackground()

            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    Text("How to Play")
                        .font(.display(34))
                        .foregroundStyle(.white)
                        .padding(.top, 28)

                    ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
                        HStack(alignment: .top, spacing: 16) {
                            Image(systemName: step.icon)
                                .font(.system(size: 22, weight: .bold))
                                .foregroundStyle(step.color)
                                .frame(width: 52, height: 52)
                                .background(Circle().fill(Theme.surface))
                                .overlay(Circle().strokeBorder(Theme.stroke, lineWidth: 1.5))

                            VStack(alignment: .leading, spacing: 4) {
                                Text("\(index + 1). \(step.title)")
                                    .font(.display(19))
                                    .foregroundStyle(.white)
                                Text(step.detail)
                                    .font(.rounded(15, weight: .medium))
                                    .foregroundStyle(.white.opacity(0.75))
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                    }

                    Button("Got It") { dismiss() }
                        .buttonStyle(PrimaryButtonStyle())
                        .padding(.top, 8)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
        }
        .presentationDragIndicator(.visible)
    }
}

#Preview {
    HowToPlayView()
}
