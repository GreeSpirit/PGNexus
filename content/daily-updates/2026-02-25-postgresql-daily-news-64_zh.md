# PostgreSQL 每日更新#64 2026-02-25



## **技术博客**

### **[超越虚拟机管理程序：为什么 Broadcom/VMware 转变是数据库现代化的终极时刻](https://enterprisedb.com/blog/beyond-hypervisor-why-broadcomvmware-shift-ultimate-moment-database-modernization)**
Broadcom收购VMware导致定价变化和订阅要求，促使组织重新考虑整个技术基础设施。这一转变为数据库现代化提供了战略机遇，因为已经在评估新虚拟化平台的公司可以同时解决传统数据库许可成本和供应商锁定问题。EnterpriseDB建议面临VMware转型的组织应考虑从专有数据库迁移到基于PostgreSQL的解决方案，认为基础设施的根本性变化为全面的平台现代化创造了理想条件，而不是简单地替换单个组件。

`enterprisedb.com`

### **[使用 Neon 和 Durable Endpoints 构建深度研究代理](https://neon.com/blog/building-a-deep-research-agent-with-neon-and-durable-endpoints)**
Neon展示了如何使用其Durable Endpoints功能构建深度研究代理。与简单的RAG管道不同，这些代理遵循规划、搜索、学习和反思的递归循环，类似于OpenAI的Deep Research、Perplexity和Gemini的系统。该架构基于DeepResearcher和Step-DeepResearch等最新论文，这些论文正式化了代理如何决定何时深入研究或停止。Neon的Durable Endpoints提供了支持这些复杂、长时间运行的研究工作流所需的持久基础设施，这些工作流需要在研究过程的多次迭代中维持状态。

`Charly Poly`

### **[使用"builtin" C 排序规则创建您的 PostgreSQL 集群！](https://www.cybertec-postgresql.com/en/c-collation-best-for-postgresql-clusters/)**
Laurenz Albe建议使用PostgreSQL的C排序规则来避免操作系统升级后出现的索引损坏问题。PostgreSQL依赖外部库提供排序规则支持，当这些库更新其排序规则时，现有索引可能会损坏并需要重建。C排序规则提供逐字节的字符串比较，保持稳定性，因为它只依赖于字符编码，而现有字符的编码永远不会改变。虽然C排序规则产生不直观的排序结果（大写字母在小写字母之前，非ASCII字符在最后），但您可以在需要时为特定列或ORDER BY子句指定自然语言排序规则。PostgreSQL v17引入了"builtin"排序规则提供程序，提供不依赖外部库的C排序规则，进一步降低升级风险。

`Laurenz Albe`

### **[数字枷锁：为什么AI问责制不能外包](https://enterprisedb.com/blog/digital-leash-why-ai-accountability-cannot-be-outsourced)**
这篇来自EnterpriseDB的文章探讨了自主AI系统中问责制的关键问题。随着AI在决策制定中变得更加独立，组织面临着关于责任和问责的根本性问题。文章探讨了当AI系统做出产生后果的自主决策时，确定谁承担责任的挑战。这对于AI驱动的自动化日益普遍的数据库和企业系统尤其相关。文章论证了问责制不能委托给外部方，必须由实施这些系统的组织承担。它涉及了随着这些技术在企业环境中越来越普及，对AI治理和责任明确框架日益增长的需求。

`enterprisedb.com`

### **[主权差距：为什么向SaaS-First Postgres的转变是您使用EDB和Red Hat进行现代化的信号](https://enterprisedb.com/blog/sovereignty-gap-why-shift-saas-first-postgres-your-signal-modernize-edb-and-red-hat)**
EDB和Red Hat正在推广他们的合作伙伴关系，作为组织面临数据库主权挑战的解决方案，当供应商推行与其要求不符的云优先策略时。这篇博客文章将EDB Postgres AI与Red Hat Ansible Automation Platform的组合定位为需要控制其数据库基础设施的公司的替代方案，而不是被迫使用特定的云平台。这似乎针对那些希望拥有PostgreSQL功能同时保持运营主权的企业，避免供应商锁定情况，即他们当前的数据库提供商优先考虑可能不满足监管、安全或运营要求的SaaS产品。

`enterprisedb.com`



## **热门 Hacker 邮件讨论精选**

