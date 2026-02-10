/**
 * Translation Dictionary for PGNexus
 *
 * Structure: Each key contains { en: string, zh: string }
 * Usage: import { translations as t } from '@/lib/translations'
 *        Then use with: useLanguage().t(t.nav.home)
 */

export const translations = {
  // ========================================
  // Navigation
  // ========================================
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
    subscribeSubtitle: { en: "Get the latest PostgreSQL news and insights delivered to your inbox", zh: "将最新的 PostgreSQL 新闻和见解直接发送到您的收件箱" },
    subscribeButton: { en: "Subscribe to Updates", zh: "订阅更新" },
    emailPlaceholder: { en: "Enter your email", zh: "输入您的电子邮件" },

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
    userMenu: { en: "User Menu", zh: "用户菜单" },

    // Dashboard
    hello: { en: "Hello", zh: "您好" },
    underConstruction: { en: "User space is currently under construction. Please check back regularly for new features.", zh: "用户空间正在建设中。请定期查看新功能。" },
    comingSoon: { en: "Coming soon", zh: "即将推出" },

    // Profile Settings
    profileSettings: { en: "Profile Settings", zh: "个人资料设置" },
    updateInfo: { en: "Update Info", zh: "更新信息" },
    updateInfoButton: { en: "Update Info", zh: "更新信息" },
    name: { en: "Name", zh: "姓名" },
    namePlaceholder: { en: "Enter your name", zh: "输入您的姓名" },
    emailReadOnly: { en: "Email (read-only)", zh: "邮箱（只读）" },
    updating: { en: "Updating...", zh: "更新中..." },

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
    dailyDigest: { en: "Daily Digest", zh: "每日摘要" },
    dailyDigestDescription: { en: "Receive a daily summary of PostgreSQL news, discussions, and updates.", zh: "接收 PostgreSQL 新闻、讨论和更新的每日摘要。" },
    weeklyDigest: { en: "Weekly Digest", zh: "每周摘要" },
    weeklyDigestDescription: { en: "Receive a weekly roundup of the most important PostgreSQL content.", zh: "接收最重要的 PostgreSQL 内容的每周汇总。" },
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
  },
} as const;

// Type helper for autocomplete
export type TranslationKey = typeof translations;
