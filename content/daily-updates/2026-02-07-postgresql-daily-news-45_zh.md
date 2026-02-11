# PostgreSQL 每日更新#45 2026-02-07



## **技术博客**

### **[A Day in the Life: Inside a Director, Strategic Accounts Role at EDB](https://enterprisedb.com/blog/day-life-inside-director-strategic-accounts-role-edb)**
Josh Spero，EDB战略客户总监，在这个视频聚焦中讨论了他的职责以及为什么他认为EDB是职业发展的理想工作场所。作为EDB"生活中的一天"系列的一部分，该系列探索这家PostgreSQL企业公司的关键职位，Spero分享了关于战略客户管理和EDB工作环境的见解。该系列突出了在EDB产生市场影响的个人，重点关注PostgreSQL生态系统内的职业发展机会。

`enterprisedb.com`

### **[How Zite Provisions Isolated Postgres Databases for Every User](https://neon.com/blog/how-zite-provisions-isolated-postgres-databases-for-every-user)**
Zite是一个AI原生应用构建器，使用Neon的serverless PostgreSQL平台为每个用户提供隔离的数据库，包括免费计划用户。据联合创始人Dominic Whyte表示，这种方法消除了雇用专门数据库工程师来管理和扩展数据库基础设施的需要。该解决方案允许Zite为每个用户提供真正的数据库隔离，同时保持操作简单性。这个案例研究展示了serverless PostgreSQL如何在没有传统数据库管理和配置开销的情况下实现可扩展的多租户架构。

`Carlota Soto`

### **[MariaDB vs. PostgreSQL: Choosing the Right Open Source Database](https://enterprisedb.com/blog/mariadb-vs-postgresql)**
MariaDB和PostgreSQL都是广泛使用的开源关系型数据库，为从小型Web应用到大型企业系统的各种应用提供支持。虽然两者都基于SQL且功能强大，但它们在设计理念、功能集和对现代工作负载的适用性方面存在显著差异。文章强调数据库选择具有长远影响，会影响性能、可扩展性、可扩展性、安全性和许可证。这些因素直接影响系统如何与业务需求一起成长，使得这两个数据库之间的比较对于进行数据库选择决策的组织至关重要。

`enterprisedb.com`

### **[The New v0 Is Ready for Production Apps and Agents](https://neon.com/blog/the-new-v0-is-ready-for-production-apps-and-agents)**
Neon的v0平台经历了重大重构，从快速原型工具转变为生产就绪的开发平台。此次更新将v0的重点从简单生成代码转向帮助团队交付完整的软件解决方案。v0之前专为快速演示和一次性原型设计，现在支持真正的生产应用程序和AI代理。这一演变代表了重大的架构变化，使平台超越了仅仅UI生成的能力。重构旨在为团队提供适合部署实际业务应用程序而非实验项目的综合开发环境。

`Carlota Soto`

### **[What is AI governance?](https://enterprisedb.com/blog/what-is-ai-governance)**
EnterpriseDB讨论了AI治理作为组织确保AI系统安全、道德、透明运行并符合监管要求所需的政策、流程和技术控制框架。文章解释了AI治理在完整的AI生命周期中解决问责制问题，从数据收集和模型训练到部署、监控和退役。它强调了使AI决策可审计、可理解和可纠正的重要性。对于PostgreSQL用户来说，这涉及存储AI训练数据和支持AI应用程序的数据库系统，需要治理框架来确保负责任的实施。

`enterprisedb.com`

### **[What Is a Time Series and How Is It Used?](https://enterprisedb.com/blog/what-is-a-time-series)**
时间序列数据由随时间跟踪的数值组成，每个数据点都与特定时刻相关联，例如股票价格、网站流量或传感器读数。这种数据类型使组织能够理解事物如何变化，而不仅仅是在某个时间点发生了什么。时间序列分析帮助企业识别模式、检测异常并预测未来结果，支持需求规划、系统监控和预测性维护等关键用例。EDB Postgres AI为时间序列工作负载提供支持，在PostgreSQL环境中为处理这种时态数据提供有效功能。

`enterprisedb.com`



## **热门 Hacker 邮件讨论精选**

