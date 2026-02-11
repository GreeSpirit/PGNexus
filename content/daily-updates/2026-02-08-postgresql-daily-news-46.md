# PostgreSQL Daily News#46 2026-02-08







## **Popular Hacker Email Discussions**

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/68e89de8-5f6c-4eaf-a800-e16a5e487667@iki.fi)**
Heikki Linnakangas provides detailed review feedback on Andres Freund's buffer locking patch series (v12). He approves the overall approach but offers several improvement suggestions. For patch 0001 regarding heap_inplace_update_and_unlock(), he notes the code looks correct but suggests clarifying an orphaned "memcpy" reference in comments by better explaining the temporary buffer copy mechanism. For patch 0004 on MarkBufferDirtyHint() WAL logging order changes, he confirms the approach is sound and discusses the "small window" optimization, noting it's part of a broader conservative strategy. Additional minor nitpicks include questioning the removal of a hint-related comment in _bt_killitems(), requesting better documentation for BufferSetHintBits16() function parameters, clarifying buffer header lock release references, removing redundant comments about LSN safety, and making SharedBufferBeginSetHintBits() return value semantics more explicit. Overall assessment remains positive with these refinements needed.

Participants:
andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/9ac6082a-2e30-4462-a260-1507452aa962@iki.fi)**
Heikki Linnakangas reviewed patch v20260128 for changing shared_buffers without restart, focusing on the memory and address space management component. The patch introduces a "segment id" concept that allows specifying different segments for shared memory structures, with resizable segments supported through ShmemResizeStructInSegment(). However, Heikki questions the practical usage of multiple structs within the same segment and how resizing would work in such cases. He suspects there's an implicit assumption that resizable structs must be the only struct in their segment. To simplify the API, he proposes hiding segment IDs from callers and using a resizeable flag in ShmemInitStructExt() instead, where shmem.c would internally manage separate segments for resizable structures. He requests a standalone test module to demonstrate the resizable shared memory segment interface.

Participants:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoYbzXRuj5NgQH9gE1tksz3suK0RaES3QKQ=SKqyPi8TPA@mail.gmail.com)**
Robert Haas posted version 14 of the pg_plan_advice patch set after implementing a comprehensive testing framework that plans regression test queries twice - first to generate advice, then replanning with that advice. This revealed multiple issues requiring fixes. The patch set now includes fixes for PGS_CONSIDER_NONPARTIAL interaction with Materialize nodes, adds cursorOptions parameter to planner_setup_hook, and addresses problems with debug_parallel_query interactions. Key improvements include making pg_plan_advice only clear pgs_mask bits rather than set them to work additively with enable_SOMETHING=false settings, adding a disabled flag to IndexOptInfo to avoid hiding indexes completely, and fixing add_partial_path's failure to consider startup costs. The testing methodology successfully identified planner issues without breaking extensive functionality, demonstrating the robustness of the approach while revealing specific areas needing attention.

Participants:
alexandra.wang.oss@gmail.com, david.g.johnston@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us



