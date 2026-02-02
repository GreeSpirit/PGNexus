---
layout: post
title: PostgreSQL Daily News 2026-01-30
---

# PostgreSQL Daily News#35 2026-01-30







## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[Proposal: Cascade REPLICA IDENTITY changes to leaf partitions](https://www.postgresql.org/message-id/25034397-BBCD-4642-A86B-2811FC82DC64@gmail.com)**
Chao Li investigated a server crash that occurred during partition attachment in v3 of the REPLICA IDENTITY cascade patch. The crash involved a buffer lock assertion failure in bufmgr.c during btree operations, but Li can no longer reproduce it. He noted that the problematic Assert was removed by commit 333f58637. With the crash resolved, the original DEADLOCK issue from Dmitry Dolgov's test case has reappeared. Li confirmed through testing that this deadlock is not specific to the current patch but occurs with ATTACH PARTITION operations on the master branch, indicating it's a broader PostgreSQL issue. He plans to start a separate thread to address the deadlock problem independently from the REPLICA IDENTITY cascade proposal.

Chao Li调查了在REPLICA IDENTITY级联补丁v3版本中分区附加过程中发生的服务器崩溃。崩溃涉及bufmgr.c中btree操作期间的缓冲区锁断言失败，但Li无法再重现该问题。他注意到有问题的断言已被提交333f58637移除。随着崩溃问题的解决，Dmitry Dolgov测试用例中的原始DEADLOCK问题重新出现。Li通过测试确认这个死锁问题不是当前补丁特有的，而是在主分支上使用ATTACH PARTITION操作时就会发生，表明这是一个更广泛的PostgreSQL问题。他计划启动一个单独的线程来独立解决死锁问题，与REPLICA IDENTITY级联提案分开处理。

Participants - 参与者:
* 9erthalion6@gmail.com
* alvherre@kurilemu.de
* amit.kapila16@gmail.com
* euler@eulerto.com
* houzj.fnst@fujitsu.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* peter@eisentraut.org
* robertmhaas@gmail.com

### **[AIX support](https://www.postgresql.org/message-id/1129240.1769650597@sss.pgh.pa.us)**
The PostgreSQL team is working to restore AIX support, addressing both alignment issues and build system problems. Tom Lane posted a draft patch to remove the assumption that int64 and double have the same alignment requirement, urging focus due to v19 time constraints. The IBM team is integrating this patch with their changes. A significant build issue emerged involving incorrect include paths where src/include/utils was being included directly, causing confusion between system float.h and PostgreSQL's utils/float.h headers. Andres Freund and Robert Haas identified this as wrong and suggested fixing it by symlinking generated files like wait_event_funcs_data.c into src/include/utils, similar to existing patterns for guc_tables.inc.c. Álvaro Herrera confirmed the fix works. Michael Paquier agreed to work on a proper patch, while Tom Lane suggested backpatching the include-path cleanup to prevent similar issues on other platforms.

PostgreSQL团队正在努力恢复AIX支持，解决对齐问题和构建系统问题。Tom Lane发布了一个草案补丁，用于移除int64和double具有相同对齐要求的假设，由于v19时间限制而敦促重点关注。IBM团队正在将此补丁与他们的更改集成。出现了一个重大构建问题，涉及错误的包含路径，其中直接包含src/include/utils，导致系统float.h和PostgreSQL的utils/float.h头文件之间的混淆。Andres Freund和Robert Haas认为这是错误的，建议通过将生成的文件如wait_event_funcs_data.c符号链接到src/include/utils来修复，类似于guc_tables.inc.c的现有模式。Álvaro Herrera确认修复有效。Michael Paquier同意制作一个适当的补丁，而Tom Lane建议反向移植包含路径清理以防止其他平台上的类似问题。

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
* tgl@sss.pgh.pa.us
* tristan@partin.io

