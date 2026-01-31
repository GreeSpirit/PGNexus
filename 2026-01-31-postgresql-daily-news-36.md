---
layout: post
title: PostgreSQL Daily News 2026-01-31
---

# PostgreSQL Daily News#36 2026-01-31



## **PostgreSQL Articles - PostgreSQL 技术博客**

### **[10 Elasticsearch Production Issues (and How Postgres Avoids Them)](https://www.tigerdata.com/blog/10-elasticsearch-production-issues-how-postgres-avoids-them)**
This blog post compares 10 common Elasticsearch production issues with PostgreSQL's approach to search. The author argues that Elasticsearch's distributed architecture creates operational complexity that PostgreSQL avoids through its simpler design. Key issues include JVM garbage collection pauses that can cause node failures, mapping explosion from automatic schema detection, challenging shard sizing decisions, deep pagination performance problems, split-brain scenarios causing data loss, eventual consistency delays, security misconfigurations, complex monitoring requirements, data synchronization pipeline failures, and high infrastructure costs. The author suggests PostgreSQL with extensions like pg_textsearch for BM25 ranking and pgvector for vector search can provide similar capabilities without the operational overhead, positioning this as a "keep search in Postgres" alternative for many use cases.

这篇博客文章比较了10个常见的Elasticsearch生产环境问题与PostgreSQL搜索方法的差异。作者认为Elasticsearch的分布式架构带来了PostgreSQL通过其更简单设计可以避免的运维复杂性。主要问题包括：JVM垃圾收集暂停可能导致节点故障、自动模式检测导致的映射爆炸、分片大小决策的挑战、深度分页性能问题、导致数据丢失的脑裂场景、最终一致性延迟、安全配置错误、复杂的监控需求、数据同步管道故障以及高昂的基础设施成本。作者建议PostgreSQL配合pg_textsearch进行BM25排名和pgvector进行向量搜索等扩展，可以提供类似功能而无需运维开销，将此定位为许多用例的"在Postgres中保留搜索"替代方案。

`Raja Rao DV`



## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/CALdSSPgdBeyQpQ+Q3GebN=QL00RYH7HCbSWR+KDs=dvj-fNYpQ@mail.gmail.com)**
The discussion focuses on fixing a failing regression test in a patch to eliminate xl_heap_visible WAL records. Kirill Reshke identified that the test fails due to autovacuum interference: autovacuum runs on catalog relations and acquires an XID before the test's INSERT operation, causing the subsequent VACUUM FREEZE to compute a cutoff XID that prevents tuple freezing. Disabling autovacuum on the test table doesn't help because autovacuum still runs on catalog relations. Three solutions are proposed: converting the regression test to a TAP test where autovacuum can be better controlled, using injection points to disable autovacuum workers during the test, or making the test table temporary as suggested by Andres. Andrey Borodin supports converting to TAP for stability but notes issues with Kirill's proof-of-concept patch including typos, missing comments, and potential problems with buildfarm animals lacking injection points. Melanie Plageman suggests trying the temporary table approach first.

讨论集中在修复一个消除xl_heap_visible WAL记录补丁中失败的回归测试。Kirill Reshke识别出测试失败是由于autovacuum干扰：autovacuum在目录关系上运行并在测试的INSERT操作之前获取XID，导致后续的VACUUM FREEZE计算的截断XID阻止了元组冻结。在测试表上禁用autovacuum无效，因为autovacuum仍会在目录关系上运行。提出了三个解决方案：将回归测试转换为可以更好控制autovacuum的TAP测试，使用注入点在测试期间禁用autovacuum工作进程，或者按照Andres的建议将测试表设为临时表。Andrey Borodin支持转换为TAP以提高稳定性，但指出Kirill的概念验证补丁存在问题，包括拼写错误、缺少注释以及缺乏注入点的构建农场动物的潜在问题。Melanie Plageman建议首先尝试临时表方法。

Participants - 参与者:
* andres@anarazel.de
* exclusion@gmail.com
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* x4mmm@yandex-team.ru
* xunengzhou@gmail.com

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAOYmi+mXccgHiWppypxYgxHNr+Qs+1VJ+UEPJAHQHgj2U38NPw@mail.gmail.com)**
Jacob Champion is working on protocol version 3.2 documentation, addressing feedback from Jelte Fennema-Nio about table formatting and structure. Key discussion points include whether to split protocol extension tables for visual clarity, with Champion initially preferring a combined approach but providing a split version (v6-0004) after feedback. They're debating inclusion of `_pq_.` prefixes in parameter names for namespace clarity and discussing randomization features for protocol negotiation testing. Champion likes Jelte's randomization implementation but wants broader maintainer input before committing production features like `max_protocol_version=grease`. David Johnston weighs in supporting the split table approach, suggesting the reserved parameters might not need a table format at all. The discussion involves technical details about duplicate key handling in NegotiateProtocolVersion and documentation organization for better navigation and linking.

