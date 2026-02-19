# PostgreSQL 每日更新#56 2026-02-17



## **技术博客**

### **[计划于2026年2月26日发布的非常规版本](https://www.postgresql.org/about/news/out-of-cycle-release-scheduled-for-february-26-2026-3241/)**
PostgreSQL Global Development Group宣布将在2026年2月26日发布一个计划外版本，以解决2026年2月12日更新中引入的回归问题。有问题的版本包括18.2、17.8、16.12、15.16和14.21。发现了两个关键回归：substring()函数现在会对来自数据库列的非ASCII文本错误地引发"invalid byte sequence for encoding"错误，备用服务器可能会因事务状态访问错误而停止。substring()问题源于CVE-2026-2006安全修复。即将发布的版本将在2026年5月14日的下一个计划发布之前，为所有支持的版本（18.3、17.9、16.13、15.17、14.22）提供修复。

`www.postgresql.org`

### **[pgdsat 版本 1.2 已发布](https://www.postgresql.org/about/news/pgdsat-version-12-has-been-released-3239/)**
pgdsat version 1.2，一个PostgreSQL Database Security Assessment Tool，已经发布。该工具评估大约80个PostgreSQL安全控制，包括CIS合规基准建议。此次更新解决了用户报告的问题并引入了新功能：-r/--remove选项可使用检查号码或正则表达式从报告中排除特定检查，为RPM发行版添加了perl-bignum和perl-Math-BigRat包要求，以及Chinese (zh_CN)语言支持。pgdsat帮助自动化PostgreSQL集群的安全策略验证并提供潜在安全问题的洞察。这个开源工具在Linux上运行，采用GPLv3许可证。

`www.postgresql.org`

### **[postgres_dba 7.0 — 34份psql诊断报告](https://www.postgresql.org/about/news/postgres_dba-70-34-diagnostic-reports-for-psql-3237/)**
postgres_dba 7.0 是一个基于 psql 的交互式 PostgreSQL 诊断工具包的重大更新，无需扩展。该工具包提供 34 个诊断报告，涵盖膨胀和清理分析、表和索引健康检查、使用 pg_stat_statements 的查询分析、调优建议、大小估算、锁树分析、损坏检测和内存分析。7.0 版本引入了 7 个新报告，包括缓冲区缓存分析、工作负载分析和全面的 amcheck 损坏检测套件。它还在系统概述报告中添加了 WAL 和复制信息，并包含 PostgreSQL 17 兼容性修复。该工具包支持 PostgreSQL 13-18 版本，可在 GitHub 上获取。

`www.postgresql.org`



## **热门 Hacker 邮件讨论精选**

### **[修复未初始化的xl\_running\_xacts填充](https://www.postgresql.org/message-id/aZLHYtCsEldmm8Eu@ip-10-97-1-34.eu-west-3.compute.internal)**
正在讨论修复 xl_running_xacts WAL 记录结构中未初始化填充字节的问题。该问题在分析 WAL 文件时出现，随机填充值令人困惑。关键技术要点包括：在 C99 中，{0} 初始化器不保证填充字节初始化，但 C11 为静态存储持续时间对象提供保证。由于 PostgreSQL 现在使用 C11，{0} 初始化可能有效，编译器生成与 memset 等效的代码。然而，Andres Freund 认为 C11 的保证不适用于像 xl_running_xacts 这样的自动存储持续时间对象，并指出 C23 将修复此限制。讨论从 xl_running_xacts 扩展到识别许多具有填充空洞的 WAL 结构。Freund 建议如果需要填充初始化，应该在所有 WAL 记录中全面解决，而不是零散修复，这需要记录新规则并移除相关的 valgrind 抑制。

参与者:
andres@anarazel.de, anthonin.bonnefoy@datadoghq.com, bertranddrouvot.pg@gmail.com, michael@paquier.xyz, thomas.munro@gmail.com

### **[pgstat 包含扩展](https://www.postgresql.org/message-id/aZKesltb6Z35hlbP@paquier.xyz)**
讨论解决了pgstat.h中过度包含头文件的问题，该文件在PostgreSQL中被广泛包含。Andres Freund发现最近的提交显著扩展了pgstat.h包含的头文件，特别是添加了replication/worker_internal.h和其他重量级头文件。主要关注点是编译性能和不当暴露内部头文件。

