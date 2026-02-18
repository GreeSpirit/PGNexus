# PostgreSQL 每日更新#57 2026-02-18



## **技术博客**

### **[在 Windows 上使用 Visual Studio 2026 编译 PostgreSQL 扩展](https://enterprisedb.com/blog/compiling-postgresql-extensions-visual-studio-2026-windows)**
这篇由Craig Ringer和Xavier Fischer共同撰写的博客文章提供了在Windows上使用Visual Studio 2026 Community编译PostgreSQL扩展的更新教程。文章解决了用户在Visual Studio环境中构建PostgreSQL扩展时面临的常见困难。它作为一个实用指南，演示了简单扩展的编译过程，更新了之前的说明以适配新版本的Visual Studio 2026。该教程旨在帮助开发者克服构建挑战，在Windows平台上成功创建PostgreSQL扩展。

`enterprisedb.com`

### **[使用 Citus 14 分布式部署 PostgreSQL 18](https://www.citusdata.com/blog/2026/02/17/distribute-postgresql-18-with-citus-14/)**
Citus 14.0 已发布，支持 PostgreSQL 18，为最新的 Postgres 功能提供分布式数据库能力。该版本在分布式集群中启用了 PostgreSQL 18 的关键改进，包括用于更快扫描和维护的异步 I/O、用于更好多列 B-tree 索引使用的 skip-scan、用于时间排序 UUID 的 uuidv7() 以及 OAuth 身份验证支持。Citus 14 为新的 PostgreSQL 18 语法添加了特定的兼容性工作，包括 JSON_TABLE() COLUMNS、时态约束、默认虚拟生成列、VACUUM/ANALYZE ONLY 语义、DML 操作中的 RETURNING OLD/NEW 以及扩展的 COPY 功能。该版本通过适当的解析、DDL 传播和跨协调器和工作节点的分布式执行处理，确保这些功能在分布式环境中正确工作。

`www.citusdata.com`

### **[回顾 P2D2 2026](https://www.cybertec-postgresql.com/en/looking-back-at-p2d2-2026/)**
CYBERTEC PostgreSQL的Sarah Gruber作为赞助商代表参加了在布拉格举行的P2D2 2026会议。第一天主要是研讨会，她利用时间探索了布拉格的建筑和地标。第二天负责展台工作，展示PostgreSQL卡片组合和用于演示集群故障转移的Patroni手提箱。她观看了同事Pavlo主持的闪电演讲，并注意到与会者对他们营销材料的强烈兴趣。尽管整个访问期间遭遇了具有挑战性的暴雪天气，这次活动还是提供了网络交流机会和对PostgreSQL技术工作的深入了解。

`Sarah Gruber`

### **[Neon 是一个游标插件](https://neon.com/blog/neon-is-a-cursor-plugin)**
Neon为AI代码编辑器Cursor推出了插件。该插件作为Cursor首批插件发布的一部分，现已在Cursor Marketplace上架。它为Cursor提供了对用户Neon组织的实时访问权限，以及使用Neon PostgreSQL数据库服务所需的知识。这一集成使开发者能够直接通过Cursor界面与他们的Neon数据库交互，简化了开发环境中的数据库操作。

`Carlota Soto`

### **[PostgreSQL 19：第1部分或 CommitFest 2025-07](https://postgrespro.com/blog/pgsql/5972724)**
PostgreSQL 19开发正在进行中，July 2025 CommitFest带来了新功能。主要新增包括libpq和psql中的连接服务文件支持、用于数据库标识符的新regdatabase类型，以及增强的pg_stat_statements，具有通用/自定义计划计数器和改进的命令规范化。性能改进包括优化的临时表截断、Append/MergeAppend节点中的增量排序，以及pg_upgrade中更好的大对象迁移。其他增强功能包括Memoize节点的EXPLAIN改进、整数类型的btree_gin比较运算符、非阻塞域约束验证、CHECKPOINT命令参数、COPY FROM行跳过功能，以及通过pg_dsm_registry_allocations进行动态共享内存使用跟踪。

