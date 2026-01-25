---
layout: post
title: PostgreSQL Daily News 2026-01-25
---

# PostgreSQL Daily News#14 2026-01-25







## **Hacker Email Discussions**

### **[UPDATE run check constraints for affected columns only](https://www.postgresql.org/message-id/CACJufxFimkvG8B+h1cNB7PoPHQiGVxe9-S=poWbJPtbi58XuOA@mail.gmail.com)**
Jian He provides an update on code simplification for running check constraints only on affected columns during UPDATE operations. The developer reports that the code has been further simplified and is now more organized and cleaner. However, they note that the associated test has become more verbose as part of these changes. No specific technical details about the implementation approach, performance improvements, or the nature of the verbosity in the test are provided in this brief update. The message appears to be a progress report on an ongoing patch development effort focused on optimizing constraint checking during UPDATE statements to improve performance by avoiding unnecessary constraint evaluations on unmodified columns.
Jian He就UPDATE操作中仅对受影响列运行检查约束的代码简化提供了更新。开发者报告说代码已经进一步简化，现在更加整洁和清晰。但是，他们注意到相关的测试变得更加冗长。这个简短的更新中没有提供关于实现方法、性能改进或测试冗长性质的具体技术细节。该消息似乎是关于正在进行的补丁开发工作的进展报告，专注于优化UPDATE语句期间的约束检查，通过避免对未修改列进行不必要的约束评估来提高性能。

Participants:
* jian.universality@gmail.com
* tgl@sss.pgh.pa.us

### **[Limit memory usage by postgres\_fdw batches](https://www.postgresql.org/message-id/e39d964cb5ed91ede13a87109376a463@postgrespro.ru)**
Alexander Pyhalov has rewritten a patch to limit memory consumption in postgres_fdw batches by introducing a new parameter called cursor_fetch_limit. This parameter restricts fetching from cursors based on both record count and estimated memory consumption on the foreign server side. Testing shows the approach successfully constrains backend memory usage to approximately 2GB instead of the previous 8GB without the patch. However, the implementation requires handling cases where fewer tuples are retrieved than expected, leading to the introduction of an es_eof EState field to signal when no more tuples are available. The author acknowledges uncertainty about whether this is the optimal approach for signaling end-of-fetch conditions.

Alexander Pyhalov重写了一个补丁来限制postgres_fdw批处理的内存消耗，通过引入名为cursor_fetch_limit的新参数。该参数基于记录数量和外部服务器端估计的内存消耗来限制从游标获取数据。测试表明该方法成功将后端内存使用限制在约2GB，而不使用补丁时会达到8GB。然而，该实现需要处理检索到的元组少于预期的情况，因此引入了es_eof EState字段来标识没有更多元组可用。作者承认对于标识获取结束条件这是否为最优方法存在不确定性。

Participants:
* a.pyhalov@postgrespro.ru
* tomas@vondra.me

### **[Patch: dumping tables data in multiple chunks in pg\_dump](https://www.postgresql.org/message-id/CAApHDvo29-vQz=xV6+x5hU--NZ9qGPXsCNBuOAf88pAHjTpvvQ@mail.gmail.com)**
David Rowley provides detailed technical criticism of Hannu Krosing's v10 patch for implementing table data chunking in pg_dump. He identifies critical issues including integer overflow problems with pg_relation_size calculations that could cause undefined behavior when tables exceed 16TB, inconsistent code formatting and style violations, copy-paste errors in comments, and poor variable type choices. Rowley emphasizes that the patch lacks the precision and care expected for a v10 revision, suggesting it's still at proof-of-concept quality. He recommends using InvalidBlockNumber for unbounded ranges instead of the current denormalized TableInfo representation and warns he'll withdraw support if quality doesn't improve significantly by v11.
David Rowley对Hannu Krosing的pg_dump表数据分块功能第10版补丁进行了详细的技术批评。他指出了关键问题，包括pg_relation_size计算中的整数溢出问题（当表超过16TB时可能导致未定义行为）、代码格式和风格不一致、注释中的复制粘贴错误，以及变量类型选择不当。Rowley强调该补丁缺乏第10版修订应有的精确性和细心程度，认为仍处于概念验证质量水平。他建议使用InvalidBlockNumber表示无界范围，而不是当前的非规范化TableInfo表示，并警告如果第11版质量没有显著改善，他将撤回支持。

Participants:
* ashutosh.bapat.oss@gmail.com
* dgrowleyml@gmail.com
* hannuk@google.com
* nathandbossart@gmail.com
* zsolt.parragi@percona.com

### **[Refactor recovery conflict signaling a little]()**
Heikki Linnakangas proposed a series of patches to refactor PostgreSQL's recovery conflict signaling without functional changes. The patches include removing an unreachable errdetail_abort() function that was supposed to show "Abort reason: recovery conflict" messages, eliminating misleading reconnection hints when databases are being dropped, separating RecoveryConflictReasons from PROCSIG flags by introducing a single PROCSIG_RECOVERY_CONFLICT signal with reason communicated via bitmask in PGPROC, and refactoring ProcessRecoveryConflictInterrupt to remove confusing switch-statement fallthrough logic. Chao Li provided detailed feedback identifying several issues: a variable scoping optimization, a logic change that may be unintentional, unclear comment wording, inconsistent void casting, a typo, an unnecessary empty line, and a missing equality check in condition statement. The reviewer generally supports the changes for improved code clarity.
Heikki Linnakangas提出了一系列补丁来重构PostgreSQL的恢复冲突信号处理，不涉及功能性更改。这些补丁包括：移除无法到达的errdetail_abort()函数（该函数本应显示"中止原因：恢复冲突"消息）；当数据库正在被删除时，消除误导性的重连提示；通过引入单一的PROCSIG_RECOVERY_CONFLICT信号将RecoveryConflictReasons与PROCSIG标志分离，原因通过PGPROC中的位掩码传达；重构ProcessRecoveryConflictInterrupt以移除令人困惑的switch语句穿透逻辑。Chao Li提供了详细反馈，指出了几个问题：变量作用域优化、可能是无意的逻辑更改、注释措辞不清、void转换不一致、拼写错误、不必要的空行以及条件语句中缺少相等检查。审查者总体上支持这些更改以提高代码清晰度。

Participants:
* hlinnaka@iki.fi
* li.evan.chao@gmail.com

### **[Fix a typo in comment](https://www.postgresql.org/message-id/5cfb747.2f21.19be8d77431.Coremail.dingyi_yale@163.com)**
Yi Ding reported a comment error in multixact.c and prepared a patch to fix the typo. The patch details were provided in an attached file. Michael Paquier acknowledged the report and confirmed it has been picked up for later review. This appears to be a straightforward documentation fix with no technical controversy or complex implementation issues. The next step involves Michael reviewing the attached patch file to validate and potentially commit the typo correction.

易鼎报告了 multixact.c 中的注释错误，并准备了一个补丁来修复这个错字。补丁详细信息在附件文件中提供。Michael Paquier 确认收到了报告，并表示已将其纳入后续审查。这似乎是一个直接的文档修复，没有技术争议或复杂的实现问题。下一步涉及 Michael 审查附件补丁文件以验证并可能提交这个错字更正。

Participants:
* dingyi_yale@163.com
* michael@paquier.xyz

### **[Assert the timestamp is available for ORIGN\_DIFFERS conflicts](https://www.postgresql.org/message-id/CAA4eK1K_g7bi+6=rut3CFV0rSyBPoFVbZ1k8zeLNRE5SFnmtuA@mail.gmail.com)**
The discussion centers on a PostgreSQL patch by Hayato Kuroda to add Assert statements for UPDATE_ORIGIN_DIFFERS and DELETE_ORIGIN_DIFFERS conflicts. Chao Li provided feedback on the v2 patch, identifying three issues: code redundancy with duplicate assertions, unclear comments linking localts assertion to track_commit_timestamp GUC, and preference for explicit Assert(localts != 0) over Assert(localts). Chao suggested consolidating the assertions at the function's beginning with a single comprehensive check. Amit Kapila acknowledged the suggestion to reduce duplication but expressed concern about type-specific checks making code harder to follow, while agreeing that Assert(localts != 0) is more explicit. Hayato declined to move the Assert to the top of switch-case statements, citing concerns about code cleanliness for other cases, and updated the patch to v3 addressing the feedback on conditions and comments. Chao approved the v3 version, indicating the discussion has reached consensus.

该讨论围绕PostgreSQL的一个补丁展开，该补丁由Kuroda Hayato编写，用于为UPDATE_ORIGIN_DIFFERS和DELETE_ORIGIN_DIFFERS冲突添加Assert语句。Chao Li对v2补丁提供了反馈，指出了三个问题：重复断言导致的代码冗余、将localts断言与track_commit_timestamp GUC联系的注释不清晰，以及倾向于使用明确的Assert(localts != 0)而非Assert(localts)。Chao建议在函数开始处用单个综合检查来整合断言。Amit Kapila承认减少重复的建议，但表达了对特定类型检查可能使代码更难理解的担忧，同时同意Assert(localts != 0)更加明确。Hayato拒绝将Assert移至switch-case语句顶部，担心会影响其他情况的代码整洁性，并更新补丁至v3版本，解决了关于条件和注释的反馈。Chao批准了v3版本，表明讨论已达成共识。

Participants:
* amit.kapila16@gmail.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* shveta.malik@gmail.com

### **[DOCS \- "\\d mytable" also shows any publications that publish mytable]()**
Fujii Masao is preparing to commit a documentation patch that clarifies the `\d` command output lists are illustrative, not exhaustive. The patch adds phrases like "such as" and "for example" to indicate that the listed associated objects (indexes, constraints, rules, publications, triggers) are examples rather than complete lists. Peter Smith originally proposed this change after initially thinking the documentation presented exhaustive lists. Fujii made several editorial refinements to the v4 patch, removing redundant phrasing like "and so on" when "such as" was already used, and changing some instances to "for example" for better flow. Chao Li identified a missing whitespace before "triggers" in the rendered documentation that needs correction. Peter Smith approved v5 except for this spacing issue.

