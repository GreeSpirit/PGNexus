# PostgreSQL 每日更新#58 2026-02-19



## **技术博客**

### **[EDB 产品运营总监的一天：深入了解这个角色](https://enterprisedb.com/blog/day-life-inside-director-product-operations-role-edb)**
EDB产品运营总监Rishi Patel讨论了他在管理EDB产品开发流程和节奏方面的作用。他强调了建设性对话在产品运营中的重要性，并重点介绍了EDB的远程优先文化如何使他能够在家办公的同时推动全球创新。这次访谈深入了解了EDB这家主要PostgreSQL公司产品管理的运营方面，展示了产品运营角色如何为扩展企业数据库解决方案做出贡献。

`enterprisedb.com`

### **[如何破坏您的 PostgreSQL IIoT 数据库并在过程中学到东西](https://www.tigerdata.com/blog/how-to-break-postgresql-iiot-database-learn-something-in-process)**
本文主张将PostgreSQL工业物联网数据库视为工程原型，通过进行破坏性压力测试来识别生产部署前的故障点。作者建议在系统性增长数据库规模直至达到故障条件的过程中，测量表大小、性能指标和服务器资源。关键技术包括使用PostgreSQL内置函数监控堆、索引和TOAST大小，通过EXPLAIN ANALYZE计时实际生产查询，以及使用generate_series函数生成大型数据集。测试方法涉及为存储容量、查询响应时间和数据摄取速率设置明确限制，然后在监控性能的同时迭代增长数据库。测试结果有助于识别瓶颈、优化索引策略、规划未来硬件需求，并建立低于最大测试容量的操作安全边际。

`Douglas Pagnutti`

### **[PostgreSQL 19: 第2部分或 CommitFest 2025-09](https://postgrespro.com/blog/pgsql/5972743)**
PostgreSQL 19 继续开发，包含来自 2025 年 9 月 CommitFest 的变更。主要新增功能包括 GROUP BY ALL 语法、增强的窗口函数 NULL 值处理，以及 PL/Python 中的事件触发器。新功能涵盖指定范围内的随机日期/时间生成、base64url 编码/解码函数，以及 debug_print_raw_parse 参数。log_lock_waits 参数现在默认启用。改进包括 pg_stat_progress_basebackup 备份类型跟踪、vacuumdb 对分区表的统计信息收集，以及使用 clock-sweep 算法优化缓冲区缓存以查找空闲缓冲区。

`Pavel Luzanov`



## **热门 Hacker 邮件讨论精选**

### **[libpq: 将协议版本提升至 3\.2 至少到第一个/第二个 beta 版本](https://www.postgresql.org/message-id/CAOYmi+=Hi_on8cGe2TV7DRLbcvVQmrhdkyzOXbhT_6xqf02+4A@mail.gmail.com)**
Jacob Champion和Jelte Fennema-Nio正在完善一个将libpq协议版本升级到3.2的补丁。讨论重点是当服务器不支持新协议版本时的错误处理。Jacob实现了通过在错误消息中查找协议违规代码或字面grease版本号来检测服务器bug的逻辑，为用户提供有用的诊断信息和文档URL。Jelte针对旧版PgBouncer部署测试了该补丁并确认工作正常，显示适当的错误消息指导用户查看解决方案文档。两人都同意在错误检测启发式方面保持保守以避免误报。Jacob计划提交合并后的v8版本，而Jelte希望他单独的GoAway补丁仍可能被考虑用于PostgreSQL 19，尽管Jacob表示在当前周期内时间有限。

参与者:
andres@anarazel.de, david.g.johnston@gmail.com, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, postgres@jeltef.nl, robertmhaas@gmail.com

### **[在信号处理程序中为 palloc 添加断言](https://www.postgresql.org/message-id/2f25aa74-990d-4412-a032-c876dbcff667@iki.fi)**
Nathan Bossart提议添加断言来检测信号处理程序中的内存分配，得到了Andres Freund和Heikki Linnakangas的支持。该补丁使用现有的wrapper_handler基础设施，通过了check-world测试。然而，Kirill Reshke发现断言在单用户模式下失败，其中ProcessInterrupts()调用ereport()，从而触发palloc。Nathan确认在客户端后端的SIGQUIT处理中也存在类似问题，因为die()和quickdie()都从信号处理程序调用ereport()。Andres指出die()不应在单用户模式之外调用ereport()，并批评quickdie()的ereport()使用不安全，认为从信号处理程序尝试客户端通信会带来数据结构损坏的风险。Nathan担心断言噪音问题，建议在部署前制定计划来解决这些违规行为。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, nathandbossart@gmail.com, reshkekirill@gmail.com

