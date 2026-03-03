# PostgreSQL Daily News#70 2026-03-03







## **Popular Hacker Email Discussions**

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/CAAKRu_Y1MuANdm1p47Ev13Y9EQz8z+pw-vHOh=3DVdahUTjgXg@mail.gmail.com)**
Melanie Plageman posted version 35 of her patch series addressing feedback from Andres Freund about eliminating xl_heap_visible WAL records and eventually setting the visibility map on-access. Key changes include always pinning the vmbuffer during pruning in heap_page_prune_opt() and checking for VM corruption even when not setting the VM. The series now moves corruption checks to the beginning of heap_page_prune_and_freeze() and adds detection for additional tuple states like RECENTLY_DEAD and INSERT_IN_PROGRESS. A new fast path bypasses pruning/freezing when pages are already all-visible, though this may miss corruption cases with dead tuples on frozen pages. The patch restructures freeze horizon tracking to maintain all horizons consistently, addressing Andres's concerns about error-prone optimizations. Additional improvements include renaming confusingly-named PruneState fields, proper conflict XID handling for combined freeze/VM operations, and infrastructure for tracking modified relations in the executor state to support future on-access VM setting without expensive freezing operations.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, melanieplageman@gmail.com, reshkekirill@gmail.com, robertmhaas@gmail.com, x4mmm@yandex-team.ru, xunengzhou@gmail.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CAKFQuwYu+30BK9-7zwSR1TBdcFBY1BDezgcXtusm2VHWvrOrRA@mail.gmail.com)**
David G. Johnston is providing detailed documentation review feedback for the pg_plan_advice feature in version 18. His review focuses on improving consistency between README and SGML documentation, particularly around join strategy advice labels and partitionwise descriptions. He suggests renaming modules to pg_advice_{plan,collect,stash} for better sorting and proposes using "entries" terminology throughout for brevity. Johnston recommends that pg_set_stashed_advice return meaningful status codes instead of void, and suggests adding error handling for NULL query_id and stash_name inputs. He also proposes adding comment functionality to advice strings and export/import functions for better usability, given the volatile nature of the stored content.

