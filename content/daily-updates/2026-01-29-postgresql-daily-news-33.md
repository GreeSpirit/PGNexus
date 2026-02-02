---
layout: post
title: PostgreSQL Daily News 2026-01-29
---

# PostgreSQL Daily News#33 2026-01-29



## **PostgreSQL Articles - PostgreSQL 技术博客**

### **[TimescaleDB for Manufacturing IoT: Optimizing for High-Volume Production Data](https://www.tigerdata.com/blog/timescaledb-for-manufacturing-iot-optimizing-for-high-volume-production-data)**
This tutorial demonstrates optimizing TimescaleDB for manufacturing IoT data handling high-volume machine telemetry. Using vibration sensor data from 50 machines sampled 10 times per second over 6 months, the author shows step-by-step performance improvements. Starting with an unoptimized table causing slow sequential scans, optimizations include converting to hypertables for time-based partitioning, adding composite indexes for faster filtering, tuning chunk intervals for high-frequency data, implementing continuous aggregates for pre-computed summaries, and applying compression for historical data. Results show dramatic performance gains: queries dropping from 67+ seconds to milliseconds. The approach targets three operational questions about vibration trending, alarm threshold monitoring, and signal stability analysis, demonstrating how TimescaleDB's features enable both real-time operational alerts and long-term predictive maintenance analytics.

本教程演示了如何为制造业IoT优化TimescaleDB，处理大容量机器遥测数据。使用来自50台机器的振动传感器数据，每秒采样10次，持续6个月，作者展示了逐步的性能改进过程。从导致慢速顺序扫描的未优化表开始，优化措施包括转换为hypertable以实现基于时间的分区、添加复合索引以加快过滤速度、调整chunk间隔以适应高频数据、实现连续聚合以预计算摘要，以及对历史数据应用压缩。结果显示了显著的性能提升：查询时间从67秒以上降至毫秒级。该方法针对振动趋势、报警阈值监控和信号稳定性分析三个操作问题，展示了TimescaleDB的功能如何同时实现实时操作警报和长期预测性维护分析。

`NanoHertz Solutions - Jake Hertz`

### **[Databases, Data Lakes, And Encryption](https://www.percona.com/blog/databases-data-lakes-and-encryption/)**
Object storage has evolved from handling infrequently accessed data to becoming the dominant archival medium for unstructured content. This blog post by Robert Bernier explores the relationship between databases, data lakes, and encryption in the context of modern data storage architectures. The discussion covers how object storage systems have transformed data management practices and the encryption considerations that come with storing database content and data lake information in object storage environments.

对象存储已从处理不经常访问的数据发展为非结构化内容的主要存档介质。Robert Bernier在这篇博客文章中探讨了数据库、数据湖和加密在现代数据存储架构中的关系。讨论涵盖了对象存储系统如何改变数据管理实践，以及在对象存储环境中存储数据库内容和数据湖信息时的加密考虑因素。

`Robert Bernier`



## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[trivial designated initializers](https://www.postgresql.org/message-id/202601281204.sdxbr5qvpunk@alvherre.pgsql)**
Álvaro Herrera proposes converting two PostgreSQL arrays to use C99 designated struct initializers: the tupleLockExtraInfo array in heapam.c and InternalBGWorkers array in bgworker.c. This would make the code more consistent with other parts of PostgreSQL that already use designated initializers. Melanie Plageman and Jelte Fennema-Nio both express support for the change, finding designated initializers easier to understand and generally preferring them. Peter Eisentraut also supports the idea but suggests further improvements, including using array index designators and consolidating repetitive comments. He recommends moving explanatory comments to the struct field declaration rather than repeating them for each array element. The proposal appears to have unanimous support with constructive suggestions for enhancement.

Álvaro Herrera提议将PostgreSQL中的两个数组转换为使用C99指定结构体初始化器：heapam.c中的tupleLockExtraInfo数组和bgworker.c中的InternalBGWorkers数组。这将使代码与PostgreSQL中已经使用指定初始化器的其他部分保持一致。Melanie Plageman和Jelte Fennema-Nio都表示支持这一变更，认为指定初始化器更易于理解且通常更喜欢使用它们。Peter Eisentraut也支持这个想法，但建议进一步改进，包括使用数组索引指定符和整合重复的注释。他建议将解释性注释移到结构体字段声明处，而不是为每个数组元素重复注释。该提议似乎获得了一致支持，并有建设性的增强建议。

