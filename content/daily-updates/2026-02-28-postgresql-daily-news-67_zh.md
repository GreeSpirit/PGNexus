# PostgreSQL 每日更新#67 2026-02-28







## **热门 Hacker 邮件讨论精选**

### **[索引预取](https://www.postgresql.org/message-id/issqornf6vdn3vb64fjuoathypmu3e5pgputd3lpfuvoeqyvzr@qfordnhplp2v)**
讨论围绕Peter Geoghegan的v11索引预取补丁的性能问题展开。Andres Freund报告了反直觉的基准测试结果，填充因子较低（需要扫描更多堆页）的查询实际上比填充因子较高的查询执行得更快，这表明用于保持扫描响应性的yielding机制存在问题。当禁用yielding时，性能恢复到预期状态。

Peter确认可以重现该问题，并发现yielding可能不值得增加复杂性，因为它只在特定情况（如合并连接）下有帮助。他观察到即使在master分支上，在特定shared_buffers配置下问题仍然存在，可能与设备级预读交互有关。Alexandre Felipe在不同平台上分享了混合基准测试结果，显示预取有效但可能会拖慢某些操作，特别是在macOS上。Tomas Vondra质疑测试方法，建议使用标准分析工具而不是自定义instrumentation。

Andres对补丁系列进行了详细代码审查，发现了伪LSN基础设施、缓冲区管理方面的问题，并质疑yielding机制是否提供足够的好处来证明其复杂性。主要关注点包括yielding逻辑过于简单，可能阻止适当的IO并发。审查建议将大的更改拆分成更小、更易管理的提交，并解决内存排序、可见性检查和缓冲区pin管理等各种技术问题。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[pg\_plan\_advice 查询计划建议](https://www.postgresql.org/message-id/CA+TgmoYru-vxoTKfwjQby30r2OkTXfb18Km_=VLs6qk8Akr0-g@mail.gmail.com)**
Robert Haas发布了pg_plan_advice补丁的第18版，进行了重大架构调整。主要修改是将收集器接口拆分为名为pg_collect_advice的独立扩展，使核心pg_plan_advice功能保持独立。新增了第三个contrib模块pg_stash_advice，它创建query_id到advice_string的哈希表，用于在查询规划期间应用建议。这展示了基础设施的可插拔特性，允许除query ID匹配之外的自定义建议应用方法。补丁还包含大量小的清理工作、错误修复、注释改进和小的代码修正。模块化方法在核心建议功能和可选收集功能之间提供了更好的概念分离。

参与者:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[修复multixact Oldest\*MXactId初始化和访问中的bug](https://www.postgresql.org/message-id/3d7a2207-0e61-4d95-bc00-e5248956a32b@postgrespro.ru)**
讨论集中在修复multixact中Oldest*MXactId初始化和数组访问的bug。Yura Sokolov强烈主张添加更多断言来防止数组边界问题，声明适当的断言本可以在测试期间捕获此bug。Chao Li审查了Yura的技术解决方案，该方案涉及为预准备事务槽使用单独函数，赞扬了从procno计算中移除NUM_AUXILIARY_PROCS的巧妙方法，但建议使用更好的变量命名。Heikki Linnakangas提出了一个替代实现，使用FIRST_PREPARED_XACT_PROC_NUMBER而不是多个变量，以及返回槽指针的getter/setter函数。他指出此bug可能导致预准备事务覆盖OldestVisibleMXactId数组中的后端值。Sami Imseih提供了一个重现案例，显示两个预准备事务绕过了预期的阻塞行为，展示了从读取垃圾数组值导致错误可见性判断的实际影响。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, samimseih@gmail.com, y.sokolov@postgrespro.ru

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAA4eK1JrqoPvrFxZEO2rB=-jXK1BQdJZz2_2oeZqCQR3GRWC2g@mail.gmail.com)**
讨论集中在一个PostgreSQL补丁上，该补丁为发布添加EXCEPT子句支持，允许从FOR ALL TABLES发布中排除特定表。Amit Kapila建议通过为包含和排除的关系创建单独的包装函数来简化API，并建议从第一个补丁开始维护单独的异常列表以提高代码清晰度。他还要求添加注释解释测试中为什么需要slot_advance。

Vignesh在v51中解决了大部分反馈，指出puballtables参数对于两种表类型使用的通用函数是必要的。Nisha Moond识别出几个问题：一个测试错误，其中两次执行都错误地使用相同的publish_via_partition_root值，CREATE和ALTER PUBLICATION命令之间的语法不一致，以及文档格式问题。

更关键的是，Nisha发现了分区和继承行为不一致。当分区被分离时，复制不会在没有REFRESH PUBLICATION的情况下自动恢复。对于继承表，移除继承不会正确更新EXCEPT列表，SET EXCEPT TABLE操作不会一致地影响子表复制。这些行为问题可能需要文档或代码修复来确保表层次结构中可预测的复制行为。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[使用 rdtsc 降低 EXPLAIN ANALYZE 的时序开销？](https://www.postgresql.org/message-id/CANWCAZYPGKA1ZrA27sEcDu=A0HaCpiGY4w5ro476F9vmKHcUuQ@mail.gmail.com)**
John Naylor回应了Andres Freund关于他的运行时检查集中化工作与Lukas Fittl的v9补丁（使用rdtsc减少EXPLAIN ANALYZE计时开销）之间潜在冲突的询问。Naylor确认他已经推送了集中化工作的主要部分，这确实与补丁存在冲突，但可以轻松修复，因为它减少了0001 cpuidex补丁中需要更改的地方数量。他表示他的其他补丁应该不会冲突，并计划如果测试顺利的话第二天推送。Naylor提出帮助处理其他讨论的事项，表明在相关性能优化功能上工作的开发者之间的协作配合。

参与者:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, johncnaylorls@gmail.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com



## **行业新闻**

### **[AI music generator Suno达到200万付费订户和3亿美元年度经常性收入](https://techcrunch.com/2026/02/27/ai-music-generator-suno-hits-2-million-paid-subscribers-and-300m-in-annual-recurring-revenue)**
AI音乐生成器Suno已取得显著的商业成功，达到200万付费订阅用户，年度经常性收入达到3亿美元。Suno的平台使用户能够使用自然语言提示创作音乐，使音乐生成对于缺乏音乐经验或技术专长的人来说变得可及。这一里程碑表明了对AI驱动的创意工具日益增长的市场需求以及生成式AI应用的变现潜力。Suno的成功说明了AI如何使创意过程民主化，允许用户以最少的努力和专业知识制作专业质量的音乐内容。

### **[ChatGPT 周活跃用户达9亿](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users)**
OpenAI宣布ChatGPT的每周活跃用户数已达到9亿，这是AI采用的一个重要里程碑。该公告与OpenAI披露筹集1100亿美元私人资金的消息同时发布，这是历史上最大的融资轮次之一。新资金包括来自Amazon的500亿美元以及来自Nvidia和SoftBank各300亿美元，公司估值达到7300亿美元。这种大规模的用户增长和资金支持表明了OpenAI在AI市场的主导地位，并反映了AI工具在各个领域的广泛采用。

### **[OpenAI 在历史上最大的私募融资轮次之一中融资1100亿美元](https://techcrunch.com/2026/02/27/openai-raises-110b-in-one-of-the-largest-private-funding-rounds-in-history)**
OpenAI已获得1100亿美元的资金，这是历史上最大的私人融资轮次之一。投资包括来自Amazon的500亿美元，Nvidia和SoftBank各贡献300亿美元。此次融资使OpenAI的估值达到7300亿美元，巩固了其作为全球最有价值私人公司之一的地位。这笔巨额投资反映了投资者对OpenAI的AI技术和市场领导地位的信心，特别是在宣布ChatGPT每周活跃用户达到9亿之后。这笔资金可能会加速OpenAI的研发工作和扩张计划。