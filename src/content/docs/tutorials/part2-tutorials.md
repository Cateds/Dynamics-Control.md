---
title: Part 2 Tutorials：Nyquist、Bode 与稳定性
description: Tutorial and test exercise material for root locus, Nyquist, Bode plots, and stability margins.
---

# Part 2 Tutorials：Nyquist、Bode 与稳定性

> 题源：`slides/raw/part2/Lecture slides (V-VIII)-20260617/Lecture 8 - Tutorials.pdf` 和 `Lecture 9 - Test Exercise.pdf`。
>
> 这一页只整理 tutorial/test exercise 源文件，不抽正课 lecture note 里的题目。

## Lecture 8 Worked Examples

Lecture 8 的 tutorial slides 主要围绕 Nyquist 图、Bode 图、稳定裕度和临界增益。截图保留整页，因为这些题大量依赖图形位置、负实轴交点和曲线标注。

### Worked Example 1：Nyquist 图与增益变化

![Lecture 8 worked example 1 question](./part2-tutorials.assets/page-02.png)

<details>
<summary>展示题解页</summary>

![Lecture 8 worked example 1 solution](./part2-tutorials.assets/page-03.png)

这题的核心结论是：原 Nyquist 轨迹在负实轴约 `-0.3` 处穿过，不包围 `-1`，闭环稳定；如果幅值增加 `20 dB`，也就是线性增益乘以 `10`，穿越点从 `-0.3` 变成 `-3`，轨迹会包围 `-1`，闭环变不稳定。

</details>

### Worked Example 2：Nyquist、Phase Margin 与 Bode 图

![Lecture 8 worked example 2 question](./part2-tutorials.assets/page-04.png)

<details>
<summary>展示题解页</summary>

![Lecture 8 worked example 2 solution 1](./part2-tutorials.assets/page-05.png)

![Lecture 8 worked example 2 solution 2](./part2-tutorials.assets/page-06.png)

![Lecture 8 worked example 2 solution 3](./part2-tutorials.assets/page-07.png)

![Lecture 8 worked example 2 solution 4](./part2-tutorials.assets/page-08.png)

![Lecture 8 worked example 2 solution 5](./part2-tutorials.assets/page-09.png)

![Lecture 8 worked example 2 solution 6](./part2-tutorials.assets/page-10.png)

这题练的是从传递函数直接走完整个频域分析流程：先代入 $s=j\omega$，再看 Nyquist 极限、相位裕度，最后转成 Bode 图。题中没有要求 gain margin，是因为相位不穿越 $-180^\circ$ 时，常规意义下的 gain margin 没有可读交点。

</details>

### Worked Example 3：Bode 图与频率响应复习

![Lecture 8 worked example 3 question](./part2-tutorials.assets/page-11.png)

<details>
<summary>展示题解页</summary>

![Lecture 8 worked example 3 solution 1](./part2-tutorials.assets/page-12.png)

![Lecture 8 worked example 3 solution 2](./part2-tutorials.assets/page-13.png)

![Lecture 8 worked example 3 solution 3](./part2-tutorials.assets/page-14.png)

</details>

### Worked Example 4：负实轴交点与 Gain Margin

![Lecture 8 worked example 4 question](./part2-tutorials.assets/page-15.png)

<details>
<summary>展示题解页</summary>

![Lecture 8 worked example 4 solution 1](./part2-tutorials.assets/page-16.png)

![Lecture 8 worked example 4 solution 2](./part2-tutorials.assets/page-17.png)

![Lecture 8 worked example 4 solution 3](./part2-tutorials.assets/page-18.png)

题解最后得到 gain margin 为

$$
GM=\frac{1}{\lambda}=16
$$

也就是先找 Nyquist 轨迹穿过负实轴的位置，再取该点幅值的倒数。

</details>

### Worked Example 5：Nyquist 手画通用流程

![Lecture 8 worked example 5 question](./part2-tutorials.assets/page-19.png)

<details>
<summary>展示题解页</summary>

![Lecture 8 worked example 5 solution 1](./part2-tutorials.assets/page-20.png)

![Lecture 8 worked example 5 solution 2](./part2-tutorials.assets/page-21.png)

![Lecture 8 worked example 5 solution 3](./part2-tutorials.assets/page-22.png)

![Lecture 8 worked example 5 solution 4](./part2-tutorials.assets/page-23.png)

这题顺便总结了 Nyquist 手画流程：

1. 代入 $s=j\omega$。
2. 拆出实部、虚部、幅值和相位。
3. 看 $\omega\to0$ 或原点极点附近的极限。
4. 看 $\omega\to\infty$ 的极限。
5. 在 corner frequencies 处补关键点。

</details>

### Worked Example 6

<details>
<summary>展示题目与题解页</summary>

![Lecture 8 worked example 6 question](./part2-tutorials.assets/page-24.png)

![Lecture 8 worked example 6 solution](./part2-tutorials.assets/page-25.png)

</details>

### Worked Example 7：指定 Gain Margin 反求参数

<details>
<summary>展示题目与题解页</summary>

![Lecture 8 worked example 7 question 1](./part2-tutorials.assets/page-26.png)

![Lecture 8 worked example 7 solution 1](./part2-tutorials.assets/page-27.png)

![Lecture 8 worked example 7 solution 2](./part2-tutorials.assets/page-28.png)

![Lecture 8 worked example 7 question 2](./part2-tutorials.assets/page-29.png)

![Lecture 8 worked example 7 solution 3](./part2-tutorials.assets/page-30.png)

![Lecture 8 worked example 7 solution 4](./part2-tutorials.assets/page-31.png)

![Lecture 8 worked example 7 solution 5](./part2-tutorials.assets/page-32.png)

题解思路是：如果要求 gain margin 为 `12 dB`，先把它转成线性倍数 `3.98`，再根据 `phase = -180°` 的频率找到该点幅值，由 gain margin 定义反推参数。

</details>

## Lecture 9 Test Exercise

Lecture 9 的 test exercise 给出了一道综合题，把 root locus、Bode plot 和 Nyquist criterion 串在一起。

![Lecture 9 title page](./part2-tutorials.assets/test-page-1.png)

![Lecture 9 overview](./part2-tutorials.assets/test-page-2.png)

![Lecture 9 tutorial instruction](./part2-tutorials.assets/test-page-3.png)

### 综合题

![Lecture 9 test exercise question](./part2-tutorials.assets/test-page-4.png)

<details>
<summary>展示提示页</summary>

![Lecture 9 root locus hints](./part2-tutorials.assets/test-page-5.png)

![Lecture 9 bode plot hints](./part2-tutorials.assets/test-page-6.png)

![Lecture 9 Nyquist hints](./part2-tutorials.assets/test-page-7.png)

这道题可以按三个视角做同一个稳定性问题：

1. Root locus：画极点、渐近线、重心和分离点，找 marginally stable 的 $K$。
2. Bode plot：写成时间常数形式，画幅值和相位渐近线。
3. Nyquist criterion：代入 $s=j\omega$，令虚部为零找负实轴交点，再由 $|G(j\omega_c)|<1$ 得到稳定范围。

</details>