### **[split tablecmds\.c](https://www.postgresql.org/message-id/aXvchz4c-_9eFzNW@nathan)**
Nathan Bossart is working on a patch to split PostgreSQL's tablecmds.c file by moving partitioning-related code to a new file called tablecmds_partition.c. The refactoring also involves creating a tablecmds_internal.h header file to expose necessary functions and data structures from tablecmds.c that the partitioning code requires. Nathan acknowledges that the patch is still in a relatively rough state and needs further refinement. In a follow-up message, he provided an updated version attempting to fix headerscheck issues that were likely identified during testing. This refactoring effort appears aimed at improving code organization and maintainability by separating partitioning functionality from the main table commands implementation.

Nathan Bossart正在开发一个补丁，通过将分区相关代码移动到名为tablecmds_partition.c的新文件中来拆分PostgreSQL的tablecmds.c文件。这次重构还涉及创建tablecmds_internal.h头文件，以从tablecmds.c中暴露分区代码所需的必要函数和数据结构。Nathan承认补丁仍处于相对粗糙的状态，需要进一步完善。在后续消息中，他提供了一个更新版本，试图修复在测试期间可能发现的headerscheck问题。这项重构工作似乎旨在通过将分区功能从主表命令实现中分离出来，改善代码组织和可维护性。

Participants - 参与者:
* alvherre@kurilemu.de
* amitlangote09@gmail.com
* andres@anarazel.de
* euler@eulerto.com
* michael@paquier.xyz
* nathandbossart@gmail.com
* tgl@sss.pgh.pa.us

### **[Optional skipping of unchanged relations during ANALYZE?](https://www.postgresql.org/message-id/CAE2r8H5ZYiFxYzhWDAyHO1jxSn7oB-9hPV8VdhAkkJjCwfg0HQ@mail.gmail.com)**
VASUKI M has posted a v3 patch introducing an ANALYZE (MISSING_STATS) option that analyzes only relations currently lacking statistics entries in pg_statistic. The feature aims to reduce unnecessary work when running ANALYZE over many relations while preserving default behavior. Ilia Evdokimov identified technical issues: MISSING_STATS shares the same bit value as FREEZE (0x08) and the check placement in analyze_rel() occurs too early before proper validation. Sami Imseih suggests the behavior doesn't match vacuumdb --missing-stats-only and proposes implementing direct syscache lookups in C using examine_attribute() helpers, recommending the name MISSING_STATS_ONLY instead. Corey Huinker notes complications with extended statistics for expressions that may affect the definition of "missing" stats. The discussion reveals ongoing complexity around what constitutes missing statistics and coordination with vacuumdb functionality.

VASUKI M发布了v3补丁，引入了ANALYZE (MISSING_STATS)选项，该选项仅分析当前在pg_statistic中缺少统计条目的关系。该功能旨在减少对多个关系运行ANALYZE时的不必要工作，同时保留默认行为。Ilia Evdokimov发现了技术问题：MISSING_STATS与FREEZE共享相同的位值(0x08)，并且在analyze_rel()中的检查位置过早，在适当验证之前就执行了。Sami Imseih建议该行为与vacuumdb --missing-stats-only不匹配，提议使用examine_attribute()辅助函数在C中实现直接syscache查找，建议使用MISSING_STATS_ONLY命名。Corey Huinker指出表达式扩展统计的复杂性可能影响"缺失"统计的定义。讨论揭示了围绕什么构成缺失统计以及与vacuumdb功能协调的持续复杂性。

Participants - 参与者:
* corey.huinker@gmail.com
* dgrowleyml@gmail.com
* ilya.evdokimov@tantorlabs.com
* myon@debian.org
* rob@xzilla.net
* robertmhaas@gmail.com
* samimseih@gmail.com
* vasukianand0119@gmail.com

### **[Pasword expiration warning](https://www.postgresql.org/message-id/MEAPR01MB3031CF12043573A245D931AAB69EA@MEAPR01MB3031.ausprd01.prod.outlook.com)**
The discussion centers on Gilles Darold's patch implementing password expiration warnings for PostgreSQL connections. The patch adds a new GUC parameter `password_expire_warning` (defaulting to 7 days) that triggers warnings when users connect within the specified timeframe before their password expires.

