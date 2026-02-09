---
layout: post
title: PostgreSQL Daily News 2026-02-09
---

# PostgreSQL Daily News#47 2026-02-09







## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/noqusqxfxqonwymp62o7kiecfjkuh6stpn23ditd3vzua2jdxp@cikr2xwov5ci)**
Andres Freund and Heikki Linnakangas are discussing buffer management optimizations related to WAL logging order and checkpoint handling. Heikki confirmed that patch 0004 switching to standard order in MarkBufferDirtyHint() is correct, eliminating the need to delay checkpoint starts. They're debating the "small window" where unnecessary WAL records might be generated when checkpoints start between buffer dirtying and redo pointer checks. Andres raises concerns about a complex scenario involving full page images (FPI) and torn page writes during checkpoints, suggesting the current conservative approach may be necessary to prevent recovery issues. He outlines a seven-step scenario where insufficient FPI generation could lead to unrecoverable torn pages. Both developers acknowledge potential improvements to reduce WAL spikes during checkpoint starts, though the implementation appears more complicated than initially thought.

Andres Freund和Heikki Linnakangas正在讨论与WAL日志记录顺序和检查点处理相关的缓冲区管理优化。Heikki确认了补丁0004在MarkBufferDirtyHint()中切换到标准顺序是正确的，消除了延迟检查点启动的需要。他们正在讨论在缓冲区变脏和redo指针检查之间启动检查点时可能生成不必要WAL记录的"小窗口"问题。Andres提出了关于涉及全页镜像(FPI)和检查点期间页面撕裂写入的复杂场景的担忧，建议当前的保守方法可能是防止恢复问题所必需的。他概述了一个七步场景，其中FPI生成不足可能导致不可恢复的撕裂页面。两位开发者都认识到减少检查点启动期间WAL峰值的潜在改进，尽管实现看起来比最初想象的更复杂。

Participants - 参与者:
* andres@anarazel.de
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* melanieplageman@gmail.com
* michael.paquier@gmail.com
* noah@leadboat.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* thomas.munro@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAA4eK1J9=vfNYU=K=0pfEf=b8iZFB0FGocCOpJL1tdTY-g94uw@mail.gmail.com)**
The discussion centers on v41 patch addressing schema change skipping in publications. shveta malik identified an issue where table-sync and incremental-sync replicate different table sets when subscribers use multiple publications with conflicting EXCEPT clauses and different PUBLISH_VIA_PARTITION_ROOT values. The test case demonstrates problems combining publications like pub1 (ALL TABLES EXCEPT with PUBLISH_VIA_PARTITION_ROOT=true) and pub2 (ALL TABLES EXCEPT with PUBLISH_VIA_PARTITION_ROOT=false). Amit Kapila proposes disallowing such contradictory publication combinations, similar to existing restrictions for column lists, suggesting that combining conflicting publications should result in an ERROR. The team needs to decide the behavior for Approach1 when handling these conflicting publication scenarios.

讨论围绕解决发布中模式更改跳过问题的v41补丁展开。shveta malik发现了一个问题，当订阅者使用具有冲突EXCEPT子句和不同PUBLISH_VIA_PARTITION_ROOT值的多个发布时，表同步和增量同步会复制不同的表集。测试用例演示了合并发布时的问题，例如pub1（ALL TABLES EXCEPT且PUBLISH_VIA_PARTITION_ROOT=true）和pub2（ALL TABLES EXCEPT且PUBLISH_VIA_PARTITION_ROOT=false）。Amit Kapila建议禁止这种矛盾的发布组合，类似于列列表的现有限制，认为合并冲突的发布应该导致错误。团队需要决定Approach1在处理这些冲突发布场景时的行为。

Participants - 参与者:
* 1518981153@qq.com
* amit.kapila16@gmail.com
* barwick@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* dilipbalaut@gmail.com
* houzj.fnst@fujitsu.com
* shlok.kyal.oss@gmail.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com
* vignesh21@gmail.com



