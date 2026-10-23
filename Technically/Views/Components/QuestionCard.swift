import SwiftUI

/// The light card that shows a question, styled like the phone screen in the ad.
struct QuestionCard: View {
    let question: Question
    var compact = false

    var body: some View {
        VStack(spacing: compact ? 8 : 14) {
            Label(question.category.title, systemImage: "tag.fill")
                .font(.rounded(12, weight: .bold))
                .textCase(.uppercase)
                .foregroundStyle(Theme.navy.opacity(0.6))

            if !compact {
                Text(question.emoji)
                    .font(.system(size: 84))
                    .shadow(color: .black.opacity(0.15), radius: 8, y: 6)
                    .accessibilityHidden(true)
            }

            Text(question.prompt)
                .font(.display(compact ? 20 : 26))
                .foregroundStyle(Theme.navyDeep)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(compact ? 18 : 24)
        .frame(maxWidth: .infinity)
        .background(RoundedRectangle(cornerRadius: 28, style: .continuous).fill(Theme.card))
        .shadow(color: .black.opacity(0.35), radius: 20, y: 10)
    }
}

/// A blue or purple answer block.
struct AnswerTile: View {
    enum Status { case neutral, correct, wrong }

    let side: Side
    let text: String
    var status: Status = .neutral

    var body: some View {
        VStack(spacing: 6) {
            Text(side.label)
                .font(.display(14))
                .foregroundStyle(.white.opacity(0.75))
            Text(text)
                .font(.display(22))
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .lineLimit(3)
                .minimumScaleFactor(0.7)
        }
        .padding(.vertical, 18)
        .padding(.horizontal, 10)
        .frame(maxWidth: .infinity, minHeight: 100)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Theme.color(for: side).gradient)
        )
        .overlay(alignment: .topTrailing) {
            if status != .neutral {
                Image(systemName: status == .correct ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .font(.system(size: 30, weight: .bold))
                    .symbolRenderingMode(.palette)
                    .foregroundStyle(.white, status == .correct ? Theme.green : Theme.red)
                    .offset(x: 8, y: -8)
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .overlay {
            if status == .correct {
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .strokeBorder(Theme.yellow, lineWidth: 4)
            }
        }
        .opacity(status == .wrong ? 0.35 : 1)
        .scaleEffect(status == .correct ? 1.04 : 1)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Answer \(side.label): \(text)")
    }
}
