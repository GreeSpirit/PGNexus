# PostgreSQL 每日更新#71 2026-03-04



## **技术博客**

### **[Autobase 2.6.0 发布](https://www.postgresql.org/about/news/autobase-260-released-3250/)**
Autobase 2.6.0 引入了蓝绿部署工作流程，可实现 PostgreSQL 升级的近零停机时间。该流程包括使用 Patroni 备用集群部署克隆集群，通过物理复制同步数据，在目标集群上自动升级 PostgreSQL，将其转换为逻辑副本，并在切换前持续接收实时变更。流量切换在几秒内完成，回滚同样快速且无数据丢失，通过反向逻辑复制实现。Autobase 是云托管数据库的开源替代方案，可自动化部署、故障转移、备份、升级和扩展，为高可用性 PostgreSQL 集群提供支持。

`www.postgresql.org`

### **[MarketReader 如何使用 TimescaleDB 处理每分钟 3M 笔交易以提供美国市场交易洞察](https://www.tigerdata.com/blog/how-marketreader-processes-3m-trades-min-deliver-us-market-trading-insights-timescaledb)**
MarketReader是一家金融科技初创公司，使用TimescaleDB每分钟处理300万笔来自美国股票市场的交易，提供实时市场洞察。该公司从NASDAQ获取数据，涵盖26000只上市和OTC证券，通过API和WebSocket每十分钟向客户提供700次更新。他们的架构使用Tiger Data的TimescaleDB进行时间序列分析，结合hypertables实现自动分区、continuous aggregates进行统计分析，以及通过pgvector实现向量搜索功能。该系统实时检测异常市场波动，为大型语言模型提供上下文以生成市场解释，服务于包括零售券商和机构投资者在内的客户。

`Nicole Bahr`

### **[INSERT ... ON CONFLICT ... DO SELECT: PostgreSQL v19 中的新功能](https://www.cybertec-postgresql.com/en/insert-on-conflict-do-select-a-new-feature-in-postgresql-v19/)**
PostgreSQL v19引入了INSERT ... ON CONFLICT ... DO SELECT，这是现有ON CONFLICT子句的新变体。此功能允许带有RETURNING的INSERT语句在发生冲突时选择现有行，而不仅仅是什么都不做或更新。语法支持可选的行锁定和WHERE条件。当表具有生成列、触发器或修改插入值的数据类型时，此功能特别有用，因为它消除了需要单独的SELECT语句来从冲突行检索ID或其他生成值的需求。该功能补充了现有的DO NOTHING和DO UPDATE选项，提供了完整的upsert解决方案，避免了MERGE语句可能出现的竞态条件。

`Laurenz Albe`

### **[Pg_QoS v1.0.0 稳定版已发布！](https://www.postgresql.org/about/news/pg_qos-v100-stable-release-is-out-3251/)**
Pg_QoS v1.0.0，一个用于PostgreSQL服务质量资源治理的扩展，已发布稳定版本。该扩展使管理员能够通过ALTER ROLE/DATABASE SET命令执行按角色和按数据库的限制。主要功能包括通过将后端绑定到特定核心来限制CPU使用，并为并行工作进程提供规划器集成，跟踪和限制并发事务与语句，work_mem会话限制，以及使用共享epoch机制的快速缓存失效。这有助于在同一PostgreSQL实例上运行的不同工作负载之间实现公平的资源分配。该扩展需要PostgreSQL 15或更高版本，CPU限制功能需要Linux。原生软件包适用于Debian 13、Ubuntu 24.04、RHEL 10、AlmaLinux 10和CentOS Stream 10，覆盖所有支持的PostgreSQL版本。

`www.postgresql.org`



## **热门 Hacker 邮件讨论精选**

### **[不要在读取流中同步等待已进行中的 IO](https://www.postgresql.org/message-id/CAAKRu_ZM1epxTdt2=4-g4ff6UC09zne+0xg_gNv3d7LEcxEvNA@mail.gmail.com)**
Melanie Plageman正在开发一个补丁来改进读取流行为，通过不同步等待已在进行中的IO操作。讨论重点是代码审查反馈和测试改进。Nazir Bilal Yavuz发现了一个错误，测试总是使用'worker' io_method而不是预期的方法变量。Peter Geoghegan建议将ProcessBufferHit设为内联函数以提升性能，特别是对于缓存的仅索引扫描。Melanie在补丁v4中解决了这些问题，根据反馈将ProcessBufferHit重命名为TrackBufferHit。她还审查了Andres的测试补丁，并对重复块和外部IO场景的测试用例提供了详细评论。关于是否应该将一些测试代码从test_aio.c移到test_read_stream.c的问题仍待解决，因为外部IO测试可能更多是关于AIO行为而非读取流功能。

