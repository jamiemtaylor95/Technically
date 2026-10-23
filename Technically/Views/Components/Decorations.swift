import SwiftUI

/// The tilted "Technically!" wordmark with a yellow brush stroke behind it.
struct TitleLogo: View {
    var size: CGFloat = 64

    var body: some View {
        Text("Technically!")
            .font(.display(size))
            .foregroundStyle(.white)
            .lineLimit(1)
            .minimumScaleFactor(0.5)
            .shadow(color: Theme.navyDeep, radius: 0, x: 3, y: 4)
            .background(alignment: .bottom) {
                BrushStroke()
                    .fill(Theme.yellow)
                    .frame(height: size * 0.3)
                    .padding(.horizontal, -size * 0.12)
                    .offset(y: size * 0.02)
            }
            .rotationEffect(.degrees(-4))
            .accessibilityAddTraits(.isHeader)
    }
}

/// A rough, hand-drawn looking highlighter swipe.
struct BrushStroke: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY + h * 0.55))
        path.addCurve(
            to: CGPoint(x: rect.maxX, y: rect.minY + h * 0.05),
            control1: CGPoint(x: rect.minX + w * 0.3, y: rect.minY + h * 0.15),
            control2: CGPoint(x: rect.minX + w * 0.7, y: rect.minY + h * 0.2)
        )
        path.addLine(to: CGPoint(x: rect.maxX - w * 0.015, y: rect.minY + h * 0.6))
        path.addCurve(
            to: CGPoint(x: rect.minX + w * 0.02, y: rect.maxY),
            control1: CGPoint(x: rect.minX + w * 0.7, y: rect.minY + h * 0.7),
            control2: CGPoint(x: rect.minX + w * 0.3, y: rect.minY + h * 0.75)
        )
        path.closeSubpath()
        return path
    }
}

/// A wobbly underline like the ones under the ad's taglines.
struct Squiggle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addQuadCurve(
            to: CGPoint(x: rect.maxX, y: rect.minY),
            control: CGPoint(x: rect.midX, y: rect.maxY + rect.height * 0.4)
        )
        return path
    }
}

/// A little burst of "excited" lines.
struct SparkBurst: View {
    var color: Color = Theme.yellow
    var count = 3
    var spread: Double = 70
    var length: CGFloat = 16

    var body: some View {
        ZStack {
            ForEach(0..<count, id: \.self) { index in
                Capsule()
                    .fill(color)
                    .frame(width: 4, height: length)
                    .offset(y: -length * 1.1)
                    .rotationEffect(.degrees(angle(for: index)))
            }
        }
        .frame(width: length * 3, height: length * 3)
        .accessibilityHidden(true)
    }

    private func angle(for index: Int) -> Double {
        guard count > 1 else { return 0 }
        return -spread / 2 + spread * Double(index) / Double(count - 1)
    }
}

/// Colored circle with a player's initial.
struct PlayerAvatar: View {
    let player: Player
    var size: CGFloat = 36

    var body: some View {
        Text(player.initial)
            .font(.display(size * 0.45))
            .foregroundStyle(Theme.navyDeep)
            .frame(width: size, height: size)
            .background(Circle().fill(Theme.playerColor(player.colorIndex)))
            .overlay(Circle().strokeBorder(.white.opacity(0.8), lineWidth: size > 30 ? 2 : 1.5))
            .accessibilityLabel(player.name)
    }
}

/// Avatars overlapped in a row.
struct AvatarStack: View {
    let players: [Player]
    var size: CGFloat = 28

    var body: some View {
        HStack(spacing: -size * 0.3) {
            ForEach(players) { PlayerAvatar(player: $0, size: size) }
        }
    }
}
