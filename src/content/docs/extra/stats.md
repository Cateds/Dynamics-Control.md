---
title: 往年题知识点汇总
description: 考频统计、知识点分布、题型分布、难度分布。
---

![twins](../../../assets/twin-melon.jpg)

> 统计范围：2022、2023、2024、2025 共 4 套 Dynamics and Control 主考试卷。统计按当前试卷文本整理，用于判断复习优先级，不等同于官方命题概率。

## 统计口径

- 频次按小问或明确子任务近似计数；同一综合大题会拆成多个知识点。
- 题号格式如 `2024 Q3(b)(iii)`；若一个大题连续覆盖同一类任务，会用 `2022 Q3(a-f)` 这样的压缩写法。
- 公式页、附录中的 block diagram reduction rules 不计入统计；只统计正式题目。
- 课程链接优先指向本仓库最接近的 lecture 或 heading；个别题目跨章节时链接到最相关的一组讲义。
- 优先级是复习建议：A 必须熟练，B 高频重要，C 低频但容易送分或丢分。

## 高频总览

| 优先级 | 知识点 | 频次 | 对应课程 | 主要考法 |
| --- | --- | ---: | --- | --- |
| A | 框图建模 / 框图简化 / 闭环传递函数 | 15 | [Lec.2 设计流程](../part.1/lec2.md#设计流程), [Lec.2 框图简化](../part.1/lec2.md#框图简化), [Lec.3 框图练习](../part.1/lec3.md#使用方框图简化规则) | 设计流程、功能框图、求和点与分支点移动、反馈回路消除、化成单一传递函数 |
| A | Routh-Hurwitz / 稳定范围 / 临界增益 | 12 | [Lec.4 Routh](../part.1/lec4.md#劳斯稳定判据-rouths-stability-criterion), [Part.2 Lec.5 Routh-Hurwitz](../part.2/lec5.md#劳斯-赫尔维茨判据-routh-hurwitz-criteria) | 列 Routh 表、判断稳定性、求参数 $K$ 范围、虚轴穿越与连续振荡 |
| A | 根轨迹完整作图流程 | 22 | [Part.2 Lec.1 根轨迹构造](../part.2/lec1.md#根轨迹构造-root-locus-construction), [Part.2 Lec.2 根轨迹续](../part.2/lec2.md#根轨迹分析-续) | 极点零点、实轴区间、渐近线、重心、分离点、虚轴交点、稳定区间和反思 |
| A | Bode 图 / 时间常数形式 / 频率响应 | 19 | [Part.2 Lec.3 Bode 基本组件](../part.2/lec3.md#bode-图基本组件), [Part.2 Lec.4 例题](../part.2/lec4.md#例题) | 化时间常数形式、找 corner frequency、斜率/相位贡献、手画幅值与相位图 |
| A | P / I / D 控制与稳态误差 | 18 | [Lec.5 基本控制作用](../part.1/lec5.md#基本控制作用), [Lec.6 I/PI/PID](../part.1/lec6.md#i) | P 控制一阶闭环响应、误差传递函数、稳态误差、I 控制零稳态误差、PID 三项作用 |
| B | 极点 / 零点 / 二阶标准系统 / 稳定性 | 8 | [Lec.1 二阶系统](../part.1/lec1.md#二阶系统-second-order-system), [Lec.4 传递函数性质](../part.1/lec4.md#传递函数性质) | 从传递函数读 poles/zeros、判断稳定性、阻尼比与自然频率代入、零极点图 |
| B | Nyquist 稳定判据 / 延迟 / 补偿器影响 | 8 | [Part.2 Lec.2 Nyquist](../part.2/lec2.md#奈奎斯特图-nyquist-plot), [Part.2 Lec.6 Nyquist 判据](../part.2/lec6.md#nyquist-稳定判据), [Part.2 Lec.7 补偿器](../part.2/lec7.md#控制系统设计与补偿器) | 画 Nyquist、求最大稳定 $K$、讨论延迟或控制器修改如何改变稳定范围 |
| B | 频域稳定裕度 / crossover / 开环增益影响 | 7 | [Part.2 Lec.5 稳定裕度](../part.2/lec5.md#bode-图中的稳定裕度), [Part.2 Lec.6 Nyquist 裕度](../part.2/lec6.md#nyquist-图上的稳定裕度) | gain crossover、phase crossover、最大稳定增益、GM/PM、增益变化对稳定性的影响 |
| B | 控制系统设计流程 / 定性描述转框图与原理图 | 7 | [Lec.2 控制系统简介](../part.1/lec2.md#控制系统简介), [Lec.2 设计流程](../part.1/lec2.md#设计流程) | 反馈控制设计逻辑、扰动补偿、闭环优点、定性描述到 functional block diagram / schematic diagram 的转换 |
| C | 参数变化对响应的定性解释 | 5 | [Lec.6 I 控制](../part.1/lec6.md#i), [Part.2 Lec.5 经验值](../part.2/lec5.md#一些经验值) | $K_i$、$K_p$、$K$、$\tau$ 变化对速度、阻尼、超调、交越频率和稳定性的影响 |

## 知识点明细

### A. 必须熟练掌握

| 知识点 | 考过的题 | 复习重点 |
| --- | --- | --- |
| 框图建模 / 框图简化 | `2022 Q1(a-b)`, `2023 Q1(b)`, `2024 Q1(a-c)`, `2025 Q1(a-b)`, `2025 Q2(a)(i)` | 会把定性需求转成 functional block diagram；熟悉串联、并联、求和点移动、分支点移动和反馈回路消除；最后要能得到 $C(s)/R(s)$ 或闭环特征方程。 |
| Routh-Hurwitz / 稳定范围 | `2022 Q1(c)`, `2022 Q3(e-f)`, `2023 Q1(c)`, `2023 Q4(b-e)`, `2024 Q3(c)`, `2025 Q1(c)`, `2025 Q3(b)(iv),c` | 会构造 Routh 表并看第一列；含参数 $K$ 时要列出所有不等式；虚轴穿越时要能求临界 $K$ 和连续振荡频率。闭环特征方程本身另按框图/根轨迹题处理。 |
| 根轨迹构造 | `2022 Q3(a-f)`, `2023 Q4(a-e)`, `2024 Q3(a-c)`, `2025 Q3(a-c)` | 固定流程：开环极点零点、根轨迹分支数量、实轴区间、渐近线数量/角度/重心、分离点、虚轴交点、稳定区间。不要只会画图，要能解释 $K$ 增大时极点如何移动。 |
| Bode 图作图 | `2022 Q4(a-d)`, `2024 Q4(a-d)`, `2025 Q4(a-b)` | 先把传递函数化成时间常数形式；逐项列出增益、积分项、一阶 lag/lead、二阶项；每个因子给幅值斜率和相位贡献，再叠加成总图。 |
| P / I / D 与稳态误差 | `2022 Q2(a-b)`, `2023 Q2(a-b)`, `2024 Q2(a,c)`, `2025 Q2(a)` | P 控制会降低但通常不能消除阶跃稳态误差；I 控制能消除阶跃稳态误差但提高系统阶数、降低阻尼；D 控制一般不单独用，常和 P 配合增加阻尼并改善瞬态。 |
| 一阶闭环系统响应 | `2022 Q2(b)(i-iv)`, `2023 Q2(b)(i-iv)`, `2024 Q2(a)`, `2025 Q2(a)(ii-iv)` | 会从框图写闭环传递函数和误差传递函数；对单位阶跃用终值定理求 final response 和 steady-state error；能由误差要求反推 $K_p$ 或解释 $K_i$ 对阻尼的影响。 |

### B. 高频重要知识点

| 知识点 | 考过的题 | 复习重点 |
| --- | --- | --- |
| 极点 / 零点 / 二阶标准形式 | `2024 Q2(b)`, `2025 Q2(a)(ii)`, `2025 Q2(b)`, `2022 Q3(a)`, `2024 Q3(b)(i)`, `2025 Q3(b)(i)` | 直接从分子分母找 zero/pole；二阶标准式要能识别 $\zeta$、$\omega_n$；稳定性先看极点实部，根轨迹题中还要把开环极点零点标到图上。 |
| Nyquist / 延迟 / 补偿器 | `2023 Q3(a-d)` | 重点是从 $G(j\omega)$ 的轨迹判断离 $(-1,j0)$ 的距离；带延迟或补偿器时，幅值和相位的变化会改变最大稳定 $K$；反思题要说清楚“为什么稳定范围变了”。 |
| 频域稳定裕度 / 最大稳定增益 / crossover | `2023 Q3(b-d)`, `2024 Q4(d)(ii)`, `2025 Q4(c-d)` | `2025 Q4(c-d)` 是 GM/PM 直接计算；`2023 Q3(b-d)` 是 Nyquist 下最大稳定 $K$；`2024 Q4(d)(ii)` 是 $K$ 对 gain/phase crossover 的影响。复习时不要把三类问法混成同一道题。 |
| 控制系统设计流程 | `2022 Q1(a)`, `2024 Q1(a)`, `2025 Q1(a)` | 顺序通常是需求与规格、功能框图、物理/原理图、数学模型或传递函数、框图简化、分析设计测试。`2025 Q1(a)` 还要求说明从 qualitative description 转成 functional block diagram 和 schematic diagram 的意义与挑战。 |
| 闭环系统与扰动补偿 | `2023 Q1(a)`, `2025 Q2(a)(i)` | 会说明 closed-loop 用反馈比较期望和实际输出，通过误差信号修正控制量；相对 open-loop 的优点是抗扰动、鲁棒和精度更好。 |
| Bode 交越频率 / 增益变化反思 | `2022 Q4(d)`, `2024 Q4(d)`, `2025 Q4(c-d)` | `2022 Q4(d)` 是按指定 gain crossover 反求 $K$；`2024 Q4(d)` 是增益变化后的 revised Bode 和 crossover 变化；`2025 Q4(c-d)` 才直接进入 GM/PM 与稳定性讨论。 |

### C. 低频但容易送分

| 知识点 | 考过的题 | 复习重点 |
| --- | --- | --- |
| Autopilot 功能框图场景建模 | `2024 Q1(c)` | 场景题不难，关键是把 reference、controller、actuator/plant、sensor、feedback、disturbance 写全；不要只画一个空泛的大方框。 |
| 定性描述到功能框图 / 原理图 | `2025 Q1(a)` | 会解释为什么要把文字需求转成 functional block diagram 和 schematic diagram：便于明确输入输出、组件关系和信号流；挑战通常来自需求模糊、系统边界不清和物理实现细节不足。 |
| 直接稳定性判断 | `2024 Q2(b)`, `2025 Q2(b)` | 题目只让找 poles/zeros 并评论稳定性时，不要启动完整 Routh；先看极点是否都在左半平面。 |
| $K_i$、$\tau$ 与响应曲线识别 | `2023 Q2(b)(iii-iv)`, `2025 Q2(a)(iii-iv)` | $K_i$ 大通常响应快但阻尼小、超调更明显；$K_i$ 太小响应慢；$\tau$ 大使系统响应变慢。 |
| 反思类小问 | `2022 Q3(f)`, `2023 Q3(d)`, `2023 Q4(e)`, `2024 Q4(d)(ii)`, `2025 Q4(d)` | 反思题不要只重复计算结果，要把“参数变化 -> 极点/裕度/交越频率变化 -> 稳定性或响应变化”的链条写出来。 |

## 按年份反查

| 年份 | 主要知识点 |
| --- | --- |
| 2022 | 反馈控制系统设计流程、框图简化、Routh 稳定判据、D 控制为什么要配合 P、P 控制一阶闭环传递函数与稳态误差、I 控制消除阶跃稳态误差、根轨迹完整流程、虚轴穿越、Bode 时间常数形式、corner frequency、斜率/相位贡献、按指定 gain crossover 求 $K$。 |
| 2023 | 闭环系统扰动补偿、框图简化、含 $K$ 的 Routh 稳定范围、PID 三项作用、积分控制一阶系统 final response / steady-state error / damping ratio、低 $K_i$ 响应、Nyquist 图、延迟或补偿器对最大稳定增益的影响、根轨迹分离点、稳定范围、连续振荡频率。 |
| 2024 | 反馈设计逻辑与框图、autopilot 功能框图、P 控制一阶系统 final response 和 steady-state error、二阶系统 poles/zeros、PD 控制的意义、根轨迹特征方程、极点零点、实轴区间、渐近线、分离点、Routh 稳定范围、robotic arm Bode 图、$K=20$ 对交越频率的影响。 |
| 2025 | 定性描述到功能框图和原理图、复杂框图闭环传递函数、四阶特征方程 Routh 稳定范围、积分控制闭环系统和响应曲线识别、零极点图、$\tau$ 对波形影响、传递函数 poles/zeros 与稳定性、根轨迹完整作图、虚轴穿越和稳定 $K$ 范围、Bode 图、GM/PM、开环增益与稳定性。 |

## 复习优先级建议

### 1. 必须会算

| 计算类知识点 | 最低要求 |
| --- | --- |
| 框图简化 | 能按规则移动求和点和分支点；能把多个局部反馈回路逐步化简成 $C(s)/R(s)$；中间步骤要写出来。 |
| 闭环传递函数与误差传递函数 | 对单位负反馈、P 控制、I 控制都能写出 $C(s)/R(s)$ 和 $E(s)/R(s)$；会用终值定理求 final response 和 steady-state error。 |
| Routh-Hurwitz | 会列三阶、四阶和含 $K$ 多项式的 Routh 表；会从第一列不等式得到稳定范围；会处理临界振荡的 $K$ 与 $\omega$。 |
| 根轨迹 | 会算 poles/zeros、实轴段、渐近线、centroid、breakaway point、imaginary-axis crossing；会用 Routh 或角度/幅值条件验证稳定范围。 |
| Bode 图 | 会化时间常数形式；会列每个因子的 corner frequency、gain、slope、phase；能手画 magnitude 和 phase 的渐近图。 |
| GM / PM | 会在给定 $\omega_{gc}$ 和 $\omega_{pc}$ 时计算 phase margin 和 gain margin；会用 dB 表示 gain margin。 |
| Poles / zeros / 二阶参数 | 会从传递函数读极点零点；会代入 $\omega_n$、$\zeta$；能用极点实部判断稳定性。 |

### 2. 必须会画和辨析

| 概念/画图类知识点 | 易错点 |
| --- | --- |
| 功能框图 | reference、controller、plant、sensor、feedback、disturbance 和 output 要分清；求和点正负号会直接影响闭环分母。 |
| 根轨迹草图 | 实轴段靠“右侧极点零点奇偶数”判断；breakaway 候选点必须落在有效实轴段上；渐近线数量是 $n-m$。 |
| Bode 图 | 常数增益只上下平移 magnitude；积分项从低频开始就是 -20 dB/dec；一阶极点/零点在 corner frequency 前后逐渐改变相位。 |
| Nyquist 图 | 稳定性关注 $(-1,j0)$；延迟主要增加相位滞后；开环右半平面极点数量 $P$ 不能忘。 |
| P / I / D | P 不能保证零稳态误差；I 消除误差但可能引起振荡；D 不适合单独使用，且容易放大噪声。 |
| 稳定裕度 | PM 在 gain crossover 处读，GM 在 phase crossover 处读；不要把两个交越频率混用。 |
| 响应曲线 | 响应快不等于更稳定；$K_i$ 变大可能让系统更快但超调更大；$\tau$ 变大通常更慢。 |

### 3. 特别注意的口径

| 口径 | 注意事项 |
| --- | --- |
| Routh 表第一列 | 稳定要求第一列同号，通常整理成全正；含 $K$ 时每个第一列元素都要给出不等式。 |
| 闭环特征方程 | 根轨迹和 Routh 题经常先让你从框图或开环传递函数写闭环特征方程；不要直接拿开环分母当闭环分母。 |
| 连续振荡 | “greatest $K$ before continuous oscillations” 通常就是虚轴穿越的临界 $K$；频率来自辅助多项式或令 $s=j\omega$。 |
| 时间常数形式 | 例如 $s+100$ 要写成 $100(1+s/100)$，常数要并入总增益；漏掉常数会导致 Bode 幅值整体错。 |
| $K$ 对 Bode 的影响 | 纯增益 $K$ 改变 magnitude，不改变 phase curve；但交越频率移动后，读到的 phase margin 会变。 |
| Integral control | 积分控制能消除 unit step 的 steady-state error，但不是“增益越大越好”；$K_i$ 大会降低阻尼并可能振荡。 |
| Derivative control | D 控制对误差变化率敏感，容易放大高频噪声；考试常问为什么实际中要和 P 组成 PD。 |
| 根轨迹方向 | 根轨迹从开环极点出发，走向开环零点或无穷远；箭头方向是 $K$ 从 0 增大到 $\infty$。 |

### 4. 常用作题干条件的

有些公式、框图或图像会直接出现在题干里。它们不是“不用学”，而是要求你能把题干条件匹配到正确模型并完成计算、画图或解释。

| 知识点 | 题干可能直接给出的内容 | 仍需自己掌握的部分 |
| --- | --- | --- |
| 框图简化 | 给完整框图和附录规则。 | 判断先化简哪个局部回路；移动求和点/分支点时补上 $G(s)$ 或 $1/G(s)$；写中间步骤。 |
| P/I 控制一阶系统 | 给一阶 plant、$K_p$ 或 $K_i$、unit step input。 | 写闭环传递函数、误差传递函数、终值定理；解释 steady-state error 和响应形状。 |
| Routh-Hurwitz | 给特征方程或含 $K$ 的分母多项式。 | 构造 Routh 表；由第一列符号变化判断稳定性；求稳定 $K$ 范围。 |
| 根轨迹 | 给开环传递函数、单位负反馈、可能给多项式根作为 hint。 | poles/zeros、real-axis segments、asymptotes、breakaway、imaginary-axis crossing 和稳定范围。 |
| Bode 图 | 给传递函数、系统增益、指定 $K$ 或指定 crossover frequency。 | 化时间常数形式；列 factor table；画 magnitude/phase；由 crossover 条件反求 $K$。 |
| Nyquist / 稳定裕度 | 给开环传递函数、延迟或补偿器、交越频率。 | 判断 $(-1,j0)$ 危险点；求最大稳定 $K$；计算 GM/PM 并解释稳定性。 |
| 场景框图 | 给 autopilot、robotic arm、motion control 等工程场景描述。 | 把 reference、controller、actuator、plant、sensor、feedback 和 disturbance 对应到场景实体。 |

## 课程复习索引

| Lecture | 对应高频考点 |
| --- | --- |
| [Lec.1 动态系统总览](../part.1/lec1.md) | 一阶/二阶系统、传递函数、响应特性、$\zeta$ 与 $\omega_n$。 |
| [Lec.2 控制系统分析基础](../part.1/lec2.md) | 开环/闭环、设计流程、功能框图、框图简化规则、反馈回路化简。 |
| [Lec.3 框图练习](../part.1/lec3.md) | 框图简化练习、叠加原理、复杂框图化简。 |
| [Lec.4 控制系统稳定性](../part.1/lec4.md) | 极点零点、特征方程、稳定性、Routh 稳定判据。 |
| [Lec.5 反馈控制系统性能与特性 - I](../part.1/lec5.md) | P/D/I 基本控制作用、P 控制闭环响应、PD 概念、稳态误差。 |
| [Lec.6 反馈控制系统性能与特性 - II](../part.1/lec6.md) | I、PI、PID 控制，一阶/二阶系统闭环传递函数，$K_i$、$K_p$、$K_d$ 对响应的影响。 |
| [Part.2 Lec.1 根轨迹分析 - I](../part.2/lec1.md) | 根轨迹基本规则、实轴段、渐近线、分离点、作图流程。 |
| [Part.2 Lec.2 根轨迹分析 - II & Nyquist](../part.2/lec2.md) | 根轨迹续、频率响应、Nyquist 图基础、延迟和相位直觉。 |
| [Part.2 Lec.3 伯德图 - I](../part.2/lec3.md) | Bode 图、时间常数形式、基本组件、幅值和相位叠加。 |
| [Part.2 Lec.4 伯德图 - II](../part.2/lec4.md) | Bode 例题、二阶共轭项、延迟、实验频率响应辨识。 |
| [Part.2 Lec.5 稳定性与稳定裕度 - I](../part.2/lec5.md) | Routh-Hurwitz 完整口径、频域稳定性、gain margin、phase margin。 |
| [Part.2 Lec.6 Nyquist 稳定判据](../part.2/lec6.md) | Nyquist 判据、Nyquist 裕度、临界增益、三种求失稳点的方法。 |
| [Part.2 Lec.7 补偿器设计](../part.2/lec7.md) | 控制器与补偿器、lead/lag/lead-lag、频域设计指标和稳定裕度改善。 |
