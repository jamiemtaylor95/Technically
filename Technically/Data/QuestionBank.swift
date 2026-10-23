import Foundation

enum QuestionBank {
    static let all: [Question] = animals + science + space + food + history + myths

    static let animals: [Question] = [
        Question(
            category: .animals, emoji: "🦀",
            prompt: "How many legs does a crab have?",
            correct: "10", wrong: "8",
            fact: "Crabs are decapods, which literally means \"ten feet.\" Their big front claws count as legs too."
        ),
        Question(
            category: .animals, emoji: "🐙",
            prompt: "How many hearts does an octopus have?",
            correct: "3", wrong: "1",
            fact: "Two hearts pump blood through the gills and a third pumps it to the rest of the body."
        ),
        Question(
            category: .animals, emoji: "🐨",
            prompt: "Is a koala a bear?",
            correct: "No", wrong: "Yes",
            fact: "Koalas are marsupials. Baby koalas, called joeys, grow up in their mother's pouch."
        ),
        Question(
            category: .animals, emoji: "🐻‍❄️",
            prompt: "What color is a polar bear's skin?",
            correct: "Black", wrong: "White",
            fact: "Under that fur is black skin. The fur itself is see-through and only looks white because it scatters light."
        ),
        Question(
            category: .animals, emoji: "🦇",
            prompt: "Are bats blind?",
            correct: "No", wrong: "Yes",
            fact: "Every bat species can see. Many use echolocation too, and some large fruit bats see better than we do in dim light."
        ),
        Question(
            category: .animals, emoji: "🐫",
            prompt: "What's stored in a camel's hump?",
            correct: "Fat", wrong: "Water",
            fact: "The hump is a fat reserve. It lets camels go a long time without food, and the hump droops when it runs low."
        ),
        Question(
            category: .animals, emoji: "🦈",
            prompt: "How many bones does a shark have?",
            correct: "Zero", wrong: "Hundreds",
            fact: "A shark's skeleton is made of cartilage, the same flexible stuff that's in your nose and ears."
        ),
        Question(
            category: .animals, emoji: "🐴",
            prompt: "Is a seahorse a fish?",
            correct: "Yes", wrong: "No",
            fact: "Seahorses are bony fish with gills and a swim bladder. Also, the males are the ones that get pregnant."
        ),
        Question(
            category: .animals, emoji: "🦓",
            prompt: "What color is a zebra's skin?",
            correct: "Black", wrong: "White",
            fact: "Zebras have dark skin under their coat, so they're best described as black with white stripes."
        ),
        Question(
            category: .animals, emoji: "🦆",
            prompt: "Does a duck's quack echo?",
            correct: "Yes", wrong: "No",
            fact: "It does. Researchers at the University of Salford tested it in 2003 and busted the myth."
        ),
        Question(
            category: .animals, emoji: "🦘",
            prompt: "Can any mammal lay eggs?",
            correct: "Yes", wrong: "No",
            fact: "Platypuses and echidnas, known as monotremes, are mammals that lay eggs."
        ),
        Question(
            category: .animals, emoji: "💩",
            prompt: "What shape is wombat poop?",
            correct: "Cube", wrong: "Round",
            fact: "Wombats produce cube-shaped droppings, which they use to mark their territory without them rolling away."
        ),
        Question(
            category: .animals, emoji: "🪼",
            prompt: "Is a jellyfish a fish?",
            correct: "No", wrong: "Yes",
            fact: "Jellyfish have no bones, brain, or heart. They're related to corals and sea anemones."
        ),
        Question(
            category: .animals, emoji: "🦎",
            prompt: "Why do chameleons mostly change color?",
            correct: "Mood & temperature", wrong: "Camouflage",
            fact: "Color shifts are mostly for signaling to other chameleons and controlling body temperature."
        ),
        Question(
            category: .animals, emoji: "🐂",
            prompt: "Does the color red make bulls angry?",
            correct: "No", wrong: "Yes",
            fact: "Bulls can't tell red from green. It's the cape's movement that makes them charge."
        ),
        Question(
            category: .animals, emoji: "🐕",
            prompt: "Do dogs only see in black and white?",
            correct: "No", wrong: "Yes",
            fact: "Dogs see color, mostly blues and yellows. Reds and greens just look muted to them."
        ),
    ]