Key feedback includes: Zsolt Parragi suggests examining the GoAway protocol patch for related functionality and raises concerns about memory context usage, missing serialization handling, and the usefulness of day-only precision for imminent expirations. Japin Li questions memory context choices and responds to various technical suggestions. Nathan Bossart argues against enabling warnings by default, suggests removing the 30-day maximum limit, and recommends more precise expiration timing (hours/minutes) rather than just days. He also notes potential synergy with MD5 password warnings.

Gilles agrees to implement more precise timing, remove the maximum limit, and addresses various technical concerns. Zsolt emphasizes the connection to password expiration enforcement patches, suggesting periodic reminders during active connections rather than just connection-time warnings. The discussion reveals ongoing consideration of related authentication security features.

讨论围绕Gilles Darold的密码过期警告补丁展开，该补丁为PostgreSQL连接实现了密码过期警告功能。补丁添加了新的GUC参数`password_expire_warning`（默认7天），当用户在密码过期前指定时间范围内连接时触发警告。

主要反馈包括：Zsolt Parragi建议查看GoAway协议补丁的相关功能，并对内存上下文使用、缺失的序列化处理以及仅显示天数对即将到期密码的实用性表示关切。Japin Li质疑内存上下文选择并回应各种技术建议。Nathan Bossart反对默认启用警告，建议移除30天最大限制，并推荐更精确的过期时间（小时/分钟）而非仅显示天数。他还注意到与MD5密码警告的潜在协同作用。

Gilles同意实施更精确的时间显示、移除最大限制并解决各种技术问题。Zsolt强调与密码过期强制执行补丁的连接，建议在活动连接期间提供定期提醒而非仅在连接时警告。讨论揭示了对相关身份验证安全功能的持续考虑。

Participants - 参与者:
* andrew@dunslane.net
* bossartn@amazon.com
* gilles@darold.net
* japinli@hotmail.com
* liuxh.zj.cn@gmail.com
* nathandbossart@gmail.com
* niushiji@gmail.com
* shiyuefei1004@gmail.com
* tgl@sss.pgh.pa.us
* tsinghualucky912@foxmail.com
* zsolt.parragi@percona.com

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/q2o7rfmkcvqhj7ttimno33mb7lklybj6aanliertmfr4g7g7zn@w4cat7zimc5c)**
The discussion centers on fixing a buffer locking assertion failure that occurs when trying to conditionally acquire a lock on a buffer already locked by the same backend. Andres Freund investigated crashes in SPGist and nbtree indexing, discovering the issue relates to Free Space Map (FSM) interactions where pages are marked empty but actually contain data. The root cause involves race conditions between vacuum operations and page reuse mechanisms, particularly with SPGistSetLastUsedPage() and FSM updates happening at different times. Andres proposed removing the problematic assertion and defining that conditional lock acquisition on already-locked buffers should always fail, regardless of lock mode compatibility. Tom Lane endorsed this approach, agreeing that supporting multiple buffer locks would add unwanted complexity. Peter Geoghegan confirmed experiencing similar failures during index prefetching work. The fix was ultimately pushed to resolve the assertion failures.

讨论的焦点是修复一个缓冲区锁定断言失败问题，该问题发生在尝试对同一后端已锁定的缓冲区进行条件锁定获取时。Andres Freund调查了SPGist和nbtree索引中的崩溃问题，发现问题与Free Space Map (FSM)交互有关，其中页面被标记为空但实际上包含数据。根本原因涉及vacuum操作和页面重用机制之间的竞争条件，特别是SPGistSetLastUsedPage()和FSM更新发生在不同时间。Andres提议移除有问题的断言，并定义对已锁定缓冲区的条件锁定获取应始终失败，无论锁定模式兼容性如何。Tom Lane支持这种方法，同意支持多个缓冲区锁定会增加不必要的复杂性。Peter Geoghegan证实在索引预取工作期间遇到了类似的失败。最终推送了修复程序以解决断言失败问题。

