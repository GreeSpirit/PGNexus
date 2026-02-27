# PostgreSQL 每日更新#66 2026-02-27



## **技术博客**

### **[pgvector 0.8.2 发布](https://www.postgresql.org/about/news/pgvector-082-released-3245/)**
pgvector 0.8.2已经发布，修复了一个严重的安全漏洞。此次更新修复了并行HNSW索引构建中的缓冲区溢出问题，该问题被标识为CVE-2026-3172。此漏洞可能导致其他数据库关系中的敏感数据泄露或导致数据库服务器崩溃。强烈建议用户在可能的情况下升级到此版本。pgvector是一个开源的PostgreSQL扩展，可在PostgreSQL数据库中提供向量相似性搜索功能。

`www.postgresql.org`

### **[超越 DBaaS 陷阱：为 PostgreSQL 争取运维独立性](https://enterprisedb.com/blog/beyond-dbaas-trap-claiming-operational-independence-postgresql)**
文章讨论了通过避免数据库即服务供应商锁定来实现PostgreSQL运营独立性。文章建议在云提供商的Kubernetes托管服务上运行应用程序的组织，通过使用CloudNativePG将PostgreSQL数据库从专有DBaaS解决方案迁移到现有Kubernetes集群中来重新获得数据主权。该方法强调控制数据层对运营独立性和Sovereign AI倡议至关重要，允许组织在利用Kubernetes编排能力的同时保持对数据库基础设施的完全控制。

`enterprisedb.com`

### **[PostgresCompare 1.1.104 版本发布](https://www.postgresql.org/about/news/postgrescompare-11104-released-3243/)**
PostgresCompare 版本 1.1.104 已发布，为数据库模式比较和同步增加了多项新功能。该工具连接两个实时 PostgreSQL 数据库，检测表、视图、函数、索引和 30 多种其他对象类型的差异，然后生成 SQL 部署脚本。主要新功能包括用于自定义 SQL 执行的部署前/后脚本、跨项目和环境的全局搜索功能、差异列表的键盘导航、自动依赖级联选择以防止不完整部署，以及带有进度条的重新设计比较卡片。之前的版本 1.1.103 添加了带风险级别分类的破坏性更改警告、差异悬停预览和有组织的部署脚本部分。PostgresCompare 支持 PostgreSQL 版本 9.2 到 18，在 Windows、macOS 和 Linux 上运行，提供 30 天免费试用。

`www.postgresql.org`

### **[PostgreSQL 18.3、17.9、16.13、15.17 和 14.22 发布！](https://www.postgresql.org/about/news/postgresql-183-179-1613-1517-and-1422-released-3246/)**
PostgreSQL Global Development Group 发布了所有支持版本的更新：18.3、17.9、16.13、15.17 和 14.22。这是一个周期外发布，用于解决上次更新后的多个回归问题。主要修复包括：解决备用服务器事务状态错误、与 CVE-2026-2006 相关的 substring() 函数编码问题、CVE-2026-2007 修复导致的 pg_trgm strict_word_similarity 崩溃，以及恢复 json_strip_nulls() 函数的不可变状态以支持索引兼容性。其他修复涉及 LATERAL UNION ALL 查询输出、NOT NULL 约束冲突、辅助进程的 pg_stat 函数、PL/pgSQL 复合类型转换和 hstore 二进制输入崩溃。从 PostgreSQL 18.0-18.2 升级的用户必须执行特定 SQL 命令来恢复正确的函数易变性。

`www.postgresql.org`

### **[Pgpool-II 4.7.1、4.6.6、4.5.11、4.4.16 和 4.3.19 现已正式发布。](https://www.postgresql.org/about/news/pgpool-ii-471-466-4511-4416-and-4319-are-now-officially-released-3247/)**
Pgpool Global Development Group发布了Pgpool-II的五个版本的小版本更新：4.7.1、4.6.6、4.5.11、4.4.16和4.3.19。Pgpool-II是一个PostgreSQL增强工具，提供连接池、负载均衡和自动故障转移功能。这些是针对多个支持版本分支的错误修复和改进的小版本发布。建议用户查看发布说明了解具体更改，并可从官方渠道下载源代码和RPM包。

