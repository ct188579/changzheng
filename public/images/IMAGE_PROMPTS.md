# 《征途 · 不灭的火种》04 章节 · 人物图板提示词

04「平凡中的伟大」右侧卡片有三个人物档位，滚动到哪一档就显示哪一张图。生成后把文件直接放进本目录，代码会自动接管；**文件不存在时卡片会自动回退到内置的剪影插画**，所以可以先只生成一张、随时补。

> **当前已入库**：`people-01.jpg` / `people-02.jpg` / `people-03.jpg`（由原始 PNG 裁切、降采样到宽 1080 并转 JPEG，三张共约 700KB）。
> 原图备份在项目根目录 `design-source/people-original/`（已加入 .gitignore，不会进仓库或被打包）。
> 换图时只要覆盖这三个文件名即可，**代码无需改动**；用别的文件名则要同步改 `src/App.tsx` 里 `people[]` 的 `img` 字段。

## 规格

- **构图**：竖版 **3:4**（建议 1200×1600，或 4:5 的 1080×1350）
- **安全区**：主体放在画面**中上部**；**底部约 25% 请留成暗部或低细节区域**（那里会叠加人物姓名与引言）
- **色调**：暗调、低饱和，暖褐 / 土黄 / 岩灰为主，向站点现有的暗褐 + 暗朱红配色靠拢
- **不做**：不要生成可辨认的历史人物肖像、不要领导人形象、不要旗帜与标语文字、不要现代物件
- 生成模型会虚构细节，这些图请作为**艺术化视觉表达**使用，不作史料图片

## 通用风格后缀（三段提示词都加在末尾）

```
纪实胶片摄影风格，1930 年代中国西南山区，暗调低饱和，暖褐与土黄主色，
微弱侧逆光，35mm 胶片颗粒与轻微漏光，柔和空气雾霭，浅景深，竖版 3:4 构图，
主体位于画面中上部，画面上方留空，画面底部自然压暗以便叠加文字，
不出现清晰可辨的面部特征，无文字、无 logo、无水印
```

English:

```
documentary film photography, 1930s mountainous southwest China, low-key and desaturated,
warm sepia and earth tones, faint rim/back light, 35mm film grain with subtle light leak,
soft atmospheric haze, shallow depth of field, vertical 3:4 composition,
main subject in the upper-middle area, clean space at the top,
natural darkening toward the bottom edge for text overlay,
faces never clearly identifiable, no text, no logo, no watermark
```

## 01 · 一名红军战士 — `people-01.jpg`

> 无数无名者之一 —— 把有限的干粮留给战友，把继续前行的勇气留给自己。

```
一位年轻红军士兵的侧后方逆光剪影，背着捆扎的薄被与布包，肩扛步枪，
绑腿沾着泥，草鞋踩在碎石山路上，正沿山脊小路向上行进；晨雾弥漫，
远处山脊只剩一道轮廓，近处几株枯草被风吹弯；士兵大半张脸隐在阴影中，
只有下颌与耳廓有一线轮廓光。 +
[通用风格后缀]
```

English:

```
back-three-quarter rim-lit silhouette of a young Red Army soldier walking uphill,
a rolled blanket and cloth pack strapped to his back, rifle over one shoulder,
mud-stained puttees, straw sandals on a gravel mountain trail; heavy morning mist,
a distant ridge reduced to a single outline, a few dry grasses bending in the wind;
most of his face hidden in shadow, only a thin rim light on jaw and ear. +
[style suffix]
```

## 02 · 一位沿途群众 — `people-02.jpg`

> 同行的人民 —— 征途并非孤身跋涉。

```
山村妇女把一篮干粮（玉米、红薯）递向路过队伍中的战士，以双手为画面焦点、
人物面部虚化；身后是夯土墙与木门，屋檐下挂着成串玉米与干辣椒；
黄昏暖光从门内透出，逆光里尘埃在光柱中浮动；低机位，
画面右侧留出一位战士的暗色背影剪影。 +
[通用风格后缀]
```

English:

```
a village woman handing a basket of dry rations — corn and sweet potatoes — to a
soldier in a passing column; her hands are the focal point, faces blurred;
rammed-earth wall and a wooden door behind, strings of corn and dried chilies
hanging under the eaves; warm dusk light spilling out of the doorway,
dust motes floating in the backlit beam; low angle,
a soldier's dark silhouette at the right edge of the frame. +
[style suffix]
```

## 03 · 一位年轻干部 — `people-03.jpg`

> 在实践中求索 —— 在复杂局势中校准方向。

```
窑洞里，一位年轻军人伏在旧木桌上就着油灯写笔记，桌上摊着一张粗糙的手绘地图
和一支铅笔；灯焰自下而上照亮他半边脸，另半边沉入黑暗，肩章与被磨旧的挎包在暗处；
身后是斑驳的土墙与一扇挂着粗布的小窗，窗外是深蓝夜色。 +
[通用风格后缀]
```

English:

```
inside a cave dwelling, a young officer leaning over an old wooden desk writing notes
by an oil lamp; a rough hand-drawn map and a pencil on the desk; the flame lights
one half of his face from below while the other half sinks into darkness,
a worn canvas satchel in the shadows behind him; mottled earth walls and a small
window draped with coarse cloth, deep blue night outside. +
[style suffix]
```

## 反向提示词（negative prompt）

```
可辨认的历史人物肖像，领导人形象，旗帜，标语文字，五角星特写，政治符号，
现代服饰，现代物件，鲜艳高饱和色彩，HDR 风光，清晰正脸特写，
卡通，插画，3D 渲染，文字，水印，多人合影摆拍
```

English:

```
identifiable historical portraits, images of leaders, flags, slogan text,
close-ups of stars or political symbols, modern clothing, modern objects,
vivid saturated colors, HDR landscape, sharp frontal face close-up,
cartoon, illustration, 3D render, text, watermark, posed group photo
```

## 让三张图看起来是同一套的小技巧

1. **先出一张**，挑最满意的那张，再用工具的「图生图 / 风格参考 / 角色参考」生成另外两张；
2. 或者**固定 seed**（同一随机种子）+ 只改主体描述，色调与颗粒感会自然统一；
3. 三张都生成完后，交付前统一过一遍：**降低饱和度、压暗高光、加一点暖色**，就能和站点的暗调档案风格咬合。

## 文件路径对应

| 档位 | 页面位置 | 文件 |
| --- | --- | --- |
| 01 一名红军战士 | 04 章节第 1 档 | `public/images/people-01.jpg` |
| 02 一位沿途群众 | 04 章节第 2 档 | `public/images/people-02.jpg` |
| 03 一位年轻干部 | 04 章节第 3 档 | `public/images/people-03.jpg` |