正在讨论几种解决方案。Andres最初建议将LogicalRepWorkerType参数改为int，并对FullTransactionId等类型使用前向声明。然而，Michael Paquier等人更倾向于保持类型安全。Amit Kapila提议将LogicalRepWorkerType从worker_internal.h移动到logicalworker.h，这需要修复procsignal.c、functioncmds.c和测试文件中的几个间接包含依赖关系。

Alvaro Herrera支持移除有问题的包含并同意前向声明FullTransactionId。他质疑LogicalRepWorkerType是否属于logicalworker.h，并建议为订阅统计创建专用头文件。Andres提出了一个更根本的解决方案：完全消除worker类型参数，将pgstat_report_subscription_error分割为apply、sequence和表同步错误的独立函数，因为调用者已经知道具体的错误类型。

讨论还涉及从pgstat.h中移除在之前重构期间添加的向后兼容性包含，尽管这可能会破坏扩展。

参与者:
alvherre@kurilemu.de, amit.kapila16@gmail.com, andres@anarazel.de, li.evan.chao@gmail.com, michael@paquier.xyz, nisha.moond412@gmail.com, vignesh21@gmail.com

### **[向 pg\_stat\_activity 添加连接活跃、空闲时间](https://www.postgresql.org/message-id/CA+FpmFcOjbC1MdJFt--EL85pG4v2uXZkhjevPqogBNvZ5aQWbA@mail.gmail.com)**
讨论涉及一个为pg_stat_activity添加连接活跃和空闲时间跟踪的补丁。Robert Haas建议在代码风格上使用++递增而不是+= 1，Richard Guo对此表示同意。然而，Rafia Sabih对补丁的必要性提出了更根本的担忧。她认为，鉴于pg_stat_activity已经提供了state_change时间戳和state列，计算总空闲事务时间的原始问题可能是不必要的，这些现有功能可能已经能够达到相同目的。这表明现有基础设施可能已经提供了足够的信息来跟踪连接时间，而无需添加额外的字段或计数器。

参与者:
aleksander@timescale.com, guofenglinux@gmail.com, rafia.pghackers@gmail.com, robertmhaas@gmail.com, sergey.dudoladov@gmail.com, vignesh21@gmail.com, zubkov@moonset.ru

