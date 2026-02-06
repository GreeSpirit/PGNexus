---
layout: post
title: PostgreSQL Daily News 2026-02-06
---

# PostgreSQL Daily News#44 2026-02-06



## **PostgreSQL Articles - PostgreSQL 技术博客**

### **[Continuity and stability in PostgreSQL: Why your support model matters more than ever](https://www.postgresql.fastware.com/blog/continuity-and-stability-in-postgresql-why-your-support-model-matters-more-than-ever)**
PostgreSQL's reputation for stability relies not just on the database engine but on the support model surrounding it. As vendor strategies evolve and operating conditions become unpredictable, enterprises need to understand how their PostgreSQL support will perform under pressure. The article emphasizes that maintaining continuity, predictable escalation paths, and long-term operational clarity requires careful consideration of support arrangements. Enterprise confidence stems from having reliable support structures that can handle critical situations effectively, making the choice of support model increasingly important for PostgreSQL deployments in production environments.

PostgreSQL的稳定性声誉不仅依赖于数据库引擎本身，还依赖于围绕它的支持模式。随着供应商策略的发展和运营条件变得不可预测，企业需要了解他们的PostgreSQL支持在压力下的表现如何。文章强调，维持连续性、可预测的升级路径和长期运营清晰度需要仔细考虑支持安排。企业信心来源于拥有能够有效处理关键情况的可靠支持结构，这使得支持模式的选择对生产环境中的PostgreSQL部署变得越来越重要。

`Timothy Steward`

### **[Federal PostgreSQL continuity: Why cloud-only can become a mission risk](https://www.postgresql.fastware.com/blog/federal-postgresql-continuity-why-cloud-only-can-become-a-mission-risk)**
Federal agencies face mission-critical risks when relying exclusively on cloud-based PostgreSQL deployments. The article argues that cloud-only approaches introduce hidden vulnerabilities that can jeopardize data continuity during critical operations. While cloud services offer scalability and convenience, they create dependencies on external providers that may conflict with federal continuity requirements. The piece emphasizes the importance of maintaining hybrid or on-premises PostgreSQL capabilities to ensure uninterrupted access to essential data during emergencies or when cloud services become unavailable. This approach helps federal organizations maintain operational resilience and meet their mission-critical data access requirements.

联邦机构在完全依赖基于云的PostgreSQL部署时面临关键任务风险。文章论述了仅使用云的方法会引入隐藏的漏洞，可能在关键操作期间危及数据连续性。虽然云服务提供可扩展性和便利性，但它们对外部提供商产生依赖，可能与联邦连续性要求产生冲突。文章强调了维护混合或本地PostgreSQL能力的重要性，以确保在紧急情况下或云服务不可用时能够不间断地访问基本数据。这种方法帮助联邦组织保持运营韧性并满足其关键任务数据访问要求。

`Adrian Pettijohn`

### **[Hybrid Search with TimescaleDB: Vector, Keyword, and Temporal Filtering](https://www.tigerdata.com/blog/hybrid-search-timescaledb-vector-keyword-temporal-filtering)**
This tutorial demonstrates how TimescaleDB enables hybrid search combining vector embeddings, keyword matching, and temporal filtering to solve retrieval problems in RAG applications. The author shows that pure vector search misses exact technical terms, text search ignores synonyms, and standard hybrid search can amplify errors when both methods agree on wrong answers. The solution uses PostgreSQL full-text search with BM25 ranking, pgvectorscale's DiskANN indexes, and TimescaleDB's temporal partitioning to restrict searches to recent documents. A demo application with 150 fictional CLI documentation samples illustrates failure modes and shows how temporal filtering prevents consensus failures by excluding outdated content before ranking occurs.

本教程演示了TimescaleDB如何实现混合搜索，结合向量嵌入、关键词匹配和时间过滤来解决RAG应用中的检索问题。作者展示了纯向量搜索会遗漏精确技术术语，文本搜索忽略同义词，而标准混合搜索在两种方法都同意错误答案时会放大错误。解决方案使用PostgreSQL全文搜索配合BM25排名、pgvectorscale的DiskANN索引，以及TimescaleDB的时间分区来限制搜索范围至最新文档。一个包含150个虚构CLI文档样本的演示应用说明了失效模式，并展示了时间过滤如何通过在排名前排除过时内容来防止共识失效。

