---
layout: post
title: PostgreSQL Daily News 2026-02-01
---

# PostgreSQL Daily News#37 2026-02-01







## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[Add \-\-system\-identifier / \-s option to pg\_resetwal](https://www.postgresql.org/message-id/CAM527d_xUH0Jug0Kf29Mt+tL89DoqANc6ZOit+BCy+x6GOwPgw@mail.gmail.com)**
Nikolay Samokhvalov submitted v3 of a patch adding a --system-identifier option to pg_resetwal, addressing reviewer feedback. Changes include using "Database system identifier" label for consistency, switching to PRIu64 for gettext compatibility, reordering getopt array entries, and fixing tests to use pg_controldata instead of pg_control_system(). Fujii Masao questioned the need for explicit system identifier setting versus auto-generation. Samokhvalov defended the explicit approach as providing full flexibility for edge cases like reproducible test environments and coordinating multiple clones, arguing that expert pg_resetwal users benefit from additional control options even when auto-generation would suffice for most scenarios.

Nikolay Samokhvalov提交了为pg_resetwal添加--system-identifier选项的v3补丁，解决了审核者的反馈。更改包括使用"Database system identifier"标签保持一致性，切换到PRIu64以兼容gettext，重新排序getopt数组条目，以及修复测试使用pg_controldata而非pg_control_system()。Fujii Masao质疑是否需要显式设置系统标识符而非自动生成。Samokhvalov为显式方法辩护，认为它为边缘情况（如可重现的测试环境和协调多个克隆）提供了完全的灵活性，论证专家级pg_resetwal用户即使在自动生成能满足大多数场景时也能从额外的控制选项中受益。

Participants - 参与者:
* amborodin@acm.org
* masao.fujii@oss.nttdata.com
* michael@paquier.xyz
* nik@postgres.ai
* peter@eisentraut.org
* wolakk@gmail.com

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/CAP53PkyooCeR8YV0BUD_xC7oTZESHz8OdA=tP7pBRHFVQ9xtKg@mail.gmail.com)**
Lukas Fittl has reworked the RDTSC patch for reducing EXPLAIN ANALYZE timing overhead, introducing a "fast_clock_source" GUC with values "auto", "rdtsc", and "off". The patch uses GUC check/assign mechanisms instead of initialization in PostmasterMain, with "auto" defaulting to RDTSC on Linux x86 systems using TSC clocksource. Key changes include allowing runtime GUC changes, unified RDTSC/RDTSCP handling requiring both instructions, and pg_test_timing integration. Performance testing shows significant improvements: execution time dropped from 44.8ms to 33.9ms with RDTSC enabled. Open questions remain about CI test timeouts and performance overhead in pg_ticks_to_ns when fast clock source is disabled, suggesting need for conditional optimization.

Lukas Fittl重新设计了用于减少EXPLAIN ANALYZE时序开销的RDTSC补丁，引入了"fast_clock_source" GUC参数，可设置为"auto"、"rdtsc"和"off"。该补丁使用GUC检查/分配机制而非在PostmasterMain中初始化，"auto"选项在使用TSC时钟源的Linux x86系统上默认启用RDTSC。主要变更包括允许运行时修改GUC、统一RDTSC/RDTSCP处理需要两个指令都可用，以及pg_test_timing集成。性能测试显示显著改进：启用RDTSC后执行时间从44.8ms降至33.9ms。仍存在CI测试超时和禁用快速时钟源时pg_ticks_to_ns性能开销等未解决问题，建议需要条件优化。

Participants - 参与者:
* andres@anarazel.de
* geidav.pg@gmail.com
* hannuk@google.com
* ibrar.ahmad@gmail.com
* lukas@fittl.com
* m.sakrejda@gmail.com
* michael@paquier.xyz
* pavel.stehule@gmail.com
* robertmhaas@gmail.com
* vignesh21@gmail.com

### **[ABI Compliance Checker GSoC Project](https://www.postgresql.org/message-id/8ABEC1CD-673A-4AC3-AD7D-6178F7A171E0@justatheory.com)**
The discussion centers on resolving issues with the ABI Compliance Checker system in PostgreSQL's continuous integration. Tom Lane reports that the crake buildfarm machine is now green except for the v14 branch, which needs manual cache-flushing because Dean didn't push the necessary .abi-compliance-history addition. David E. Wheeler suggests adding --drop-private-types and --headers-dir flags to abidiff to improve filtering. Tom Lane responds that these switches likely don't work when abidiff processes already-summarized ABI data rather than raw executables. Wheeler tests the suggestion but discovers the correct flags are --headers-dir1 and --headers-dir2, not --headers-dir, and that previous build headers aren't available. He proposes trying just --drop-private-types as an alternative solution.

