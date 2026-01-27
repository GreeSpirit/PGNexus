---
layout: post
title: PostgreSQL Daily News 2026-01-27
---

# PostgreSQL Daily News#21 2026-01-27







## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[unnecessary executor overheads around seqscans]()**


Participants - 参与者:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* hlinnaka@iki.fi
* robertmhaas@gmail.com

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/TY4PR01MB169076CE653659F8F8BC984729493A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
Zhijie Hou has submitted V4 patches addressing Amit Kapila's feedback on a race condition fix where newly created replication slots can be invalidated by concurrent checkpoints. The issue occurs when slot synchronization's initial restart_lsn precedes the redo pointer, creating timing vulnerabilities. Hou expanded comments explaining why both RedoRecPtr and slot minimum LSN are needed, clarified test case comments, and removed unnecessary DEBUG2 logging. Hayato Kuroda confirmed the patches fix the issue across all versions, noting that pg_sync_replication_slots() behavior differs on HEAD due to unrelated changes from commit 0d2d4a0. Chao Li agreed the V4 patches are solid but identified minor typos in commit messages and code comments requiring correction before final approval.
侯志杰提交了V4补丁，解决了Amit Kapila关于新创建的复制槽可能被并发检查点无效化的竞态条件反馈。该问题发生在槽同步的初始restart_lsn早于重做指针时，产生时序漏洞。侯志杰扩展了注释解释为何需要RedoRecPtr和槽最小LSN，澄清了测试用例注释，并移除了不必要的DEBUG2日志。黑田隼人确认补丁修复了所有版本的问题，指出HEAD上pg_sync_replication_slots()行为因提交0d2d4a0的无关更改而有所不同。李超认为V4补丁很可靠，但发现提交消息和代码注释中的小错误需要在最终批准前修正。

