---
layout: post
title: PostgreSQL Daily News 2026-01-28
---

# PostgreSQL Daily News#31 2026-01-28







## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/CAAKRu_ZkhzypqsmPb69n1YgE=rPbuKtV2h1BwBXyqMzSymsv3Q@mail.gmail.com)**
Melanie Plageman is working on a patch to eliminate xl_heap_visible WAL records to reduce WAL volume and eventually enable setting visibility map bits on access. In response to Chao Li's feedback about assertion handling in HeapTupleSatisfiesVacuumHorizon(), Melanie decided to remove the dead_after assertions entirely from her patches, explaining that she doesn't use the dead_after parameter and only passes it because the function requires it. She doesn't need the function to correctly set dead_after since it's unused in her implementation. Melanie acknowledged a minor naming suggestion from Chao Li to use "relation" instead of "rel" in comments for better clarity. She indicated she's incorporating review feedback from Andres and will post an updated version soon.

Melanie Plageman正在开发一个补丁，旨在消除xl_heap_visible WAL记录以减少WAL量，并最终实现在访问时设置可见性映射位。针对Chao Li关于HeapTupleSatisfiesVacuumHorizon()中断言处理的反馈，Melanie决定完全移除她补丁中的dead_after断言，解释说她不使用dead_after参数，传递它只是因为函数需要。由于在她的实现中未使用该参数，她不需要函数正确设置dead_after。Melanie接受了Chao Li的一个小建议，即在注释中使用"relation"而不是"rel"以提高清晰度。她表示正在整合Andres的审查反馈，并将很快发布更新版本。

Participants - 参与者:
* andres@anarazel.de
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* x4mmm@yandex-team.ru
* xunengzhou@gmail.com

### **[AIX support](https://www.postgresql.org/message-id/573836.1769545598@sss.pgh.pa.us)**
Tom Lane is reviewing Srirama Kucherlapati's patch to restore AIX support in PostgreSQL. He criticizes the complex environment variable setup required for building, arguing it should work with simple "./configure && make" commands. Lane suggests supporting only 64-bit builds with gcc and incorporating OBJECT_MODE=64 and -maix64 flags into autoconf/meson logic. He identifies several issues: missing libgcc_s.a detection logic from Makefile.aix, lgamma(NaN) returning ERANGE instead of NaN on AIX 7.3, compilation failures in test_cplusplusext due to __int128 handling in g++, and broken ps status display. A major concern is AIX's 4-byte double alignment versus 8-byte int64 alignment, which violates PostgreSQL's catalog tuple layout assumptions. Lane suggests this alignment issue requires a separate substantial patch to decouple int64 and double alignment requirements.

Tom Lane正在审查Srirama Kucherlapati恢复PostgreSQL中AIX支持的补丁。他批评构建所需的复杂环境变量设置，认为应该能通过简单的"./configure && make"命令工作。Lane建议仅支持使用gcc的64位构建，并将OBJECT_MODE=64和-maix64标志集成到autoconf/meson逻辑中。他发现了几个问题：Makefile.aix中缺少libgcc_s.a检测逻辑，AIX 7.3上lgamma(NaN)返回ERANGE而不是NaN，test_cplusplusext由于g++中__int128处理导致编译失败，以及ps状态显示损坏。一个主要问题是AIX的4字节double对齐与8字节int64对齐，这违反了PostgreSQL的目录元组布局假设。Lane建议这个对齐问题需要一个单独的重要补丁来解耦int64和double对齐要求。

Participants - 参与者:
* hlinnaka@iki.fi
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io