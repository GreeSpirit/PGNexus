---
layout: post
title: PostgreSQL Daily News 2026-02-04
---

# PostgreSQL Daily News#42 2026-02-04



## **PostgreSQL Articles - PostgreSQL 技术博客**

### **[Why OpenAI Should Use Postgres Distributed](https://enterprisedb.com/blog/why-openai-should-use-postgres-distributed)**
PostgreSQL has demonstrated its capability by scaling to 800 million users, showcasing the database's power while revealing limitations of single-primary architectures under extreme load. The case highlights challenges for large-scale, always-on systems that require consistent high availability. EDB Postgres Distributed addresses these architectural constraints by providing a solution designed specifically for enterprise-scale deployments that demand continuous operation and can handle massive user bases without the bottlenecks inherent in traditional single-primary setups.

PostgreSQL 通过扩展到8亿用户展示了其强大能力，同时也暴露了单主架构在极端负载下的局限性。这个案例突出了大规模、永远在线系统所面临的挑战，这些系统需要持续的高可用性。EDB Postgres Distributed 通过提供专门为企业级部署设计的解决方案来解决这些架构限制，这些部署要求持续运行并能够处理大量用户群体，而不会出现传统单主设置固有的瓶颈。

`enterprisedb.com`

### **[The Gravity of Open Standards: PostgreSQL as the Ultimate Anti-Lock-In Strategy](https://www.cybertec-postgresql.com/en/the-gravity-of-open-standards-postgresql-as-the-ultimate-anti-lock-in-strategy/)**
The article discusses PostgreSQL's inherent anti-lock-in architecture as a strategic advantage for database service providers. Unlike proprietary platforms that rely on vendor lock-in, PostgreSQL-based products must compete on operational quality rather than technical barriers. The author explains how companies like CYBERTEC build value through managed services, high availability, performance optimization, and security hardening around the open-source database. PostgreSQL's portability, standards compliance, and community governance force product managers to focus on service reliability and customer trust rather than artificial dependencies. The piece cites OpenAI's successful scaling of PostgreSQL to support 800 million ChatGPT users as evidence that open standards can serve as foundations for demanding applications. The business model shifts from database ownership to operational excellence.

本文探讨了PostgreSQL固有的防锁定架构如何成为数据库服务提供商的战略优势。与依赖供应商锁定的专有平台不同，基于PostgreSQL的产品必须在运营质量而非技术壁垒方面竞争。作者解释了CYBERTEC等公司如何通过围绕开源数据库提供托管服务、高可用性、性能优化和安全加固来创造价值。PostgreSQL的可移植性、标准合规性和社区治理迫使产品经理专注于服务可靠性和客户信任，而非人为依赖。文章引用OpenAI成功扩展PostgreSQL以支持8亿ChatGPT用户为例，证明开放标准可以作为高要求应用的基础。商业模式从数据库所有权转向运营卓越。

`Petar Lejic`



## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[pg\_upgrade: transfer pg\_largeobject\_metadata's files when possible](https://www.postgresql.org/message-id/3yd2ss6n7xywo6pmhd7jjh3bqwgvx35bflzgv3ag4cnzfkik7m@hiyadppqxx6w)**
Andres Freund raises concerns about a recently committed pg_upgrade optimization that transfers pg_largeobject_metadata files when possible. He finds the implementation confusing because it both migrates the pg_largeobject_metadata table and performs COPY operations for large objects with comments or security labels. This appears to risk uniqueness violations, though it works because the COPY happens into a relfilenode that gets overwritten later. Freund argues this non-obvious behavior needs better documentation and questions its safety. He identifies potential issues including incorrect visibility maps when freezing pages on-access, and problems with different segment counts between old and new servers. He suggests the current approach could leave wrong visibility maps or fail to clean up additional segments, creating data corruption risks during upgrades.