Fujii Masao正在准备提交一个文档补丁，该补丁明确说明`\d`命令输出列表是示例性的，而非详尽的。补丁添加了"such as"和"for example"等短语，表明列出的关联对象（索引、约束、规则、发布、触发器）是示例而非完整列表。Peter Smith最初提出此更改，因为他之前认为文档呈现的是详尽列表。Fujii对v4补丁进行了几处编辑改进，在已使用"such as"时删除了冗余的"and so on"短语，并将某些实例改为"for example"以改善表达流畅性。Chao Li发现渲染文档中"triggers"前缺少空格需要修正。Peter Smith批准了v5版本，除了这个间距问题。

Participants:
* li.evan.chao@gmail.com
* masao.fujii@gmail.com
* smithpb2250@gmail.com

### **[pg\_upgrade: optimize replication slot caught\-up check](https://www.postgresql.org/message-id/B098C626-EE7D-4E98-8685-FBB7980C795E@gmail.com)**
Masahiko Sawada has submitted version 7 of a patch to optimize pg_upgrade's replication slot caught-up check. The optimization involves using a faster method for PostgreSQL 19+ by leveraging binary_upgrade_check_logical_slot_pending_wal() in a separate query, while maintaining backward compatibility with older versions using binary_upgrade_logical_slot_has_caught_up(). Reviewers Shveta Malik and Chao Li provided feedback on function naming, query predicate ordering, sanity checks, and documentation clarity. Sawada addressed the concerns by refactoring the code to have get_old_cluster_logical_slot_infos_query() automatically decide which method to use based on version. Minor documentation improvements were suggested regarding pointer notation and comment wording. The reviewers expressed overall approval of the approach and implementation.

Masahiko Sawada 提交了第 7 版补丁，用于优化 pg_upgrade 的复制槽追赶检查。该优化通过在 PostgreSQL 19+ 中使用 binary_upgrade_check_logical_slot_pending_wal() 在单独查询中实现更快的方法，同时保持与使用 binary_upgrade_logical_slot_has_caught_up() 的旧版本的向后兼容性。审查者 Shveta Malik 和 Chao Li 就函数命名、查询谓词排序、完整性检查和文档清晰度提供了反馈。Sawada 通过重构代码来解决这些问题，让 get_old_cluster_logical_slot_infos_query() 根据版本自动决定使用哪种方法。审查者建议对指针符号和注释措辞进行小的文档改进。审查者对该方法和实现表示整体认可。

Participants:
* li.evan.chao@gmail.com
* sawada.mshk@gmail.com
* shveta.malik@gmail.com

### **[tablecmds: reject CLUSTER ON for partitioned tables earlier]()**
Chao Li proposes a patch to reject ALTER TABLE CLUSTER ON and SET WITHOUT CLUSTER commands for partitioned tables earlier in the process, moving the validation from execution time to preparation phase using ATSimplePermissions() infrastructure. This makes error handling consistent with other unsupported ALTER TABLE operations on partitioned tables and provides clearer error messages. The patch extends to similar changes for INHERIT/NO INHERIT commands. Zsolt Parragi reviews positively but suggests documentation updates for unsupported operations, adding test cases for NO INHERIT, fixing code comments, removing redundant checks, and clarifying whether the original error path can still be reached. Chao acknowledges the feedback and mentions having a separate documentation patch already in progress.

李超提出一个补丁，用于在更早的阶段拒绝分区表上的ALTER TABLE CLUSTER ON和SET WITHOUT CLUSTER命令，将验证从执行时移到准备阶段，使用ATSimplePermissions()基础设施。这使得错误处理与分区表上其他不支持的ALTER TABLE操作保持一致，并提供更清晰的错误消息。补丁扩展到对INHERIT/NO INHERIT命令的类似更改。Zsolt Parragi给出积极评价，但建议更新不支持操作的文档，为NO INHERIT添加测试用例，修复代码注释，删除冗余检查，并澄清是否仍能到达原始错误路径。李超确认反馈并提及已有单独的文档补丁正在进行中。

Participants:
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[Race conditions in logical decoding](https://www.postgresql.org/message-id/3805.1769150012@localhost)**
The discussion focuses on race conditions in PostgreSQL's logical decoding, specifically regarding snapshot building and CLOG consistency. Álvaro Herrera identified an inefficient algorithm in Antonin Houska's code that repeatedly checks TransactionIdDidCommit for all transactions when waiting, suggesting a nested loop restructure to wait for each transaction individually before moving to the next. Antonin acknowledged the improvement. The broader issue involves ensuring CLOG (commit log) consistency with snapshot transaction lists. Antonin argues that waiting for CLOG updates before finalizing snapshots would ensure consistency similar to procarray-based snapshots, where transactions are only removed from procarray after CLOG status is set. He addresses concerns about CLOG wraparound and concurrent access, noting that single-byte atomic reads should be safe, though questions about memory ordering remain unresolved.
讨论集中在PostgreSQL逻辑解码中的竞态条件问题，特别是快照构建和CLOG一致性。Álvaro Herrera指出Antonin Houska代码中存在低效算法，在等待时会对所有事务重复检查TransactionIdDidCommit，建议重构嵌套循环以逐个等待每个事务后再处理下一个。Antonin承认了这个改进。更广泛的问题涉及确保CLOG（提交日志）与快照事务列表的一致性。Antonin认为在最终确定快照前等待CLOG更新可确保与基于procarray的快照类似的一致性，后者只在CLOG状态设置后才从procarray中移除事务。他讨论了CLOG回绕和并发访问的担忧，指出单字节原子读取应该是安全的，但内存排序问题仍未解决。

Participants:
* ah@cybertec.at
* alvherre@kurilemu.de
* andres@anarazel.de

### **[Remove redundant initialization of smgr pointer for relcache](https://www.postgresql.org/message-id/CAN4CZFP4zaFWXx2cP=X=6+VoDnoJ8Dh9cTpT4SjGdAAp=Ui2AQ@mail.gmail.com)**
A contributor submitted a patch to remove redundant initialization of the smgr pointer for relcache in PostgreSQL. While the reviewer acknowledges this is a simple and correct change, they suggest additional improvements to the confusing code structure. Specifically, they note that AllocateRelationDesc has only one caller and its documentation comments are incomplete and scattered between the function and call site. The reviewer recommends either consolidating and improving the comments, removing the function entirely, or refactoring it for broader reusability. No final decision has been made on these suggested enhancements.

一位贡献者提交了一个补丁，用于移除PostgreSQL中relcache的smgr指针的冗余初始化。虽然审查者承认这是一个简单且正确的更改，但他们建议对令人困惑的代码结构进行额外改进。具体来说，他们指出AllocateRelationDesc只有一个调用者，其文档注释不完整且分散在函数和调用点之间。审查者建议要么整合并改进注释，要么完全移除该函数，或者重构它以提高重用性。对于这些建议的改进尚未做出最终决定。

Participants:
* mrdrivingduck@gmail.com
* zsolt.parragi@percona.com

### **[warning: dereferencing type\-punned pointer](https://www.postgresql.org/message-id/581db49e-2a12-4f89-8c3e-334ba5889ff7@eisentraut.org)**
Peter Eisentraut responds to a discussion about C standard rules for type-punned pointer dereferencing. He analyzes C23's §6.5 7) rule regarding accessing stored values through different lvalue expression types. Eisentraut explains that the rule allows accessing a Plan object via an Append pointer (since Append contains Plan as a member), but notes this is the opposite direction of what PostgreSQL needs - accessing an Append object via a Plan or Node pointer. He clarifies that the rule doesn't require the member to be first and concludes this consideration is unrelated to solving PostgreSQL's type-punning warnings.
Peter Eisentraut回应了关于类型双关指针解引用的C标准规则的讨论。他分析了C23的§6.5 7)规则，该规则涉及通过不同左值表达式类型访问存储值。Eisentraut解释说该规则允许通过Append指针访问Plan对象（因为Append包含Plan作为成员），但指出这与PostgreSQL需要的方向相反——通过Plan或Node指针访问Append对象。他澄清该规则不要求成员必须是第一个，并得出结论认为这个考虑与解决PostgreSQL的类型双关警告无关。

