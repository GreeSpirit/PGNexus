# PostgreSQL 每日更新#63 2026-02-24



## **技术博客**

### **[单体镜像的终结：Kubernetes 中使用 PostgreSQL 18 的动态扩展](https://enterprisedb.com/blog/end-monolithic-image-dynamic-extensions-kubernetes-postgresql-18)**
PostgreSQL 18在Kubernetes环境中引入了动态扩展加载功能，消除了重建单体数据库镜像的需要。新的extension_control_path参数与Kubernetes 1.33的ImageVolume功能配合使用，允许CloudNativePG将基于OCI的扩展镜像作为只读卷挂载。像pgvector这样的扩展现在可以按需加载，同时保持PostgreSQL的不可变性。这种方法增强了安全性并减少了运营开销，特别是有利于EDB Postgres AI部署中的AI和向量工作负载。

`enterprisedb.com`



## **热门 Hacker 邮件讨论精选**

### **[运行事务中刷新某些统计信息](https://www.postgresql.org/message-id/CAA5RZ0t1DsB5x_reGAv0AcKdKuF5FTowUx54SLnWkD3w5vH4Lg@mail.gmail.com)**
讨论涉及在长时间运行的事务期间实现自动统计信息刷新，解决统计信息仅在事务边界更新的问题。提议的补丁引入了pgstat_schedule_anytime_update()，要求进程设置超时并策略性地调用此函数。Sami Imseih为该方法辩护，建议对固定统计信息来说很直接，并提议变量统计信息可以在事务空闲时刷新而不使用超时。Michael Paquier对设计复杂性表示担忧，特别是要求所有进程无条件设置SIGALRM处理程序和超时的要求。他建议使用procsignal机制的客户端API会更灵活。Bertrand Drouvot同意自动核心处理，但认为公共API对测试有价值。讨论包括用于测试的injection points技术细节和测试正则表达式模式中需要修复的错误。

参与者:
bertranddrouvot.pg@gmail.com, masao.fujii@gmail.com, michael@paquier.xyz, samimseih@gmail.com, zsolt.parragi@percona.com

### **[使用 rdtsc 减少 EXPLAIN ANALYZE 的计时开销?](https://www.postgresql.org/message-id/41528b05-62be-4a5a-abd8-2af2dd84a1be@gmail.com)**
这个讨论涉及一个补丁，通过在x86-64处理器上使用RDTSC指令而不是clock_gettime()调用来减少EXPLAIN ANALYZE的时序开销。David Geier提交了v8版本，解决了Windows编译问题，修复了Visual C++的__x86_64__检测并更改了头文件包含。该补丁在Windows上显示了显著的性能改进：使用TSC时EXPLAIN ANALYZE时间从2781ms降至2091ms，pg_test_timing开销从27ns降至9.42ns（使用RDTSC）。然而，Andres Freund在Linux上发现了pg_test_timing的小幅回归（从27.7ns增至28.48ns），尽管这在实际EXPLAIN ANALYZE工作负载中不会出现。Andres还提供了详细的代码审查反馈，涵盖头文件组织、溢出处理优化、架构特定代码放置、GUC验证、TSC频率检测逻辑，并建议将一些更改拆分为单独的提交以便更好地审查。

参与者:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com

### **[B树的新访问方法](https://www.postgresql.org/message-id/CAE8JnxOJoWF-ABi5EtsrmBg3FRtmyk+D0Na8=e1vCwMaG1B2Lg@mail.gmail.com)**
Alexandre Felipe正在提议一种新的b-tree访问方法，名为"MERGE-SCAN"，用于优化在索引前导列使用IN条件并在后续列使用ORDER BY的查询。该方法使用k路合并来组合索引段，主要针对社交媒体时间线类型的查询，用户希望看到关注账户的帖子按时间戳排序并设置限制。

性能测试显示显著改进：限制100时，新方法使用13次共享命中，而传统索引扫描需要15,308次，执行时间从3,409毫秒减少到13毫秒。对于更大的限制，它通过避免顺序扫描和位图扫描所需的外部排序来保持更好的性能。

Alexandre正在重新考虑命名，因为与现有MERGE语句冲突，提出了IndexPrefixMerge或TransposedIndexScan等替代方案。讨论包括与GIST索引方法的比较，以及其他贡献者对"时间线视图"用例的认可。关键的未解决问题包括成本估算准确性、规划器集成以及扩展支持多列前缀和非前导列场景。

参与者:
alexandre.felipe@tpro.io, ants.aasma@cybertec.at, michael@paquier.xyz, michal@kleczek.org, o.alexandre.felipe@gmail.com, peter@eisentraut.org, pg@bowt.ie, tgl@sss.pgh.pa.us, tomas@vondra.me