`www.postgresql.org`

### **[使用 AWS DMS 和 Amazon RDS for PostgreSQL 复制空间数据](https://aws.amazon.com/blogs/database/replicate-spatial-data-using-aws-dms-and-amazon-rds-for-postgresql/)**
AWS演示了如何使用AWS Database Migration Service (DMS)在PostgreSQL数据库之间迁移空间数据。该过程需要在源数据库和目标数据库上都安装PostGIS扩展，几何列被视为大对象(LOB)处理。关键要求包括表必须有主键、目标数据库上的几何列必须可为空，以及正确的LOB配置（包括受限LOB模式和适当的大小限制）。常见挑战涉及LOB处理错误和数据库版本间的PostGIS兼容性。该解决方案支持全量加载和变更数据捕获，适用于地图和资产跟踪等地理空间应用，需要通过CloudWatch日志进行仔细监控并在迁移后验证几何数据完整性。

`Ramdas Gutlapalli`

### **[纵向扩展：购买你负担不起的时间](https://www.tigerdata.com/blog/vertical-scaling-buying-time-you-cant-afford)**
该文章讨论了对处理高频数据摄取的PostgreSQL数据库进行垂直扩展的局限性。虽然升级实例通过提供更多CPU、RAM和存储可以暂时改善性能，但它并不能解决由MVCC头部、索引条目和WAL记录造成的底层每行开销问题。在每秒100K插入的情况下，PostgreSQL为仅100MB的应用数据生成250-350MB的I/O，这是由于架构设计选择针对通用工作负载而非连续仅追加摄取进行了优化。团队通常需要花费20-30%的时间进行数据库操作，创造了一个成本高昂的循环，每次升级提供的回报递减。作者建议TimescaleDB作为架构解决方案，既保持PostgreSQL兼容性，又解决时序工作负载的存储引擎限制。

`Matty Stratton`



## **热门 Hacker 邮件讨论精选**

### **[在错误消息中显示虚拟列的表达式](https://www.postgresql.org/message-id/2f55b9a4-332f-45c7-9b27-590637a2bb9a@gmail.com)**
Matheus Alcantara提交了v3补丁，通过显示列表达式而不是仅显示"virtual"来改进虚拟生成列的错误消息。Tom Lane审查了补丁并对该方法表示担忧：表达式可能使错误消息过长，在错误路径中增加复杂性有风险，并且这会使虚拟列与存储列的行为不同。Lane建议显示表达式的计算值，类似于存储列。Alcantara调查后发现虚拟列值从不存储，而是通过扩展表达式按需计算。Lane随后提议在INSERT/UPDATE操作期间计算虚拟列值（即使不写入磁盘），以便为错误消息提供这些值，并防止出现可以插入行但由于溢出等运行时错误而无法获取的情况。

参与者:
matheusssilv97@gmail.com, nagata@sraoss.co.jp, peter@eisentraut.org, tgl@sss.pgh.pa.us

### **[修复multixact Oldest\*MXactId初始化和访问中的bug](https://www.postgresql.org/message-id/C991344D-F38A-4EEC-903A-72B52FF887FA@gmail.com)**
Yura Sokolov为multixact OldestMemberMXactId和OldestVisibleMXactId初始化错误提出了修复方案。在第3版中，他通过从OldestVisibleMXactId中排除辅助进程（仅MaxBackends个元素）使数组大小精确，同时保持OldestMemberMXactId为MaxBackends + max_prepared_xacts并调整procno索引。他引入了预计算变量MaxChildren、TotalProcs和TotalXactProcs以实现更清洁的代码组织。Chao Li承认这种方法符合他最初的想法，但质疑在热路径中复杂性是否能证明共享内存优化的合理性。Sami Imseih对断言检查带来的不必要运行时复杂性表示担忧，更倾向于用简单的集中化计算来实现未来防护，而不是增加内联函数复杂性。Yura为运行时断言辩护，认为它们能防止未来的错误，并声称这些断言本来可以防止原始问题。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, samimseih@gmail.com, y.sokolov@postgrespro.ru

