# PostgreSQL Daily News#68 2026-03-01







## **Popular Hacker Email Discussions**

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CALDaNm11zmAdSg2vOrGJ6KnB3hX34Pd1r2NU7nTXJpN6f-7tqQ@mail.gmail.com)**
The discussion focuses on implementing a "CREATE PUBLICATION ... EXCEPT TABLE" syntax feature for PostgreSQL logical replication. Vignesh C has addressed comments from Amit Kapila in patch v52, including making the TABLE keyword non-optional in the EXCEPT clause to avoid confusion with sequences. Nisha Moond identified several behavioral issues during testing: partition detachment requires manual REFRESH PUBLICATION on subscribers to start replication, while partition attachment stops replication immediately without user notification. For inherited tables, when a child table's inheritance is removed via "NO INHERIT", it remains in the publication's EXCEPT list despite no longer being part of the hierarchy. Vignesh explained this is existing behavior where tables are stored independently in pg_publication_rel regardless of inheritance changes. Amit suggested using errmsg_plural for multiple publications and reorganizing error hints across patches. The team is evaluating whether current inheritance behavior is intentional or needs addressing separately.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[index prefetching](https://www.postgresql.org/message-id/dfabr4ep4evhcifczb47qllxrewz7t4dlalqiazi6c46fz7iv2@e4556vi3s626)**
The discussion centers on Peter Geoghegan's index prefetching patch series for PostgreSQL, with extensive review feedback from Andres Freund. Key technical issues include problems with the yielding mechanism during index scans, where premature yielding reduces IO concurrency and hurts performance. Andres suggests replacing the complex yielding logic with a READ_STREAM_SLOW_START flag and better executor hints about expected scan sizes. 

The patch introduces a new amgetbatch interface replacing amgettuple, allowing index AMs to return batches of matching items for improved prefetching. However, concerns arise about the generic IndexScanBatch structure being too prescriptive for different index types, with suggestions for AM-specific private state areas. Memory management issues are discussed, particularly around buffer pin handling between table and index AMs.

Performance testing reveals inconsistencies, with some configurations showing unexpected results that may relate to system setup (huge pages, buffer pool warming). The fake LSN infrastructure for unlogged tables needs refinement. Several components could be split into separate commits for easier review, including statistics changes and visibility check handling migration from executor to table AM.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me



