export type Level = "Age 8" | "Age 12" | "College" | "Expert";

export interface QuizQuestion {
  question:    string;
  options:     string[];
  correct:     number;   // 0-indexed
  explanation: string;
}

export interface DecodeResult {
  id:           string;
  title:        string;
  pages:        number;
  wordCount:    number;
  summary:      string;
  explanations: Partial<Record<Level, string>>;
  takeaways:    string[];
  whyItMatters: string;
  quiz:         QuizQuestion[];
  createdAt:    string;
}

export type ProcessingStatus =
  | "idle"
  | "reading"
  | "extracting"
  | "simplifying"
  | "audio"
  | "quiz"
  | "done"
  | "error";

export interface ProcessingStep {
  id:        ProcessingStatus;
  icon:      string;
  label:     string;
  threshold: number;   // progress % to activate
}

export const PROCESSING_STEPS: ProcessingStep[] = [
  { id: "reading",     icon: "🧠", label: "Reading your document",    threshold: 0  },
  { id: "extracting",  icon: "🔍", label: "Identifying key concepts", threshold: 25 },
  { id: "simplifying", icon: "✨", label: "Simplifying the content",  threshold: 50 },
  { id: "audio",       icon: "🎧", label: "Creating audio summary",   threshold: 72 },
  { id: "quiz",        icon: "🎯", label: "Building your quiz",       threshold: 88 },
];

export const LEVELS: { id: Level; emoji: string; short: string }[] = [
  { id: "Age 8",   emoji: "🧒", short: "8"       },
  { id: "Age 12",  emoji: "🧑", short: "12"      },
  { id: "College", emoji: "🎓", short: "College" },
  { id: "Expert",  emoji: "👨‍🔬", short: "Expert" },
];

export const EXAMPLE_DOCS = [
  { emoji: "₿",  label: "Bitcoin Whitepaper",  tag: "crypto"  },
  { emoji: "🔬", label: "Research Paper",       tag: "science" },
  { emoji: "⚖️", label: "Legal Contract",       tag: "legal"   },
  { emoji: "📚", label: "School Notes",         tag: "study"   },
  { emoji: "📜", label: "Ethereum Yellowpaper", tag: "crypto"  },
  { emoji: "🧬", label: "Medical Study",        tag: "science" },
];