Participants - 参与者:
* andres@anarazel.de
* boekewurm+postgres@gmail.com
* exclusion@gmail.com
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* michael.paquier@gmail.com
* noah@leadboat.com
* pg@bowt.ie
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CALDaNm2MZU8-JbFruQAxF8OZfcH4ZsBrCsWDg3VMbO-P+xKmBg@mail.gmail.com)**
Vignesh addresses feedback from shveta malik regarding the EXCEPT TABLE publication patch. Shveta identified remnants of Approach 3 implementation still present in the Approach 1 code, including partition handling logic and error checking. She also questioned whether only the topmost ancestor should be checked for EXCEPT lists, suggesting any ancestor should prevent partition publishing. Additionally, she reported that incremental replication is failing with the current implementation. Vignesh responds by releasing v38 patches that separate the two approaches: one patch provides the base functionality while separate patches implement either Approach 1 or Approach 3 partition handling. Peter Smith updates the commitfest entry title to reflect the narrowed scope (removing column-list support) and notes that the current patch structure breaks the CF bot since it attempts to apply conflicting approach patches simultaneously.

Vignesh回应了shveta malik对EXCEPT TABLE发布补丁的反馈。shveta发现在Approach 1代码中仍然存在Approach 3实现的残余部分，包括分区处理逻辑和错误检查。她还质疑是否应该只检查最顶层祖先的EXCEPT列表，建议任何祖先都应该阻止分区发布。此外，她报告当前实现的增量复制失败。Vignesh通过发布v38补丁来回应，将两种方法分离：一个补丁提供基础功能，而单独的补丁实现Approach 1或Approach 3的分区处理。Peter Smith更新了commitfest条目标题以反映缩小的范围（移除column-list支持），并指出当前的补丁结构破坏了CF bot，因为它试图同时应用冲突的方法补丁。

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

### **[Document NULL](https://www.postgresql.org/message-id/CAB-JLwbJz06-H-F2nYBKsGaqNB9aDhT4on-Anhw40Tq-9YoTGg@mail.gmail.com)**
David G. Johnston is working on documenting NULL behavior in PostgreSQL and shared a patch that changes the \pset display null value from \N to "Null" for better readability. Marcos Pegoraro reviewed the documentation changes and identified several inconsistencies in the null value representations throughout the examples. Some instances show "null" (lowercase) instead of "Null" (uppercase), and column aliases use inconsistent naming conventions (NULL, N, or Null). Marcos suggested standardizing all null representations to uppercase and offered to help make these corrections given the large number of instances that need fixing. David acknowledged the review feedback and confirmed he is working through all examples again to properly clean up the inconsistent null value displays.

David G. Johnston正在为PostgreSQL编写NULL行为的文档，并分享了一个补丁，将\pset显示的null值从\N改为"Null"以提高可读性。Marcos Pegoraro审查了文档更改，发现在整个示例中null值表示存在多个不一致的地方。一些实例显示"null"（小写）而不是"Null"（大写），列别名使用不一致的命名约定（NULL、N或Null）。Marcos建议将所有null表示标准化为大写，并主动提出帮助进行这些更正，因为需要修复的实例数量很多。David确认了审查反馈，并表示他正在重新处理所有示例以正确清理不一致的null值显示。

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

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/2b09fba6-6b71-497a-96ef-a6947fcc39f6@gmail.com)**
Alexander Lakhin reports a test failure in the pg_visibility extension after Melanie Plageman pushed commits 21796c267. The buildfarm animal scorpion detected instability where the test expects visibility map summary (1,1) but gets (0,0), and page header shows 'f' instead of 't'. Kirill Reshke reproduced the issue locally and identified the root cause: autovacuum runs before vacuum freeze, acquiring xid 118518, then the test insert gets xid 118519, but vacuum freeze computes cutoff xid 118518 (based on oldest xmin from autovacuum), preventing tuple freezing. Kirill suggests either removing the regression test changes and rewriting as a TAP test with autovacuum control, or Melanie proposes disabling autovacuum on the test table using "with (autovacuum_enabled = false)" to prevent interference.