### **[将 starelid、attnum 添加到 pg\_stats 并在 pg\_dump 中利用](https://www.postgresql.org/message-id/CAA5RZ0vY5jHXQEOyUdjW7tPrXb9TY_bdr8ZpCRuALj1zU5DD_w@mail.gmail.com)**
提出了一个补丁，在pg_stats视图中暴露pg_statistic.starelid和attnum，然后修改pg_dump使用starelid而不是schemaname+relname组合。此更改旨在通过避免因安全屏障优化问题导致的大型pg_statistic表顺序扫描来改善查询性能。Sami Imseih支持该提案并提供了关于列排序、数据类型和文档的详细反馈。Tom Lane同意这个概念但反对"starelid"这个名称，建议使用"tableid"或"tablerelid"，认为它暴露了实现细节，违背了pg_stats隐藏pg_statistic物理表示的目的。Lane还批评提议的列排序是随意的，并建议两种替代安排。讨论聚焦于命名约定、列位置以及维护pg_stats在底层目录结构上提供的抽象层。

参与者:
corey.huinker@gmail.com, nathandbossart@gmail.com, samimseih@gmail.com, tgl@sss.pgh.pa.us

### **[元组变形的更多加速](https://www.postgresql.org/message-id/CAApHDvpBuTZLOQLfDETa9U-je2scAe3_BNXZScwr3hLPc6Hf3g@mail.gmail.com)**
讨论集中在PostgreSQL元组解构的优化上，特别是围绕CompactAttribute结构体大小。David Rowley解释说，虽然CompactAttribute可以从8字节减少到6字节以节省内存，但当前的8字节对齐允许高效使用LEA指令进行地址计算。减少到6字节需要两个LEA指令而不是一个，可能会抵消性能收益。对话还讨论了deform_bench基准测试工具的放置位置。Álvaro Herrera最初建议在src/benchmark下创建合适的基准测试套件，而Andres Freund主张不要延迟集成有用工具，并建议使用单一扩展来避免开销。他们同意默认不安装基准测试模块，并就src/benchmark与src/test/modules位置进行辩论。

参与者:
alvherre@kurilemu.de, andres@anarazel.de, dgrowleyml@gmail.com, johncnaylorls@gmail.com, li.evan.chao@gmail.com, zsolt.parragi@percona.com

### **[pgstat 包含扩展](https://www.postgresql.org/message-id/202602261253.g4k4e6likctn@alvherre.pgsql)**
Alvaro Herrera提交了从pgstat.h中移除transam.h和relcache.h的更改，随后又移除了wait_event.h。后一项更改需要在几个.c文件中添加pgstat.h包含，并需要在#ifndef FRONTEND内处理xlogreader.c包含，以避免pg_rewind和pg_waldump的CI报错。Andres Freund担心这可能会破坏那些使用WaitLatch和WAIT_EVENT_EXTENSION但没有直接包含wait_event.h的扩展。讨论探讨了在latch.h中包含wait_event.h作为折衷方案，但这可能通过proc.h和libpq.h等广泛包含的头文件造成污染。两位开发者都同意为了代码整洁性而修复PostgreSQL源码树中的影响，同时就如何最大程度减少扩展破坏的最佳方法进行辩论。

