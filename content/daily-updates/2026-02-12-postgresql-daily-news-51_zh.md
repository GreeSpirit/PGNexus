# PostgreSQL 每日更新#51 2026-02-12



## **技术博客**

### **[Neon 计算自动扩展报告](https://neon.com/blog/autoscaling-report-2025)**
Neon发布了2025年自动扩缩容报告，记录了他们的计算自动扩缩容能力和性能指标。该报告深入分析了Neon的无服务器PostgreSQL平台如何根据工作负载需求自动扩缩计算资源。这项分析为考虑无服务器数据库解决方案的PostgreSQL用户提供了有价值的数据，帮助理解自动扩缩容在生产环境中的有效性。

`Andy Hattemer`

### **[六个迹象表明 Postgres 调优无法解决您的性能问题](https://www.tigerdata.com/blog/six-signs-postgres-tuning-wont-fix-performance-problems)**
TigerData博客文章指出了六个警告信号，表明PostgreSQL性能问题源于架构限制而非调优问题。这些工作负载特征包括：连续高频摄入（每秒数千到数十万次插入）、以时间为中心的查询、仅追加数据模式、长期保留周期、延迟敏感查询和持续增长。文章论证当4-5个特征适用时，传统PostgreSQL优化变得无效，因为数据库并非为实时数据分析而设计。示例包括半导体制造遥测、交易平台和物流跟踪。作者建议此类工作负载需要专门构建的时序架构，而非继续进行PostgreSQL调优工作。

`Matty Stratton`



## **热门 Hacker 邮件讨论精选**

### **[AIX 支持](https://www.postgresql.org/message-id/aY49f7A2qtINO5sx@momjian.us)**
PostgreSQL的AIX支持工作面临重大挑战，开发者积极性下降。Bruce Momjian认为开发工作可能不值得为用户群体付出的价值，引用Robert Haas指出的补丁质量持续低下问题。Tom Lane报告由于在缓慢的AIX硬件上测试困难以及社区开发者缺乏访问decent AIX系统的途径，他零动力继续工作。Srirama Kucherlapati的最新v12补丁相比v11出现回归，导致TOC溢出警告和initdb失败。Aditya Kamath的v4 meson构建补丁在ninja recipe生成时因多个生产者错误而失败。Tom Lane质疑为什么补丁不简单地逆转之前的AIX移除提交。讨论表明所需工作、可用开发者技能和社区价值之间的差距可能太大而无法有效弥合。

参与者:
aditya.kamath1@ibm.com, andres@anarazel.de, bruce@momjian.us, hlinnaka@iki.fi, michael@paquier.xyz, noah@leadboat.com, peter@eisentraut.org, postgres-ibm-aix@wwpdl.vnet.ibm.com, robertmhaas@gmail.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, tristan@partin.io

### **[pg\_upgrade：尽可能传输 pg\_largeobject\_metadata 的文件](https://www.postgresql.org/message-id/aY4yerlBoVSb1OId@nathan)**
Nathan Bossart正在开发一个补丁，用于在从PostgreSQL v12之前版本进行二进制升级时允许COPY pg_largeobject_metadata。问题源于getTableAttrs()在较旧版本上不能获取OID列。Nathan的解决方案涉及修改pg_dump，在处理v12之前版本的二进制升级模式时，对pg_largeobject_metadata使用COPY (SELECT ...) TO而不是简单的COPY。Andres Freund积极评价了这个补丁，但建议使用COPY WITH OIDS作为替代方法，以避免在属性列表中处理OID列时的一些复杂性。然而，Nathan发现使用WITH OIDS仍然需要类似程度的修改来正确处理列列表。Nathan计划在未来几天内提交补丁，除非有异议，因为他认为这些更改并不存在争议。

参与者:
andres@anarazel.de, hannuk@google.com, michael@paquier.xyz, nathandbossart@gmail.com, nitinmotiani@google.com, tgl@sss.pgh.pa.us

