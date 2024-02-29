# image-blender

制作点击后会变化的图片

#### 界面预览

![](https://assets.zouht.com/img/md/image-blender-README-01.jpg)

#### 成品预览

<img src="https://assets.zouht.com/img/md/image-blender-README-02.gif" style="height:40vh;" />

#### 原理

不妨设表图片 $A$ 与里图片 $B$ 尺寸相同，长宽分别为 $a,b$，首先需要将 $A,B$ 转换为灰度图 $A',B'$ ，接下来按照以下公式混合得到结果：

$$
C_{i,j}=
\begin{cases}
(0,0,0,255-A_{i,j}'),\;\text{if}\;(i+j)\bmod2=0\\
(255,255,255,B_{i,j}'),\;\text{other}
\end{cases}
$$

注意，结果 $C$ 是一个四通道 $RGBA$ 的图片，其中透明度通道 $A$ 至关重要，因此一定要保证图片为 `png` 格式。

通过上面的构造方式构造得到图片 $C$，在白色背景时，白色通道会溢出导致只能看到表图片（即里图片溢出）；在黑色背景时，黑色通道会溢出导致只能看到里图片（即表图片溢出）。

由于许多程序设计时，预览图片使用白色背景，点击进入大图界面使用黑色背景，如此实现了图片的切换。

#### 使用技术

使用 react 框架，bootstrap 组件库，image-js 图片库。

