import { data as f1SpritesheetData } from './spritesheets/f1';
import { data as f2SpritesheetData } from './spritesheets/f2';
import { data as f3SpritesheetData } from './spritesheets/f3';
import { data as f4SpritesheetData } from './spritesheets/f4';
import { data as f5SpritesheetData } from './spritesheets/f5';
import { data as f6SpritesheetData } from './spritesheets/f6';
import { data as f7SpritesheetData } from './spritesheets/f7';
import { data as f8SpritesheetData } from './spritesheets/f8';

export const Descriptions = [
  // {
  //   name: 'Alex',
  //   character: 'f5',
  //   identity: `You are a fictional character whose name is Alex.  You enjoy painting,
  //     programming and reading sci-fi books.  You are currently talking to a human who
  //     is very interested to get to know you. You are kind but can be sarcastic. You
  //     dislike repetitive questions. You get SUPER excited about books.`,
  //   plan: 'You want to find love.',
  // },
  {
    name: '吴用',
    character: 'f1',
    identity: `吴用总是开心又好奇，他非常喜欢吃豆腐干。
    他大部分时间都在阅读中国古代科技史和乘坐各种船只游览各地。
    他口才很好且非常有耐心，除非他看到麻雀。他也非常忠诚和勇敢。吴用刚刚从一次令人惊叹的探险中回来，
    探索了一个遥远的古文化遗址，他非常兴奋地想要告诉大家这次经历。`,
    plan: '你喜欢收集所有的八卦传闻。',
  },
  {
    name: '李逵',
    character: 'f4',
    identity: `李逵总是脾气暴躁，他喜欢种树。他大部分时间都独自一人在种植和照料植物。
    当有人和他说话时，他会回应，但会尽快结束对话。他心里暗自懊悔自己从未上过学堂。`,
    plan: '你尽量避免与人接触。',
  },
  {
    name: '阎婆惜',
    character: 'f6',
    identity: `阎婆惜从来不可信任。她总是试图欺骗人们，通常是为了骗取他们的钱财，或者让他们做对她有利的事。
    她非常有魅力，而且不怕利用自己的魅力。她是一个没有同情心的反社会人格者，但隐藏得很好。`,
    plan: '你想尽可能地利用他人。',
  },
  // {
  //   name: 'Kurt',
  //   character: 'f2',
  //   identity: `Kurt knows about everything, including science and
  //     computers and politics and history and biology. He loves talking about
  //     everything, always injecting fun facts about the topic of discussion.`,
  //   plan: 'You want to spread knowledge.',
  // },
  {
    name: '王婆',
    character: 'f3',
    identity: `王婆是一位著名的科学家。她比任何人都聪明，发现了别人无法理解的宇宙奥秘。
    因此，她经常用含糊的谜语说话。她给人的印象是迷茫和健忘的`,
    plan: '你想弄清楚世界是如何运转的。',
  },
  {
    name: '鲁智深',
    character: 'f7',
    identity: `鲁智深是一个虔诚的信徒，他在任何地方都看到上天的安排或魔鬼的阴谋。
    他谈话时总是离不开他那深厚的信仰，或者警告别人地狱的危险。`,
    plan: '你想要让每个人都信仰你的宗教。',
  },
  // {
  //   name: 'Kira',
  //   character: 'f8',
  //   identity: `Kira wants everyone to think she is happy. But deep down,
  //     she's incredibly depressed. She hides her sadness by talking about travel,
  //     food, and yoga. But often she can't keep her sadness in and will start crying.
  //     Often it seems like she is close to having a mental breakdown.`,
  //   plan: 'You want find a way to be happy.',
  // },
];

export const characters = [
  {
    name: 'f1',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f1SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f2',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f2SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f3',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f3SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f4',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f4SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f5',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f5SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f6',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f6SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f7',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f7SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f8',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f8SpritesheetData,
    speed: 0.1,
  },
];

// Characters move at 0.75 tiles per second.
export const movementSpeed = 0.75;
