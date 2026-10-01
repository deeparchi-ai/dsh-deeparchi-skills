# dsh-deeparchi-skills

DeepArchi methodology skills for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

A DSH bundle: installing it mounts the bundled skills into the session catalog, so the agent can load them like any built-in skill.

**当前版本 v0.1.0 · 预览版**

---

## 包含什么

| 技能 | 用途 | 依赖 |
|------|------|------|
| `architecture-gap-analysis` | 把企业/银行业务架构文档对照 BIAN、TOGAF 等标准框架做差距分析，输出咨询级对标报告与改进路线图 | 无。自带 BIAN Business Area 速查、财务域 Service Domain 清单、图表管线参考 |

技能内容来自深度架构（DeepArchi）在企业架构咨询中的实际工作方法。随包附带的 `references/` 是方法的一部分，不是示例数据。

## 安装

```sh
# 从 GitHub 安装（推荐，可指定 commit 锁定版本）
dsh plugin --profile <你的profile> add github:deeparchi-ai/dsh-deeparchi-skills#<commit-sha>

# 从本地目录安装（开发调试）
dsh plugin --profile <你的profile> add /path/to/dsh-deeparchi-skills
```

安装后启动该 profile，新会话的技能目录里会出现 `architecture-gap-analysis`。

## 配置

无需配置。插件读取随包发布的 `skills/<name>/SKILL.md`，不依赖任何绝对路径、不读取环境变量、不写文件。

## 权限

| 项 | 说明 |
|----|------|
| 网络 | 不使用 |
| 文件系统 | 只读本包内的 `skills/` 目录 |
| 生命周期脚本 | **无**。包内不含 `postinstall` 等脚本，安装过程不在你的机器上执行任何构建 |
| 依赖 | 零运行时依赖（不 import 任何 `@deepseek-ai/*` 模块） |
| 模型侧影响 | 技能进入模型的技能目录（`modelInvocable: true`），也出现在人工可用命令中（`userInvocable: true`） |

技能正文在模型真正加载时才会读取，因此修改 `SKILL.md` 不需要重新安装。

## 卸载

```sh
dsh plugin --profile <你的profile> remove dsh-deeparchi-skills
```

或从该 profile 的 `package.json` 依赖中删除后重新安装。插件 dispose 时会注销自己注册的技能候选。

## 兼容性

| 项 | 值 |
|----|-----|
| 验证环境 | DeepSeek Harness `0.2.0-rc.2`、Node 22.23.1 |
| 技能格式 | `SKILL.md` + YAML frontmatter（`name`、`description`）——与 Agent Skills / Agent Plugins 1.0.0 的内容层格式一致 |
| 已知限制 | 只在 0.2.0-rc.2 上实测过。Harness 处于开发者预览期且明确会有破坏性变更，升级后请复核技能是否仍出现在目录中 |

## 开发

```sh
# 改技能：直接编辑 skills/<name>/SKILL.md，重启会话即可生效
# 加技能：在 skills/ 下新建目录，并把目录名加入 lib/index.js 的 SKILL_NAMES
```

包内不含构建步骤：`lib/index.js` 是可直接运行的 ESM，仓库里提交的就是运行时产物。

## 许可

MIT，见 [LICENSE](LICENSE)。

---

深度架构 · 邝谧
