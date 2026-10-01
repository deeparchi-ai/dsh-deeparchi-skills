# 飞书配图生成管线实录 (Session 2026-05-30)

## 踩坑全记录

### 坑1: SVG 直接插入飞书不显示
- 现象：`docs +media-insert` 返回成功，但文档中无图
- 根因：飞书 docx 不支持 SVG inline 格式
- 解决：必须先用 CairoSVG 转 PNG

### 坑2: 中文乱码
- 现象：PNG 中中文显示为方块/乱码
- 根因：SVG 中 `font-family="sans-serif"` 未指定中文字体，CairoSVG/Pango 找不到汉字 glyph
- 解决：显式指定 `font-family="WenQuanYi Zen Hei, sans-serif"`
- 前置：`apt install fonts-wqy-zenhei`

### 坑3: XML 解析失败 (invalid token)
- 三处触发：
  1. 文本 `(<40)` 中的 `<` 被当作 XML 标签开始 → 改 `&lt;`
  2. `font-family=""WenQuanYi", "Noto Sans""` 属性值内嵌双引号 → 去掉内层引号
  3. SVG 注释 `<!-- text -- text -->` 含双连字符 `--` → XML 规范禁止注释中出现 `--`，改用 `:` 或空格分隔
- 解决：所有纯文本中的 `<` `>` 用 `&lt;` `&gt;` 转义；属性值只用单引号或不用引号；注释中避免 `--`

### 坑4: 图片尺寸太小
- 现象：3000×2000 的 PNG 在飞书文档中仍然太小
- 根因：viewBox 太小（750×500），字体 8-16px 放大后仍不够
- 解决：密集图用 viewBox 900×650，字号 12-28px，输出 3600×2600

### 坑5: `--selection-with-ellipsis` 误匹配
- 现象：甘特图插入到执行摘要而非目标章节
- 根因：选择文本太短（如"外科手术"），在摘要中也出现了
- 解决：用更长/更唯一的文本；出现 `warning: matched more than one block` 时立即换

### 坑6: `--content @file` 路径错误
- 现象：`--content: invalid file path, --file must be a relative path`
- 解决：先 `cd` 到文件所在目录，再用相对路径

### 坑7: 多张图片快速插入后尺寸变成 100×100
- 现象：`docs +media-insert` 返回成功，但部分图在飞书中只显示为 100×100 的缩略图
- 根因：多次插入呼叫间隔太短，飞书文档版本冲突或图片异步处理未完成
- 解决：
  1. 不要并行插入；一次只插入一张
  2. 每次插入后等待 5–10 秒，让服务端处理完成
  3. 插入完成后用 `docs +fetch` 验证尺寸，发现 100×100 立即删除重插
  4. 使用更长的 `--selection-with-ellipsis` 匹配文本，减少版本冲突概率
- 验证：检查 `<img>` 的 `width`/`height` 属性是否为 1500×N 而非 100×100

### 坑8: 饼图弧段角度计算错误

- 现象：饼图中 55.47% 的扇区只画了约 20%，图形与数据不匹配
- 根因：SVG `<path>` 的弧线终点坐标用手估而非数学计算。饼图弧段必须用三角函数精确计算终点坐标
- 解法：从 12 点钟方向顺时针计算：
  ```
  // 给定百分比 p%
  angle = p * 360 / 100  // 顺时针度数
  x = R * sin(angle * π / 180)
  y = -R * cos(angle * π / 180)
  // SVG arc: M 0,0 L prev_x,prev_y A R,R 0 0,1 x,y Z
  ```
- 验证：画完所有扇区后，最后一段的终点应回到 (0, -R)；渲染后目视检查各扇区占比
- 小比例（<0.1%）可合并到相邻扇区，避免极短弧线渲染异常

### 坑11: 饼图圆形变椭圆

- 现象：饼图渲染后扇形被拉伸成椭圆，不成正圆
- 根因A：SVG viewBox 宽高比与输出 PNG 宽高比虽然一致，但饼图 `<g transform="translate(cx,cy)">` 内部的圆是相对于该坐标系的——如果 viewBox 中饼图绘制区域本身不是正方形（如 280,260 圆心 + r=160 在 820×450 的 viewBox 中），圆形在物理像素上会被拉伸
- 根因B：即使 viewBox 和输出比例一致，**cairosvg 在实际渲染中可能产生亚像素级的拉伸**，导致视觉上不圆（matplotlib `bbox_inches='tight'` 同理）
- **解决方案优先级**：
  1. **首选方案——用 Pillow `ImageDraw.pieslice()` 直接绘制**：在方形 bounding box 内绘制 pieslice，输出正方形 PNG，完全绕过 SVG/cairosvg 管线。这是最可靠的方案，因为 Pillow 在方形 box 内渲染的圆必定是正圆
     ```python
     from PIL import Image, ImageDraw
     S = 1500  # 正方形
     img = Image.new('RGB', (S, S), '#faf9f7')
     draw = ImageDraw.Draw(img)
     cx, cy, r = 500, 680, 320
     bbox = (cx-r, cy-r, cx+r, cy+r)
     # PIL: 0°=3h, clockwise. Top=270°. 55.47% from top: 270→70.308°
     draw.pieslice(bbox, start=70.308, end=270.0, fill='#7BA3A8')
     draw.pieslice(bbox, start=270.108, end=70.308, fill='#D4956A')
     ```
  2. **备选方案——SVG 方形 viewBox**：将 viewBox 设为正方形（如 700×700），饼图在其内居中，输出同样正方形的 PNG