### **[索引预取](https://www.postgresql.org/message-id/CAE8JnxNOV9kOgmU1-WUWts9Q-Jj_Nf0K480wyEwJXUQYMnYu3g@mail.gmail.com)**
讨论围绕PostgreSQL索引预取功能的性能问题展开。Alexandre Felipe报告了混合的测试结果，发现预取对随机冷访问有益，但有时对顺序扫描和热访问模式有害。Tomas Vondra和Andres Freund识别出关键技术问题：距离调整算法产生不稳定性，交替的缓存命中和未命中使预取距离在1和2之间振荡，阻止了有效的并发I/O。Andres提出了"distance = distance * 2 + 1"等修复方案来避免这种振荡。其他问题包括限制预读激进性的让步逻辑，以及不能准确反映实际I/O行为的统计信息。团队讨论了各种改进方案，包括更好的距离算法、自适应让步和更准确的性能指标。Alexandre建议采用反馈循环方法和缓冲区跳过策略，尽管对于排序输出需求的可实现性仍存疑问。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[从 pg\_proc\.dat 生成函数默认设置](https://www.postgresql.org/message-id/183292bb-4891-4c96-a3ca-e78b5e0e1358@dunslane.net)**
Andrew Dunstan提出了一个解决Bug 19409的方案，通过消除在system_views.sql中编写函数参数默认值的需求来解决问题。他的补丁添加了基础设施，让genbki.pl从新的pg_proc.dat字段(proargdflts和provariadicdflt)生成function_defaults.sql，使pg_proc.dat成为单一数据源。该提议得到了Daniel Gustafsson、Tom Lane、Corey Huinker、Andres Freund和Michael Paquier等多位开发者的强烈支持，他们都认为当前的要求很烦人。

Tom Lane建议改进以使默认值更易读，提议基于哈希或预填充数组格式。Andres Freund发现CREATE OR REPLACE方法的潜在问题，指出缺少ROWS规范等问题可能导致静默不匹配。他建议采用更全面的解决方案，涉及引导级默认值解析和重构pg_proc.dat以使用参数列表而非并行数组。

Tom Lane同意实现引导解析解决方案，提议在InsertOneValue()中对pg_node_tree列进行特殊处理。讨论发展为对pg_proc.dat中函数定义的更广泛重构，Andrew Dunstan同意审查Tom Lane的实现，同时专注于引导基础设施改进。

参与者:
andres@anarazel.de, andrew@dunslane.net, corey.huinker@gmail.com, daniel@yesql.se, michael@paquier.xyz, tgl@sss.pgh.pa.us

### **[substring\(\) 的小改进](https://www.postgresql.org/message-id/CAN4CZFPgL6NyFDLZCvfwHygNRy1F1L1CihRJV-a7_hVerjZ_Hw@mail.gmail.com)**
Zsolt Parragi在substring()函数补丁中发现了性能回归问题，当处理负起始位置和长字符串时会出现此问题。问题源于移除了一个条件检查，该条件会在结束位置≤1时提前返回空字符串。使用大型TOAST表的测试显示，没有早期返回检查时执行时间从0.4ms增加到2ms。Thomas Munro确认了这个问题，指出函数可能在应该跳过零切片长度工作时仍在进行不必要的去TOAST操作。他建议重构函数，将长度计算提升到顶部以避免单字节和多字节字符分支之间的代码重复，目标是实现超出原始错误修复范围的更广泛改进。

参与者:
li.evan.chao@gmail.com, thomas.munro@gmail.com, zhjwpku@gmail.com, zsolt.parragi@percona.com

### **[pg\_upgrade: 尽可能传输 pg\_largeobject\_metadata 的文件](https://www.postgresql.org/message-id/aZOI_vpU0zayjBTj@nathan)**
Nathan Bossart已提交了一个补丁，改进了pg_upgrade对pg_largeobject_metadata文件的处理。该补丁允许pg_upgrade在可能的情况下直接传输这些文件，而不是要求完整的转储和恢复过程。此更改旨在提高包含大对象的数据库的升级性能。Andres Freund对这项工作表示赞赏，指出当前情况比PostgreSQL版本18中的情况要好得多。Nathan Bossart认可了反馈，并感谢Andres在整个开发过程中提供的指导和审查。随着此优化的成功提交，讨论似乎已经结束。

参与者:
andres@anarazel.de, hannuk@google.com, michael@paquier.xyz, nathandbossart@gmail.com, nitinmotiani@google.com, tgl@sss.pgh.pa.us

### **[将默认 wal\_blocksize 降低到 4K](https://www.postgresql.org/message-id/E25A9AD2-EAD3-4372-AFD2-2627E4D5E3C5@percona.com)**
讨论的核心是降低PostgreSQL的默认WAL块大小（XLOG_BLCKSZ）从8KB到4KB。Percona的Andy Pogrebnoi已经准备了此更改的补丁，并进行了基准测试，显示磁盘写入显著减少——在不同线程数量下减少了26%到41%的字节写入。4KB配置在大多数测试场景中也显示出相当或更好的事务吞吐量。Andres Freund支持此更改，但指出需要注意两个问题：wal_buffers的自动调优逻辑需要修复以正确考虑不同的块大小，以及应该手动测试从8KB到4KB的pg_upgrade兼容性。尽管较小的块会有比例更大的头部，但双方都同意好处超过缺点。在解决这些技术修复后，更改似乎已准备好继续进行。

参与者:
andres@anarazel.de, andrew.pogrebnoi@percona.com, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[\[WIP\]垂直聚集索引 \(columnar store extension\) \- take2](https://www.postgresql.org/message-id/2d5469cc8fd7e1deb3dbb41158ffc04c9ce2316a.camel@postgrespro.ru)**
PostgresPro的Timur Magomedov对Vertical Clustered Index (VCI)补丁提供反馈，强调了两个关键优势。首先，他赞扬VCI的用户API设计，指出它作为索引而非要求完整表转换为列式存储。用户可以使用清晰的SQL语法选择性地将特定列放入列式存储，保持熟悉的索引语义，性能收益伴随插入开销权衡。其次，他强调VCI创新的Change Data Capture (CDC)实现，使用IAM和heapam.c中的自定义钩子，而非传统触发器或逻辑复制。Magomedov建议VCI的CDC方法可能被提取为独立补丁进行更广泛审查，并用于其他扩展，表明其在VCI实现之外的通用性。

参与者:
alvherre@kurilemu.de, iwata.aya@fujitsu.com, japinli@hotmail.com, kuroda.hayato@fujitsu.com, o.alexandre.felipe@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, t.magomedov@postgrespro.ru, tomas@vondra.me

### **[发布中跳过架构更改](https://www.postgresql.org/message-id/CAFiTN-sYKNNW=8Z_qdqzyr9sA+-G-PpTSs5R1mVbPT6aKyEAqw@mail.gmail.com)**
讨论围绕着一个补丁展开，该补丁实现了使用"FOR ALL TABLES EXCEPT"语法从publication中排除表的支持。多位审查者正在对v44版本的补丁提供反馈。Dilip Kumar提出了几个关注点，包括不清楚的函数命名、混乱的文档语言，以及需要更好地解释为什么不支持多个带有异常列表的publication。David G. Johnston建议通过使用"exclusions"而不是"exceptions"来改善术语一致性，并质疑某些文档内容的放置。他还建议对关于分区处理和publish_via_partition_root行为的注释使用更清晰的措辞。Shveta Malik建议通过删除过度详细的段落来简化文档，并建议使用"table"而不是"relation"术语以提高清晰度。她质疑在EXCEPT TABLE上下文中是否需要大量提及行过滤器和列列表。Nisha Moond开始审查补丁，并在GetAllPublicationExcludedTables函数中识别出潜在的优化机会，建议当添加新的父ID时重新处理所有relid可以通过仅检查新添加的relid来避免。审查者们正在努力改善代码清晰度、文档准确性和性能优化，以便补丁能够最终完成。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[改进 pg\_sync\_replication\_slots\(\) 以等待主节点推进](https://www.postgresql.org/message-id/CAA4eK1K4xS_DAAOx=4vwLkLTGreCwOj2MphPGbpqTFOvh_YjGA@mail.gmail.com)**
Amit Kapila对pg_sync_replication_slots()改进的剩余补丁提出担忧。主要问题是该补丁在最坏情况下可能导致无限重试。他描述了一个有问题的序列，其中不同的slot在连续重试尝试中由于各种原因失败同步：物理复制延迟阻止WAL刷新到confirmed_flush_lsn、备用服务器和主服务器之间的slot失效不匹配等。尽管对整体补丁有担忧，Kapila承认一个特定的代码更改是有用的——将错误报告从条件性ERROR/LOG修改为在通过API重试slot同步时始终LOG，特别是针对主服务器上synchronized_standby_slots GUC配置不正确的情况。

参与者:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com



## **行业新闻**

### **[Ricursive Intelligence 在 4 个月内以 40 亿美元估值融资 3.35 亿美元](https://techcrunch.com/2026/02/16/how-ricursive-intelligence-raised-335m-at-a-4b-valuation-in-4-months)**
Ricursive Intelligence这家新兴AI初创公司在成立仅四个月内就成功融资3.35亿美元，估值达40亿美元。快速融资成功归功于该初创公司的知名创始人，他们是AI行业备受推崇的人物。据报道，这些创始人非常抢手，以至于各种公司都试图雇佣他们，最终他们决定推出自己的企业。这笔巨额投资和高估值表明投资者对该团队的专业知识和在人工智能领域做出重大贡献的潜力充满信心。

### **[Anthropic 和 Pentagon 据报道就 Claude 使用限制进行争议](https://techcrunch.com/2026/02/15/anthropic-and-the-pentagon-are-reportedly-arguing-over-claude-usage)**
据报道，Anthropic和五角大楼就Claude（Anthropic的AI助手）的可接受使用参数存在分歧。核心争议似乎围绕Claude是否可以用于大规模国内监控行动和自主武器系统。这一冲突凸显了AI公司与政府机构之间在先进人工智能技术的伦理边界和适当应用方面持续存在的紧张关系。这一分歧强调了人们对AI治理、AI系统军事应用以及AI开发者为其技术建立使用限制的责任的更广泛担忧。

### **[India AI Impact Summit 汇聚主要科技高管](https://techcrunch.com/2026/02/16/all-the-important-news-from-the-ongoing-india-ai-impact-summit)**
印度目前正在举办一场为期四天的重要AI影响峰会，吸引了主要AI实验室和大科技公司的高管。峰会汇聚了来自OpenAI、Anthropic、Nvidia、Microsoft、Google和Cloudflare的代表，以及各国政府首脑等高知名度与会者。这次聚会代表了一次专注于人工智能发展及其全球影响的重大国际汇聚。峰会为讨论AI进步、政策影响以及领先技术公司与各国政府官员之间的合作机会提供了平台。