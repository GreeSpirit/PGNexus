# PostgreSQL 每日更新#68 2026-03-01







## **热门 Hacker 邮件讨论精选**

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CALDaNm11zmAdSg2vOrGJ6KnB3hX34Pd1r2NU7nTXJpN6f-7tqQ@mail.gmail.com)**
讨论重点是为PostgreSQL逻辑复制实现"CREATE PUBLICATION ... EXCEPT TABLE"语法功能。Vignesh C在补丁v52中解决了Amit Kapila的评论，包括在EXCEPT子句中将TABLE关键字设为非可选，以避免与序列混淆。Nisha Moond在测试期间发现了几个行为问题：分区分离需要在订阅者上手动执行REFRESH PUBLICATION才能开始复制，而分区附加会立即停止复制且不通知用户。对于继承表，当通过"NO INHERIT"移除子表的继承关系时，它仍然保留在发布的EXCEPT列表中，尽管不再是层次结构的一部分。Vignesh解释这是现有行为，表在pg_publication_rel中独立存储，不受继承关系变化影响。Amit建议对多个发布使用errmsg_plural，并重新组织各补丁间的错误提示。团队正在评估当前继承行为是有意的还是需要单独解决。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[索引预取](https://www.postgresql.org/message-id/dfabr4ep4evhcifczb47qllxrewz7t4dlalqiazi6c46fz7iv2@e4556vi3s626)**
讨论围绕Peter Geoghegan为PostgreSQL开发的索引预取补丁系列展开，Andres Freund提供了大量审查反馈。主要技术问题包括索引扫描期间的让出机制问题，过早让出会降低IO并发性并损害性能。Andres建议用READ_STREAM_SLOW_START标志和更好的执行器关于预期扫描大小的提示来替代复杂的让出逻辑。

补丁引入了新的amgetbatch接口来替代amgettuple，允许索引AM返回匹配项的批次以改善预取。然而，对于通用IndexScanBatch结构对不同索引类型过于规定性存在担忧，建议为AM提供特定的私有状态区域。讨论了内存管理问题，特别是表AM和索引AM之间的缓冲区pin处理。

性能测试显示不一致性，某些配置显示出可能与系统设置（huge pages、缓冲池预热）相关的意外结果。未记录表的假LSN基础设施需要完善。几个组件可以拆分为独立提交以便于审查，包括统计更改和可见性检查处理从执行器迁移到表AM。

参与者:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me



