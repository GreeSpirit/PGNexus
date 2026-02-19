# PostgreSQL Daily News#54 2026-02-15







## **Popular Hacker Email Discussions**

### **[Interrupts vs signals](https://www.postgresql.org/message-id/be6nxpkifw7kud4qxax4rzcfstg6r2uiynyugeu7jmxmbluy7b@4tnuf2khtmis)**
Andres Freund provides detailed feedback on Heikki Linnakangas's massive interrupt system rework patch. The patch replaces PostgreSQL's signal-based interrupt handling with a new 64-bit interrupt mask system, allowing more granular control over different interrupt types (config reload, query cancel, shutdown, etc.). Andres raises several technical concerns: 64-bit atomics may not be signal-safe on all platforms due to potential spinlock emulation, suggesting splitting into two 32-bit words instead. He questions the safety of some signal handler replacements and suggests moving timeout handlers to use the new interrupt system. Performance concerns are noted for the new CHECK_FOR_INTERRUPTS() implementation, recommending consolidating interrupt variables into a single struct. Andres also suggests making interrupt masking more stack-based rather than just using hold/resume counters. Various code review issues are identified including potential re-entrancy problems in interrupt handlers, inefficient bit manipulation loops, and missing assertions. The review covers extensive changes across the codebase converting from signal-based to interrupt-based mechanisms.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, masao.fujii@gmail.com, michael@paquier.xyz, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[Speed up COPY TO text/CSV parsing using SIMD](https://www.postgresql.org/message-id/CA+K2Rum_QTZqTUrdMOL5hr-OOpCwGR_9Nj1z15BFObjktMOY6A@mail.gmail.com)**
KAZAR Ayoub is working on a SIMD optimization patch for PostgreSQL's COPY TO text/CSV parsing. Andres Freund raised concerns about performance overhead from adding strlen() calls, particularly for short columns with many attributes. Ayoub responded with benchmark results showing the optimization reduces strlen() calls to a maximum of two per attribute but causes significant regressions in worst-case scenarios: 17% for TEXT format and 3% for CSV format when testing tables with 100-1000 integer columns. Andres also suggested refactoring the existing code into static inline helper functions before introducing SIMD optimizations. Ayoub implemented this suggestion but expressed uncertainty about the placement and whether the performance tradeoffs are acceptable.

Participants:
andres@anarazel.de, andrew@dunslane.net, byavuz81@gmail.com, ma_kazar@esi.dz, manni.wood@enterprisedb.com, markwkm@gmail.com, nathandbossart@gmail.com, neil.conway@gmail.com, shinya11.kato@gmail.com



