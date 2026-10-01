---
name: architecture-gap-analysis
description: 企业架构对标分析 — 将银行业务架构文档对照 BIAN/TOGAF 等标准框架进行差距分析，输出咨询级对标报告和改进路线图。
---

# 架构对标分析（Framework Gap Analysis）

> 当用户提供企业/银行业务架构文档，要求对照行业标准框架（BIAN、TOGAF、CMMI 等）进行差距分析时使用。

## 与 consulting-report 的关系

本 skill 是 consulting-report 的变体，专门覆盖"框架对标"类任务。报告采用 9 章简版结构（非完整 10 章）。语言和 chart-spec 规范沿用 consulting-report。

## 工作流（6 步）

### Step 1: 数据提取

用 pandas + openpyxl 读取用户上传的 Excel，先获取 sheet 列表再逐 sheet 提取。注意 sheet 名可能有空格前缀。

典型银行架构 Excel 含 3 个 sheet：
- 业务架构说明现状 — 领域大类、子域、业务活动、客户、渠道、部门
- 战略及重点任务分解 — 驱动力、数字化举措、系统建设、项目群
- 部门职责映射 — 业务活动→部门对照

### Step 2: 对标标准获取

搜索对标框架最新版本。BIAN 关键源：https://bian.org/servicelandscape-13-0-0/

> 细分领域速查：`references/bian-business-areas.md`（Business Area 清单 + 常见误归类）、`references/bian-finance-accounting.md`（财务域 21 个 Service Domain + BOM GitHub 直达链接 + Portal 流程工具入口）

### Step 3: 逐域对照映射

按既有领域大类，逐个子域映射到标准 Business Area。输出格式：

| 当前子域 | 实际业务性质 | 标准归属 | 严重度 |
|:--|:--|:--|:--|
| 个人存款 | 负债/账户头寸 | Position (Deposit Account) | 🔴 高 |

### Step 4: 识别分类偏差

重点检查四类问题：
- **产品域过载** — "产品管理"大类包含 10+ 子域，把独立域塞进一个筐
- **域缺失** — 标准有但当前架构无（如 IT & Architecture）
- **分类轴混用** — 同层级按客户/产品/流程三维度交叉分类
- **产品-流程割裂** — 产品定义和业务流程分属不同域

### Step 5: 输出差距矩阵

```
当前 N 大域 → 标准 M 域拆分路线
  域A → 域1 + 域2 + ...
  域B ⚠️ → 域3 + 域4 + ...（重点拆分）
  ❌ 缺失 → 域X
```

### Step 6: 改进路线图

三段式路线：
- Phase 1（1-2 月）：外科手术——域拆分，不涉组织调整
- Phase 2（2-3 月）：战略任务按新域重映射，识别跨域依赖
- Phase 3（4-6 月）：深化——Service Domain 粒度、数据模型、API 标准

## 报告结构（9 章）

1. 执行摘要 — 3-5 条核心发现 + 关键数字
2. 对标框架概述 — 标准简介
3. 现状分析 — 当前架构总览
4. 详细领域对照映射 — 逐域对照表
5. 综合差距分析 — 分类偏差 + 缺失域 + 耦合问题
6. 改进路线图 — Phase 1/2/3
7. 分角色建议 — 架构委员会/业务部门/科技部门/咨询团队
8. 风险与注意事项
9. 附录 — 速查表 + 参考来源 + 完整领域清单

## 飞书交付

### Step 1: 创建文档

```bash
cd /path/to/file && lark-cli docs +create --api-version v2 --doc-format markdown --content @filename.md
```

> Pitfall：`--content @file` 必须是相对路径，先 cd 到文件所在目录。

### Step 2: 配图生成与插入

报告中的 chart-spec 声明需转化为可视化图表。完整管线：**手写 SVG → 验证 → 转 PNG → 插入飞书 → 清理定位错误**。

#### 2a. SVG 生成规范

