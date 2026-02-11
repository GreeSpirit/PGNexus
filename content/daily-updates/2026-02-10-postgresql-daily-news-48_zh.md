# PostgreSQL 每日更新#48 2026-02-10



## **技术博客**

### **[Elasticsearch's Hybrid Search, Now in Postgres (BM25 + Vector + RRF)](https://www.tigerdata.com/blog/elasticsearchs-hybrid-search-now-in-postgres-bm25-vector-rrf)**
TigerData演示了如何在PostgreSQL中直接实现Elasticsearch风格的混合搜索，使用BM25关键词搜索、向量嵌入和Reciprocal Rank Fusion (RRF)。该方法结合了pg_textsearch进行BM25排名、pgvectorscale进行高性能向量搜索，以及基于SQL的RRF来合并排序结果。这消除了传统的Postgres到Elasticsearch管道，在保持搜索质量的同时降低了基础设施复杂性。pgai扩展在数据变化时自动生成和同步嵌入，无需单独的同步作业。该实现使用SQL函数，可以根据查询类型加权以偏向关键词或语义搜索，为混合搜索工作负载提供单数据库解决方案。

`Raja Rao DV`

### **[Overcoming Single-Vendor Trap: Why True Open Source is the Best Path to Data Sovereignty](https://enterprisedb.com/blog/overcoming-single-vendor-trap-why-true-open-source-best-path-data-sovereignty)**
EnterpriseDB认为许多开源数据库如MySQL正陷入"单一供应商陷阱"，企业所有权限制了战略自由度、发展路线图和部署选择。文章将此与PostgreSQL的开发模式进行对比，表明真正的开源能提供更好的数据主权。该文章强调企业对基础技术的控制如何限制用户选择和创新，将社区驱动的开发定位为维护技术独立性和避免供应商锁定的优越方法。

`enterprisedb.com`



## **热门 Hacker 邮件讨论精选**

### **[Add expressions to pg\_restore\_extended\_stats\(\)](https://www.postgresql.org/message-id/aYmCUx9VvrKiZQLL@paquier.xyz)**
Michael Paquier审查了Corey Huinker为pg_restore_extended_stats()添加表达式支持的补丁。他发现了几个未覆盖的测试案例和边界条件，包括处理非字符串/非空值和各种可能触发断言的JSON输入场景。Paquier修复了这些问题，添加了全面的测试，并在他的修改版本中解决了样式问题。他要求Huinker恢复之前提出的一个测试，该测试在数据库间复制表达式统计信息并检查差异。此外，Paquier建议通过首先在pg_stats_ext_exprs视图中暴露STATISTIC_KIND_RANGE_LENGTH_HISTOGRAM和STATISTIC_KIND_BOUNDS_HISTOGRAM案例，然后扩展恢复函数来处理这些情况。Huinker同意了这些建议并提供了补丁系列：原始v8补丁、构建修复、恢复的差异测试、在pg_stats_ext_exprs中暴露范围统计信息，以及范围统计信息导入支持。

参与者:
corey.huinker@gmail.com, li.evan.chao@gmail.com, michael@paquier.xyz, tndrwang@gmail.com, tomas@vondra.me

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAGECzQTWj+D=tNopj6qMzpP6g46P95Wd6LSrFjZEfB20tzQU-g@mail.gmail.com)**
Jacob Champion已提交了将libpq协议版本提升到3.2的补丁，剩下一个关于指导用户解决grease相关错误的TODO项目。Champion提出v7补丁，为libpq grease错误添加错误说明和文档链接，指向将包含grease功能说明的PostgreSQL文档。虽然Champion更倾向于使用wiki页面作为URL，但建议将文档链接作为更好的临时解决方案，可以在后续提交中更新。Jelte Fennema-Nio赞同这一改进，建议在显示错误说明时更加宽松，可能在硬连接关闭或错误消息中包含特定关键词时触发，并使用适当谨慎的措辞，因为在这些情况下无法完全确定。

参与者:
andres@anarazel.de, david.g.johnston@gmail.com, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, postgres@jeltef.nl, robertmhaas@gmail.com

