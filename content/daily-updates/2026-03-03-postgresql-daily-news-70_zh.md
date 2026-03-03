# PostgreSQL 每日更新#70 2026-03-03







## **热门 Hacker 邮件讨论精选**

### **[消除 xl\_heap\_visible 以减少 WAL（并最终在访问时设置 VM）](https://www.postgresql.org/message-id/CAAKRu_Y1MuANdm1p47Ev13Y9EQz8z+pw-vHOh=3DVdahUTjgXg@mail.gmail.com)**
Melanie Plageman发布了她的补丁系列第35版，回应了Andres Freund关于消除xl_heap_visible WAL记录并最终支持访问时设置可见性映射的反馈。主要变更包括在heap_page_prune_opt()中总是固定vmbuffer，即使不设置VM也检查VM损坏。该系列现在将损坏检查移到heap_page_prune_and_freeze()的开头，并为RECENTLY_DEAD和INSERT_IN_PROGRESS等其他元组状态添加检测。新的快速路径在页面已经全可见时绕过修剪/冻结，但这可能会错过冻结页面上有死元组的损坏情况。补丁重构了冻结边界跟踪以一致地维护所有边界，解决了Andres关于容易出错的优化的担忧。其他改进包括重命名令人困惑的PruneState字段、为组合冻结/VM操作正确处理冲突XID，以及在执行器状态中跟踪修改关系的基础设施，以支持未来的访问时VM设置而无需昂贵的冻结操作。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, melanieplageman@gmail.com, reshkekirill@gmail.com, robertmhaas@gmail.com, x4mmm@yandex-team.ru, xunengzhou@gmail.com

### **[pg\_plan\_advice 查询计划建议](https://www.postgresql.org/message-id/CAKFQuwYu+30BK9-7zwSR1TBdcFBY1BDezgcXtusm2VHWvrOrRA@mail.gmail.com)**
David G. Johnston正在为第18版的pg_plan_advice功能提供详细的文档审查反馈。他的审查重点是提高README和SGML文档之间的一致性，特别是在连接策略建议标签和分区描述方面。他建议将模块重命名为pg_advice_{plan,collect,stash}以便更好地排序，并提议在整个文档中使用"entries"术语以保持简洁。Johnston建议pg_set_stashed_advice返回有意义的状态代码而不是void，并建议为NULL query_id和stash_name输入添加错误处理。他还提议为建议字符串添加注释功能，并添加导出/导入函数以提高可用性，考虑到存储内容的易失性。