Andres Freund对最近提交的一个pg_upgrade优化功能提出了担忧，该功能在可能的情况下传输pg_largeobject_metadata文件。他认为实现方式令人困惑，因为它既迁移pg_largeobject_metadata表，又对带有注释或安全标签的大对象执行COPY操作。这看起来有唯一性冲突的风险，但能正常工作是因为COPY操作发生在一个稍后会被覆盖的relfilenode中。Freund认为这种不明显的行为需要更好的文档说明，并质疑其安全性。他识别出潜在问题，包括在按需冻结页面时产生错误的可见性映射，以及新旧服务器之间段数不同时的问题。他认为当前方法可能留下错误的可见性映射或无法清理额外的段，在升级过程中造成数据损坏风险。

Participants - 参与者:
* andres@anarazel.de
* hannuk@google.com
* michael@paquier.xyz
* nathandbossart@gmail.com
* nitinmotiani@google.com
* tgl@sss.pgh.pa.us

### **[IPC::Run::time\[r|out\] vs our TAP tests](https://www.postgresql.org/message-id/202602032231.t3s7bwhg75yb@alvherre.pgsql)**
Álvaro Herrera is inquiring about the status of a commitfest entry (#4959) related to IPC::Run timeout issues in TAP tests. The patch addresses problems with timeout handling in PostgreSQL's test infrastructure. Earlier discussion involved Andrew Dunstan suggesting code improvements to avoid duplicate timeout checks by leveraging the return value of ok() functions, and Daniel Gustafsson implementing these suggestions with additional perlcritic compliance fixes. Tom Lane confirms this remains an active issue, noting he encountered it recently while working on commit a1d7ae2b2. The commitfest entry appears to have been overlooked rather than deliberately left open, indicating the patches may still need review and integration.

Álvaro Herrera询问与TAP测试中IPC::Run超时问题相关的commitfest条目(#4959)的状态。该补丁解决了PostgreSQL测试基础设施中超时处理的问题。早期讨论中，Andrew Dunstan建议通过利用ok()函数的返回值来避免重复的超时检查，Daniel Gustafsson实现了这些建议并增加了perlcritic合规性修复。Tom Lane确认这仍然是一个活跃的问题，提到他最近在处理提交a1d7ae2b2时遇到了这个问题。commitfest条目似乎是被遗忘了而不是故意保持开放状态，表明这些补丁可能仍需要审查和集成。

Participants - 参与者:
* alvherre@kurilemu.de
* andrew@dunslane.net
* daniel@yesql.se
* hlinnaka@iki.fi
* tgl@sss.pgh.pa.us

### **[Orphaned users in PG16 and above can only be managed by Superusers](https://www.postgresql.org/message-id/202602032234.4w6wdatdighf@alvherre.pgsql)**
Álvaro Herrera inquires about the status of a discussion regarding extending DROP ROLE syntax to include CASCADE/RESTRICT options from the latest SQL standard. The conversation previously established that implementing CASCADE for dependent objects across multiple databases is not feasible, while RESTRICT is already the default behavior. The proposed approach focuses on handling dependent roles rather than database objects like tables and views that span multiple databases. Álvaro notes there is a stale commitfest entry (patch 5608) that remains open and questions whether it should be classified as a bug fix, seeking clarification on the current plan for this feature implementation.

Álvaro Herrera询问关于扩展DROP ROLE语法以包含来自最新SQL标准的CASCADE/RESTRICT选项的讨论状态。之前的对话确定了为跨多个数据库的依赖对象实现CASCADE是不可行的，而RESTRICT已经是默认行为。提议的方法专注于处理依赖角色，而不是跨多个数据库的表、视图等数据库对象。Álvaro注意到有一个过期的commitfest条目（补丁5608）仍然处于开放状态，并质疑是否应该将其归类为错误修复，寻求对此功能实现当前计划的澄清。

Participants - 参与者:
* alvherre@kurilemu.de
* andres@anarazel.de
* andrew@dunslane.net
* ashu.coek88@gmail.com
* nathandbossart@gmail.com
* robertmhaas@gmail.com
* tgl@sss.pgh.pa.us
* tomas@vondra.me

### **[Non\-deterministic buffer counts reported in execution with EXPLAIN ANALYZE BUFFERS](https://www.postgresql.org/message-id/CAJgoLk+13VE_ifhBdBYM9bLvEhEBS9RdU1TSxtuwDvg0vVehPQ@mail.gmail.com)**
Radim Marek reported non-deterministic buffer counts in EXPLAIN ANALYZE BUFFERS output, where Sort nodes show different buffer usage between first and subsequent executions within the same session. The issue stems from catalog lookups (pg_amop/pg_amproc) during execution that get cached after first use. David Rowley argued this is expected behavior since buffer accesses should be reported, questioning why it's considered a bug. Tomas Vondra explained that execution requires additional metadata not needed during planning, suggesting tracking syscache lookups separately might help. Lukas Fittl mentioned his stack-based instrumentation patch could address this by separating different types of buffer access. David noted that moving more work to the planner would require proper plan invalidation and suggested a contrib module to prepopulate caches for testing purposes instead.

Radim Marek报告了EXPLAIN ANALYZE BUFFERS输出中的非确定性缓冲区计数问题，Sort节点在同一会话中首次执行和后续执行之间显示不同的缓冲区使用量。问题源于执行期间的目录查找(pg_amop/pg_amproc)在首次使用后被缓存。David Rowley认为这是预期行为，因为缓冲区访问应该被报告，质疑为什么这被视为bug。Tomas Vondra解释说执行需要规划期间不需要的额外元数据，建议单独跟踪syscache查找可能有帮助。Lukas Fittl提到他的基于堆栈的instrumentation补丁可以通过分离不同类型的缓冲区访问来解决这个问题。David指出将更多工作转移到规划器需要适当的计划失效处理，建议创建一个contrib模块来为测试目的预填充缓存。

Participants - 参与者:
* dgrowleyml@gmail.com
* lukas@fittl.com
* radim@boringsql.com
* tomas@vondra.me

### **[Periodic authorization expiration checks using GoAway message](https://www.postgresql.org/message-id/CAN4CZFNB2n1p6v2pZKA1FuR-ssXJLErijkqwjLWwnOQwc=ygPg@mail.gmail.com)**
Zsolt Parragi conducted manual testing of a patch implementing periodic authorization expiration checks using GoAway messages and identified several issues. The main problems include: CheckPasswordExpiration function doesn't verify if password authentication is used before enforcing expiration, leading to trust authentication users being affected; the check triggers for any user change rather than just the current user, causing performance concerns and incorrect terminations; and the verification uses GetUserId() instead of GetSessionUserId(), meaning SET ROLE commands incorrectly trigger password expiration checks for roles whose passwords weren't actually used. Parragi recommends adding tap tests to ensure proper corner case handling and suggests these issues need resolution before the patch can be considered complete.

Zsolt Parragi对实现使用GoAway消息进行周期性授权过期检查的补丁进行了手动测试，并发现了几个问题。主要问题包括：CheckPasswordExpiration函数在强制执行过期之前没有验证是否使用了密码认证，导致信任认证用户受到影响；检查会针对任何用户更改触发而不仅仅是当前用户，造成性能问题和错误终止；验证使用GetUserId()而不是GetSessionUserId()，意味着SET ROLE命令会错误地为实际上没有使用其密码的角色触发密码过期检查。Parragi建议添加tap测试以确保正确处理边界情况，并建议在补丁被认为完整之前需要解决这些问题。

Participants - 参与者:
* ajitpostgres@gmail.com
* davecramer@gmail.com
* hannuk@google.com
* hlinnaka@iki.fi
* jacob.champion@enterprisedb.com
* postgres@jeltef.nl
* zsolt.parragi@percona.com

### **[Flush some statistics within running transactions](https://www.postgresql.org/message-id/aYGTYZut8q44DcW3@ip-10-97-1-34.eu-west-3.compute.internal)**
The discussion centers on signal handling optimization in PostgreSQL, specifically regarding SetLatch() calls in timeout handlers. Álvaro Herrera investigated whether multiple SetLatch() calls in various signal handlers are necessary, questioning if the original implementation in CheckDeadLockAlert() was just paranoia. He experimented with moving SetLatch() calls and removing redundant ones, with tests showing continued functionality. Bertrand Drouvot agreed that SetLatch() could remain at the top of handle_sig_alarm(), noting signal handlers run to completion without interruption. Andres Freund questioned why SetLatch() placement matters for the original patch, pointing out that repeated calls are harmless since SetLatch() returns immediately if already set. He also noted signal handlers can be interrupted by other signals on some platforms. The participants concluded this tangential discussion isn't relevant to the main thread anymore since the design changed in v5, eliminating the original ProcSleep() issue. They suggested opening a dedicated thread if further discussion is warranted.

讨论围绕PostgreSQL中信号处理优化展开，特别是关于超时处理程序中SetLatch()调用的问题。Álvaro Herrera调查了各种信号处理程序中的多个SetLatch()调用是否必要，质疑CheckDeadLockAlert()中的原始实现是否只是过度谨慎。他尝试移动SetLatch()调用并移除冗余调用，测试显示功能继续正常。Bertrand Drouvot同意SetLatch()可以保留在handle_sig_alarm()顶部，指出信号处理程序运行到完成而不会被中断。Andres Freund质疑为什么SetLatch()位置对原始补丁很重要，指出重复调用是无害的，因为如果已设置，SetLatch()会立即返回。他还注意到在某些平台上，信号处理程序可能被其他信号中断。参与者得出结论，这个边缘讨论与主线程不再相关，因为设计在v5中已更改，消除了原始的ProcSleep()问题。他们建议如果需要进一步讨论，可以开启专门线程。

Participants - 参与者:
* alvherre@kurilemu.de
* andres@anarazel.de
* bertranddrouvot.pg@gmail.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* samimseih@gmail.com
* zsolt.parragi@percona.com

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/vbfdgjxn4rqwbnznks4zstx7t34dcrhubbmse775ou4nmcjqzi@4rugaq7sftac)**
The discussion centers on reducing timing overhead in EXPLAIN ANALYZE using rdtsc (CPU timestamp counter). Jakub Wartak explored alternatives to low-level intrinsics for VM detection, considering systemd-detect-virt via fork+execve or D-Bus API queries. However, Andres Freund dismissed these approaches as overly complex and unsuitable for cross-platform compatibility, noting the existing VM detection code using vm_table[] and memcmp() is more elegant. Regarding naming, Wartak opposed "fast_clock_source" preferring "clock_source" or "explain_clock_source". Freund suggested the timing mechanism could benefit other features like pg_stat_statements beyond just EXPLAIN, but noted it's unsuitable for wall clock times, proposing "clock_source_timing" as a more accurate GUC name. The focus remains on efficient timing mechanisms while maintaining portability across operating systems.

讨论围绕使用rdtsc（CPU时间戳计数器）减少EXPLAIN ANALYZE的计时开销。Jakub Wartak探索了VM检测的底层内在函数替代方案，考虑通过fork+execve使用systemd-detect-virt或D-Bus API查询。然而，Andres Freund否定了这些方法，认为过于复杂且不适合跨平台兼容性，指出现有使用vm_table[]和memcmp()的VM检测代码更加优雅。在命名方面，Wartak反对"fast_clock_source"，倾向于"clock_source"或"explain_clock_source"。Freund建议该计时机制除了EXPLAIN之外还能让pg_stat_statements等其他功能受益，但注意到它不适用于挂钟时间，提议"clock_source_timing"作为更准确的GUC名称。讨论重点仍是在保持操作系统可移植性的同时实现高效的计时机制。

Participants - 参与者:
* andres@anarazel.de
* geidav.pg@gmail.com
* hannuk@google.com
* ibrar.ahmad@gmail.com
* jakub.wartak@enterprisedb.com
* lukas@fittl.com
* m.sakrejda@gmail.com
* michael@paquier.xyz
* pavel.stehule@gmail.com
* robertmhaas@gmail.com
* vignesh21@gmail.com

### **[Change default of jit to off](https://www.postgresql.org/message-id/56a7e683-434f-4d2d-a7ed-9ddefcf426f4@app.fastmail.com)**
A discussion is underway about changing the default setting for JIT compilation in PostgreSQL from enabled to disabled. Jelte Fennema-Nio proposed a patch after FOSDEM developer meeting consensus favored this change. Euler Taveira opposes the change, arguing that despite JIT's poor performance on short queries, disabling it would surprise OLAP users who benefit from it and reduce incentives to fix underlying issues. He suggests improving documentation and raising JIT cost thresholds instead. Pierre Ducroquet proposes a middle ground: keeping JIT enabled but disabling jit_tuple_deforming by default, as it generates large code causing long compilation times. Christoph Berg supports disabling JIT, noting it surprises OLTP users while OLAP users would knowingly enable it. Adrien Nayrat points out major cloud providers already disable JIT by default. Greg Sabino Mullane and Andres Freund both support disabling it, with Freund citing partitioning complexities and LLVM performance degradation as key issues requiring substantial improvements like caching.

正在讨论将PostgreSQL中JIT编译的默认设置从启用改为禁用。Jelte Fennema-Nio在FOSDEM开发者会议达成共识后提出了这一补丁。Euler Taveira反对此更改，认为尽管JIT在短查询上性能较差，但禁用它会让受益于JIT的OLAP用户感到意外，并降低修复底层问题的动力。他建议改进文档并提高JIT成本阈值。Pierre Ducroquet提出折中方案：保持JIT启用但默认禁用jit_tuple_deforming，因为它生成大量代码导致编译时间过长。Christoph Berg支持禁用JIT，指出它会让OLTP用户意外，而OLAP用户会有意启用它。Adrien Nayrat指出主要云服务提供商已经默认禁用JIT。Greg Sabino Mullane和Andres Freund都支持禁用，Freund citing分区复杂性和LLVM性能退化是需要大幅改进（如缓存）的关键问题。

Participants - 参与者:
* adrien.nayrat@anayrat.info
* alvherre@kurilemu.de
* andreas@proxel.se
* andres@anarazel.de
* anthonin.bonnefoy@datadoghq.com
* euler@eulerto.com
* htamfids@gmail.com
* mbanck@gmx.net
* myon@debian.org
* p.psql@pinaraf.info
* postgres@jeltef.nl

### **[Pasword expiration warning](https://www.postgresql.org/message-id/aYIUMbyDWobSi94m@nathan)**
Nathan Bossart has updated a patch for password expiration warnings in PostgreSQL, setting the time units to seconds. Two main implementation considerations were discussed: the placement of the WARNING message (currently at the end of InitPostgres() to avoid potential information leakage) and whether to emit warnings for special client backends. Nathan initially questioned whether warnings should be sent to logical replication connections but not physical ones. After receiving no feedback on these concerns, he updated the patch to send warnings to all backends that use password authentication, including both logical and physical replication connections. Greg Sabino Mullane responded positively, agreeing that sending warnings to all password-authenticated backends makes sense.

Nathan Bossart已更新了PostgreSQL密码过期警告的补丁，将时间单位设置为秒。讨论了两个主要实现考虑：WARNING消息的放置位置（目前在InitPostgres()末尾以避免潜在信息泄露）以及是否对特殊客户端后端发出警告。Nathan最初质疑是否应该向逻辑复制连接发送警告而不向物理复制连接发送。在这些问题没有收到反馈后，他更新了补丁，向所有使用密码认证的后端发送警告，包括逻辑和物理复制连接。Greg Sabino Mullane积极回应，同意向所有密码认证后端发送警告是合理的。

Participants - 参与者:
* andrew@dunslane.net
* gilles@darold.net
* htamfids@gmail.com
* japinli@hotmail.com
* liuxh.zj.cn@gmail.com
* nathandbossart@gmail.com
* niushiji@gmail.com
* shiyuefei1004@gmail.com
* tgl@sss.pgh.pa.us
* tsinghualucky912@foxmail.com
* zsolt.parragi@percona.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CALDaNm1Y5C_-gOA95a+07P5z4DY=PuXbnvdqMT6g7t7OEKD2YA@mail.gmail.com)**
Vignesh C is addressing feedback on v38 patch for handling EXCEPT TABLE functionality in PostgreSQL publications with partitioned tables. Shlok Kyal raised concerns about whether a new query for partitioned tables should only be invoked for "ALL TABLES" publications rather than "FOR TABLE" publications. Vignesh explained that the system cannot determine publication type at that point and must handle multiple publication scenarios at the publisher level. In v39 patch, the complex SQL query for computing effective tables has been replaced with a C implementation to improve readability and maintainability, better handling scenarios like mixed publication types with and without EXCEPT clauses. Outstanding feedback from Peter and Shveta will be addressed in future versions.