### **[index prefetching](https://www.postgresql.org/message-id/CAH2-Wznv9_KGqHQ1vCW2pkiA6QskBGcx5NC_-UXnD6GEQasvAQ@mail.gmail.com)**
Peter Geoghegan发布了索引预取补丁的v10版本，包含两项主要改进。首先，读取流回调函数（heapam_getnext_stream）现在会在关键时刻让出控制权以保持扫描的响应性，这对"ORDER BY ... LIMIT N"查询和合并连接特别有益。这涉及响应性与维持足够预取距离之间的复杂权衡，使用了通过对抗性基准测试得出的启发式算法。其次，新补丁解决了selfuncs.c问题，即VISITED_PAGES_LIMIT与新的table_index_getnext_slot接口不兼容。解决方案为get_actual_variable_range添加了IndexScanDescData.xs_read_extremal_only字段，使nbtree在扫描一个叶页后停止。这种方法应该能解决现有的VISITED_PAGES_LIMIT无效性问题，特别是当许多索引元组设置了LP_DEAD位时。Geoghegan计划启动单独的讨论线程来进一步讨论这些问题。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/CAKZiRmwxVqEbp7JgOed=BCT6cq8RNuHk3N0vuwro65Tsw9E8NA@mail.gmail.com)**
讨论继续围绕一个补丁集进行，该补丁集支持在不重启服务器的情况下动态调整shared_buffers大小。Jakub Wartak测试了这些补丁，以探索它们是否能通过减少fork()开销来提高PostgreSQL的连接可扩展性，但发现结果混杂，在NUMA系统上存在一些性能回归。他发现了几个问题，包括由于初始化期间内存接触导致的启动缓慢、huge pages支持问题，以及内存大小计算中的错误。

Andres Freund澄清说fork()缓慢主要源于库依赖（特别是OpenSSL）而不是shared buffers，并质疑将内存映射延迟到fork()之后的方法。他还质疑使用memfd的多个内存映射的设计选择，认为既然无论如何都必须预先保留最大地址空间，多个映射会增加不必要的复杂性而没有好处。

Ashutosh Bapat提供了一个更新的补丁集，解决了合并冲突并将段减少到两个（主段和缓冲区块）。他解释了当前基于段的架构，并探索了两种可能支持扩展的按需共享内存段方法。

Heikki Linnakangas提出了一个更清洁的API设计，对调用者隐藏段ID，并演示了一个使用ShmemStructDesc描述符的更统一共享内存初始化系统的概念验证。这种方法将用单一注册机制替换当前分散的ShmemSize/ShmemInit函数对，可能支持扩展的可调整大小段。

参与者:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, jakub.wartak@enterprisedb.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/u644ma4erj75z46wckuq3szrlnci3wzlevq7brauk2p3v6h2l7@jkd7siijr7hx)**
这个讨论串涉及PostgreSQL缓冲区锁定机制的改进，特别是关于提示位和校验和的部分。Andres Freund一直在开发补丁来优化缓冲区提示位操作，引入了BufferSetHintBits16()函数用于单个16位值更新。Heikki Linnakangas对函数文档、注释清晰度和实现细节提供了详细的代码审查反馈。讨论涵盖了LSN处理、缓冲区写入竞争条件和适当锁定语义等技术方面。Antonin Houska发现了HeapTupleSatisfiesMVCCBatch()在逻辑解码期间使用历史快照时的问题，并提出了修复方案。Andres建议了一个替代解决方案，将页面批量扫描限制为真正的MVCC快照。Kirill Reshke询问了为涉及页面撕裂的罕见恢复场景创建TAP测试的问题。补丁似乎正在朝着完成方向发展，大部分审查反馈已得到解决。

参与者:
ah@cybertec.at, andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CAK98qZ2RzbgCHrSg4zLkvpzyBam_X6te-KF8w1+_vON9BAVMEw@mail.gmail.com)**
Alexandra Wang 审查了 Robert Haas 为 pg_plan_advice 提交的 v14 补丁集，并批准了补丁 0003-0005。这似乎是 pg_plan_advice 功能持续代码审查过程的一部分。简短的消息表明对补丁系列的特定组件给出了积极反馈，说明开发进展顺利。但是，该消息没有提供这些补丁包含什么内容的详细信息，也没有涉及实现的任何技术方面。没有提出问题或担忧，除了审查过程的隐含延续外，也没有提及具体的下一步行动。