`Damaso Sanoja`

### **[When cloud-only becomes a business risk: A customer's continuity checklist](https://www.postgresql.fastware.com/blog/when-cloud-only-becomes-a-business-risk-a-customers-continuity-checklist)**
This post examines the business risks of relying solely on cloud infrastructure for PostgreSQL databases. While cloud-first strategies offer speed and flexibility benefits, a cloud-only approach can create vulnerabilities in system resilience, regulatory compliance, and long-term operational continuity. The article identifies scenarios where exclusive cloud dependence becomes a liability for organizations and provides a practical checklist to help customers evaluate and mitigate these risks when deploying PostgreSQL environments.

这篇文章探讨了完全依赖云基础设施运行PostgreSQL数据库的业务风险。虽然云优先策略提供了速度和灵活性优势，但纯云方法可能在系统弹性、监管合规性和长期运营连续性方面产生漏洞。文章识别了排他性云依赖对组织构成负担的场景，并提供了实用检查清单，帮助客户在部署PostgreSQL环境时评估和缓解这些风险。

`Adrian Pettijohn`



## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[client\_connection\_check\_interval default value](https://www.postgresql.org/message-id/20260204213032.15bab46b@ardentperf.com)**
Jeremy Schneider proposes changing the default value of client_connection_check_interval from disabled to 2000ms. He experienced an outage where blocking locks combined with pgx client bugs and pgbouncer configuration issues caused connection exhaustion when PostgreSQL failed to detect dead connections waiting on locks. The proposed setting would prevent such escalation by periodically checking client connections.

Greg Sabino Mullane opposes the change, citing performance concerns about context switching on busy systems and referencing past discussions. Jacob Champion suggests a protocol-level heartbeat would be more comprehensive but acknowledges the implementation complexity. Jeremy responds that his scenario differs from previous discussions focused on CPU resources - his case involved idle systems with connections stuck in CLOSE-WAIT state.

Fujii Masao raises concerns about excessive logging noise when combined with log_lock_waits, as backends would emit "still waiting" messages every 2 seconds. He suggests adding a flag to suppress duplicate messages if the change proceeds.

Jeremy Schneider提议将client_connection_check_interval的默认值从禁用改为2000毫秒。他遇到了一次故障，阻塞锁结合pgx客户端bug和pgbouncer配置问题导致连接耗尽，因为PostgreSQL无法检测到等待锁的死连接。建议的设置可以通过定期检查客户端连接来防止此类升级。

Greg Sabino Mullane反对此更改，担心繁忙系统的上下文切换性能问题，并引用了过去的讨论。Jacob Champion建议协议级心跳会更全面，但承认实现复杂性。Jeremy回应说他的场景与之前专注于CPU资源的讨论不同——他的情况涉及连接卡在CLOSE-WAIT状态的空闲系统。

Fujii Masao担心与log_lock_waits结合使用时会产生过多的日志噪音，因为后端会每2秒发出"still waiting"消息。他建议如果进行更改，应添加标志来抑制重复消息。

Participants - 参与者:
* htamfids@gmail.com
* jacob.champion@enterprisedb.com
* marat.buharov@gmail.com
* masao.fujii@gmail.com
* schneider@ardentperf.com
* thomas.munro@gmail.com

### **[Changing the state of data checksums in a running cluster](https://www.postgresql.org/message-id/DEE0237A-D38C-477F-997C-3B0EB2D4FC57@yesql.se)**
Daniel Gustafsson submitted an updated patch for enabling/disabling data checksums in running PostgreSQL clusters, fixing test failures and making various improvements. However, the patch still experiences occasional failures in test suite 006, particularly with visibility map (VM) pages showing checksum validation errors during WAL recovery after immediate restarts. Tomas Vondra investigated the failures and found that VM pages are failing checksum validation even when their LSNs suggest they were modified after checksums were enabled. The failures occur during redo operations, with VM blocks showing incorrect checksums despite being written during periods when checksums should be active. Both developers are uncertain about the root cause, with Daniel specifically requesting review of the CHECKPOINT logic and Tomas questioning whether the issue relates to how visibility maps interact with the checksum state transitions. The investigation suggests missing details about VM behavior during checksum state changes.

