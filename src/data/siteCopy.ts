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
    kicker: 'Who we are',
    heading: 'About us',
    lead: 'We are Masta Dan, a seven-person creative team from Hong Kong.',
    body:
      'We bring original characters and stories to life through illustration, design and a healthy amount of playful chaos. This is temporary English copy while our final story is being prepared.',
    traditionalChinese: '[TC copy pending]',
    linkLabel: 'Meet the whole team',
  },
  members: {
    kicker: 'The people behind the pixels',
    heading: 'Members',
    allMembersLabel: 'All seven members',
  },
  catalogue: {
    kicker: 'Future shop',
    heading: 'Catalogue preview',
    body:
      'This section reserves the product-card rhythm for the Shopify phase. Products, prices and checkout are intentionally not live yet.',
  },
  contact: {
    kicker: 'Say hello',
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
