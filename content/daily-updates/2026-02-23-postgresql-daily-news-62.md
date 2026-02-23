# PostgreSQL Daily News#62 2026-02-23







## **Popular Hacker Email Discussions**

### **[Regression failures after changing PostgreSQL blocksize](https://www.postgresql.org/message-id/CAE8JnxP0js27RrunxXktvfmnum7csoBe2q_R+sj08hoqDNG3Zg@mail.gmail.com)**
The discussion centers on addressing PostgreSQL regression test failures when using non-default block sizes (e.g., 32KB instead of 8KB). Yasir initially proposed creating alternative expected output files for different block sizes, but Álvaro Herrera rejected this approach, suggesting instead that tests should be modified to work consistently across block sizes using SET/RESET commands to control query plans. Alexandre Felipe proposed a more sophisticated solution involving selective pattern matching and configurable output comparison, including ignoring comments, spaces, and specific numbers. However, David Johnston criticized this approach as overly complex and questioned its necessity. He suggested focusing on minimal changes to make existing tests robust, or potentially moving problematic tests to TAP framework. The thread reveals approximately 30 test files need modifications, with failures primarily involving plan changes between hash/group aggregates and different scan types. The community remains divided on the best approach to handle block size-dependent test variations.

Participants:
alvherre@kurilemu.de, david.g.johnston@gmail.com, o.alexandre.felipe@gmail.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com, yasir.hussain.shah@gmail.com, zmlpostgres@gmail.com

### **[index prefetching](https://www.postgresql.org/message-id/CAE8JnxPqNGReQWc+-fyprdOXwqODymgoxcxvNrC0W+AJRXpRfQ@mail.gmail.com)**
Alexandre Felipe shared experimental results on index prefetching optimizations, testing different distance control strategies where 2*d performed best across various patterns. He proposed limiting prefetch waste by sending row estimates from the executor and demonstrated I/O reordering using a zig-zag pattern that reduced seek distance by roughly 2/W with O(W) memory complexity. His experiments on a 400MB table showed performance improvements of 20-33% on HDD and SSD with prefetch enabled, though SSD without prefetch showed mixed results. Peter Geoghegan responded that while heap access reordering is interesting, expanding the patch scope is inappropriate given the approaching feature freeze in less than 6 weeks. He questioned the relevance of Markov models for prefetch distance determination and noted that executor row estimation patches already exist, emphasizing the need to focus on core functionality rather than theoretical extensions during crunch time.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAA4eK1KESu4=W6j4CQkKv5nzNJgtJyYBsg3E5K+LcwOr3t0WKw@mail.gmail.com)**
Amit Kapila provides review comments on vignesh C's v47 patch for skipping schema changes in publication. The patch introduces EXCEPT TABLE clauses for publications. Kapila requests three main changes: adding a function reference for table invalidation in comments, explaining why the exceptlist is formed only for RELKIND_RELATION with proper documentation, and improving error message formatting to match PostgreSQL's style conventions. He suggests moving required objects into the error message itself rather than using separate detail clauses, and corrects "clauses" to "clause" in the error text. The feedback focuses on code documentation clarity and consistency with existing PostgreSQL error messaging patterns.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **Industry News**

### **[Google VP warns that two types of AI startups may not survive](https://techcrunch.com/2026/02/21/google-vp-warns-that-two-types-of-ai-startups-may-not-survive)**
A Google VP has warned that two types of AI startups face mounting pressure and may not survive as generative AI evolves. The executive specifically highlighted LLM wrappers and AI aggregators as particularly vulnerable categories. These companies are experiencing shrinking margins and limited differentiation, which threatens their long-term viability in an increasingly competitive AI landscape. The warning comes as the AI industry continues to mature and consolidate, with larger tech companies gaining advantage through scale and resources. This prediction reflects broader concerns about which AI business models will prove sustainable as the technology becomes more commoditized and competition intensifies.

### **[Great news for xAI: Grok is now pretty good at answering questions about Baldur's Gate](https://techcrunch.com/2026/02/20/great-news-for-xai-grok-is-now-pretty-good-at-answering-detailed-questions-about-baldurs-gate)**
A new Business Insider report reveals that high-level engineers at xAI were pulled off other projects to ensure that Grok, the company's AI chatbot, could answer detailed questions about the popular video game Baldur's Gate. This development highlights an unusual prioritization by xAI, where significant engineering resources were redirected from other initiatives to focus on improving Grok's performance in gaming-related queries. The move suggests that xAI views gaming expertise as an important capability for their AI system, though it raises questions about resource allocation and strategic priorities. The report indicates that this gaming knowledge improvement was considered significant enough to warrant reassigning experienced engineering talent from other company projects.

### **[OpenAI debated calling police about suspected Canadian shooter's chats](https://techcrunch.com/2026/02/21/openai-debated-calling-police-about-suspected-canadian-shooter-chats)**
OpenAI faced an internal debate about whether to contact police regarding Jesse Van Rootselaar's concerning interactions with ChatGPT before he became a suspected shooter in Canada. Van Rootselaar's descriptions of gun violence were flagged by tools that monitor ChatGPT for misuse, raising questions about the company's responsibility to report potentially dangerous behavior. The case highlights the complex ethical and legal considerations AI companies face when their systems detect content that could indicate real-world threats. OpenAI's internal discussions about police notification reveal the challenges of balancing user privacy with public safety concerns. The incident underscores ongoing debates about AI companies' obligations to report suspicious activity and the effectiveness of their monitoring systems in preventing potential violence.