Vignesh C正在处理关于v38补丁的反馈，该补丁用于处理PostgreSQL发布中分区表的EXCEPT TABLE功能。Shlok Kyal对分区表的新查询是否应该只在"ALL TABLES"发布而不是"FOR TABLE"发布中调用表示担忧。Vignesh解释说系统在该点无法确定发布类型，必须在发布者层面处理多个发布场景。在v39补丁中，用于计算有效表的复杂SQL查询已被C实现替换，以提高可读性和可维护性，更好地处理带有和不带有EXCEPT子句的混合发布类型等场景。来自Peter和Shveta的未解决反馈将在未来版本中处理。

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

### **[pg\_resetwal: Fix wrong directory in log output](https://www.postgresql.org/message-id/SE2P216MB2390C84C23F428A7864EE07FA19BA@SE2P216MB2390.KORP216.PROD.OUTLOOK.COM)**
Tianchen Zhang identified a bug in pg_resetwal.c where the wrong directory macro (ARCHSTATDIR instead of WALSUMMARYDIR) was used in an error message within the KillExistingWALSummaries() function. The issue occurs in the closedir() error handling, where it incorrectly references the archive status directory rather than the WAL summary directory. Michael Paquier and Chao Li confirmed this as a legitimate bug, noting that closedir() failures are rare, which explains why it went unnoticed. Kyotaro Horiguchi raised concerns about macro scoping in the file, suggesting that function-scoped macros should be better contained to prevent similar mistakes. Following this feedback, Tianchen updated the patch to v2, adding #undef statements for function-scoped macros at the end of their respective functions. Chao Li tested the updated patch and confirmed it works correctly, with the compiler now catching such mistakes if they occur again. The fix has received positive reviews from all participants.

Tianchen Zhang 发现了 pg_resetwal.c 中的一个 bug，在 KillExistingWALSummaries() 函数的错误消息中使用了错误的目录宏（ARCHSTATDIR 而不是 WALSUMMARYDIR）。问题出现在 closedir() 错误处理中，错误地引用了归档状态目录而不是 WAL 摘要目录。Michael Paquier 和 Chao Li 确认这是一个真正的 bug，指出 closedir() 失败很少见，这解释了为什么它一直未被发现。Kyotaro Horiguchi 对文件中的宏作用域表示担忧，建议应该更好地限制函数作用域的宏以防止类似错误。根据这个反馈，Tianchen 将补丁更新为 v2 版本，在相应函数末尾添加了函数作用域宏的 #undef 语句。Chao Li 测试了更新的补丁并确认其工作正常，编译器现在可以捕获此类错误。该修复得到了所有参与者的积极评价。

Participants - 参与者:
* horikyota.ntt@gmail.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* zhang_tian_chen@163.com