讨论围绕解决PostgreSQL持续集成中ABI Compliance Checker系统的问题。Tom Lane报告说crake构建农场机器现在除了v14分支外都是绿色的，v14分支需要手动清除缓存，因为Dean没有推送必要的.abi-compliance-history添加。David E. Wheeler建议在abidiff中添加--drop-private-types和--headers-dir标志来改善过滤。Tom Lane回应说这些开关在abidiff处理已经总结的ABI数据而不是原始可执行文件时可能不起作用。Wheeler测试了这个建议，但发现正确的标志是--headers-dir1和--headers-dir2，而不是--headers-dir，并且之前的构建头文件不可用。他建议尝试仅使用--drop-private-types作为替代解决方案。

Participants - 参与者:
* andres@anarazel.de
* andrew@dunslane.net
* david@justatheory.com
* dean.a.rasheed@gmail.com
* mankiratsingh1315@gmail.com
* tgl@sss.pgh.pa.us

### **[PATCH: jsonpath string methods: lower, upper, initcap, l/r/btrim, replace, split\_part](https://www.postgresql.org/message-id/DB26FD47-DF09-4A92-AA15-08F012ED0DE2@justatheory.com)**
David E. Wheeler has rebased his patch adding jsonpath string methods (lower, upper, initcap, l/r/btrim, replace, split_part) on commit 6918434. The patch has received multiple reviews, most recently from jian, and Wheeler is requesting to change its Commitfest status from "Needs review" to "Ready for Committer". Florents Tselai agrees it's ready for committer review but notes the attachment was missing from Wheeler's message and provided it. Tselai acknowledges the refactoring work done across parser and executor, suggesting future string methods could be added easily but should be kept for later iterations. Both developers anticipate ongoing discussions about potential conflicts with future SQL/JSON standard developments, a recurring challenge when extending JSONPath language functionality.

David E. Wheeler已将其添加jsonpath字符串方法(lower、upper、initcap、l/r/btrim、replace、split_part)的补丁重新基于提交6918434。该补丁已经收到多次审查，最近一次来自jian，Wheeler请求将其Commitfest状态从"需要审查"改为"准备提交者审查"。Florents Tselai同意该补丁已准备好进行提交者审查，但注意到Wheeler消息中缺少附件并提供了该附件。Tselai认可了在解析器和执行器方面所做的重构工作，建议未来的字符串方法可以轻松添加但应保留给后续迭代。两位开发者都预期会持续讨论与未来SQL/JSON标准发展的潜在冲突问题，这是扩展JSONPath语言功能时面临的持续挑战。

Participants - 参与者:
* aekorotkov@gmail.com
* alvherre@kurilemu.de
* andrew@dunslane.net
* david@justatheory.com
* florents.tselai@gmail.com
* jian.universality@gmail.com
* li.evan.chao@gmail.com
* peter@eisentraut.org
* robertmhaas@gmail.com
* tgl@sss.pgh.pa.us

### **[POC: enable logical decoding when wal\_level = 'replica' without a server restart](https://www.postgresql.org/message-id/CAEze2Wg9fWze9dA3GssLVP_TZNV0DqdNq2Td8XZ5XHJtqA1SDw@mail.gmail.com)**
This discussion centers on a proposal to dynamically enable logical decoding when wal_level is set to 'replica' without requiring a server restart. The core concern raised by Matthias van de Meent is that allowing users with REPLICATION privilege to effectively control wal_level creates uncontrolled performance impacts. Unlike physical replication slots that can be isolated from other workloads, changing to logical WAL level adds mandatory overhead to all write operations, including identity column tracking and increased WAL generation. Amit Kapila argues that REPLICATION privilege users are already highly trusted with access to all data and can cause system issues, making this an incremental addition. Proposed solutions include using max_replication_slots limits or introducing max_logical_replication_slots, though Matthias suggests a wal_level=dynamic setting might be preferable to prevent privilege escalation of performance control.

