# PostgreSQL 每日更新#62 2026-02-23







## **热门 Hacker 邮件讨论精选**

### **[修改PostgreSQL块大小后的回归失败](https://www.postgresql.org/message-id/CAE8JnxP0js27RrunxXktvfmnum7csoBe2q_R+sj08hoqDNG3Zg@mail.gmail.com)**
讨论围绕解决PostgreSQL在使用非默认块大小（例如32KB而不是8KB）时回归测试失败的问题。Yasir最初提议为不同块大小创建替代的期望输出文件，但Álvaro Herrera拒绝了这种方法，建议应该修改测试以使用SET/RESET命令控制查询计划，从而在不同块大小下保持一致性。Alexandre Felipe提出了一个更复杂的解决方案，涉及选择性模式匹配和可配置的输出比较，包括忽略注释、空格和特定数字。然而，David Johnston批评这种方法过于复杂并质疑其必要性。他建议专注于最小化更改来使现有测试更健壮，或者可能将有问题的测试迁移到TAP框架。该讨论显示大约30个测试文件需要修改，失败主要涉及hash/group聚合之间的计划更改和不同扫描类型。社区在处理块大小相关测试变化的最佳方法上仍存在分歧。

参与者:
alvherre@kurilemu.de, david.g.johnston@gmail.com, o.alexandre.felipe@gmail.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com, yasir.hussain.shah@gmail.com, zmlpostgres@gmail.com

### **[索引预取](https://www.postgresql.org/message-id/CAE8JnxPqNGReQWc+-fyprdOXwqODymgoxcxvNrC0W+AJRXpRfQ@mail.gmail.com)**
Alexandre Felipe分享了索引预取优化的实验结果，测试了不同的距离控制策略，其中2*d在各种模式下表现最佳。他提议通过从执行器发送行估计来限制预取浪费，并演示了使用锯齿模式的I/O重排序，该模式以O(W)内存复杂度将寻道距离减少了大约2/W。他在400MB表上的实验显示，启用预取时HDD和SSD的性能提升了20-33%，尽管不启用预取的SSD显示了混合结果。Peter Geoghegan回应说，虽然堆访问重排序很有趣，但在不到6周的功能冻结期临近时扩大补丁范围是不合适的。他质疑Markov模型对预取距离确定的相关性，并指出执行器行估计补丁已经存在，强调需要在紧急时期专注于核心功能而非理论扩展。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAA4eK1KESu4=W6j4CQkKv5nzNJgtJyYBsg3E5K+LcwOr3t0WKw@mail.gmail.com)**
Amit Kapila对vignesh C的v47补丁进行了审查，该补丁用于在publication中跳过模式更改。补丁引入了publication的EXCEPT TABLE子句。Kapila要求进行三个主要修改：在注释中添加表失效的函数引用，解释为什么exceptlist只针对RELKIND_RELATION形成并提供适当的文档，以及改进错误消息格式以符合PostgreSQL的风格约定。他建议将所需对象直接放入错误消息本身，而不是使用单独的详细子句，并将"clauses"更正为"clause"。反馈重点关注代码文档的清晰性以及与现有PostgreSQL错误消息模式的一致性。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **行业新闻**

### **[Google VP warns that two types of AI startups may not survive

(Note: This subject contains no SQL keywords or company/product names that require special handling according to your instructions, so it remains unchanged. If you meant for me to translate it to Chinese, here it is:)

Google VP警告两类AI初创公司可能无法生存](https://techcrunch.com/2026/02/21/google-vp-warns-that-two-types-of-ai-startups-may-not-survive)**
一位Google副总裁警告称，随着生成式AI的发展，两种类型的AI初创公司面临越来越大的压力，可能无法生存。这位高管特别指出LLM封装器和AI聚合器是特别脆弱的类别。这些公司正在经历利润率萎缩和差异化有限的问题，这威胁到它们在竞争日益激烈的AI环境中的长期生存能力。这一警告是在AI行业持续成熟和整合的背景下发出的，大型科技公司通过规模和资源获得优势。这一预测反映了对哪些AI商业模式将在技术变得更加商品化和竞争加剧时证明是可持续的更广泛担忧。

### **[xAI的好消息：Grok现在非常擅长回答关于Baldur's Gate的问题](https://techcrunch.com/2026/02/20/great-news-for-xai-grok-is-now-pretty-good-at-answering-detailed-questions-about-baldurs-gate)**
Business Insider的一份新报告显示，xAI的高级工程师被从其他项目调离，以确保该公司的AI聊天机器人Grok能够回答关于热门视频游戏Baldur's Gate的详细问题。这一发展突显了xAI不寻常的优先级安排，大量工程资源从其他举措中重新分配，专注于改善Grok在游戏相关查询方面的表现。此举表明xAI将游戏专业知识视为其AI系统的重要能力，尽管这引发了关于资源分配和战略优先级的质疑。报告表明，这种游戏知识改进被认为足够重要，值得从其他公司项目重新分配经验丰富的工程人才。

### **[OpenAI 曾讨论是否向警方报告涉嫌加拿大枪手的聊天记录](https://techcrunch.com/2026/02/21/openai-debated-calling-police-about-suspected-canadian-shooter-chats)**
OpenAI就是否应该就Jesse Van Rootselaar在成为加拿大疑似枪手之前与ChatGPT的令人担忧的互动联系警方面临内部争论。Van Rootselaar对枪支暴力的描述被监控ChatGPT滥用的工具标记，这引发了关于该公司举报潜在危险行为责任的问题。该案例突显了AI公司在其系统检测到可能表明现实世界威胁的内容时面临的复杂伦理和法律考虑。OpenAI关于警方通知的内部讨论揭示了在平衡用户隐私与公共安全担忧方面的挑战。该事件强调了关于AI公司举报可疑活动义务以及其监控系统在防止潜在暴力方面有效性的持续辩论。