### **[Pasword expiration warning](https://www.postgresql.org/message-id/CAN4CZFPyCiVjBKhTJhmY5J0hj0KBgVwFA3gBh+Bvvcra-DQyYA@mail.gmail.com)**
讨论围绕PostgreSQL中密码过期警告功能的补丁展开。对话涉及关于使用宏与硬编码值的代码可读性问题。一位参与者建议，虽然带有解释性名称的宏能提高可读性，但在硬编码数字后添加简单注释如"/* 7 days in seconds */"可以在不过度使用宏的情况下达到类似的清晰度。审查者指出，由于GUC名称在其他地方已定义为"7d"，添加宏可能不会带来显著价值。补丁获得了积极反馈，一位审查者表示看起来不错。补丁作者Nathan Bossart计划在下周初提交更改，并要求尽快提出任何额外反馈或异议。

参与者:
andrew@dunslane.net, euler@eulerto.com, gilles@darold.net, japinli@hotmail.com, li.evan.chao@gmail.com, liuxh.zj.cn@gmail.com, nathandbossart@gmail.com, niushiji@gmail.com, peter@eisentraut.org, shiyuefei1004@gmail.com, tgl@sss.pgh.pa.us, tsinghualucky912@foxmail.com, zsolt.parragi@percona.com

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAOYmi+kQD6ynTUVsbXLmT3BjiEm4kk470c8WLL7ridQp9WR86g@mail.gmail.com)**
Jacob Champion已经提交了将libpq协议版本升级到3.2的更改，尽管他个人不赞成将表格分成两个。该提交包括处理关于在文档中更早提及扩展"_pq_."前缀的反馈。Champion附上了v7补丁：v7-0001更新了之前v6-0003的提交消息，而v7-0002添加了错误处理，为用户提供grease相关libpq错误的解释和文档链接。文档链接目前指向PostgreSQL官方文档中关于最大协议版本的部分，尽管Champion更倾向于使用wiki页面以便维护。他寻求对此方法的反馈，同时指出如果需要的话，稍后更改URL会很简单。

参与者:
andres@anarazel.de, david.g.johnston@gmail.com, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, postgres@jeltef.nl, robertmhaas@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAJpy0uB=gaJgDaP8MiVeZmpxALrmDPbx=fqoidAbzhwEO3cv-g@mail.gmail.com)**
Shveta Malik发现了Shlok Kyal的v41补丁在跳过发布中模式更改功能方面存在问题。当订阅者连接到具有不同EXCEPT子句和不同PUBLISH_VIA_PARTITION_ROOT值的多个发布时会出现问题。在这种情况下，表同步和增量同步复制不同的表集合，造成不一致的行为。例如，一个发布在PUBLISH_VIA_PARTITION_ROOT=true时排除特定分区，而另一个发布在PUBLISH_VIA_PARTITION_ROOT=false时排除父表。Shveta建议分析行过滤器和列列表功能如何处理具有不同PUBLISH_VIA_PARTITION_ROOT设置的等效情况，以确定这种方法的适当行为。团队需要在继续实施之前明确预期行为。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/CAM_vCud-crRR9PeN_ZJQx2QqhtPSJ4AjU_hRaJTvmcOFPk9znA@mail.gmail.com)**
Bowen Shi在应用Ashutosh Bapat的v20260128补丁时遇到冲突，询问基础提交信息以支持在不重启的情况下更改shared_buffers。Ashutosh回复说基础提交记录在补丁本身中，为e3094679b9835fed2ea5c7d7877e8ac8e7554d33。

在此之前的讨论中，Ashutosh提供了最新实现的全面更新，解决了Tomas Vondra和Peter Eisentraut之前的审查反馈。主要更改包括：将max_available_memory替换为max_shared_buffers GUC，使用mmap() + ftruncate()而非mremap()实现Linux特定功能，移除freelist方法，实现pg_resize_shared_buffers()函数（需要先执行ALTER SYSTEM + pg_reload_conf()然后调用该函数），在config.sgml和func-admin.sgml中添加用户文档，以及包含基本测试并计划进行更全面的测试。

当前实现使用文件支持的内存段，保持指针稳定性，处理EXEC_BACKEND模式，并解决了许多同步问题。待完成的工作包括更好的错误处理、平台可移植性、调整大小期间的进程同步，以及解决代码审查中确定的其余TODO项。

参与者:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me, zxwsbg12138@gmail.com

### **[\[PATCH\] pg\_bsd\_indent: improve formatting of multiline comments](https://www.postgresql.org/message-id/aYZqyoNlah_E-Zua@nathan)**
Nathan Bossart 已提交了一个补丁来改进 pg_bsd_indent 中多行注释的格式化。该补丁旨在解决 PostgreSQL 代码格式化工具处理多行注释块时的问题。除了主要的格式化改进外，Nathan 还将一些 #undefs 改为 #defines 作为实现的一部分。该提交代表了这个格式化增强的最终解决方案，之前在包括来自不同组织的开发者在内的多个贡献者之间进行了讨论。这个更改旨在使通过 pg_bsd_indent 工具处理的 PostgreSQL 源代码中的多行注释格式更加一致。

