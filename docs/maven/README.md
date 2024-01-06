---
title: maven
sidebar: 'auto'
---

## Mac 安装 Maven

### 第一步，下载安装包

<https://archive.apache.org/dist/maven/maven-3/>  
这里我们下载的是 3.6.3 版本的

![maven1](./images/maven1.png)

### 第二步，解压文件夹

![maven2](./images/maven2.png)

```bash
tar -zxvf apache-maven-3.6.3-bin.tar.gz
```

### 第三步，编辑 setting 文件添加国内镜像

![maven3](./images/maven3.png)

```xml
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

### 第四步，配置环境变量

![maven4](./images/maven4.png)

```bash
export MAVEN_HOME=/Users/wangfugui/tool/apache-maven-3.6.3
export PATH=$PATH:$MAVEN_HOME/bin
```

### 第五步，刷新配置文件

```bash
source ~/.bash_profile
```

最后输入 mvn -v 查看 Maven 是否安装成功

![maven5](./images/maven5.png)

### 第六步，idea 配置 maven

![maven6](./images/maven6.png)

![maven7](./images/maven7.png)

完成！

## window 下安装 maven

其余步骤同上

### 配置环境变量

右键“计算机”，选择“属性”，之后点击“高级系统设置”，点击“环境变量”，来设置环境变量，有以下系统变量需要配置：

新建系统变量 MAVEN_HOME 变量值：E:\Maven\apache-maven-3.3.9

编辑系统变量 Path 添加变量值： ;%MAVEN_HOME%\bin

![maven8](./images/maven8.png)

![maven9](./images/maven9.png)

注意：注意多个值之间需要有分号隔开，然后点击确定。
