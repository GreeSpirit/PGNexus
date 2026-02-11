# PostgreSQL 每日更新#49 2026-02-11



## **技术博客**

### **[add-mcp：在編碼代理程式和編輯器中安裝 MCP 伺服器](https://neon.com/blog/add-mcp)**
Andre Landgraf 介绍了 add-mcp，这是一个 CLI 工具，可以简化在不同编程代理和编辑器中安装 MCP（Model Context Protocol）服务器的过程。该工具解决了每个开发环境在不同位置查找代理技能的问题，这使得设置过程重复且文档维护困难。类似于 Vercel 的 add-skill CLI，add-mcp 标准化了 MCP 服务器的安装过程，这些服务器为 AI 编程助手提供上下文信息。这简化了开发者在使用多个依赖 MCP 服务器增强功能的 AI 驱动开发工具时的体验。

`Andre Landgraf`

### **[建立自訂解決方案，使用 AWS DMS 將 SQL Server HierarchyID 移轉到 PostgreSQL LTREE。](https://aws.amazon.com/blogs/database/build-a-custom-solution-to-migrate-sql-server-hierarchyid-to-postgresql-ltree-with-aws-dms/)**
这篇AWS博客文章详细介绍了使用AWS DMS将SQL Server HierarchyID列迁移到PostgreSQL LTREE的解决方案。该过程包括设置包含HierarchyID数据的源SQL Server表，创建带LTREE扩展的目标PostgreSQL表，以及使用AWS DMS进行迁移。解决方案包括将二进制HierarchyID格式（如/1/1/1/）转换为LTREE的点分隔格式（1.1.1）。关键步骤包括运行AWS DMS全量加载和CDC，添加生成的LTREE列来自动转换数据，以及恢复复制以处理持续变更。文章提供了实际示例、HierarchyID和LTREE操作之间的函数映射，以及在数据库转换期间保留分层数据结构的完整迁移工作流。

`Shashank Kalki`

### **[使用 pgwatch 和 pg_stat_plans 監控查詢計劃。](https://www.cybertec-postgresql.com/en/monitoring-query-plans-with-pgwatch-and-pg_stat_plans/)**
PostgreSQL生态系统引入了pg_stat_plans扩展，它跟踪查询计划的聚合统计信息，而不是像pg_stat_statements那样跟踪SQL语句。Ahmed Gouda演示了如何将此扩展与pgwatch监控系统集成，以分析资源密集型查询计划。设置包括编写一个SQL查询，将pg_stat_statements与pg_stat_plans连接以检索高资源查询的计划，使用YAML文件配置pgwatch的自定义指标和源，以及通过Grafana仪表板可视化结果。作者展示了如何创建新的指标定义，运行pgwatch收集测量数据，以及构建显示同一查询不同执行计划的仪表板面板。这种集成使数据库管理员能够监控和调试查询计划变化，而无需从开发团队请求查询文本。

`Ahmed Gouda`



## **热门 Hacker 邮件讨论精选**

### **[修復其他訊息](https://www.postgresql.org/message-id/20260210.143752.1113524465620875233.horikyota.ntt@gmail.com)**
Kyotaro Horiguchi提交了补丁，解决PostgreSQL错误消息中的各种问题，包括非标准措辞、语法错误和格式不一致。补丁涵盖了guc_table.c（使用"Show"而非"Shows"）、partbounds.c（提示消息结构不一致和错误的现在时用法）、wait.c（"timeout value"与"timeout"措辞不一致）和extended_stats_funcs.c（quote_identifier()与格式字符串引号结合导致的双引号问题）中的问题。然而，Horiguchi指出初始补丁集导致了测试失败。Michael Paquier和Álvaro Herrera对引号问题提供了反馈，Tom Lane澄清了在错误消息中不应使用quote_identifier()，因为它与PostgreSQL可翻译消息的样式指南冲突。Michael Paquier随后提交了修复f33c58577422，移除了quote_identifier()调用并调整错误字符串格式以符合项目标准。