Participants - 参与者:
* alvherre@kurilemu.de
* melanieplageman@gmail.com
* peter@eisentraut.org
* postgres@jeltef.nl

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoaZMOikxK=LqS+Jn+835h9S139JLGk-3LyETVXw5W5j=w@mail.gmail.com)**
Robert Haas committed part of the pg_plan_advice patch series after rearranging to move patch 0004 to the front, and released v13 of the remaining patches. The major change in v13 involves fixing bitmap heap scans by reducing scope - removing the ability to specify particular indexes within BITMAP_HEAP_SCAN() directives, now only allowing relation identifiers to specify some kind of bitmap heap scan should be used. This decision addresses complexity around choose_bitmap_and() algorithm which uses special heuristics beyond just cost considerations. Haas removed the "WIP" designation, noting that while some areas need investigation and bugs likely remain, the bitmap scan issue was the last major problem. He requests continued code review. Zsolt Parragi then reported finding an accidental leftover line in the committed patch at src/backend/optimizer/ptah/costsize.c:1462 where "path->disabled_nodes = 0;" appears to be unintentional.

Robert Haas在重新排列补丁系列后提交了pg_plan_advice补丁系列的一部分，将补丁0004移到前面，并发布了其余补丁的v13版本。v13的主要变化涉及通过减少范围来修复位图堆扫描 - 移除了在BITMAP_HEAP_SCAN()指令中指定特定索引的能力，现在只允许关系标识符来指定应该使用某种位图堆扫描。这个决定解决了围绕choose_bitmap_and()算法的复杂性，该算法使用了超出成本考虑的特殊启发式方法。Haas移除了"WIP"标记，指出虽然某些领域需要调查且可能仍有bug，但位图扫描问题是最后一个主要问题。他请求继续进行代码审查。Zsolt Parragi随后报告在已提交补丁的src/backend/optimizer/ptah/costsize.c:1462处发现了意外遗留行，其中"path->disabled_nodes = 0;"似乎是无意的。

Participants - 参与者:
* di@nmfay.com
* jacob.champion@enterprisedb.com
* jakub.wartak@enterprisedb.com
* lukas@fittl.com
* matheusssilv97@gmail.com
* robertmhaas@gmail.com
* zsolt.parragi@percona.com

### **[AIX support](https://www.postgresql.org/message-id/LV8PR15MB64883FC333B351ABD169E874D691A@LV8PR15MB6488.namprd15.prod.outlook.com)**
The PostgreSQL team is reviewing a patch set for AIX support. IBM developers Aditya Kamath and Srirama Kucherlapati are facing criticism from core developers Andres Freund and Robert Haas regarding patch quality. Key issues include missing files (mkldexport.sh), inconsistent testing, and problematic solutions like using `-D_H_FLOAT` to resolve header inclusion conflicts.

The primary technical issue involves header ordering problems on AIX where PostgreSQL's `utils/float.h` gets included before `c.h`, causing compilation failures. The IBM team's proposed `-D_H_FLOAT` solution prevents system float.h inclusion, but reviewers consider this approach incorrect.

Robert Haas identified that the root cause stems from meson incorrectly adding `-I../src/include/utils` to include paths for wait_event compilation, which shouldn't happen. He proposed a cleaner fix by adjusting the build configuration. Álvaro Herrera questioned the technical explanation, suggesting the problem description doesn't align with PostgreSQL's include practices.

Andres Freund emphasized that this represents a broader meson build system issue rather than an AIX-specific problem. The discussion remains unresolved, with reviewers expecting higher-quality patches and cleaner architectural solutions from the IBM team.

PostgreSQL团队正在审查AIX支持的补丁集。IBM开发者Aditya Kamath和Srirama Kucherlapati因补丁质量问题受到核心开发者Andres Freund和Robert Haas的批评。关键问题包括缺失文件(mkldexport.sh)、测试不一致，以及使用`-D_H_FLOAT`解决头文件包含冲突等有问题的解决方案。

