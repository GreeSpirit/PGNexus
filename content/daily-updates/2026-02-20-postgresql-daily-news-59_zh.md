# PostgreSQL 每日更新#59 2026-02-20



## **技术博客**

### **[apt.postgresql.org：更新日志、构建日志和 Ubuntu 发布版本坚定而勇敢](https://www.postgresql.org/about/news/aptpostgresqlorg-changelogs-build-logs-and-ubuntu-releases-resolute-and-plucky-3238/)**
PostgreSQL APT 仓库引入了几项改进。现在可以通过 apt 命令自动获取变更日志文件，如"apt changelog postgresql-18"，不过目前只有最新的软件包提供变更日志。构建日志现在以 .build.xz 文件形式与软件包一起存储在池目录中，但没有自动下载工具。已开始支持 Ubuntu 26.04 "resolute"，软件包现已可用，而 Ubuntu 25.04 "plucky" 已达到生命周期终点并移至归档仓库。

`www.postgresql.org`

### **[2026年3月Hacking研讨会](http://rhaas.blogspot.com/2026/02/hacking-workshop-for-march-2026.html)**
Robert Haas正在组织2026年3月的编程研讨会，将围绕Tomas Vondra在2024.PGConf.EU上的"Performance Archaeology"演讲进行讨论。研讨会将包括2-3个讨论环节，Vondra将参与其中。感兴趣的参与者可以通过提供的表单注册以获得会话邀请。这代表了社区深入探讨在欧洲PostgreSQL会议上提出的PostgreSQL性能分析技术和方法论的努力。

`rhaas.blogspot.com`

### **[Glooko 如何利用 Tiger Data 将 3B+ 数据点/月转化为救生糖尿病医疗保健](https://www.tigerdata.com/blog/how-glooko-turns-3b-data-points-per-month-into-lifesaving-diabetes-healthcare-tiger-data)**
Glooko是一个为超过100万患者提供服务的糖尿病监测平台，将其关键医疗数据工作负载从文档数据库迁移到Tiger Data的托管PostgreSQL解决方案。该公司每天处理超过1亿次血糖测量数据，每月生成30多亿个数据点。之前的系统面临摄取缓慢、索引开销导致30TB数据膨胀、14天和90天查询汇总速度慢以及缺乏保留策略等问题。通过切换到Tiger Cloud的时间序列优化PostgreSQL，采用TimescaleDB超表、自动分区和基于策略的压缩，Glooko实现了95-97%的压缩比、480倍的查询速度提升（从4分钟降至0.5秒）、40%的成本降低以及更稳定的数据摄取，同时在其全球数据中心保持HIPAA/GDPR合规性。

`Per Grapatin`

### **[PostgreSQL Anonymizer 3.0：并行静态掩码 + JSON 导入/导出](https://www.postgresql.org/about/news/postgresql-anonymizer-30-parallel-static-masking-json-import-export-3236/)**
Dalibo发布了PostgreSQL Anonymizer 3.0，引入了重要的性能和易用性改进。主要新功能是使用PostgreSQL后台工作进程的并行静态脱敏，通过在尊重外键约束的同时并行处理多个表，可以显著减少大型数据库的脱敏时间。该版本还为脱敏规则添加了JSON导入/导出功能，使得以编程方式管理复杂脱敏策略更加容易。3.0版本包含了两个CVE的关键安全修复，这些漏洞可能导致权限提升，特别影响PostgreSQL 14安装。该版本停止支持PostgreSQL 13并移除了遗留静态脱敏功能。由于安全漏洞，用户应立即升级。

`www.postgresql.org`



## **热门 Hacker 邮件讨论精选**