### **[使用 SIMD 加速 COPY TO 文本/CSV 解析](https://www.postgresql.org/message-id/CA+K2Runi_H2CBL0yMm3De2KqcR9RMA0HK5cLJjEhoNszC7myeg@mail.gmail.com)**
KAZAR Ayoub提议使用SIMD指令优化PostgreSQL的COPY TO性能，延续了COPY FROM的类似工作。该补丁使用SIMD快速跳过数据直到找到特殊字符，然后回退到标量处理。Manni Wood的基准测试显示了令人印象深刻的结果：没有特殊字符的文本格式提速43.9%，CSV格式提速50.9%，当存在特殊字符时回归很小（0.8%或更少）。然而，Andres Freund对该方法提出了担忧，质疑添加strlen()调用是否不会对短列产生可测量的开销，特别是在为转义字符重复调用时。他还批评了代码重复，建议在引入SIMD优化之前先将现有代码重构为辅助函数。

参与者:
andres@anarazel.de, andrew@dunslane.net, byavuz81@gmail.com, ma_kazar@esi.dz, manni.wood@enterprisedb.com, markwkm@gmail.com, nathandbossart@gmail.com, neil.conway@gmail.com, shinya11.kato@gmail.com

### **[bufmgr\.c 中 errmsg\_internal 的奇异用法](https://www.postgresql.org/message-id/0C78B2B4-DBCF-4DA5-B999-EC1DA6459CB9@gmail.com)**
Chao Li在bufmgr.c中发现了errmsg_internal()的不一致使用，其中已翻译的字符串被传递给专门用于不可翻译内部消息的函数。然而，Tom Lane和Andres Freund澄清这种模式是有意的，以避免重复翻译。讨论演变为关于缓冲区错误报告实现的代码质量辩论。Tom Lane提议重构代码，使用标准的errmsg()调用，而不是当前将格式字符串定义与使用分离的方法，认为这样更易维护并提供更好的编译器检查。他的补丁消除了复杂的基于变量的消息处理，改为直接使用ereport()调用。Andres Freund不同意，认为尽管减少了代码重复，但提议的更改更难阅读。Álvaro Herrera和Zsolt Parragi探索了平衡可读性和可维护性的替代方法。关于最佳重构方法，该讨论仍未解决。

参与者:
alvherre@kurilemu.de, andres@anarazel.de, li.evan.chao@gmail.com, tgl@sss.pgh.pa.us, zsolt.parragi@percona.com

### **[不重启修改 shared\_buffers](https://www.postgresql.org/message-id/CAKZiRmxfT7n0whHkLqtPkyUq_coH=UYP9fQ3V6Xv+2bug-XJSw@mail.gmail.com)**
讨论集中在实现无需重启PostgreSQL即可动态调整shared_buffers的功能上。Jakub Wartak报告了在测试Ashutosh Bapat补丁中huge pages支持时发现的问题，确定了三个主要问题：huge page计算错误、缺少munmap()调用导致内存分配失败，以及huge_pages设置的不当回退逻辑。Andres Freund反对多重内存映射方法，倾向于使用单一映射配合MADV_REMOVE，以便在调整相关分配（如缓冲区描述符和同步请求队列）时获得更好的灵活性。他建议这将简化基础设施并更好地支持未来的可扩展性。此外，Heikki Linnakangas提议重新设计共享内存初始化接口，使用ShmemStructDesc来整合大小计算和初始化函数，可能消除多个子系统列表并改善扩展支持。对话揭示了关于实现方法的持续架构辩论。