主要技术问题涉及AIX上的头文件顺序问题，PostgreSQL的`utils/float.h`在`c.h`之前被包含，导致编译失败。IBM团队提出的`-D_H_FLOAT`解决方案阻止系统float.h包含，但审查者认为这种方法不正确。

Robert Haas识别出根本原因源于meson错误地为wait_event编译添加了`-I../src/include/utils`到包含路径，这不应该发生。他提出了通过调整构建配置的更清洁修复方案。Álvaro Herrera质疑技术解释，认为问题描述与PostgreSQL的包含实践不符。

Andres Freund强调这代表的是更广泛的meson构建系统问题，而不是AIX特定问题。讨论仍未解决，审查者期望IBM团队提供更高质量的补丁和更清洁的架构解决方案。

Participants - 参与者:
* aditya.kamath1@ibm.com
* alvherre@kurilemu.de
* andres@anarazel.de
* hlinnaka@iki.fi
* michael@paquier.xyz
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* robertmhaas@gmail.com
* sriram.rk@in.ibm.com
* tristan@partin.io

### **[Document NULL](https://www.postgresql.org/message-id/CAKFQuwaULsfcG=9JmuGO7VXvTOH8hxsuGhwq2zASAYi48SmfRA@mail.gmail.com)**
David G. Johnston provided version 10 of a documentation patch about NULL handling in PostgreSQL. The patch addresses feedback from Marcos Pegoraro regarding terminology consistency, specifically the use of "an empty string" versus "the empty string" in documentation. Johnston noted that a related patch for this terminology change probably won't be accepted, as both phrasings convey different meanings appropriately. He addressed readability concerns about programlisting blocks containing multiple commands and results by adding manual inline comments where necessary. The updated patch includes a current introductory paragraph and uses "Null" as the \pset display null value instead of \N. The patch is ready for commit and awaits a commit message.

David G. Johnston提供了关于PostgreSQL中NULL处理的文档补丁第10版。该补丁解决了Marcos Pegoraro关于术语一致性的反馈，特别是文档中使用"an empty string"与"the empty string"的问题。Johnston指出相关的术语更改补丁可能不会被接受，因为两种表述都能适当地传达不同的含义。他通过在必要时添加手动内联注释来解决关于programlisting块包含多个命令和结果的可读性问题。更新的补丁包含当前的介绍段落，并使用"Null"作为\pset显示null值而不是\N。该补丁已准备好提交，等待提交消息。

Participants - 参与者:
* alvherre@kurilemu.de
* david.g.johnston@gmail.com
* dgrowleyml@gmail.com
* jian.universality@gmail.com
* marcos@f10.com.br
* nagata@sraoss.co.jp
* peter@eisentraut.org
* pgsql@j-davis.com
* tgl@sss.pgh.pa.us

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/CAAKRu_bs+gZ83QDacmBxunPvCGnXJ05hxP2BDPJ3BGwdbGRXzg@mail.gmail.com)**
Melanie Plageman responded to Andres Freund's review of v33 patches 0001-0003 for eliminating xl_heap_visible WAL records. The discussion covers several technical concerns: variable naming consistency (suggesting "new_all_visible_pages" vs "vm_new_visible_pages"), function naming clarity for heap_page_will_set_vm() which performs side effects like clearing VM corruption, and the timing of corruption fixes relative to WAL logging. Andres questioned the logic for snapshot conflict horizons, particularly why OldestXmin is used when freezing non-all-frozen pages instead of tracking newer frozen tuple xmins. Melanie explained this would require additional overhead without simplifying existing code. She addressed API changes, clarified that HEAP_PAGE_PRUNE_FREEZE and HEAP_PAGE_PRUNE_UPDATE_VM flags serve different purposes (the latter for expensive on-access VM setting), and improved comment clarity around conflict horizon calculations. The patch series aims to reduce WAL volume by combining VM updates with pruning/freezing operations rather than using separate xl_heap_visible records.