`Pavel Luzanov`

### **[从 Postgres 开始，扩展到 Postgres：TimescaleDB 2.25 如何继续改进 Postgres 的扩展方式](https://www.tigerdata.com/blog/start-on-postgres-scale-on-postgres)**
TimescaleDB 2.25为PostgreSQL时序工作负载引入了显著的性能改进。主要增强功能包括基于元数据的聚合查询，通过避免数据解压缩可提高多达289倍的速度，以及优化的时间过滤查询显示高达50倍的速度提升。该版本通过改进chunk剪枝的约束处理提高了扩展效率，并修复了PostgreSQL 16+上的规划性能回归。实时分析能力通过压缩连续聚合刷新得到增强，减少了I/O开销，并调整了批处理默认值以获得更稳定的性能。其他改进包括更好的规划器稳定性、在保留策略中支持UUIDv7分区的hypertables，以及各种正确性修复。这些变化共同减少了运营开销，同时在数据集和摄取率增长时保持PostgreSQL的简洁性。

`Mike Freedman`



## **热门 Hacker 邮件讨论精选**

### **[提案：使用自动分析阈值的 ANALYZE \(MODIFIED\_STATS\)](https://www.postgresql.org/message-id/CAE2r8H4KRCJ055utU4u+3rBYSgAmiFgMgswaBMN_iOx16iTubQ@mail.gmail.com)**
VASUKI M提议增加一个新的ANALYZE (MODIFIED_STATS)选项，允许手动ANALYZE命令使用与autoanalyze相同的阈值逻辑。该提议旨在仅处理已超过修改阈值的关系，使用现有的analyze_base_threshold和analyze_scale_factor公式。预期用例包括脚本化维护、批量数据加载后的即时分析，以及在对多个关系运行ANALYZE时避免不必要的工作。

Nathan Bossart建议采用更广泛的方法：将autovacuum/autoanalyze优先级代码集中到系统视图中，供vacuumdb使用，而不是添加更多ANALYZE选项。他对具体用例表示不确定，并不完全相信扩展ANALYZE功能的必要性。

David Rowley同意Nathan的系统视图方法，更倾向于此而非添加ANALYZE选项。他建议显示表及其vacuum/analyze评分的视图对脚本用途更有用。他警告说，添加此选项可能导致对VACUUM命令类似选项的请求，造成"一系列问题"。两位审查者都建议在vacuumdb中实现此功能。

参与者:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, nathandbossart@gmail.com, rob@xzilla.net, samimseih@gmail.com, vasukianand0119@gmail.com

### **[AIX 支持](https://www.postgresql.org/message-id/CA+hUKGKuydrE4P=7jnn3Of1ntcrSAA+Vxd8g_KxgJAVO-fjFRQ@mail.gmail.com)**
讨论集中在恢复PostgreSQL对AIX系统的支持上。Tom Lane开发了一系列补丁来解决AIX特定问题，Thomas Munro提供在基础支持建立后协助LLVM集成。一个关键进展是Noah Misch宣布在cfarm111上运行的四个AIX构建场成员将在2026年2月25日前退役，需要替代测试基础设施。

关键技术问题包括rpath配置问题，Aditya Kamath建议在库路径计算中添加"/opt/freeware/lib"，以确保测试用例能在AIX系统上定位开源库。Tom Lane同意这一修改。Peter Eisentraut引用相关线程，这些线程正在开发更通用的静态库处理解决方案，不过Tom Lane指出需要细粒度控制以保持AIX默认安装内部静态库的历史行为。

补丁似乎进展顺利，大部分核心功能已恢复，尽管一些组件如plpython和LLVM集成在基础稳固后需要进一步工作。

参与者:
aditya.kamath1@ibm.com, andres@anarazel.de, hlinnaka@iki.fi, michael@paquier.xyz, noah@leadboat.com, peter@eisentraut.org, postgres-ibm-aix@wwpdl.vnet.ibm.com, robertmhaas@gmail.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com, tristan@partin.io