Participants - 参与者:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/CAHGQGwGotoS0VeMDdK6ezkhvdQpWZ5oJvO3QKJKEV6Pc+rZ_9A@mail.gmail.com)**
Fujii Masao provides detailed feedback on a patch that adds a new GUC parameter wal_sender_shutdown_mode to control walsender termination behavior. The patch addresses an issue where walsenders could block during immediate shutdown when output buffers are full, by changing the log level to LOG_SERVER_ONLY. Masao suggests that whereToSendOutput should also be reset to prevent proc_exit() from sending additional messages. He proposes an alternative SIGTERM-based approach where the postmaster would send SIGTERM to walsenders during immediate shutdown, eliminating the need for WalSndDoneImmediate(). Masao provides extensive documentation suggestions, including clearer explanations of the benefits for switchovers, better parameter ordering, and updates to high-availability.sgml. He also identifies technical issues like unnecessary abort() calls, incorrect comments about when WalSndDoneImmediate() is called, and missing typedefs.list entries. The discussion highlights the complexity of safely terminating walsenders without blocking shutdown processes.
藤井正雄对一个补丁提供详细反馈，该补丁添加新的GUC参数wal_sender_shutdown_mode来控制walsender终止行为。补丁通过将日志级别更改为LOG_SERVER_ONLY来解决输出缓冲区满时walsender在立即关闭期间可能阻塞的问题。正雄建议还应重置whereToSendOutput以防止proc_exit()发送额外消息。他提出基于SIGTERM的替代方法，在立即关闭期间postmaster向walsender发送SIGTERM，消除WalSndDoneImmediate()的需要。正雄提供广泛的文档建议，包括更清晰地解释切换的好处、更好的参数排序以及更新high-availability.sgml。他还识别出技术问题，如不必要的abort()调用、关于何时调用WalSndDoneImmediate()的错误注释以及缺失的typedefs.list条目。讨论突出了安全终止walsender而不阻塞关闭过程的复杂性。

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
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[AIX support](https://www.postgresql.org/message-id/f6c4e700-73b9-47e7-bf0b-ccb2b7020739@eisentraut.org)**
The discussion centers on adding AIX support to PostgreSQL with patches submitted by Srirama Kucherlapati from IBM. Peter Eisentraut provided initial positive feedback on the patch set, confirming it looks "pretty reasonable now" and requesting details about testing environment. Srirama confirmed testing on AIX 7.3 with GCC 12.3.0 and provided complete patch details including both meson and full changes.

Andres Freund identified several issues with the meson patch: missing mkldexport.sh file, incorrect path references, and questioning the AIX-specific alignment handling logic. He criticized the approach to floating-point alignment rules and suggested breaking changes into separate patches.

Tom Lane conducted extensive testing on the GCC compile farm, reporting multiple problems: configure/configure.ac mismatches, permission issues with mkldexport.sh, a significant name collision issue where system headers define truncate as truncate64 causing build failures, missing function prototypes for getpeereid and wcstombs_l, and runtime failures with shared library loading. Despite these issues, the build completed successfully after workarounds.

该讨论围绕为PostgreSQL添加AIX支持，由IBM的Srirama Kucherlapati提交补丁。Peter Eisentraut对补丁集给出了初步积极反馈，确认看起来"相当合理"，并询问测试环境详情。Srirama确认在AIX 7.3上使用GCC 12.3.0测试，并提供了包括meson和完整更改的补丁详情。

Andres Freund发现了meson补丁的几个问题：缺少mkldexport.sh文件、路径引用错误，并质疑AIX特定的对齐处理逻辑。他批评了浮点对齐规则的方法，建议将更改分解为单独的补丁。

Tom Lane在GCC编译农场进行了广泛测试，报告了多个问题：configure/configure.ac不匹配、mkldexport.sh权限问题、系统头文件将truncate定义为truncate64导致构建失败的重要名称冲突问题、getpeereid和wcstombs_l函数原型缺失，以及共享库加载的运行时失败。尽管存在这些问题，在变通方案后构建成功完成。

Participants - 参与者:
* andres@anarazel.de
* hlinnaka@iki.fi
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io

### **[Issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY](https://www.postgresql.org/message-id/CADzfLwWZjWqeX6fF5=iKq_PJiw7G+k01CBu5xB8X_Z+nN1gqqA@mail.gmail.com)**
The discussion focuses on bug fixes for issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY operations. Mihail Nikalayeu submitted patches with fixes and explanations, including a second commit that adds a syscache for pg_inherits, though he expressed some uncertainty about this addition. Álvaro Herrera reviewed the patches positively, accepting the main fixes and rewriting code comments for clarity, but expressed reservations about the syscache addition on (inhrelid, inhseqno), considering it "a bit weird" and not immediately necessary. Alternative approaches were discussed, including storing parent information in relcache and creating batched versions of get_partition_ancestors, but Álvaro preferred a non-invasive bug fix approach suitable for potential backpatching rather than major architectural changes. The collaboration concluded with mutual agreement on the improved comments and a plan for Mihail to measure performance impact later.

讨论重点是修复ON CONFLICT UPDATE和REINDEX CONCURRENTLY操作的问题。Mihail Nikalayeu提交了包含修复和说明的补丁，包括为pg_inherits添加syscache的第二个提交，但他对此表示不确定。Álvaro Herrera对补丁进行了积极评审，接受了主要修复并重写了代码注释以提高清晰度，但对(inhrelid, inhseqno)上的syscache添加表示保留意见，认为它"有点奇怪"且不是立即必需的。讨论了替代方案，包括在relcache中存储父级信息和创建get_partition_ancestors的批处理版本，但Álvaro倾向于采用适合潜在向后移植的非侵入性错误修复方法，而不是重大架构更改。协作在对改进注释的共同认可和Mihail稍后测量性能影响的计划中结束。

Participants - 参与者:
* alvherre@kurilemu.de
* exclusion@gmail.com
* michael@paquier.xyz
* mihailnikalayeu@gmail.com
* noah@leadboat.com

### **[docs: clarify ALTER TABLE behavior on partitioned tables]()**
This discussion focuses on a documentation patch to clarify ALTER TABLE behavior on partitioned tables in PostgreSQL. Chao Li submitted version 7 incorporating feedback from David Johnston and Zsolt Parragi. Key revisions include fixing grammar errors, clarifying that partition columns and constraints are implicitly renamed when renaming occurs on the parent table, and distinguishing between table name changes (which only affect the named table) versus column/constraint renaming (which cascades to partitions). The patch also corrects documentation about DROP CONSTRAINT behavior, noting that inherited constraints cannot be dropped from individual partitions, and updates inheritance behavior descriptions for column drops in multi-parent scenarios. Zsolt identified a typo in version 8, which Chao fixed in the final version. The patch appears ready for integration with reviewer approval.

这个讨论聚焦于一个文档补丁，用于澄清PostgreSQL中分区表的ALTER TABLE行为。Chao Li根据David Johnston和Zsolt Parragi的反馈提交了第7版。主要修订包括修正语法错误，澄清在父表上进行重命名时分区列和约束会被隐式重命名，区分表名更改（仅影响指定表）与列/约束重命名（会级联到分区）。补丁还修正了DROP CONSTRAINT行为的文档，指出不能从单个分区中删除继承的约束，并更新了多父场景中列删除的继承行为描述。Zsolt在第8版中发现了一个拼写错误，Chao在最终版本中修复了该错误。补丁似乎已准备好集成，获得了审查者的批准。

Participants - 参与者:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[unnecessary executor overheads around seqscans]()**


Participants - 参与者:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* hlinnaka@iki.fi
* robertmhaas@gmail.com

### **[Parallel CREATE INDEX for GIN indexes](https://www.postgresql.org/message-id/590a8f34-c743-47f5-b042-4b2941f87fdf@vondra.me)**
Tomas Vondra fixed a bug in tuplesort_begin_index_gin() that incorrectly used b-tree operators instead of GIN opclass comparison functions for parallel GIN index creation. The issue was discovered by Kirill Reshke, who also noted missing test coverage for parallel GIN builds. Vondra applied two patches: one fixing the operator lookup bug and another adding regression tests to improve code coverage by enabling parallel GIN index builds in existing tests. Both patches were pushed and backpatched to PostgreSQL 18. The bug could potentially cause failures when no b-tree opclass exists or when b-tree and GIN opclasses disagree on ordering, though no production issues were reported.

Tomas Vondra 修复了 tuplesort_begin_index_gin() 中的一个错误，该函数在并行 GIN 索引创建中错误地使用了 b-tree 操作符而非 GIN 操作类比较函数。该问题由 Kirill Reshke 发现，他还注意到并行 GIN 构建缺少测试覆盖。Vondra 应用了两个补丁：一个修复操作符查找错误，另一个通过在现有测试中启用并行 GIN 索引构建来添加回归测试以提高代码覆盖率。两个补丁都已推送并回移植到 PostgreSQL 18。当不存在 b-tree 操作类或 b-tree 和 GIN 操作类在排序上不一致时，该错误可能导致故障，尽管未报告生产问题。

Participants - 参与者:
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* michael@paquier.xyz
* reshkekirill@gmail.com
* tomas@vondra.me

### **[unnecessary executor overheads around seqscans]()**


Participants - 参与者:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* hlinnaka@iki.fi
* robertmhaas@gmail.com

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/TY4PR01MB169076CE653659F8F8BC984729493A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
The discussion addresses a race condition where newly created replication slots may be invalidated by concurrent checkpoints. Zhijie Hou provided V4 patches after incorporating feedback from Amit Kapila, including expanding comments about comparing redo pointer with minimum slot LSN, improving test case comments, and removing unnecessary DEBUG2 logging. Hayato Kuroda confirmed the patches fix the issue across all tested versions and noted a behavioral difference in pg_sync_replication_slots() on HEAD due to an unrelated change. Chao Li agreed the patches are solid but identified minor typos in commit messages and code comments, including grammatical errors and missing articles. The patches ensure synchronized slots won't be invalidated immediately after synchronization when concurrent checkpoints occur.

讨论解决了新创建的复制槽可能被并发检查点无效化的竞态条件问题。侯志杰在采纳了Amit Kapila的反馈后提供了V4补丁，包括扩展关于比较重做指针与最小槽位LSN的注释、改进测试用例注释，以及移除不必要的DEBUG2日志记录。黑田隼人确认补丁在所有测试版本中修复了问题，并注意到HEAD上pg_sync_replication_slots()的行为差异是由于无关更改造成的。李超同意补丁很可靠，但发现了提交消息和代码注释中的小错误，包括语法错误和缺少冠词。这些补丁确保同步槽在并发检查点发生时不会在同步后立即被无效化。

Participants - 参与者:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/CAHGQGwGotoS0VeMDdK6ezkhvdQpWZ5oJvO3QKJKEV6Pc+rZ_9A@mail.gmail.com)**
Fujii Masao reviews a patch for walsender shutdown behavior in logical replication. The patch aims to prevent walsenders from blocking shutdown when output buffers are full during immediate termination. Masao provides detailed feedback on the implementation, suggesting potential issues where proc_exit() could still emit messages requiring buffer sends. He questions whether whereToSendOutput should be reset, similar to WalSndShutdown(). Masao also proposes an alternative SIGTERM-based approach where postmaster directly terminates walsenders. He notes the patch changes the documentation and code comments, requesting updates to high-availability.sgml and walsender.c header comments. Technical suggestions include adding WalSndShutdownMode to pgindent typedefs.list, improving GUC documentation format, and removing unnecessary abort() call in WalSndDoneImmediate(). Masao questions a comment about "serially executing a scan that was planned to be parallel," suggesting it may be incorrect based on current behavior testing.