### **[pg\_plan\_advice 查询计划建议](https://www.postgresql.org/message-id/CAK98qZ1zWzRB0ABG7ULzTeWKRR5C7-FxLqM-6v8wQDiFM+DNAg@mail.gmail.com)**
Robert Haas和Alexandra Wang正在讨论pg_plan_advice补丁系列。Robert已经提交了补丁0001和0002，主要补丁现在是第15版中的0002。Alexandra正在审查0002的一半内容，确认0001看起来不错，承诺在本周末前提供更多反馈。Robert发布了第17版，已经提交了之前由Richard审查的单独的0004补丁。实现了一个关键的错误修复：pga_identifier.c错误地使用了planner_rt_fetch()而不是rt_fetch()。前者使用可能被自连接消除和连接移除改变的simple_rte_array，而rt_fetch()直接使用Query的rtable，后者永远不会改变。由于pg_plan_advice需要稳定的标识符，不可变的方法是必要的。这个更改修复了在pg_plan_advice.feedback_warnings=on时运行测试的失败问题。还清理了额外的XXX注释。

参与者:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[ANALYZE 期间是否可以选择跳过未更改的关系？](https://www.postgresql.org/message-id/CAA5RZ0v02tJ9uBnhR4Uf4EEte4fsLiL3uKXxO+Fcs_-D2kESUw@mail.gmail.com)**
Sami Imseih对PostgreSQL ANALYZE命令的v5 MISSING_STATS_ONLY补丁进行了详细的代码审查。他发现了一个重要的效率问题：examine_attribute()对每个属性被调用两次——一次在早期缺失统计检查时，另一次在正常处理过程中。Imseih建议重构代码，让relation_has_missing_column_stats()接受属性编号参数，并将缺失统计检查直接集成到examine_attribute()中，使用布尔标志。他还建议将关系跳过逻辑移到属性分析后当attr_cnt等于零时执行。其他反馈包括要求更全面的测试覆盖，包括继承分区、声明式分区和表达式索引；通过使用INFO级别和ereport格式改进日志记录；以及运行pgindent进行代码格式化。他确认autoanalyze使用基于阈值的决策而不是修改统计检测。

参与者:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com

### **[在信号处理程序中为 palloc 添加断言](https://www.postgresql.org/message-id/CALdSSPiPw2QadBpDK0g+AswfxCagK=05U_bJAuVO4_Jr_1mU7Q@mail.gmail.com)**
讨论的核心是在PostgreSQL信号处理器中使用ereport()和palloc()的安全性问题。Kirill Reshke的补丁添加了断言来检测信号处理器中的palloc使用，但测试显示die()和quickdie()函数通常从信号处理器调用ereport()，这可能导致不安全的内存分配。

Andres Freund认为信号处理器中的ereport()调用是有问题的，特别是存在TLS/OpenSSL状态损坏的风险。他建议将ereport()使用限制为仅在单用户模式下，但指出即便如此也不是真正安全的。Heikki Linnakangas表示同意并提出了一个补丁，将异常情况缩小到仅在真正卡在不可中断的getc()操作时。

参与者讨论了几种替代方案：完全从quickdie()中移除ereport()（失去客户端错误消息），在ereporting之前添加更多安全检查，或者像处理SIGTERM一样以延迟处理方式处理SIGQUIT。还讨论了改进waiteventset.c中的管道支持以更好地处理中断，特别是在Windows上，基于完成的IO使基于就绪的接口复杂化。

核心问题仍未解决——在信号处理器中平衡安全性与信息化错误报告。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, nathandbossart@gmail.com, reshkekirill@gmail.com, thomas.munro@gmail.com

### **[刷新运行中事务内的某些统计信息](https://www.postgresql.org/message-id/aZaKVOrRO_bHsevn@paquier.xyz)**
该补丁提议在运行的事务中刷新某些统计信息，以改善监控工具的可见性。Michael Paquier对设计表示担忧，特别是新的pgstat_schedule_anytime_update()要求和基于超时的方法，认为这些增加了复杂性和潜在的bug。他提出了一种替代的客户端API，使用PROCSIG机制，类似于LOG_MEMORY_CONTEXT，这将给应用程序更多控制统计刷新时机的能力。

Bertrand Drouvot回应了Jakub Wartak关于get_timeout_active()函数在热路径中调用的性能担忧，通过pgbench测试显示性能影响很小（约0.45%）。新版本用布尔标志替换了该函数。Bertrand认为客户端责任不会解决导致提交039549d70f6的原始问题。

讨论包括测试中硬编码睡眠和注入点使用的技术问题。Sami Imseih建议在pgstat_initialize()期间使用INJECTION_POINT_LOAD来避免关键部分内存分配问题。争论的焦点是基于超时的后端刷新还是客户端控制机制更好地服务监控需求。

参与者:
bertranddrouvot.pg@gmail.com, jakub.wartak@enterprisedb.com, masao.fujii@gmail.com, michael@paquier.xyz, samimseih@gmail.com, zsolt.parragi@percona.com

### **[\[PATCH\] 将检查点原因暴露给完成日志消息。](https://www.postgresql.org/message-id/CAHGQGwEeLpeCSffn=i0s0-zbHc4XLO9sF72hVE=9+RCGYS6=xQ@mail.gmail.com)**
Fujii Masao已推送一个补丁，该补丁在PostgreSQL中向完成日志消息公开检查点原因。该补丁由Soumya S Murali开发，他对实现的改进表示感谢，特别是使用snprintf()简化标志构造逻辑。审查者指出，更新的方法与PostgreSQL编码风格保持一致，并包含清晰的格式和行为。提交消息也得到改进，更好地解释了更改背后的动机，使其在上下文中更容易理解。该补丁已成功提交到PostgreSQL代码库。

参与者:
alvherre@kurilemu.de, andres@anarazel.de, juanjo.santamaria@gmail.com, masao.fujii@gmail.com, mbanck@gmx.net, melanieplageman@gmail.com, soumyamurali.work@gmail.com, vasukianand0119@gmail.com

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAHut+PtbpKn4CUbUg11VdtzOBnu-NhZVCiVfHqZRaPaw4b=cRw@mail.gmail.com)**
Peter Smith对pg_publication.c中令人困惑的函数命名模式表示担忧，这是在审查EXCEPT补丁期间提出函数名称更改建议时触发的。他识别出GetYyyyXxxx命名模式中的歧义性，其中"Yyyy"有时表示搜索条件，有时表示所获取内容的属性。例如，GetRelationPublications意味着"获取包含指定relid的publication"，而GetAllTablesPublications意味着"获取FOR ALL TABLES类型的publication"。这造成了关于函数用途的困惑，需要频繁参考注释。Smith提议系统性地重命名现有函数，遵循更清晰的模式，其中GetXXX始终表示返回的对象类型，建议使用GetPubsByRelid、GetRelsOfPubsMarkedForAll和GetPubByName等名称。他承认其他人可能认为当前名称可接受或时机不适合进行此类更改，但希望解释他对新EXCEPT补丁函数保持一致性的命名建议背后的理由。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **行业新闻**