### **[从 pg\_proc\.dat 生成函数默认设置](https://www.postgresql.org/message-id/1288023.1771292185@sss.pgh.pa.us)**
Tom Lane提交了一个草案补丁，用于改进PostgreSQL在引导初始化期间生成函数默认设置的方式。该补丁允许pg_proc.dat直接指定函数参数默认值，而不需要在system_functions.sql中使用单独的CREATE OR REPLACE语句。实现在引导后端中添加了对pg_node_tree值的特殊处理，将文本数组转换为proargdefaults条目的适当Const节点。

Andres Freund提供了详细的代码审查反馈，建议改进如使用cstring数组而不是text数组，添加错误上下文信息，以及整合类型元数据检索。Tom Lane在v2补丁中解决了这些建议，并清理了引导代码中未使用的TypInfo条目。

Corey Huinker最初建议采用更类似SQL的方法，但Tom Lane认为这会不必要地复杂化解析器。Andrew Dunstan赞扬了最终方法的合理性，指出它很好地处理了常见情况，同时通过现有机制保持不常见情况的可管理性。该补丁旨在覆盖引导期间90%的函数默认参数需求。

参与者:
alvherre@kurilemu.de, andres@anarazel.de, andrew@dunslane.net, corey.huinker@gmail.com, tgl@sss.pgh.pa.us