export const DEMO_DATA: DecodeResult = {
  id:        "demo-bitcoin",
  title:     "Bitcoin: A Peer-to-Peer Electronic Cash System",
  pages:     9,
  wordCount: 3200,
  summary:
    "Bitcoin is a digital currency that lets people send money directly to each other over the internet without needing a bank. It uses cryptography and a public ledger called the blockchain to verify and record all transactions.",
  explanations: {
    "Age 8":
      "Imagine you have magic internet coins! Bitcoin is like digital money you can send to your friend anywhere in the world — but instead of a bank keeping score, thousands of computers all over the world do it together. Nobody is in charge of it. It's like a big community notebook that everyone can read, but nobody can cheat by erasing their name. The notebook is called the blockchain, and every single trade ever made is written in it forever!",
    "Age 12":
      "Bitcoin is digital money that doesn't need banks. When you send Bitcoin to someone, thousands of computers around the world instantly verify that you actually own it and haven't already spent it — then they add that transaction to a shared, permanent list called the blockchain. This makes it really hard to cheat or fake transactions. No single company or government controls Bitcoin. Instead, the whole system runs on math, cryptography, and computers owned by regular people around the world.",
    College:
      "Bitcoin is a decentralized cryptocurrency that utilizes a distributed ledger — the blockchain — for peer-to-peer value transfer. The protocol employs SHA-256 cryptographic hashing and a proof-of-work consensus mechanism to achieve Byzantine fault tolerance without a trusted third party. Network participants called miners validate transaction batches into blocks by solving computationally intensive hash puzzles, receiving block subsidies and transaction fees as economic incentive. The difficulty adjusts every 2,016 blocks to target 10-minute block intervals.",
    Expert:
      "Nakamoto's protocol implements a UTXO-based accounting model secured via SHA-256 proof-of-work consensus. The chain selects the branch with the greatest cumulative work, providing probabilistic finality. Elliptic curve digital signatures (secp256k1) authenticate spending conditions encoded in Script. The difficulty retarget algorithm adjusts every 2,016 blocks proportionally to observed hash rate deviation from the 600-second target. A deterministic emission schedule — halving every 210,000 blocks — creates a hard supply ceiling of 20,999,999.9769 BTC.",
  },
  takeaways: [
    "Bitcoin is peer-to-peer digital cash — it lets you send value directly to anyone on Earth without a bank acting as the middle man.",
    "Every transaction is permanently recorded on the blockchain, a public ledger distributed across thousands of computers that nobody can secretly edit.",
    "Miners use computing power to verify transactions and compete for a Bitcoin reward — this is what keeps the network secure.",
    "Only 21 million Bitcoin will ever exist. New coins are created on a fixed schedule that halves roughly every four years.",
    "The system is cryptographically designed so that attacking it would require controlling more than half of all global mining power — prohibitively expensive.",
  ],
  whyItMatters:
    "Bitcoin didn't just create a new currency — it proved that strangers on the internet can exchange value without trusting each other or any institution. That idea launched a $2 trillion industry and sparked experiments in decentralised finance, digital ownership, and programmable money that are still unfolding today.",
  quiz: [
    {
      question:    "What problem was Bitcoin primarily designed to solve?",
      options:     ["Slow internet speeds", "Sending money without a trusted third party", "Replacing physical gold", "Creating anonymous online identities"],
      correct:     1,
      explanation: "Satoshi Nakamoto's white paper opens with the goal of enabling peer-to-peer electronic cash transfers without relying on financial institutions.",
    },
    {
      question:    "What is the blockchain?",
      options:     ["A type of cryptocurrency wallet", "Bitcoin's headquarters", "A public ledger of all transactions", "An encryption algorithm"],
      correct:     2,
      explanation: "The blockchain is a continuously growing chain of blocks, each containing a batch of verified transactions, shared across thousands of computers.",
    },
    {
      question:    "What do Bitcoin miners actually do?",
      options:     ["Store user passwords", "Print new Bitcoin notes", "Verify transactions and add them to the blockchain", "Manage exchange rates"],
      correct:     2,
      explanation: "Miners compete to solve a computational puzzle. The winner adds the next block of transactions and earns newly created Bitcoin as a reward.",
    },
    {
      question:    "What is Bitcoin's maximum supply?",
      options:     ["100 million", "21 million", "1 billion", "Unlimited"],
      correct:     1,
      explanation: "Bitcoin's protocol hard-caps the supply at ~21 million coins, enforced through a halving schedule that cuts the block reward roughly every four years.",
    },
    {
      question:    "How does Bitcoin prevent someone from spending the same coin twice?",
      options:     ["A central bank checks each transaction", "Users sign a legal contract", "The distributed network rejects duplicate spends via consensus", "Coins have unique serial numbers"],
      correct:     2,
      explanation: "The peer-to-peer network timestamps transactions and rejects any attempt to spend a coin that has already been recorded as spent in the blockchain.",
    },
    {
      question:    "What consensus mechanism does Bitcoin use?",
      options:     ["Proof of Stake", "Delegated voting", "Proof of Work", "Trusted authority"],
      correct:     2,
      explanation: "Proof of Work requires miners to expend real computational energy, making it prohibitively expensive to rewrite the transaction history.",
    },
    {
      question:    "Approximately how often are new Bitcoin blocks added?",
      options:     ["Every second", "Every minute", "Every 10 minutes", "Every hour"],
      correct:     2,
      explanation: "The difficulty adjusts automatically so that, on average, a new block is found and added to the chain roughly every 10 minutes.",
    },
    {
      question:    "What happens to the block reward over time?",
      options:     ["It grows as more miners join", "It stays constant forever", "It halves roughly every four years", "It is decided by a vote"],
      correct:     2,
      explanation: "Bitcoin 'halvings' cut the reward in half every 210,000 blocks (~4 years), slowing the creation of new coins until the cap is reached.",
    },
    {
      question:    "Who controls the Bitcoin network?",
      options:     ["Satoshi Nakamoto", "The US Federal Reserve", "A consortium of banks", "No single entity — it's decentralised"],
      correct:     3,
      explanation: "Bitcoin has no CEO or headquarters. Control is distributed across thousands of miners, node operators, and developers worldwide.",
    },
    {
      question:    "What cryptographic technique secures Bitcoin transactions?",
      options:     ["RSA encryption", "Elliptic curve digital signatures", "One-time passwords", "Quantum key distribution"],
      correct:     1,
      explanation: "Bitcoin uses elliptic curve digital signatures (on the secp256k1 curve) to prove that the sender owns the coins they're spending.",
    },
  ],
  createdAt: new Date().toISOString(),
};