Alexander Lakhin报告pg_visibility扩展中的测试失败，在Melanie Plageman推送提交21796c267后出现。buildfarm动物scorpion检测到不稳定性，测试期望可见性映射摘要为(1,1)但得到(0,0)，页面头部显示'f'而不是't'。Kirill Reshke在本地重现了该问题并确定根本原因：autovacuum在vacuum freeze之前运行，获取xid 118518，然后测试插入获得xid 118519，但vacuum freeze计算截止xid为118518（基于来自autovacuum的最老xmin），阻止元组冻结。Kirill建议要么删除回归测试更改并重写为带有autovacuum控制的TAP测试，要么Melanie提议在测试表上使用"with (autovacuum_enabled = false)"禁用autovacuum以防止干扰。

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

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/1136161.1769654478@sss.pgh.pa.us)**
Robert Haas committed the pg_plan_advice patch after reorganizing the series, but several issues emerged immediately. Tom Lane reported a Valgrind error from the skink buildfarm showing uninitialized values in cost_material() called from materialize_finished_plan(). Zsolt Parragi noticed an accidental duplicate line in the committed code. Richard Guo identified a potential null pointer dereference in reparameterize_path() and questioned why cost_material() needs an "enabled" parameter. Lukas Fittl suggested zero-initializing the dummy Path structure to prevent initialization issues. Robert Haas pushed a minimal fix in commit 4020b370f214315b8c10430301898ac21658143f addressing the reported bugs, while explaining the design rationale behind the "enabled" parameter in cost_material(). David Johnston provided documentation review suggestions. The discussion focuses on fixing initialization bugs and clarifying the materialization path logic.

Robert Haas在重新组织补丁系列后提交了pg_plan_advice补丁，但立即出现了几个问题。Tom Lane报告了来自skink构建农场的Valgrind错误，显示在从materialize_finished_plan()调用的cost_material()中存在未初始化的值。Zsolt Parragi注意到提交代码中有一行意外重复。Richard Guo识别出reparameterize_path()中潜在的空指针解引用问题，并质疑为什么cost_material()需要"enabled"参数。Lukas Fittl建议对虚拟Path结构进行零初始化以防止初始化问题。Robert Haas在提交4020b370f214315b8c10430301898ac21658143f中推送了最小修复来解决报告的错误，同时解释了cost_material()中"enabled"参数的设计原理。David Johnston提供了文档审查建议。讨论重点是修复初始化错误和澄清物化路径逻辑。

Participants - 参与者:
* david.g.johnston@gmail.com
* di@nmfay.com
* guofenglinux@gmail.com
* jacob.champion@enterprisedb.com
* jakub.wartak@enterprisedb.com
* lukas@fittl.com
* matheusssilv97@gmail.com
* robertmhaas@gmail.com
* tgl@sss.pgh.pa.us
* zsolt.parragi@percona.com

### **[\[PATCH\] Add max\_logical\_replication\_slots GUC](https://www.postgresql.org/message-id/73e3649ecec2b31c1b31b222c8b1d3aede283149.camel@oopsware.de)**
The discussion centers around adding a max_logical_replication_slots GUC parameter to PostgreSQL for limiting logical replication slots. Ahmed Et-tanany proposes this to prevent logical replication from exhausting available slots and blocking physical replication. Euler Taveira suggests an alternative approach using a reserved_replication_slots parameter similar to reserved_connections, which would reserve slots for privileged roles rather than differentiating between logical and physical slots. Bernd Helmle supports this reserved approach for its flexibility. Fujii Masao raises concerns about needing a corresponding max_logical_wal_senders parameter, since logical replication connections could still exhaust WAL senders and block physical replication. Ahmed proposes reusing the logical slots limit to indirectly control logical WAL senders, but Euler warns this could cause confusion by restricting one resource based on another's configuration. The debate continues between targeted logical slot limits versus broader reservation mechanisms, with unresolved questions about WAL sender coordination and implementation complexity.

讨论围绕向PostgreSQL添加max_logical_replication_slots GUC参数来限制逻辑复制槽。Ahmed Et-tanany提出此功能以防止逻辑复制耗尽可用槽位并阻塞物理复制。Euler Taveira建议使用类似reserved_connections的reserved_replication_slots参数的替代方法，为特权角色保留槽位而非区分逻辑和物理槽位。Bernd Helmle支持这种保留方法的灵活性。Fujii Masao担心需要相应的max_logical_wal_senders参数，因为逻辑复制连接仍可能耗尽WAL发送器并阻塞物理复制。Ahmed提议重用逻辑槽位限制来间接控制逻辑WAL发送器，但Euler警告这可能因基于另一资源配置来限制一个资源而造成混乱。在针对性逻辑槽位限制与更广泛的保留机制之间的争论持续，关于WAL发送器协调和实现复杂性的问题仍未解决。