参与者:
aleksander@tigerdata.com, arseniy.mukhin.dev@gmail.com, bruce@momjian.us, li.evan.chao@gmail.com, michael@paquier.xyz, nathandbossart@gmail.com

### **[New access method for b\-tree\.](https://www.postgresql.org/message-id/CAE8JnxM5GDEWdvEckjgG60OwPK04pZ9dSyxYm2+-PuyKCpmo-w@mail.gmail.com)**
Alexandre Felipe提出了一种新的b-tree访问方法，称为"index merge scan"，用于优化在前导索引列上使用IN条件、在后续列上使用ORDER BY以及LIMIT子句的查询。其动机是高效渲染社交媒体动态，用户可以选择多个关注账户的帖子并按时间戳排序。性能测试显示了显著改进：在LIMIT 100的情况下，新方法的执行时间为13毫秒，而常规索引扫描为3,409毫秒。该实现在查询计划中添加了"Index Prefixes"和"Index Searches"。Alexandre计划扩展对多列前缀和非前导前缀的支持。之前的讨论中，Michał Kłeczek建议使用GIST索引作为替代方案，并指出社交媒体应用中类似的"时间线视图"模式。该提案针对一种常见但目前效率低下的查询模式，传统方法需要昂贵的排序操作。

参与者:
alexandre.felipe@tpro.io, ants.aasma@cybertec.at, michael@paquier.xyz, michal@kleczek.org, o.alexandre.felipe@gmail.com, peter@eisentraut.org, pg@bowt.ie, pt@bowt.ie, tgl@sss.pgh.pa.us, tomas@vondra.me

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/CALdSSPhh04=1GvjK3Zhh4ZKepGJiRgkd-4eZFWz=3hVhvPDHQA@mail.gmail.com)**
Andres Freund正在简化MarkSharedBufferDirtyHint()，移除特殊处理要求。主要改动包括：切换到正常的WAL日志顺序（先标记缓冲区脏，再记录WAL）而非之前的异常顺序，消除对DELAY_CHKPT_START的需求（因为share-exclusive锁现在与页面刷新冲突），以及移除BM_JUST_DIRTIED标志（因为IO期间不再可能并发标记缓冲区脏）。他还在更新heap_inplace_update_and_unlock()，改为仅延迟缓冲区内容更新，而非复制MarkBufferDirtyHint()的方法。这些改动旨在标准化缓冲区处理，因为提示位设置现在需要share-exclusive锁。Kirill Reshke审查了v12补丁，建议Andres可能对审查一个关于gistkillitems变更的相关commitfest补丁感兴趣。

参与者:
andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com



## **行业新闻**

### **[It just got easier for Claude to check in on your WordPress site](https://techcrunch.com/2026/02/06/it-just-got-easier-for-claude-to-check-in-on-your-wordpress-site?utm_campaign=daily_pm)**
Anthropic通过将Claude与WordPress集成，扩展了Claude的功能，允许用户利用这个AI助手分析网站流量并访问内部网站指标。这种集成代表了AI在网站管理和分析方面的实际应用，使WordPress用户更容易通过对话式AI交互而不是传统仪表板界面来监控和了解其网站性能。

### **[The backlash over OpenAI's decision to retire GPT-4o shows how dangerous AI companions can be](https://techcrunch.com/2026/02/06/the-backlash-over-openais-decision-to-retire-gpt-4o-shows-how-dangerous-ai-companions-can-be?utm_campaign=daily_pm)**
OpenAI宣布停用GPT-4o引发了用户强烈的情感反应，突显了AI陪伴的心理危险。用户对这个AI模型表达了深度依恋，一些人描述它具有"存在感"和"温暖感"而不是感觉像代码。这种强烈反对揭示了AI系统如何与用户形成看似有意义的关系，引发了对情感依赖以及停用人们已经依恋的AI陪伴所产生心理影响的担忧。

### **[Maybe AI Agents can be laywers after all](https://techcrunch.com/2026/02/06/maybe-ai-agents-can-be-lawyers-after-all?utm_campaign=daily_pm)**
本周AI能力取得重大进展，Anthropic发布的Opus 4.6打乱了代理AI排行榜，在法律任务方面表现出色。这一进步表明AI代理现在可能有能力处理复杂的法律工作，这标志着AI在执行之前被认为超出当前AI能力的专业任务方面取得了潜在突破。