### **[OpenAI reportedly finalizing $100B deal at more than $850B valuation

OpenAI 据报道正在敲定价值超过 $850B 的 $100B 交易](https://techcrunch.com/2026/02/19/openai-reportedly-finalizing-100b-deal-at-more-than-850b-valuation?utm_campaign=daily_pm)**
据报道，OpenAI正在接近完成一轮规模庞大的1000亿美元融资，这将使这家ChatGPT制造商的估值达到8500亿美元。该交易包括来自Amazon、Nvidia、SoftBank和Microsoft等主要科技公司和投资者的支持。这对这家AI公司来说是一个重要的里程碑，突显了投资者对人工智能技术的巨大兴趣。这一估值将使OpenAI成为世界上最有价值的私营公司之一，反映了市场对其AI能力和未来增长潜力的信心。此轮融资突显了AI发展的竞争格局以及在这一领域投入的大量资本。

### **[这些前Big Tech工程师正在利用AI来应对Trump的贸易混乱](https://techcrunch.com/2026/02/19/this-former-big-tech-engineers-are-using-ai-to-navigate-trumps-trade-chaos?utm_campaign=daily_pm)**
由前Big Tech工程师创立的Amari AI正在开发定制的AI驱动软件，帮助海关经纪人实现运营现代化，并应对Trump政府下不断变化的贸易政策。该公司正在解决海关经纪人面临的复杂挑战，他们必须跟上频繁变化的贸易法规和关税结构。通过利用人工智能，Amari AI旨在简化海关流程，降低从事国际贸易的企业的合规风险。这家初创公司代表了AI技术如何被应用于解决特定行业痛点，特别是在监管复杂性和频繁的政策变化为企业带来运营挑战的领域。