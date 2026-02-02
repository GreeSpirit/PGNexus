---
layout: post
title: PostgreSQL Daily News 2026-02-02
---

# PostgreSQL Daily News#39 2026-02-02







## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[AIX support](https://www.postgresql.org/message-id/aX_nrdhcPJvXS8v3@paquier.xyz)**
Michael Paquier has committed a patch to fix AIX support issues in PostgreSQL. The patch was tested by Aditya Kamath on AIX systems and confirmed to work correctly, resolving include-path problems. Michael conducted additional testing and successfully committed the changes to branches down to v17. Some minor conflicts occurred during backporting to v18 and v17 due to the absence of guc_tables.inc.c in those versions, but these were manageable. The patch has been validated through continuous integration testing across all branches, along with local testing for both meson and configure build systems, including VPATH configurations. Michael has requested feedback from the community if anyone encounters issues with the committed changes.

Michael Paquier已经提交了一个修复PostgreSQL中AIX支持问题的补丁。该补丁由Aditya Kamath在AIX系统上测试并确认工作正常，解决了include-path问题。Michael进行了额外测试并成功将更改提交到v17及以上分支。在向v18和v17分支回移时出现了一些小的冲突，因为这些版本中不存在guc_tables.inc.c文件，但这些冲突是可以处理的。该补丁已通过所有分支的持续集成测试验证，同时还进行了meson和configure构建系统的本地测试，包括VPATH配置。Michael请求社区如果遇到任何问题请提供反馈。

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

### **[\[Proposal\] Adding Log File Capability to pg\_createsubscriber](https://www.postgresql.org/message-id/CAEqnbaVgFU2Pr=xhhDmA=sK7XPBDBxECovqbSht91ZbHmnteUg@mail.gmail.com)**
Gyan Sreejith has submitted an updated patch for adding log file capability to pg_createsubscriber, incorporating feedback from vignesh C. The changes include removing trailing newlines from log messages to avoid assertion failures, adding error checking for directory creation, implementing fflush after fprintf to prevent log content loss during abrupt failures, and moving the log file closure to prevent losing cleanup logs. Vignesh C provided detailed code review comments addressing potential issues with assertion failures in pg_log_generic_v, unchecked directory creation that could fail, missing fflush operations that might lose log data, premature log file closure that would lose error flow logs, and suggested refactoring the populate_timestamp function by moving its code directly to the caller since it has only one usage.

Gyan Sreejith提交了为pg_createsubscriber添加日志文件功能的更新补丁，采纳了vignesh C的反馈意见。修改包括删除日志消息中的尾随换行符以避免断言失败，为目录创建添加错误检查，在fprintf后实现fflush以防止在突然失败时丢失日志内容，以及移动日志文件关闭位置以防止丢失清理日志。vignesh C提供了详细的代码审查意见，指出了pg_log_generic_v中潜在的断言失败问题，未检查的目录创建可能失败，缺少fflush操作可能导致日志数据丢失，过早的日志文件关闭会丢失错误流日志，并建议重构populate_timestamp函数，将其代码直接移到调用者中，因为它只有一个使用场景。

Participants - 参与者:
* amit.kapila16@gmail.com
* euler@eulerto.com
* gyan.sreejith@gmail.com
* kuroda.hayato@fujitsu.com
* smithpb2250@gmail.com
* vignesh21@gmail.com

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/045cf632-1354-4d42-a8ea-cc02eaa80d68@postgrespro.ru)**
The discussion focuses on a patch addressing an issue where the walsender process exits before confirming remote flush in logical replication. Andrey Silitskiy has updated the patch based on reviewer feedback and fixed a cfbot documentation error. The thread involves multiple PostgreSQL contributors including maintainers and developers from various organizations. The patch appears to be addressing a timing issue in the logical replication protocol where the walsender might terminate prematurely, potentially causing data consistency problems. The fix likely involves ensuring proper synchronization between the walsender and subscriber processes before allowing the walsender to exit. The patch is currently under review with active collaboration between contributors to refine the implementation.

