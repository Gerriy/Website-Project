export const siteCopy = {
  metadata: {
    homeTitle: 'Masta Dan — Creative Team',
    homeDescription:
      'Masta Dan — a Hong Kong creative team making original characters, stories and joyful things.',
    aboutTitle: 'About us — Masta Dan',
    aboutDescription: 'Meet Masta Dan, a seven-person creative team from Hong Kong.',
  },
  brand: {
    english: 'Masta Dan',
    traditionalChinese: '[TC copy pending]',
  },
  navigation: {
    home: 'Home',
    about: 'About us',
    shopping: 'Shopping',
    contacts: 'Contacts',
    apps: 'Apps',
    comingSoon: 'Soon',
  },
  hero: {
    traditionalChinese: '[TC copy pending]',
    titleFirst: 'MASTA',
    titleSecond: 'DAN',
    note: 'Catching up (progress)…',
    since: 'Since 2025',
    image: 'assets/images/hero/home-hero.png',
    imageAlt: 'The Masta Dan character team',
  },
  homeAbout: {
    heading: 'About us',
    traditionalChinese: '「大家好！我地係今年2025正式成立嘅「大師團進度討伐組」，總共有5位繪師。上年大家亦參展過CP、RG等同人活動，我們取得了不少的成果和回憶！今年，我們決定拓展我們的創作範圍，推出更多新的同人本和商品。快啲嚟睇下我哋嘅IG，追蹤我哋最新嘅動向！我們將會不斷更新新的內容，包括創作過程、活動報告和限定商品的預告！我們衷心感謝大家的支持和鼓勵，讓我們能夠繼續創造更多-surprising作品！請繼續支持我們，讓我們一起創造更多美好的回憶！」',
  },
  members: {
    heading: 'Members',
  },
  catalogue: {
    kicker: 'Future shop',
    heading: 'Catalogue preview',
    body:
      'This section reserves the product-card rhythm for the Shopify phase. Products, prices and checkout are intentionally not live yet.',
  },
  contact: {
    heading: 'Contacts',
    body: 'Follow our progress, see new character work and find out what we are making next.',
    followLabel: 'Follow us',
    emailLabel: 'Email us',
    email: 'hello@example.com',
  },
  about: {
    eyebrow: 'Our small but mighty party',
    heading: 'About Masta Dan',
    intro: 'Seven makers. Many characters. One shared determination to turn delightful ideas into real things.',
    storyKicker: 'Our story',
    storyHeading: 'A creative group in progress',
    storyLead:
      'Masta Dan began in 2025 as a team of seven creators with different disciplines and one shared world of ideas.',
    storyBody: [
      'This space is ready for the group’s final bilingual introduction. It can hold the origin story, event experience, creative philosophy and a link to the team Instagram without changing the layout.',
      'As the project grows, this page will remain the human side of the site: who makes the work, why it exists and what everyone brings to the party.',
    ],
    traditionalChinese: '[TC copy pending]',
  },
  cta: {
    kicker: 'Still curious?',
    heading: 'Come catch up with us.',
    body: 'New work, event notes and shop updates will appear here as the project develops.',
    label: 'Find us online',
  },
  footer: {
    socialLabel: 'Our social media',
    contactLabel: 'Contact us',
    message: 'Thank you for watching',
    copyrightSuffix: 'Masta Dan. Work in progress, happily.',
  },
} as const;

export type SiteCopy = typeof siteCopy;