参与者:
alvherre@kurilemu.de, amit.kapila16@gmail.com, andres@anarazel.de, hlinnaka@iki.fi, michael@paquier.xyz

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAA4eK1Lxp8_HJv3sZNPx-oM1CUUi5p2UYa1PoVTe-QOEEp+3Ww@mail.gmail.com)**
讨论围绕为PostgreSQL发布实现EXCEPT TABLE语法，允许用户从ALL TABLES发布中排除特定表。补丁提议的语法如"CREATE PUBLICATION pub FOR ALL TABLES EXCEPT TABLE (table1, table2)"。关键技术决策包括将EXCEPT子句限制为只支持根分区表（而非单个分区）以降低复杂性，并在目标表位于EXCEPT子句中时阻止分区附加。有人对查询pg_publication_rel获取EXCEPT表的性能表示担忧，但贡献者澄清对于ALL TABLES发布，pg_publication_rel中只存储EXCEPT条目，因此不需要额外索引。最近的反馈涉及实现细节，包括错误消息、内存管理、pg_dump支持问题和代码组织。团队同意通过排除单个分区支持来简化初始版本，专注于根表的核心EXCEPT功能。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, lepihov@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[pg\_plan\_advice 查询计划建议](https://www.postgresql.org/message-id/CA+TgmoYjcBA6dw3nwiyfDzPXTCrxTZPXDMrc2TrDJcL1cPK6iA@mail.gmail.com)**
Robert Haas回应了Alexandra Wang对pg_plan_advice补丁的详细审查。他承认让资深黑客审查这个大补丁的挑战性，并讨论了检测规划器行为随时间变化的关键问题。Haas认为test_plan_advice应该能捕获添加新优化时的未来故障，但承认这可能会给未来的补丁作者带来负担。他考虑为规划器节点添加更多信息注释以减少推理需求，但担心如果后来发现错误可能出现ABI兼容性问题。Haas同意Wang识别的几个技术修复，包括纠正列表删除逻辑、解引用布尔指针、修复内存上下文处理，以及向共享建议收集添加权限检查。他还按建议删除了未使用的变量和代码。

参与者:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us



## **行业新闻**

### **[Google向初创公司Form Energy支付10亿美元收购其大容量100小时电池](https://techcrunch.com/2026/02/26/google-paid-startup-form-energy-1b-for-its-massive-100-hour-battery)**
Google以10亿美元收购了初创公司Form Energy，重点关注该公司革命性的100小时电池技术。Form Energy专门从事长时储能解决方案，能够长时间储存电力，解决了可再生能源电网整合中最大的挑战之一。此次收购代表了Google加强其在清洁能源领域地位并支持其雄心勃勃的可持续发展目标的重大战略举措。该交易将使Form Energy能够在明年潜在的公开上市之前筹集额外资金，同时让Google获得尖端电池技术，这项技术可能会改变各种应用中的储能能力。

### **[Mistral AI 与全球咨询巨头 Accenture 签署合作协议](https://techcrunch.com/2026/02/26/mistral-ai-inks-a-deal-with-global-consulting-giant-accenture)**
法国AI初创公司Mistral AI宣布与全球咨询公司Accenture建立战略合作伙伴关系，将其大型语言模型的覆盖范围扩展到全球企业客户。这一合作是在Accenture继续多元化其AI合作伙伴关系之际达成的，该公司最近与竞争对手OpenAI和Anthropic签署了类似协议。此次合作将使Accenture能够将Mistral的AI技术整合到其咨询服务中，帮助客户在各种商业应用中实施先进的语言模型。此举使Mistral AI能够在企业市场中与OpenAI等老牌企业更有效地竞争，同时为Accenture提供欧洲AI技术，这可能会吸引寻求美国AI提供商替代方案的客户。

### **[Trace 融资300万美元以解决企业AI代理采纳问题](https://techcrunch.com/2026/02/26/trace-raises-3-million-to-solve-the-agent-adoption-problem)**
Trace已获得300万美元种子轮融资，以解决企业环境中AI智能体采用的挑战。此轮融资包括来自Y Combinator、Zeno Ventures、Transpose Platform Management、Goodwater Capital、Formosa Capital和WeFunder的投资。这家初创公司专注于解决在大型组织内实施和管理AI智能体的复杂问题，其中集成挑战和采用障碍往往阻止成功部署。Trace的平台旨在简化将AI智能体引入企业工作流程的过程，使公司更容易实现自主AI系统的益处。这笔资金将使公司能够进一步开发其技术，并在快速增长的企业AI领域扩大其市场占有率。