讨论聚焦于一个补丁，该补丁解决了逻辑复制中walsender进程在确认远程刷新之前退出的问题。Andrey Silitskiy根据审查者的反馈更新了补丁，并修复了cfbot文档错误。该讨论涉及多个PostgreSQL贡献者，包括来自各个组织的维护者和开发者。该补丁似乎正在解决逻辑复制协议中的时序问题，即walsender可能过早终止，可能导致数据一致性问题。修复方案可能涉及在允许walsender退出之前确保walsender和订阅者进程之间的适当同步。该补丁目前正在审查中，贡献者们正在积极协作以完善实现。

Participants - 参与者:
* a.silitskiy@postgrespro.ru
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* andres@anarazel.de
* dilipbalaut@gmail.com
* horikyota.ntt@gmail.com
* htamfids@gmail.com
* kuroda.hayato@fujitsu.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* osumi.takamichi@fujitsu.com
* peter.eisentraut@enterprisedb.com
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[Document NULL](https://www.postgresql.org/message-id/CAEG8a3+wqhs3jUVQw3ETOkuwOaePp-ZU1Ru7PaWfvzuCE1Q7GQ@mail.gmail.com)**
Discussion continues on David G. Johnston's NULL documentation patch (v13). Junwang Zhao raises concerns about extensive LLM prompts and agent instructions embedded in the patch comments, questioning whether such content should be committed to the PostgreSQL source tree. These appear to be detailed directives for automated testing or validation of documentation examples, including specific formatting rules for SQL NULL literals, column headers, and psql output matching. Meanwhile, Marcos Pegoraro suggests restructuring the documentation by splitting the initial programlisting section into separate parts for CREATE/INSERT statements and psql-specific commands, with clearer explanations about client-dependent NULL display formatting. The discussion addresses both technical documentation structure and the appropriateness of including AI-related metadata in official documentation.

关于David G. Johnston的NULL文档补丁（v13版本）的讨论仍在继续。Junwang Zhao对补丁注释中嵌入的大量LLM提示和代理指令表示担忧，质疑这些内容是否应该提交到PostgreSQL源码树中。这些内容似乎是用于文档示例自动化测试或验证的详细指令，包括SQL NULL字面量、列标题和psql输出匹配的特定格式规则。与此同时，Marcos Pegoraro建议重构文档结构，将初始的programlisting部分拆分为CREATE/INSERT语句和psql专用命令两个独立部分，并更清晰地解释客户端相关的NULL显示格式。讨论涉及技术文档结构和在官方文档中包含AI相关元数据的适当性问题。

Participants - 参与者:
* alvherre@kurilemu.de
* david.g.johnston@gmail.com
* dgrowleyml@gmail.com
* jian.universality@gmail.com
* li.evan.chao@gmail.com
* marcos@f10.com.br
* nagata@sraoss.co.jp
* peter@eisentraut.org
* pgsql@j-davis.com
* tgl@sss.pgh.pa.us
* zhjwpku@gmail.com

### **[PATCH: jsonpath string methods: lower, upper, initcap, l/r/btrim, replace, split\_part](https://www.postgresql.org/message-id/D81098C5-CB6D-47BE-995B-A451BE396525@justatheory.com)**
A patch adding string manipulation methods (lower, upper, initcap, l/r/btrim, replace, split_part) to PostgreSQL's jsonpath functionality has reached completion for its review phase. David E. Wheeler has updated the patch status to indicate it's ready for committer review, marking a milestone in the development process. The patch appears to have gone through sufficient testing and refinement based on feedback from multiple contributors. The discussion thread involved ten participants, suggesting thorough community review. The patch is now awaiting final evaluation by a PostgreSQL committer who will decide whether to accept it for inclusion in a future release.

一个为PostgreSQL的jsonpath功能添加字符串操作方法（lower、upper、initcap、l/r/btrim、replace、split_part）的补丁已完成审查阶段。David E. Wheeler已更新补丁状态，表明它已准备好接受提交者审查，这标志着开发过程中的一个里程碑。根据多个贡献者的反馈，该补丁似乎已经经过了充分的测试和完善。讨论线程涉及十名参与者，表明经过了彻底的社区审查。该补丁现在正等待PostgreSQL提交者的最终评估，提交者将决定是否接受它以包含在未来的版本中。

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