### **[将 SpinLock\* 宏转换为静态内联函数](https://www.postgresql.org/message-id/aZX2oUcKf7IzHnnK@nathan)**
Nathan Bossart提议将PostgreSQL的spin.h宏转换为静态内联函数，作为添加信号处理程序断言的前提工作。该更改之前已讨论过，普遍获得同意。然而，转换导致构建失败，因为自旋锁相关代码中广泛使用volatile限定符，Nathan建议移除这些限定符，因为它们早于commit 0709b7ee72（该提交使自旋锁成为编译器屏障）。Fabrízio de Royes Mello在确认不存在PG_TRY..PG_CATCH问题后支持该提议。Andres Freund同意从大部分代码中移除volatile，但对从SpinLockAcquire()中移除它表示担忧，警告在没有volatile或编译器屏障的情况下，编译器优化可能阻止正确的锁获取。他建议保持当前SpinLockAcquire()签名中的volatile用于文档目的。所有参与者都同意移除未使用的SpinLockFree()函数，该函数在2020年已达成一致但从未实现。

参与者:
andres@anarazel.de, fabriziomello@gmail.com, hlinnaka@iki.fi, nathandbossart@gmail.com

### **[pg\_plan\_advice 计划建议](https://www.postgresql.org/message-id/CA+TgmoYg8uUWyco7Pb3HYLMBRQoO6Zh9hwgm27V39Pb6Pdf=ug@mail.gmail.com)**
Robert Haas发布了pg_plan_advice补丁的第16版，寻求代码审查和测试帮助。一个关键变更是将get_relation_info_hook替换为build_simple_rel_hook，以正确处理非关系RTE，从而能够控制涉及子查询的连接问题中的Gather和Gather Merge节点。该补丁包含通过启用feedback_warnings测试发现的多个错误修复：纠正了pgpa_walk_recursively()中的操作顺序问题，修复了GATHER/GATHER_MERGE与PARTITIONWISE建议之间的冲突，以及解决了分区聚合的问题。文档得到扩展，增加了已知限制说明和对"matched"与"partially matched"结果的更清晰解释。由于自连接消除行为需要进一步分析，仍有一个测试失败。

参与者:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[在ANALYZE期间可选跳过不变关系？](https://www.postgresql.org/message-id/CAJSLCQ3CoEjd=DiANwyBybFaOu24PZFXo5f8EQUbsZ+UL0wL0A@mail.gmail.com)**
讨论集中在PostgreSQL的一个提议功能上，允许选择性执行ANALYZE操作。VASUKI M开发了两个不同的选项：MISSING_STATS_ONLY用于分析缺少统计信息的关系，MODIFIED_STATS用于分析由于修改可能导致统计信息过时的关系。Andreas建议使用SKIP_UNMODIFIED等替代命名。Robert Treat支持保持两个功能分离，指出它们服务于不同的用例——一个用于确保新列/统计信息被覆盖，另一个用于更新活跃表，类似于autoanalyze但按需执行。他强调MISSING_STATS需要独立工作以便与vacuumdb集成。Robert还提醒VASUKI为每个补丁创建单独的commitfest条目。共识似乎倾向于通过不同选项维持语义清晰性，而不是将它们合并。

参与者:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com

### **[更好的共享数据结构管理和可调整大小的共享数据结构](https://www.postgresql.org/message-id/CAExHW5vz+PUHHUuzGRwtyx-mPLQk3nCZXxrFqnruRadEFrO5Xg@mail.gmail.com)**
Ashutosh Bapat正在为PostgreSQL开发更好的共享数据结构管理和可调整大小共享数据结构的补丁。讨论重点是使用MADV_POPULATE_WRITE和madvise/fallocate进行内存管理，而不是多重映射。关键要点包括：在运行时调整大小期间使用MADV_POPULATE_WRITE以避免启动速度变慢，将max_size小于页面大小的结构视为固定结构，确保可调整大小的结构从页面边界开始。该方法避免了多个段的复杂性，但失去了对越界访问的保护，这种访问原本会导致段错误。Bapat已将测试重构为稳定的TAP测试格式。该实现目前仅在支持匿名共享内存MADV_POPULATE_WRITE和MADV_REMOVE的Linux系统上工作，需要为其他系统进行平台特定处理。

参与者:
andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi

### **[索引预取](https://www.postgresql.org/message-id/ttuirsz636fr227k7bfbsuqnmpxknvq2hw6yeg56xb45txjxkd@kvubmvhrd32a)**
讨论重点是优化索引预取启发式算法，以防止性能回归的同时保持收益。Peter Geoghegan承认当前的启发式算法过于保守，作为权宜之计被过度拟合到对抗性查询上。Andres Freund进行了详细测试，比较不同的预取配置，发现当仅驱逐数据时，不让步的激进预取通常表现最佳，但当数据和索引页面都被驱逐时结果好坏参半。他在mark-restore功能中发现了一个关键错误，由于markBatchFreed的错误跟踪导致批次可能被释放两次。团队讨论测试方法，Andres建议使用dm_delay模拟更高延迟的存储（云环境中典型的0.5-4ms范围），以更好地识别在低延迟NVMe上不明显的预取问题。Tomas Vondra建议在EXPLAIN ANALYZE输出中添加"未消耗IO"指标，以帮助自动化性能回归检测。Peter提供了包含VM缓存和重扫描优化的更新分支。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAA4eK1KWqttt3UMdR8P0wYyqDO6cuLhuvGb5cDpuctG8F10EFA@mail.gmail.com)**
讨论集中在为PostgreSQL发布实现EXCEPT TABLE子句，允许用户从ALL TABLES发布中排除特定表。Amit Kapila和shveta malik正在审查vignesh C的补丁v45版本，对代码结构和错误处理提供详细反馈。