### **[索引预取](https://www.postgresql.org/message-id/CAE8JnxOacD1bKB-rKeSC1ThHKevuYa5NtU7ksNQVqxiTgar_rg@mail.gmail.com)**
讨论集中在PostgreSQL索引预取的性能问题上，特别是yielding机制如何干扰有效的预读。Andres Freund演示频繁的yields阻止io_combine_limit大小的IO形成，严重限制并发IO并导致显著的性能下降。在一个测试中，禁用yields将执行时间从10.2秒改善到5.6秒。Peter Geoghegan承认当前的启发式算法过于保守，但认为yields对于防止带有LIMIT子句或merge join的查询中的过度工作是必要的。Alexandre Felipe提供了距离振荡模式的详细分析，并提出缓冲区重排序解决方案。Tomas Vondra建议逐步提高批次距离阈值，而不是将其固定在2。小组讨论测量未消费的IO，并使用dm_delay测试更高延迟的存储，以更好地理解预读效果。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[在bgworkers中为SIGTERM使用标准die\(\)处理程序](https://www.postgresql.org/message-id/5238fe45-e486-4c62-a7f3-c7d8d416e812@iki.fi)**
Heikki Linnakangas提议将后台工作进程中的自定义bgworker_die() SIGTERM处理程序替换为标准的die()处理程序。当前的bgworker_die()实现不安全，因为它在信号处理程序中执行内存分配和其他非异步信号安全操作，可能导致死锁或数据损坏。Andres Freund确认这一直是后台工作进程中的长期安全问题。Nathan Bossart同意该补丁看起来合理，并提议使用现有的wrapper_handler机制创建检测信号处理程序中不安全操作的工具。该更改包括更新的文档，代表了PostgreSQL后台工作进程向更安全信号处理实践的转变。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, nathandbossart@gmail.com

### **[POC: 小心地在没有身份验证的情况下暴露信息](https://www.postgresql.org/message-id/CAKAnmmJUGidY7cjD0rHtNVisQksy3u1KszHXkMCNPWYhMKPEvw@mail.gmail.com)**
Greg Sabino Mullane提交了一个重新基于主分支的补丁，该补丁可在不进行身份验证的情况下通过类似HTTP的端点公开特定的PostgreSQL信息。该补丁添加了三个GUC参数（expose_recovery、expose_sysid、expose_version），并在后端初始化过程的早期阶段处理对/replica、/sysid和/version端点的GET/HEAD请求。主要更改包括在测试中使用IO::Socket::INET以及允许不区分大小写的调用。

Andres Freund提供了详细反馈，提出了几个关注点：补丁在提交消息中需要更好的理由说明，缺乏对TLS连接的考虑，由于未经身份验证的明文通信容易受到中间人攻击而存在安全风险，并且可能存在阻塞套接字问题，因为套接字在早期初始化期间处于阻塞模式。Freund还建议将三个独立的GUC参数合并为一个逗号分隔列表参数，并质疑在与正常客户端连接相同的套接字上公开此信息是否明智。

参与者:
ah@cybertec.at, andres@anarazel.de, htamfids@gmail.com, tgl@sss.pgh.pa.us

### **[\[WIP\]垂直聚集索引（列存储扩展）\- take2](https://www.postgresql.org/message-id/TYWPR01MB8901CEA325DDC1F6B4B2489FEA6DA@TYWPR01MB8901.jpnprd01.prod.outlook.com)**
讨论集中在Vertical Clustered Index (VCI)列存储扩展的实现上。Timur Magomedov称赞了VCI的用户API，指出它允许为特定列而非整个表创建列存储，使用清晰的SQL语法且无需修改查询。他还强调了VCI使用IAM和heapam.c中自制钩子的定制Change Data Capture方法，建议可以将这些CDC组件分离成独立补丁以供更广泛使用。Aya Iwata同意如果实现问题能够解决，基于IAM的方法可能更可取，并要求提供更多关于有用钩子功能的详细信息。然而，Álvaro Herrera强烈反对基于钩子的方法，认为如果VCI集成到后端核心中，它不应该需要钩子，而应该是后端的原生部分。他将接受带钩子的独立CDC补丁的可能性评为"非常接近零"，警告接受钩子会阻止适当的后端集成。

参与者:
alvherre@kurilemu.de, iwata.aya@fujitsu.com, japinli@hotmail.com, kuroda.hayato@fujitsu.com, o.alexandre.felipe@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, t.magomedov@postgrespro.ru, tomas@vondra.me

### **[生成代码覆盖率报告时遇到问题](https://www.postgresql.org/message-id/202602171700.7764hluoeh23@alvherre.pgsql)**
Álvaro Herrera 报告在多次尝试后成功解决了 PostgreSQL 代码覆盖率报告生成问题。解决方案涉及使用特定的 LCOVFLAGS 和 GENHTML_FLAGS 参数来忽略运行 make coverage-html 时的各种 lcov 错误（usage、unmapped、corrupt、inconsistent、range）。主要发现包括：必须将标志作为 make 参数而不是环境变量传递，--legend 选项会导致 lcov 失败，删除 .lcovrc 文件并未自动启用分支覆盖率。最初的 CSS 显示问题在缓存过期后得到解决，恢复了覆盖率报告中的正确行着色。工作命令忽略了多个 lcov 工具错误，Herrera 认为这是有问题的，但在 lcov 工具修复以正确处理 PostgreSQL 源代码树之前是必要的。

参与者:
aleksander@timescale.com, alvherre@kurilemu.de, michael@paquier.xyz, pg@bowt.ie, stefan@kaltenbrunner.cc, tgl@sss.pgh.pa.us

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CALDaNm11LKbC2epEyHOvD6H_ONqLqhDQk7sXWwcneyhrTbFaTw@mail.gmail.com)**
本讨论继续对"FOR ALL TABLES ... EXCEPT TABLE"发布功能补丁的持续审查。Vignesh C针对审查者David G. Johnston、Dilip Kumar和Shveta Malik对v44/v45补丁的反馈进行了回应。讨论的关键问题包括文档清晰度，特别是关于表被EXCEPT发布"覆盖"的混乱表述、函数命名一致性和代码结构改进。David建议为复杂的分区继承场景提供更好的措辞，并删除关于行过滤器的冗余解释。Shveta对publication_has_any_exception()中的索引使用、syscache搜索中except标志的正确处理提出担忧，并建议整合相关函数如is_relid_or_ancestor_published()。她还识别出临时/非日志表错误消息以及使用多个EXCEPT发布创建订阅时的问题。讨论突出了对正确分区处理、内存上下文管理以及在CreatePublication()中保持发布类型间清晰分离所需的持续改进。多次迭代显示了为最终确定这一逻辑复制增强功能而进行的积极协作。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[改进 pg\_sync\_replication\_slots\(\) 以等待主服务器推进](https://www.postgresql.org/message-id/CAJpy0uAO=VNKc2q5FgqMKx-u-zb8hikjXQqqkTCUDAtAgbmbSA@mail.gmail.com)**
讨论重点是对pg_sync_replication_slots()函数的改进，特别是解决最坏情况下无限重试的问题。Amit Kapila担心剩余补丁可能导致无限重试，当插槽因各种问题（如物理复制延迟、插槽失效或不同插槽间的时序问题）而无法同步时。Shveta malik承认这种风险存在，但质疑用户是否更希望API快速完成但可能有未同步的插槽，还是等待更长时间以确保正确同步，特别是对于计划的故障转移。然而，Amit论证说，由于API无法保证在一次调用中同步所有插槽（可能会遗漏新创建的插槽），冒无限等待的风险是不合理的。双方都同意基于用户反馈扩展API并添加额外参数会更好。他们还同意一个具体的代码更改，通过在通过API重试插槽同步时将ereport从ERROR级别改为LOG级别来改进错误报告。讨论正在等待Hou-San对提议更改的意见。

参与者:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com



## **行业新闻**

### **[Apple 据报道正在开发三款AI可穿戴设备](https://techcrunch.com/2026/02/17/apple-is-reportedly-cooking-up-a-trio-of-ai-wearables?utm_campaign=daily_pm)**
据报道，苹果正在开发多款支持人工智能的可穿戴设备，这家iPhone制造商正在进入竞争激烈的AI硬件市场。苹果有多个智能产品处于不同的开发阶段，这标志着Apple向AI可穿戴设备的战略扩张。随着AI硬件领域竞争日益激烈，各公司正在竞相创造整合人工智能能力的消费设备，这一举措应运而生。这些AI可穿戴设备的开发代表了Apple在不断发展的技术环境中保持其地位的努力，同时利用其在消费电子产品和生态系统整合方面的专业知识。

### **[Anthropic 发布 Sonnet 4.6](https://techcrunch.com/2026/02/17/anthropic-releases-sonnet-4-6?utm_campaign=daily_pm)**
Anthropic发布了其中型Claude Sonnet AI模型的新版本，命名为Sonnet 4.6。此次发布维持了该公司为其AI模型改进建立的四个月更新周期。这次更新代表了Anthropic对推进其AI能力的持续承诺，并在快速发展的人工智能市场中保持竞争力。Sonnet 4.6是Anthropic的Claude模型家族的一部分，该家族是该公司的旗舰AI产品。定期更新展示了Anthropic通过迭代开发周期改进AI性能和能力的系统性方法。

### **[随着AI担忧冲击IT股票，Infosys与Anthropic合作打造"企业级" AI代理](https://techcrunch.com/2026/02/17/as-ai-jitters-rattle-it-stocks-infosys-partners-with-anthropic-to-build-enterprise-grade-ai-agents?utm_campaign=daily_pm)**
Infosys宣布与Anthropic建立战略合作伙伴关系，开发企业级AI代理，将Anthropic的Claude模型集成到Infosys的Topaz AI平台中。此次合作旨在构建为企业使用而设计的复杂"代理"系统。这一合作伙伴关系出现在AI担忧导致IT行业股票波动的时期，突显了AI市场中的机遇和不确定性。通过这种整合，Infosys计划利用Anthropic的先进语言模型来创建更有能力的AI代理，这些代理可以为企业客户处理复杂的业务流程和决策任务。