Daniel Gustafsson提交了一个更新的补丁，用于在运行中的PostgreSQL集群中启用/禁用数据校验和，修复了测试失败并进行了各种改进。然而，该补丁在测试套件006中仍然偶尔出现故障，特别是在立即重启后WAL恢复期间，可见性映射(VM)页面显示校验和验证错误。Tomas Vondra调查了这些故障，发现VM页面在校验和验证时失败，即使它们的LSN表明是在启用校验和之后修改的。故障发生在重做操作期间，VM块显示不正确的校验和，尽管它们是在校验和应该处于活动状态的期间写入的。两位开发者都不确定根本原因，Daniel特别请求审查CHECKPOINT逻辑，而Tomas质疑问题是否与可见性映射在校验和状态转换期间的交互方式有关。调查表明在校验和状态变化期间关于VM行为的细节缺失。

Participants - 参与者:
* andres@anarazel.de
* daniel@yesql.se
* mailings@oopsware.de
* mbanck@gmx.net
* michael@paquier.xyz
* tomas@vondra.me

### **[pg\_upgrade: transfer pg\_largeobject\_metadata's files when possible](https://www.postgresql.org/message-id/qfp7z4c3m6bw53oky33halcdhomiijod6segzrhf757ijjvapr@e5rf4u5wnfmu)**
The discussion centers on optimizing pg_upgrade's handling of large object metadata files. Nathan Bossart initially proposed moving TRUNCATE commands to the end of dump files to avoid overwriting behavior issues, but Andres Freund criticized this as "grotty" since it fills catalog tables only to discard contents immediately.

Nathan then suggested a cleaner approach: bypassing the LargeObjectExists() check in binary-upgrade mode, eliminating the need to dump pg_largeobject_metadata entirely. This would allow skipping the problematic catalog population step while still handling COMMENT ON and SECURITY LABEL ON commands properly.

Andres raised performance concerns about getLOs(), noting it's memory-intensive and slow for systems with many large objects. For 5 million LOs, pg_dump consumes ~1GB peak memory and requires expensive sorting operations. He suggested optimizing the pg_largeobject_metadata query to only retrieve objects with comments or security labels, which are typically rare.

Nathan agreed and indicated he's working on a comprehensive patch incorporating these optimizations. The discussion highlights significant performance bottlenecks in current pg_upgrade behavior and proposes multiple complementary solutions to improve efficiency.

讨论围绕优化pg_upgrade处理大对象元数据文件展开。Nathan Bossart最初提议将TRUNCATE命令移到转储文件末尾以避免覆盖行为问题，但Andres Freund批评这种方法"粗糙"，因为它填充目录表后立即丢弃内容。

Nathan随后提出更清洁的方法：在binary-upgrade模式下绕过LargeObjectExists()检查，完全消除转储pg_largeobject_metadata的需要。这将允许跳过有问题的目录填充步骤，同时仍能正确处理COMMENT ON和SECURITY LABEL ON命令。

Andres提出getLOs()的性能担忧，指出对于拥有许多大对象的系统，它消耗大量内存且运行缓慢。对于500万个大对象，pg_dump消耗约1GB峰值内存并需要昂贵的排序操作。他建议优化pg_largeobject_metadata查询，仅检索具有注释或安全标签的对象，这些通常很少见。

Nathan表示同意，并表明他正在开发包含这些优化的综合补丁。讨论突出了当前pg_upgrade行为中的重大性能瓶颈，并提出多个互补解决方案来提高效率。

Participants - 参与者:
* andres@anarazel.de
* hannuk@google.com
* michael@paquier.xyz
* nathandbossart@gmail.com
* nitinmotiani@google.com
* tgl@sss.pgh.pa.us

### **[Pasword expiration warning](https://www.postgresql.org/message-id/3cc53f9a-e56d-4950-8dd8-db1eaa9ef986@app.fastmail.com)**
Nathan Bossart's password expiration warning patch is being refined based on community feedback. Euler Taveira confirmed the updated patch works correctly with ngettext() for proper translation support, demonstrating successful Portuguese translations. Chao Li provided detailed review comments suggesting: defining a shared constant for the default 604800-second value, capping the maximum threshold at reasonable days rather than INT_MAX, clarifying documentation about zero disabling warnings, improving memory management in StoreConnectionWarning(), and adjusting the expiration condition logic. Nathan responded by defending current design choices, noting that duplicate values and INT_MAX limits are common patterns in PostgreSQL, and that the existing expiration logic matches documented behavior. Greg Sabino Mullane disagreed with capping the maximum value, arguing that large GUC ranges are acceptable. Peter Eisentraut weighed in on timestamp formatting preferences, favoring absolute over relative time displays.