    static let science: [Question] = [
        Question(
            category: .science, emoji: "👶",
            prompt: "Who has more bones: a baby or an adult?",
            correct: "A baby", wrong: "An adult",
            fact: "Babies are born with around 300 bones. Many fuse together as they grow, leaving adults with 206."
        ),
        Question(
            category: .science, emoji: "🪟",
            prompt: "Is glass a slow-moving liquid?",
            correct: "No", wrong: "Yes",
            fact: "Glass is an amorphous solid. Old windows are thicker at the bottom because of how they were made, not because they dripped."
        ),
        Question(
            category: .science, emoji: "⚡️",
            prompt: "Can lightning strike the same place twice?",
            correct: "Yes", wrong: "No",
            fact: "The Empire State Building is struck about 20 to 25 times a year."
        ),
        Question(
            category: .science, emoji: "👃",
            prompt: "Do humans have only five senses?",
            correct: "No, more", wrong: "Yes, five",
            fact: "Balance, temperature, pain, and knowing where your limbs are without looking are all senses too."
        ),
        Question(
            category: .science, emoji: "🧠",
            prompt: "How much of your brain do you use?",
            correct: "Virtually all", wrong: "About 10%",
            fact: "Brain scans show activity all over the brain, even during sleep. The 10% myth has no scientific basis."
        ),
        Question(
            category: .science, emoji: "🌊",
            prompt: "What makes more of Earth's oxygen?",
            correct: "Ocean plankton", wrong: "Rainforests",
            fact: "Tiny ocean organisms like phytoplankton produce roughly half of the oxygen on Earth."
        ),
        Question(
            category: .science, emoji: "🚽",
            prompt: "Does the hemisphere you're in change which way your toilet flushes?",
            correct: "No", wrong: "Yes",
            fact: "The Coriolis effect is far too weak at that size. The shape of the bowl decides the swirl."
        ),
        Question(
            category: .science, emoji: "💅",
            prompt: "Do your hair and nails keep growing after death?",
            correct: "No", wrong: "Yes",
            fact: "The skin dries out and pulls back, which makes hair and nails look longer than they are."
        ),
        Question(
            category: .science, emoji: "🌴",
            prompt: "What does a banana plant count as?",
            correct: "A giant herb", wrong: "A tree",
            fact: "Banana plants have no woody trunk. The \"trunk\" is tightly rolled leaves, which makes it the world's largest herb."
        ),
    ]

    static let space: [Question] = [
        Question(
            category: .space, emoji: "🪐",
            prompt: "Which planet is closest to Earth on average?",
            correct: "Mercury", wrong: "Venus",
            fact: "Venus gets closest at times, but it also swings far away. Averaged over time, Mercury is nearest. It's actually the closest planet to every planet."
        ),
        Question(
            category: .space, emoji: "🔥",
            prompt: "Which is the hottest planet?",
            correct: "Venus", wrong: "Mercury",
            fact: "Venus's thick carbon dioxide atmosphere traps heat, keeping it around 465°C (870°F), even though Mercury is closer to the Sun."
        ),
        Question(
            category: .space, emoji: "☀️",
            prompt: "What color is the Sun?",
            correct: "White", wrong: "Yellow",
            fact: "The Sun gives off all visible colors, so it's white. Our atmosphere scatters blue light, which makes it look yellow from the ground."
        ),
        Question(
            category: .space, emoji: "🌑",
            prompt: "Is the dark side of the Moon always dark?",
            correct: "No", wrong: "Yes",
            fact: "The far side gets just as much sunlight as the near side. We just never see it from Earth."
        ),
        Question(
            category: .space, emoji: "🧱",
            prompt: "Can you see the Great Wall of China from space with the naked eye?",
            correct: "No", wrong: "Yes",
            fact: "The wall is long but narrow and about the same color as the land around it. Astronauts say they can't pick it out without help."
        ),
        Question(
            category: .space, emoji: "⏳",
            prompt: "On Venus, which is longer: a day or a year?",
            correct: "A day", wrong: "A year",
            fact: "Venus takes about 243 Earth days to spin once but only about 225 to orbit the Sun."
        ),
        Question(
            category: .space, emoji: "🌌",
            prompt: "Is Pluto officially a planet?",
            correct: "No", wrong: "Yes",
            fact: "In 2006 the International Astronomical Union reclassified Pluto as a dwarf planet."
        ),
    ]

