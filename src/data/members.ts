export interface Member {
  id: string;
  name: string;
  traditionalChineseTitle: string;
  role: string;
  image: string;
  instagramUrl?: string;
}

/**
 * Member source of truth. Keep all seven entries unless the final team roster changes.
 * Add images under public/assets/images/members/ using the filenames below.
 */
export const members: Member[] = [
  {
    id: 'chowee',
    name: 'Chowee',
    traditionalChineseTitle: '[TC copy pending]',
    role: 'UI/UX Designer & Production Team',
    image: 'assets/images/members/chowee.png',
  },
  {
    id: 'yy',
    name: 'YY',
    traditionalChineseTitle: '[TC copy pending]',
    role: 'UI/UX Designer & Production Team',
    image: 'assets/images/members/yy.png',
  },
  {
    id: 'p-chan',
    name: 'P-Chan',
    traditionalChineseTitle: '[TC copy pending]',
    role: 'UI/UX Designer & Production Team',
    image: 'assets/images/members/p-chan.png',
  },
  {
    id: 'gerri',
    name: 'Gerri',
    traditionalChineseTitle: '[TC copy pending]',
    role: 'UI/UX Designer & Production Team',
    image: 'assets/images/members/gerri.png',
  },
  {
    id: 'ahua',
    name: 'Ahua',
    traditionalChineseTitle: '[TC copy pending]',
    role: 'UI/UX Designer & Production Team',
    image: 'assets/images/members/ahua.png',
  },
  {
    id: 'popo',
    name: 'Popo',
    traditionalChineseTitle: '[TC copy pending]',
    role: 'UI/UX Designer & Production Team',
    image: 'assets/images/members/popo.png',
  },
  {
    id: 'ethan-yes',
    name: 'Ethan-Yes',
    traditionalChineseTitle: '[TC copy pending]',
    role: 'UI/UX Designer & Production Team',
    image: 'assets/images/members/ethan-yes.png',
  },
];
