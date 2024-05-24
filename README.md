# AI 小镇 🏠💻💌

[在线演示](https://www.convex.dev/ai-town)

[加入我们的社区Discord: AI Stack Devs](https://discord.gg/PQUmTBTGmT)

<img width="1454" alt="Screen Shot 2023-08-14 at 10 01 00 AM" src="https://github.com/a16z-infra/ai-town/assets/3489963/a4c91f17-23ed-47ec-8c4e-9f9a8505057d">

AI 小镇是一个虚拟的小镇,AI角色居住、聊天和社交的地方。

该项目是一个可部署的入门工具包,可以轻松构建和定制你自己版本的 AI 小镇。
灵感来自于研究论文[_Generative Agents: Interactive Simulacra of Human Behavior_](https://arxiv.org/pdf/2304.03442.pdf)。

该项目的主要目标除了工作本身会很有趣以外,
还为拥有扎实基础的平台提供了可扩展的空间。
后端原生支持共享全局状态、事务和模拟引擎,
从简单的游戏项目到可扩展的多人游戏都是合适的。
次要目标是提供一个 JS/TS 框架,因为这个领域中的大多数模拟器
(包括上面提到的原始论文)都是用 Python 编写的。

## 概览

- 💻 [技术栈](#技术栈)
- 🧠 [安装](#安装)
- 👤 [自定义 - 运行你自己的模拟世界](#自定义你自己的模拟)
- 👩‍💻 [部署](#部署该应用程序)
- 🏆 [致谢](#致谢)

## 技术栈

- 游戏引擎、数据库和向量搜索: [Convex](https://convex.dev/)
- 认证 (可选): [Clerk](https://clerk.com/)
- 默认的对话模型是 `llama3`，嵌入模型是 `mxbai-embed-large`。
- 本地推理: [Ollama](https://github.com/jmorganca/ollama)
- 可配置为其他云端 LLM: [Together.ai](https://together.ai/) 或任何支持 [OpenAI API](https://platform.openai.com/) 的服务。欢迎提交 PR 以添加更多云服务支持。
- 像素艺术生成: [Replicate](https://replicate.com/)、[Fal.ai](https://serverless.fal.ai/lora)
- 背景音乐生成: [Replicate](https://replicate.com/) 使用 [MusicGen](https://huggingface.co/spaces/facebook/MusicGen)

## 安装

**注意**: 这个项目的一个分支可在 [Pinokio](https://pinokio.computer/item?uri=https://github.com/cocktailpeanutlabs/aitown) 上一键安装,供有兴趣运行但不想修改的人使用 😎

### 1. 克隆仓库并安装软件包

```bash
git clone https://github.com/a16z-infra/ai-town.git
cd ai-town
npm install
```

### 2. 使用 [Convex](https://convex.dev) 进行本地开发:

要么 [下载预构建的二进制文件(推荐)](https://github.com/get-convex/convex-backend/releases)，
要么 [从源码构建并运行](https://stack.convex.dev/building-the-oss-backend)。

```sh
# 对于新的 Mac 机器:
curl  -L -O https://github.com/get-convex/convex-backend/releases/latest/download/convex-local-backend-aarch64-apple-darwin.zip
unzip convex-local-backend-aarch64-apple-darwin.zip

brew install just

# 运行服务器
./convex-local-backend
```

这也会 [安装 `just`](https://github.com/casey/just?tab=readme-ov-file#installation)
(例如 `brew install just` 或 `cargo install just`)。
我们使用 `just` 就像 `make` 一样添加额外的参数,所以你需要运行 `just convex ...`
而不是 `npx convex ...` 进行本地开发。

如果你在 Mac 上运行预构建的二进制文件时出现 Apple 警告,
进入它所在的文件夹,右键单击它并选择"打开"以绕过警告。
从那时起你就可以从命令行运行它了。
或者你也可以从源码编译并运行它(参见上文)。

如果你要针对云托管版本进行开发,请修改 package.json 脚本,
将 `just convex ...` 改为 `convex ...`。

### 3. 要运行本地 LLM,请下载并运行 [Ollama](https://ollama.com/)。

你可以让应用程序一直运行,或运行 `ollama serve`。
如果应用程序已经在运行,`ollama serve` 会发出警告。
运行 `ollama pull llama3` 让它下载 `llama3`。
使用 `ollama run llama3` 进行测试。
如果你想自定义使用哪个模型,请调整 convex/util/llm.ts 或设置
`just convex env set LLM_MODEL # model`。
Ollama 模型选项可在 [此处](https://ollama.ai/library) 找到。

如果你发现速度变慢,你可能需要在 constants.ts 中将 `NUM_MEMORIES_TO_SEARCH` 设置为 `1`,
以减小对话提示的大小。

查看 `convex/config.ts` 以配置要在 UI 中提供哪些模型,
或者设置与云托管的 LLM 对话。

### 4. 使用 Replicate 添加背景音乐 (可选)

为了每日生成背景音乐,请在
[Replicate](https://replicate.com/) 上创建一个账户,并在你的个人资料的
[API Token 页面](https://replicate.com/account/api-tokens)创建一个令牌。
`npx convex env set REPLICATE_API_TOKEN # token`
如果你在进行本地开发,请使用 `just` 而不是 `npx`。

### 5. 运行代码

要同时运行前端和后端:

```bash
npm run dev
```

**注意**: 如果在应用程序启动时 convex 服务器上出现节点版本错误,请使用版本 18,这是最稳定的版本。一种方式是 [安装 nvm](https://nodejs.org/en/download/package-manager) 并运行 `nvm install 18` 或 `nvm use 18`。
```
在执行上述的 `npm run dev` 和第 2 步中的 `./convex-local-backend` 之前都要这样做。

现在你可以访问 http://localhost:5173 了。

如果你希望前端和 Convex 分别在不同的终端中运行(后者会在保存后端函数时同步),你可以运行以下两个命令:

```bash
npm run dev:frontend
npm run dev:backend
```

详情请查看 package.json,但 dev:backend 运行的是 `just convex dev`

**注意**: 如果窗口闲置 5 分钟后,模拟将会暂停。
加载页面将会取消暂停。
你也可以使用 UI 中的按钮手动冻结和解冻世界。
如果你想在没有浏览器的情况下运行世界,你可以在 `convex/crons.ts` 中注释掉"停止非活动世界"的 cron 任务。

### 运行/测试/调试的各种命令

**停止后端,以防有太多活动**

这将停止运行引擎和代理。你仍然可以运行查询和函数进行调试。

```bash
just convex run testing:stop
```

**在停止后端后重新启动它**

```bash
just convex run testing:resume
```

**如果游戏引擎或代理程序没有运行,则启动引擎**

```bash
just convex run testing:kick
```

**存档世界**

如果你想重置世界并从头开始,你可以存档当前世界:

```bash
just convex run testing:archive
```

然后,你仍然可以在仪表板中查看世界的数据,但引擎和代理程序将不再运行。

你可以使用 `init` 创建一个全新的世界。

```bash
just convex run init
```

**清除所有数据库**

你可以使用 `wipeAllTables` 测试函数来清除所有表。

```bash
just convex run testing:wipeAllTables
```

**暂停你的后端部署**

你可以在 [仪表板](https://dashboard.convex.dev) 上访问你的部署设置,
暂停和取消暂停你的部署。这将停止所有从客户端、计划任务或 cron 作业调用的函数。
将其视为最后的手段,因为上面有更温和的停止方式。一旦你

## 自定义你自己的模拟

注意:每次你更改角色数据时,你都应该重新运行
`just convex run testing:wipeAllTables` 然后
`npm run dev` 将所有内容重新上传到 Convex。
这是因为角色数据在初始加载时会发送到 Convex。
但是要注意 `just convex run testing:wipeAllTables` 会删除你所有的数据。

1. 创建你自己的角色和故事: 所有角色和故事以及他们的精灵表引用都存储在 [characters.ts](./data/characters.ts) 中。你可以从更改角色描述开始。

2. 更新精灵表: 在 `data/characters.ts` 中,你会看到这样的代码:

```ts
export const characters = [
  {
    name: 'f1',
    textureUrl: '/assets/32x32folk.png',
    spritesheetData: f1SpritesheetData,
    speed: 0.1,
  },
  ...
];
```

你应该为你的角色找一个精灵表,并在对应的文件中定义精灵动作/资源(在上面的例子中,`f1SpritesheetData` 是在 f1.ts 中定义的)

3. 更新背景(环境): 地图在 `convex/init.ts` 中从 `data/gentle.js` 加载。要更新地图,请按照以下步骤操作:

   - 使用 [Tiled](https://www.mapeditor.org/) 将地形图导出为 JSON 文件(命名为 bgtiles 和 objmap 的两层)
   - 使用 `convertMap.js` 脚本将 JSON 转换为引擎可以使用的格式。

```console
node data/convertMap.js <mapDataPath> <assetPath> <tilesetpxw> <tilesetpxh>
```

- `<mapDataPath>`: Tiled JSON 文件的路径。
- `<assetPath>`: 地形图素材图像的路径。
- `<tilesetpxw>`: 地形图宽度(像素)。
- `<tilesetpxh>`: 地形图高度(像素)。
  生成 `converted-map.js`,你可以像使用 `gentle.js` 一样使用它。

4. 通过修改 `convex/music.ts` 中的提示来更改背景音乐
5. 在 `convex/crons.ts` 中通过修改"生成新背景音乐"作业来更改生成新音乐的频率

## 使用云 AI 提供商

配置 `convex/util/llm.ts` 或设置这些环境变量:

```sh
# 本地 Convex
just convex env set LLM_API_HOST # url
just convex env set LLM_MODEL # model
# 云端 Convex
npx convex env set LLM_API_HOST # url
npx convex env set LLM_MODEL # model
```

由于需要指定嵌入向量的维度,因此嵌入模型配置需要在 [代码](./convex/util/llm.ts) 中更改。

### 密钥

对于 Together.ai,请访问 https://api.together.xyz/settings/api-keys
对于 OpenAI,请访问 https://platform.openai.com/account/api-keys

## 使用托管的 Convex

你可以通过运行以下命令在云端运行 Convex 后端:

```sh
npx convex dev --once --configure
```

并更新 `package.json` 脚本以删除 `just`:
将 `just convex ...` 改为 `convex ...`。

然后你需要使用 `npx convex env set` 或在仪表板上设置你之前在本地环境中设置的任何环境变量:
https://dashboard.convex.dev/deployment/settings/environment-variables

要运行命令,请使用 `npx convex ...`,以前你使用的是 `just convex ...`。

## 部署该应用程序

### 将 Convex 函数部署到生产环境

在你可以运行应用程序之前,你需要确保 Convex 函数已部署到其生产环境中。

1. 运行 `npx convex deploy` 将 convex 函数部署到生产环境
2. 运行 `npx convex run init --prod`

如果你有现有数据要清除,你可以运行 `npx convex run testing:wipeAllTables --prod`

### 添加认证(可选)

你可以通过 `git revert b44a436` 来添加 Clerk 认证。
或者只需查看该 diff 以了解移除它时所做的更改。

**创建 Clerk 账户**

- 访问 https://dashboard.clerk.com/ 并点击"添加应用程序"
- 为你的应用程序命名并选择要为用户提供的登录提供商
- 创建应用程序
- 将 `VITE_CLERK_PUBLISHABLE_KEY` 和 `CLERK_SECRET_KEY` 添加到 `.env.local`

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_***
CLERK_SECRET_KEY=sk_***
```

- 转到 JWT 模板并创建一个新的 Convex 模板。
- 复制 JWKS 端点 URL 以供下面使用。

```sh
npx convex env set CLERK_ISSUER_URL # 例如 https://your-issuer-url.clerk.accounts.dev/
```

### 部署到 Vercel

- 在 Vercel 上注册一个账户,然后 [安装 Vercel CLI](https://vercel.com/docs/cli)。
- **如果你使用 Github Codespaces**: 你需要 [安装 Vercel CLI](https://vercel.com/docs/cli) 并通过运行 `vercel login` 从你的 codespaces cli 进行身份验证。
- 使用 `vercel --prod` 将应用程序部署到 Vercel。

## 从云端部署使用本地推理

我们支持使用 [Ollama](https://github.com/jmorganca/ollama) 进行对话生成。
为了让它可以通过 Web 访问,你可以使用 Tunnelmole 或 Ngrok 等工具。

**使用 Tunnelmole**

[Tunnelmole](https://github.com/robbie-cahill/tunnelmole-client) 是一个开源的隧道工具。

你可以通过以下选项之一安装 Tunnelmole:

- NPM: `npm install -g tunnelmole`
- Linux: `curl -s https://tunnelmole.com/sh/install-linux.sh | sudo bash`
- Mac: `curl -s https://tunnelmole.com/sh/install-mac.sh --output install-mac.sh && sudo bash install-mac.sh`
- Windows: 使用 NPM 安装,或者如果你没有安装 NodeJS,请从 [此处](https://tunnelmole.com/downloads/tmole.exe) 下载 Windows 的 `exe` 文件,并将其放在你的 PATH 中的某个位置。

安装完 Tunnelmole 后,运行以下命令:

```
tmole 11434
```

Tunnelmole 在运行此命令后应该会输出一个唯一的 url。

**使用 Ngrok**

Ngrok 是一个流行的封闭源隧道工具。

- [安装 Ngrok](https://ngrok.com/docs/getting-started/)

安装并验证 ngrok 后,运行以下命令:

```
ngrok http http://localhost:11434
```

Ngrok 在运行此命令后应该会输出一个唯一的 url。

**将 Ollama 端点添加到 Convex**

```sh
npx convex env set OLLAMA_HOST # 上一步中的 tunnelmole/ngrok 唯一 url
```

**更新 Ollama 域名**

Ollama 有一个受信任域名列表。添加 ngrok 域名,这样它就不会拒绝流量。
更多详情请查看 ollama.ai。

## 致谢

- 该项目中的所有交互、背景音乐和 <Game/> 组件中的渲染都由 [PixiJS](https://pixijs.com/) 提供支持。
- 地形图:
  - https://opengameart.org/content/16x16-game-assets by George Bailey
  - https://opengameart.org/content/16x16-rpg-tileset by hilau
- 我们使用了 https://github.com/pierpo/phaser3-simple-rpg 作为该项目的原型。虽然我们后来重写了整个应用程序,但非常感谢它提供了一个简单的起点。
- 原始资源来自 [ansimuz](https://opengameart.org/content/tiny-rpg-forest)
- UI 基于 [Mounir Tohami](https://mounirtohami.itch.io/pixel-art-gui-elements) 的原始资产

# 🧑‍🏫 什么是 Convex?

[Convex](https://convex.dev) 是一个托管的后端平台,内置数据库,让你可以使用
[TypeScript](https://docs.convex.dev/typescript) 编写你的
[数据库模式](https://docs.convex.dev/database/schemas) 和
[服务器函数](https://docs.convex.dev/functions)。服务器端数据库
[查询](https://docs.convex.dev/functions/query-functions) 会自动
[缓存](https://docs.convex.dev/functions/query-functions#caching--reactivity) 和
[订阅](https://docs.convex.dev/client/react#reactivity) 数据,为我们的
[React 客户端](https://docs.convex.dev/client/react) 提供
[实时 `useQuery` 钩子](https://docs.convex.dev/client/react#fetching-data)。它还支持
[Python](https://docs.convex.dev/client/python)、
[Rust](https://docs.convex.dev/client/rust)、
[ReactNative](https://docs.convex.dev/client/react-native) 和
[Node](https://docs.convex.dev/client/javascript) 客户端,以及一个简单的
[HTTP API](https://docs.convex.dev/http-api/)。

该数据库支持
[NoSQL 风格的文档](https://docs.convex.dev/database/document-storage) 及
[可选的模式验证](https://docs.convex.dev/database/schemas)、
[关系](https://docs.convex.dev/database/document-ids) 和
[自定义索引](https://docs.convex.dev/database/indexes/)
(包括对嵌套对象中的字段建索引)。

[`query`](https://docs.convex.dev/functions/query-functions) 和
[`mutation`](https://docs.convex.dev/functions/mutation-functions) 服务器函数对数据库具有事务性、
低延迟访问权限,并利用我们的
[`v8` 运行时](https://docs.convex.dev/functions/runtimes) 和
[确定性保护](https://docs.convex.dev/functions/runtimes#using-randomness-and-time-in-queries-and-mutations)
提供最强的 ACID 保证:
即时一致性、
可串行化隔离和通过
[乐观多版本并发控制](https://docs.convex.dev/database/advanced/occ) (OCC / MVCC) 实现的
自动冲突解决。

[`action` 服务器函数](https://docs.convex.dev/functions/actions) 可以访问外部 API 并支持其他侧效应和非确定性行为,这些函数可以在我们优化过的 `v8` 运行时或更灵活的 `node` 运行时中执行。

函数可以通过[调度](https://docs.convex.dev/scheduling/scheduled-functions)和 [cron 作业](https://docs.convex.dev/scheduling/cron-jobs)在后台运行。

开发是云优先的,通过 [CLI](https://docs.convex.dev/cli) 进行[服务器函数热重载编辑](https://docs.convex.dev/cli#run-the-convex-dev-server)、[预览部署](https://docs.convex.dev/production/hosting/preview-deployments)、[日志和异常报告集成](https://docs.convex.dev/production/integrations/)。
还有一个 [仪表板 UI](https://docs.convex.dev/dashboard) 用于[浏览和编辑数据](https://docs.convex.dev/dashboard/deployments/data)、[编辑环境变量](https://docs.convex.dev/production/environment-variables)、[查看日志](https://docs.convex.dev/dashboard/deployments/logs)、[运行服务器函数](https://docs.convex.dev/dashboard/deployments/functions)等。

它内置了[响应式分页](https://docs.convex.dev/database/pagination)、[文件存储](https://docs.convex.dev/file-storage)、[响应式文本搜索](https://docs.convex.dev/text-search)、[向量搜索](https://docs.convex.dev/vector-search)、[https 端点](https://docs.convex.dev/functions/http-actions) (用于 webhooks)、[快照导入/导出](https://docs.convex.dev/database/import-export/)、[流式导入/导出](https://docs.convex.dev/production/integrations/streaming-import-export) 和[运行时验证](https://docs.convex.dev/database/schemas#validators) (用于[函数参数](https://docs.convex.dev/functions/args-validation)和[数据库数据](https://docs.convex.dev/database/schemas#schema-validation) )等功能。

一切都会自动扩展,并且[免费开始使用](https://www.convex.dev/plans)。