- **验证**：渲染后取样 4 个正交方向上的像素，水平直径与垂直直径差异 < 2%（Pillow 方案通常 0%）
- **Feishu 缓存问题**：如果更新了 PNG 但飞书显示旧图，用全新文件名（如 `fig2_v2.png`）重新插入以破除缓存

### 坑9: `--selection-with-ellipsis` 匹配失败 1101

- 现象：`MCP: [VALIDATION:1101] 未找到匹配的内容`
- 根因：选择文本在文档富文本内部表示中可能与 Markdown 源有细微差异（空格、引号、排版标记）
- 解决：
  1. 先用 `docs +fetch --format json` 获取文档内容，用 `<p>` 或 `<blockquote>` 标签中的实际文本匹配
  2. 优先使用较短的唯一片段（如 `"（按产品）"`），而非完整标题
  3. 短片段在多处出现时，增加上下文使其唯一
  4. 仍失败则改用 `block_insert_after` + 先 `drive +upload` 获取 file_token

### 坑10: 气泡矩阵布局调整

- 现象：气泡图中文字被气泡边界裁剪或重叠
- 根因：多词标签放在单个 `<text>` 中，气泡圆半径不够大
- 解决：
  1. 多词标签拆成两行 `<text>`，如"农信"一行、"新核心"一行，垂直间距 16px
  2. 气泡圆心间距至少 2×max_radius + 30px，避免相邻气泡重叠

## 管线参数速查

  | 参数 | 简单图 (柱状/甘特) | 密集图 (雷达/气泡) | **饼图（Pillow pieslice）** | 气泡矩阵(9+气泡) | 框架图 (BLM/IT4IT) |
  |:--|:--|:--|:--|:--|:--|
  | viewBox | 750×500 | 900×650 | **700×700 (方形)** | 820×560 | 1000×700 |
  | 标题字号 | 15-16px | 20px | 22px | 22px | 22px |
  | 标签字号 | 9-11px | 12-14px | 13-15px | 12-16px | 11-13px |
  | 数据标注 | 11-13px | 14-15px | 13px | 11-13px | 12px |
  | 输出宽度 | 3000 | 3600 | **1500 (Pillow)** | 3000 | 3000 |
  | 输出高度 | 2000 | 2600 | **1500 (Pillow)** | 2240 | 2100 |
  | **渲染工具** | cairosvg | cairosvg | **Pillow pieslice** | cairosvg | cairosvg |

## 命令速查

```bash
# 转 PNG（非饼图：cairosvg）
python3 -c "
import cairosvg; cairosvg.svg2png(url='chart.svg', write_to='chart.png', output_width=3600, output_height=2600)
"

# 转 PNG（饼图：Pillow — 保证正圆）
python3 -c "
from PIL import Image, ImageDraw
S=1500; img=Image.new('RGB',(S,S),'#faf9f7'); d=ImageDraw.Draw(img)
cx,cy,r=500,680,320; bb=(cx-r,cy-r,cx+r,cy+r)
d.pieslice(bb,start=70.308,end=270.0,fill='#7BA3A8')  # 55.47%
d.pieslice(bb,start=270.108,end=70.308,fill='#D4956A') # 44.50%
# 图例和文字用 d.text() + fonts
img.save('chart.png')
"

# 插入（按文本定位）
lark-cli docs +media-insert --doc <TOKEN> --file chart.png \
  --selection-with-ellipsis "唯一匹配文本" \
  --caption "图N：标题" --align center

# 查找所有图片块
lark-cli docs +fetch --api-version v2 --doc <TOKEN> --doc-format xml --detail with-ids | \
  python3 -c "
import sys,json,re
data=json.load(sys.stdin)
content=data['data']['document']['content']
for m in re.finditer(r'<img\s+id=\"([^\"]+)\"[^>]*caption=\"([^\"]*)\"', content):
    print(m.group(1),'|',m.group(2))
"

# 批量删除
for bid in <ID1> <ID2> ...; do
  lark-cli docs +update --api-version v2 --doc <TOKEN> --command block_delete --block-id "$bid"
done
```
