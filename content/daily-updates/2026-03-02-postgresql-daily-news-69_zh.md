# PostgreSQL 每日更新#69 2026-03-02



## **技术博客**

### **[pgdsat 2.0 版本已发布](https://www.postgresql.org/about/news/pgdsat-version-20-has-been-released-3249/)**
pgdsat 2.0版本已发布，为PostgreSQL集群提供自动化安全评估。这个开源工具检查大约90个安全控制点，包括所有CIS合规基准建议。新版本基于最新的PostgreSQL 17 CIS基准添加了13个额外的安全检查，并修复了现有问题。pgdsat帮助组织以自动化方式验证既定的安全策略，并识别PostgreSQL部署中的潜在安全漏洞。该工具由HexaCluster Corp的Gilles Darold维护，在Linux平台上运行，采用GPLv3许可证。

`www.postgresql.org`

### **[POSETTE: An Event for Postgres 2026 的日程已公布！](https://www.postgresql.org/about/news/the-schedule-is-out-for-posette-an-event-for-postgres-2026-3248/)**
POSETTE: An Event for Postgres 2026的日程已公布，这是第五届免费的PostgreSQL虚拟开发者大会，将于2026年6月16-18日举行。活动包含来自50位演讲者的44场演讲，分布在四个不同时区的直播流中。重点演讲包括Microsoft的Charles Feddersen和Affan Dar关于"Driving Postgres Forward at Microsoft"的主题演讲，以及PostgreSQL 19 Hackers Panel，由核心开发者Álvaro Herrera、Heikki Linnakangas、Melanie Plageman和Thomas Munro参与，讨论即将到来的功能和开发优先事项。大会为PostgreSQL开发者提供技术内容，会议分布在PDT和CEST时区进行。

`www.postgresql.org`



## **热门 Hacker 邮件讨论精选**

### **[扩展统计中表达式的无效统计数据缺陷](https://www.postgresql.org/message-id/aaTGSLZEbwhM_mmA@paquier.xyz)**
讨论的焦点是PostgreSQL的ANALYZE代码中扩展统计信息的内存管理实践。Chao Li对"部分释放"操作表示担忧，即释放stats数组容器但不显式释放通过examine_attribute()分配的各个元素。Michael Paquier解释说这种做法是为了代码简洁性而有意为之，因为所有分配都发生在do_analyze_rel()创建的anl_context内存上下文中，处理完成时会自动清理所有内存。这在事务块内重复执行ANALYZE命令时也能正常工作。然而，Chao Li认为部分释放会让代码读者感到困惑，建议要么显式释放所有内容，要么完全依赖内存上下文清理，以保持一致性和更好的代码可读性。

参与者:
corey.huinker@gmail.com, li.evan.chao@gmail.com, michael@paquier.xyz, tomas@vondra.me

### **[索引预取](https://www.postgresql.org/message-id/c96ba898-02fb-4756-a1c7-0ddb08159804@vondra.me)**
Tomas Vondra进行了全面的基准测试来评估索引预取功能，测试了单客户端和多客户端场景下的不同配置。他的结果显示性能持续改善，只有4个回归案例出现在极端条件下（使用io_method=worker的随机数据且距离限制为1）。Tomas认为这些回归是无关紧要的，因为它们禁用了预取但仍保持开销成本。Peter Geoghegan回应了Andres Freund的反馈，同意移除indexscan统计变更并致力于拆分可见性检查处理。他将采纳关于批处理存储架构和缓冲区pin管理的建议。Alexandre Felipe认可了Tomas的发现，并讨论了read_stream_next_buffer的潜在自平衡机制，强调了在高并发工作负载中小查询过度读取的担忧。讨论揭示了预取实现架构和性能特征的持续完善。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[RFC: 将 pytest 添加为支持的测试框架](https://www.postgresql.org/message-id/DGRSKGSV9XXA.X9YK4O5DDO8W@jeltef.nl)**
Jelte Fennema-Nio正在讨论pytest测试框架RFC中的0004和0005补丁。这些补丁被保留在补丁集中是为了确保在测试套件修改过程中与Jacob的用例兼容，但并非用于立即合并，而是作为概念验证示例。这些补丁在协议grease添加（提交4966bd3ed95）后导致CI失败。Fennema-Nio通过强制使用3.2版本解决了测试失败问题，但现在已将补丁标记为"nocfbot"以防止未来的CI失败。讨论表明正在进行集成pytest作为受支持测试框架的工作，同时保持与现有测试基础设施的向后兼容性。

参与者:
aleksander@tigerdata.com, andres@anarazel.de, byavuz81@gmail.com, daniel@yesql.se, jacob.champion@enterprisedb.com, peter@eisentraut.org, postgres@jeltef.nl, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[元组变形的更多加速](https://www.postgresql.org/message-id/CAApHDvpdBG-yzEbpy6qxVOcS3FtCt62Z+87G=tww5Fg+Ae0jBQ@mail.gmail.com)**
David Rowley正在处理他的元组变形加速补丁的反馈。Zsolt Parragi提出了几个代码审查问题：first_null_attr函数中缺少关于NULL要求的文档、属性处理中潜在的缓冲区溢出，以及错误使用att_pointer_alignby而不是att_nominal_alignby。David确认了这些问题并进行了修复，包括移动错误检查以防止越界写入数组和纠正函数调用。Andres Freund发现使用整数类型作为属性编号会导致编译器优化问题，因为-fwrapv标志阻止了溢出假设。切换到size_t显著改善了gcc性能。然而，David仍然观察到寄存器溢出问题，TupleDesc被写入堆栈并重新加载，尽管尝试了优化。他重新排序了补丁并应用了尾调用优化，提供的基准测试结果显示了改进。

参与者:
alvherre@kurilemu.de, andres@anarazel.de, dgrowleyml@gmail.com, johncnaylorls@gmail.com, li.evan.chao@gmail.com, zsolt.parragi@percona.com

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CALDaNm32g7c323M4mgZ5Wn8sbYp_=uQ6G_u0f9qfBCzuHP8jgQ@mail.gmail.com)**
讨论围绕为PostgreSQL发布实现EXCEPT TABLE子句展开，允许用户从ALL TABLES发布中排除特定表。Vignesh C发布了第53版补丁，解决了Nisha Moond的多项评审意见，包括修复测试用例、错误消息和文档。讨论的关键技术问题包括CREATE和ALTER PUBLICATION命令之间的语法不一致、ATTACH/DETACH操作期间的分区行为，以及继承表处理。Amit Kapila建议对多个发布使用errmsg_plural，并在补丁之间移动提示。关于继承表行为出现了重要争论：当发布创建后继承关系发生变化时，表应该保持独立跟踪还是动态跟随层次结构？Shveta Malik认为当前在创建后将继承表视为独立发布成员的方法是正确的，与维护基于层次结构动态成员关系的分区表有适当区别。团队在完善实现的同时继续解决表关系的边缘情况。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **行业新闻**

### **[印度以阻止令中断对热门开发者平台 Supabase 的访问](https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order?utm_campaign=daily_weekend)**
印度政府发布封锁令，影响了对流行开发者平台Supabase的访问。Supabase是一个基于PostgreSQL的数据库服务平台。这次封锁导致印度用户访问出现问题，而印度是Supabase最大的市场之一。封锁令似乎正在影响依赖该平台后端即服务产品的开发者和企业，包括数据库托管、身份验证和实时订阅服务。这一政府行动突显了国际科技平台与印度等主要市场监管机构之间持续的紧张关系，可能影响更广泛的开发者生态系统和依赖云数据库服务的公司。