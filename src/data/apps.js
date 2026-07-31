// Published apps, in the order they appear in the Work grid.
// Screenshots and logos live in /public/media.

export const apps = [
  {
    slug: "eonace",
    name: "Eonace",
    short: "Digital banking wallet — bills, airtime, transfers and virtual cards.",
    long: "A digital banking wallet for everyday money movement — bill payments, airtime and data top-ups, bank transfers and virtual cards in one account. Built cross-platform from a single Flutter codebase with secure authentication, full transaction history and receipts, and maintained through successive releases on both stores.",
    shot: "/media/app-eonace.webp",
    logo: "/media/logo-eonace.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.eonace", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/ng/app/eonace/id6451345648", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "bravoo",
    name: "Bravoo",
    short: "Learn-and-earn — short skill missions redeemed for airtime and gift cards.",
    long: "Learn-and-earn: short skill missions users complete for points redeemable as airtime, data and gift cards. A Flutter front end over a REST backend, with reward state, streaks and a redemption flow that has to stay correct under retries and flaky connections.",
    shot: "/media/app-bravoo.webp",
    logo: "/media/logo-bravoo.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.flowvahub.bravoo", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/us/app/bravoo/id6756618013", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "misan",
    name: "Misan by Bamboo",
    short: "Cross-border remittance and virtual USD, GBP and EUR accounts across 15+ African countries.",
    long: "Cross-border remittance for the African diaspora — send money home, hold balances in USD, GBP and EUR, and pay out to bank accounts and mobile money across 15+ countries. Multi-currency state, KYC onboarding and live rate quoting on Clean Architecture with BLoC.",
    shot: "/media/app-misan.webp",
    logo: "/media/logo-misan.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.coins.bamboo", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/us/app/misan-by-bamboo-pay-send/id6478486033", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "misan-business",
    name: "Misan Business",
    short: "Business accounts on the Misan payments platform.",
    long: "The business side of the Misan platform: company accounts, team access and bulk payouts. Shares the core payments modules with the consumer app while separating role-based permissions and approval steps for organisation users.",
    shot: "/media/app-misan-business.webp",
    logo: "/media/logo-misan-business.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.coins.bamboo.business", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/us/app/misan-business/id6770908319", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "buzinesshours",
    name: "BuzinessHours",
    short: "Real-time messaging and push notifications on Socket.io and Firebase.",
    long: "Business presence and messaging — real-time chat over Socket.io, Firebase Cloud Messaging for push, and deep links that route straight into a conversation or a profile. Owned end-to-end for Android and iOS across multiple store releases.",
    shot: "/media/app-buzinesshours.webp",
    logo: "/media/logo-buzinesshours.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=app.buzinesshours.status", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/us/app/buzinesshours/id6535651003", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "stakecut",
    name: "Stakecut",
    short: "Licensed sports and gaming — live scores, predictions, community feeds.",
    long: "Licensed sports and gaming with live fixtures, odds and predictions. Real-time score and market updates over sockets, with close attention to rebuild cost and memory so the live views stay smooth on mid-range Android hardware.",
    shot: "/media/app-stakecut.webp",
    logo: "/media/logo-stakecut.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.tekhaven.stakecut", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/ng/app/stakecut/id6744726413", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "coinpadi",
    name: "CoinPadi",
    short: "Buy and sell BTC, ETH and USDT with P2P trading and bill payments.",
    long: "Buy, sell and swap BTC, ETH and USDT, with peer-to-peer trading, wallet funding and bill payments. Rate polling, order state and a P2P escrow flow, with secure authentication and device verification throughout.",
    shot: "/media/app-coinpadi.webp",
    logo: "/media/logo-coinpadi.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.smartrob.coinpadi", label: "Play", icon: "ph-google-play-logo" },
    ],
  },
  {
    slug: "niklaar",
    name: "Niklaar Deals",
    short: "Marketplace where small businesses list products and track orders.",
    long: "A marketplace where small businesses list products and buyers browse, order and track delivery. Catalogue, cart and order-status flows with image handling and pagination tuned for slow connections.",
    shot: "/media/app-niklaar.webp",
    logo: "/media/logo-niklaar.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.niklaar.deals", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/us/app/niklaar-deals/id6758781419", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "betalmighty",
    name: "BetAlmighty Premium",
    short: "Social sports prediction — peer-to-peer challenges, group contests, in-app wallet.",
    long: "Social sports prediction — peer-to-peer challenges, group contests, leaderboards and an in-app wallet for stakes and payouts. Real-time fixture data and settlement logic, delivered to the App Store.",
    shot: "/media/app-betalmighty.webp",
    logo: "/media/logo-betalmighty.webp",
    links: [
      { href: "https://apps.apple.com/ng/app/betalmighty-premium-bap/id6774570058", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "thressford",
    name: "Thressford Wallet",
    short: "Secure digital wallet and referral platform for student referrals and commission payouts.",
    long: "A secure digital wallet and referral platform that manages student referrals and referral rewards in one place. Individuals register, refer prospective students interested in studying abroad through Thessford Global, and track each referral through to enrolment — at which point commissions are received and managed directly in the wallet. Referral activity, referred students and earnings are all visible in one transparent view, with withdrawals handled inside the app.",
    shot: "/media/app-thressford.webp",
    logo: "/media/logo-thressford.webp",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.thressford.wallet", label: "Play", icon: "ph-google-play-logo" },
      { href: "https://apps.apple.com/us/app/thressford-wallet/id6760852651", label: "App Store", icon: "ph-app-store-logo" },
    ],
  },
  {
    slug: "thressford-admin",
    name: "Thressford Wallet Admin",
    short: "Operator console for the Thressford Wallet referral platform.",
    long: "The operator console for Thressford Wallet — user and transaction oversight, verification queues and administrative actions, with role-based access separating operator capability from customer-facing features.",
    shot: "/media/app-thressford-admin.webp",
    logo: "/media/logo-thressford-admin.webp",
    links: [
    ],
  },
];