### **[\[提案\] 为 pg\_createsubscriber 添加日志文件功能](https://www.postgresql.org/message-id/CAEqnbaWjoSby+_FQOKqTiDwf9AsWVjcGzRn-BQtdivC8xn0ADw@mail.gmail.com)**
Gyan Sreejith提交了更新的补丁，实现了为pg_createsubscriber添加日志文件功能的建议更改。该补丁解决了vignesh C要求的前两个更改，但Gyan无法按最初尝试的方式实现与现有副本服务器的测试。vignesh提供了修改现有测试用例而不是创建新测试用例的指导，特别建议在现有的command_ok测试中添加'--logdir'选项并包含适当的验证。推荐的方法涉及选择当前的pg_createsubscriber测试命令之一，并结合logdir参数以及适当的验证检查。这个迭代审查过程专注于将日志功能集成到现有测试框架中，而不是通过额外的测试基础设施来扩展它。

参与者:
amit.kapila16@gmail.com, euler@eulerto.com, gyan.sreejith@gmail.com, kuroda.hayato@fujitsu.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[集中化 CPU 功能检测](https://www.postgresql.org/message-id/CAN4CZFNKnhVYhLoL9R2+4jeYPVBoCuOHq=SFN_vWkCN8FofnOQ@mail.gmail.com)**
一个集中CPU特性检测的补丁系列已被提交，但出现了编译问题。Zsolt Parragi发现了一些小错误，包括pg_comp_crc32c函数中的不必要分号和提交消息中"initialized"的拼写错误。更重要的是，Tom Lane报告buildfarm动物rhinoceros在0001提交后编译失败。当使用USE_SLICING_BY_8_CRC32C=1构建时出现错误，pg_cpu_x86.c由于未声明的标识符'pg_comp_crc32c'和'pg_comp_crc32c_sse42'而失败。Lane建议使pg_cpu_x86.o无条件构建需要更好地防护那些之前未编译的构建配置。当务之急是修复这些编译错误，以恢复不同配置选项下的构建稳定性。

参与者:
johncnaylorls@gmail.com, nathandbossart@gmail.com, tenistarkim@gmail.com, tgl@sss.pgh.pa.us, zsolt.parragi@percona.com

### **[元组变形的更多加速](https://www.postgresql.org/message-id/CAApHDvodSVBj3ypOYbYUCJX+NWL=VZs63RNBQ_FxB_F+6QXF-A@mail.gmail.com)**
David Rowley发布了他的元组变形加速补丁的v9版本，对实现进行了重大更改。补丁集现在包括在仅获取最大保证列时避免访问元组natts的优化，直接使用pg_rightmost_one_pos32()，并引入了新的补丁0004和0005。补丁0004将slot_getmissingattrs()的责任转移到TupleTableSlotOps.getsomeattrs()函数以启用兄弟调用优化，而0005通过使用位标志并将attcacheoff缩小到int16将CompactAttribute结构体大小从16字节减少到8字节。Amit Langote在TupleDescFinalize()中发现了重复代码，David承认这是重新基准化产生的噪声。Andres Freund支持合并补丁0004作为明显的改进，并建议创建benchmark_tools模块。Zsolt Parragi对前置条件处理和潜在的大端序问题表示担忧，并指出代码中的几个拼写错误。

参与者:
amitlangote09@gmail.com, andres@anarazel.de, dgrowleyml@gmail.com, johncnaylorls@gmail.com, li.evan.chao@gmail.com, zsolt.parragi@percona.com

### **[索引预取](https://www.postgresql.org/message-id/CAH2-Wzmy7NMba9k8m_VZ-XNDZJEUQBU8TeLEeL960-rAKb-+tQ@mail.gmail.com)**
Peter Geoghegan发布了索引预取补丁的第11版，解决了Andres Freund指出的读流yield机制干扰io_combine_limit的性能问题。新版本通过移除"批次距离"测量机制，同时仍在批次边界考虑yield时机，改善了读流yield机制与索引预取的协作。补丁现在会拒绝在扫描初始批次进行yield。第11版还修复了缓存数据上索引专用扫描的性能回归，通过为存储可见性映射信息的批次实现更高效的内存管理，减少palloc开销。此外，新增补丁消除了索引扫描期间的_bt_search栈分配，避免在关键路径中进行内存分配。Geoghegan请求Melanie、Andres或Thomas等开发者对读流方面进行专家评审，承认yield方法仍在开发中，尽管测试结果显示出良好前景。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[提案：使用自动分析阈值的 ANALYZE \(MODIFIED\_STATS\)](https://www.postgresql.org/message-id/CADkLM=dcngh_GLZpQbDgwt_xdnrpwzhWfRqU=ggy-+puwuAbHQ@mail.gmail.com)**
讨论围绕使用autoanalyze阈值为修改过的统计信息实现ANALYZE选项。Corey Huinker探索了创建pg_missing_stats视图，但遇到挑战：为连接暴露pg_class.oid打破了现有模式，视图需要与pg_class进行复杂的自连接以进行适当过滤。他建议替代使用系统函数pg_rel_is_missing_stats(oid)。Sami Imseih认为要求用户从视图/函数编写ANALYZE命令脚本不如简单的ANALYZE选项有吸引力，质疑为什么负担应该落在用户身上而不是提供直接功能。Nathan Bossart反驳说仅仅添加选项错失了集中化和重构autovacuum/autoanalyze优先级代码的机会，这可以一致地惠及多个工具并在系统发展过程中改善可观察性。

参与者:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, nathandbossart@gmail.com, rob@xzilla.net, samimseih@gmail.com, vasukianand0119@gmail.com

### **[\[PATCH\] 支持自动序列复制](https://www.postgresql.org/message-id/CAA4eK1JqGJWjL4G6vvxudhiT8G4RXfaxXNozKDDh+m3GXQ4AKg@mail.gmail.com)**
该补丁通过专用的序列同步worker引入自动序列复制功能，该worker与应用worker并行持续运行。该worker定期检查发布者和订阅者上的序列，仅同步存在差异的序列以最小化开销。关键讨论集中在实现细节上：Amit Kapila建议重用maybe_reread_subscription()处理参数变更，引入SequenceSyncContext进行更好的内存管理，并处理文档更新。Hayato Kuroda提供了详细的代码审查，涵盖事务处理、内存分配和worker生命周期管理。团队讨论了当序列worker激活时REFRESH SEQUENCES的行为 - 是应该强制无条件同步还是只唤醒worker。Dilip Kumar对切换场景提出重要关注，认为虽然自动同步在大多数情况下减少了停机时间，但在关键切换阶段对于频繁修改的序列可能仍需要REFRESH SEQUENCES来保证一致性。已请求对大量序列进行性能测试但尚未提供。

参与者:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, dilipbalaut@gmail.com, itsajin@gmail.com, kuroda.hayato@fujitsu.com, shveta.malik@gmail.com



## **行业新闻**

### **[Anthropic 推出针对企业代理的新举措，推出财务、工程和设计插件](https://techcrunch.com/2026/02/24/anthropic-launches-new-push-for-enterprise-agents-with-plug-ins-for-finance-engineering-and-design)**
Anthropic推出了针对企业客户的新举措，提供配备金融、工程和设计专业插件的AI代理。这为Anthropic扩大其企业客户群提供了重大机会，同时将自己定位为对目前执行这些业务功能的现有SaaS产品的重大威胁。推出这些具有特定领域能力的面向企业的AI代理，展示了Anthropic通过提供AI驱动的替代方案来直接与传统软件解决方案竞争的战略举措。这一发展可能通过为多个部门和行业的核心业务流程提供更集成和智能的解决方案，对现有的SaaS提供商造成潜在颠覆。

### **[OpenAI COO 表示"我们还没有真正看到 AI 渗透到企业业务流程中"](https://techcrunch.com/2026/02/24/openai-coo-says-we-have-not-yet-really-seen-ai-penetrate-enterprise-business-processes)**
OpenAI首席运营官表示，尽管人们普遍预测AI代理将取代传统的SaaS解决方案，但AI尚未显著渗透到企业业务流程中。这一表态是在关于AI是否会颠覆现有软件即服务模式的持续讨论中发表的。虽然市场对AI代理接管业务工作流程进行了大量投机，导致SaaS公司股票出现波动，但在企业环境中的实际实施和采用仍然有限。该首席运营官的评论为当前AI在商业环境中的部署现状提供了洞察，表明尽管技术进步显著，但广泛的企业采用仍在发展中。

### **[Stripe 的估值飙升 74% 至 1590 亿美元](https://techcrunch.com/2026/02/24/stripes-valuation-soars-74-to-159-billion)**
Stripe进行了另一轮要约收购，使其估值大幅增长74%，达到1590亿美元。此次要约收购允许员工向投资者出售股份，参与者包括著名投资公司Thrive Capital、Coatue、Andreessen Horowitz（a16z）以及Stripe自身。这一显著的估值增长显示了投资者对Stripe支付处理平台及其在金融科技领域地位的强烈信心。估值的大幅跳升反映了该公司在在线支付领域的持续增长和市场主导地位，以及投资者对金融科技公司的需求。外部投资者和Stripe自身都参与了要约收购，表明公司与其金融支持者之间的战略一致性。