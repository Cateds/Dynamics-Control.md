---
title: 反馈控制系统性能与特性 - II
description: TODO
---

> Title: **Characteristics and Performance of Feedback Control Systems - II**
>
> Lecture @ 2026-4-14

![neuro-firework](../../../assets/neuro-firework.jpg)

## 闭环控制

### PD

> 上接 [Lec.5](./lec5.md#pd)

类似的，把 PD 反馈接入之前提到的二阶系统，则有

![2-order pd](./lec6.assets/image.png)

最终得到的输出如下

![2-order pd plot](./lec6.assets/image-1.png)

这里有

$$
s^2 + 2 \zeta_{cl} \omega_{n,cl}^2 = 0
$$

传递函数是

$$
c(t) = \frac{K_p}{K_p + 1}\left[
    1 - \exp{-\zeta_{cl} \omega_{n,cl} t} \left(
      \cos\omega_{d,cl} t + \frac{
        K_p\zeta_{cl} - K_d \omega_{n,cl}
      }{
        K_p \sqrt{1-\zeta_{cl}^2}
      }\sin \omega_{d,cl} t
    \right)
  \right]
$$

其中有

$$
\begin{aligned}
  \omega_{n,cl} &= \omega_n \sqrt{K_p + 1} \\
  \zeta_{cl} &= \frac{\zeta + \frac{1}{2}K_d \omega_n}{\sqrt{K_p + 1}}
\end{aligned}
$$

<details>
<summary> 做不完的题 </summary>

![exer-pd](./lec6.assets/image-2.png)

<details>
<summary> 大概是答案 </summary>

</details>
</details>

### I

> [!NOTE]
>
> WORK IN PROGRESS

### PI

### PID