Jacob Champion正在处理协议版本3.2文档，回应Jelte Fennema-Nio关于表格格式和结构的反馈。主要讨论点包括是否分离协议扩展表格以提高视觉清晰度，Champion最初偏好合并方式但在反馈后提供了分离版本(v6-0004)。他们正在讨论在参数名称中包含`_pq_.`前缀以明确命名空间，以及讨论协议协商测试的随机化功能。Champion喜欢Jelte的随机化实现，但希望在提交如`max_protocol_version=grease`等生产功能前获得更广泛的维护者意见。David Johnston支持分离表格方法，建议保留参数可能根本不需要表格格式。讨论涉及NegotiateProtocolVersion中重复键处理的技术细节，以及为更好导航和链接而进行的文档组织。

Participants - 参与者:
* andres@anarazel.de
* david.g.johnston@gmail.com
* hlinnaka@iki.fi
* jacob.champion@enterprisedb.com
* postgres@jeltef.nl
* robertmhaas@gmail.com

### **[Flush some statistics within running transactions](https://www.postgresql.org/message-id/rdx2jm7bulyprifss2myiehhxaipxuydb2gixnxuumkpidfjl5@5hx5iyvbrlk7)**
The discussion focuses on a signal handling issue related to statistics flushing within running transactions. Álvaro Herrera investigates why timeout handler functions call SetLatch() when the SIGALRM handler handle_sig_alarm() already does this. He traces the pattern back to CheckDeadLockAlert() from commit 6753333f55e1, questioning whether the redundant SetLatch() calls were necessary or just paranoia. Andres Freund explains that historically, signal handlers were more complex and could interrupt each other, potentially clearing latches, making redundant calls safer. Álvaro proposes moving the SetLatch() call in handle_sig_alarm() to after all specific handlers run and removing individual SetLatch() calls from handlers. He tests this approach successfully but acknowledges more research is needed. Andres also raises concerns about whether the statistics timer fires continuously or only when work is outstanding.

讨论集中在与运行事务中统计信息刷新相关的信号处理问题上。Álvaro Herrera调查为什么超时处理函数要调用SetLatch()，而SIGALRM处理程序handle_sig_alarm()已经执行了此操作。他将这种模式追溯到来自提交6753333f55e1的CheckDeadLockAlert()，质疑冗余的SetLatch()调用是否必要或只是出于谨慎。Andres Freund解释说，历史上信号处理程序更复杂，可能会相互中断，可能会清除锁存器，使冗余调用更安全。Álvaro提议将handle_sig_alarm()中的SetLatch()调用移至所有特定处理程序运行之后，并移除处理程序中的单个SetLatch()调用。他成功测试了这种方法，但承认需要更多研究。Andres还对统计信息计时器是否持续触发或仅在有工作未完成时触发表示担忧。

Participants - 参与者:
* alvherre@kurilemu.de
* andres@anarazel.de
* bertranddrouvot.pg@gmail.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* samimseih@gmail.com
* zsolt.parragi@percona.com

### **[Change default of jit to off](https://www.postgresql.org/message-id/DG1VZJEX1AQH.2EH4OKGRUDB71@jeltef.nl)**
The PostgreSQL community is discussing changing the default setting for JIT (Just-In-Time compilation) from enabled to disabled. This proposal emerged from a FOSDEM Postgres developer meeting where there was strong consensus for this change. The discussion highlights that major cloud providers like hyperscalers already disable JIT in their managed PostgreSQL offerings, and many package distributions don't install JIT components by default. Several contributors report being negatively affected by JIT's current default-on behavior, noting that while JIT can improve performance in specific use cases, it often causes performance issues for many common workloads. There are concerns that users don't realize JIT may be slowing their queries, and determining appropriate JIT use cases is challenging. Jelte Fennema-Nio has provided a patch to implement this change, with multiple developers expressing support for disabling JIT by default.