这个讨论的核心是一个提议，即在wal_level设置为'replica'时动态启用逻辑解码，而无需重启服务器。Matthias van de Meent提出的核心担忧是，允许具有REPLICATION权限的用户有效控制wal_level会产生无法控制的性能影响。与可以从其他工作负载中隔离的物理复制槽不同，更改为逻辑WAL级别会对所有写操作添加强制性开销，包括身份列跟踪和增加的WAL生成。Amit Kapila认为REPLICATION权限用户已经是高度受信任的，可以访问所有数据并可能导致系统问题，因此这只是一个增量添加。提出的解决方案包括使用max_replication_slots限制或引入max_logical_replication_slots，尽管Matthias建议wal_level=dynamic设置可能更好，以防止性能控制的权限提升。

Participants - 参与者:
* amit.kapila16@gmail.com
* ashutosh.bapat.oss@gmail.com
* bertranddrouvot.pg@gmail.com
* boekewurm+postgres@gmail.com
* kuroda.hayato@fujitsu.com
* sawada.mshk@gmail.com
* shlok.kyal.oss@gmail.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAGECzQR5jC+yo=cmMZkNPx_x5FijXmnFXngxjNTmxNyBsRwxJw@mail.gmail.com)**
The discussion continues on implementing protocol version greasing in libpq. Jelte Fennema-Nio expresses appreciation for Jacob Champion's randomization approach, particularly the ability to send multiple grease parameters, but agrees that minor version randomization may not be worth the maintenance cost. Jelte has changed his opinion about including a `max_protocol_version=grease` option for production use, citing a recent bug in PgBouncer's NegotiateProtocolVersion implementation that could have been caught with such testing capability. He argues this would provide valuable test coverage for PostgreSQL's NegotiateProtocolVersion logic. The participants also discuss documentation formatting preferences, with David Johnston favoring a two-table approach over combined tables for protocol parameter documentation, and suggesting that reserved parameter naming conventions be moved to introductory text rather than tabular format.

关于在libpq中实现协议版本greasing的讨论继续进行。Jelte Fennema-Nio对Jacob Champion的随机化方法表示赞赏，特别是发送多个grease参数的能力，但同意次版本随机化可能不值得维护成本。Jelte改变了关于在生产环境中包含`max_protocol_version=grease`选项的看法，他引用了PgBouncer的NegotiateProtocolVersion实现中最近发现的一个bug，这个bug本可以通过这种测试功能发现。他认为这将为PostgreSQL的NegotiateProtocolVersion逻辑提供有价值的测试覆盖。参与者还讨论了文档格式偏好，David Johnston倾向于使用两个表格而不是组合表格来记录协议参数，并建议将保留参数命名约定移到介绍性文本中，而不是表格格式。

Participants - 参与者:
* andres@anarazel.de
* david.g.johnston@gmail.com
* hlinnaka@iki.fi
* jacob.champion@enterprisedb.com
* postgres@jeltef.nl
* robertmhaas@gmail.com

### **[AIX support](https://www.postgresql.org/message-id/aX2FrC5J5d1-tqvH@paquier.xyz)**
Michael Paquier has created a patch to address AIX support issues in PostgreSQL. Aditya Kamath from IBM tested the patch on an AIX setup and confirmed it works correctly, specifically resolving include-path problems that were affecting the build process. Michael acknowledged the positive feedback and indicated he plans to revisit the patch early next week with additional testing in the continuous integration environment. The discussion appears to be progressing toward finalizing the AIX compatibility fixes, with successful validation from the AIX testing team providing confidence in the proposed solution.

Michael Paquier 为解决 PostgreSQL 中的 AIX 支持问题创建了一个补丁。来自 IBM 的 Aditya Kamath 在 AIX 设置上测试了该补丁并确认其工作正常，特别是解决了影响构建过程的 include-path 问题。Michael 确认了这一积极反馈，并表示计划在下周初重新审视该补丁，并在持续集成环境中进行更多测试。讨论似乎正朝着完成 AIX 兼容性修复的方向进展，AIX 测试团队的成功验证为提议的解决方案提供了信心。

Participants - 参与者:
* aditya.kamath1@ibm.com
* andres@anarazel.de
* hlinnaka@iki.fi
* michael@paquier.xyz
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* robertmhaas@gmail.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io