识别出的关键问题包括：publication_has_any_exception函数中的错误索引使用，is_relid_published_explicitly中缺少except-flag验证，函数命名不一致，以及CreatePublication中过于复杂的代码路径统一处理所有发布类型而非按类型分离逻辑。错误消息需要改进，特别是对于临时/未记录表和使用多个EXCEPT TABLE发布创建订阅的情况。

具体技术关注点涉及正确处理分区层次结构、syscache使用，以及确保补丁不对ALL SEQUENCES情况执行不必要的操作。审查者建议整合相关函数如is_relid_or_ancestor_published以降低复杂性。多个错误代码和消息需要更新以使用ERRCODE_FEATURE_NOT_SUPPORTED和更清晰的措辞。小问题包括日志消息中的间距和澄清PublicationObjSpec中location字段添加的目的。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[client\_connection\_check\_interval 默认值](https://www.postgresql.org/message-id/CAHGQGwGw4LhNwOGQT3nbw3uWy8gL94_MB4T39Wfr4_Vgopuovg@mail.gmail.com)**
讨论的焦点是解决由client_connection_check_interval设置导致的"still waiting on lock"日志消息过多的问题。当后端在ProcSleep()中被阻塞且启用了log_lock_waits时，它们每隔client_connection_check_interval就会唤醒，可能发出频繁的等待消息。Fujii Masao提出了一个补丁，将这些消息的频率限制为每10秒一次，选择这个间隔而不是Tom Lane建议的2秒，因为觉得不那么激进。Laurenz Albe支持10秒间隔。然而，Ants Aasma认为10秒仍然太频繁，指出当数百个后端被单个长时间运行的锁阻塞时，这会每秒产生数十条消息，使得难以识别实际问题。他建议使用更长的间隔，超过5分钟，以减少日志噪声同时保持有意义的诊断信息。

参与者:
ants.aasma@cybertec.at, htamfids@gmail.com, jacob.champion@enterprisedb.com, laurenz.albe@cybertec.at, marat.buharov@gmail.com, masao.fujii@gmail.com, schneider@ardentperf.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com



## **行业新闻**

### **[Microsoft称Office漏洞将客户机密电子邮件泄露给Copilot AI](https://techcrunch.com/2026/02/18/microsoft-says-office-bug-exposed-customers-confidential-emails-to-copilot-ai?utm_campaign=daily_pm)**
Microsoft透露，Office软件中的一个漏洞将客户的机密邮件暴露给其Copilot AI聊天机器人，绕过了数据保护政策。该漏洞允许Copilot在没有适当授权的情况下读取和总结付费客户的私人邮件通信。这一安全事件引发了对AI系统访问敏感企业数据的重大担忧，并突显了Microsoft数据保护机制中的潜在漏洞。此次披露强调了公司在将AI系统与处理机密商业通信的企业软件平台集成时面临的持续隐私和安全挑战。

### **[OpenAI 进军高等教育，印度寻求扩大人工智能技能规模](https://techcrunch.com/2026/02/18/openai-pushes-into-higher-education-as-india-seeks-to-scale-ai-skills?utm_campaign=daily_pm)**
OpenAI正通过在印度的合作伙伴关系扩展到高等教育领域，目标是在明年内覆盖超过10万名学生、教职员工。此举正值印度寻求在其教育机构中扩大AI技能培养之际。这些合作伙伴关系代表了OpenAI在学术领域建立存在感的战略推进，同时支持印度更广泛的AI教育目标。通过在世界人口最多的国家之一瞄准如此庞大的受众群体，OpenAI正在定位自己以影响关键全球市场中下一代AI专业人士和研究人员。

### **[World Labs 获得10亿美元融资，其中Autodesk投资2亿美元，将世界模型引入3D工作流程](https://techcrunch.com/2026/02/18/world-labs-lands-200m-from-autodesk-to-bring-world-models-into-3d-workflows?utm_campaign=daily_pm)**
World Labs获得了10亿美元融资，其中Autodesk投资2亿美元，旨在将世界模型引入3D工作流程。此次合作将探索World Labs的AI模型如何与Autodesk的工具协同工作，反之亦然，首先专注于娱乐应用场景。这笔重大投资突显了AI与3D设计技术日益增长的交集，使World Labs能够在快速扩张的AI驱动创意工具市场中展开竞争。此次合作代表着将先进世界建模能力引入多个行业主流专业工作流程的重要一步。