参与者:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, jakub.wartak@enterprisedb.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[更改 PostgreSQL 块大小后的回归故障](https://www.postgresql.org/message-id/54d9a790-9da1-490f-9e44-8e76bb60aa9b@Spark)**
讨论围绕PostgreSQL使用非默认块大小(32KB而非8KB)编译时出现回归测试失败的问题展开。Yasir报告了使用--with-blocksize=32配置后出现大量测试失败。来自HashData的Zhang Mingli确认这是预期行为，解释说Greenplum和Apache Cloudberry默认使用32KB块。这些失败通常反映无害的输出变化，如缓冲区计数和成本估算，而非功能性错误，但每个案例都应单独检查。Tom Lane引用了关于规划器参数变化时预期测试差异的文档。Yasir建议为不同块大小添加替代测试输出文件，但Andres Freund和Álvaro Herrera都拒绝了这种方法，理由是维护负担以及需要所有开发者测试多种配置。Álvaro建议使用SET命令禁用特定计划类型的精确干预可能更可接受，但仍难以获得审查。

参与者:
alvherre@kurilemu.de, andres@anarazel.de, tgl@sss.pgh.pa.us, thomas.munro@gmail.com, yasir.hussain.shah@gmail.com, zmlpostgres@gmail.com

### **[pg\_plan\_advice查询计划建议](https://www.postgresql.org/message-id/CABRHmyuOhEjPSpej424UyridA9_knDcBEyL3_BVB1u=yDSOTKw@mail.gmail.com)**
Ajay Pal报告了pg_plan_advice的一个问题，当PostgreSQL的遗传算法(GEQO)用于查询优化时，JOIN_ORDER建议会失败。当对12个或更多表的查询启用GEQO时，遗传算法的随机性阻止它考虑建议中请求的特定连接路径，导致"matched, failed"状态。Robert Haas回应说这种行为是预期的而不是错误。他解释说GEQO固有的随机性可能阻止它探索用户指定的路径，遇到此问题的用户有几个选项：禁用GEQO、使用不太严格的计划建议，或者接受在使用遗传优化时可能出现这种结果。讨论澄清了这是将确定性计划建议与非确定性优化算法结合使用的局限性。

参与者:
ajay.pal.k@gmail.com, alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[使用 rdtsc 降低 EXPLAIN ANALYZE 的时序开销？](https://www.postgresql.org/message-id/CAP53PkxAtD_ArzxaXPMgAKTfT5Da34o-oN9JY32UbhFS3U=-6A@mail.gmail.com)**
Lukas Fittl分享了第六版补丁系列，旨在通过在x86-64上使用RDTSC来减少EXPLAIN ANALYZE的计时开销。主要变更包括将GUC重命名为"timing_clock_source"，提供三个选项："auto"（在Linux上如果可用则使用TSC）、"system"（强制使用系统API）和"tsc"（强制使用RDTSC/RDTSCP）。补丁统一了Windows QueryPerformanceCounter实现与TSC，引入了pg_ticks_to_ns函数，并在Windows上明确设置时启用TSC。显示钩子在选择"auto"时显示当前时钟源。pg_test_timing工具现在显示RDTSC和RDTSCP计时以及系统时钟源。然而，pg_ticks_to_ns函数引入了开销，使主分支上的计时从23.54ns减慢到25.74ns，Lukas寻求优化建议。

参与者:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com

### **[缓冲区锁定很特殊（提示、校验和、AIO 写入）](https://www.postgresql.org/message-id/196082.1770892568@localhost)**
讨论的核心是重构 IsMVCCSnapshot 函数，这是缓冲区锁定改进的一部分。Andres Freund 提议将 IsMVCCSnapshot 拆分为两个函数：只接受 SNAPSHOT_MVCC 的 IsMVCCSnapshot() 和同时接受 SNAPSHOT_MVCC 和 SNAPSHOT_HISTORIC_MVCC 快照类型的 IsMVCCLikeSnapshot()。这个更改需要审查原始函数的所有现有调用者，Freund 估计只有大约一半应该保持不变。Antonin Houska 回应并提供了一个实现这个提议重构的补丁。这个更改似乎是改进缓冲区锁定机制的更大努力的一部分，特别是解决在提示、校验和和异步 I/O 写入环境中如何处理不同快照类型的问题。

参与者:
ah@cybertec.at, andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[改进 pg\_sync\_replication\_slots\(\) 以等待主节点推进](https://www.postgresql.org/message-id/CAJpy0uCnLcHt5o09q6Rc2MhATQZrZfEO7u1pzs=tBZoyr-cgpw@mail.gmail.com)**
讨论重点围绕改进pg_sync_replication_slots()功能，特别是处理本地复制槽失效的情况。Shveta Malik提出了一个问题：当只有本地槽失效而远程槽仍然有效时，函数是否应该等待并重试同步。她认为由于slot-sync可以通过drop_local_obsolete_slots()内部删除失效的本地槽，因此在这种情况下设置slotsync_pending=true可能是有益的，以确保在后续运行中进行正确的同步。这样可以防止有效的远程槽在故障转移后变为无效的情况。Zhijie Hou同意这种方法并提供了解决该问题的更新补丁。Amit Kapila随后推送了前两个重构补丁，并要求对剩余的补丁进行相应的变基。

参与者:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com

### **[跳过发布中的模式更改](https://www.postgresql.org/message-id/CANhcyEVB6XkVQ4YYN3x+P5NeG=tOWg-OWebGiqMp02XXMVUa6A@mail.gmail.com)**
讨论围绕PostgreSQL发布中实现模式更改跳转的补丁(v43)展开。David G. Johnston对`check_publications_except_list`函数提供了详细的代码审查反馈，指出"SELECT DISTINCT"子句是不必要的，因为发布名称在数据库中是唯一的，并建议在只有一个发布存在时进行早期退出优化。Shlok Kyal确认在v43中已解决评论，并提到重构了`pg_get_publication_effective_tables`并改进了文档。Johnston的后续审查建议重构早期退出、重命名变量以保持一致性(exclusion vs exception术语)、在错误消息中避免三重否定，并重新考虑函数名`pg_get_publication_effective_tables`以更好地反映其对多个发布的操作。补丁似乎正在通过迭代审查周期推进，重点关注代码清晰度和优化。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[流式复制和 WAL 归档交互](https://www.postgresql.org/message-id/D4B53AE3-B7AF-4BE6-9CB6-44956B05DE72@yandex-team.ru)**
Andrey Borodin重新讨论了一个关于流复制和WAL归档交互的10年前话题，特别引用了Heikki Linnakangas关于"共享"归档模式的补丁。讨论聚焦于PostgreSQL高可用性设置中的一个关键问题，即数据中心故障导致1-2%的集群在其PITR时间线中出现空隙。当主服务器丢失时，尽管WAL文件已流传输到备用服务器，但归档中可能缺少某些WAL文件，因为像PGConsul和Patroni这样的HA工具尝试重新归档，但WAL文件可能已被删除。Borodin提出共享归档模式（备用服务器保留WAL直到归档完成）比archive_mode=always更有效地解决了这个问题。他对Heikki的原始补丁进行了改进，包含三个方面：重新基于当前版本并添加测试、正确处理时间线切换，以及避免代价高昂的目录扫描。该解决方案旨在在PostgreSQL内部处理分布式归档协调，而不需要外部工具。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, masao.fujii@gmail.com, michael.paquier@gmail.com, nag1010@gmail.com, nkak@vmware.com, reshkekirill@gmail.com, rkhapov@yandex-team.ru, robertmhaas@gmail.com, root@simply.name, shirisharao@vmware.com, x4mmm@yandex-team.ru



## **行业新闻**

### **[Spotify 表示其最优秀的开发者自 12 月以来都没有写过一行代码，这要归功于 AI](https://techcrunch.com/2026/02/12/spotify-says-its-best-developers-havent-written-a-line-of-code-since-december-thanks-to-ai)**
Spotify 将其开发速度的显著提升归功于 Claude Code 和其内部 AI 系统 Honk。据该公司称，其最高效的开发人员自12月以来就没有手动编写过代码，完全依赖 AI 辅助。这代表了这家流媒体巨头在软件开发方法上的重大转变，AI 工具负责实际的代码生成，而开发人员则专注于更高层次的任务和系统设计。这一发展展示了 AI 编程助手日益成熟以及它们在主要科技公司中的实际应用。

### **[OpenAI 的 Codex 新版本由一款新的专用芯片驱动](https://techcrunch.com/2026/02/12/a-new-version-of-openais-codex-is-powered-by-a-new-dedicated-chip)**
OpenAI 发布了其 Codex 编程工具的更新版本，该版本运行在专用硬件上。该公司将这一新的编程工具描述为与一家未具名芯片制造商合作关系中的"第一个里程碑"。这款专用芯片专门设计用于优化 AI 代码生成任务，与通用处理器相比，可能提供更好的性能和效率。这一发展代表了 OpenAI 向定制硅解决方案的转变，以增强其 AI 工具的能力，这也遵循了主要 AI 公司开发针对其特定计算需求的硬件的趋势。

### **[Anthropic 再融资30B美元进行G轮融资，估值达380B美元](https://techcrunch.com/2026/02/12/anthropic-raises-another-30-billion-in-series-g-with-a-new-value-of-380-billion)**
Anthropic 获得了300亿美元的 G 轮融资，使其估值达到3800亿美元。这轮大规模融资发生在这家 AI 初创公司与 OpenAI 争夺客户和市场主导地位之际。这项巨额投资反映了 AI 领域的激烈竞争以及开发先进 AI 系统的巨大资本需求。这笔资金可能将用于增强 Anthropic 的 AI 能力，扩展其基础设施，并在快速发展的人工智能市场中更有效地竞争。这一估值使 Anthropic 成为全球最有价值的 AI 公司之一。