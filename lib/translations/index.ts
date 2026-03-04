/**
 * Translation Dictionary for PGNexus
 *
 * Structure: Each key contains { en: string, zh: string }
 * Usage: import { translations as t } from '@/lib/translations'
 *        Then use with: useLanguage().t(t.nav.home)
 */

import Email from "next-auth/providers/email";

export const translations = {
  // ========================================
  // Navigation
  // ========================================
  login: {
    welcome: { en: "Welcome back", zh: "欢迎回来" },
    desc: { en: "Sign in to your account", zh: "登录您的账号" },
    email: { en: "Email", zh: "邮箱" },
    password: { en: "Password", zh: "密码" },
    signIn: { en: "Sign In", zh: "登录" },
    signingIn: { en: "Signing in...", zh: "登录中..." },
    signUp: { en: "Sign Up", zh: "注册" },
    forget: { en: "Don't have an account? ", zh: "还没有账号？" },
  },
  nav: {
    home: { en: "Home", zh: "首页" },
    discover: { en: "Discover", zh: "发现" },
    knowledge: { en: "Knowledge", zh: "知识库" },
    community: { en: "Community", zh: "社区" },
    lab: { en: "Lab", zh: "实验室" },
    services: { en: "Services", zh: "服务" },
    explore: { en: "Explore", zh: "探索" },

    // Discover dropdown
    dailyUpdates: { en: "Daily Updates", zh: "每日更新" },
    hackerDiscussions: { en: "Hacker Discussions", zh: "技术讨论" },
    techBlogs: { en: "Tech Blogs", zh: "技术博客" },
    industryNews: { en: "Industry News", zh: "行业新闻" },

    // Knowledge dropdown
    deepDives: { en: "Deep Dives", zh: "深度解析" },
    postgresqlInternals: { en: "PostgreSQL Internals", zh: "PostgreSQL 内核" },
    researchPapers: { en: "Research and Papers", zh: "研究论文" },
    conferencesTalks: { en: "Conferences and Talks", zh: "会议演讲" },

    // Community dropdown
    hackerProfiles: { en: "Hacker Profiles", zh: "开发者档案" },
    eventsMeetups: { en: "Events and Meetups", zh: "活动聚会" },
    institutions: { en: "Institutions", zh: "机构" },
    hiring: { en: "Hiring", zh: "招聘" },

    // Lab dropdown
    sandboxes: { en: "Sandboxes", zh: "沙盒环境" },
    caseStudies: { en: "Case Studies", zh: "案例研究" },
    experiments: { en: "Experiments", zh: "实验项目" },

    // Services dropdown
    apis: { en: "APIs", zh: "API 服务" },
    requestFeature: { en: "Request a Feature", zh: "功能建议" },
    collaborations: { en: "Collaborations", zh: "合作" },
  },

  // ========================================
  // Authentication & User
  // ========================================
  auth: {
    signIn: { en: "Sign In", zh: "登录" },
    signUp: { en: "Sign Up", zh: "注册" },
    signOut: { en: "Sign Out", zh: "退出登录" },
    email: { en: "Email", zh: "邮箱" },
    password: { en: "Password", zh: "密码" },
    confirmPassword: { en: "Confirm Password", zh: "确认密码" },
    forgotPassword: { en: "Forgot Password?", zh: "忘记密码？" },
    rememberMe: { en: "Remember me", zh: "记住我" },
    noAccount: { en: "Don't have an account?", zh: "还没有账号？" },
    haveAccount: { en: "Already have an account?", zh: "已有账号？" },
    name: { en: "Name", zh: "姓名" },
    nameOptional: { en: "Name (optional)", zh: "姓名（可选）" },
    namePlaceholder: { en: "John Doe", zh: "张三" },
    emailPlaceholder: { en: "you@example.com", zh: "您的邮箱地址" },
    passwordPlaceholder: { en: "••••••••", zh: "••••••••" },
    passwordMinLength: { en: "Must be at least 6 characters", zh: "至少6个字符" },
    createAccount: { en: "Create account", zh: "创建账号" },
    creatingAccount: { en: "Creating account...", zh: "正在创建账号..." },
    getStarted: { en: "Get started with PGNexus today", zh: "立即开始使用 PGNexus" },
    signInLink: { en: "Sign in", zh: "登录" },
  },

  // ========================================
  // Common UI Elements
  // ========================================
  common: {
    loading: { en: "Loading...", zh: "加载中..." },
    loadMore: { en: "Load More", zh: "加载更多" },
    search: { en: "Search", zh: "搜索" },
    searchPlaceholder: { en: "Search...", zh: "搜索..." },
    filter: { en: "Filter", zh: "筛选" },
    filters: { en: "Filters", zh: "筛选器" },
    save: { en: "Save", zh: "保存" },
    cancel: { en: "Cancel", zh: "取消" },
    delete: { en: "Delete", zh: "删除" },
    edit: { en: "Edit", zh: "编辑" },
    close: { en: "Close", zh: "关闭" },
    submit: { en: "Submit", zh: "提交" },
    reset: { en: "Reset", zh: "重置" },
    clear: { en: "Clear", zh: "清除" },
    clearSearch: { en: "Clear Search", zh: "清除搜索" },
    apply: { en: "Apply", zh: "应用" },
    back: { en: "Back", zh: "返回" },
    next: { en: "Next", zh: "下一步" },
    previous: { en: "Previous", zh: "上一步" },
    confirm: { en: "Confirm", zh: "确认" },
    viewAll: { en: "View All", zh: "查看全部" },
    readMore: { en: "Read More", zh: "阅读更多" },
    noResults: { en: "No results found", zh: "未找到结果" },
    noData: { en: "No data available", zh: "暂无数据" },
    error: { en: "Error", zh: "错误" },
    success: { en: "Success", zh: "成功" },
    all: { en: "All", zh: "全部" },
    yes: { en: "Yes", zh: "是" },
    no: { en: "No", zh: "否" },
  },

  // ========================================
  // Feed/Content Types
  // ========================================
  feedTypes: {
    all: { en: "All", zh: "全部" },
    rss: { en: "RSS Feeds", zh: "RSS 订阅" },
    news: { en: "News", zh: "新闻" },
    email: { en: "Email Discussions", zh: "邮件讨论" },
    dailyUpdate: { en: "Daily Update", zh: "每日更新" },
    blog: { en: "Blog", zh: "博客" },
    discussion: { en: "Discussion", zh: "讨论" },
  },

  // ========================================
  // Home Page
  // ========================================
  homePage: {
    // Hero Banner
    bannerTitle: { en: "Your PostgreSQL Hub for Everything That Matters", zh: "您的 PostgreSQL 中心，汇聚一切重要信息" },
    bannerSubtitle: {
      en: "Stay ahead with curated hacker email highlights, tech blogs, community events, and industry news. All in one place.",
      zh: "通过精选的黑客邮件摘要、技术博客、社区活动和行业新闻保持领先。一站式汇聚。"
    },
    bannerCtaViewHighlights: { en: "View Highlights", zh: "查看精选" },
    bannerCtaExploreEvents: { en: "Explore Events", zh: "探索活动" },
    bannerSocialProof: { en: "2,500+ DBAs joined this month", zh: "本月已有 2,500+ 数据库管理员加入" },

    // Tech Blogs Section
    techBlogsTitle: { en: "PostgreSQL Tech Blogs", zh: "PostgreSQL 技术博客" },
    techBlogsDescription: {
      en: "Discover the latest insights, best practices, and technical deep-dives from the PostgreSQL community. Stay ahead with curated articles that help you master database performance, optimization, and innovative solutions.",
      zh: "探索 PostgreSQL 社区的最新见解、最佳实践和技术深度分析。通过精选文章掌握数据库性能、优化和创新解决方案，保持领先。"
    },

    // Hacker Discussions Section
    hackerDiscussionsTitle: { en: "Hacker Discussions", zh: "技术讨论" },
    hackerDiscussionsDescription: {
      en: "Join the conversation where PostgreSQL's future is shaped. Explore in-depth technical discussions from the official mailing list, where core developers and experts debate features, share ideas, and solve complex challenges.",
      zh: "加入塑造 PostgreSQL 未来的对话。探索官方邮件列表中的深度技术讨论，核心开发者和专家在此辩论功能、分享想法并解决复杂挑战。"
    },

    // Hacker Discussions Stats
    emailsThisWeek: { en: "Emails (last 7 days)", zh: "邮件（过去7天）" },
    emailsThisWeekCount: { en: "342", zh: "342" },
    patchesSubmitted: { en: "Patches submitted (last 7 days)", zh: "提交的补丁（过去7天）" },
    patchesSubmittedCount: { en: "28", zh: "28" },
    activeContributors: { en: "Active Contributors (last 7 days)", zh: "活跃贡献者（过去7天）" },
    activeContributorsCount: { en: "156", zh: "156" },
    weeklyEmailActivity: { en: "Daily Email Activity", zh: "每日邮件活动" },
    emailsLabel: { en: "Emails", zh: "邮件数量" },
    patchesLabel: { en: "Patches", zh: "补丁数量" },
    contributorsLabel: { en: "Contributors", zh: "贡献者数量" },
    topDiscussionSubjects: { en: "Top Discussion Subjects", zh: "热门讨论主题" },

    // Industry News Section
    industryNewsTitle: { en: "Industry News", zh: "行业新闻" },
    industryNewsDescription: {
      en: "Keep your finger on the pulse of the PostgreSQL ecosystem. Get timely updates on releases, industry trends, company announcements, and breaking news that impact the database community worldwide.",
      zh: "紧跟 PostgreSQL 生态系统的脉搏。及时获取发布信息、行业趋势、公司公告以及影响全球数据库社区的突发新闻。"
    },

    viewAll: { en: "View All", zh: "查看全部" },
  },

  // ========================================
  // Explore Page (Feeds Browser)
  // ========================================
  explorePage: {
    title: { en: "Explore", zh: "探索" },
    subtitle: { en: "Find everything in one place", zh: "在这里找到一切" },
    searchPlaceholder: { en: "Search feeds...", zh: "搜索信息流..." },
    noFeeds: { en: "No feeds found", zh: "未找到信息流" },
    noFeedsSubtext: { en: "Try adjusting your filters or check back later", zh: "尝试调整筛选条件或稍后再试" },
    subscribedOnly: { en: "Subscribed Only", zh: "仅显示已订阅" },
    allFeeds: { en: "All Feeds", zh: "全部信息流" },
  },

  // ========================================
  // Tech Blogs Page
  // ========================================
  techBlogsPage: {
    title: { en: "Tech Blogs", zh: "技术博客" },
    subtitle: { en: "Curated PostgreSQL technology posts with concise summaries to help you stay informed, fast.", zh: "精心策划的 PostgreSQL 技术文章，配有简洁摘要，助您快速了解最新动态。" },
    searchPlaceholder: { en: "Search blogs...", zh: "搜索博客..." },
    clearSearch: { en: "Clear Search", zh: "清除搜索" },
    blogsCount: { en: "Blogs", zh: "博客" },
    noBlogs: { en: "No blogs found", zh: "未找到博客" },
    noBlogsSearch: { en: "No blogs match your search for", zh: "没有博客与您的搜索匹配" },
    noBlogsAvailable: { en: "There are no blogs available at the moment.", zh: "目前没有可用的博客。" },
    loadMore: { en: "Load More", zh: "加载更多" },
    remaining: { en: "remaining", zh: "剩余" },
    readOriginal: { en: "Read original article", zh: "阅读原文" },
    summary: { en: "Summary", zh: "摘要" },
    noSummary: { en: "No summary available", zh: "暂无摘要" },
    selectBlog: { en: "Select a blog", zh: "选择一篇博客" },
    selectBlogSubtext: { en: "Choose a blog post from the sidebar to view its summary", zh: "从侧边栏选择一篇博客文章以查看其摘要" },
  },

  // ========================================
  // Tech News Page
  // ========================================
  techNewsPage: {
    title: { en: "Tech News", zh: "行业新闻" },
    subtitle: { en: "Latest PostgreSQL news and updates with concise summaries to keep you informed, fast.", zh: "最新的 PostgreSQL 新闻和更新，配有简洁摘要，助您快速了解最新动态。" },
    searchPlaceholder: { en: "Search news...", zh: "搜索新闻..." },
    clearSearch: { en: "Clear Search", zh: "清除搜索" },
    newsCount: { en: "News", zh: "新闻" },
    noNewsSearch: { en: "No news articles match your search", zh: "没有新闻文章与您的搜索匹配" },
    noNewsAvailable: { en: "No news articles available", zh: "暂无新闻文章" },
    loadMore: { en: "Load More", zh: "加载更多" },
    remaining: { en: "remaining", zh: "剩余" },
    summary: { en: "Summary", zh: "摘要" },
    noSummary: { en: "No summary available", zh: "暂无摘要" },
    noNewsTitle: { en: "No news available", zh: "暂无新闻" },
    selectNewsTitle: { en: "Select a news article", zh: "选择一篇新闻" },
    noNewsSubtext: { en: "News articles will appear here once added", zh: "添加后新闻文章将显示在此处" },
    selectNewsSubtext: { en: "Choose a news article from the sidebar to view its summary", zh: "从侧边栏选择一篇新闻文章以查看其摘要" },
    viewOriginal: { en: "View Original News", zh: "查看原始新闻" },
  },

  // ========================================
  // Hacker Discussions Page
  // ========================================
  hackerDiscussionsPage: {
    title: { en: "Hacker Discussions", zh: "技术讨论" },
    subtitle: { en: "Carefully curated PostgreSQL Hacker Mailing List discussions, summarized and updated daily", zh: "精心策划的 PostgreSQL 黑客邮件列表讨论，每日总结和更新" },
    searchPlaceholder: { en: "Search topics...", zh: "搜索主题..." },
    clearSearch: { en: "Clear Search", zh: "清除搜索" },
    topicsCount: { en: "Topics", zh: "主题" },
    noDiscussions: { en: "No discussions found", zh: "未找到讨论" },
    noDiscussionsSearch: { en: "No discussions match your search for", zh: "没有讨论与您的搜索匹配" },
    noDiscussionsAvailable: { en: "There are no discussions available at the moment.", zh: "目前没有可用的讨论。" },
    loadMore: { en: "Load More", zh: "加载更多" },
    remaining: { en: "remaining", zh: "剩余" },
    lastUpdated: { en: "Last updated", zh: "最后更新" },
    asOf: { en: "as of", zh: "截至" },
    participants: { en: "Participants:", zh: "参与者：" },
    noSummary: { en: "No summary available", zh: "暂无摘要" },
    selectTopic: { en: "Select a topic", zh: "选择一个主题" },
    selectTopicSubtext: { en: "Choose a discussion topic from the sidebar to view its details", zh: "从侧边栏选择一个讨论主题以查看其详情" },
    patches: { en: "Patches", zh: "补丁" },
    patchFile: { en: "Patch File", zh: "补丁文件" },
    patchSummary: { en: "Summary", zh: "摘要" },
    patchRisk: { en: "Risk", zh: "风险" },
    loadMorePatches: { en: "Load more patches", zh: "加载更多补丁" },
  },

  // ========================================
  // Daily Updates Page
  // ========================================
  dailyUpdatesPage: {
    title: { en: "Daily Updates", zh: "每日更新" },
    subtitle: { en: "Your daily digest of PostgreSQL news, blogs, and discussions", zh: "PostgreSQL 新闻、博客和讨论的每日摘要" },
    sidebarTitle: { en: "Daily Updates", zh: "每日更新" },
    today: { en: "Today", zh: "今天" },
    yesterday: { en: "Yesterday", zh: "昨天" },
    thisWeek: { en: "This Week", zh: "本周" },
    noUpdates: { en: "No daily updates available", zh: "暂无每日更新" },
    noUpdatesSubtext: { en: "Daily update markdown files will appear here once added to the content directory.", zh: "添加到内容目录后，每日更新的 Markdown 文件将显示在此处。" },
    loadMore: { en: "Load More", zh: "加载更多" },
    remaining: { en: "remaining", zh: "剩余" },
  },

  // ========================================
  // Coming Soon Pages
  // ========================================
  comingSoon: {
    title: { en: "Coming Soon", zh: "即将推出" },
    subtitle: { en: "We're working hard to bring you this feature", zh: "我们正在努力为您带来此功能" },
    stayTuned: { en: "Stay tuned!", zh: "敬请期待！" },
    backToHome: { en: "Back to Home", zh: "返回首页" },
    notify: { en: "Notify Me", zh: "通知我" },
  },

  // ========================================
  // Community Section
  // ========================================
  communitySection: {
    title: { en: "Join Our Thriving Community", zh: "加入我们蓬勃发展的社区" },
    subtitle: { en: "Connect with PostgreSQL enthusiasts and experts worldwide", zh: "与全球 PostgreSQL 爱好者和专家联系" },

    // Stats
    membersCount: { en: "25K+", zh: "25K+" },
    membersLabel: { en: "Members", zh: "成员" },
    countriesCount: { en: "120+", zh: "120+" },
    countriesLabel: { en: "Countries", zh: "国家" },
    postsCount: { en: "500+", zh: "500+" },
    postsLabel: { en: "Blog Posts/Month", zh: "博客文章/月" },
    eventsCount: { en: "50+", zh: "50+" },
    eventsLabel: { en: "Events/Year", zh: "活动/年" },

    // Subscribe
    subscribeTitle: { en: "Stay Updated", zh: "保持更新" },
    subscribeSubtitlebyFirst: { en: "Curated PostgreSQL tech blogs and discussions, stay updated with community trends", zh: "精选 PostgreSQL 技术博客和讨论，及时了解社区动态" },
    subscribeSubtitle: { en: "Get the latest PostgreSQL news and insights delivered to your inbox", zh: "将最新的 PostgreSQL 新闻和见解直接发送到您的收件箱" },
    subscribeButton: { en: "Subscribe to Updates", zh: "订阅更新" },
    emailPlaceholder: { en: "Enter your email", zh: "输入您的电子邮件" },
    daySubscribeButton: { en: "Daily Digest", zh: "每日摘要" },
    weekSubscribeButton: { en: "Weekly Digest", zh: "每周摘要" },

    // Testimonials
    testimonialsTitle: { en: "What Our Community Says", zh: "社区评价" },
    testimonialsSubtitle: { en: "Hear from PostgreSQL professionals who trust PGNexus", zh: "听听信赖 PGNexus 的 PostgreSQL 专业人士的声音" },
    testimonial1Name: { en: "Sarah Chen", zh: "陈莎拉" },
    testimonial1Role: { en: "Senior Database Engineer", zh: "高级数据库工程师" },
    testimonial1Text: {
      en: "PGNexus has become my go-to source for PostgreSQL news and insights. The daily summaries save me hours of reading, and the community discussions are invaluable.",
      zh: "PGNexus 已成为我获取 PostgreSQL 新闻和见解的首选来源。每日摘要为我节省了数小时的阅读时间，社区讨论也非常宝贵。"
    },
    testimonial2Name: { en: "Marcus Rodriguez", zh: "马库斯·罗德里格斯" },
    testimonial2Role: { en: "PostgreSQL Consultant", zh: "PostgreSQL 顾问" },
    testimonial2Text: {
      en: "The curated content and expert discussions on PGNexus keep me ahead of the curve. It's an essential resource for anyone serious about PostgreSQL.",
      zh: "PGNexus 上精选的内容和专家讨论让我保持领先。对于任何认真对待 PostgreSQL 的人来说，这是一个必不可少的资源。"
    },
  },

  // ========================================
  // Footer
  // ========================================
  footer: {
    tagline: { en: "Your Hub for PostgreSQL News, Insights and Collaborations", zh: "您的 PostgreSQL 新闻、见解和协作中心" },
    discover: { en: "Discover", zh: "发现" },
    knowledge: { en: "Knowledge", zh: "知识库" },
    community: { en: "Community", zh: "社区" },
    lab: { en: "Lab", zh: "实验室" },
    services: { en: "Services", zh: "服务" },
    more: { en: "More", zh: "更多" },
    copyright: { en: "All rights reserved.", zh: "版权所有。" },
    privacyPolicy: { en: "Privacy Policy", zh: "隐私政策" },
    termsOfService: { en: "Terms of Service", zh: "服务条款" },
    cookiePolicy: { en: "Cookie Policy", zh: "Cookie 政策" },
  },

  // ========================================
  // Date/Time
  // ========================================
  dateTime: {
    justNow: { en: "just now", zh: "刚刚" },
    minutesAgo: { en: "minutes ago", zh: "分钟前" },
    hoursAgo: { en: "hours ago", zh: "小时前" },
    daysAgo: { en: "days ago", zh: "天前" },
    weeksAgo: { en: "weeks ago", zh: "周前" },
    monthsAgo: { en: "months ago", zh: "个月前" },
    yearsAgo: { en: "years ago", zh: "年前" },
  },

  // ========================================
  // Filter/Sort Options
  // ========================================
  filterSort: {
    sortBy: { en: "Sort by", zh: "排序方式" },
    newest: { en: "Newest", zh: "最新" },
    oldest: { en: "Oldest", zh: "最旧" },
    mostRelevant: { en: "Most Relevant", zh: "最相关" },
    dateRange: { en: "Date Range", zh: "日期范围" },
    from: { en: "From", zh: "开始日期" },
    to: { en: "To", zh: "结束日期" },
    feedType: { en: "Feed Type", zh: "内容类型" },
    category: { en: "Category", zh: "分类" },
  },

  // ========================================
  // Error Messages
  // ========================================
  errors: {
    genericError: { en: "Something went wrong. Please try again.", zh: "出错了，请重试。" },
    networkError: { en: "Network error. Please check your connection.", zh: "网络错误，请检查您的连接。" },
    notFound: { en: "Page not found", zh: "页面未找到" },
    unauthorized: { en: "You are not authorized to view this page", zh: "您无权查看此页面" },
    serverError: { en: "Server error. Please try again later.", zh: "服务器错误，请稍后再试。" },
    invalidInput: { en: "Invalid input. Please check your data.", zh: "输入无效，请检查您的数据。" },
  },

  // ========================================
  // Success Messages
  // ========================================
  success: {
    saved: { en: "Saved successfully", zh: "保存成功" },
    deleted: { en: "Deleted successfully", zh: "删除成功" },
    updated: { en: "Updated successfully", zh: "更新成功" },
    subscribed: { en: "Subscribed successfully", zh: "订阅成功" },
    unsubscribed: { en: "Unsubscribed successfully", zh: "取消订阅成功" },
  },

  // ========================================
  // Subscription/Bookmarks
  // ========================================
  subscription: {
    subscribe: { en: "Subscribe", zh: "订阅" },
    unsubscribe: { en: "Unsubscribe", zh: "取消订阅" },
    subscribed: { en: "Subscribed", zh: "已订阅" },
    bookmark: { en: "Bookmark", zh: "收藏" },
    unbookmark: { en: "Remove Bookmark", zh: "取消收藏" },
    bookmarked: { en: "Bookmarked", zh: "已收藏" },
    mySubscriptions: { en: "My Subscriptions", zh: "我的订阅" },
    myBookmarks: { en: "My Bookmarks", zh: "我的收藏" },
  },

  // ========================================
  // User Profile Page
  // ========================================
  userProfile: {
    // Menu Items
    dashboard: { en: "Dashboard", zh: "仪表盘" },
    profile: { en: "Profile", zh: "个人资料" },
    subscriptions: { en: "Your Subscriptions", zh: "您的订阅" },
    botAccess: { en: "Bot Access", zh: "机器人访问" },
    suggestArticle: { en: "Suggest an Article", zh: "推荐文章" },
    userMenu: { en: "User Menu", zh: "用户菜单" },
    adminDashboard: { en: "Admin Dashboard", zh: "管理员仪表板" },
    dataSourceManagement: { en: "Data Source Management", zh: "数据源管理中心" },
    contentManagementCenter: { en: "Content Management Center", zh: "内容管理中心" },
    workflowControlPanel: { en: "Workflow Control Panel", zh: "工作流控制台" },
    userPermissionManagement: { en: "User & Permission Management", zh: "用户与权限管理" },

    // Dashboard
    hello: { en: "Hello", zh: "您好" },
    underConstruction: { en: "User space is currently under construction. Please check back regularly for new features.", zh: "用户空间正在建设中。请定期查看新功能。" },
    comingSoon: { en: "Coming soon", zh: "即将推出" },

    // Profile Settings
    profileSettings: { en: "Profile Settings", zh: "个人资料设置" },
    updateInfo: { en: "Update Profile", zh: "更新个人资料" },
    updateInfoButton: { en: "Save Profile", zh: "保存个人资料" },
    name: { en: "Name", zh: "姓名" },
    namePlaceholder: { en: "Enter your name", zh: "输入您的姓名" },
    emailReadOnly: { en: "Email (read-only)", zh: "邮箱（只读）" },
    updating: { en: "Updating...", zh: "更新中..." },
    organization: { en: "Organization", zh: "组织" },
    organizationPlaceholder: { en: "Your organization or company", zh: "您的组织或公司" },
    position: { en: "Position", zh: "职位" },
    positionPlaceholder: { en: "Your job title or position", zh: "您的职位" },
    profileUpdateSuccess: { en: "Profile updated successfully!", zh: "个人资料更新成功！" },

    // Change Password
    changePassword: { en: "Change Password", zh: "更改密码" },
    currentPassword: { en: "Current Password", zh: "当前密码" },
    currentPasswordPlaceholder: { en: "Enter current password", zh: "输入当前密码" },
    newPassword: { en: "New Password", zh: "新密码" },
    newPasswordPlaceholder: { en: "Enter new password (min 8 characters)", zh: "输入新密码（至少8个字符）" },
    confirmNewPassword: { en: "Confirm New Password", zh: "确认新密码" },
    confirmNewPasswordPlaceholder: { en: "Confirm new password", zh: "确认新密码" },
    changePasswordButton: { en: "Change Password", zh: "更改密码" },

    // Subscriptions
    subscriptionsTitle: { en: "Your Subscriptions", zh: "您的订阅" },
    subscriptionsDescription: { en: "Manage your email subscription preferences for PostgreSQL updates and news.", zh: "管理您的 PostgreSQL 更新和新闻的电子邮件订阅偏好。" },
    emailSubscriptions: { en: "Email Subscriptions", zh: "邮件订阅" },
    dailyDigest: { en: "Daily Digest (Simplified Chinese)", zh: "每日摘要（简体中文）" },
    dailyDigestDescription: { en: "Receive a daily summary of PostgreSQL news, discussions, and updates.", zh: "接收 PostgreSQL 新闻、讨论和更新的每日摘要。" },
    weeklyDigest: { en: "Weekly Digest (Simplified Chinese)", zh: "每周摘要（简体中文）" },
    weeklyDigestDescription: { en: "Receive a weekly roundup of the most important PostgreSQL content.", zh: "接收最重要的 PostgreSQL 内容的每周汇总。" },
    manageSubscription: { en: "Manage Subscription", zh: "管理订阅" },
    subscribed: { en: "Subscribed", zh: "已订阅" },
    notSubscribed: { en: "Not Subscribed", zh: "未订阅" },
    subscribe: { en: "Subscribe", zh: "订阅" },
    unsubscribe: { en: "Unsubscribe", zh: "取消订阅" },
    subscriptionUpdated: { en: "Subscription updated successfully!", zh: "订阅更新成功！" },
    subscriptionError: { en: "Failed to update subscription. Please try again.", zh: "更新订阅失败。请重试。" },

    // Bot Access
    botAccessTitle: { en: "Bot Access", zh: "机器人访问" },
    botAccessDescription: { en: "Bot access management is coming soon. Here you'll be able to configure API keys and bot integrations.", zh: "机器人访问管理即将推出。您将能够在此配置 API 密钥和机器人集成。" },
    telegramBotTitle: { en: "PGNexus Telegram Bot", zh: "PGNexus Telegram 机器人" },
    telegramBotDescription: { en: "Use our Telegram bot to query everything on PGNexus, receive notifications, and stay updated on PostgreSQL news, discussions, and more - all from your Telegram chat!", zh: "使用我们的 Telegram 机器人查询 PGNexus 上的所有内容，接收通知，并通过 Telegram 聊天了解 PostgreSQL 新闻、讨论等最新动态！" },
    yourSecret: { en: "Your Secret Key", zh: "您的密钥" },
    secretDescription: { en: "This secret key is required to authenticate with the PGNexus Telegram bot. Keep it secure and do not share it with others.", zh: "此密钥用于与 PGNexus Telegram 机器人进行身份验证。请妥善保管，不要与他人分享。" },
    showSecret: { en: "Show Secret", zh: "显示密钥" },
    hideSecret: { en: "Hide Secret", zh: "隐藏密钥" },
    copySecret: { en: "Copy Secret", zh: "复制密钥" },
    secretCopied: { en: "Secret copied to clipboard!", zh: "密钥已复制到剪贴板！" },
    noSecretYet: { en: "No secret key generated yet", zh: "尚未生成密钥" },
    generateSecret: { en: "Generate Secret Key", zh: "生成密钥" },
    regenerateSecret: { en: "Regenerate Secret Key", zh: "重新生成密钥" },
    howToUse: { en: "How to Use", zh: "如何使用" },
    step1: { en: "Open Telegram and search for", zh: "打开 Telegram 并搜索" },
    step2: { en: "Start a chat with the bot by clicking", zh: "点击以下按钮开始与机器人聊天" },
    step3: { en: "Send", zh: "发送" },
    step3Command: { en: "/join <your_secret_key>", zh: "/join <您的密钥>" },
    step3Suffix: { en: "to authenticate", zh: "进行身份验证" },
    step4: { en: "Start querying PGNexus data and receive notifications!", zh: "开始查询 PGNexus 数据并接收通知！" },
    startCommand: { en: "/start", zh: "/start" },
    openTelegram: { en: "Open in Telegram", zh: "在 Telegram 中打开" },
    scanQrCode: { en: "Or scan this QR code", zh: "或扫描此二维码" },
    generating: { en: "Generating...", zh: "生成中..." },
    loading: { en: "Loading...", zh: "加载中..." },
    
    // Complete Profile
    completeProfile: { en: "Complete Your Profile", zh: "完成您的个人资料" },
    completeProfileDescription: { en: "Enhance your PGNexus experience by adding more details about yourself.", zh: "通过添加更多个人信息来增强您的 PGNexus 体验。" },
    bio: { en: "Bio", zh: "简介" },
    bioPlaceholder: { en: "Tell us a little about yourself...", zh: "告诉我们一些关于您自己的信息..." },
    company: { en: "Company", zh: "公司" },
    companyPlaceholder: { en: "Your company name", zh: "您的公司名称" },
    jobTitle: { en: "Job Title", zh: "职位" },
    jobTitlePlaceholder: { en: "Your job title", zh: "您的职位" },
    country: { en: "Country/Region", zh: "国家/地区" },
    countryPlaceholder: { en: "Select your country/region", zh: "选择您的国家/地区" },
    avatar: { en: "Avatar", zh: "头像" },
    uploadAvatar: { en: "Upload Avatar", zh: "上传头像" },
    saveProfile: { en: "Save Profile", zh: "保存个人资料" },
    profileSaved: { en: "Profile saved successfully!", zh: "个人资料保存成功！" },
    saveChanges: { en: "Save Changes", zh: "保存更改" },
  },

  // ========================================
  // Admin Dashboard
  // ========================================
  adminDashboard: {
    title: { en: "Admin Dashboard", zh: "管理员仪表板" },
    subtitle: { en: "System status, feed stats, task errors, user growth, subscriptions, API usage, data source health, and queue backlog.", zh: "系统运行状态、抓取统计、错误任务、用户增长、订阅活跃度、API 调用、数据源健康评分与队列积压。" },
    refresh: { en: "Refresh", zh: "刷新" },
    loadFailed: { en: "Load failed", zh: "加载失败" },
    systemRuntimeStatus: { en: "System Runtime Status", zh: "系统运行状态" },
    fetchedToday: { en: "Fetched Today", zh: "当日数据抓取统计" },
    feedCounts: { en: "Feed Counts", zh: "Feed数量统计" },
    today: { en: "Today", zh: "今日" },
    thisWeek: { en: "This Week", zh: "本周" },
    thisMonth: { en: "This Month", zh: "本月" },
    total: { en: "Total", zh: "累计" },
    monthShort: { en: "Month", zh: "本月" },
    d7: { en: "7d", zh: "7天" },
    errorTasks: { en: "Error Tasks", zh: "错误任务数量" },
    userRegistrationGrowth: { en: "User Registration Growth", zh: "用户注册增长" },
    activeSubscriptionUsers: { en: "Active Subscription Users", zh: "活跃订阅用户" },
    totalSubscriptions: { en: "Total subscriptions", zh: "总订阅条目" },
    apiCallStats: { en: "API Call Stats", zh: "API调用次数统计" },
    userGrowthTrend14d: { en: "User Growth Trend (14d)", zh: "用户注册增长趋势（14天）" },
    noTrendData: { en: "No trend data", zh: "暂无趋势数据" },
    dataSourceHealthScore: { en: "Data Source Health Score", zh: "数据源健康评分" },
    healthSplit: { en: "healthy/warning/critical", zh: "健康/告警/严重" },
    queueBacklogStatus: { en: "Queue Backlog Status", zh: "队列积压状态" },
    queued: { en: "Queued", zh: "排队中" },
    running: { en: "Running", zh: "运行中" },
    failedToday: { en: "Failed Today", zh: "今日失败" },
    lastUpdated: { en: "Last updated", zh: "最后更新时间" },
  },

  // ========================================
  // Workflow Control Panel
  // ========================================
  workflowControl: {
    refresh: { en: "Refresh", zh: "刷新" },
    close: { en: "Close", zh: "关闭" },
    loadFailed: { en: "Failed to load", zh: "加载失败" },
    saveFailed: { en: "Save failed", zh: "保存失败" },
    failedToSaveWorkflow: { en: "Failed to save workflow settings", zh: "保存工作流配置失败" },
    workflowUpdated: { en: "Workflow settings updated", zh: "工作流配置已更新" },
    failedToSavePrompt: { en: "Failed to save prompt", zh: "保存提示词失败" },
    promptUpdated: { en: "Prompt settings updated", zh: "提示词配置已更新" },
    failedToSaveGlobal: { en: "Failed to save global settings", zh: "保存全局配置失败" },
    globalUpdated: { en: "Global settings updated", zh: "全局配置已更新" },
    toggleFailed: { en: "Toggle failed", zh: "切换失败" },
    triggerFailed: { en: "Trigger failed", zh: "触发失败" },
    triggeredRun: { en: "Triggered run", zh: "已触发运行" },
    modalWorkflowSettings: { en: "Workflow Settings (Strategy / Logic)", zh: "工作流配置（运行策略 / 逻辑控制）" },
    modalGlobalSettings: { en: "Global Strategy", zh: "全局运行策略" },
    modalPromptSettings: { en: "AI Agent Prompt Settings", zh: "AI Agent 提示词配置" },
    workflowName: { en: "Workflow name", zh: "工作流名称" },
    workflowDescription: { en: "Workflow description", zh: "工作流描述" },
    retryCount: { en: "Retry count", zh: "重试次数" },
    queueConcurrency: { en: "Queue concurrency", zh: "队列并发数" },
    workerCount: { en: "Worker count", zh: "Worker数量" },
    enableWorkflow: { en: "Enable workflow", zh: "启用工作流" },
    alertOnFailure: { en: "Alert on failure", zh: "失败后报警" },
    bilingualSwitch: { en: "Bilingual switch", zh: "中英文双语开关" },
    failureAlertRules: { en: "Failure alert rules", zh: "失败后报警规则" },
    emailAlert: { en: "Email alert", zh: "邮件报警" },
    webhookAlert: { en: "Webhook alert", zh: "Webhook 报警" },
    consecutiveFailureThreshold: { en: "Consecutive failure threshold", zh: "连续失败次数阈值" },
    silenceWindowMinutes: { en: "Silence window (minutes)", zh: "静默时间（分钟）" },
    dataFilterStrategy: { en: "Data filter strategy", zh: "数据筛选策略" },
    enableWeightScoring: { en: "Enable weight scoring", zh: "启用权重评分" },
    enableContentRelevance: { en: "Enable content relevance", zh: "启用内容关联性" },
    minimumScoreThreshold: { en: "Minimum score threshold", zh: "最低得分阈值（min score）" },
    includeKeywords: { en: "Include keywords (comma separated)", zh: "包含关键词（逗号分隔）" },
    excludeKeywords: { en: "Exclude keywords (comma separated)", zh: "排除关键词（逗号分隔）" },
    saveWorkflowSettings: { en: "Save workflow settings", zh: "保存工作流配置" },
    promptName: { en: "Prompt name", zh: "提示词名称" },
    promptContent: { en: "Prompt content", zh: "提示词内容" },
    enableThisPrompt: { en: "Enable this prompt", zh: "启用该提示词" },
    savePrompt: { en: "Save prompt", zh: "保存提示词" },
    globalQueueConcurrency: { en: "Global queue concurrency", zh: "全局队列并发" },
    globalWorkerCount: { en: "Global worker count", zh: "全局Worker数量" },
    saveGlobalStrategy: { en: "Save global strategy", zh: "保存全局策略" },
    title: { en: "Workflow / Pipeline Control Panel", zh: "工作流控制台（Workflow / Pipeline Control Panel）" },
    subtitle: { en: "Manage workflows, strategies, logic control, run history, error logs, and AI prompt/model settings.", zh: "工作流管理、运行策略、逻辑控制、执行历史、错误记录、AI 提示词与模型配置。" },
    tabWorkflows: { en: "Workflows", zh: "工作流管理" },
    tabRuns: { en: "Run History", zh: "执行历史" },
    tabErrors: { en: "Error Logs", zh: "错误记录" },
    tabStrategies: { en: "Strategies", zh: "运行策略" },
    tabPrompts: { en: "AI Agent Prompts", zh: "AI Agent提示词" },
    workflowsHint: { en: "View workflows, enable/disable, and trigger runs manually.", zh: "查看所有工作流列表、启停控制、手动触发。" },
    workflow: { en: "Workflow", zh: "工作流" },
    actions: { en: "Actions", zh: "操作" },
    status: { en: "Status", zh: "状态" },
    time: { en: "Time", zh: "时间" },
    error: { en: "Error", zh: "错误" },
    message: { en: "Message", zh: "消息" },
    name: { en: "Name", zh: "名称" },
    type: { en: "Type", zh: "类型" },
    model: { en: "Model", zh: "模型" },
    language: { en: "Language", zh: "语言" },
    run: { en: "Run", zh: "运行" },
    enabled: { en: "Enabled", zh: "启用" },
    disabled: { en: "Disabled", zh: "停用" },
    enable: { en: "Enable", zh: "启用" },
    disable: { en: "Disable", zh: "停用" },
    english: { en: "English", zh: "英文" },
    chinese: { en: "Chinese", zh: "中文" },
    bilingual: { en: "Bilingual", zh: "双语" },
    modelLanguage: { en: "Model/Language", zh: "模型/语言" },
    triggerMode: { en: "Trigger Mode", zh: "触发模式" },
    trigger: { en: "Trigger", zh: "触发" },
    durationMs: { en: "Duration(ms)", zh: "耗时(ms)" },
    level: { en: "Level", zh: "级别" },
    globalDefaultModel: { en: "Global default model", zh: "全局默认模型" },
    editStrategy: { en: "Edit strategy", zh: "编辑运行策略" },
    promptsHint: { en: "AI Agent prompt settings (hacker email / patch / industry news / summaries / others)", zh: "AI Agent 提示词配置（hacker email / patch / 行业新闻 / 信息总结 / 其它）" },
    editPrompt: { en: "Edit prompt", zh: "编辑提示词" },
    triggerOnce: { en: "Trigger Once", zh: "触发一次" },
    configure: { en: "Configure", zh: "配置" },
    single: { en: "Single", zh: "单语" },
    global: { en: "Global", zh: "全局" },
    on: { en: "On", zh: "开启" },
    off: { en: "Off", zh: "关闭" },
  },

  // ========================================
  // Content Management Center
  // ========================================
  contentManagement: {
    refresh: { en: "Refresh", zh: "刷新" },
    close: { en: "Close", zh: "关闭" },
    loadFailed: { en: "Failed to load", zh: "加载失败" },
    updateFailed: { en: "Update failed", zh: "更新失败" },
    contentUpdated: { en: "Content updated", zh: "内容更新成功" },
    rerunAiFailed: { en: "Failed to rerun AI summary", zh: "重跑 AI 摘要失败" },
    rerunAiTriggered: { en: "AI summary rerun triggered", zh: "已触发 AI 摘要重跑" },
    actionFailed: { en: "Action failed", zh: "操作失败" },
    selectAtLeastOne: { en: "Select at least one item first", zh: "请先选择至少一条内容" },
    batchFailed: { en: "Batch action failed", zh: "批量操作失败" },
    batchDonePrefix: { en: "Batch action complete, affected", zh: "批量操作完成，影响" },
    itemsUnit: { en: "items", zh: "条" },
    reviewFailed: { en: "Review failed", zh: "审核失败" },
    reviewDone: { en: "Review completed", zh: "审核成功" },
    saveTagFailed: { en: "Failed to save tag", zh: "保存标签失败" },
    saveCategoryFailed: { en: "Failed to save category", zh: "保存分类失败" },
    saveRuleFailed: { en: "Failed to save rule", zh: "保存规则失败" },
    saveDebugFailed: { en: "Failed to submit debug record", zh: "提交调试失败" },
    modalEditItem: { en: "Edit Content (Feed)", zh: "编辑内容（Feed 管理）" },
    modalTag: { en: "Tag Management", zh: "标签管理" },
    modalCategory: { en: "Category Management", zh: "分类管理" },
    modalRule: { en: "Auto Tag Rules", zh: "自动标签规则" },
    modalDebug: { en: "Hacker Email Scoring Debug", zh: "hacker email 筛选评分调试" },
    blogSummary: { en: "Blog summary", zh: "blog 总结" },
    emailSummary: { en: "Email discussion summary", zh: "email 讨论总结" },
    patchSummary: { en: "Patch analysis summary", zh: "patch 分析总结" },
    newsSummary: { en: "News summary", zh: "news 总结" },
    contentTrustScore: { en: "Content trust score", zh: "内容可信度评分" },
    credibilityScore: { en: "Credibility score", zh: "可信度评分" },
    tagIdsCsv: { en: "Tag IDs, comma separated", zh: "标签ID，逗号分隔" },
    categoryIdsCsv: { en: "Category IDs, comma separated", zh: "分类ID，逗号分隔" },
    saveContent: { en: "Save Content", zh: "保存内容" },
    tagName: { en: "Tag name", zh: "标签名" },
    colorHint: { en: "Color (e.g. #3B82F6)", zh: "颜色（如 #3B82F6）" },
    saveTag: { en: "Save Tag", zh: "保存标签" },
    categoryName: { en: "Category name", zh: "分类名" },
    categoryDescription: { en: "Category description", zh: "分类描述" },
    saveCategory: { en: "Save Category", zh: "保存分类" },
    ruleName: { en: "Rule name", zh: "规则名" },
    contentTypeHint: { en: "Content type (all/blog/news...)", zh: "内容类型(all/blog/news...)" },
    matchModeHint: { en: "Match mode (keyword/regex)", zh: "匹配模式(keyword/regex)" },
    matchPattern: { en: "Match pattern", zh: "匹配规则" },
    tagId: { en: "Tag ID", zh: "标签ID" },
    priority: { en: "Priority", zh: "优先级" },
    enableRule: { en: "Enable rule", zh: "启用规则" },
    saveRule: { en: "Save Rule", zh: "保存规则" },
    submitDebugRecord: { en: "Submit Debug Record", zh: "提交调试记录" },
    title: { en: "Content Management Center", zh: "内容管理中心（Content Management）" },
    subtitle: { en: "Feed management, review queue, tags/categories, auto rules, and scoring debug.", zh: "Feed 管理、审核队列、分类标签、自动规则、评分调试。" },
    tabFeedManagement: { en: "Feed Management", zh: "Feed 管理" },
    tabContentReview: { en: "Content Review", zh: "内容审核" },
    tabCategoriesTags: { en: "Categories & Tags", zh: "分类 & 标签" },
    tabAutoRules: { en: "Auto Tag Rules", zh: "自动标签规则" },
    tabHackerDebug: { en: "Hacker Email Debug", zh: "hacker email 调试" },
    titleField: { en: "Title", zh: "标题" },
    type: { en: "Type", zh: "类型" },
    status: { en: "Status", zh: "状态" },
    actions: { en: "Actions", zh: "操作" },
    time: { en: "Time", zh: "时间" },
    edit: { en: "Edit", zh: "编辑" },
    delete: { en: "Delete", zh: "删除" },
    enabled: { en: "Enabled", zh: "启用" },
    disabled: { en: "Disabled", zh: "禁用" },
    unpin: { en: "Unpin", zh: "取消置顶" },
    unhide: { en: "Unhide", zh: "取消隐藏" },
    batchPin: { en: "Batch Pin", zh: "批量置顶" },
    batchHide: { en: "Batch Hide", zh: "批量隐藏" },
    softDelete: { en: "Soft Delete", zh: "软删除" },
    restore: { en: "Restore", zh: "恢复" },
    reviewStatus: { en: "Review Status", zh: "审核状态" },
    credibility: { en: "Credibility", zh: "可信度" },
    rerunAiSummary: { en: "Rerun AI Summary", zh: "重跑AI摘要" },
    pin: { en: "Pin", zh: "置顶" },
    hide: { en: "Hide", zh: "隐藏" },
    pendingQueueTitle: { en: "Pending Review Queue (User-submitted moderation)", zh: "待审核队列（用户提交内容审核机制）" },
    approve: { en: "Approve", zh: "通过" },
    requestChanges: { en: "Request Changes", zh: "退回修改" },
    reject: { en: "Reject", zh: "拒绝" },
    newTag: { en: "New Tag", zh: "新增标签" },
    newCategory: { en: "New Category", zh: "新增分类" },
    newRule: { en: "New Rule", zh: "新增规则" },
    rule: { en: "Rule", zh: "规则" },
    match: { en: "Match", zh: "匹配" },
    tag: { en: "Tag", zh: "标签" },
    hackerDebugTitle: { en: "Hacker Email Scoring Debug", zh: "hacker email 筛选评分调试" },
    newDebugRecord: { en: "New Debug Record", zh: "新增调试记录" },
  },
  // ========================================
  // Profile Admin (RBAC/Data Source)
  // ========================================
  profileAdmin: {
    // Notes:
    // 1) Keep keys grouped by feature to make future maintenance easier.
    // 2) Some labels intentionally have separate keys for different UI contexts
    //    (for example, tab text vs section heading), even if text is similar.
    // 3) Prefer stable semantic key names instead of sentence-like keys.

    // Common
    // Shared UI terms used across both RBAC and data source panels.
    refresh: { en: "Refresh", zh: "刷新" },
    loading: { en: "Loading...", zh: "加载中..." },
    close: { en: "Close", zh: "关闭" },
    cancel: { en: "Cancel", zh: "取消" },
    confirm: { en: "Confirm", zh: "确认" },
    saveFailed: { en: "Save failed", zh: "保存失败" },
    edit: { en: "Edit", zh: "编辑" },
    saving: { en: "Saving...", zh: "保存中..." },
    status: { en: "Status", zh: "状态" },
    actions: { en: "Actions", zh: "操作" },
    action: { en: "Action", zh: "动作" },
    type: { en: "Type", zh: "类型" },
    time: { en: "Time", zh: "时间" },
    target: { en: "Target", zh: "目标" },
    user: { en: "User", zh: "用户" },
    role: { en: "Role", zh: "角色" },
    roles: { en: "Roles", zh: "角色" },
    actor: { en: "Actor", zh: "操作者" },
    email: { en: "Email", zh: "邮箱" },
    system: { en: "system", zh: "system" },
    notAvailable: { en: "N/A", zh: "暂无" },
    off: { en: "Off", zh: "关闭" },

    // Data Source Management
    // Data source center labels, form fields, statuses, and operation messages.
    dataSourceManagementCenter: { en: "Data Source Management Center", zh: "数据源管理中心" },
    dataSourceCenterSubtitle: { en: "Manage data source configs, technical parameters, monitoring metrics, and crawling strategies.", zh: "管理数据源基础配置、技术参数、监控指标与抓取策略。仅管理员可访问。" },
    configuredDataSources: { en: "Configured Data Sources", zh: "已配置数据源" },
    addDataSource: { en: "Add Data Source", zh: "添加数据源" },
    createDataSource: { en: "Create Data Source", zh: "创建数据源" },
    editDataSource: { en: "Edit Data Source", zh: "编辑数据源" },
    updateDataSource: { en: "Update Data Source", zh: "更新数据源" },
    delete: { en: "Delete", zh: "删除" },
    deleteFailed: { en: "Delete failed", zh: "删除失败" },
    deleteFailedRetryLater: { en: "Delete failed. Please try again later.", zh: "删除失败，请稍后重试。" },
    confirmDeleteDataSource: { en: "Are you sure you want to delete this data source?", zh: "确认删除该数据源吗？" },
    name: { en: "Name (e.g., PostgreSQL News RSS)", zh: "名称（例如 PostgreSQL News RSS）" },
    description: { en: "Description (optional)", zh: "描述（可选）" },
    endpoint: { en: "Endpoint (RSS/URL/API/Email)", zh: "Endpoint（RSS/URL/API/Email）" },
    category: { en: "Category", zh: "分类" },
    frequency: { en: "Frequency", zh: "频率" },
    frequencyValue: { en: "Frequency value (cron optional)", zh: "频率值（cron 表达式可选）" },
    hourly: { en: "Hourly", zh: "每小时" },
    daily: { en: "Daily", zh: "每日" },
    blog: { en: "Blog", zh: "博客" },
    mailingList: { en: "Mailing List", zh: "邮件列表" },
    news: { en: "News", zh: "新闻" },
    event: { en: "Event", zh: "活动" },
    other: { en: "Other", zh: "其他" },
    enableDataSource: { en: "Enable data source", zh: "启用数据源" },
    enabled: { en: "Enabled", zh: "启用中" },
    disabled: { en: "Disabled", zh: "已禁用" },
    dataSourceCreated: { en: "Data source created.", zh: "数据源创建成功。" },
    dataSourceUpdated: { en: "Data source updated.", zh: "数据源更新成功。" },
    dataSourceDeleted: { en: "Data source deleted.", zh: "数据源已删除。" },
    dataVolumeAnomalyAlert: { en: "Data volume anomaly alert", zh: "数据量异常报警" },
    anomalyThresholdPercent: { en: "Anomaly threshold percent", zh: "异常阈值百分比" },
    anomalyAlert: { en: "Anomaly alert:", zh: "异常报警:" },
    anomalyOnWithThreshold: { en: "On (threshold", zh: "开启（阈值" },
    percentSuffix: { en: "%)", zh: "%）" },
    dedupeField: { en: "Dedupe field (optional)", zh: "去重字段（可选）" },
    hashDedupe: { en: "Hash dedupe", zh: "Hash 去重" },
    timestampDedupe: { en: "Timestamp dedupe", zh: "时间戳去重" },
    hashTimestampDedupe: { en: "Hash + Timestamp dedupe", zh: "Hash + 时间戳" },
    noDedupe: { en: "No dedupe", zh: "不去重" },
    noAuth: { en: "No Auth", zh: "无认证" },
    timeout: { en: "Timeout (seconds)", zh: "超时（秒）" },
    retryCount: { en: "Retry count", zh: "重试次数" },
    retryBackoffSeconds: { en: "Retry backoff seconds", zh: "重试退避秒数" },
    maxFetchItems: { en: "Max fetch items", zh: "最大抓取条数" },
    invalidAuthConfigJson: { en: "Invalid auth config JSON format.", zh: "认证配置 JSON 格式无效。" },
    lastSuccessfulFetch: { en: "Last successful fetch:", zh: "最后一次成功抓取时间:" },
    lastSuccessfulDedupeTimestamp: { en: "Last successful dedupe timestamp:", zh: "上次成功去重时间戳:" },
    averageProcessingTime: { en: "Average processing time:", zh: "平均处理时长:" },
    recentErrorLog: { en: "Recent error log:", zh: "最近错误日志:" },

    // RBAC Management
    // RBAC page titles, tabs, actions, role/user operations, and scope controls.
    userPermissionManagement: { en: "User & Permission Management (RBAC)", zh: "用户 & 权限管理中心（RBAC）" },
    rbacSubtitle: { en: "Manage users, roles, permissions, APIs and data source scopes by module.", zh: "按模块管理用户、角色、权限、API 与数据源作用域。" },
    accessDenied: { en: "Access denied", zh: "无权限访问" },
    adminOnlyDashboardHint: { en: "Only admin can view this dashboard.", zh: "仅 admin 账户可查看该仪表板。" },
    userManagement: { en: "User Management", zh: "用户管理" },
    usersFreezeUnfreezeTitle: { en: "Users / Freeze & Unfreeze / Subscriptions", zh: "用户管理 / 冻结解冻 / 订阅状态" },
    users: { en: "Users", zh: "用户数" },
    totalUsers: { en: "Total Users", zh: "用户总数" },
    unnamedUser: { en: "Unnamed user", zh: "未命名用户" },
    active: { en: "Active", zh: "正常" },
    freeze: { en: "Freeze", zh: "冻结" },
    unfreeze: { en: "Unfreeze", zh: "解冻" },
    frozen: { en: "Frozen", zh: "已冻结" },
    subscriptions: { en: "Subscriptions", zh: "订阅数" },
    createUser: { en: "Create User", zh: "新增用户" },
    userCreatedSuccessfully: { en: "User created successfully.", zh: "用户创建成功。" },
    userStatusRolesUpdated: { en: "User status/roles updated.", zh: "用户状态/角色更新成功。" },
    failedToCreateUser: { en: "Failed to create user", zh: "创建用户失败" },
    failedToCreateUserMessage: { en: "Failed to create user.", zh: "创建用户失败。" },
    failedToUpdateUser: { en: "Failed to update user", zh: "更新用户失败" },
    failedToUpdateUserMessage: { en: "Failed to update user.", zh: "更新用户失败。" },
    editUserRoles: { en: "Edit User Roles", zh: "编辑用户角色" },
    editRoles: { en: "Edit Roles", zh: "编辑角色" },
    optionalName: { en: "Name (optional)", zh: "姓名(可选)" },
    password: { en: "Password (>=8)", zh: "密码(>=8)" },
    roleManagement: { en: "Role Management", zh: "角色管理" },
    totalRoles: { en: "Total Roles", zh: "角色总数" },
    createRole: { en: "Create Role", zh: "新增角色" },
    roleDescription: { en: "Role description (optional)", zh: "角色描述（可选）" },
    roleKey: { en: "Role key (e.g. review_admin)", zh: "角色标识（如 review_admin）" },
    roleCreatedSuccessfully: { en: "Role created successfully.", zh: "角色创建成功。" },
    roleDeleted: { en: "Role deleted.", zh: "角色已删除。" },
    confirmDeleteRole: { en: "Are you sure you want to delete this role?", zh: "确认删除这个角色吗？" },
    systemRolesCannotBeDeleted: { en: "System roles cannot be deleted.", zh: "系统角色不允许删除。" },
    failedToCreateRole: { en: "Failed to create role", zh: "创建角色失败" },
    failedToCreateRoleMessage: { en: "Failed to create role.", zh: "创建角色失败。" },
    failedToDeleteRole: { en: "Failed to delete role", zh: "删除角色失败" },
    failedToDeleteRoleMessage: { en: "Failed to delete role.", zh: "删除角色失败。" },
    permissionGranularity: { en: "Permission Granularity", zh: "权限颗粒度" },
    permissionGranularitySettings: { en: "Permission Granularity Settings", zh: "权限颗粒度配置" },
    permissions: { en: "Permissions", zh: "权限数" },
    totalPermissions: { en: "Total Permissions", zh: "权限总数" },
    configurePermissions: { en: "Configure Permissions", zh: "配置权限" },
    rolePermissionSettings: { en: "Role Permission Settings", zh: "角色权限配置" },
    saveRolePermissions: { en: "Save Role Permissions", zh: "保存角色权限" },
    saveRoles: { en: "Save Roles", zh: "保存角色" },
    rolePermissionsUpdated: { en: "Role permissions updated.", zh: "角色权限已更新。" },
    failedToUpdateRolePermissions: { en: "Failed to update role permissions", zh: "更新角色权限失败" },
    failedToUpdateRolePermissionsMessage: { en: "Failed to update role permissions.", zh: "更新角色权限失败。" },
    // Same wording, different rendering contexts.
    apiPermissionControlTab: { en: "API Permission Control", zh: "API权限控制" },
    apiPermissionControlHeading: { en: "API Permission Control", zh: "API 权限控制" },
    apiPermissions: { en: "API Permissions", zh: "API权限数" },
    configureApiPermissions: { en: "Configure API Permissions", zh: "配置 API 权限" },
    roleApiPermissionSettings: { en: "Role API Permission Settings", zh: "角色 API 权限配置" },
    saveApiPermissions: { en: "Save API Permissions", zh: "保存 API 权限" },
    roleApiPermissionsUpdated: { en: "Role API permissions updated.", zh: "角色 API 权限已更新。" },
    failedToUpdateRoleApiPermissions: { en: "Failed to update role API permissions", zh: "更新 API 权限失败" },
    failedToUpdateApiPermissions: { en: "Failed to update API permissions.", zh: "更新 API 权限失败。" },
    dataSourceScopes: { en: "Data Source Scopes", zh: "数据源作用域" },
    dataSourceScopeSettings: { en: "Data Source Scope Settings", zh: "数据源作用域配置" },
    configureScopes: { en: "Configure Scopes", zh: "配置作用域" },
    saveDataSourceScopes: { en: "Save Data Source Scopes", zh: "保存数据源作用域" },
    configuredScopes: { en: "Configured scopes:", zh: "当前已配置作用域条数：" },
    restrictAdminDataSourcesTitle: { en: "Restrict data sources each admin can operate", zh: "控制管理员操作的数据源" },
    dataSourceScopesUpdated: { en: "Data source scopes updated.", zh: "数据源作用域已更新。" },
    failedToUpdateDataSourceScopes: { en: "Failed to update data source scopes", zh: "更新数据源作用域失败" },
    failedToUpdateDataSourceScopesMessage: { en: "Failed to update data source scopes.", zh: "更新数据源作用域失败。" },
    activityLogs: { en: "Activity Logs", zh: "行为日志" },
    userActivityLogs: { en: "User Activity Logs", zh: "用户行为日志" },
    superAdmin: { en: "Super Admin", zh: "超级管理员" },
    contentAdmin: { en: "Content Admin", zh: "内容管理员" },
    dataSourceAdmin: { en: "Data Source Admin", zh: "数据源管理员" },
    automationAdmin: { en: "Automation Admin", zh: "自动化管理员" },
    contributor: { en: "Contributor", zh: "贡献者用户" },
    member: { en: "Member", zh: "普通用户" },
    selectRole: { en: "Select role", zh: "选择角色" },
    selectUser: { en: "Select user", zh: "选择用户" },
    rolesCommaSeparatedHint: { en: "Separate roles by commas, e.g. `content_admin,member`", zh: "角色请用英文逗号分隔，例如：`content_admin,member`" },
    confirmAction: { en: "Confirm Action", zh: "确认操作" },
    confirmFreezeUser: { en: "Confirm freezing this user? They will lose normal access.", zh: "确认冻结该用户？冻结后用户将无法正常使用系统。" },
    confirmUnfreezingThisUser: { en: "Confirm unfreezing this user?", zh: "确认解冻该用户？" },
    confirmAdd: { en: "Confirm Add", zh: "确认添加" },
    confirmCreate: { en: "Confirm Create", zh: "确认新增" },
    failedToFetchRbacOverview: { en: "Failed to fetch RBAC overview", zh: "获取 RBAC 概览失败" },
    failedToLoadRbacData: { en: "Failed to load RBAC data. Please run SQL migrations first.", zh: "RBAC 数据加载失败，请先执行 SQL 迁移。" },

    // Fallback/Error Messages
    // Generic backend or fallback errors used outside strict RBAC/DataSource flows.
    failedToFetchDataSources: { en: "Failed to fetch data sources", zh: "获取数据源失败" },
    failedToLoadDataSources: { en: "Failed to load data sources. Please try again later.", zh: "加载数据源失败，请稍后重试。" },
    saveFailedCheckConfig: { en: "Save failed. Please check configuration and retry.", zh: "保存失败，请检查配置后重试。" },

  },

  // ========================================
  // Suggest Article Page
  // ========================================
  suggestArticle: {
    title: { en: "Suggest an Article", zh: "推荐文章" },
    description: {
      en: "Know a great PostgreSQL article from X, LinkedIn, or WeChat? Share the URL and we'll review it for inclusion in PGNexus.",
      zh: "发现了优质的 PostgreSQL 文章？来自 X、LinkedIn 或微信？请分享链接，我们将审核并考虑收录到 PGNexus。",
    },
    platformLabel: { en: "Platform", zh: "平台" },
    platformPlaceholder: { en: "Select a platform", zh: "选择平台" },
    urlLabel: { en: "Article URL", zh: "文章链接" },
    urlPlaceholder: { en: "https://...", zh: "https://..." },
    submitButton: { en: "Submit", zh: "提交" },
    submitting: { en: "Submitting...", zh: "提交中..." },

    // Platforms
    platformX: { en: "X (Twitter)", zh: "X (推特)" },
    platformLinkedIn: { en: "LinkedIn", zh: "领英" },
    platformWechat: { en: "WeChat", zh: "微信" },

    // Validation errors
    errorSelectPlatform: { en: "Please select a platform.", zh: "请选择平台。" },
    errorEnterUrl: { en: "Please enter a URL.", zh: "请输入链接。" },
    errorInvalidUrlX: {
      en: "X posts must start with https://x.com",
      zh: "X 帖子链接必须以 https://x.com 开头",
    },
    errorInvalidUrlLinkedIn: {
      en: "LinkedIn posts must start with https://linkedin.com",
      zh: "LinkedIn 帖子链接必须以 https://linkedin.com 开头",
    },
    errorInvalidUrlWechat: {
      en: "WeChat articles must start with https://mp.weixin.qq.com/",
      zh: "微信文章链接必须以 https://mp.weixin.qq.com/ 开头",
    },

    // Success / error messages
    submitSuccess: { en: "Article submitted successfully! We'll review it soon.", zh: "文章提交成功！我们将尽快审核。" },
    submitError: { en: "Failed to submit. Please try again.", zh: "提交失败，请重试。" },
    duplicateError: { en: "This URL has already been submitted.", zh: "该链接已被提交过。" },

    // History table
    historyTitle: { en: "Your Submissions", zh: "您的提交记录" },
    historyEmpty: { en: "You haven't submitted any articles yet.", zh: "您尚未提交任何文章。" },
    colPlatform: { en: "Platform", zh: "平台" },
    colUrl: { en: "URL", zh: "链接" },
    colStatus: { en: "Status", zh: "状态" },

    // Status badges
    statusPending: { en: "Pending", zh: "待审核" },
    statusApproved: { en: "Approved", zh: "已通过" },
    statusRejected: { en: "Rejected", zh: "已拒绝" },
  },
} as const;

// Type helper for autocomplete
export type TranslationKey = typeof translations;