Nathan Bossart的密码过期警告补丁正在根据社区反馈进行完善。Euler Taveira确认更新后的补丁能够正确使用ngettext()进行适当的翻译支持，并展示了成功的葡萄牙语翻译。Chao Li提供了详细的审查意见，建议：为默认的604800秒值定义共享常量，将最大阈值限制在合理的天数而不是INT_MAX，澄清关于零值禁用警告的文档，改进StoreConnectionWarning()中的内存管理，以及调整过期条件逻辑。Nathan回应说为当前设计选择进行辩护，指出重复值和INT_MAX限制是PostgreSQL中的常见模式，现有的过期逻辑符合文档化的行为。Greg Sabino Mullane不同意限制最大值，认为大的GUC范围是可以接受的。Peter Eisentraut就时间戳格式偏好发表了看法，倾向于绝对时间而不是相对时间显示。

Participants - 参与者:
* andrew@dunslane.net
* euler@eulerto.com
* gilles@darold.net
* htamfids@gmail.com
* japinli@hotmail.com
* li.evan.chao@gmail.com
* liuxh.zj.cn@gmail.com
* nathandbossart@gmail.com
* niushiji@gmail.com
* peter@eisentraut.org
* shiyuefei1004@gmail.com
* tgl@sss.pgh.pa.us
* tsinghualucky912@foxmail.com
* zsolt.parragi@percona.com

### **[FileFallocate misbehaving on XFS](https://www.postgresql.org/message-id/CAKZiRmzTPNWSwzsnf9VSXzC5HaH5shpxsk6axQD=KDZMoAc3Fg@mail.gmail.com)**
A PostgreSQL bug report regarding FileFallocate misbehaving on XFS filesystems has been resolved. Jakub Wartak reported that RedHat published a solution identifying the root cause as a Linux kernel bug affecting XFS fallocate(2) returning ENOSPC prematurely. The fix was implemented in kernel commit 6773da870ab89123d1b513da63ed59e32a29cb77 titled "xfs: fix error returns from xfs_bmapi_write". The bug affected kernels before version 6.1.138 (released around May 2025), particularly impacting users who upgraded PostgreSQL databases without updating their operating systems. Thomas Munro confirmed this explains why they couldn't reproduce the issue, as their test kernels were already fixed. The team also has a workaround patch with GUC configuration pending for inclusion, which remains useful for BTRFS users. Andrew Dunstan expressed support for including the patch in maintenance releases before the freeze.

PostgreSQL关于FileFallocate在XFS文件系统上行为异常的错误报告已得到解决。Jakub Wartak报告RedHat发布了解决方案，确认根本原因是Linux内核错误，影响XFS fallocate(2)过早返回ENOSPC。修复在内核提交6773da870ab89123d1b513da63ed59e32a29cb77中实现，标题为"xfs: fix error returns from xfs_bmapi_write"。该错误影响版本6.1.138之前的内核（2025年5月左右发布），特别影响在不更新操作系统情况下升级PostgreSQL数据库的用户。Thomas Munro确认这解释了为什么他们无法重现问题，因为测试内核已经修复。团队还有带GUC配置的解决方案补丁待包含，对BTRFS用户仍有用。Andrew Dunstan支持在冻结前将补丁包含在维护版本中。

Participants - 参与者:
* alvherre@alvh.no-ip.org
* andres@anarazel.de
* andrew@dunslane.net
* harmic@gmail.com
* jakub.wartak@enterprisedb.com
* robertmhaas@gmail.com
* thomas.munro@gmail.com
* tomas@vondra.me