Fujii Masao 审查了用于逻辑复制中 walsender 关闭行为的补丁。该补丁旨在防止 walsender 在立即终止期间输出缓冲区已满时阻塞关闭。Masao 提供了实施方面的详细反馈，指出 proc_exit() 仍可能发出需要缓冲区发送的消息的潜在问题。他质疑是否应该重置 whereToSendOutput，类似于 WalSndShutdown()。Masao 还提出了基于 SIGTERM 的替代方法，其中 postmaster 直接终止 walsender。他注意到补丁更改了文档和代码注释，要求更新 high-availability.sgml 和 walsender.c 头注释。技术建议包括将 WalSndShutdownMode 添加到 pgindent typedefs.list，改进 GUC 文档格式，以及删除 WalSndDoneImmediate() 中不必要的 abort() 调用。Masao 质疑关于"串行执行计划为并行的扫描"的注释，根据当前行为测试认为可能不正确。

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
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[Parallel CREATE INDEX for GIN indexes](https://www.postgresql.org/message-id/590a8f34-c743-47f5-b042-4b2941f87fdf@vondra.me)**
Tomas Vondra pushed both patches to fix a bug in tuplesort_begin_index_gin() that incorrectly used btree comparison functions instead of GIN opclass compare functions. The first patch corrects this issue where the function looked up the key type's btree operator rather than the GIN opclass's compare function, potentially causing problems if no btree opclass exists or if btree/gin opclasses disagree on ordering. The second patch improves test coverage for parallel GIN index builds by tweaking regression tests to build GIN indexes in parallel. Both patches were backpatched to PostgreSQL 18. The issue was initially reported through code coverage analysis that showed parallel GIN builds weren't adequately tested, unlike btree parallel builds which are covered by existing tests.
Tomas Vondra推送了两个补丁来修复tuplesort_begin_index_gin()中的bug,该bug错误地使用了btree比较函数而不是GIN操作类的比较函数。第一个补丁修正了这个问题,即函数查找键类型的btree操作符而不是GIN操作类的比较函数,如果不存在btree操作类或btree/gin操作类在排序上不一致,可能会导致问题。第二个补丁通过调整回归测试以并行构建GIN索引,改善了并行GIN索引构建的测试覆盖率。两个补丁都已回溯到PostgreSQL 18。该问题最初是通过代码覆盖率分析报告的,分析显示并行GIN构建没有得到充分测试,不像btree并行构建已被现有测试覆盖。

Participants - 参与者:
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* michael@paquier.xyz
* reshkekirill@gmail.com
* tomas@vondra.me

### **[AIX support](https://www.postgresql.org/message-id/f6c4e700-73b9-47e7-bf0b-ccb2b7020739@eisentraut.org)**
The discussion centers on PostgreSQL AIX support patches submitted by IBM. Peter Eisentraut expressed initial approval of the patch set for AIX support on version 7.3 using GCC 12.3.0. However, Andres Freund identified significant issues including missing mkldexport.sh script, incorrect file paths in meson configuration, alignment rule complications, and excessive debug output. Tom Lane tested the patches on AIX 7.3 and discovered critical problems: configure/autoconf mismatches, permission issues with mkldexport.sh, symbol conflicts with truncate/truncate64 macros in system headers, implicit function declaration warnings, and runtime failures with shared library loading. The patches require substantial revisions to address these build and runtime issues before AIX support can be properly integrated.

讨论围绕IBM提交的PostgreSQL AIX支持补丁展开。Peter Eisentraut对使用GCC 12.3.0在AIX 7.3版本上的补丁集表示初步认可。然而，Andres Freund识别出重要问题，包括缺失mkldexport.sh脚本、meson配置中文件路径错误、对齐规则复杂性和过量调试输出。Tom Lane在AIX 7.3上测试补丁并发现关键问题：configure/autoconf不匹配、mkldexport.sh权限问题、系统头文件中truncate/truncate64宏的符号冲突、隐式函数声明警告以及共享库加载的运行时失败。在正确集成AIX支持之前，补丁需要大量修订以解决这些构建和运行时问题。

Participants - 参与者:
* andres@anarazel.de
* hlinnaka@iki.fi
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io

### **[Issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY](https://www.postgresql.org/message-id/CADzfLwWZjWqeX6fF5=iKq_PJiw7G+k01CBu5xB8X_Z+nN1gqqA@mail.gmail.com)**
The discussion focuses on a bug fix for ON CONFLICT UPDATE and REINDEX CONCURRENTLY operations. Mihail provides patches with fixes and suggests adding a syscache for pg_inherites, though he's not confident about it. Álvaro reviews the changes, appreciating the fixes and commit message but rewriting code comments for clarity. He's hesitant about the syscache addition and prefers not to pursue major architectural changes at this time. The conversation touches on alternative approaches like storing parent information in relcache or creating batched versions of functions, but Álvaro favors a less invasive bug fix that could potentially be backpatched rather than extensive rearchitecting.

讨论集中在修复ON CONFLICT UPDATE和REINDEX CONCURRENTLY操作的错误。Mihail提供了修复补丁并建议为pg_inherites添加syscache，但他对此不太确信。Álvaro审查了修改，赞赏修复内容和提交消息，但重写了代码注释以提高清晰度。他对syscache添加持谨慎态度，目前不倾向于进行重大架构更改。对话涉及将父级信息存储在relcache中或创建函数批处理版本等替代方案，但Álvaro倾向于选择侵入性较小的错误修复方案，这样可能便于后续回移，而不是进行大规模重构。

Participants - 参与者:
* alvherre@kurilemu.de
* exclusion@gmail.com
* michael@paquier.xyz
* mihailnikalayeu@gmail.com
* noah@leadboat.com

### **[docs: clarify ALTER TABLE behavior on partitioned tables]()**
Chao Li is refining documentation for ALTER TABLE behavior on partitioned tables through multiple review iterations. David Johnston and Zsolt Parragi provided detailed feedback on wording clarity, grammar corrections, and technical accuracy. Key improvements included clarifying constraint behavior, correcting statements about ONLY clause usage, and distinguishing between table renaming versus column/constraint renaming behaviors. David clarified that table renaming only affects the named table while column/constraint operations cascade to partitions implicitly. The discussion covered inheritance behavior, DROP COLUMN semantics for multi-parent scenarios, and property inheritance rules for new partitions. Through versions 7 and 8, the team refined language to avoid redundant mentions and improve readability. Zsolt identified a final typo correction needed. The patch addresses inconsistencies in existing documentation and provides clearer guidance on partition inheritance behavior, constraint dependencies, and ONLY clause limitations across different ALTER TABLE operations.

Chao Li正在通过多轮审查完善分区表ALTER TABLE行为的文档。David Johnston和Zsolt Parragi提供了关于措辞清晰度、语法修正和技术准确性的详细反馈。主要改进包括澄清约束行为、纠正关于ONLY子句使用的声明，以及区分表重命名与列/约束重命名行为。David澄清了表重命名只影响指定表，而列/约束操作会隐式级联到分区。讨论涵盖了继承行为、多父级场景的DROP COLUMN语义，以及新分区的属性继承规则。通过版本7和8，团队精炼语言以避免冗余提及并提高可读性。Zsolt发现了需要最终拼写错误修正。该补丁解决了现有文档的不一致性，为分区继承行为、约束依赖关系和不同ALTER TABLE操作中的ONLY子句限制提供更清晰的指导。

Participants - 参与者:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[unnecessary executor overheads around seqscans]()**


Participants - 参与者:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* hlinnaka@iki.fi
* robertmhaas@gmail.com

### **[Parallel CREATE INDEX for GIN indexes](https://www.postgresql.org/message-id/590a8f34-c743-47f5-b042-4b2941f87fdf@vondra.me)**
Tomas Vondra fixed a bug in parallel GIN index creation where the code incorrectly used b-tree comparison functions instead of GIN opclass comparison functions in tuplesort_begin_index_gin(). The issue was identified a year after a similar bug was fixed elsewhere in the code. The fix ensures proper sort functionality for GIN indexes during parallel builds. Additionally, Vondra addressed test coverage for parallel GIN index creation by adding regression tests that exercise the parallel code path, though complete coverage remains limited due to small data sizes in tests not triggering all code branches like trimming operations.
Tomas Vondra修复了并行GIN索引创建中的一个错误，该错误在tuplesort_begin_index_gin()中错误地使用了b-tree比较函数而不是GIN操作符类比较函数。这个问题在类似错误在代码其他地方修复一年后被发现。修复确保了并行构建期间GIN索引的正确排序功能。此外，Vondra通过添加回归测试来解决并行GIN索引创建的测试覆盖问题，这些测试执行并行代码路径，尽管由于测试中的小数据量无法触发所有代码分支（如修剪操作），完整覆盖仍然有限。

Participants - 参与者:
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* michael@paquier.xyz
* reshkekirill@gmail.com
* tomas@vondra.me

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/TY4PR01MB169076CE653659F8F8BC984729493A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
Discussion centers on fixing a race condition where newly created replication slots get invalidated by checkpoints during slot synchronization. Zhijie Hou addressed reviewer feedback on V4 patches by expanding comments explaining why both RedoRecPtr and slot minimum LSN are needed, clarifying test case comments, and removing DEBUG2 logging to reduce volume. Hayato Kuroda confirmed the fix works across all PostgreSQL versions, noting that the issue occurred before applying patches and was resolved afterward. The only difference in master branch is pg_sync_replication_slots() behavior change from commit 0d2d4a0, unrelated to this fix. Chao Li agreed V4 patches are solid but identified minor typos in commit messages and code comments requiring grammatical corrections like "race conditions" to "race condition" and adding "the" before "redo pointer".

讨论围绕修复一个竞态条件问题，即在槽位同步过程中新创建的复制槽会被检查点无效化。侯志杰在V4补丁中回应了审查员的反馈，扩展了解释为何需要RedoRecPtr和槽位最小LSN的注释，澄清了测试用例注释，并移除了DEBUG2日志以减少日志量。仓田早人确认修复在所有PostgreSQL版本中都有效，指出在应用补丁前会出现问题，应用后得到解决。主分支中唯一的差异是来自提交0d2d4a0的pg_sync_replication_slots()行为变化，与此修复无关。李超同意V4补丁是稳固的，但指出提交消息和代码注释中的小错误需要语法修正，如将"race conditions"改为"race condition"，在"redo pointer"前添加"the"。

Participants - 参与者:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/CAHGQGwGotoS0VeMDdK6ezkhvdQpWZ5oJvO3QKJKEV6Pc+rZ_9A@mail.gmail.com)**
Fujii Masao provides detailed feedback on the walsender shutdown patch. He suggests using LOG_SERVER_ONLY instead of WARNING for ereport to avoid blocking on full output buffers, but notes that proc_exit() could still emit messages at other levels. He proposes resetting whereToSendOutput like in WalSndShutdown(). Masao questions a comment about handling serial execution of parallel-planned scans, noting it may be outdated. He observes inconsistent statistics tracking between parallel and non-parallel seq scans. Alternative approaches are discussed, including having postmaster send SIGTERM to walsenders for immediate shutdown. Documentation improvements are suggested for clarity, parameter ordering, and config examples. Several code improvements are recommended: adding WalSndShutdownMode to typedefs.list, updating comments about shutdown behavior, and removing unnecessary abort() call. The feedback covers correctness concerns, consistency issues, and code maintenance aspects of the proposed changes.
藤井雅夫对 walsender 关闭补丁提供了详细反馈。他建议在 ereport 中使用 LOG_SERVER_ONLY 而不是 WARNING 来避免输出缓冲区满时的阻塞，但指出 proc_exit() 仍可能发出其他级别的消息。他提议像在 WalSndShutdown() 中那样重置 whereToSendOutput。雅夫质疑关于处理并行规划扫描的串行执行的注释，认为可能已过时。他观察到并行和非并行顺序扫描之间的统计跟踪不一致。讨论了替代方法，包括让 postmaster 向 walsenders 发送 SIGTERM 来实现立即关闭。建议改进文档的清晰度、参数排序和配置示例。推荐了几项代码改进：将 WalSndShutdownMode 添加到 typedefs.list、更新关于关闭行为的注释，以及移除不必要的 abort() 调用。反馈涵盖了所提议更改的正确性问题、一致性问题和代码维护方面。

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
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[AIX support](https://www.postgresql.org/message-id/f6c4e700-73b9-47e7-bf0b-ccb2b7020739@eisentraut.org)**
Srirama Kucherlapati from IBM submitted updated AIX support patches for PostgreSQL 19, testing on AIX 7.3 with GCC 12.3.0. Peter Eisentraut found the patches reasonable but requested confirmation of completeness and testing details. Andres Freund identified multiple issues: missing mkldexport.sh in meson patches, incorrect file paths, need for better patch testing, redundant debug output, and unclear alignment handling logic. He requested architectural improvements including proper commenting and code organization. Tom Lane tested the patches on GCC compile farm and found several critical problems: configure/configure.ac mismatches, permission issues with mkldexport.sh, a symbol naming conflict where AIX's truncate macro interferes with PostgreSQL's pgstat_count_slru_truncate function, missing function declarations, and runtime library loading failures preventing initdb execution. The libpq.so dependency issues suggest deeper linking problems requiring debugging.

IBM的Srirama Kucherlapati为PostgreSQL 19提交了更新的AIX支持补丁，在使用GCC 12.3.0的AIX 7.3上进行测试。Peter Eisentraut认为补丁合理，但要求确认完整性和测试细节。Andres Freund发现了多个问题：meson补丁中缺少mkldexport.sh、文件路径错误、需要更好的补丁测试、冗余的调试输出以及不清楚的对齐处理逻辑。他要求架构改进，包括适当的注释和代码组织。Tom Lane在GCC编译农场测试补丁时发现了几个关键问题：configure/configure.ac不匹配、mkldexport.sh的权限问题、符号命名冲突（AIX的truncate宏干扰PostgreSQL的pgstat_count_slru_truncate函数）、缺少函数声明，以及阻止initdb执行的运行时库加载失败。libpq.so依赖问题表明存在需要调试的更深层链接问题。


Participants - 参与者:
* andres@anarazel.de
* hlinnaka@iki.fi
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io

### **[Issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY](https://www.postgresql.org/message-id/CADzfLwWZjWqeX6fF5=iKq_PJiw7G+k01CBu5xB8X_Z+nN1gqqA@mail.gmail.com)**
Mihail submitted fixes for bugs in ON CONFLICT UPDATE and REINDEX CONCURRENTLY operations, providing patches as attachments. The fixes address snapshot consistency issues when getting partition ancestors during concurrent operations. Álvaro reviewed the changes and reworte code comments but found them generally acceptable. A second commit adding syscache for pg_inherits was proposed but deemed unnecessary for the current fix. Alternative approaches like storing parent information in relcache were considered but rejected as too invasive for this bug fix. Álvaro prefers a non-invasive solution that could potentially be backpatched later, with major architectural changes deferred.
Mihail为ON CONFLICT UPDATE和REINDEX CONCURRENTLY操作提交了漏洞修复，通过附件提供了补丁。修复解决了在并发操作期间获取分区祖先时的快照一致性问题。Álvaro审查了更改并重写了代码注释，但认为总体上是可接受的。提出了为pg_inherits添加syscache的第二个提交，但被认为对当前修复来说是不必要的。考虑了将父信息存储在relcache中等替代方案，但被认为对此漏洞修复过于侵入性而被拒绝。Álvaro倾向于可能稍后回移的非侵入性解决方案，将主要架构更改推迟。

Participants - 参与者:
* alvherre@kurilemu.de
* exclusion@gmail.com
* michael@paquier.xyz
* mihailnikalayeu@gmail.com
* noah@leadboat.com

### **[docs: clarify ALTER TABLE behavior on partitioned tables]()**
The discussion centers on refining documentation for ALTER TABLE behavior on partitioned tables. Chao Li iteratively updates the patch based on detailed feedback from David Johnston and Zsolt Parragi regarding wording, grammar, and technical accuracy. Key clarifications include how constraints are applied to partitioned tables, the behavior of ONLY keyword with different rename operations (distinguishing between table name vs column/constraint renaming), inheritance behavior for DROP COLUMN operations in multi-parent scenarios, and property inheritance when creating new partitions. The reviewers provide specific wording suggestions to improve clarity and consistency throughout the documentation. After multiple iterations addressing grammar issues, technical correctness, and style improvements, Zsolt identifies a final typo that gets corrected in version 8, with the patch appearing ready for integration.

讨论集中在完善分区表ALTER TABLE行为的文档说明。Chao Li根据David Johnston和Zsolt Parragi关于措辞、语法和技术准确性的详细反馈，迭代更新补丁。关键澄清包括约束如何应用到分区表、ONLY关键字在不同重命名操作中的行为（区分表名与列/约束重命名）、在多父级场景中DROP COLUMN操作的继承行为，以及创建新分区时的属性继承。审阅者提供具体的措辞建议以提高整个文档的清晰度和一致性。经过多次迭代解决语法问题、技术正确性和风格改进后，Zsolt识别出最后一个拼写错误，在版本8中得到纠正，补丁似乎已准备好集成。

Participants - 参与者:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[unnecessary executor overheads around seqscans]()**


Participants - 参与者:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* hlinnaka@iki.fi
* robertmhaas@gmail.com

### **[Parallel CREATE INDEX for GIN indexes](https://www.postgresql.org/message-id/590a8f34-c743-47f5-b042-4b2941f87fdf@vondra.me)**
Tomas Vondra fixed two issues in parallel GIN index creation. First, he corrected tuplesort_begin_index_gin() which was incorrectly using b-tree operators instead of GIN opclass comparison functions for sorting. Second, he added regression test coverage for parallel GIN builds by modifying existing tests to create GIN indexes in parallel, improving code coverage significantly. Both patches were pushed and backpatched to PostgreSQL 18. The discussion confirmed that the original comment about "serially executing a scan that was planned to be parallel" was incorrect and not applicable to current implementation.

Tomas Vondra修复了并行GIN索引创建中的两个问题。首先，他纠正了tuplesort_begin_index_gin()函数，该函数错误地使用了b-tree操作符而不是GIN操作类的比较函数进行排序。其次，他通过修改现有测试来并行创建GIN索引，为并行GIN构建添加了回归测试覆盖，显著提高了代码覆盖率。两个补丁都已推送并反向移植到PostgreSQL 18。讨论确认了关于"串行执行计划为并行的扫描"的原始注释是错误的，不适用于当前实现。

Participants - 参与者:
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* michael@paquier.xyz
* reshkekirill@gmail.com
* tomas@vondra.me

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/TY4PR01MB169076CE653659F8F8BC984729493A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
The discussion addresses a race condition where newly created replication slots may be immediately invalidated by concurrent checkpoints during slot synchronization. Zhijie Hou submitted V4 patches after addressing Amit Kapila's feedback, including expanded comments explaining why both redo pointer and slot minimum LSN are needed for determining non-removable LSN, clearer test case descriptions, and removal of unnecessary DEBUG2 logging. Hayato Kuroda confirmed the patches fix the issue across all versions through testing with reproducers, noting that the fix prevents slots from being invalidated immediately after synchronization. The patches calculate a minimum safe LSN by comparing the redo pointer with slot minimum LSN to ensure WAL required by slots isn't removed before synchronization completes. Chao Li provided final review feedback identifying minor typos in commit messages and code comments that need correction before the patches are ready for commit.

该讨论解决了一个竞态条件问题，即新创建的复制槽可能在槽同步期间被并发检查点立即失效。侯志杰在解决了Amit Kapila的反馈后提交了V4补丁，包括扩展注释解释为什么需要重做指针和槽最小LSN来确定不可移除的LSN，更清晰的测试用例描述，以及删除不必要的DEBUG2日志。黑田隼人通过使用重现器测试确认补丁修复了所有版本中的问题，指出修复防止了槽在同步后立即失效。补丁通过比较重做指针与槽最小LSN来计算最小安全LSN，确保槽所需的WAL在同步完成前不会被删除。李超提供了最终审查反馈，识别了提交消息和代码注释中需要在补丁准备提交前纠正的小错误。

Participants - 参与者:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/CAHGQGwGotoS0VeMDdK6ezkhvdQpWZ5oJvO3QKJKEV6Pc+rZ_9A@mail.gmail.com)**
Fujii Masao provides detailed technical feedback on Andrey Silitskiy's patch for walsender immediate shutdown. The original problem occurred when walsender's output buffer was full and ereport() tried to send a message during immediate shutdown, causing the process to hang. Silitskiy changed the log level to LOG_SERVER_ONLY to prevent sending messages to replicas. Masao raises concerns about proc_exit() potentially sending additional messages and suggests resetting whereToSendOutput. He proposes an alternative SIGTERM-based approach where postmaster sends SIGTERM to walsenders. Masao provides extensive documentation suggestions, including clarifying wait_flush benefits for switchovers, updating parameter ordering and comments, correcting enum indentation in typedefs.list, and fixing misleading comments about WalSndDoneImmediate(). He notes the abort() call seems unnecessary and questions whether the function should be called under got_STOPPING=true conditions.
藤井雅夫对Andrey Silitskiy的walsender立即关闭补丁提供详细技术反馈。原问题发生在walsender的输出缓冲区已满，而ereport()在立即关闭期间试图发送消息，导致进程挂起。Silitskiy将日志级别改为LOG_SERVER_ONLY以防止向副本发送消息。雅夫担心proc_exit()可能发送额外消息，建议重置whereToSendOutput。他提出基于SIGTERM的替代方案，让postmaster向walsenders发送SIGTERM。雅夫提供大量文档建议，包括阐明wait_flush对切换的好处、更新参数顺序和注释、在typedefs.list中修正枚举缩进、修复关于WalSndDoneImmediate()的误导性注释。他指出abort()调用似乎不必要，质疑该函数是否应在got_STOPPING=true条件下调用。

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
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[AIX support](https://www.postgresql.org/message-id/f6c4e700-73b9-47e7-bf0b-ccb2b7020739@eisentraut.org)**
Peter Eisentraut reviewed the AIX support patches and found them reasonable. Srirama confirmed this is the complete patch set needed for AIX support, tested on AIX 73F with gcc-12. However, Andres Freund identified significant issues: missing mkldexport.sh script in the meson patch, wrong file path references, missing gen_export.pl changes, questionable _H_FLOAT flag usage, and problems with the alignment calculation approach on AIX. Tom Lane tested the complete patch and discovered additional problems: configuration mismatches, permission issues, linker symbol conflicts from truncate/truncate64 naming collisions, implicit function declaration warnings, and shared library loading failures preventing initdb from running.

Peter Eisentraut审查了AIX支持补丁并认为其合理。Srirama确认这是AIX支持所需的完整补丁集，在AIX 73F上使用gcc-12进行测试。然而，Andres Freund发现了重大问题：meson补丁中缺少mkldexport.sh脚本、错误的文件路径引用、缺少gen_export.pl变更、可疑的_H_FLOAT标志用法以及AIX上对齐计算方法的问题。Tom Lane测试了完整补丁并发现了其他问题：配置不匹配、权限问题、由于truncate/truncate64命名冲突导致的链接器符号冲突、隐式函数声明警告以及共享库加载失败导致initdb无法运行。

Participants - 参与者:
* andres@anarazel.de
* hlinnaka@iki.fi
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io

### **[Issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY](https://www.postgresql.org/message-id/CADzfLwWZjWqeX6fF5=iKq_PJiw7G+k01CBu5xB8X_Z+nN1gqqA@mail.gmail.com)**
Mihail provided patches to address issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY operations involving partitioned tables. The fixes include moving initialization checks and adding syscache for pg_inherits, though the latter is not immediately needed. Álvaro reviewed the patches positively and improved the commit message and code comments, expressing approval of the first commit while being cautious about the syscache optimization and suggesting it can be evaluated later. The discussion also touched on alternative approaches like storing parent information in relcache or creating batched versions of get_partition_ancestors, but both agreed to implement a minimally invasive fix first, with major architectural changes deferred to avoid complexity under time pressure.

米哈伊尔提供了补丁来解决涉及分区表的ON CONFLICT UPDATE和REINDEX CONCURRENTLY操作的问题。修复包括移动初始化检查和为pg_inherits添加syscache，尽管后者并非立即需要。阿尔瓦罗积极评审了补丁并改进了提交消息和代码注释，对第一个提交表示赞同，但对syscache优化保持谨慎，建议以后再评估。讨论还涉及在relcache中存储父表信息或创建get_partition_ancestors批处理版本等替代方案，但双方都同意首先实施微创修复，将重大架构变更推迟以避免在时间压力下的复杂性。

Participants - 参与者:
* alvherre@kurilemu.de
* exclusion@gmail.com
* michael@paquier.xyz
* mihailnikalayeu@gmail.com
* noah@leadboat.com

### **[docs: clarify ALTER TABLE behavior on partitioned tables]()**
David Rowley and other PostgreSQL hackers are discussing documentation improvements for ALTER TABLE behavior on partitioned tables. The patch (version 8) clarifies how various ALTER TABLE commands behave when applied to partitioned tables versus individual partitions. Key changes include explaining when the ONLY clause is permitted, when operations cascade to partitions, and what properties are inherited by new partitions.

Through multiple iterations, reviewers (David Johnston and Zsolt Parragi) provided detailed feedback on grammar, clarity, and technical accuracy. Specific improvements include fixing constraint dropping behavior documentation, correcting the description of column renaming restrictions, and updating the inheritance behavior description for DROP COLUMN operations. The discussion also covers edge cases like multi-parent inheritance scenarios where columns can be both dependent and independently defined.

The latest version addresses a typo identified by Zsolt Parragi and appears ready for final review. The patch aims to reduce confusion about partitioned table behavior by clearly documenting what operations propagate automatically versus requiring explicit action on individual partitions.

David Rowley和其他PostgreSQL黑客正在讨论改进分区表上ALTER TABLE行为的文档。补丁（第8版）澄清了各种ALTER TABLE命令应用于分区表与单个分区时的行为方式。关键更改包括解释何时允许ONLY子句、操作何时级联到分区，以及新分区继承哪些属性。

通过多次迭代，审阅者（David Johnston和Zsolt Parragi）就语法、清晰度和技术准确性提供了详细反馈。具体改进包括修复约束删除行为文档、纠正列重命名限制描述，以及更新DROP COLUMN操作的继承行为描述。讨论还涵盖了多父继承场景等边缘情况，其中列可能既依赖又独立定义。

最新版本解决了Zsolt Parragi发现的拼写错误，似乎已准备好进行最终审查。该补丁旨在通过清楚地记录哪些操作自动传播与需要对单个分区显式操作来减少对分区表行为的混淆。

Participants - 参与者:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/TY4PR01MB169076CE653659F8F8BC984729493A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
Zhijie Hou (Fujitsu) addressed feedback from Amit Kapila on a patch to fix replication slot invalidation by checkpoints. The issue occurs when a newly created slot's restart_lsn precedes the redo pointer, creating a race condition. Hou updated the patch to address code comments, improve test case descriptions, and remove excessive debug logging. Hayato Kuroda confirmed the fix works across versions and resolves the reported issue. Chao Li provided minor feedback on typos in the commit message and suggested adding "the" before "redo pointer" in comments. The V4 patches appear ready for all branches.

侯志杰（富士通）回应了Amit Kapila对修复检查点导致复制槽失效问题的补丁反馈。当新建槽的restart_lsn早于重做指针时会出现竞争条件。侯志杰更新了补丁，改进了代码注释、测试用例描述，并移除了过多的调试日志。黑田隼人确认修复在所有版本中有效。李超对提交信息中的拼写错误和注释用词提出了小建议。V4版本补丁看起来已准备好用于所有分支。

Participants - 参与者:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/CAHGQGwGotoS0VeMDdK6ezkhvdQpWZ5oJvO3QKJKEV6Pc+rZ_9A@mail.gmail.com)**
Fujii Masao reviews a proposed patch for walsender immediate shutdown. He addresses log level changes, questions about comment accuracy, proposes a SIGTERM-based alternative approach, and provides extensive documentation feedback. He notes potential buffer overflow issues and suggests improvements to GUC ordering, code formatting, and comment clarity throughout the patch.