Participants - 参与者:
* ahmed.ettanany@aiven.io
* alvherre@kurilemu.de
* euler@eulerto.com
* mailings@oopsware.de
* masao.fujii@gmail.com

### **[Custom oauth validator options](https://www.postgresql.org/message-id/fd412b8e-fab5-43fe-b18d-3e035e4998a7@nataraj.su)**
The discussion focuses on implementing custom oauth validator options for PostgreSQL extensions. Nikolay Shaplov suggests that Zsolt Parragi's current approach using GUC variables for extension options could benefit from a more general API being developed in commitfest patch 4688. This patch provides a context-independent API for managing extension-defined option sets, originally designed for relation options but potentially applicable to GUC options as well. Shaplov argues that GUC options and relation options are fundamentally similar, making the existing options.c code from the patch series reusable. Parragi acknowledges the potential connection but questions whether implementing this would require a broader GUC refactoring, which would be a substantial undertaking. He agrees to examine the suggested patch in more detail, particularly in the context of adding extension options to pg_hba configuration rather than through GUCs.

讨论重点是为PostgreSQL扩展实现自定义oauth验证器选项。Nikolay Shaplov建议Zsolt Parragi当前使用GUC变量处理扩展选项的方法可以从commitfest补丁4688中正在开发的更通用API中受益。该补丁为管理扩展定义的选项集提供了上下文无关的API，最初设计用于关系选项，但可能也适用于GUC选项。Shaplov认为GUC选项和关系选项在根本上相似，使得补丁系列中现有的options.c代码可以重用。Parragi承认潜在的关联性，但质疑实现这一点是否需要更广泛的GUC重构，这将是一项重大工作。他同意更详细地研究建议的补丁，特别是在向pg_hba配置添加扩展选项而非通过GUCs的上下文中。

Participants - 参与者:
* alvherre@kurilemu.de
* david.g.johnston@gmail.com
* dhyan@nataraj.su
* jacob.champion@enterprisedb.com
* myon@debian.org
* robertmhaas@gmail.com
* vasukianand0119@gmail.com
* zsolt.parragi@percona.com

### **[Implement waiting for wal lsn replay: reloaded](https://www.postgresql.org/message-id/CAPpHfdv_BS7csGyg_=pPanRQM9Sf6_wBWNGdVzJRAv0U4eH9cg@mail.gmail.com)**
Alexander Korotkov confirms that a patch from Xuneng Zhou has been pushed to fix a misplaced wake-up call for replay waiters in PerformWalRecovery. The issue was identified by Heikki, who suggested that WaitLSNWakeup needs to be invoked immediately after a WAL record is applied to prevent potential missed wake-ups when recovery stops, pauses, or promotes. This fix addresses a timing issue in the WAL LSN replay waiting implementation where waiters might not be properly notified of completed replay operations, potentially causing unnecessary delays or hangs in applications waiting for specific LSN positions to be replayed.

Alexander Korotkov确认已推送了Xuneng Zhou的补丁，用于修复PerformWalRecovery中重放等待者的错位唤醒调用问题。该问题由Heikki发现，他建议需要在WAL记录应用后立即调用WaitLSNWakeup，以防止在恢复停止、暂停或提升时出现潜在的遗漏唤醒。此修复解决了WAL LSN重放等待实现中的时序问题，即等待者可能无法正确收到已完成重放操作的通知，这可能导致等待特定LSN位置重放的应用程序出现不必要的延迟或挂起。

Participants - 参与者:
* aekorotkov@gmail.com
* alvherre@kurilemu.de
* andres@anarazel.de
* hlinnaka@iki.fi
* jian.universality@gmail.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* peter@eisentraut.org
* thomas.munro@gmail.com
* tomas@vondra.me
* xunengzhou@gmail.com
* y.sokolov@postgrespro.ru