参与者:
andres@anarazel.de, byavuz81@gmail.com, melanieplageman@gmail.com, pg@bowt.ie, thomas.munro@gmail.com, tv@fuzzy.cz

### **[pg\_plan\_advice（现在带有透明SQL计划性能覆盖 \- pg\_stash\_advice）](https://www.postgresql.org/message-id/CAKZiRmx=ijCZFpAYMb1z0=9u0iixqD6cBKPBx+WLFFKqOW8R=w@mail.gmail.com)**
Robert Haas发布了pg_plan_advice的第18版，引入了pg_stash_advice——一个新的contrib模块，通过查询ID匹配实现透明的SQL计划性能覆盖。Jakub Wartak提供了广泛的反馈，强调了功能和命名方面的担忧。他成功测试了计划覆盖，但注意到三个模块（pg_plan_advice、pg_collect_advice、pg_stash_advice）在shared_preload_libraries要求和CREATE EXTENSION支持方面存在不一致。关键问题包括pg_collect_advice为相同查询创建重复条目、查询ID匹配限制需要预准备语句，以及pgbench会话中计划更改的延迟生效。Jakub建议更好的查询标准化、基于shared_buffers百分比的内存限制以及替代命名约定。Robert回应称当前设计有意采用模块化方式，允许通过工具包方法使用自定义扩展。他强调功能开发已处于后期阶段，在PostgreSQL 19功能冻结前限制范围扩展。David Johnston添加了关于子计划匹配行为不一致的反馈。

