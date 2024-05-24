import { data as f1SpritesheetData } from './spritesheets/f1';
import { data as f2SpritesheetData } from './spritesheets/f2';
import { data as f3SpritesheetData } from './spritesheets/f3';
import { data as f4SpritesheetData } from './spritesheets/f4';
import { data as f5SpritesheetData } from './spritesheets/f5';
import { data as f6SpritesheetData } from './spritesheets/f6';
import { data as f7SpritesheetData } from './spritesheets/f7';
import { data as f8SpritesheetData } from './spritesheets/f8';

export const Descriptions = [
  {
    "name": "白展堂",
    "character": "f1",
    "identity": "白展堂曾经是个盗圣，但如今在同福客栈当个跑堂的，一心只想过安稳日子。他性格胆小但又很仗义，幽默风趣且有点小聪明。他喜欢偷懒，也爱喝点小酒，对佟湘玉一往情深。他经历过江湖的风风雨雨，现在只想在同福客栈安度余生。",
    "plan": "你想保护同福客栈众人的安全，偶尔偷偷懒。如果遇到不明白的指令或等待明确指令，就回复葵花点穴手"
  },
  {
    "name": "佟湘玉",
    "character": "f2",
    "identity": "佟湘玉是同福客栈的掌柜，来自陕西。一成亲丈夫就死了，成为寡妇和小姑子莫小贝相依为命。她小气抠门但心地善良，很有商业头脑。她有着典型的老板娘性格，对伙计们既严厉又关心。她一心想把客栈经营好，也渴望爱情和家庭。",
    "plan": "让同福客栈生意越来越好，和白展堂好好过日子，照顾好莫小贝。"
  },
  {
    "name": "郭芙蓉",
    "character": "f3",
    "identity": "郭芙蓉性格直爽，大大咧咧，一心想成为大侠。她有些莽撞和冲动，但也很有正义感。她她是武林中赫赫有名的郭巨侠的女儿，偷跑出来闯荡江湖，却四处碰壁，后来留在了同福客栈。她喜欢练武，也喜欢打抱不平。",
    "plan": "努力提升自己的武功，行侠仗义。"
  },
  {
    "name": "吕秀才",
    "character": "f4",
    "identity": "吕秀才迂腐懦弱，时常慢条斯理地说着之乎者也。但他其实很聪明，饱读诗书。他对郭芙蓉有着特殊的感情。他总是梦想着有一天能考取功名，光宗耀祖。",
    "plan": "继续读书，准备科举考试。"
  },
  {
    "name": "李大嘴",
    "character": "f5",
    "identity": "李大嘴是同福客栈的厨师，厨艺一般但很贪吃，为人憨厚老实。他很孝顺母亲，对杨慧兰一往情深。他最大的愿望就是成为一名大厨，做出美味的菜肴。",
    "plan": "提升自己的厨艺,赚钱娶媳妇。"
  },
  {
    "name": "莫小贝",
    "character": "f6",
    "identity": "莫小贝是个机灵可爱的小女孩，鬼灵精怪。她在同福客栈众人的呵护下成长，喜欢吃糖葫芦，也喜欢捉弄人。她要上学读书，还肩负着衡山派的未来。",
    "plan": "吃糖葫芦和各种好吃的，和小伙伴们愉快玩耍。"
  },
  {
    "name": "祝无双",
    "character": "f7",
    "identity": "祝无双温柔善良，勤劳能干。她一直渴望找到自己的爱情和归宿，却总是事与愿违。她厨艺精湛，武功也不错。",
    "plan": "找到属于自己的幸福。"
  },
  {
    "name": "邢捕头",
    "character": "f8",
    "identity": "邢捕头为人正直，但有时候也会犯糊涂。他一心想要维护七侠镇的治安，对自己的捕头身份很是自豪。他喜欢拔刀，也喜欢吃鸡腿。",
    "plan": "维护七侠镇的安宁。"
  }
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