    static let food: [Question] = [
        Question(
            category: .food, emoji: "🍅",
            prompt: "Is a tomato a fruit or a vegetable?",
            correct: "Fruit", wrong: "Vegetable",
            fact: "Botanically it's a fruit. In 1893, though, the US Supreme Court ruled it a vegetable for tax purposes."
        ),
        Question(
            category: .food, emoji: "🥜",
            prompt: "Is a peanut a nut?",
            correct: "No", wrong: "Yes",
            fact: "Peanuts are legumes, like peas and beans, and they grow underground."
        ),
        Question(
            category: .food, emoji: "🍓",
            prompt: "Is a strawberry a berry?",
            correct: "No", wrong: "Yes",
            fact: "Botanically, strawberries aren't berries. Each of those little \"seeds\" on the outside is actually a separate fruit."
        ),
        Question(
            category: .food, emoji: "🍌",
            prompt: "Is a banana a berry?",
            correct: "Yes", wrong: "No",
            fact: "Bananas form from a single flower with one ovary, which makes them berries in botanical terms."
        ),
        Question(
            category: .food, emoji: "🥑",
            prompt: "Is an avocado a berry?",
            correct: "Yes", wrong: "No",
            fact: "Botanists classify the avocado as a large berry with a single seed."
        ),
        Question(
            category: .food, emoji: "🥥",
            prompt: "Is a coconut a nut?",
            correct: "No, a drupe", wrong: "Yes, a nut",
            fact: "Coconuts are drupes, the same type of fruit as peaches and olives: a hard pit inside an outer layer."
        ),
        Question(
            category: .food, emoji: "🍣",
            prompt: "What does \"sushi\" actually refer to?",
            correct: "Vinegared rice", wrong: "Raw fish",
            fact: "Sushi is all about the seasoned rice. Sliced raw fish served on its own is called sashimi."
        ),
        Question(
            category: .food, emoji: "🍍",
            prompt: "Is a pineapple one fruit or many?",
            correct: "Many", wrong: "One",
            fact: "A pineapple forms when dozens of individual flowers fuse their fruits together."
        ),
        Question(
            category: .food, emoji: "🌰",
            prompt: "Where does a cashew grow?",
            correct: "Under a fruit", wrong: "In a pod",
            fact: "Each cashew hangs from the bottom of a fleshy \"cashew apple.\" Its shell contains an irritating oil, so they're never sold raw in the shell."
        ),
        Question(
            category: .food, emoji: "🥠",
            prompt: "Where did fortune cookies most likely originate?",
            correct: "Japan", wrong: "China",
            fact: "They likely trace back to Japanese crackers and were popularized in California. They're rare in China."
        ),
    ]