### **[Truncate logs by max\_log\_size](https://www.postgresql.org/message-id/CAHGQGwGa88X89qB58ZyA8NOJ08Wc7V9d2kw5YA3vdttXDhoT5Q@mail.gmail.com)**
The discussion centers on a PostgreSQL patch for truncating long SQL statements in log files. Fujii Masao confirms he's no longer actively working on the patch, which was previously marked as ready-for-committer. Jim Jones volunteers to review and work on it next week. Álvaro Herrera provides constructive feedback, suggesting the proposed GUC name "max_log_size" is misleading since it sounds like it controls log file size rather than statement length. He recommends renaming it to "log_statement_max_length" for clarity. Herrera also identifies a performance issue where the current patch calls strlen() twice on each query and suggests combining the truncation check and truncation logic into a single routine. Jim Jones agrees with the naming suggestion and plans to address the performance optimization. Additionally, Jones proposes changing the default disable value from 0 to -1 to avoid confusion, as 0 might be misinterpreted as logging zero bytes rather than disabling the feature entirely.

讨论围绕一个用于截断日志文件中长SQL语句的PostgreSQL补丁展开。Fujii Masao确认他不再积极开发这个补丁，该补丁此前已被标记为ready-for-committer。Jim Jones自愿下周审查并开发该补丁。Álvaro Herrera提供了建设性反馈，建议所提议的GUC名称"max_log_size"具有误导性，因为它听起来像是控制日志文件大小而非语句长度。他建议重命名为"log_statement_max_length"以提高清晰度。Herrera还发现了一个性能问题，当前补丁对每个查询调用两次strlen()，并建议将截断检查和截断逻辑合并为单个例程。Jim Jones同意命名建议并计划解决性能优化问题。此外，Jones提议将默认禁用值从0改为-1以避免混淆，因为0可能被误解为记录零字节而非禁用该功能。

Participants - 参与者:
* alvherre@kurilemu.de
* diphantxm@gmail.com
* euler@eulerto.com
* jim.jones@uni-muenster.de
* masao.fujii@gmail.com
* masao.fujii@oss.nttdata.com
* reshkekirill@gmail.com
* x4mmm@yandex-team.ru

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/CANwKhkPcQ9fNNJff24kqpMDoD4GuHfdmP9yzkOO=LUOHqZsO+Q@mail.gmail.com)**
The discussion focuses on using rdtsc (Read Time-Stamp Counter) to reduce timing overhead in PostgreSQL's EXPLAIN ANALYZE and IO timing features. Andres Freund suggests that track_io_timing and track_wal_io_timing should use fast timing mechanisms, as the overhead of IO timing can be noticeable on busy systems, particularly for IO-intensive workloads where data resides in kernel page cache but doesn't fit in shared_buffers. The inaccuracy from faster timing is considered acceptable for these use cases. Ants Aasma responds positively, indicating he has wanted these timing features enabled by default when a "fast enough" clock source is available. He suggests that if rdtsc is used as the clock source, it would be definitively fast enough to enable these timing features by default, addressing the complexity of determining suitable clock sources.

讨论聚焦于使用rdtsc（读取时间戳计数器）来减少PostgreSQL的EXPLAIN ANALYZE和IO计时功能的时间开销。Andres Freund建议track_io_timing和track_wal_io_timing应该使用快速计时机制，因为IO计时的开销在繁忙系统上可能很明显，特别是对于数据驻留在内核页缓存中但不适合shared_buffers的IO密集型工作负载。对于这些用例，更快计时带来的不准确性被认为是可接受的。Ants Aasma积极回应，表示他一直希望在有"足够快"的时钟源可用时默认启用这些计时功能。他建议如果使用rdtsc作为时钟源，它肯定足够快，可以默认启用这些计时功能，从而解决确定合适时钟源的复杂性问题。

Participants - 参与者:
* andres@anarazel.de
* ants.aasma@cybertec.at
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

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CANhcyEWda-0kWVCn8zQ4z9snFK4sCo1-JEewFGWs-9PMrJAmrg@mail.gmail.com)**
Shlok Kyal has discovered a bug in Vignesh C's v39 patch for handling EXCEPT TABLE functionality in PostgreSQL publications. The issue occurs when all partitions of a partitioned table are specified in the EXCEPT list with publish_via_partition_root = true. In this scenario, tablesync incorrectly publishes all changes while incremental sync correctly excludes them. The problem stems from pg_get_publication_effective_tables returning no rows, causing fetch_remote_table_info to have an empty effective_relations list, which leads to incorrect COPY command formation. Shlok proposes a solution to avoid having the partitioned table in pg_publication_tables when all partitions are excluded, preventing the corresponding pg_subscription_rel entry. He has implemented this fix in v41 patch, merging previous patches and adding extended tests. The patch also replaced complex SQL logic with a C implementation for better maintainability and handling of multiple publication scenarios.