Participants:
* andres@anarazel.de
* ishii@postgresql.org
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[Some tests for TOAST, STORAGE MAIN/EXTENDED](https://www.postgresql.org/message-id/aXMdX1UTHnzYPkHk@paquier.xyz)**
Michael Paquier proposes adding regression tests for PostgreSQL's TOAST (The Oversized-Attribute Storage Technique) functionality, specifically covering STORAGE MAIN/EXTENDED options. He discovered that breaking inline compressible entry handling didn't trigger test failures in the main regression suite, indicating insufficient test coverage. The proposed tests include checks for both EXTENDED storage and the TOAST table itself. Nikhil Veldanda provides feedback on two issues: the `SELECT count(*) FROM :reltoastname` assertion could be brittle for EXTENDED storage due to potential multi-chunk values, suggesting using `SELECT count(DISTINCT chunk_id)` instead, and the `pg_column_compression()` test assumes pglz compression but doesn't set `default_toast_compression`, which could cause failures on builds with different defaults.
Michael Paquier提议为PostgreSQL的TOAST（超大属性存储技术）功能添加回归测试，特别涵盖STORAGE MAIN/EXTENDED选项。他发现破坏内联可压缩条目处理时主回归测试套件未报错，表明测试覆盖不足。建议的测试包括对EXTENDED存储和TOAST表本身的检查。Nikhil Veldanda针对两个问题提供反馈：`SELECT count(*) FROM :reltoastname`断言对EXTENDED存储可能不稳定，因为潜在的多块值，建议改用`SELECT count(DISTINCT chunk_id)`；`pg_column_compression()`测试假设pglz压缩但未设置`default_toast_compression`，这可能在使用不同默认值的构建上失败。

Participants:
* michael@paquier.xyz
* veldanda.nikhilkumar17@gmail.com

### **[Hackorum \- a new mailing list frontend](https://www.postgresql.org/message-id/CAG0qCNhxpzE4hHozO2fgQ13oeqkWgkAGv4kUfnqxbPRxke-1PA@mail.gmail.com)**
The discussion focuses on improvements to Hackorum, a new PostgreSQL mailing list frontend. Key updates include a reworked mobile view for better usability on smaller screens and significant performance fixes for both index and topic views. Visual enhancements were made to help users match thread outlines to messages, including color-coded headers and highlighting of currently visible messages in the outline. A new feature allows downloading the latest patchset as a tar.gz file for each topic, along with a script for automatic integration into local git checkouts. Suggestions were discussed regarding message ordering options and IMAP/JMAP server integration, though the latter was deemed complex. The developer continues seeking feedback on usability and potential improvements.

讨论重点关注Hackorum（一个新的PostgreSQL邮件列表前端）的改进。主要更新包括重新设计的移动视图以提高在小屏幕上的可用性，以及对索引和主题视图的显著性能修复。为帮助用户匹配线程大纲和消息，进行了视觉增强，包括颜色编码的标题和在大纲中突出显示当前可见消息。新功能允许为每个主题下载最新补丁集作为tar.gz文件，并提供一个脚本用于自动集成到本地git检出中。讨论了关于消息排序选项和IMAP/JMAP服务器集成的建议，但后者被认为过于复杂。开发者继续寻求关于可用性和潜在改进的反馈。

Participants:
* kai.wagner@percona.com
* zsolt.parragi@percona.com

### **[Add WALRCV\_CONNECTING state to walreceiver](https://www.postgresql.org/message-id/CABPTF7VQ5tGOSG5TS-Cg+Fb8gLCGFzxJ_eX4qg+WZ3ZPt=FtwQ@mail.gmail.com)**
The discussion centers on a patch to add a WALRCV_CONNECTING state to PostgreSQL's WAL receiver. Xuneng Zhou initially proposed using an Assert() to handle race conditions between startup and WAL receiver processes, but Michael Paquier identified this as problematic. The Assert could fire inappropriately in development mode, and in production, a STOPPING state could be incorrectly overwritten by STREAMING. Zhou initially suggested adding a fast-exit path for STOPPING states, but Paquier preferred a minimal approach to avoid increasing exit paths. The final solution in patch v7 simply checks if the state is CONNECTING before switching to STREAMING, leaving other states unchanged. Paquier tested the patch with injection points to verify WAL receiver control mechanisms work correctly with primary_conninfo reloads, then applied it as commit a36164e7465f. Zhou plans to work on exposing XLogRecoveryCtlData metrics at SQL level next.
讨论围绕为PostgreSQL的WAL接收器添加WALRCV_CONNECTING状态的补丁展开。周旭能最初提议使用Assert()处理启动进程和WAL接收器进程之间的竞态条件，但Michael Paquier发现这存在问题。Assert可能在开发模式下不当触发，而在生产环境中，STOPPING状态可能被错误地覆盖为STREAMING。周最初建议为STOPPING状态添加快速退出路径，但Paquier倾向于采用最小化方法以避免增加退出路径。补丁v7的最终解决方案是在切换到STREAMING之前简单检查状态是否为CONNECTING，其他状态保持不变。Paquier使用注入点测试了补丁，验证WAL接收器控制机制在primary_conninfo重载时正常工作，然后将其应用为提交a36164e7465f。周计划接下来在SQL层面公开XLogRecoveryCtlData指标。

Participants:
* li.evan.chao@gmail.com
* michael@paquier.xyz
* noah@leadboat.com
* rahilasyed90@gmail.com
* xunengzhou@gmail.com

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/TY4PR01MB169074400DA851B425BA5D4219494A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
The discussion focuses on a PostgreSQL patch addressing replication slot invalidation by checkpoints. Zhijie Hou responds to code review feedback from Kuroda, making several adjustments: removing unnecessary header inclusion, changing psql() calls to safe_psql() in tests, and confirming that retry logic can be removed similar to ReplicationSlotReserveWal(). The patch addresses race conditions where newly created slots get invalidated, with the fix preventing concurrent checkpoints from causing invalidation. Amit Kapila provides additional review comments requesting expanded code comments explaining why both RedoRecPtr and slot minimum LSN are needed, suggesting clearer test case comments, and questioning the necessity of DEBUG2 logging level. The patch affects PostgreSQL versions back to PG17, though backporting will require separate patches once the main fix is stabilized.
讨论重点关注一个解决检查点使复制槽失效问题的PostgreSQL补丁。Zhijie Hou回应了Kuroda的代码审查反馈，进行了几项调整：移除不必要的头文件包含，将测试中的psql()调用改为safe_psql()，并确认可以移除类似于ReplicationSlotReserveWal()的重试逻辑。该补丁解决了新创建槽被失效的竞态条件，修复方案防止并发检查点导致失效。Amit Kapila提供了额外的审查意见，要求扩展代码注释来解释为什么需要RedoRecPtr和槽最小LSN，建议更清晰的测试用例注释，并质疑DEBUG2日志级别的必要性。该补丁影响PostgreSQL版本直到PG17，尽管回移需要在主补丁稳定后准备单独的补丁。

Participants:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[\[PATCH\] Avoid potential NULL dereference in LIKE/ILIKE with C locale](https://www.postgresql.org/message-id/CABg3sZo30PKF-AYZ_eih=5snxqp73bVOGX7O_hBMqoFhcOWbjQ@mail.gmail.com)**
Eugeny Goryachev identified a potential NULL pointer dereference in PostgreSQL's LIKE/ILIKE operations when using the C locale. The issue occurs in the MatchText function where the GETCHAR macro unconditionally passes a locale argument to MATCH_LOWER, but this locale can be NULL for C collations. This could cause crashes when MATCH_LOWER attempts to dereference the NULL pointer to access locale fields. The proposed patch adds a NULL check to the GETCHAR macro, falling back to pg_ascii_tolower() when locale is NULL, which is safe and appropriate for C locale behavior. This approach aligns with existing patterns in other PostgreSQL collation-aware functions that treat NULL locale as equivalent to C/POSIX behavior.

Eugeny Goryachev 发现了 PostgreSQL 在使用 C 语言环境时 LIKE/ILIKE 操作中的潜在 NULL 指针解引用问题。该问题出现在 MatchText 函数中，GETCHAR 宏无条件地将语言环境参数传递给 MATCH_LOWER，但对于 C 排序规则，该语言环境可能为 NULL。当 MATCH_LOWER 尝试解引用 NULL 指针以访问语言环境字段时，这可能导致崩溃。提议的补丁在 GETCHAR 宏中添加了 NULL 检查，当语言环境为 NULL 时回退到 pg_ascii_tolower()，这对于 C 语言环境行为既安全又合适。这种方法与 PostgreSQL 其他排序规则感知函数中的现有模式一致，将 NULL 语言环境视为等同于 C/POSIX 行为。

Participants:
* gorcom2012@gmail.com

### **[ALTER TABLE: warn when actions do not recurse to partitions]()**
Jim Jones reviewed Chao Li's patch for adding warnings when ALTER TABLE actions don't recurse to partitions in PostgreSQL. The patch successfully emits NOTICE messages with hints about modifying partitions individually or using ONLY to suppress warnings. Jim suggested improving the hint message capitalization per PostgreSQL's Error Message Style Guide and provided better wording. However, Jim discovered a timing issue where the NOTICE is emitted before validation, causing confusing output when commands fail (e.g., showing partition warnings before compression errors). He proposed moving the EmitPartitionNoRecurseNotice() call to ATExecCmd after successful execution rather than during preparation. Chao acknowledged the feedback and will integrate the suggestions in the next patch version.
Jim Jones审查了Chao Li关于在PostgreSQL中ALTER TABLE操作不递归到分区时添加警告的补丁。该补丁成功发出NOTICE消息，提示如何单独修改分区或使用ONLY抑制警告。Jim建议按照PostgreSQL错误消息样式指南改进提示消息的大小写，并提供了更好的措辞。然而，Jim发现了时序问题，即在验证之前就发出NOTICE，当命令失败时会产生混乱的输出（例如在压缩错误之前显示分区警告）。他建议将EmitPartitionNoRecurseNotice()调用移至ATExecCmd中成功执行后，而不是在准备阶段。Chao承认了反馈，将在下一个补丁版本中整合这些建议。

Participants:
* david.g.johnston@gmail.com
* htamfids@gmail.com
* jim.jones@uni-muenster.de
* li.evan.chao@gmail.com

### **[Reduce build times of pg\_trgm GIN indexes](https://www.postgresql.org/message-id/ef8782c9-68b7-4915-9f79-497765a8e205@gmail.com)**
David Geier is working on a patch to reduce build times of pg_trgm GIN indexes, which appears to involve a backwards-compatibility breaking change that could affect existing indexes. Matthias van de Meent provided guidance on PostgreSQL's standard approach for handling such changes: when the change concerns a bug fix, it should be documented in release notes with a warning for users to reindex affected indexes after upgrading. He clarified that pg_upgrade doesn't automatically reindex data structures and only handles catalog transcription and data file transfer. The fix would only affect the specific pg_trgm GIN opclass, not all GIN indexes. David accepted this guidance and plans to update his patch accordingly.
David Geier正在开发一个补丁来减少pg_trgm GIN索引的构建时间，该补丁涉及向后兼容性破坏性更改，可能影响现有索引。Matthias van de Meent提供了PostgreSQL处理此类更改的标准方法指导：当更改涉及错误修复时，应在发布说明中记录并警告用户在升级后重新索引受影响的索引。他澄清pg_upgrade不会自动重新索引数据结构，只处理目录转录和数据文件传输。修复仅影响特定的pg_trgm GIN操作符类，而非所有GIN索引。David接受了这一指导并计划相应更新补丁。

Participants:
* boekewurm+postgres@gmail.com
* geidav.pg@gmail.com
* hlinnaka@iki.fi

### **[Time to drop RADIUS support?](https://www.postgresql.org/message-id/CA+hUKG+SH309V8KECU5=xuLP9Dks0v9f9UVS2W74fPAE5O21dg@mail.gmail.com)**
Thomas Munro proposes dropping PostgreSQL's built-in RADIUS authentication support due to security vulnerabilities and lack of users. He notes that PostgreSQL's implementation has accidental resilience with a 3-second timeout, but the underlying RADIUS/UDP protocol suffers from the BlastRADIUS vulnerability. The mitigation would help but RADIUS/UDP uses outdated MD5-based technology being formally deprecated. Munro argues there are likely zero users since the vulnerability causes warnings in FreeRADIUS and Microsoft recommended requiring mitigations in 2024. He suggests users can achieve better RADIUS authentication through PAM modules maintained by the FreeRADIUS project, which follows standards and isn't PostgreSQL's responsibility. Removing RADIUS would also eliminate Windows select() and UDP threading workarounds. He provides detailed PAM configuration examples and test server setup instructions.
Thomas Munro提议移除PostgreSQL内置的RADIUS身份验证支持，原因是存在安全漏洞且缺乏用户。他指出PostgreSQL的实现因3秒超时而具有意外的弹性，但底层的RADIUS/UDP协议存在BlastRADIUS漏洞。缓解措施会有帮助，但RADIUS/UDP使用正被正式弃用的基于MD5的过时技术。Munro认为可能没有用户，因为该漏洞会在FreeRADIUS中产生警告，而Microsoft在2024年建议要求缓解措施。他建议用户可以通过FreeRADIUS项目维护的PAM模块实现更好的RADIUS身份验证，这遵循标准且不是PostgreSQL的责任。移除RADIUS还将消除Windows select()和UDP线程处理的变通方案。他提供了详细的PAM配置示例和测试服务器设置说明。

Participants:
* thomas.munro@gmail.com

### **[Proposal: Conflict log history table for Logical Replication](https://www.postgresql.org/message-id/CAFiTN-t_4XvofM3an-WmykqnPE+9wf9U+o2M7p1CWd9eXkN88Q@mail.gmail.com)**
The discussion centers on a PostgreSQL proposal to implement a conflict log history table for logical replication. Developers are reviewing v22 patches that add functionality to log replication conflicts to a dedicated table instead of just server logs. Key issues being addressed include documentation consistency (using "Conflict log table" terminology), proper handling of table lifecycle when subscriptions are dropped, and test reliability problems. The tests are failing intermittently because conflict records can be inserted multiple times, causing count mismatches. Vignesh C identified that test assertions expecting exactly 1 conflict record sometimes get 2, suggesting the fix should check for >= 1 records instead. Dilip Kumar has addressed most feedback except pending documentation changes from Peter Smith's review.

讨论围绕PostgreSQL逻辑复制冲突日志历史表的提案展开。开发者正在审查v22补丁，该补丁添加了将复制冲突记录到专用表而非仅记录到服务器日志的功能。正在解决的关键问题包括文档术语的一致性（使用"冲突日志表"术语）、订阅删除时表生命周期的正确处理，以及测试可靠性问题。测试间歇性失败是因为冲突记录可能被多次插入，导致计数不匹配。Vignesh C发现期望恰好1条冲突记录的测试断言有时会得到2条，建议修复应检查>=1条记录。Dilip Kumar已解决了大部分反馈，除了Peter Smith审查中待处理的文档更改。

Participants:
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* dilipbalaut@gmail.com
* sawada.mshk@gmail.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com
* vignesh21@gmail.com

### **[Fix gistkillitems & add regression test to microvacuum](https://www.postgresql.org/message-id/CALdSSPiGnqgvpfQDCydBf-=0hzyUs6Y0o0xNvd53BbcMWTVO=w@mail.gmail.com)**
Kirill Reshke submitted a v2 patch to fix a bug in GiST killtuples functionality for root pages and add a regression test to microvacuum. Andrey Borodin confirmed the bug exists and that the patch fixes it, noting the issue is harmless but should be addressed in master without backporting. Borodin suggested improving variable assignment in gistScanPage() and recommended updating the test comment to explicitly mention the bug was fixed. Reshke acknowledged the feedback and requested clarification on appropriate wording for the comment update.

Kirill Reshke 提交了 v2 补丁，修复 GiST killtuples 功能在根页面的错误，并为 microvacuum 添加回归测试。Andrey Borodin 确认错误存在，补丁能修复问题，指出该问题无害但应在主分支中修复，不需要回移植。Borodin 建议改进 gistScanPage() 中的变量赋值，并建议更新测试注释以明确提及错误已修复。Reshke 确认了反馈并请求关于注释更新合适措辞的澄清。

Participants:
* reshkekirill@gmail.com
* x4mmm@yandex-team.ru

### **[Deadlock detector fails to activate on a hot standby replica](https://www.postgresql.org/message-id/b178ea8d-9ed9-48b3-b4f7-5cfc3ff6ee44@postgrespro.ru)**
Vitaly Davydov proposes a patch to fix a deadlock detector activation issue on hot standby replicas. The problem stems from spontaneous SIGALRM signals occurring during timeout waits, which interfere with expected timeout behavior. The proposed solution ignores these spontaneous signals and continues waiting for proper timeouts or buffer unpinning by conflicting backends. The patch is not final, with plans to add tap-tests for verification. There are concerns about placing buffer-specific function calls in ResolveRecoveryConflictWithBufferPin, and the author suggests adding documentation in timeout.c to explain the non-obvious consequences of setitimer optimization implemented in commit 09cf1d52267644cdbdb734294012cf1228745aaa.

Vitaly Davydov提出了一个修复补丁，用于解决热备副本上死锁检测器激活失败的问题。问题源于在等待超时期间出现的自发SIGALRM信号，这些信号干扰了预期的超时行为。建议的解决方案是忽略这些自发信号，继续等待正确的超时或冲突后端的缓冲区解除固定。该补丁尚未最终完成，计划添加tap测试进行验证。作者担心在ResolveRecoveryConflictWithBufferPin中放置缓冲区特定函数调用，并建议在timeout.c中添加文档来解释在提交09cf1d52267644cdbdb734294012cf1228745aaa中实现的setitimer优化所带来的不明显后果。

Participants:
* v.davydov@postgrespro.ru

### **[Checkpointer write combining](https://www.postgresql.org/message-id/CAMtXxw-2xFGrFzQ7O_9_a0zSJytkh6v-se5JvroCCQXtXUt=VA@mail.gmail.com)**
Soumya S Murali presents an implementation of checkpointer write combining that batches buffer writebacks to reduce checkpoint I/O overhead. The patch combines refactoring, batching behavior, and instrumentation into a single implementation localized to BufferSync(). Performance testing shows significant improvements: batching reduced sync files from 30 to 3, total checkpoint time from 0.754s to 0.625s, and confirmed ~16 buffers per writeback call instead of per-buffer writebacks. Further evaluation of batch sizes 8, 16, and 32 revealed that batch size 32 provides optimal balance, achieving lowest total checkpoint time (0.442s) while maintaining low sync fragmentation. The implementation preserves WAL ordering and durability semantics while delivering measurable I/O performance improvements.

Soumya S Murali 提出了检查点写入合并的实现，通过批处理缓冲区写回来减少检查点I/O开销。该补丁将重构、批处理行为和监控整合到一个局限于BufferSync()的实现中。性能测试显示显著改进：批处理将同步文件从30个减少到3个，总检查点时间从0.754秒减少到0.625秒，并确认每次写回调用处理约16个缓冲区而非每缓冲区写回。对批次大小8、16和32的进一步评估显示，批次大小32提供最佳平衡，实现最低总检查点时间(0.442秒)，同时保持低同步碎片化。该实现保持WAL顺序和持久性语义，同时提供可测量的I/O性能改进。

Participants:
* andres@anarazel.de
* byavuz81@gmail.com
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* soumyamurali.work@gmail.com

### **[pg\_waldump: support decoding of WAL inside tarfile](https://www.postgresql.org/message-id/CAAJ_b95FOeW38gw-3BLmpdnTWHFimopTvf=eTObYUbTOC0x8qg@mail.gmail.com)**
Amul Sul responds to Robert Haas's feedback on pg_waldump tarfile decoding implementation. The discussion centers on memory management and responsibility separation in WAL segment processing. Haas suggested avoiding unnecessary data copying and making signaling more explicit between components. Sul explains that the current astreamer_waldump_content() lacks information to skip WAL segments during initial preparation, as filtration parameters depend on WAL segment size calculated later in init_archive_reader(). Sul proposes adding a separate routine to handle setting privateInfo->cur_wal to NULL while releasing hash entries to prevent memory buildup. Regarding PaxHeaders filtering, Haas objects to hardcoded PaxHeaders checks, preferring to restrict processing to toplevel directory files only. Sul agrees to implement this restriction despite originally intending to allow WAL decoding from any archive directory.

Amul Sul回应了Robert Haas对pg_waldump tar文件解码实现的反馈。讨论集中在WAL段处理中的内存管理和职责分离上。Haas建议避免不必要的数据复制，并使组件间的信号传递更明确。Sul解释当前的astreamer_waldump_content()在初始准备阶段缺乏跳过WAL段的信息，因为过滤参数依赖于稍后在init_archive_reader()中计算的WAL段大小。Sul提议添加一个单独的例程来处理将privateInfo->cur_wal设置为NULL同时释放哈希条目以防止内存堆积。关于PaxHeaders过滤，Haas反对硬编码的PaxHeaders检查，倾向于仅限制处理顶级目录文件。尽管Sul最初打算允许从任何归档目录解码WAL，但他同意实现这一限制。

Participants:
* jakub.wartak@enterprisedb.com
* li.evan.chao@gmail.com
* robertmhaas@gmail.com
* sulamul@gmail.com

### **[Is abort\(\) still needed in WalSndShutdown\(\)?](https://www.postgresql.org/message-id/CAHGQGwHPX1yoixq+YB5rF4zL90TMmSEa3FpHURtqW3Jc5+=oSA@mail.gmail.com)**
Fujii Masao questioned whether the abort() call in WalSndShutdown() is still necessary, noting it appears after proc_exit(0) with a "keep the compiler quiet" comment. He observed that other functions like CheckpointerMain() use only proc_exit(0) without compiler warnings, suggesting the abort() may be obsolete. Heikki Linnakangas agreed the abort() seems useless, explaining that historically it was needed when the function returned "int" and compilers might complain about missing returns. However, since WalSndShutdown() now returns void, compiler warnings should not occur regardless of whether the compiler understands proc_exit(0) doesn't return. Both contributors appear to agree the abort() call can likely be removed.
Fujii Masao质疑WalSndShutdown()中的abort()调用是否仍然必要，注意到它出现在proc_exit(0)之后，带有"keep the compiler quiet"注释。他观察到其他函数如CheckpointerMain()仅使用proc_exit(0)而不产生编译器警告，表明abort()可能已过时。Heikki Linnakangas同意abort()似乎是无用的，解释说历史上当函数返回"int"时需要它，编译器可能会抱怨缺少返回值。然而，由于WalSndShutdown()现在返回void，无论编译器是否理解proc_exit(0)不返回，都不应出现编译器警告。两位贡献者似乎都同意abort()调用可能可以被移除。

Participants:
* hlinnaka@iki.fi
* masao.fujii@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAHut+PtKD6zoACwW61MuNBo8iqT8dc6Es4Rwqi5u7jCuEtW=Dw@mail.gmail.com)**
Peter Smith provided detailed review comments on v36 of the EXCEPT TABLE patch for PostgreSQL publications. Key issues include unaddressed feedback from previous reviews, unclear documentation about publish_via_partition_root behavior with EXCEPT clauses, missing hint messages for partition exclusion errors, and redundant test coverage. Vignesh C responded to implementation challenges for partitioned tables, proposing a solution where excluded partitions are marked with a flag in pg_publication_rel, and tablesync workers construct UNION queries to copy only non-excluded partition data when publish_via_partition_root is enabled. The discussion focuses on balancing user flexibility with implementation complexity for partition exclusion in logical replication.

Peter Smith对PostgreSQL发布的EXCEPT TABLE补丁v36版本提供了详细的审查意见。关键问题包括之前审查反馈未得到解决、关于publish_via_partition_root与EXCEPT子句行为的文档不清楚、分区排除错误缺少提示信息，以及冗余的测试覆盖。Vignesh C回应了分区表的实现挑战，提出了一个解决方案：在pg_publication_rel中用标志标记被排除的分区，当启用publish_via_partition_root时，tablesync工作进程构造UNION查询仅复制未被排除的分区数据。讨论重点是在逻辑复制中平衡分区排除的用户灵活性和实现复杂性。

Participants:
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

### **[Non\-text mode for pg\_dumpall](https://www.postgresql.org/message-id/CAC6VRoZbP=-=a+a78RoWcs2L4=4VEDZqJMg+7SyUAcSHATyDAQ@mail.gmail.com)**
Tushar is testing Mahendra's patch for adding non-text format support to pg_dumpall and reporting several issues. Key problems include: tables not being restored when using --transaction-size switch with pg_restore, syntax errors with \\connect commands when using --jobs parallel mode, and cross-cluster restore failures when role ownership differs between source and target clusters. Mahendra has fixed some issues including the transaction-size problem and syntax errors, but parallel mode user errors and role ownership issues remain unresolved. Minor cosmetic issues like double slashes in file paths (abc.tar//map.dat) have also been identified. The discussion focuses on making pg_dumpall's non-text output behavior identical to plain text dumps while addressing restore compatibility problems.
该讨论涉及Tushar测试Mahendra为pg_dumpall添加非文本格式支持的补丁并报告了几个问题。主要问题包括：使用--transaction-size选项进行pg_restore时表无法恢复，使用--jobs并行模式时\\connect命令出现语法错误，以及当源集群和目标集群之间角色所有权不同时跨集群恢复失败。Mahendra已修复了一些问题，包括transaction-size问题和语法错误，但并行模式用户错误和角色所有权问题仍未解决。还发现了文件路径中双斜杠（abc.tar//map.dat）等小的外观问题。讨论重点是让pg_dumpall的非文本输出行为与纯文本转储相同，同时解决恢复兼容性问题。

Participants:
* jian.universality@gmail.com
* mahi6run@gmail.com
* tushar.ahuja@enterprisedb.com
* vaibhav.dalvi@enterprisedb.com

### **[Optimize IS DISTINCT FROM with non\-nullable inputs](https://www.postgresql.org/message-id/CAMbWs49BMAOWvkdSHxpUDnniqJcEcGq3_8dd_5wTR4xrQY8urA@mail.gmail.com)**
Richard Guo proposes optimizing PostgreSQL's IS DISTINCT FROM predicate when inputs are proven non-nullable. Currently, the planner only simplifies DistinctExpr with constant inputs. The proposed optimization would convert "x IS DISTINCT FROM y" to "x <> y" and "x IS NOT DISTINCT FROM y" to "x = y" when inputs are non-nullable, since the semantics are identical for non-null values. This transformation would expose comparisons as standard operators, enabling the planner to use index scans, merge joins, hash joins, and equivalence class-based optimizations. A draft patch is provided, but concerns remain about potential edge cases with rowtype inputs that might make the transformation unsafe.

Richard Guo提议优化PostgreSQL的IS DISTINCT FROM谓词，当输入被证明为非空时。目前，规划器仅在所有输入都是常量时才简化DistinctExpr。提议的优化将在输入非空时将"x IS DISTINCT FROM y"转换为"x <> y"，将"x IS NOT DISTINCT FROM y"转换为"x = y"，因为对于非空值语义相同。此转换将比较暴露为标准操作符，使规划器能够使用索引扫描、合并连接、哈希连接和等价类优化。已提供草案补丁，但对于可能使转换不安全的rowtype输入边缘情况仍有担忧。

Participants:
* guofenglinux@gmail.com

### **[Use correct collation in pg\_trgm](https://www.postgresql.org/message-id/1981b5f0-7d06-4911-a231-23bbb6bf504c@gmail.com)**
David Geier responds to feedback on his pg_trgm collation fix patch. He acknowledges Zsolt Parragi's review confirming the patch works as intended and addresses the suggestion to include test cases. Geier has added a second patch (0002) to fix word boundary detection which also uses incorrect collation, discovered while reading related discussions. He has enhanced both patches with appropriate test cases and improved commit messages. Geier notes that release notes are typically collected retroactively before releases rather than included in individual bug fix commits. The patches address collation issues in pg_trgm that would require REINDEX after applying the fix.
David Geier回应了对他的pg_trgm排序规则修复补丁的反馈。他确认了Zsolt Parragi的审查意见，证实补丁按预期工作，并处理了包含测试用例的建议。Geier添加了第二个补丁(0002)来修复单词边界检测中同样使用错误排序规则的问题，这是在阅读相关讨论时发现的。他为两个补丁都增强了适当的测试用例并改进了提交消息。Geier指出，发布说明通常在发布前追溯收集，而不是包含在个别错误修复提交中。这些补丁解决了pg_trgm中的排序规则问题，应用修复后需要REINDEX。

Participants:
* geidav.pg@gmail.com
* hlinnaka@iki.fi
* reshkekirill@gmail.com
* zsolt.parragi@percona.com

### **[Auto\-tune shared\_buffers to use available huge pages](https://www.postgresql.org/message-id/CAO6_Xqq6w5hTY_W+gJWp29t15NRtNLSTzD6khDC=Xy2P0BWPTQ@mail.gmail.com)**
The proposal introduces a new configuration option `huge_pages_autotune_buffers` to automatically adjust shared_buffers based on available huge pages in containerized environments like Kubernetes. Currently, tuning shared_buffers to fit fixed huge page allocations is complex because it requires iterative adjustments and affects multiple auto-tuned parameters. The patch modifies the auto-tune logic by having subsystems rely on configured rather than auto-tuned shared_buffers values, calculating leftover huge page memory, and estimating optimal shared_buffers size while accounting for the freelist hashmap overhead. The implementation spans five sub-patches covering auto-tune function extraction, checkpoint request size GUC addition, huge page parsing improvements, parameter passing modifications, and the core BufferManagerAutotune functionality.

该提案引入了新的配置选项`huge_pages_autotune_buffers`，用于在Kubernetes等容器化环境中根据可用的大页面自动调整shared_buffers。目前，调整shared_buffers以适应固定的大页面分配非常复杂，因为需要迭代调整并影响多个自动调优参数。该补丁修改了自动调优逻辑，让子系统依赖配置的而非自动调优的shared_buffers值，计算剩余的大页面内存，并估算最优的shared_buffers大小，同时考虑空闲列表哈希映射的开销。实现涵盖五个子补丁，包括自动调优函数提取、检查点请求大小GUC添加、大页面解析改进、参数传递修改以及核心的BufferManagerAutotune功能。

Participants:
* anthonin.bonnefoy@datadoghq.com

### **[WIP \- xmlvalidate implementation from TODO list](https://www.postgresql.org/message-id/08052569-9384-41b5-bcb7-33929fcc6c71@uni-muenster.de)**
Jim Jones is reviewing Marcos Magueta's XML schema validation implementation patch. Key changes discussed include switching the schemadata column in pg_xmlschema from text to xml type, which Jones agrees makes the system more intuitive and facilitates functions like xmlserialize. Jones notes that a redundant duplicate check function (IsThereXmlSchemaInNamespace) was properly removed from DefineXmlSchema since XmlSchemaCreate already handles this validation. The patch now includes tab completion for psql and pg_dump support for CREATE XMLSCHEMA statements. Outstanding issues include missing patch versioning, compilation dependencies between patches due to IS_XMLVALIDATE requirements, and incomplete documentation for GRANT USAGE permissions on XML schemas. Jones questions whether dedicated roles (pg_read_xmlschemas, pg_write_xmlschemas) might be preferable for privilege control. A follow-up clarification asks whether a_expr is actually needed in CREATE XMLSCHEMA syntax since the schema data appears to always be a string literal.
Jim Jones正在审查Marcos Magueta的XML模式验证实现补丁。讨论的关键变更包括将pg_xmlschema中的schemadata列从text类型改为xml类型，Jones同意这使系统更直观并便于xmlserialize等函数使用。Jones指出冗余的重复检查函数(IsThereXmlSchemaInNamespace)已从DefineXmlSchema中正确移除，因为XmlSchemaCreate已处理此验证。补丁现在包含psql的制表符补全和pg_dump对CREATE XMLSCHEMA语句的支持。待解决问题包括缺少补丁版本控制、由于IS_XMLVALIDATE要求导致补丁间编译依赖，以及XML模式GRANT USAGE权限的文档不完整。Jones质疑专用角色(pg_read_xmlschemas, pg_write_xmlschemas)是否更适合权限控制。后续澄清询问CREATE XMLSCHEMA语法中是否真正需要a_expr，因为模式数据似乎总是字符串字面量。

Participants:
* jim.jones@uni-muenster.de
* maguetamarcos@gmail.com
* reshkekirill@gmail.com
* x4mmm@yandex-team.ru

### **[display hot standby state in psql prompt](https://www.postgresql.org/message-id/d81c08f6-1a4f-48ee-b1ff-e78b145c9e12@uni-muenster.de)**
Jim Jones proposes reverting to the original suggestion of displaying "primary" or "standby" server status in the psql prompt, following Fujii Masao's preference for this approach over showing read-only transaction state. Fujii had expressed support for indicating server role in the prompt as helpful for managing multiple PostgreSQL servers, while questioning the utility of displaying transaction read-only status. With no objections from other reviewers, Jim seeks consensus on switching back to the primary/standby indicator implementation. The discussion appears ready to move forward with the simplified server role display feature.
Jim Jones 提议回到最初建议，在 psql 提示符中显示"主"或"备"服务器状态，这是基于 Fujii Masao 偏好此方法而非显示只读事务状态。Fujii 曾表示支持在提示符中显示服务器角色，认为这对管理多个 PostgreSQL 服务器有帮助，但质疑显示事务只读状态的实用性。由于其他审阅者没有反对意见，Jim 寻求就切换回主/备指示器实现达成共识。讨论似乎准备推进这个简化的服务器角色显示功能。

Participants:
* andreas@proxel.se
* htamfids@gmail.com
* jim.jones@uni-muenster.de
* li.evan.chao@gmail.com
* masao.fujii@gmail.com
* nathandbossart@gmail.com
* srinath2133@gmail.com

### **[AIX support](https://www.postgresql.org/message-id/SJ4PPFB81778326EC35CBFA16B5449CFA97DB94A@SJ4PPFB81778326.namprd15.prod.outlook.com)**
Sriram has submitted updated patches for AIX support in PostgreSQL, following Peter's request for a complete plan before detailed review. The submission includes two patches: Meson build system changes (0001-Support-for-AIX-pg19-meson.2.diff) and complete AIX support changes (0001-Support-for-AIX.pg19.v11.patch). The patches incorporate fixes based on Peter's previous comments. Sriram specifically requests review of the Meson-related changes and mentions that statistics for s_lock.h regarding TAS (Test-and-Set) operations will be submitted separately in a different thread. This represents progress on enabling PostgreSQL compilation and functionality on IBM's AIX operating system.

Sriram已提交了PostgreSQL AIX支持的更新补丁，这是根据Peter要求在详细审查前提供完整计划而提交的。提交包括两个补丁：Meson构建系统更改（0001-Support-for-AIX-pg19-meson.2.diff）和完整的AIX支持更改（0001-Support-for-AIX.pg19.v11.patch）。补丁根据Peter之前的评论进行了修复。Sriram特别请求审查与Meson相关的更改，并提到关于TAS（测试并设置）操作的s_lock.h统计数据将在不同的线程中单独提交。这代表了在IBM AIX操作系统上启用PostgreSQL编译和功能的进展。

Participants:
* peter@eisentraut.org
* sriram.rk@in.ibm.com

### **[More speedups for tuple deformation](https://www.postgresql.org/message-id/pmik622adey6fnddivkt4uvkulvnc6rasmq3tcbrzeglx4hsn7@f3x6e2eph3w5)**
Andres Freund tested a tuple deformation speedup patch (v4) on Intel machines with controlled benchmarking conditions, finding impressive overall results despite some minor slowdowns in extra_cols=0 cases on Sapphire Rapids. Chao Li confirmed significant improvements on MacBook M4, showing up to 43% faster performance with v4 compared to master, and an additional 3.5% improvement with a minor tweak optimizing first_null_attr() for natts == 0. Andres suggested adding incremental deforming test cases to the benchmark and recommended using WHERE a < 0 instead of SUM(a) to reduce executor overhead and better isolate deformation performance changes. He also noted concerns about potential regressions from repeated first_null_attr() computations and mentioned plans for a separate discussion about suboptimal generated code in ExecSeqScanWithQual().

Andres Freund在Intel机器上对元组变形加速补丁(v4)进行了受控基准测试，发现总体结果令人印象深刻，尽管在Sapphire Rapids的extra_cols=0情况下有轻微的性能下降。Chao Li在MacBook M4上证实了显著的性能提升，v4相比master版本快了43%，而优化natts == 0时first_null_attr()的小调整又额外提升了3.5%的性能。Andres建议在基准测试中增加增量变形测试用例，并推荐使用WHERE a < 0代替SUM(a)以减少执行器开销，更好地隔离变形性能变化。他还担心重复的first_null_attr()计算可能导致性能退化，并提到计划就ExecSeqScanWithQual()中的次优生成代码单独讨论。

Participants:
* andres@anarazel.de
* dgrowleyml@gmail.com
* li.evan.chao@gmail.com

### **[Proposal: Adding compression of temporary files](https://www.postgresql.org/message-id/CAFjYY+LMTciR=3SLh+8EbAFjumQTrcTKbyU703Srzy3j_yEhSw@mail.gmail.com)**
Filip Janus has updated the temporary file compression patch for PostgreSQL, incorporating feedback from reviewers. The patch adds a new temp_file_compression GUC parameter supporting LZ4 and PGLZ compression methods. Lakshmi tested the functionality and provided a documentation patch, noting that hash join spills may not show visible size reduction due to fixed-size chunking. Zsolt Parragi identified several issues during code review: typos in comments, unused variables, inconsistent constant definitions, missing error handling for undefined compression methods, and potential problems with seek/tell operations on compressed files. Filip acknowledged the feedback and incorporated Lakshmi's documentation improvements, but the technical issues raised by Zsolt still need to be addressed in future iterations.
Filip Janus已更新了PostgreSQL临时文件压缩补丁，采纳了审查者的反馈。该补丁添加了新的temp_file_compression GUC参数，支持LZ4和PGLZ压缩方法。Lakshmi测试了功能并提供了文档补丁，指出由于固定大小的分块，哈希连接溢出可能不会显示明显的大小减少。Zsolt Parragi在代码审查中发现了几个问题：注释中的拼写错误、未使用的变量、不一致的常量定义、未定义压缩方法缺少错误处理，以及压缩文件的seek/tell操作的潜在问题。Filip确认了反馈并采纳了Lakshmi的文档改进，但Zsolt提出的技术问题仍需在后续版本中解决。

Participants:
* fjanus@redhat.com
* lakshmigcdac@gmail.com
* zsolt.parragi@percona.com

### **[Fix rounding method used to compute huge pages](https://www.postgresql.org/message-id/CAO6_Xqp8NVAeNuDgWaMW_+AKHSQTC4nARbJVW23DkXT6KGh81Q@mail.gmail.com)**
A bug fix for the rounding method used to compute huge pages in PostgreSQL was discussed and committed. Nathan Bossart acknowledged introducing the bug but noted it's unlikely to cause practical problems. Two approaches were debated for fixing the rounding calculation: Anthonin Bonnefoy's original method using `add_size(size_b, hp_size - (size_b % hp_size))` for consistency with CreateAnonymousSegment, and Nathan's simplified version using `add_size(hp_required, 1)`. Nathan ultimately committed the fix, preferring his approach to avoid relying on assumptions about overflow conditions, despite the extremely low probability of issues occurring (requiring allocation of around 18 exabytes). The patch was successfully applied.

Nathan Bossart承认引入了PostgreSQL中用于计算大页面的舍入方法错误，但指出这不太可能造成实际问题。讨论了两种修复舍入计算的方法：Anthonin Bonnefoy提出的使用`add_size(size_b, hp_size - (size_b % hp_size))`与CreateAnonymousSegment保持一致的原始方法，以及Nathan简化的使用`add_size(hp_required, 1)`版本。Nathan最终提交了修复，倾向于他的方法以避免依赖溢出条件假设，尽管出现问题的概率极低（需要分配大约18艾字节）。补丁已成功应用。

Participants:
* anthonin.bonnefoy@datadoghq.com
* michael@paquier.xyz
* nathandbossart@gmail.com

### **[Import Statistics in postgres\_fdw before resorting to sampling\.](https://www.postgresql.org/message-id/CAExHW5u6ue1hMqjAubLAbz_ZQqZRdnwJAQtWUw=b+3NXTzYy-A@mail.gmail.com)**
The discussion focuses on a postgres_fdw patch that enables importing statistics from remote tables before falling back to row sampling. Ashutosh Bapat raises a significant limitation: the statistics import facility only works with analyze_rel() but not acquire_inherited_sample_rows(), which handles partitioned tables with foreign partitions. This means typical sharding use cases cannot benefit from the feature. He suggests calculating parent table statistics by combining children's statistics rather than synthesizing sample rows. Corey Huinker acknowledges that synthesizing sample rows from imported statistics isn't feasible and agrees the patch can only eliminate one of two required samples. The limitation needs proper documentation, as current docs suggest all foreign tables can use this facility. Corey commits to fixing the documentation to clarify that the limitation applies to any foreign child table, not just partitioned tables.
该讨论集中在postgres_fdw补丁上，该补丁允许在回退到行采样之前从远程表导入统计信息。Ashutosh Bapat提出了一个重要限制：统计信息导入功能只适用于analyze_rel()而不适用于acquire_inherited_sample_rows()，后者处理具有外部分区的分区表。这意味着典型的分片用例无法从该功能中受益。他建议通过组合子表统计信息来计算父表统计信息，而不是合成样本行。Corey Huinker承认从导入的统计信息合成样本行是不可行的，并同意该补丁只能消除两个所需样本中的一个。该限制需要适当的文档说明，因为当前文档暗示所有外部表都可以使用此功能。Corey承诺修复文档，明确该限制适用于任何外部子表，而不仅仅是分区表。

Participants:
* ashutosh.bapat.oss@gmail.com
* corey.huinker@gmail.com
* etsuro.fujita@gmail.com
* jkatz@postgresql.org
* michael@paquier.xyz
* nathandbossart@gmail.com

### **[New year, new commitfest app improvements](https://www.postgresql.org/message-id/CAGECzQSdK5vc-zVkqEFztRvSAc9E=csZdW+Tp5gH0U=oCpyxzg@mail.gmail.com)**
Jelte Fennema-Nio has deployed major improvements to the commitfest app, slightly delayed from the original January 20th target date. The deployment is now live and users are encouraged to report any issues they encounter. A significant milestone is planned for February 1st, which will mark the first time patches are automatically moved and notification emails are sent to authors for unmoved patches. This represents a key automation enhancement to the commitfest workflow. The community is asked to monitor for bugs or problems around the February 1st date when this new automated functionality goes into effect.

Jelte Fennema-Nio已部署了commitfest应用的重大改进，比原定的1月20日目标日期略有延迟。部署现已上线，鼓励用户报告遇到的任何问题。2月1日将是一个重要的里程碑，这将是第一次自动移动补丁并向未移动补丁的作者发送通知邮件。这代表了commitfest工作流程的关键自动化增强。要求社区在2月1日左右监控错误或问题，届时这一新的自动化功能将生效。

Participants:
* me@jeltef.nl

### **[Time to add FIDO2 support?](https://www.postgresql.org/message-id/b55c256c-1e48-4188-8c7a-629a38d7a021@app.fastmail.com)**
Joel Jacobson proposes adding FIDO2 as a new SASL authentication mechanism for PostgreSQL, inspired by macOS Tahoe's built-in support for Secure Enclave-backed SSH keys. The proposal involves reusing OpenSSH hardware-backed FIDO2 SSH keys, registering them with PostgreSQL roles via ALTER ROLE ADD CREDENTIAL, and configuring "fido2" authentication in pg_hba.conf. Users would load resident keys with ssh-add -K and connect using PGSKPROVIDER environment variable. Zsolt Parragi expresses strong interest, noting he implemented FIDO authentication for Percona Server for MySQL. However, he points out that SASL only has draft specifications for FIDO, not accepted RFCs, and suggests proper multi-factor authentication implementation would require changes to pg_hba processing.
Joel Jacobson提议为PostgreSQL添加FIDO2作为新的SASL认证机制，受macOS Tahoe内置安全区域支持的SSH密钥启发。该提案涉及重用OpenSSH硬件支持的FIDO2 SSH密钥，通过ALTER ROLE ADD CREDENTIAL将其注册到PostgreSQL角色，并在pg_hba.conf中配置"fido2"认证。用户需要使用ssh-add -K加载常驻密钥，并使用PGSKPROVIDER环境变量连接。Zsolt Parragi表达了强烈兴趣，提到他为Percona Server for MySQL实现了FIDO认证。然而，他指出SASL目前只有FIDO的草案规范，没有被接受的RFC，并建议适当的多因素认证实现需要修改pg_hba处理。

Participants:
* joel@compiler.org
* zsolt.parragi@percona.com

### **[Unstable path in index regress test query](https://www.postgresql.org/message-id/CAN-LCVOgBms6==prC48io0kw_muQfYerEbiYxNivqRCcLgL0qw@mail.gmail.com)**
Nikita Malakhov reported unstable query execution plans for a SELECT query from the create_index regress test. The same query would randomly return either a Bitmap Heap Scan with Sort or an Index Only Scan plan when executed multiple times. Tom Lane explained that this behavior is not a bug but expected behavior due to timing issues with autovacuum and table statistics. The first execution uses default statistics without autovacuum having processed the table, while subsequent executions may have updated statistics. Lane recommended using VACUUM ANALYZE instead of just ANALYZE to ensure the table is marked all-visible, which affects index-only scan cost estimates. Malakhov confirmed the solution works and thanked Lane for the clarification.

Nikita Malakhov 报告了 create_index 回归测试中一个 SELECT 查询执行计划不稳定的问题。同一查询多次执行时会随机返回位图堆扫描加排序或仅索引扫描两种不同的执行计划。Tom Lane 解释说这种行为不是错误，而是由于自动清理和表统计信息的时序问题导致的预期行为。第一次执行使用默认统计信息，此时自动清理尚未处理表，而后续执行可能已更新统计信息。Lane 建议使用 VACUUM ANALYZE 而不是仅使用 ANALYZE，以确保表被标记为全可见，这会影响仅索引扫描的成本估算。Malakhov 确认解决方案有效并感谢 Lane 的澄清。

Participants:
* hukutoc@gmail.com
* tgl@sss.pgh.pa.us

### **[Don't synchronously wait for already\-in\-progress IO in read stream](https://www.postgresql.org/message-id/CAAKRu_atdnPCCy=kfxqWT62Ckaiz3G5t=S97tW24CuL3i3fFfQ@mail.gmail.com)**
Melanie Plageman has implemented v3 of the patch following Thomas Munro's suggestion to merge the in-progress check into ReadBuffersCanStartIO(). The new approach should only require waiting when a backend encounters a buffer after another backend sets BM_IO_IN_PROGRESS but before setting the buffer descriptor's wait reference. The patch includes Andres' test-related changes, preliminary refactoring, and the foreign IO concept with suggested structure improvements. Several uncertainties remain: proper placement of pgaio_submit_staged() calls, whether StartBufferIO() should work with AsyncReadBuffers() (currently using separate PrepareNewReadBufferIO() helper), and testing methodology to verify the new behavior doesn't wait for foreign IO until WaitReadBuffers(). The implementation aims to eliminate synchronous waits for already-in-progress IO operations while maintaining code clarity and avoiding unnecessary overhead.
Melanie Plageman 已实现了 v3 补丁，采用了 Thomas Munro 建议的将进行中检查合并到 ReadBuffersCanStartIO() 的方法。新方法应该只在后端遇到缓冲区时需要等待，即当另一个后端设置了 BM_IO_IN_PROGRESS 但尚未设置缓冲区描述符的等待引用时。补丁包含 Andres 的测试相关更改、初步重构和带有建议结构改进的外部 IO 概念。仍存在几个不确定性：pgaio_submit_staged() 调用的正确位置、StartBufferIO() 是否应与 AsyncReadBuffers() 协作（目前使用单独的 PrepareNewReadBufferIO() 辅助函数），以及验证新行为在 WaitReadBuffers() 之前不等待外部 IO 的测试方法。该实现旨在消除对已进行中 IO 操作的同步等待，同时保持代码清晰并避免不必要的开销。

Participants:
* andres@anarazel.de
* melanieplageman@gmail.com
* pg@bowt.ie
* thomas.munro@gmail.com
* tv@fuzzy.cz

### **[\[PATCH\] tests: verify renamed index functionality in alter\_table](https://www.postgresql.org/message-id/CAOj6k6fmk_wc3Rk-9hdoXdBq06iGx7AdAO2Md9HCf=QBsREz8w@mail.gmail.com)**
Dharin Shah submitted a patch to add tests for verifying renamed index functionality in alter_table operations. Surya Poondla reviewed the patch and confirmed that the changes look good, with all tests passing after applying the patch. Following the positive review, Dharin rebased the patch against the master branch and indicated it is now ready to be merged. The discussion appears to have reached completion with successful code review and testing, awaiting final merge into the codebase.
Dharin Shah 提交了一个补丁，用于添加测试以验证 alter_table 操作中重命名索引的功能。Surya Poondla 审查了该补丁并确认更改看起来不错，应用补丁后所有测试都通过了。在获得积极的审查后，Dharin 将补丁重新基于主分支并表示现在已准备好合并。讨论似乎已经完成，代码审查和测试成功，等待最终合并到代码库中。

Participants:
* dharinshah95@gmail.com
* suryapoondla4@gmail.com

### **[\[PATCH\] Reserve protocol 3\.1 explicitly in pqcomm\.h](https://www.postgresql.org/message-id/CAOYmi+mbza4JbqZ2_tAbpWKQuLiUn-FQhJC8e-eFvayA_bNV9A@mail.gmail.com)**
This thread discusses a patch to explicitly reserve protocol version 3.1 in PostgreSQL's pqcomm.h header file. The discussion focused on the naming convention for the reserved protocol constant. Jelte Fennema-Nio suggested using "RESERVED" as it provides better clarity, with the rationale explained in accompanying comments. Jacob Champion accepted this recommendation and committed the patch using the final name PG_PROTOCOL_RESERVED_31. The patch has been successfully integrated into the codebase, resolving the discussion with no remaining open issues.
这个讨论涉及在PostgreSQL的pqcomm.h头文件中显式保留协议版本3.1的补丁。讨论重点是保留协议常量的命名约定。Jelte Fennema-Nio建议使用"RESERVED"，因为它提供了更好的清晰度，并在相关注释中解释了原理。Jacob Champion接受了这个建议，并使用最终名称PG_PROTOCOL_RESERVED_31提交了补丁。该补丁已成功集成到代码库中，解决了讨论，没有剩余的未决问题。

Participants:
* jacob.champion@enterprisedb.com
* postgres@jeltef.nl
* tgl@sss.pgh.pa.us

### **[alignas \(C11\)](https://www.postgresql.org/message-id/3119480.1769189606@sss.pgh.pa.us)**
A PostgreSQL C11 alignas patch initially passed buildfarm testing but later broke when test_cplusplusext was added. Older G++ compilers (version 6 and below) reject large alignment requests (4096 bytes) in C++ mode, showing warnings that requested alignment exceeds the compiler's 128-byte limit. Peter Eisentraut identified this as a known GCC bug (#89357) that was fixed in GCC version 9. The proposed workaround involves using `__attribute__((aligned(a)))` syntax specifically for affected G++ versions. Tom Lane suggests setting the version cutoff at GCC 9 rather than 6, as intermediate versions may also be affected despite lack of buildfarm complaints.
PostgreSQL的C11 alignas补丁最初通过了buildfarm测试，但在添加test_cplusplusext后出现问题。较旧的G++编译器（版本6及以下）在C++模式下拒绝大对齐请求（4096字节），显示请求的对齐超过编译器128字节限制的警告。Peter Eisentraut识别这是一个已知的GCC错误（#89357），已在GCC版本9中修复。建议的解决方案是对受影响的G++版本专门使用`__attribute__((aligned(a)))`语法。Tom Lane建议将版本截止点设在GCC 9而不是6，因为尽管buildfarm没有投诉，中间版本也可能受到影响。

Participants:
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[Custom oauth validator options](https://www.postgresql.org/message-id/CAOYmi+nhh-fChn-8K7HV4kwVwsTm_gVy5jBgUBMqfM6Hm5E4zg@mail.gmail.com)**
Jacob Champion responds to discussions about custom OAuth validator options in PostgreSQL's HBA configuration. He suggests namespacing GUCs instead of making HBA option names reserved, proposing syntax like `guc.log_connections` since most HBA settings will be method-specific parameters rather than GUCs. He expresses concern about consistency with the pg_hosts.conf file approach for SNI, noting that adding key=value pairs later for compatibility would still require writing values for columns they're trying to replace with GUC settings. Champion acknowledges that a DefineCustomValidatorStringVariable function could work as an interim solution that could later forward to DefineCustomStringVariable when a more general PGC_HBA context is implemented.
Jacob Champion回应了关于PostgreSQL HBA配置中自定义OAuth验证器选项的讨论。他建议对GUC进行命名空间化而不是将HBA选项名称设为保留名称，提出类似`guc.log_connections`的语法，因为大多数HBA设置将是特定方法的参数而非GUC。他对SNI的pg_hosts.conf文件方法的一致性表示担忧，指出后续添加键值对以保持兼容性仍需要为试图用GUC设置替换的列编写值。Champion认为DefineCustomValidatorStringVariable函数可以作为临时解决方案，在实现更通用的PGC_HBA上下文时可转发到DefineCustomStringVariable。

Participants:
* david.g.johnston@gmail.com
* jacob.champion@enterprisedb.com
* myon@debian.org
* robertmhaas@gmail.com
* vasukianand0119@gmail.com
* zsolt.parragi@percona.com

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/7ib3sa55sapwjlaz4sijbiq7iezna27kjvvvar4dpgkmadml6t@gfpkkwmdnepx)**


Participants:
* andres@anarazel.de
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* x4mmm@yandex-team.ru
* xunengzhou@gmail.com

### **[\[oauth\] Stabilize the libpq\-oauth ABI \(and allow alternative implementations?\)](https://www.postgresql.org/message-id/CAOYmi+mQeneEuoWsO1uOZszrE_tMuF51sKNzT0Z=cevpV5H3_g@mail.gmail.com)**
Jacob Champion responds to Zsolt Parragi's questions about OAuth implementation in PostgreSQL. He clarifies that client-side validation against malicious servers is necessary even with server-side validation, which is why clients must specify an issuer in connection strings. Champion acknowledges that any plaintext password method like LDAP can tunnel arbitrary data similar to Bearer tokens when both sides are controlled. While supporting the concept of pluggable authentication systems, he argues that OAUTHBEARER is not the appropriate layer for non-OAuth authentication methods, suggesting SASL as the correct layer instead. He mentions examining GitHub and Cirrus use cases where OAuth tokens are provided as environment variables for CI purposes.
Jacob Champion回应了Zsolt Parragi关于PostgreSQL中OAuth实现的问题。他澄清即使有服务器端验证，针对恶意服务器的客户端验证仍是必要的，这就是为什么客户端必须在连接字符串中指定发行者。Champion承认任何明文密码方法如LDAP都可以像Bearer令牌一样在双方受控时传输任意数据。虽然支持可插拔认证系统的概念，但他认为OAUTHBEARER不是非OAuth认证方法的合适层，建议SASL才是正确的层。他提到会检查GitHub和Cirrus的用例，其中OAuth令牌作为环境变量提供给CI使用。

Participants:
* jacob.champion@enterprisedb.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[docs: clarify ALTER TABLE behavior on partitioned tables](https://www.postgresql.org/message-id/CAN4CZFNoLSUcVKcOOJgOtTkDuOseCL5j9MQr3tGjb3btD=jHNQ@mail.gmail.com)**
A documentation patch for PostgreSQL's ALTER TABLE behavior on partitioned tables is being reviewed. Zsolt Parragi provided detailed feedback on grammar errors, unclear wording, and inconsistencies. Key issues include missing conjunctions ("and"), confusing terminology like "partition columns constraints," and incomplete documentation of inheritance behavior. David Johnston responded with proposed corrections, including better wording for constraint propagation, clearer descriptions of ONLY clause behavior, and improved explanations of property inheritance when partitions are created. Johnston also clarified that dependent constraints are dropped from partitions and acknowledged that some inheritance documentation was incomplete. A follow-up correction addressed the behavior of DROP COLUMN with multiple parents, confirming that descendant columns are marked as independent when certain conditions aren't met.
关于PostgreSQL分区表ALTER TABLE行为的文档补丁正在接受审查。Zsolt Parragi提供了详细反馈，指出语法错误、措辞不清和不一致问题。主要问题包括缺少连词("and")、"partition columns constraints"等令人困惑的术语，以及继承行为的不完整文档。David Johnston回应了建议的修正，包括约束传播的更好措辞、ONLY子句行为的更清晰描述，以及创建分区时属性继承的改进解释。Johnston还澄清了依赖约束从分区中删除，并承认某些继承文档不完整。后续修正处理了多父级DROP COLUMN的行为，确认当某些条件不满足时，后代列被标记为独立。

Participants:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[ON CONFLICT DO SELECT \(take 3\)]()**
Viktor Holmberg submitted version 20 of the ON CONFLICT DO SELECT patch after addressing review feedback from Jian He. The discussion covers several technical issues: whitespace problems detectable with `git diff --check`, incorrect comments in row-level security tests, and a critical bug in release builds where Assert macros are optimized out, potentially causing undefined behavior with the `existing` tuple slot. Jian suggested replacing the problematic Assert with proper error handling using `elog(ERROR)`. Additional concerns include clarifying RLS policy evaluation behavior, updating comments about WCOKind enum values, and ensuring proper documentation links are included in the commit message. Viktor mentioned finding two more places in the codebase requiring updates for ON CONFLICT references.
Viktor Holmberg 提交了 ON CONFLICT DO SELECT 补丁的第 20 版，解决了 Jian He 的审查反馈。讨论涵盖几个技术问题：可通过 `git diff --check` 检测的空白字符问题、行级安全测试中的错误注释，以及发布版本中的关键 bug，其中 Assert 宏被优化掉，可能导致 `existing` 元组槽的未定义行为。Jian 建议用 `elog(ERROR)` 的适当错误处理替换有问题的 Assert。其他关注点包括澄清 RLS 策略评估行为、更新 WCOKind 枚举值的注释，以及确保在提交消息中包含适当的文档链接。Viktor 提到在代码库中发现还有两处需要更新 ON CONFLICT 引用的地方。

Participants:
* andreas@proxel.se
* dean.a.rasheed@gmail.com
* jian.universality@gmail.com
* marko@joh.to
* v@viktorh.net