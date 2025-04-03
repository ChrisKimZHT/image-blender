# image-blender

制作点击后会变化的图片。

由于许多图片查看器预览图片使用**白色背景**，点击进入大图界面使用**黑色背景**，如此可以利用 PNG 的透明度通道实现点击后变化的效果。

### 使用技术

使用 react 框架，bootstrap 组件库，image-js 图片库。所有计算均在本地浏览器完成，保障图片隐私安全。

### 界面预览

![](./images/preview.png)

### 成品预览

| 无底预览（透明）         | 白底预览（表层）               | 黑底预览（里层）               |
| ------------------------ | ------------------------------ | ------------------------------ |
| ![](./images/result.png) | ![](./images/result_white.png) | ![](./images/result_black.png) |

测试样例图片来自 pixiv@真理-Mari (23908854)，所有权归属于原作者。本仓库 MIT 协议不包含该图片的相关权力。

### 原理

**问题描述**

表图片 $I^{\text{outer}}$ 与里图片 $I^{\text{inner}}$ 尺寸相同（本程序通过缩放完成），高宽分别为 $h,w$，本程序可通过两种方式将两图片进行混合，得到结果图片 $I^{\text{result}}$。同时，结果图片满足以下条件 $I^{\text{result}}$：
1. 在白色背景下，结果图片与表图片相近，即 $I^{\text{result}}+I^{\text{white}}\approx I^{\text{outer}}$.
2. 在黑色背景下，结果图片与里图片相近，即 $I^{\text{result}}+I^{\text{black}}\approx I^{\text{inner}}$.

**方法一：直接混合**

将图片记为颜色通道+透明度通道 $I=(C,\alpha)$，那么背景与图片的混合公式为：

$$
C=\alpha\cdot C^{\text{image}}+(1-\alpha)C^{\text{background}}
$$

那么可列出以下方程组：

$$
\begin{cases}
C^{\text{outer}}=\alpha\cdot C^{\text{result}}+(1-\alpha)C^{\text{white}}=\alpha\cdot C^{\text{result}}+1-\alpha\\
C^{\text{inner}}=\alpha\cdot C^{\text{result}}+(1-\alpha)C^{\text{black}}=\alpha\cdot C^{\text{result}}\\
\end{cases}
$$

解得：

$$
\begin{cases}
\displaystyle{\alpha=1-C^{\text{outer}}+C^{\text{inner}}}\\
\displaystyle{C^{\text{result}}=\frac{C^{\text{inner}}}{1-C^{\text{outer}}+C^{\text{inner}}}}
\end{cases}
$$

根据以上解混合图片即可。

**方法二：网格混合**

本方法结果图片为一个马赛克网格，每个像素交错为白色与黑色：

$$
C^{\text{result}}_{i,j}=
\begin{cases}
(0,0,0) & \text{if } (i+j)\bmod 2=0\\
(1,1,1) & \text{if } (i+j)\bmod 2=1\\
\end{cases}
$$

黑色像素负责表层图片的显示，白色像素负责里层图片的显示。图片的显示完全依赖透明度值：

$$
\alpha_{i,j}^{\text{result}}=
\begin{cases}
1-\alpha_{i,j}^{\text{outer}} & \text{if } (i+j)\bmod 2=0\\
\alpha_{i,j}^{\text{inner}} & \text{if } (i+j)\bmod 2=1\\
\end{cases}
$$

根据以上解混合图片即可。

此种方法，当使用白色背景时，白色像素被屏蔽，白色背景与黑色像素透明度混合显示表层图片；当使用黑色背景时，黑色像素被屏蔽，黑色背景与白色像素透明度混合显示里层图片。