- **尺寸**：简单图 `viewBox="0 0 750 500"`，密集图（雷达/气泡）`viewBox="0 0 900 650"`
- **中文字体**：必须显式指定 `font-family="WenQuanYi Zen Hei, sans-serif"`，不可只用 `sans-serif`
- **字号基准**：标题 15-20px，标签 10-13px，数据标注 12-15px。生成 PNG 后再整体放大 1.6×
- **XML 转义**：文本中的 `<` `>` 必须写成 `&lt;` `&gt;`；属性值内不要嵌套双引号
- **配色**：`#2C3E50`(深蓝)、`#27AE60`(绿)、`#E74C3C`(红)、`#3498DB`(蓝)、`#F39C12`(橙)、`#95A5A6`(灰)

#### 2b. SVG → PNG 转换

飞书 **不支持 SVG 内联显示**，必须转 PNG。

```python
import cairosvg
cairosvg.svg2png(url=svg_path, write_to=png_path,
                 output_width=3600, output_height=2600)
```

> 依赖：`pip install cairosvg`；需系统安装中文字体 `fonts-wqy-zenhei`。

#### 2c. 按位置插入

```bash
lark-cli docs +media-insert --doc <TOKEN> --file chart.png \
  --selection-with-ellipsis "匹配文本" \
  --caption "图N：标题" --align center
```

`--selection-with-ellipsis` 匹配文档中**首个**包含该文本的段落，将图插入其后。选择短而唯一的文本（如"重点偏差分析"、"八大业务领域大类"）避免误匹配。

> Pitfall：选择文本太短（如"Phase 1"）可能匹配到摘要中的相同文本，导致图插入错误位置。出现 `warning: selection matched more than one block` 时用更长文本重新定位。

#### 2d. 清理错位图

```bash
# 查找所有图片块
lark-cli docs +fetch --api-version v2 --doc <TOKEN> --doc-format xml --detail with-ids | \
  python3 -c "import sys,json,re; ..."

# 删除指定块
lark-cli docs +update --api-version v2 --doc <TOKEN> \
  --command block_delete --block-id <BLOCK_ID>
```

#### 2e. 常见问题速查

| 问题 | 原因 | 解决 |
|:--|:--|:--|
| 中文显示为乱码/方块 | SVG 用了 `font-family="sans-serif"` 未指定中文字体 | 改为 `font-family="WenQuanYi Zen Hei, sans-serif"` |
| 图在飞书中不显示 | 飞书不支持 SVG 格式内联 | 转 PNG 后重新插入 |
| 图尺寸太小 | viewBox 太小或输出分辨率太低 | 密集图用 900×650 viewBox，输出 3600×2600 |
| XML 解析失败 | 文本中含未转义的 `<` `>`，或属性值内嵌双引号 | 用 `&lt;` `&gt;` 转义，属性用单引号 |
| 图插入位置错误 | `--selection-with-ellipsis` 匹配了不该匹配的段落 | 删除错位块，用更长/更唯一的匹配文本重插 |
| 饼图弧段比例不对 | 弧线终点用手估而非三角函数计算 | 用 `x=R*sin(θ) y=-R*cos(θ)` 精确计算 |
| 插入后尺寸 100×100 | 多图快速插入导致版本冲突或异步处理未完成 | 串行插入，每次等 5-10s；发现 100×100 立即删除重插 |
| `--selection-with-ellipsis` 报 1101 | 文本在富文本内部表示与 Markdown 源有差异 | 用 `docs +fetch` 查实际文本；尝试短唯一片段如"（按产品）" |

完整管线参考：`references/chart-pipeline.md`

## BIAN 已知偏差陷阱

- **存款≠产品**：存款是 Position（账户头寸），不是 Product（产品规格）
- **贷款≠产品**：贷款是 Lending 独立 Business Area
- **运营≠大杂烩**：清算属 Payments，账户属 Position，柜面属 Channel
- **风险与内控可合并**：BIAN 标准中 Risk & Compliance 是一个 Business Area
- **IT 域常缺失**：大多数银行架构文档遗漏 IT & Architecture Management