PostgreSQL社区正在讨论将JIT（Just-In-Time编译）的默认设置从启用改为禁用。这一提议源于FOSDEM Postgres开发者会议，会上对此变更达成了强烈共识。讨论指出，主要云服务商如超大规模云提供商在其托管PostgreSQL服务中已经禁用了JIT，许多软件包发行版默认也不安装JIT组件。多名贡献者报告受到JIT当前默认启用行为的负面影响，指出虽然JIT在特定用例中可以提升性能，但对许多常见工作负载往往会造成性能问题。有担忧认为用户不知道JIT可能在拖慢他们的查询，而且确定合适的JIT使用场景很有挑战性。Jelte Fennema-Nio已提供补丁来实现此更改，多名开发者表示支持默认禁用JIT。

Participants - 参与者:
* alvherre@kurilemu.de
* andreas@proxel.se
* anthonin.bonnefoy@datadoghq.com
* jim.jones@uni-muenster.de
* laurenz.albe@cybertec.at
* mailings@oopsware.de
* mbanck@gmx.net
* myon@debian.org
* p.psql@pinaraf.info
* postgres@jeltef.nl

### **[Improve pg\_sync\_replication\_slots\(\) to wait for primary to advance](https://www.postgresql.org/message-id/TY4PR01MB1690757DB4829EB571AB4D211949FA@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
Zhijie Hou (Fujitsu) submitted a patch to address improvements suggested by Amit Kapila for the pg_sync_replication_slots() API code path. The improvements include changing ERROR to LOG for slot synchronization failures during initial sync, fixing the slot_persistence_pending flag logic, and enabling retry functionality for all slots present on the primary at function start, not just temporary slots. The patch enhances the function to retry both slots that fail to persist and persistent slots that have skipped subsequent synchronizations. Chao Li provided detailed feedback on the patch, suggesting improvements to helper function design, variable initialization, and comment updates. Shveta malik also reviewed the patch and raised questions about comment updates, function call placement, commit message accuracy, test configuration adjustments, and verification of API completion in the test cases.

Zhijie Hou (Fujitsu) 提交了一个补丁来解决 Amit Kapila 建议的 pg_sync_replication_slots() API 代码路径改进。这些改进包括：在初始同步期间将槽同步失败的 ERROR 改为 LOG、修复 slot_persistence_pending 标志逻辑，以及为函数开始时主服务器上存在的所有槽启用重试功能，而不仅仅是临时槽。该补丁增强了函数的重试能力，既适用于持久化失败的槽，也适用于跳过后续同步的持久化槽。Chao Li 对补丁提供了详细反馈，建议改进辅助函数设计、变量初始化和注释更新。Shveta malik 也审查了补丁，并就注释更新、函数调用位置、提交消息准确性、测试配置调整以及测试用例中 API 完成验证等问题提出了疑问。

Participants - 参与者:
* amit.kapila16@gmail.com
* ashu.coek88@gmail.com
* ashutosh.bapat.oss@gmail.com
* houzj.fnst@fujitsu.com
* itsajin@gmail.com
* japinli@hotmail.com
* jiezhilove@126.com
* li.evan.chao@gmail.com
* shveta.malik@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAHut+PsiWwmNSuCXTWM0iPDm3yGskLts-fukELTB__rbBids-A@mail.gmail.com)**
Peter Smith provides extensive review comments on v38-0001 of the EXCEPT TABLE publication patch. He criticizes the patch structure as "muddled," noting that patch 0001 doesn't properly implement either approach #1 or #3 for handling partitions, making it unclear what the current logic actually does. Smith points out that multiple review comments from three weeks ago remain unaddressed across successive patch versions. He questions the partition handling logic in the documentation and code, stating it doesn't match his understanding of either proposed approach. Smith suggests restructuring the patches so 0001 combines both approaches or contains placeholders for partition logic. Shveta Malik adds observations about approach #1 testing, noting unexpected warnings when creating publications with EXCEPT clauses for partitions, which shouldn't occur in approach #1 according to her understanding.

Peter Smith对EXCEPT TABLE发布补丁的v38-0001版本提供了大量评审意见。他批评补丁结构"混乱"，指出补丁0001没有正确实现处理分区的方法#1或方法#3，使得当前逻辑的作用不清楚。Smith指出三周前的多个评审意见在连续的补丁版本中仍未得到解决。他质疑文档和代码中的分区处理逻辑，称其不符合他对两种提议方法的理解。Smith建议重构补丁，使0001合并两种方法或包含分区逻辑的占位符。Shveta Malik补充了关于方法#1测试的观察，注意到在为分区创建带有EXCEPT子句的发布时出现意外警告，根据她的理解这在方法#1中不应该发生。

