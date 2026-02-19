# PostgreSQL 每日更新#54 2026-02-15







## **热门 Hacker 邮件讨论精选**

### **[中断 vs 信号](https://www.postgresql.org/message-id/be6nxpkifw7kud4qxax4rzcfstg6r2uiynyugeu7jmxmbluy7b@4tnuf2khtmis)**
Andres Freund对Heikki Linnakangas的大规模中断系统重构补丁提供了详细反馈。该补丁将PostgreSQL基于信号的中断处理替换为新的64位中断掩码系统，允许对不同中断类型（配置重载、查询取消、关闭等）进行更精细的控制。Andres提出了几个技术问题：64位原子操作在某些平台上可能不是信号安全的，因为可能使用自旋锁模拟，建议改为拆分成两个32位字。他质疑一些信号处理程序替换的安全性，并建议将超时处理程序改为使用新的中断系统。对新的CHECK_FOR_INTERRUPTS()实现的性能表示担忧，建议将中断变量合并到单个结构体中。Andres还建议让中断屏蔽更加基于堆栈，而不是仅使用保持/恢复计数器。识别出各种代码审查问题，包括中断处理程序中的潜在重入问题、低效的位操作循环和缺少的断言。审查涵盖了代码库中从基于信号到基于中断机制的广泛转换。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, masao.fujii@gmail.com, michael@paquier.xyz, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[使用 SIMD 加速 COPY TO 文本/CSV 解析](https://www.postgresql.org/message-id/CA+K2Rum_QTZqTUrdMOL5hr-OOpCwGR_9Nj1z15BFObjktMOY6A@mail.gmail.com)**
KAZAR Ayoub正在为PostgreSQL的COPY TO文本/CSV解析开发SIMD优化补丁。Andres Freund担心添加strlen()调用会带来性能开销，特别是对于具有多个属性的短列。Ayoub回应了基准测试结果，显示该优化将每个属性的strlen()调用减少到最多两次，但在最坏情况下会造成显著的性能回归：在测试包含100-1000个整数列的表时，TEXT格式回归17%，CSV格式回归3%。Andres还建议在引入SIMD优化之前，先将现有代码重构为静态内联辅助函数。Ayoub实现了这个建议，但对放置位置以及性能权衡是否可接受表示不确定。

参与者:
andres@anarazel.de, andrew@dunslane.net, byavuz81@gmail.com, ma_kazar@esi.dz, manni.wood@enterprisedb.com, markwkm@gmail.com, nathandbossart@gmail.com, neil.conway@gmail.com, shinya11.kato@gmail.com