参与者:
alvherre@kurilemu.de, horikyota.ntt@gmail.com, michael@paquier.xyz, tgl@sss.pgh.pa.us

### **[postgres\_fdw 迴歸測試的不穩定性](https://www.postgresql.org/message-id/3866274.1770743162@sss.pgh.pa.us)**
Tom Lane 报告了影响多个使用 meson 的构建农场动物的 postgres_fdw 回归测试间歇性失败。问题涉及 UPDATE...RETURNING 查询中的非确定性行排序，其中行 2010 有时出现在结果开头而不是结尾。Lane 追踪到这是由于在存在并发事务时机会性页面修剪行为不同造成的，尽管在测试表上已禁用 autovacuum。测试假设顺序插入顺序，但有时行会被放置在表中较早的空闲空间中。Lane 建议通过将 UPDATE 包装在带有 ORDER BY c1 的 CTE 中来修复此问题，以确保确定性输出。Nathan Bossart 同意建议的修复，指出他之前调查过这个问题。Alexander Lakhin 提供了额外的背景，引用了他之前对类似失败的重现和报告，确认了尽管被禁用但 autovacuum 仍有参与。

参与者:
exclusion@gmail.com, nathandbossart@gmail.com, tgl@sss.pgh.pa.us

### **[跳過 publication 中的 schema 更改](https://www.postgresql.org/message-id/CAJpy0uC_0uvhmXyWegKGRozhpyoLGHwHrUAK=Wk+bSmzqLMoSw@mail.gmail.com)**
讨论重点是在PostgreSQL逻辑复制中组合多个publication时如何处理EXCEPT列表。参与者就是否应允许组合带有EXCEPT子句的publication展开辩论。Peter Smith认为"pub1: FOR ALL TABLES EXCEPT (tab1)"和"pub2: FOR TABLE tab1"应该可以组合，因为它们代表非矛盾的集合。David G. Johnston支持这一观点，建议publication组合应该像系统授权一样是纯加法的。然而，Shveta Malik和团队决定限制组合多个都使用EXCEPT列表的publication，理由是实现复杂性高而缺乏明确的业务用例。当分区表具有不同的publish_via_partition_root设置时，这变得特别复杂。Vignesh C确认这种方法已在v42补丁中实现，冲突通过优先考虑根表publication来解决。这种限制旨在保持初始实现的简单性，同时为未来如果出现有效用例时的增强留下空间。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[緩衝區鎖定是特殊的（提示、校驗和、AIO 寫入）](https://www.postgresql.org/message-id/19720.1770709587@localhost)**
Antonin Houska报告了一个问题，HeapTupleSatisfiesMVCCBatch()在逻辑解码过程中被错误地调用，使用了历史MVCC快照，导致REPACK操作出现问题。根本原因是IsMVCCSnapshot宏包括常规和历史MVCC快照，但按页扫描应该只适用于常规MVCC快照。在逻辑解码期间，这会导致pg_class条目上的提示位设置不正确，产生"cache lookup failed for relation"错误。

Andres Freund确认这是非预期行为，提议通过修改条件来限制按页扫描，对历史MVCC快照禁用页面模式。Houska测试了修复方案并确认解决了问题。为了得到合适的解决方案，Freund建议将IsMVCCSnapshot拆分为单独的函数：IsMVCCSnapshot()仅用于常规快照，IsMVCCLikeSnapshot()用于两种类型，然后审查所有现有调用者。

参与者:
ah@cybertec.at, andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[無需重新啟動即可更改 shared\_buffers](https://www.postgresql.org/message-id/CAExHW5ui9-aKtS-vwUYMQ4uSmi54cvLpvqrf29B8L69ZJa766g@mail.gmail.com)**
讨论集中在Ashutosh Bapat关于动态更改shared_buffers而无需服务器重启的补丁。该方法使用memfd_create()和地址空间预留，采用两个共享内存段而不是之前的六个。Jakub Wartak进行的基准测试显示在单插槽系统上性能回归最小，但在早期版本的NUMA机器上有一些性能下降。最新的补丁(20260209)似乎解决了大部分性能问题。然而，发现了几个bug：huge pages支持存在静默失败和大小计算错误，fallocate()导致启动时间缓慢（64GB shared_buffers需要49秒），即使有足够的空闲页面，huge page分配也会失败。Andres Freund质疑多重映射的必要性，建议使用MADV_DONTNEED，认为复杂性可能不足以证明其益处。Heikki Linnakangas提议重新设计共享内存接口，允许按需段创建，这将有利于扩展并提供更清洁的API。当前实现需要修复huge pages支持和启动性能优化。

参与者:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, jakub.wartak@enterprisedb.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[解耦我們對 int64 和 double 的對齊假設](https://www.postgresql.org/message-id/LV8PR15MB6488B8CD9D5AB1CDF2E03F92D665A@LV8PR15MB6488.namprd15.prod.outlook.com)**
IBM的Aditya Kamath成功测试了Tom Lane的POC补丁，该补丁解决了AIX上int64和double类型的对齐问题。该补丁能够在pg_upgrade操作期间正确处理DOUBLE PRECISION和BIGINT列。测试涉及在AIX上从PostgreSQL 15升级到master分支，升级后所有数据都得到正确保留。GNU构建和Meson测试套件都成功通过。Tom Lane提供了补丁的改进版本，将BEGIN/END_CATALOG_STRUCT宏传播到所有目录头文件中，并实现了push/pop pragma变体以提供更好的未来兼容性。Thomas Munro指出IBM已经不再支持xlc编译器，建议基于LLVM/Clang的新IBM OpenXL C/C++编译器可能能更好地处理这些对齐问题。Tom Lane表示一旦基于gcc的移植完成，有兴趣测试新的工具链。

参与者:
aditya.kamath1@ibm.com, andres@anarazel.de, postgres-ibm-aix@wwpdl.vnet.ibm.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com

### **[\[開發中\]垂直聚集索引（列式儲存擴充）\- take2](https://www.postgresql.org/message-id/CAHut+PsH4ticwZJtmAAEz5Uzv9YadrMVj-JXZvp4PJKJtkT6bA@mail.gmail.com)**
Peter Smith提交了VCI补丁的重新基准版本，用于Vertical Clustered Index列存储扩展。Álvaro Herrera对当前设计方向表达了强烈担忧，声明在contrib/中使用heapam和事务机制钩子的完整执行器实现是不可接受的，不会被接受。他主张将其重新实现为src/backend/access/中的新表AM，配以适当的执行器支持，并承认这将是一项巨大的工程，需要雇主的重大支持。尽管存在风险，Herrera强调良好的列存储对PostgreSQL至关重要。Alexandre Felipe支持该项目，并提出了分阶段开发方法，设计原则专注于可插拔性、实用性、简单性和有限范围。他概述了三个阶段：使用钩子的准备工作、用于扫描和聚合的核心实现，以及机会性ROS更新。讨论的核心是寻找可接受的架构方向，而不是继续进行小幅度重新基准。

参与者:
alvherre@kurilemu.de, iwata.aya@fujitsu.com, japinli@hotmail.com, kuroda.hayato@fujitsu.com, o.alexandre.felipe@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, t.magomedov@postgrespro.ru, tomas@vondra.me

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoaCdsuvNn6T6SfQ_0YD2Hh2+hgTXh9fTGHQhPg1zvy2rQ@mail.gmail.com)**
Robert Haas已提交了pg_plan_advice功能的0001-0005补丁，并发布了v15版本，主要补丁现在是0002。关键变更包括添加新的GUC参数pg_plan_advice.feedback_warnings（默认禁用），用于在不需要EXPLAIN的情况下警告无效的计划建议字符串。此次更新修复了几个问题：一致使用get_namespace_name_or_temp来解决临时表的INDEX_SCAN和INDEX_ONLY_SCAN建议问题，修正了pgpa_scan.c中在某些连接场景下生成虚假NO_GATHER建议的问题，以及修复了JOIN_ORDER建议与PARTITIONWISE建议错误冲突的逻辑错误。来自David G. Johnston的文档改进建议被采纳并进行了额外修改。包含了0003-0004补丁以保证测试兼容性，但这些补丁属于单独的讨论线程。

参与者:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[密碼過期警告](https://www.postgresql.org/message-id/aYu1xUwQ-pqueeJJ@nathan)**
Nathan Bossart宣布计划明天提交与密码过期警告功能相关的更改。这似乎是涉及多名PostgreSQL社区成员讨论线程的最后一步。该提交代表了在PostgreSQL中实现或改进密码过期警告功能的开发工作的最终成果。鉴于参与者名单包括著名的PostgreSQL贡献者，该功能在进入提交阶段之前可能经历了彻底的审查和讨论。Nathan消息的简洁性表明技术细节和共识建立发生在此线程的早期交流中。

参与者:
andrew@dunslane.net, euler@eulerto.com, gilles@darold.net, japinli@hotmail.com, li.evan.chao@gmail.com, liuxh.zj.cn@gmail.com, nathandbossart@gmail.com, niushiji@gmail.com, peter@eisentraut.org, shiyuefei1004@gmail.com, tgl@sss.pgh.pa.us, tsinghualucky912@foxmail.com, zsolt.parragi@percona.com

### **[PGPROC 對齊（原標題：pgsql：將 RecoveryConflictReasons 與 procsignals 分開）](https://www.postgresql.org/message-id/1cb0d7e9-d6dd-4517-a7cd-0ad98e1207f3@iki.fi)**
讨论重点是优化PGPROC结构对齐以提升性能。Andres Freund建议将PGPROC设为2的幂次大小来优化GetPGProcByNumber()索引操作，该操作目前需要昂贵的64位乘法而非更快的位移操作。他指出这在LWLock竞争激烈的工作负载中会出现问题，并建议将频繁变化的字段与静态字段分离以避免伪共享问题。Heikki Linnakangas提出缓存行对齐作为折中方案，提供了一个补丁将结构对齐到缓存行边界而非扩展到1024字节。Bertrand Drouvot建议逻辑性地重新排列字段，这将结构减少到832字节，但在使用显式对齐时需要64字节填充。参与者们同意将相关字段分组以获得更好的缓存行为和可读性，尽管Andres强调需要在大型机器上进行具体基准测试来验证性能改进。

参与者:
andres@anarazel.de, bertranddrouvot.pg@gmail.com, hlinnaka@iki.fi

### **[改進 pg\_sync\_replication\_slots\(\) 函數，使其等待主複製完成。](https://www.postgresql.org/message-id/CAJpy0uCCUkweQad2U6n0KRcrjEJe-MzR-Nsw4d6bwQSdf1N8EA@mail.gmail.com)**
Zhijie Hou提交了修订的补丁集以改进pg_sync_replication_slots()功能，解决了shveta malik之前的反馈。讨论重点是通过让函数等待并重试直到故障转移槽正确同步来增强槽同步。补丁集包括三个组件：通过使用槽属性而不是冗余参数简化函数参数，将重复的WAL刷新检查合并到单一位置以防止编码错误，以及实现等待行为的主要改进。shveta malik针对槽更新返回值、注释准确性和跳过原因的完整性检查提供了详细的技术反馈。一个关键的未解决问题是当远程槽仍然有效时，函数是否应该等待本地无效的槽，因为这可能影响故障转移场景，其中有效的远程槽在故障转移后变为本地无效。

参与者:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com

### **[在確認邏輯複製中的遠端刷新之前，請退出 Walsender。](https://www.postgresql.org/message-id/acPtXlUKpmJHvXx4vRwPYELf-LG9IF56tzUlJiPJ0_83g96bKdDftJcMCN3NjgsHe2ovovJAgADBWbytYx_yMKY6xArr-_NL8ywDf-gBf4E=@dunklau.fr)**
Ronan Dunklau回应了Andrey Silitskiy关于逻辑复制中walsender超时实现的反馈。讨论焦点是添加超时参数来限制配置walsender时PostgreSQL重启或停止所需的时间。Silitskiy指出虽然当前实现允许类似功能，但Dunklau的方法提供了更简单的接口，不过由于现有的wal_sender_timeout参数可能造成用户混淆，存在命名方面的担忧。

Dunklau阐明了他的使用场景：确保使用walsender时的有界重启/停止时间，同时避免pg_upgrade操作期间的问题。他解释说立即关闭解决了时间问题，但在逻辑复制槽有待处理更改时会给升级造成复杂性。用户需要通过切换到wait_flush来禁用该行为或面临升级失败的风险。超时方法比现有替代方案更有效地解决了这些场景，使其在维护过程中的操作可靠性方面更为可取。

参与者:
a.silitskiy@postgrespro.ru, aekorotkov@gmail.com, amit.kapila16@gmail.com, andres@anarazel.de, dilipbalaut@gmail.com, horikyota.ntt@gmail.com, htamfids@gmail.com, kuroda.hayato@fujitsu.com, masao.fujii@gmail.com, michael@paquier.xyz, osumi.takamichi@fujitsu.com, peter.eisentraut@enterprisedb.com, ronan@dunklau.fr, sawada.mshk@gmail.com, smithpb2250@gmail.com, v.davydov@postgrespro.ru



## **行业新闻**

### **[前 GitHub CEO 帶領其開發工具公司完成創紀錄的 6,000 萬美元種子輪融資，公司估值達 3 億美元。](https://techcrunch.com/2026/02/10/former-github-ceo-raises-record-60m-dev-tool-seed-round-at-300m-valuation?utm_campaign=daily_pm)**
前GitHub CEO Thomas Dohmke为他的新初创公司筹集了创纪录的6000万美元种子轮融资，估值达3亿美元。该公司专注于开发AI系统，旨在帮助开发者更好地管理AI代理产生的所有代码。这是开发者工具领域有史以来最大的种子轮融资之一，突显了投资者对AI驱动的开发解决方案以及Dohmke在领导GitHub期间的业绩记录的信心。

### **[YouTube 為 Premium 用戶推出 AI 播放清單產生器](https://techcrunch.com/2026/02/10/youtube-rolls-out-an-ai-playlist-generator-for-premium-users?utm_campaign=daily_pm)**
YouTube Music正在为iOS和Android平台的Premium用户推出一项新的AI驱动的播放列表生成功能。该功能允许用户使用文本提示创建自定义播放列表，利用人工智能根据用户偏好和描述来策划音乐。这代表了YouTube通过AI功能增强其音乐流媒体服务的最新努力，与其他音乐平台提供的类似功能竞争。AI播放列表生成器旨在为用户提供更个性化和直观的音乐发现和组织方式。

### **[xAI近一半的創始團隊成員現已離開公司。](https://techcrunch.com/2026/02/10/nearly-half-of-xais-founding-team-has-now-left-the-company?utm_campaign=daily_pm)**
近一半的xAI创始团队成员已经离开了公司，这引发了人们对这家AI初创公司稳定性的担忧，尤其是在其准备进行潜在IPO之际。这些离职代表着该公司人才和机构知识的重大损失，该公司由Elon Musk创立。鉴于xAI在面对上市带来的更严格审查之前还有大量工作要做，这些离职的累积影响尤其令人担忧。这些离职可能表明组织内部存在潜在挑战或对公司方向和未来计划存在分歧。