参与者:
alexandra.wang.oss@gmail.com, david.g.johnston@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[修复 multixact Oldest\*MXactId 初始化和访问中的错误](https://www.postgresql.org/message-id/120550bf-ca50-4a07-91b1-a88f1434ee8b@postgrespro.ru)**
讨论跟进了最近推送的一个与OldestMemberMXactId初始化和预备事务处理相关的multixact错误修复。Sami Imseih建议添加一个测试用例来验证对预备事务虚拟进程的正确处理，因为添加的断言不会覆盖这种情况。Yura Sokolov支持为已修复的错误添加测试。Heikki Linnakangas创建了Sami复现案例的简化版本，不需要并发会话，并将其移至主回归测试套件的'prepared_xacts'测试中。Tom Lane建议了一个不相关的改进，通过在禁用预备事务时添加早期退出来减少prepared_xacts_1.out的维护工作。Heikki同意并为此优化提供了补丁，计划将其反向移植到所有支持的版本，以便于将来的测试反向移植。

参与者:
hlinnaka@iki.fi, li.evan.chao@gmail.com, samimseih@gmail.com, tgl@sss.pgh.pa.us, y.sokolov@postgrespro.ru

### **[使用 rdtsc 降低 EXPLAIN ANALYZE 的计时开销？](https://www.postgresql.org/message-id/CAP53Pkw6BuGCig3iDfDkh1MZz_3UqzGb-YAVSKn2r9dQCKYDfw@mail.gmail.com)**
Lukas Fittl提交了RDTSC补丁的v10版本，用于减少EXPLAIN ANALYZE的时序开销。更新版本根据反馈将CPU特性检测移至pg_cpu_x86.c，添加了TSC不变位检查，并通过MSR读取支持HyperV虚拟机管理程序。他修改了默认TSC选择逻辑以匹配Linux内核行为，在4个或更少插槽的系统上当不变位和TSC_ADJUST位被设置时启用TSC。补丁改为使用编译器内建函数处理RDTSC/RDTSCP，避免了使编译时间翻倍的昂贵头文件包含。两个悬而未决的问题仍然存在：为用户实现更好的TSC错误报告，以及RDTSCP是否需要LFENCE指令来确保准确性。Andres Freund对HyperV支持的MSR访问提出了安全担忧，建议从sysfs读取CPU频率等替代方案，尽管Lukas指出在Azure VM上TSC频率与CPU频率不匹配。

参与者:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, johncnaylorls@gmail.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com

### **[消除 xl\_heap\_visible 以减少 WAL（最终设置 VM on\-access）](https://www.postgresql.org/message-id/CAAKRu_a1V7TUUYM7qO2c5Z-JyTKOsrryQBrk7Eu69ESzhqgd9w@mail.gmail.com)**
这个线程讨论了Melanie Plageman的v35补丁系列，用于消除xl_heap_visible WAL记录并实现访问时可见性映射更新。补丁涉及几个关键领域：将常用的剪枝上下文移至PruneState，为已冻结页面添加快速路径，使用GlobalVisState进行页面级可见性确定，在查询执行期间跟踪修改的关系，以及允许访问时剪枝将页面设置为全可见而无需冻结。

Andres Freund提供了关于性能考虑、VM损坏处理和代码结构的详细技术反馈。他质疑VM缓冲区固定的时机，建议通过为冻结页面添加快速路径来改进剪枝性能，并讨论冲突范围计算。讨论涵盖何时检查VM损坏、是否始终跟踪可见性截止点，以及不同扫描类型的优化策略。

Chao Li开始审查v35补丁，重点关注代码组织和Assert语句。Melanie通过重构代码、在heap_page_prune_and_freeze()开始时添加损坏检查、为全可见页面实现快速路径以及始终跟踪最新活跃XID来解决反馈。她在v35-0017中发现了一个严重错误，其中rel_read_only参数逻辑被颠倒了，计划在v36中修复。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, melanieplageman@gmail.com, reshkekirill@gmail.com, robertmhaas@gmail.com, x4mmm@yandex-team.ru, xunengzhou@gmail.com

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAA4eK1+2mL0N8iUdNTr1baO9kJjDZgRGiNTX6cT=ZoBm-m_Lqg@mail.gmail.com)**
讨论重点关注PostgreSQL发布功能中EXCEPT TABLES特性v54补丁的改进。Amit Kapila提出了几个小意见，包括为发布名称分隔符添加翻译注释，质疑变量命名选择，建议将测试文件从037_rep_changes_except_table.pl重命名为037_except.pl以支持未来语法变化，以及要求检查有关ALTER PUBLICATION支持的注释准确性。Shveta Malik同意这些建议并指出了一个语法错误。Nisha Moond发现了一个bug：分区描述错误地显示它们被排除的发布名称，测试代码中使用订阅名称而非发布名称的错误，拼写错误和格式问题。Shlok Kyal回应了所有反馈并发布v55补丁，确认修复了分区显示问题、测试代码更正、拼写错误，并采纳了之前审查者的建议。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[流式复制和WAL归档交互](https://www.postgresql.org/message-id/F02ECB2F-0FA9-432F-8E53-4D1EE9C0E7CA@yandex-team.ru)**
Andrey Borodin 重新提起了一个关于 PostgreSQL 共享归档模式的老讨论，以解决数据中心故障期间 WAL 归档缺失的问题。该问题出现在 HA 设置中，当主服务器故障时 - WAL 文件可能已流式传输到备库但在归档中缺失，导致 1-2% 的集群出现 PITR 时间线缺口。当前的解决方案如 archive_mode=always 配合 WAL-G 等工具由于解密和比较开销而成本高昂。Borodin 提出了一种"共享"归档模式，其中备库保留 WAL 直到归档完成，该方案融合了 Heikki 原始补丁和 Greenplum 工作的思想。三部分补丁集包括带测试的重新基线、时间线切换改进以及 archive_status 目录扫描优化。Jaroslav Novikov 添加了缺失的参考文献以支持讨论。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, masao.fujii@gmail.com, michael.paquier@gmail.com, nag1010@gmail.com, njrslv@yandex-team.ru, nkak@vmware.com, reshkekirill@gmail.com, rkhapov@yandex-team.ru, robertmhaas@gmail.com, root@simply.name, shirisharao@vmware.com, x4mmm@yandex-team.ru

### **[在逻辑复制中确认远程刷新前退出 walsender](https://www.postgresql.org/message-id/6ed7f4ed-aac1-4ce9-a692-7062a4bb07f6@postgrespro.ru)**
该讨论涉及修改PostgreSQL逻辑复制中关于walsender退出时机的提案。原始问题是walsender在退出前等待远程flush确认，这在逻辑复制槽有待处理更改时可能导致pg_upgrade出现问题。Ronan Dunklau建议在pg_upgrade前停止服务需要要么通过切换到wait_flush完全禁用该行为，要么在逻辑复制槽有待处理更改时使升级失败。Andrey Silitskiy同意这种更灵活的方法，并将接口从线程开始讨论的原始实现修改为使用超时机制。已提出更新的补丁来解决这些问题，并在系统升级期间更好地处理逻辑复制槽状态。

参与者:
a.silitskiy@postgrespro.ru, aekorotkov@gmail.com, amit.kapila16@gmail.com, andres@anarazel.de, dilipbalaut@gmail.com, horikyota.ntt@gmail.com, htamfids@gmail.com, kuroda.hayato@fujitsu.com, masao.fujii@gmail.com, michael@paquier.xyz, osumi.takamichi@fujitsu.com, peter.eisentraut@enterprisedb.com, ronan@dunklau.fr, sawada.mshk@gmail.com, smithpb2250@gmail.com, v.davydov@postgrespro.ru

### **[将 COPY \.\.\. ON\_ERROR ignore 改为 ON\_ERROR ignore\_row](https://www.postgresql.org/message-id/5e126dbb-9535-4de4-ad3b-187e475aa6b5@eisentraut.org)**
讨论集中在实现COPY命令的ON_ERROR SET_NULL功能上。Peter Eisentraut对处理域约束时为失败的数据类型转换设置NULL值提供了代码审查反馈。关键技术问题是确保受约束的域在字符串到数据转换期间正确验证NULL值，因为ExecConstraints不处理域约束。Jian He解释说需要额外的InputFunctionCallSafe调用来检查具有CHECK约束的域类型是否允许NULL值。该实现包括当域约束拒绝NULL值时的适当错误消息，并提供关于哪个列和行导致失败的上下文详细信息。在解决了审查意见并澄清了约束验证逻辑后，Peter Eisentraut提交了更改，表明功能实现现已完成。

参与者:
david.g.johnston@gmail.com, jian.universality@gmail.com, jim.jones@uni-muenster.de, masao.fujii@oss.nttdata.com, matheusssilv97@gmail.com, nagata@sraoss.co.jp, peter@eisentraut.org, reshkekirill@gmail.com, sawada.mshk@gmail.com, torikoshia@oss.nttdata.com, vignesh21@gmail.com



## **行业新闻**

### **[Claude Code 推出语音模式功能](https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability?utm_campaign=daily_pm)**
Anthropic宣布在Claude Code中推出语音模式，这标志着AI编程辅助领域的重要进展。这一新功能允许开发者使用语音命令与Claude Code进行交互，通过实现免手操作的编程和调试来提升编程体验。语音功能代表了Anthropic在AI编程领域更有效竞争的努力，该领域的公司正越来越多地致力于让编程工具更加易用和直观。此次推出展现了将语音界面集成到开发工具中的增长趋势，可能会让偏好语音交流而非传统文本交互的开发者提高编程效率。

### **[上个月，仅有三家公司主导了189亿美元的风险投资](https://techcrunch.com/2026/03/03/openai-anthropic-waymo-dominated-189-billion-vc-investments-february-crunchbase-report?utm_campaign=daily_pm)**
根据Crunchbase数据，2026年2月全球风险投资向初创公司投入了创纪录的1890亿美元，其中人工智能公司获得了总资本的压倒性90%。这一巨额资金激增被仅仅三家公司主导：OpenAI、Anthropic和Waymo，它们共同吸收了这些投资的大部分。这种前所未有的风险投资集中度突显了投资者对AI技术和自动驾驶系统的强烈兴趣。数据揭示了初创公司融资格局的极端两极分化，AI公司正在吸引巨额估值，而其他行业从风险投资家那里获得的关注明显较少。

### **[TikTok 在美国部分地区因 Oracle 销售后第二次中断而宕机](https://techcrunch.com/2026/03/03/tiktok-down-for-some-in-u-s-thanks-to-second-oracle-outage-since-sale?utm_campaign=daily_pm)**
由于ByteDance剥离其美国业务后的第二次Oracle基础设施故障，TikTok在美国的部分用户遇到了服务中断。此次故障影响了TikTok的功能，阻止用户正常访问平台。这标志着所有权转移以来第二次重大的Oracle相关服务中断，引发了对新基础设施安排可靠性的质疑。这次中断发生在ByteDance完成TikTok美国业务出售后仅几天，突显了平台向新所有者和基础设施提供商转移过程中潜在的技术挑战。此次故障凸显了运营大规模社交媒体平台所涉及的复杂技术依赖性。