Melanie Plageman回应了Andres Freund对v33补丁0001-0003的审查，该补丁旨在消除xl_heap_visible WAL记录。讨论涵盖了几个技术问题：变量命名一致性（建议使用"new_all_visible_pages"而非"vm_new_visible_pages"），函数heap_page_will_set_vm()的命名清晰度（该函数执行清除VM损坏等副作用），以及损坏修复相对于WAL日志记录的时序。Andres质疑快照冲突范围的逻辑，特别是为什么在冻结非全冻结页面时使用OldestXmin而不是跟踪更新的冻结元组xmin。Melanie解释这需要额外开销而不会简化现有代码。她处理了API更改，澄清了HEAP_PAGE_PRUNE_FREEZE和HEAP_PAGE_PRUNE_UPDATE_VM标志服务于不同目的（后者用于昂贵的访问时VM设置），并改进了冲突范围计算相关注释的清晰度。该补丁系列旨在通过将VM更新与剪枝/冻结操作结合而不是使用单独的xl_heap_visible记录来减少WAL量。

Participants - 参与者:
* andres@anarazel.de
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* x4mmm@yandex-team.ru
* xunengzhou@gmail.com

### **[Proposal: Conflict log history table for Logical Replication](https://www.postgresql.org/message-id/CAHut+Psbygz+QOLOBX5ByqE_dg4bERCO2mASBe9i_Z4qfA8bYA@mail.gmail.com)**
Peter Smith provides detailed review comments for v25 patches of the conflict log history table feature for logical replication. He suggests documentation improvements including typo fixes, better SGML markup usage, and clearer wording about conflict log destinations. Key issues include redundant comments about row locking restrictions, inconsistent terminology between "log" and "table" destinations, and missing cross-references between documentation sections.

Shveta Malik adds her own review feedback, recommending function renaming (GetLogDestination to GetConflictLogDest), using "nspname" instead of "schemaname" for consistency with PostgreSQL catalogs, and reorganizing code structure. She suggests moving LocalConflictSchema definition closer to ConflictLogSchema in the header file for better code readability. Both reviewers identify areas needing refinement in the test cases, particularly around JSON validation patterns.

Peter Smith supports Shveta's suggestion about relocating the LocalConflictSchema definition, referencing his earlier similar feedback. The discussion focuses on code organization, naming consistency, and documentation clarity rather than fundamental design issues.

Peter Smith 为逻辑复制冲突日志历史表功能的 v25 补丁提供了详细的审查意见。他建议改进文档，包括修复拼写错误、更好地使用 SGML 标记，以及更清晰地描述冲突日志目标。主要问题包括关于行锁定限制的冗余注释、"日志"和"表"目标之间的术语不一致，以及文档部分之间缺少交叉引用。

Shveta Malik 添加了自己的审查反馈，建议重命名函数（GetLogDestination 改为 GetConflictLogDest），为了与 PostgreSQL 目录保持一致使用"nspname"而不是"schemaname"，以及重新组织代码结构。她建议将 LocalConflictSchema 定义移至头文件中更靠近 ConflictLogSchema 的位置，以提高代码可读性。两位审查者都识别了测试用例中需要改进的地方，特别是围绕 JSON 验证模式。

Peter Smith 支持 Shveta 关于重新定位 LocalConflictSchema 定义的建议，引用了他之前的类似反馈。讨论重点关注代码组织、命名一致性和文档清晰度，而非根本设计问题。

Participants - 参与者:
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* dilipbalaut@gmail.com
* sawada.mshk@gmail.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com
* vignesh21@gmail.com

### **[Custom oauth validator options](https://www.postgresql.org/message-id/CAN4CZFPmF9fGOcFubwOxqXymhVo_RvbUx3bLoYQcfk=f0mwECw@mail.gmail.com)**
Zsolt Parragi implemented a DefineCustomValidatorStringVariable proof of concept for custom OAuth validator options but finds it adds too much boilerplate code. He proposes two alternative patches: one introducing a new GUC called guc_prefix_enforcement to modify prefix reservation behavior with warning/error modes during library load time, and another addressing pg_hba variable prefix enforcement. The approach aims to prevent GUC collisions by enforcing proper prefixes for extensions, potentially changing default behavior in future versions. Álvaro Herrera suggests considering this work in context of a larger refactoring patch series, though Parragi clarifies that the referenced series deals with SQL options rather than GUC variable validation, making them unrelated efforts.