Participants:
alexandra.wang.oss@gmail.com, david.g.johnston@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Areas for Solaris support modernization](https://www.postgresql.org/message-id/470305.1772417108@sss.pgh.pa.us)**
Tom Lane discovered issues with PostgreSQL's Solaris support while working with the icarus buildfarm member running OpenIndiana/Illumos. The main problem was semaphore creation failures during parallel test execution due to insufficient SEMMNI/SEMMNS limits. Lane proposed switching to unnamed POSIX semaphores, which work reliably on recent OpenIndiana, similar to the recent AIX change. He also identified that ps_status.c wasn't displaying proper process titles for child processes, initially attributing this to code removed in commit d2ea2d310. Lane created a patch reverting PS_USE_CHANGE_ARGV functionality for Solaris, using the __sun macro for detection. Greg Burd agreed to test the patches on icarus. However, Lane later discovered that after updating to current OpenIndiana, the ps_status issue resolved itself without patches, suggesting it may have been a temporary bug in the ps command rather than a PostgreSQL issue.

Participants:
greg@burd.me, tgl@sss.pgh.pa.us, thomas.munro@gmail.com

### **[index prefetching](https://www.postgresql.org/message-id/CAE8JnxOJ48NU3rwW+gS67NUDKgxDS5pKNUywbUBGCBJkgUf+Hg@mail.gmail.com)**
The discussion centers on improving PostgreSQL's index prefetching feature, particularly addressing distance adjustment algorithms. Alexandre Felipe proposes creating a self-balancing mechanism that dynamically adjusts prefetch distance based on I/O timing and buffer consumption patterns. He suggests moving away from exponential distance increases to incremental adjustments based on I/O concurrency limits, and presents both time-agnostic and time-aware models for better prefetch optimization.

Tomas Vondra provides feedback on the hardware testing setup and explains limitations of the current distance heuristics, noting that the patch is already too large for major changes in the current cycle. He clarifies that distance determines look-ahead scope rather than concurrent I/O count, which is limited by effective_io_concurrency.

Andres Freund offers practical solutions to the distance oscillation problem, suggesting modifications to increase/decrease logic with minimum distance thresholds and cooloff counters. However, he demonstrates through benchmarks that maintaining higher minimum distances creates performance penalties for fully cached workloads due to increased buffer lookup and pinning overhead. He proposes potential optimizations including expanding REFCOUNT_ARRAY_ENTRIES and replacing dynahash with simplehash to reduce performance cliffs.

The key unresolved issue remains balancing prefetch effectiveness against overhead in cached scenarios.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[\[PATCH\] psql: tab completion for ALTER ROLE \.\.\. IN DATABASE \.\.\.](https://www.postgresql.org/message-id/202603021705.hurfwmxfd6l4@alvherre.pgsql)**
Álvaro Herrera has pushed a patch for psql tab completion of ALTER ROLE ... IN DATABASE commands, but excluded the RESET completion functionality as it wasn't ready. The pushed version removed unnecessary comments and braces from what appeared to be LLM-generated code. The rejected RESET completion attempted to query pg_db_role_setting to suggest parameter names but had several issues: it was too complex for the auto-generated code section, lacked proper schema qualification for function calls, used inappropriate memory management functions, and had broken behavior when multiple matching parameters exist. Herrera suggests either creating a separate function or enhancing the completion system to handle this complexity properly.

Participants:
alvherre@kurilemu.de, barwick@gmail.com, dharinshah95@gmail.com, robertmhaas@gmail.com, suryapoondla4@gmail.com, tgl@sss.pgh.pa.us, vasukianand0119@gmail.com, zengman@halodbtech.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAJpy0uCr15=dxg+bmGeJUoNfKOHU2xZd2Wa6hg=YNTnQzz2fcA@mail.gmail.com)**
The patch for adding EXCEPT TABLE clause to PostgreSQL publications is undergoing code review. Version 53 was reviewed by multiple contributors. Shveta Malik identified several issues including problems with sequence handling that could trigger assertions, unnecessary code duplication in get_rel_sync_entry(), and unused functions. Amit Kapila found issues with error message quoting patterns and questioned why exception publication IDs are collected for all ancestors instead of just the root table. Nisha Moond tested partition and inheritance behavior, finding that detached partitions and inheritance changes require manual REFRESH PUBLICATION commands, which may need documentation clarification. The team discussed syntax decisions, confirming that both the TABLE keyword and parentheses will be mandatory after EXCEPT for future extensibility. Shlok Kyal addressed the feedback and released version 54 with fixes for the identified issues.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Optional skipping of unchanged relations during ANALYZE?](https://www.postgresql.org/message-id/CAE2r8H7hYGYi4QM85Q7bxs4RbT0Vn63c9ONFbwhAjuSGDzah_A@mail.gmail.com)**
Vasuki M has revised a patch for optional skipping of unchanged relations during ANALYZE based on detailed feedback from Robert, Sami, and Ilia. The patch now separates two distinct use cases: MISSING_STATS_ONLY (catalog-driven, persistent) and MODIFIED_STATS (threshold-based, transient). Key improvements include eliminating duplicate examine_attribute() calls by integrating missing-statistics checks directly into the function, expanding test coverage, and improving logging behavior to match existing ANALYZE semantics. The MISSING_STATS_ONLY feature now performs per-attribute pg_statistic lookups and skips columns with existing statistics. A separate CommitFest entry has been created, and MODIFIED_STATS will be handled as a separate patch and discussion thread.

Participants:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com



## **Industry News**

### **[Anthropic's Claude reports widespread outage](https://techcrunch.com/2026/03/02/anthropics-claude-reports-widespread-outage?utm_campaign=daily_pm)**
Anthropic's AI chatbot Claude experienced widespread service disruptions on Monday morning, with thousands of users reporting issues accessing the platform. The outage affected users' ability to interact with the AI assistant, highlighting the operational challenges facing AI service providers as these platforms become increasingly critical for daily workflows. The incident underscores the importance of reliable infrastructure for AI services that millions depend on for various tasks.

### **[MyFitnessPal has acquired Cal AI, the viral calorie app built by teens](https://techcrunch.com/2026/03/02/myfitnesspal-has-acquired-cal-ai-the-viral-calorie-app-built-by-teens?utm_campaign=daily_pm)**
MyFitnessPal has successfully acquired Cal AI, a viral calorie-tracking application developed by teenagers that has gained significant traction in app stores. After pursuing Cal AI for months, MyFitnessPal completed the acquisition of its emerging competitor. The deal represents a strategic move by MyFitnessPal to incorporate innovative AI-powered features and capture the younger demographic that gravitated toward Cal AI's approach to nutrition tracking and health management.

### **[Users are ditching ChatGPT for Claude — here's how to make the switch](https://techcrunch.com/2026/03/02/users-are-ditching-chatgpt-for-claude-heres-how-to-make-the-switch?utm_campaign=daily_pm)**
Following controversies surrounding ChatGPT, many users are switching to Anthropic's Claude AI chatbot as an alternative. The article provides guidance on how users can transition from ChatGPT to Claude, explaining the process and differences between the two AI platforms. This shift represents a significant movement in the AI chatbot market, as users seek alternatives amid ongoing concerns about ChatGPT's performance and policies.