### **[使用pg\_dumpall时，数据库名称在双引号中包含换行符导致"shell command argument contains a newline or carriage return:"错误](https://www.postgresql.org/message-id/aZzAqz6Oc5VfTf7B@nathan)**
Nathan Bossart报告说，在Andrew Dunstan最近提交解决pg_dumpall中数据库名称在双引号内包含换行符时出现shell命令参数验证错误的补丁后，koel构建农场成员出现了失败。Dunstan之前已经将两个补丁合并并进行了调整，计划很快提交修复。构建农场失败表明已提交的补丁可能引入了需要调查的问题。这似乎是防止pg_dumpall处理包含特殊字符的数据库名称时出现shell注入漏洞工作的后续。团队可能需要检查koel失败日志，以确定补丁是否需要调整或是否存在平台特定问题。

参与者:
alvherre@alvh.no-ip.org, andrew@dunslane.net, mahi6run@gmail.com, nathandbossart@gmail.com, srinath2133@gmail.com, tgl@sss.pgh.pa.us

### **[AIX 支持](https://www.postgresql.org/message-id/SJ4PPFB8177832684C854D7A3E15212DF66DB77A@SJ4PPFB81778326.namprd15.prod.outlook.com)**
讨论聚焦于为PostgreSQL完善AIX支持补丁。Tom Lane表示补丁基本准备就绪，等待Peter的补丁并需要在AIX 7.3上重新测试。Srirama Kucherlapati报告cfarm119存在网络问题，但提出三个替代方案：提供新的AIX 7.3节点、在现有硬件上使用双启动或迁移当前的AIX 7.2系统。Tom确认cfarm119已重新上线，并成功在autoconf和meson构建上测试HEAD版本。他识别出前沿AIX系统上仍存在lgamma(NaN)问题并计划推送相应修复。Tom还注意到之前的pgstat_slru.c构建失败因取消32位AIX构建支持而消失，质疑是否需要额外修复。长期计划包括在AIX 7.2和7.3版本上运行buildfarm实例。

参与者:
aditya.kamath1@ibm.com, andres@anarazel.de, hlinnaka@iki.fi, michael@paquier.xyz, noah@leadboat.com, peter@eisentraut.org, postgres-ibm-aix@wwpdl.vnet.ibm.com, robertmhaas@gmail.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, tristan@partin.io

### **[SQL 属性图查询 \(SQL/PGQ\)](https://www.postgresql.org/message-id/CAMT0RQSd7PyceQ-6krBCoXse=TJeuTkTTb1ZbWYYy=_yOnYWiQ@mail.gmail.com)**
Hannu Krosing询问了SQL Property Graph Queries (SQL/PGQ)的进展情况，特别提到最短路径查询将从UNION DISTINCT ON功能中获得很大益处。这是对Henson Choi分享的详细设计文档的回应，该文档概述了PostgreSQL图数据库中最短路径查询的实现策略。文档比较了两种方法：使用WITH RECURSIVE (CTE)查询重写的未优化方法，以及使用双向BFS的优化自定义执行器节点。CTE方法存在单向搜索O(B^D)复杂度、无法提前终止、循环预防效率低下等问题。优化方法使用O(B^(D/2))复杂度的双向BFS、用于高效访问跟踪的双哈希表、较小侧扩展策略和提前终止功能。文档提供了执行计划、搜索空间比较和关键优化技术的详细技术细节，得出结论认为双向BFS方法对于处理大型图的生产级图数据库系统至关重要。

参与者:
ajay.pal.k@gmail.com, amitlangote09@gmail.com, ashutosh.bapat.oss@gmail.com, assam258@gmail.com, hannuk@google.com, imran.zhir@gmail.com, peter@eisentraut.org, vik@postgresfriends.org, zhjwpku@gmail.com