Participants - 参与者:
* 1518981153@qq.com
* amit.kapila16@gmail.com
* barwick@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* dilipbalaut@gmail.com
* houzj.fnst@fujitsu.com
* shlok.kyal.oss@gmail.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com
* vignesh21@gmail.com

### **[Optional skipping of unchanged relations during ANALYZE?](https://www.postgresql.org/message-id/CAE2r8H5kDpOTZv5sRGYe0BF2gN45fgCKOJ2GD-tpwsJKAxWsVg@mail.gmail.com)**
The patch discussion focuses on implementing a MISSING_STATS_ONLY option for PostgreSQL's ANALYZE command. Vasuki acknowledges feedback about implementation issues, including incorrect flag definitions and placement of validation checks. The current implementation doesn't match vacuumdb --missing-stats-only semantics exactly, which needs clarification. Key suggestions include reusing existing ANALYZE internals like examine_attribute() to determine missing statistics, renaming the option to MISSING_STATS_ONLY for consistency, and focusing solely on server-side behavior rather than vacuumdb integration. Corey provides additional guidance on useful code in attribute_stats_update() and extended_statistics_update() for syscache lookups. The discussion references ongoing work in another thread about evolving definitions of "missing stats" that could affect future complexity.

这个补丁讨论专注于为PostgreSQL的ANALYZE命令实现MISSING_STATS_ONLY选项。Vasuki承认了关于实现问题的反馈，包括错误的标志定义和验证检查的位置问题。当前实现与vacuumdb --missing-stats-only语义不完全匹配，这需要澄清。主要建议包括重用现有的ANALYZE内部机制如examine_attribute()来确定缺失的统计信息，将选项重命名为MISSING_STATS_ONLY以保持一致性，以及专注于服务器端行为而不是vacuumdb集成。Corey在attribute_stats_update()和extended_statistics_update()中为syscache查找提供了有用代码的额外指导。讨论引用了另一个线程中关于"缺失统计信息"定义演变的持续工作，这可能影响未来的复杂性。

Participants - 参与者:
* corey.huinker@gmail.com
* dgrowleyml@gmail.com
* ilya.evdokimov@tantorlabs.com
* myon@debian.org
* rob@xzilla.net
* robertmhaas@gmail.com
* samimseih@gmail.com
* vasukianand0119@gmail.com

### **[Document NULL](https://www.postgresql.org/message-id/CAKFQuwYBnoOWgA+Zaeiduwb_1fsZ_bECtk8tGqC2NYgPfYhVLQ@mail.gmail.com)**
David G. Johnston is working on documenting NULL value handling in PostgreSQL, iterating through multiple patch versions to address review feedback. The discussion focuses on technical documentation improvements including proper XML formatting, consistent capitalization conventions, and example corrections. Version 11 failed to build due to XML parsing errors with invalid element names in nullvalues.sgml. Johnston fixed the XML entity issues in version 12 by using CDATA sections to avoid entity substitution problems. Chao Li provided testing feedback, confirming v12 builds successfully but suggesting a minor capitalization fix for "Boolean" to maintain consistency with existing documentation standards. The patches include both the main NULL handling documentation and separate example updates that will be squashed together.

David G. Johnston正在编写PostgreSQL中NULL值处理的文档，通过多个补丁版本迭代来处理审查反馈。讨论重点关注技术文档改进，包括正确的XML格式、一致的大小写约定和示例更正。版本11由于nullvalues.sgml中无效元素名称的XML解析错误而构建失败。Johnston在版本12中通过使用CDATA段落来避免实体替换问题修复了XML实体问题。Chao Li提供了测试反馈，确认v12构建成功，但建议对"Boolean"进行小的大小写修复以保持与现有文档标准的一致性。补丁包括主要的NULL处理文档和单独的示例更新，这些将被合并在一起。

Participants - 参与者:
* alvherre@kurilemu.de
* david.g.johnston@gmail.com
* dgrowleyml@gmail.com
* jian.universality@gmail.com
* li.evan.chao@gmail.com
* marcos@f10.com.br
* nagata@sraoss.co.jp
* peter@eisentraut.org
* pgsql@j-davis.com
* tgl@sss.pgh.pa.us