Zsolt Parragi为自定义OAuth验证器选项实现了DefineCustomValidatorStringVariable概念验证，但发现它添加了太多样板代码。他提出了两个替代补丁：一个引入名为guc_prefix_enforcement的新GUC来修改前缀保留行为，在库加载时提供警告/错误模式，另一个解决pg_hba变量前缀强制执行。该方法旨在通过为扩展强制执行适当的前缀来防止GUC冲突，可能会在未来版本中更改默认行为。Álvaro Herrera建议在更大的重构补丁系列的上下文中考虑这项工作，不过Parragi澄清引用的系列处理的是SQL选项而不是GUC变量验证，使它们成为不相关的工作。

Participants - 参与者:
* alvherre@kurilemu.de
* david.g.johnston@gmail.com
* dhyan@nataraj.su
* jacob.champion@enterprisedb.com
* myon@debian.org
* robertmhaas@gmail.com
* vasukianand0119@gmail.com
* zsolt.parragi@percona.com

### **[pgsql: Prevent invalidation of newly synced replication slots\.](https://www.postgresql.org/message-id/CAA4eK1Kr+RVqKWwky5cFiMaeRd+jCk_g0ZCmFsxjXshH5R0K6w@mail.gmail.com)**
A commit that prevents invalidation of newly synced replication slots has broken CI builds on Windows, specifically failing with "could not rename file 'backup_label' to 'backup_label.old': Permission denied" errors. The issue appears to be an ERROR_SHARING_VIOLATION where something is holding the backup_label file open during the rename operation. Amit Kapila investigated and discovered that the failure occurs due to interaction with a previous test that left background psql sessions running without proper cleanup. These sessions may be accessing parent directories in a way that creates file locks on Windows. The proposed fix involves properly quitting background psql sessions after test completion, following the documented requirement to "quit" background_psql objects when done. Testing shows this resolves the issue consistently on both Linux and Windows. The fix addresses a broader test hygiene issue beyond just this specific failure.

一个防止新同步的复制槽失效的提交破坏了Windows上的CI构建，具体表现为"could not rename file 'backup_label' to 'backup_label.old': Permission denied"错误。问题似乎是ERROR_SHARING_VIOLATION，即某些进程持有backup_label文件的打开句柄导致重命名操作失败。Amit Kapila调查发现，故障是由于与前一个测试的交互导致的，该测试遗留了未正确清理的后台psql会话。这些会话可能以某种方式访问父目录，在Windows上创建了文件锁。建议的修复方案是在测试完成后正确退出后台psql会话，遵循文档要求在完成后"quit" background_psql对象。测试显示这个方案在Linux和Windows上都能一致地解决问题。该修复解决了一个超出此特定故障范围的更广泛的测试卫生问题。

Participants - 参与者:
* akapila@postgresql.org
* amit.kapila16@gmail.com
* andres@anarazel.de
* dbryan.green@gmail.com
* greg@burd.me
* robertmhaas@gmail.com
* thomas.munro@gmail.com
* x4mmm@yandex-team.ru

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/xf9b6kmx0DFSMe9zJ3hP-kxRMeOhOMwf7v914ctQ_YtPEVLlqCFkbrrw924XLR4LJynEtBX7omSa5taFyK-uoTPeWwusZiBXRYQholbUjhc=@dunklau.fr)**
The discussion focuses on a patch to allow PostgreSQL's walsender to exit before confirming remote flush in logical replication. Fujii Masao suggests the GUC name "wal_sender_shutdown" is sufficient. Ronan Dunklau proposes an alternative approach using a timeout mechanism instead of the current binary "wait indefinitely" or "terminate immediately" behavior. He suggests "wal_sender_stop_timeout" as a parameter name that could accept -1 for indefinite wait, 0 for immediate shutdown, or positive values for timed wait. Andrey Silitskiy acknowledges this timeout approach is feasible but raises concerns about naming confusion with the existing "wal_sender_timeout" parameter, noting the difference between these parameters may not be obvious to users. The team continues to evaluate different approaches and parameter naming conventions.

讨论集中在一个补丁上，该补丁允许PostgreSQL的walsender在逻辑复制中确认远程刷新之前退出。Fujii Masao建议GUC名称"wal_sender_shutdown"已经足够。Ronan Dunklau提出了一种替代方法，使用超时机制代替当前的"无限等待"或"立即终止"的二元行为。他建议使用"wal_sender_stop_timeout"作为参数名，可以接受-1表示无限等待，0表示立即关闭，或正值表示定时等待。Andrey Silitskiy承认这种超时方法是可行的，但担心与现有的"wal_sender_timeout"参数在命名上会造成混淆，指出用户可能不明显看出这些参数之间的差异。团队继续评估不同的方法和参数命名约定。