参与者:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[log\_min\_messages per backend type](https://www.postgresql.org/message-id/827C26CA-D7C2-4AD9-AEC3-E1E76519453E@gmail.com)**
log_min_messages按后端类型功能的补丁已被Alvaro Herrera提交，之前整合了Euler Taveira的审查反馈。该功能允许使用逗号分隔的语法为不同的PostgreSQL进程类型配置不同的日志级别，如"default:warning,autovacuum:debug1,backend:info"。Alvaro进行了多项改进，包括将术语从"generic"改为"default"，简化内存管理，使用goto进行错误处理，以及将GUC钩子移动到elog.c。修复了一个关键bug，其中break语句阻止为共享相同类别的进程类型设置级别。Chao Li提出了关于无法通过ALTER SYSTEM轻松修改单个进程类型级别的可用性担忧，但Alvaro指出这个限制之前已讨论过但没有令人满意的解决方案。贡献了小补丁来删除未使用的声明、修复注释错误和按字母顺序排列文档条目。

参与者:
alvherre@alvh.no-ip.org, andres@anarazel.de, euler@eulerto.com, japinli@hotmail.com, li.evan.chao@gmail.com, noriyoshi.shinoda@hpe.com, zengman@halodbtech.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAHut+PsxDe-mVq_6YyhaUCyPUuohZE5dRtf80syP3y_n+Z6Tog@mail.gmail.com)**
讨论围绕在PostgreSQL逻辑复制中组合多个带有EXCEPT子句的发布时如何处理矛盾行为。Shlok Kyal提交了v41补丁来解决表同步问题，但shveta malik发现了一个问题：当订阅具有不同EXCEPT列表和PUBLISH_VIA_PARTITION_ROOT值的多个发布时，表同步和增量同步会复制不同的表集合。Amit Kapila建议禁止矛盾的组合（如pub1: FOR ALL TABLES EXCEPT tab1和pub2: FOR TABLE tab1）以保持简单，并引用了列列表的类似限制。然而，Peter Smith和David G. Johnston不同意，他们认为发布组合应该是纯粹累加的，EXCEPT列表应该是内部简写而不是外部约束。关于是否限制这种组合还是在第一个实现版本中允许累加行为的争论仍在继续。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **行业新闻**

### **[Anthropic closes in on $20B round](https://techcrunch.com/2026/02/09/anthropic-closes-in-on-20b-round)**
据报道，Anthropic即将完成200亿美元的融资轮次，距离其上一轮130亿美元的股权融资仅过去五个月。这家AI公司快速融资的节奏反映了前沿AI实验室之间的激烈竞争以及计算资源持续产生的巨额成本。这轮最新融资将显著提升Anthropic的估值，并为其与OpenAI等其他领先AI公司竞争提供额外资本。连续快速融资轮次表明，AI公司正在优先考虑快速积累资本，以在快速发展的人工智能领域保持竞争地位。

### **[ChatGPT rolls out ads](https://techcrunch.com/2026/02/09/chatgpt-rolls-out-ads)**
OpenAI已正式在ChatGPT中推出广告，尽管去年末测试类似不受欢迎广告的应用建议时曾遭到强烈反对。这家AI公司实施此货币化策略是为了从其热门聊天机器人中产生收入，并覆盖开发AI技术和扩展业务相关的巨额成本。此举代表了OpenAI在用户体验与财务可持续性之间寻求平衡的努力，该公司寻求将其广泛使用的对话AI平台货币化，同时管理运营大型语言模型所需的昂贵基础设施。

### **[Databricks CEO says SaaS isn't dead, but AI will soon make it irrelevant](https://techcrunch.com/2026/02/09/databricks-ceo-says-saas-isnt-dead-but-ai-will-soon-make-it-irrelevant)**
Databricks首席执行官Ali Ghodsi认为，虽然SaaS应用程序并未消亡，但人工智能可能很快会通过催生新的竞争对手使其变得无关紧要。根据Ghodsi的观点，AI不会简单地用"基于感觉编码"的版本取代主要的SaaS应用，而是会促成全新解决方案的创建，这些解决方案可能挑战现有的软件即服务平台。这一观点表明，AI对软件行业的变革性影响可能不是通过直接替换当前工具实现，而是通过实现根本不同的软件开发和部署方法，从而颠覆传统的SaaS模式。