参与者:
alexandra.wang.oss@gmail.com, david.g.johnston@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Solaris 支持现代化的领域](https://www.postgresql.org/message-id/470305.1772417108@sss.pgh.pa.us)**
Tom Lane在使用运行OpenIndiana/Illumos的icarus buildfarm成员时发现了PostgreSQL的Solaris支持问题。主要问题是在并行测试执行期间由于SEMMNI/SEMMNS限制不足导致信号量创建失败。Lane提议切换到未命名POSIX信号量，这在最新的OpenIndiana上运行可靠，类似于最近的AIX更改。他还发现ps_status.c没有为子进程显示正确的进程标题，最初将此归因于在提交d2ea2d310中删除的代码。Lane创建了一个补丁，为Solaris恢复PS_USE_CHANGE_ARGV功能，使用__sun宏进行检测。Greg Burd同意在icarus上测试这些补丁。但是，Lane后来发现在更新到当前的OpenIndiana后，ps_status问题在没有补丁的情况下自行解决了，这表明这可能是ps命令中的临时错误，而不是PostgreSQL问题。

参与者:
greg@burd.me, tgl@sss.pgh.pa.us, thomas.munro@gmail.com

### **[索引预取](https://www.postgresql.org/message-id/CAE8JnxOJ48NU3rwW+gS67NUDKgxDS5pKNUywbUBGCBJkgUf+Hg@mail.gmail.com)**
讨论集中在改进PostgreSQL的index prefetching功能，特别是解决距离调整算法问题。Alexandre Felipe提议创建一个自平衡机制，根据I/O时序和缓冲区消耗模式动态调整预取距离。他建议摒弃指数距离增长，改用基于I/O并发限制的增量调整，并提出了时间无关和时间感知的模型来更好地优化预取。

Tomas Vondra对硬件测试设置提供反馈，解释了当前距离启发式算法的局限性，指出补丁已经太大，无法在当前周期进行重大更改。他澄清距离决定的是前瞻范围而非并发I/O数量，后者由effective_io_concurrency限制。

Andres Freund针对距离振荡问题提出实用解决方案，建议修改增减逻辑，采用最小距离阈值和冷却计数器。然而，他通过基准测试证明维持更高的最小距离会因增加缓冲区查找和固定开销而对完全缓存的工作负载造成性能损失。他提出了潜在优化方案，包括扩展REFCOUNT_ARRAY_ENTRIES和用simplehash替换dynahash来减少性能悬崖。

关键的未解决问题仍然是在缓存场景中平衡预取效果与开销。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[\[PATCH\] psql: ALTER ROLE \.\.\. IN DATABASE \.\.\. 的制表符补全](https://www.postgresql.org/message-id/202603021705.hurfwmxfd6l4@alvherre.pgsql)**
Álvaro Herrera已推送了一个用于psql中ALTER ROLE ... IN DATABASE命令的tab补全补丁，但排除了RESET补全功能，因为它还没准备好。推送的版本删除了看似由LLM生成代码中不必要的注释和括号。被拒绝的RESET补全试图查询pg_db_role_setting来建议参数名，但存在几个问题：对于自动生成代码部分来说过于复杂，函数调用缺少适当的schema限定，使用了不合适的内存管理函数，并且在存在多个匹配参数时行为异常。Herrera建议要么创建一个单独的函数，要么增强补全系统以正确处理这种复杂性。

参与者:
alvherre@kurilemu.de, barwick@gmail.com, dharinshah95@gmail.com, robertmhaas@gmail.com, suryapoondla4@gmail.com, tgl@sss.pgh.pa.us, vasukianand0119@gmail.com, zengman@halodbtech.com

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAJpy0uCr15=dxg+bmGeJUoNfKOHU2xZd2Wa6hg=YNTnQzz2fcA@mail.gmail.com)**
PostgreSQL 发布的 EXCEPT TABLE 子句补丁正在进行代码审查。多名贡献者审查了第53版。Shveta Malik发现了几个问题，包括序列处理可能触发断言的问题、get_rel_sync_entry()中不必要的代码重复以及未使用的函数。Amit Kapila发现了错误消息引号模式的问题，并质疑为什么要为所有祖先收集例外发布ID而不是仅为根表收集。Nisha Moond测试了分区和继承行为，发现分离的分区和继承变更需要手动REFRESH PUBLICATION命令，这可能需要文档澄清。团队讨论了语法决策，确认EXCEPT后的TABLE关键字和括号都是强制性的，以便未来扩展。Shlok Kyal处理了反馈并发布了修复所识别问题的第54版。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[ANALYZE期间可选跳过未更改的关系？](https://www.postgresql.org/message-id/CAE2r8H7hYGYi4QM85Q7bxs4RbT0Vn63c9ONFbwhAjuSGDzah_A@mail.gmail.com)**
Vasuki M根据Robert、Sami和Ilia的详细反馈修订了一个用于在ANALYZE期间可选跳过未更改关系的补丁。补丁现在分离了两个不同的用例：MISSING_STATS_ONLY（目录驱动，持久性）和MODIFIED_STATS（基于阈值，瞬态）。主要改进包括通过将缺失统计信息检查直接集成到函数中来消除重复的examine_attribute()调用，扩展测试覆盖范围，以及改进日志行为以匹配现有的ANALYZE语义。MISSING_STATS_ONLY功能现在执行每属性的pg_statistic查找并跳过具有现有统计信息的列。已创建一个单独的CommitFest条目，MODIFIED_STATS将作为单独的补丁和讨论线程处理。

参与者:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com



## **行业新闻**

### **[Anthropic 的 Claude 报告大范围中断](https://techcrunch.com/2026/03/02/anthropics-claude-reports-widespread-outage?utm_campaign=daily_pm)**
Anthropic的AI聊天机器人Claude在周一上午经历了广泛的服务中断，数千用户报告了访问平台的问题。此次故障影响了用户与AI助手交互的能力，突显了AI服务提供商面临的运营挑战，因为这些平台对日常工作流程变得越来越重要。这一事件强调了AI服务可靠基础设施的重要性，数百万用户依赖这些服务完成各种任务。

### **[MyFitnessPal 收购了由青少年开发的病毒式卡路里应用 Cal AI](https://techcrunch.com/2026/03/02/myfitnesspal-has-acquired-cal-ai-the-viral-calorie-app-built-by-teens?utm_campaign=daily_pm)**
MyFitnessPal已成功收购Cal AI，这是一款由青少年开发的病毒式卡路里追踪应用程序，在应用商店中获得了显著关注。在追求Cal AI数月后，MyFitnessPal完成了对这一新兴竞争对手的收购。这笔交易代表了MyFitnessPal的战略举措，旨在整合创新的AI驱动功能，并吸引倾向于Cal AI营养追踪和健康管理方法的年轻用户群体。

### **[用户正在放弃ChatGPT转向Claude — 以下是如何切换的方法](https://techcrunch.com/2026/03/02/users-are-ditching-chatgpt-for-claude-heres-how-to-make-the-switch?utm_campaign=daily_pm)**
在ChatGPT面临争议后，许多用户正在转向Anthropic的Claude AI聊天机器人作为替代方案。文章提供了用户如何从ChatGPT过渡到Claude的指导，解释了两个AI平台之间的流程和差异。这一转变代表了AI聊天机器人市场的重大变化，因为用户在对ChatGPT的性能和政策持续担忧中寻求替代方案。