### **[索引预取](https://www.postgresql.org/message-id/CAE8JnxNziSMLDgwJVxMgH2HBT03hB19eaaACfZih+42VSkLihQ@mail.gmail.com)**
Alexandre Felipe回应了Peter Geoghegan对索引预取补丁的反馈，承认在距离功能冻结不到6周的紧张模式。Felipe提到在src/backend/access/transam/xloginsert.c中发现缺少#include "utils/rel.h"，并解释了他的贡献动机，尽管复杂性很高，他之前曾在2022年放弃了一个功能提案。他为优先队列复杂性的冗长讨论道歉，并询问可以在哪里添加更多价值。Felipe一直在测试不同的距离控制策略(2*d, d+4等)，其中2*d在各种模式下表现最佳，并建议使用执行器估算来限制预取浪费。Peter强调由于时间限制应专注于当前范围，而不是扩展到堆访问重排序，指出Tomas已经在此项目上工作了3年，Peter工作了1年。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CANhcyEUK_L+2Y+QX44Gkf+TCyz8YBCCT4zp1mVqizqYKkx4RVw@mail.gmail.com)**
讨论围绕PostgreSQL发布功能的补丁展开，该功能允许使用EXCEPT子句跳过某些表。Shlok Kyal提交了v48版本的补丁，解决了之前审阅者的意见，包括修复普通表的崩溃问题，并澄清pg_get_publication_effective_tables函数是内部函数而非面向用户的。Amit Kapila建议简化补丁，初期只允许在EXCEPT子句中使用根分区表，因为处理单个分区会在分区管理、初始同步和多发布场景中增加显著复杂性。他建议提供ALTER PUBLICATION SET EXCEPT TABLE功能来管理排除的表。Ashutosh Sharma对v48补丁提供了额外反馈，指出内存清理模式不一致、注释掉的walrcv_clear_result调用，并建议为出现在多个位置的多发布冲突检查提供更好的文档。审阅者正在权衡功能完整性与实现复杂性。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[\[PATCH\] 支持自动序列复制](https://www.postgresql.org/message-id/OS9PR01MB12149D9054CC7F2DC3F0D26A1F577A@OS9PR01MB12149.jpnprd01.prod.outlook.com)**
自动序列复制补丁正在接受审查，Hayato Kuroda提出了几个技术关注点。主要问题包括start_sequence_sync()中低效的事务处理应该重用maybe_reread_subscription()，内存管理问题导致序列信息结构被分配但未释放，以及工作进程启动不足可能在持续接收消息时阻止同步。Kuroda还强调了当用户在自动同步期间访问订阅者上的序列时出现的序列值倒退问题，建议采用棘轮机制或文档警告。Dilip Kumar寻求性能收益的澄清，质疑如果工作进程仍需获取所有已发布序列，到底节省了什么。Amit Kapila解释说，节省来自于避免对已同步序列进行不必要的本地状态更新，包括序列关系页面、WAL记录和目录更新，对于大量序列特别有益。

参与者:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, dilipbalaut@gmail.com, itsajin@gmail.com, kuroda.hayato@fujitsu.com, shveta.malik@gmail.com



## **行业新闻**

### **[Anthropic 指控中国AI实验室盗用Claude 美国辩论AI芯片出口问题](https://techcrunch.com/2026/02/23/anthropic-accuses-chinese-ai-labs-of-mining-claude-as-us-debates-ai-chip-exports)**
Anthropic指控三家中国主要AI公司——DeepSeek、Moonshot和MiniMax——使用大约24,000个虚假账户系统性地提取和复制Claude的AI能力，这一过程被称为"蒸馏"。这一指控正值美国官员积极讨论对中国实施更严格的AI芯片出口管制，旨在减缓中国人工智能发展进程。这些指控的时机凸显了美中AI公司之间日益紧张的关系，以及对知识产权盗窃和快速发展的AI领域技术竞争的担忧。

### **[国防部长召见 Anthropic 的 Amodei 讨论 Claude 的军事应用](https://techcrunch.com/2026/02/23/defense-secretary-summons-anthropics-amodei-over-military-use-of-claude)**
国防部长Pete Hegseth召见Anthropic首席执行官Dario Amodei到五角大楼，进行被描述为紧张的讨论，涉及军方对Claude AI的使用。会议重点关注军方如何利用Anthropic的AI技术以及部署的潜在限制。Hegseth通过威胁将Anthropic指定为"供应链风险"来升级局势，这可能对该公司的政府合同和合作伙伴关系产生重大影响。这一发展凸显了AI公司与国防官员之间在人工智能在军事应用中的适当使用和治理方面日益紧张的关系。

### **[OpenAI 为企业推进召集顾问团队](https://techcrunch.com/2026/02/23/openai-calls-in-the-consultants-for-its-enterprise-push)**
OpenAI宣布与四家主要咨询公司建立合作伙伴关系，以加快其OpenAI Frontier AI代理平台在企业客户中的采用。这一战略举措代表了OpenAI推动超越消费者应用并在企业市场建立更强立足点的努力。通过利用知名咨询公司的专业知识和客户关系，OpenAI旨在帮助企业更有效地整合和实施其先进的AI技术。这一合作伙伴战略反映了该公司认识到企业采用通常需要专业的咨询支持来应对复杂的组织需求和实施挑战。