Participants - 参与者:
* a.silitskiy@postgrespro.ru
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* andres@anarazel.de
* dilipbalaut@gmail.com
* horikyota.ntt@gmail.com
* htamfids@gmail.com
* kuroda.hayato@fujitsu.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* osumi.takamichi@fujitsu.com
* peter.eisentraut@enterprisedb.com
* ronan@dunklau.fr
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[Extended Statistics set/restore/clear functions\.](https://www.postgresql.org/message-id/CADkLM=d3aqhdWTjeg9V3YcybRPL1PP+G=eNnnABgjxU-QyzDjQ@mail.gmail.com)**
The discussion focuses on completing extended statistics set/restore/clear functions for PostgreSQL. Michael Paquier identified and fixed a critical issue where numexprs validation was missing for expressions in ndistinct and dependencies data, causing incorrect rejections of valid input with negative attribute numbers. He discovered a memory overread bug in the MCV (Most Common Values) part when most_common_val_nulls arrays have insufficient elements, demonstrating the issue with boundary checks. Michael suggested removing the most_common_val_nulls parameter entirely, arguing it's redundant since NULL values can be determined directly from most_common_vals using PostgreSQL's standard array NULL representation. Corey Huinker agreed this approach would simplify the code and eliminate the overread issue, explaining the parameter was included out of overcaution because pg_mcv_list() exports it. The latest v34 patch removes the redundant null structures and updates documentation to clarify that name parameters are text types.

讨论重点是完成PostgreSQL的扩展统计信息set/restore/clear函数。Michael Paquier发现并修复了一个关键问题，即在ndistinct和dependencies数据中缺少对表达式的numexprs验证，这导致带有负属性编号的有效输入被错误拒绝。他发现了MCV（最常见值）部分的内存越界读取错误，当most_common_val_nulls数组元素不足时会出现边界检查问题。Michael建议完全删除most_common_val_nulls参数，认为它是多余的，因为可以使用PostgreSQL标准数组NULL表示法直接从most_common_vals确定NULL值。Corey Huinker同意这种方法会简化代码并消除越界读取问题，解释说包含该参数是出于过度谨慎，因为pg_mcv_list()导出了它。最新的v34补丁删除了冗余的null结构，并更新文档以明确name参数是text类型。

Participants - 参与者:
* corey.huinker@gmail.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* tndrwang@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAJpy0uBfEuzYX+qjAPM+GV5duOwMNqO6fkDtsN1OzONVNR9WGQ@mail.gmail.com)**
Shveta Malik is reviewing vignesh C's patch for supporting EXCEPT with partitioned tables in PostgreSQL publications. The discussion centers on three approaches: Approach 1 allows excluding any partition and its subtree, Approach 2 uses ONLY and '*' keywords for partition exclusion, and Approach 3 restricts exclusions to root partitioned tables only. Vignesh submitted a patch implementing Approach 1, which handles the complexity of publish_via_partition_root by storing excluded partitions in pg_publication_rel and using UNION ALL queries during tablesync to copy only non-excluded data. Shveta identified several issues in the v37 patch: remnants of Approach 3 code still present, incorrect logic that only checks topmost ancestors instead of any ancestors in the EXCEPT list, and failing incremental replication functionality. She requests corrections to these basic issues before further review can proceed.

Shveta Malik正在审查vignesh C为PostgreSQL发布中分区表的EXCEPT支持提交的补丁。讨论围绕三种方法展开：方法1允许排除任何分区及其子树，方法2使用ONLY和'*'关键字进行分区排除，方法3将排除限制为仅根分区表。Vignesh提交了实现方法1的补丁，该方法通过在pg_publication_rel中存储被排除的分区，并在tablesync期间使用UNION ALL查询仅复制未排除的数据来处理publish_via_partition_root的复杂性。Shveta在v37补丁中发现了几个问题：仍然存在方法3的代码残留，仅检查最顶层祖先而非EXCEPT列表中任何祖先的错误逻辑，以及增量复制功能失效。她要求在进行进一步审查前先修正这些基本问题。

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