Shlok Kyal在Vignesh C的v39补丁中发现了一个处理PostgreSQL发布中EXCEPT TABLE功能的bug。当分区表的所有分区都在EXCEPT列表中指定且publish_via_partition_root = true时会出现问题。在这种情况下，tablesync错误地发布所有更改，而增量同步正确地排除了它们。问题源于pg_get_publication_effective_tables返回无行，导致fetch_remote_table_info的effective_relations列表为空，从而导致错误的COPY命令形成。Shlok提出了一个解决方案，当所有分区都被排除时，避免在pg_publication_tables中包含分区表，从而防止相应的pg_subscription_rel条目。他在v41补丁中实现了这个修复，合并了之前的补丁并添加了扩展测试。该补丁还用C实现替换了复杂的SQL逻辑，以获得更好的可维护性和处理多个发布场景的能力。

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



## **Industry News - 行业新闻**

### **[OpenAI launches Frontier platform for enterprise AI agents](https://techcrunch.com/2026/02/05/openai-launches-a-way-for-enterprises-to-build-and-manage-ai-agents)**
OpenAI launched Frontier, a new platform designed for enterprises to build and deploy AI agents while treating them like human employees. The platform represents a significant step in OpenAI's enterprise strategy, allowing companies to create and manage AI agents that can perform complex tasks within their organizations. This launch positions OpenAI to compete more directly with other AI platforms targeting business users, offering tools that integrate AI agents into existing enterprise workflows and management systems.

OpenAI推出了Frontier平台，这是一个专为企业设计的新平台，用于构建和部署AI代理，同时将其作为人类员工对待。该平台代表了OpenAI企业战略的重要一步，允许公司创建和管理能够在其组织内执行复杂任务的AI代理。此次发布使OpenAI能够与其他针对商业用户的AI平台更直接地竞争，提供将AI代理集成到现有企业工作流程和管理系统中的工具。

### **[Anthropic releases Opus 4.6 with new 'agent teams'](https://techcrunch.com/2026/02/05/anthropic-releases-opus-4-6-with-new-agent-teams)**
Anthropic released Opus 4.6, the newest version of its AI model featuring new "agent teams" capabilities. The update is designed to broaden the model's capabilities and appeal, allowing for a greater variety of uses and customers. The agent teams feature represents a significant enhancement to Anthropic's Claude platform, enabling multiple AI agents to work together collaboratively on complex tasks. This release comes as part of the ongoing competition between major AI companies to develop more sophisticated and capable AI systems for enterprise and consumer applications.

Anthropic发布了Opus 4.6，这是其AI模型的最新版本，具有新的"代理团队"功能。此次更新旨在扩大模型的功能和吸引力，允许更多样化的用途和客户。代理团队功能代表了Anthropic的Claude平台的重大增强，使多个AI代理能够在复杂任务上协作工作。此次发布是主要AI公司之间持续竞争的一部分，旨在为企业和消费者应用开发更复杂、更强大的AI系统。

### **[OpenAI launches new agentic coding model after Anthropic announcement](https://techcrunch.com/2026/02/05/openai-launches-new-agentic-coding-model-only-minutes-after-anthropic-drops-its-own)**
OpenAI launched a new agentic coding model just minutes after Anthropic released its own AI update. The new model is built to accelerate the capabilities of Codex, the agentic coding tool OpenAI launched earlier this week. This rapid-fire release pattern demonstrates the intense competition between OpenAI and Anthropic in the AI development space, with both companies racing to deliver advanced AI coding capabilities. The timing suggests a strategic response to maintain competitive positioning in the rapidly evolving AI market, particularly in the coding and development tools segment.

OpenAI在Anthropic发布自己的AI更新仅几分钟后就推出了一个新的代理编程模型。这个新模型旨在加速Codex的功能，Codex是OpenAI本周早些时候推出的代理编程工具。这种快速发布模式展示了OpenAI和Anthropic在AI开发领域的激烈竞争，两家公司都在竞相提供先进的AI编程能力。发布时机表明这是一个战略性回应，旨在在快速发展的AI市场中保持竞争地位，特别是在编程和开发工具领域。