藤井雅男审查了关于walsender立即关闭的补丁提案。他讨论了日志级别更改，质疑注释的准确性，提出了基于SIGTERM的替代方法，并提供了广泛的文档反馈。他指出了潜在的缓冲区溢出问题，并建议改进GUC排序、代码格式以及补丁中的注释清晰度。

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
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[AIX support](https://www.postgresql.org/message-id/f6c4e700-73b9-47e7-bf0b-ccb2b7020739@eisentraut.org)**
Srirama Kucherlapati from IBM submitted patches for PostgreSQL AIX support, testing on AIX 7.3 with gcc-12. Peter Eisentraut provided initial positive feedback. Andres Freund identified several critical issues: missing mkldexport.sh file in meson patches, incorrect file path references, untested patches, unclear float header handling with -D_H_FLOAT flag, problematic AIX alignment rules handling, redundant variable naming from autoconf, and excessive debug output. Tom Lane tested the patches on GCC compile farm and found additional problems: configure/configure.ac mismatch, permission issues with mkldexport.sh, truncate function name collision with system header macros causing build failures, missing function declarations for getpeereid and wcstombs_l, and runtime failures with libpq.so loading. The patches require significant rework to address build system integration, naming conflicts, and runtime linking issues.

IBM的Srirama Kucherlapati提交了PostgreSQL AIX支持补丁，在AIX 7.3上使用gcc-12进行测试。Peter Eisentraut给出了初步积极反馈。Andres Freund发现了几个关键问题：meson补丁中缺少mkldexport.sh文件、文件路径引用错误、补丁未经测试、-D_H_FLOAT标志的浮点头文件处理不明确、AIX对齐规则处理有问题、autoconf的冗余变量命名以及过多的调试输出。Tom Lane在GCC编译农场测试了补丁，发现了额外问题：configure/configure.ac不匹配、mkldexport.sh权限问题、truncate函数名与系统头文件宏冲突导致构建失败、getpeereid和wcstombs_l函数声明缺失，以及libpq.so加载的运行时故障。补丁需要大量重新设计以解决构建系统集成、命名冲突和运行时链接问题。

Participants - 参与者:
* andres@anarazel.de
* hlinnaka@iki.fi
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io

### **[Issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY](https://www.postgresql.org/message-id/CADzfLwWZjWqeX6fF5=iKq_PJiw7G+k01CBu5xB8X_Z+nN1gqqA@mail.gmail.com)**
Mihail Nikalayeu provided fixes for issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY in an attached patch. The patches address table scan behavior and include a second commit adding syscache for pg_inherits. Álvaro Herrera reviewed the changes and found the commit message good but rewrote code comments for clarity. He expressed hesitation about the syscache addition, preferring not to pursue it immediately, and suggested avoiding major rearchitecting in favor of a reasonably non-invasive bug fix that could potentially be backpatched. Mihail agreed with Álvaro's comment improvements and indicated he would measure performance impact of the syscache changes later. The discussion focused on balancing bug fixes with code complexity while maintaining backwards compatibility.

Mihail Nikalayeu为ON CONFLICT UPDATE和REINDEX CONCURRENTLY的问题提供了修复补丁。补丁解决了表扫描行为问题，并包含了为pg_inherits添加syscache的第二个提交。Álvaro Herrera审查了更改，认为提交消息很好但重写了代码注释以提高清晰度。他对syscache添加表示犹豫，倾向于暂时不推进此功能，建议避免重大架构调整，而是采用相对非侵入性的错误修复方法，这样可能可以向后移植。Mihail同意Álvaro的注释改进，并表示稍后会测量syscache更改的性能影响。讨论集中在平衡错误修复与代码复杂性的同时保持向后兼容性。

Participants - 参与者:
* alvherre@kurilemu.de
* exclusion@gmail.com
* michael@paquier.xyz
* mihailnikalayeu@gmail.com
* noah@leadboat.com

### **[docs: clarify ALTER TABLE behavior on partitioned tables]()**
This patch documentation review discusses improvements to clarify ALTER TABLE behavior on partitioned tables. The main changes include reorganizing documentation to be more consistent, fixing grammatical errors, and clarifying when operations cascade to child partitions versus when ONLY prevents propagation. Key updates cover adding constraints to partitions, dropping constraints from partitioned tables (noting that dropping inherited constraints from individual partitions is not allowed), and refining language around table renaming versus column/constraint renaming behaviors. The discussion resolves issues about redundant text, corrects inaccurate comments about parallel scan execution, and improves documentation of inheritance scenarios with multiple parents. Zsolt Parragi provided a final typo correction (constaint -> constraint), and the patch reached v8 with broad approval.

该补丁文档审查讨论了改进分区表上ALTER TABLE行为说明的内容。主要更改包括重新组织文档使其更一致、修复语法错误，以及澄清何时操作级联到子分区与何时ONLY阻止传播。关键更新涵盖向分区添加约束、从分区表删除约束（注意不允许从单个分区删除继承的约束），以及细化表重命名与列/约束重命名行为的语言描述。讨论解决了冗余文本问题、纠正了关于并行扫描执行的不准确注释，并改进了多父级继承场景的文档。Zsolt Parragi提供了最终的拼写错误更正（constaint -> constraint），补丁达到v8版本并获得广泛认可。

Participants - 参与者:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[unnecessary executor overheads around seqscans]()**


Participants - 参与者:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* hlinnaka@iki.fi
* robertmhaas@gmail.com

### **[Parallel CREATE INDEX for GIN indexes](https://www.postgresql.org/message-id/590a8f34-c743-47f5-b042-4b2941f87fdf@vondra.me)**
Tomas Vondra reported resolving a bug fix and test coverage issue for parallel GIN index creation. The fix addressed incorrect use of b-tree operator lookup instead of GIN opclass comparison function in tuplesort_begin_index_gin(). This bug could cause errors when no b-tree opclass exists or disagreement between btree/gin opclasses on ordering. Two patches were implemented: 0001 fixed the operator lookup issue, and 0002 added regression tests to improve code coverage for parallel GIN builds by tweaking existing tests to build GIN indexes in parallel. Both patches were pushed and backpatched to version 18. The discussion resolved questions about a potentially outdated comment regarding serial execution of parallel-planned scans.

Tomas Vondra报告解决了并行GIN索引创建的错误修复和测试覆盖问题。修复解决了tuplesort_begin_index_gin()中错误使用b-tree操作符查找而非GIN opclass比较函数的问题。此错误可能在没有b-tree opclass或btree/gin opclass在排序上存在分歧时导致错误。实现了两个补丁：0001修复了操作符查找问题，0002通过调整现有测试以并行构建GIN索引来添加回归测试，改善并行GIN构建的代码覆盖率。两个补丁均已推送并向后移植到版本18。讨论解决了关于并行计划扫描串行执行的可能过时注释的问题。

Participants - 参与者:
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* michael@paquier.xyz
* reshkekirill@gmail.com
* tomas@vondra.me