    static let history: [Question] = [
        Question(
            category: .history, emoji: "⚔️",
            prompt: "How long did the Hundred Years' War last?",
            correct: "116 years", wrong: "100 years",
            fact: "It ran from 1337 to 1453, with long breaks in the fighting along the way."
        ),
        Question(
            category: .history, emoji: "🎓",
            prompt: "Which is older: Oxford University or the Aztec city of Tenochtitlan?",
            correct: "Oxford", wrong: "Tenochtitlan",
            fact: "Teaching at Oxford dates back to at least 1096. Tenochtitlan was founded around 1325."
        ),
        Question(
            category: .history, emoji: "🐍",
            prompt: "Did Cleopatra live closer in time to the Moon landing or to the building of the Great Pyramid?",
            correct: "The Moon landing", wrong: "The Great Pyramid",
            fact: "The Great Pyramid was built around 2560 BC. Cleopatra died in 30 BC, about 2,000 years before the 1969 Moon landing."
        ),
        Question(
            category: .history, emoji: "🇫🇷",
            prompt: "Was Napoleon unusually short?",
            correct: "No", wrong: "Yes",
            fact: "He was about 5'7\", average for his time. French inches were longer than English ones, which caused the confusion."
        ),
        Question(
            category: .history, emoji: "🪖",
            prompt: "Did Vikings wear horned helmets?",
            correct: "No", wrong: "Yes",
            fact: "There's no evidence of it. The look was popularized by costumes for a Wagner opera in 1876."
        ),
        Question(
            category: .history, emoji: "🧮",
            prompt: "Did Einstein fail math in school?",
            correct: "No", wrong: "Yes",
            fact: "He excelled at it and had mastered calculus by about age 15."
        ),
        Question(
            category: .history, emoji: "🖼️",
            prompt: "What is the Mona Lisa painted on?",
            correct: "Wood", wrong: "Canvas",
            fact: "Leonardo painted it on a panel of poplar wood."
        ),
        Question(
            category: .history, emoji: "🕰️",
            prompt: "Which country has the most time zones?",
            correct: "France", wrong: "Russia",
            fact: "Thanks to its overseas territories, France spans 12 time zones. Russia has 11."
        ),
    ]

    static let myths: [Question] = [
        Question(
            category: .myths, emoji: "🐠",
            prompt: "Does a goldfish have a 3-second memory?",
            correct: "No", wrong: "Yes",
            fact: "Goldfish can remember things for months and can even be trained to respond to sounds."
        ),
        Question(
            category: .myths, emoji: "🪶",
            prompt: "Do ostriches bury their heads in the sand?",
            correct: "No", wrong: "Yes",
            fact: "They lower their heads to turn their eggs in their nests, which are holes in the ground. From far away it looks like they're buried."
        ),
        Question(
            category: .myths, emoji: "🧟",
            prompt: "Is Frankenstein the name of the monster?",
            correct: "No", wrong: "Yes",
            fact: "Victor Frankenstein is the scientist. In Mary Shelley's novel, the creature never gets a name."
        ),
        Question(
            category: .myths, emoji: "🔍",
            prompt: "Does Sherlock Holmes say \"Elementary, my dear Watson\" in the original stories?",
            correct: "No", wrong: "Yes",
            fact: "Arthur Conan Doyle never wrote that exact line. It became famous through later films."
        ),
        Question(
            category: .myths, emoji: "🍰",
            prompt: "Did Marie Antoinette say \"Let them eat cake\"?",
            correct: "No", wrong: "Yes",
            fact: "There's no record of her saying it. A similar line appears in a Rousseau book written when she was a child."
        ),
        Question(
            category: .myths, emoji: "🌍",
            prompt: "Which is bigger: Greenland or Africa?",
            correct: "Africa", wrong: "Greenland",
            fact: "Africa is about 14 times larger. Common map projections stretch land near the poles."
        ),
        Question(
            category: .myths, emoji: "🏔️",
            prompt: "Which mountain is tallest measured from base to peak?",
            correct: "Mauna Kea", wrong: "Mount Everest",
            fact: "Mauna Kea rises about 10,200 m from its base on the ocean floor. Everest has the highest peak above sea level."
        ),
        Question(
            category: .myths, emoji: "🧊",
            prompt: "What's the largest desert on Earth?",
            correct: "Antarctica", wrong: "The Sahara",
            fact: "A desert is defined by low rainfall, not heat. Antarctica gets so little that it's the largest desert in the world."
        ),
        Question(
            category: .myths, emoji: "🦄",
            prompt: "What is Scotland's national animal?",
            correct: "The unicorn", wrong: "The lion",
            fact: "The unicorn has been a Scottish symbol since the 1300s and appears on the royal coat of arms."
        ),
    ]
}
