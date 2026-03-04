"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { createPortal } from "react-dom";
import { User, Bell, Bot, LayoutDashboard, Save, Eye, EyeOff, Copy, RefreshCw, ExternalLink, Lightbulb, ExternalLink as LinkIcon, Database, Plus, Trash2, Pencil, ShieldCheck, Users, KeyRound, Activity, Lock, Unlock, Settings, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import Image from "next/image";
import ContentManagementCenter from "@/components/admin/ContentManagementCenter";
import WorkflowControlPanel from "@/components/admin/WorkflowControlPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";

type ProfileTab = "dashboard" | "profile" | "subscriptions" | "bot" | "suggest" | "data-sources" | "rbac" | "content-management" | "workflow-control" | "admin-dashboard";
type RbacInnerTab = "users" | "roles" | "permissions" | "api-permissions" | "source-scopes" | "activity-logs";
type RbacModalType = null | "create-user" | "create-role" | "role-permissions" | "role-api-permissions" | "source-scopes" | "edit-user-roles" | "confirm-freeze";

type SourceType = "rss" | "url" | "api" | "email" | "other";
type SourceCategory = "blog" | "mailing_list" | "patch" | "news" | "event" | "other";
type FrequencyMode = "hourly" | "daily" | "cron";
type AuthType = "none" | "api_key" | "oauth";
type DedupeStrategy = "hash" | "timestamp" | "hash_and_timestamp" | "none";

interface DataSourceRecord {
  id: number;
  name: string;
  description: string | null;
  sourceType: SourceType;
  category: SourceCategory;
  endpoint: string;
  isEnabled: boolean;
  frequencyMode: FrequencyMode;
  frequencyValue: string | null;
  authType: AuthType;
  authConfig: Record<string, unknown>;
  timeoutSeconds: number;
  retryCount: number;
  retryBackoffSeconds: number;
  dedupeStrategy: DedupeStrategy;
  dedupeField: string | null;
  maxFetchItems: number;
  lastSuccessAt: string | null;
  lastSuccessDedupeTs: string | null;
  lastErrorLog: string | null;
  avgProcessingMs: number | null;
  anomalyAlertEnabled: boolean;
  anomalyThresholdPct: number;
}

interface DataSourceFormState {
  name: string;
  description: string;
  sourceType: SourceType;
  category: SourceCategory;
  endpoint: string;
  isEnabled: boolean;
  frequencyMode: FrequencyMode;
  frequencyValue: string;
  authType: AuthType;
  authConfigText: string;
  timeoutSeconds: number;
  retryCount: number;
  retryBackoffSeconds: number;
  dedupeStrategy: DedupeStrategy;
  dedupeField: string;
  maxFetchItems: number;
  anomalyAlertEnabled: boolean;
  anomalyThresholdPct: number;
}

interface RbacUser {
  id: number;
  email: string;
  name: string | null;
  isFrozen: boolean;
  createdAt: string;
  roles: string[];
  subscriptionCount: number;
  lastActionAt: string | null;
}

interface RbacRole {
  id: number;
  name: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
  permissionCount: number;
  apiPermissionCount: number;
}

interface RbacPermission {
  id: number;
  code: string;
  name: string;
  module: string;
}

interface RbacApiPermission {
  id: number;
  code: string;
  method: string;
  pathPattern: string;
  name: string;
}

interface RbacDataSourceOption {
  id: number;
  name: string;
}

interface RbacSourceScope {
  userId: number;
  dataSourceId: number;
  dataSourceName: string;
  accessLevel: "read" | "write" | "admin";
}

interface RbacActivityLog {
  id: number;
  actorUserId: number | null;
  actorEmail: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  createdAt: string;
}

const defaultDataSourceForm: DataSourceFormState = {
  name: "",
  description: "",
  sourceType: "rss",
  category: "news",
  endpoint: "",
  isEnabled: true,
  frequencyMode: "daily",
  frequencyValue: "",
  authType: "none",
  authConfigText: "{}",
  timeoutSeconds: 30,
  retryCount: 3,
  retryBackoffSeconds: 10,
  dedupeStrategy: "hash",
  dedupeField: "",
  maxFetchItems: 100,
  anomalyAlertEnabled: true,
  anomalyThresholdPct: 200,
};

function UserProfileContent() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab from URL, default to dashboard
  const tabFromUrl = (searchParams.get("tab") as ProfileTab) || "dashboard";
  const [activeTab, setActiveTab] = useState<ProfileTab>(tabFromUrl);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [organization, setOrganization] = useState("");
  const [position, setPosition] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Suggest Article states
  const [suggestPlatform, setSuggestPlatform] = useState<"x" | "linkedin" | "wechat" | "">("");
  const [suggestUrl, setSuggestUrl] = useState("");
  const [suggestSubmitting, setSuggestSubmitting] = useState(false);
  const [suggestMessage, setSuggestMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [suggestHistory, setSuggestHistory] = useState<{ id: number; platform: string; url: string; status: string }[]>([]);
  const [suggestHistoryLoading, setSuggestHistoryLoading] = useState(false);
  const [dataSources, setDataSources] = useState<DataSourceRecord[]>([]);
  const [dataSourcesLoading, setDataSourcesLoading] = useState(false);
  const [dataSourceSaving, setDataSourceSaving] = useState(false);
  const [dataSourceMessage, setDataSourceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingDataSourceId, setEditingDataSourceId] = useState<number | null>(null);
  const [dataSourceForm, setDataSourceForm] = useState<DataSourceFormState>(defaultDataSourceForm);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [rbacLoading, setRbacLoading] = useState(false);
  const [rbacMessage, setRbacMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [rbacInnerTab, setRbacInnerTab] = useState<RbacInnerTab>("users");
  const [rbacModal, setRbacModal] = useState<RbacModalType>(null);
  const [rbacUsers, setRbacUsers] = useState<RbacUser[]>([]);
  const [rbacRoles, setRbacRoles] = useState<RbacRole[]>([]);
  const [rbacPermissions, setRbacPermissions] = useState<RbacPermission[]>([]);
  const [rbacApiPermissions, setRbacApiPermissions] = useState<RbacApiPermission[]>([]);
  const [rbacDataSources, setRbacDataSources] = useState<RbacDataSourceOption[]>([]);
  const [rbacSourceScopes, setRbacSourceScopes] = useState<RbacSourceScope[]>([]);
  const [rbacActivityLogs, setRbacActivityLogs] = useState<RbacActivityLog[]>([]);
  const [manualUserEmail, setManualUserEmail] = useState("");
  const [manualUserPassword, setManualUserPassword] = useState("");
  const [manualUserName, setManualUserName] = useState("");
  const [manualUserRole, setManualUserRole] = useState("member");
  const [selectedRoleIdForPerms, setSelectedRoleIdForPerms] = useState<number | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [selectedRoleIdForApiPerms, setSelectedRoleIdForApiPerms] = useState<number | null>(null);
  const [selectedApiPermissionIds, setSelectedApiPermissionIds] = useState<number[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [scopeUserId, setScopeUserId] = useState<number | null>(null);
  const [scopeAccessLevel, setScopeAccessLevel] = useState<"read" | "write" | "admin">("admin");
  const [scopeDataSourceIds, setScopeDataSourceIds] = useState<number[]>([]);
  const [userRoleDrafts, setUserRoleDrafts] = useState<Record<number, string>>({});
  const [editingUserIdForRoles, setEditingUserIdForRoles] = useState<number | null>(null);
  const [editingUserRoleCsv, setEditingUserRoleCsv] = useState("");
  const [editingUserFrozenState, setEditingUserFrozenState] = useState(false);
  const [pendingFreezeUserId, setPendingFreezeUserId] = useState<number | null>(null);
  const [pendingFreezeTarget, setPendingFreezeTarget] = useState(false);
  const [pendingFreezeRoleCsv, setPendingFreezeRoleCsv] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Bot Access states
  const [telegramSecret, setTelegramSecret] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [isLoadingSecret, setIsLoadingSecret] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch suggest article history
  const fetchSuggestHistory = useCallback(async () => {
    setSuggestHistoryLoading(true);
    try {
      const response = await fetch("/api/user/suggest-article");
      if (response.ok) {
        const data = await response.json();
        setSuggestHistory(data.submissions || []);
      }
    } catch (error) {
      console.error("Error fetching suggestion history:", error);
    } finally {
      setSuggestHistoryLoading(false);
    }
  }, []);

  const fetchDataSources = useCallback(async () => {
    // Load data source list for admin data-source tab.
    setDataSourcesLoading(true);
    setDataSourceMessage(null);
    try {
      const response = await fetch("/api/admin/data-sources");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t(trans.profileAdmin.failedToFetchDataSources));
      }

      setDataSources(data.dataSources || []);
    } catch (error) {
      console.error("Error fetching data sources:", error);
      setDataSourceMessage({ type: "error", text: t(trans.profileAdmin.failedToLoadDataSources) });
    } finally {
      setDataSourcesLoading(false);
    }
  }, [t]);

  const fetchRbacOverview = useCallback(async () => {
    // Load users/roles/permissions/api scopes summary for RBAC tab.
    setRbacLoading(true);
    setRbacMessage(null);
    try {
      const response = await fetch("/api/admin/rbac/overview");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t(trans.profileAdmin.failedToFetchRbacOverview));
      }

      const users = (data.users || []) as RbacUser[];
      const roles = (data.roles || []) as RbacRole[];
      const permissions = (data.permissions || []) as RbacPermission[];
      const apiPermissions = (data.apiPermissions || []) as RbacApiPermission[];
      const sourceScopes = (data.sourceScopes || []) as RbacSourceScope[];
      const dataSources = (data.dataSources || []) as RbacDataSourceOption[];
      const activityLogs = (data.activityLogs || []) as RbacActivityLog[];

      setRbacUsers(users);
      setRbacRoles(roles);
      setRbacPermissions(permissions);
      setRbacApiPermissions(apiPermissions);
      setRbacSourceScopes(sourceScopes);
      setRbacDataSources(dataSources);
      setRbacActivityLogs(activityLogs);

      setUserRoleDrafts(
        users.reduce<Record<number, string>>((acc, user) => {
          acc[user.id] = user.roles.join(",");
          return acc;
        }, {})
      );

      if (roles.length > 0 && !selectedRoleIdForPerms) {
        setSelectedRoleIdForPerms(roles[0].id);
      }
      if (roles.length > 0 && !selectedRoleIdForApiPerms) {
        setSelectedRoleIdForApiPerms(roles[0].id);
      }
      if (users.length > 0 && !scopeUserId) {
        setScopeUserId(users[0].id);
      }
    } catch (error) {
      console.error("Error fetching RBAC overview:", error);
      setRbacMessage({ type: "error", text: t(trans.profileAdmin.failedToLoadRbacData) });
    } finally {
      setRbacLoading(false);
    }
  }, [scopeUserId, selectedRoleIdForApiPerms, selectedRoleIdForPerms, t]);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.name) setName(data.name);
        setBio(data.bio || "");
        setCountry(data.country || "");
        setOrganization(data.organization || "");
        setPosition(data.position || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  // Fetch telegram secret function - DEFINE BEFORE ANY RETURNS
  const fetchTelegramSecret = useCallback(async () => {
    setIsLoadingSecret(true);
    try {
      const response = await fetch("/api/user/telegram-secret");
      if (response.ok) {
        const data = await response.json();
        setTelegramSecret(data.telegram_secret);
      }
    } catch (error) {
      console.error("Error fetching telegram secret:", error);
    } finally {
      setIsLoadingSecret(false);
    }
  }, []);

  // ALL EFFECTS MUST BE BEFORE ANY CONDITIONAL RETURNS
  // Update active tab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab") as ProfileTab;
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    } else if (!urlTab && activeTab !== "dashboard") {
      setActiveTab("dashboard");
    }
  }, [searchParams, activeTab]);

  // Fetch full profile when session is ready
  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session?.user, fetchProfile]);

  // Handle redirect if not authenticated
  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      router.replace("/login");
    }
  }, [status, session, router]);

  // Set a timeout for loading state (5 seconds)
  useEffect(() => {
    if (status === "loading") {
      const timeout = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000);

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [status]);

  // Fetch telegram secret when bot tab is active
  useEffect(() => {
    if (activeTab === "bot" && session?.user) {
      fetchTelegramSecret();
    }
  }, [activeTab, session, fetchTelegramSecret]);

  // Fetch suggest history when suggest tab is active
  useEffect(() => {
    if (activeTab === "suggest" && session?.user) {
      fetchSuggestHistory();
    }
  }, [activeTab, session, fetchSuggestHistory]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (activeTab === "data-sources" && session?.user) {
      fetchDataSources();
    }
  }, [activeTab, session?.user, fetchDataSources]);

  useEffect(() => {
    if (activeTab === "rbac" && session?.user) {
      fetchRbacOverview();
    }
  }, [activeTab, session?.user, fetchRbacOverview]);

  useEffect(() => {
    const isAdmin = (session?.user?.name || "").trim().toLowerCase() === "admin";
    const restrictedTabs: ProfileTab[] = ["admin-dashboard", "data-sources", "content-management", "workflow-control", "rbac"];
    if (!isAdmin && restrictedTabs.includes(activeTab)) {
      setActiveTab("dashboard");
      router.push("/user/profile?tab=dashboard", { scroll: false });
    }
  }, [activeTab, session?.user?.name, router]);

  useEffect(() => {
    setSelectedPermissionIds([]);
  }, [selectedRoleIdForPerms]);

  useEffect(() => {
    setSelectedApiPermissionIds([]);
  }, [selectedRoleIdForApiPerms]);

  // NOW WE CAN HAVE CONDITIONAL RETURNS
  // Show loading state
  if (status === "loading" && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  // If loading timeout or session check failed, redirect to login
  if (loadingTimeout || (status !== "loading" && !session?.user)) {
    if (typeof window !== 'undefined') {
      router.replace("/login");
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Redirecting...</div>
      </div>
    );
  }

  // Don't render if no session
  if (!session?.user) {
    return null;
  }

  const userName = session.user.name || session.user.email || "User";
  const isAdminUser = (session.user.name || "").trim().toLowerCase() === "admin";

  const menuItems = [
    { id: "dashboard" as const, label: t(trans.userProfile.dashboard), icon: LayoutDashboard },
    { id: "profile" as const, label: t(trans.userProfile.profile), icon: User },
    { id: "subscriptions" as const, label: t(trans.userProfile.subscriptions), icon: Bell },
    { id: "bot" as const, label: t(trans.userProfile.botAccess), icon: Bot },
    { id: "suggest" as const, label: t(trans.userProfile.suggestArticle), icon: Lightbulb },
    ...(isAdminUser
      ? [
          { id: "admin-dashboard" as const, label: t(trans.userProfile.adminDashboard), icon: Gauge },
          { id: "data-sources" as const, label: t(trans.userProfile.dataSourceManagement), icon: Database },
          { id: "content-management" as const, label: t(trans.userProfile.contentManagementCenter), icon: Pencil },
          { id: "workflow-control" as const, label: t(trans.userProfile.workflowControlPanel), icon: Settings },
          { id: "rbac" as const, label: t(trans.userProfile.userPermissionManagement), icon: ShieldCheck },
        ]
      : []),
  ];

  // Handle tab change - update URL
  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    router.push(`/user/profile?tab=${tab}`, { scroll: false });
  };

  const resetDataSourceForm = () => {
    // Reset dialog form state when opening/closing data-source modal.
    setDataSourceForm(defaultDataSourceForm);
    setEditingDataSourceId(null);
  };

  const handleEditDataSource = (dataSource: DataSourceRecord) => {
    // Open modal with current record values for editing.
    setEditingDataSourceId(dataSource.id);
    setDataSourceForm({
      name: dataSource.name,
      description: dataSource.description || "",
      sourceType: dataSource.sourceType,
      category: dataSource.category,
      endpoint: dataSource.endpoint,
      isEnabled: dataSource.isEnabled,
      frequencyMode: dataSource.frequencyMode,
      frequencyValue: dataSource.frequencyValue || "",
      authType: dataSource.authType,
      authConfigText: JSON.stringify(dataSource.authConfig || {}, null, 2),
      timeoutSeconds: dataSource.timeoutSeconds,
      retryCount: dataSource.retryCount,
      retryBackoffSeconds: dataSource.retryBackoffSeconds,
      dedupeStrategy: dataSource.dedupeStrategy,
      dedupeField: dataSource.dedupeField || "",
      maxFetchItems: dataSource.maxFetchItems,
      anomalyAlertEnabled: dataSource.anomalyAlertEnabled,
      anomalyThresholdPct: dataSource.anomalyThresholdPct,
    });
    setDataSourceMessage(null);
    setIsDataSourceModalOpen(true);
  };

  const handleCreateDataSource = () => {
    // Open modal in create mode with empty defaults.
    resetDataSourceForm();
    setDataSourceMessage(null);
    setIsDataSourceModalOpen(true);
  };

  const handleDeleteDataSource = async (id: number) => {
    // Delete a data source after explicit user confirmation.
    if (!confirm(t(trans.profileAdmin.confirmDeleteDataSource))) return;

    try {
      const response = await fetch(`/api/admin/data-sources/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t(trans.profileAdmin.deleteFailed));
      }
      setDataSourceMessage({ type: "success", text: t(trans.profileAdmin.dataSourceDeleted) });
      if (editingDataSourceId === id) {
        resetDataSourceForm();
      }
      fetchDataSources();
    } catch (error) {
      console.error("Delete data source error:", error);
      setDataSourceMessage({ type: "error", text: t(trans.profileAdmin.deleteFailedRetryLater) });
    }
  };

  const handleDataSourceSubmit = async (e: React.FormEvent) => {
    // Create or update a data source based on editingDataSourceId.
    e.preventDefault();
    setDataSourceSaving(true);
    setDataSourceMessage(null);

    let authConfig: Record<string, unknown> = {};
    try {
      authConfig = JSON.parse(dataSourceForm.authConfigText || "{}");
    } catch {
      setDataSourceMessage({ type: "error", text: t(trans.profileAdmin.invalidAuthConfigJson) });
      setDataSourceSaving(false);
      return;
    }

    const payload = {
      name: dataSourceForm.name,
      description: dataSourceForm.description,
      sourceType: dataSourceForm.sourceType,
      category: dataSourceForm.category,
      endpoint: dataSourceForm.endpoint,
      isEnabled: dataSourceForm.isEnabled,
      frequencyMode: dataSourceForm.frequencyMode,
      frequencyValue: dataSourceForm.frequencyValue,
      authType: dataSourceForm.authType,
      authConfig,
      timeoutSeconds: dataSourceForm.timeoutSeconds,
      retryCount: dataSourceForm.retryCount,
      retryBackoffSeconds: dataSourceForm.retryBackoffSeconds,
      dedupeStrategy: dataSourceForm.dedupeStrategy,
      dedupeField: dataSourceForm.dedupeField,
      maxFetchItems: dataSourceForm.maxFetchItems,
      anomalyAlertEnabled: dataSourceForm.anomalyAlertEnabled,
      anomalyThresholdPct: dataSourceForm.anomalyThresholdPct,
    };

    try {
      const url = editingDataSourceId
        ? `/api/admin/data-sources/${editingDataSourceId}`
        : "/api/admin/data-sources";
      const method = editingDataSourceId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t(trans.profileAdmin.saveFailed));
      }

      setDataSourceMessage({ type: "success", text: editingDataSourceId ? t(trans.profileAdmin.dataSourceUpdated) : t(trans.profileAdmin.dataSourceCreated) });
      resetDataSourceForm();
      setIsDataSourceModalOpen(false);
      fetchDataSources();
    } catch (error) {
      console.error("Save data source error:", error);
      setDataSourceMessage({ type: "error", text: t(trans.profileAdmin.saveFailedCheckConfig) });
    } finally {
      setDataSourceSaving(false);
    }
  };

  const handleCreateManualUser = async (e: React.FormEvent) => {
    // Manually create a user and assign initial role in RBAC panel.
    e.preventDefault();
    setRbacMessage(null);
    try {
      const response = await fetch("/api/admin/rbac/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: manualUserEmail,
          password: manualUserPassword,
          name: manualUserName,
          roleName: manualUserRole,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t(trans.profileAdmin.failedToCreateUser));

      setRbacMessage({ type: "success", text: t(trans.profileAdmin.userCreatedSuccessfully) });
      setManualUserEmail("");
      setManualUserPassword("");
      setManualUserName("");
      setManualUserRole("member");
      setRbacModal(null);
      fetchRbacOverview();
    } catch (error) {
      setRbacMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.profileAdmin.failedToCreateUserMessage) });
    }
  };

  const handleUpdateUserRbac = async (userId: number, isFrozen: boolean, roleCsv: string) => {
    // Update frozen status and role set for a specific user.
    setRbacMessage(null);
    const roles = roleCsv
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`/api/admin/rbac/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFrozen, roles }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t(trans.profileAdmin.failedToUpdateUser));

      setRbacMessage({ type: "success", text: t(trans.profileAdmin.userStatusRolesUpdated) });
      fetchRbacOverview();
    } catch (error) {
      setRbacMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.profileAdmin.failedToUpdateUserMessage) });
    }
  };

  const openEditUserRolesModal = (userId: number, currentRoleCsv: string, isFrozen: boolean) => {
    // Open role-edit dialog with current user role snapshot.
    setEditingUserIdForRoles(userId);
    setEditingUserRoleCsv(currentRoleCsv);
    setEditingUserFrozenState(isFrozen);
    setRbacModal("edit-user-roles");
  };

  const handleSaveUserRolesFromModal = async () => {
    // Save role edits from modal and close dialog.
    if (!editingUserIdForRoles) return;
    await handleUpdateUserRbac(editingUserIdForRoles, editingUserFrozenState, editingUserRoleCsv);
    setRbacModal(null);
    setEditingUserIdForRoles(null);
  };

  const openFreezeConfirmModal = (userId: number, targetFrozen: boolean, roleCsv: string) => {
    // Open confirmation dialog for freeze/unfreeze action.
    setPendingFreezeUserId(userId);
    setPendingFreezeTarget(targetFrozen);
    setPendingFreezeRoleCsv(roleCsv);
    setRbacModal("confirm-freeze");
  };

  const handleConfirmFreezeAction = async () => {
    // Commit freeze/unfreeze action selected in confirmation dialog.
    if (!pendingFreezeUserId) return;
    await handleUpdateUserRbac(pendingFreezeUserId, pendingFreezeTarget, pendingFreezeRoleCsv);
    setPendingFreezeUserId(null);
    setPendingFreezeRoleCsv("");
    setRbacModal(null);
  };

  const handleSaveRolePermissions = async () => {
    // Bind selected permission IDs to the chosen role.
    if (!selectedRoleIdForPerms) return;
    setRbacMessage(null);
    try {
      const response = await fetch("/api/admin/rbac/role-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: selectedRoleIdForPerms, permissionIds: selectedPermissionIds }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t(trans.profileAdmin.failedToUpdateRolePermissions));
      setRbacMessage({ type: "success", text: t(trans.profileAdmin.rolePermissionsUpdated) });
      setRbacModal(null);
      fetchRbacOverview();
    } catch (error) {
      setRbacMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.profileAdmin.failedToUpdateRolePermissionsMessage) });
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    // Create custom RBAC role with name and optional description.
    e.preventDefault();
    setRbacMessage(null);
    try {
      const response = await fetch("/api/admin/rbac/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoleName, description: newRoleDescription }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t(trans.profileAdmin.failedToCreateRole));
      setRbacMessage({ type: "success", text: t(trans.profileAdmin.roleCreatedSuccessfully) });
      setNewRoleName("");
      setNewRoleDescription("");
      setRbacModal(null);
      fetchRbacOverview();
    } catch (error) {
      setRbacMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.profileAdmin.failedToCreateRoleMessage) });
    }
  };

  const handleDeleteRole = async (roleId: number, isSystem: boolean) => {
    // Delete non-system role after user confirmation.
    if (isSystem) {
      setRbacMessage({ type: "error", text: t(trans.profileAdmin.systemRolesCannotBeDeleted) });
      return;
    }
    if (!confirm(t(trans.profileAdmin.confirmDeleteRole))) return;

    setRbacMessage(null);
    try {
      const response = await fetch(`/api/admin/rbac/roles/${roleId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t(trans.profileAdmin.failedToDeleteRole));
      setRbacMessage({ type: "success", text: t(trans.profileAdmin.roleDeleted) });
      fetchRbacOverview();
    } catch (error) {
      setRbacMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.profileAdmin.failedToDeleteRoleMessage) });
    }
  };

  const handleSaveRoleApiPermissions = async () => {
    // Bind API permissions to a role for endpoint-level access control.
    if (!selectedRoleIdForApiPerms) return;
    setRbacMessage(null);
    try {
      const response = await fetch("/api/admin/rbac/role-api-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: selectedRoleIdForApiPerms, apiPermissionIds: selectedApiPermissionIds }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t(trans.profileAdmin.failedToUpdateRoleApiPermissions));
      setRbacMessage({ type: "success", text: t(trans.profileAdmin.roleApiPermissionsUpdated) });
      setRbacModal(null);
      fetchRbacOverview();
    } catch (error) {
      setRbacMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.profileAdmin.failedToUpdateApiPermissions) });
    }
  };

  const handleSaveSourceScopes = async () => {
    // Save per-user data-source operation scopes.
    if (!scopeUserId) return;
    setRbacMessage(null);
    try {
      const response = await fetch("/api/admin/rbac/source-scopes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: scopeUserId,
          scopes: scopeDataSourceIds.map((dataSourceId) => ({
            dataSourceId,
            accessLevel: scopeAccessLevel,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t(trans.profileAdmin.failedToUpdateDataSourceScopes));
      setRbacMessage({ type: "success", text: t(trans.profileAdmin.dataSourceScopesUpdated) });
      setRbacModal(null);
      fetchRbacOverview();
    } catch (error) {
      setRbacMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.profileAdmin.failedToUpdateDataSourceScopesMessage) });
    }
  };

  const dataSourceModal = isClient && isDataSourceModalOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => {
            setIsDataSourceModalOpen(false);
            resetDataSourceForm();
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-5 py-4 backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {editingDataSourceId ? t(trans.profileAdmin.editDataSource) : t(trans.profileAdmin.addDataSource)}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDataSourceModalOpen(false);
                  resetDataSourceForm();
                }}
              >
                {t(trans.profileAdmin.close)}
              </Button>
            </div>

            <form
              onSubmit={handleDataSourceSubmit}
              className="max-h-[calc(90vh-72px)] overflow-y-auto space-y-4 px-5 py-4 [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
            >
              <Input
                placeholder={t(trans.profileAdmin.name)}
                value={dataSourceForm.name}
                onChange={(e) => setDataSourceForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                placeholder={t(trans.profileAdmin.description)}
                value={dataSourceForm.description}
                onChange={(e) => setDataSourceForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <Input
                placeholder={t(trans.profileAdmin.endpoint)}
                value={dataSourceForm.endpoint}
                onChange={(e) => setDataSourceForm((prev) => ({ ...prev, endpoint: e.target.value }))}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={dataSourceForm.sourceType}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, sourceType: e.target.value as SourceType }))}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="rss">RSS</option>
                  <option value="url">URL</option>
                  <option value="api">API</option>
                  <option value="email">Email</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={dataSourceForm.category}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, category: e.target.value as SourceCategory }))}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="blog">{t(trans.profileAdmin.blog)}</option>
                  <option value="mailing_list">{t(trans.profileAdmin.mailingList)}</option>
                  <option value="patch">Patch</option>
                  <option value="news">{t(trans.profileAdmin.news)}</option>
                  <option value="event">{t(trans.profileAdmin.event)}</option>
                  <option value="other">{t(trans.profileAdmin.other)}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={dataSourceForm.frequencyMode}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, frequencyMode: e.target.value as FrequencyMode }))}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="hourly">{t(trans.profileAdmin.hourly)}</option>
                  <option value="daily">{t(trans.profileAdmin.daily)}</option>
                  <option value="cron">Cron</option>
                </select>
                <Input
                  placeholder={t(trans.profileAdmin.frequencyValue)}
                  value={dataSourceForm.frequencyValue}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, frequencyValue: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={dataSourceForm.authType}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, authType: e.target.value as AuthType }))}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="none">{t(trans.profileAdmin.noAuth)}</option>
                  <option value="api_key">API Key</option>
                  <option value="oauth">OAuth</option>
                </select>
                <Input
                  placeholder={t(trans.profileAdmin.dedupeField)}
                  value={dataSourceForm.dedupeField}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, dedupeField: e.target.value }))}
                />
              </div>

              <select
                value={dataSourceForm.dedupeStrategy}
                onChange={(e) => setDataSourceForm((prev) => ({ ...prev, dedupeStrategy: e.target.value as DedupeStrategy }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="hash">{t(trans.profileAdmin.hashDedupe)}</option>
                <option value="timestamp">{t(trans.profileAdmin.timestampDedupe)}</option>
                <option value="hash_and_timestamp">{t(trans.profileAdmin.hashTimestampDedupe)}</option>
                <option value="none">{t(trans.profileAdmin.noDedupe)}</option>
              </select>

              <textarea
                rows={3}
                value={dataSourceForm.authConfigText}
                onChange={(e) => setDataSourceForm((prev) => ({ ...prev, authConfigText: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                placeholder={t('Auth config JSON, e.g. {"apiKey":"***"}', '认证配置 JSON，例如 {"apiKey":"***"}')}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min={1}
                  max={600}
                  value={dataSourceForm.timeoutSeconds}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, timeoutSeconds: Number(e.target.value) || 30 }))}
                  placeholder={t(trans.profileAdmin.timeout)}
                />
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={dataSourceForm.retryCount}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, retryCount: Number(e.target.value) || 0 }))}
                  placeholder={t(trans.profileAdmin.retryCount)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min={0}
                  max={3600}
                  value={dataSourceForm.retryBackoffSeconds}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, retryBackoffSeconds: Number(e.target.value) || 0 }))}
                  placeholder={t(trans.profileAdmin.retryBackoffSeconds)}
                />
                <Input
                  type="number"
                  min={1}
                  max={5000}
                  value={dataSourceForm.maxFetchItems}
                  onChange={(e) => setDataSourceForm((prev) => ({ ...prev, maxFetchItems: Number(e.target.value) || 1 }))}
                  placeholder={t(trans.profileAdmin.maxFetchItems)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={dataSourceForm.isEnabled}
                    onChange={(e) => setDataSourceForm((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                  />
                  {t(trans.profileAdmin.enableDataSource)}
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={dataSourceForm.anomalyAlertEnabled}
                    onChange={(e) => setDataSourceForm((prev) => ({ ...prev, anomalyAlertEnabled: e.target.checked }))}
                  />
                  {t(trans.profileAdmin.dataVolumeAnomalyAlert)}
                </label>
              </div>

              <Input
                type="number"
                min={100}
                max={1000}
                value={dataSourceForm.anomalyThresholdPct}
                onChange={(e) => setDataSourceForm((prev) => ({ ...prev, anomalyThresholdPct: Number(e.target.value) || 100 }))}
                placeholder={t(trans.profileAdmin.anomalyThresholdPercent)}
              />

              <Button type="submit" disabled={dataSourceSaving} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                {dataSourceSaving ? t(trans.profileAdmin.saving) : editingDataSourceId ? t(trans.profileAdmin.updateDataSource) : t(trans.profileAdmin.createDataSource)}
              </Button>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;

  const rbacModalNode = isClient && rbacModal
    ? createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setRbacModal(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-5 py-4 backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {rbacModal === "create-user" && t(trans.profileAdmin.createUser)}
                {rbacModal === "create-role" && t(trans.profileAdmin.createRole)}
                {rbacModal === "role-permissions" && t(trans.profileAdmin.rolePermissionSettings)}
                {rbacModal === "role-api-permissions" && t(trans.profileAdmin.roleApiPermissionSettings)}
                {rbacModal === "source-scopes" && t(trans.profileAdmin.dataSourceScopeSettings)}
                {rbacModal === "edit-user-roles" && t(trans.profileAdmin.editUserRoles)}
                {rbacModal === "confirm-freeze" && t(trans.profileAdmin.confirmAction)}
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setRbacModal(null)}>
                {t(trans.profileAdmin.close)}
              </Button>
            </div>

            <div className="max-h-[calc(90vh-72px)] overflow-y-auto space-y-4 px-5 py-4 [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              {rbacModal === "create-user" && (
                <form onSubmit={handleCreateManualUser} className="grid md:grid-cols-2 gap-3">
                  <Input placeholder={t(trans.profileAdmin.email)} value={manualUserEmail} onChange={(e) => setManualUserEmail(e.target.value)} />
                  <Input placeholder={t(trans.profileAdmin.password)} type="password" value={manualUserPassword} onChange={(e) => setManualUserPassword(e.target.value)} />
                  <Input placeholder={t(trans.profileAdmin.optionalName)} value={manualUserName} onChange={(e) => setManualUserName(e.target.value)} />
                  <select
                    value={manualUserRole}
                    onChange={(e) => setManualUserRole(e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  >
                    <option value="super_admin">{t(trans.profileAdmin.superAdmin)}</option>
                    <option value="content_admin">{t(trans.profileAdmin.contentAdmin)}</option>
                    <option value="data_source_admin">{t(trans.profileAdmin.dataSourceAdmin)}</option>
                    <option value="automation_admin">{t(trans.profileAdmin.automationAdmin)}</option>
                    <option value="contributor">{t(trans.profileAdmin.contributor)}</option>
                    <option value="member">{t(trans.profileAdmin.member)}</option>
                  </select>
                  <div className="md:col-span-2">
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.profileAdmin.confirmAdd)}</Button>
                  </div>
                </form>
              )}

              {rbacModal === "create-role" && (
                <form onSubmit={handleCreateRole} className="grid md:grid-cols-2 gap-3">
                  <Input placeholder={t(trans.profileAdmin.roleKey)} value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                  <Input placeholder={t(trans.profileAdmin.roleDescription)} value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} />
                  <div className="md:col-span-2">
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.profileAdmin.confirmCreate)}</Button>
                  </div>
                </form>
              )}

              {rbacModal === "role-permissions" && (
                <div className="space-y-3">
                  <select
                    value={selectedRoleIdForPerms ?? ""}
                    onChange={(e) => setSelectedRoleIdForPerms(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  >
                    <option value="">{t(trans.profileAdmin.selectRole)}</option>
                    {rbacRoles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {rbacPermissions.map((permission) => (
                      <label key={permission.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedPermissionIds.includes(permission.id)}
                          onChange={(e) => {
                            setSelectedPermissionIds((prev) =>
                              e.target.checked ? [...prev, permission.id] : prev.filter((id) => id !== permission.id)
                            );
                          }}
                        />
                        <span>{permission.code}</span>
                      </label>
                    ))}
                  </div>
                  <Button onClick={handleSaveRolePermissions} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.profileAdmin.saveRolePermissions)}</Button>
                </div>
              )}

              {rbacModal === "role-api-permissions" && (
                <div className="space-y-3">
                  <select
                    value={selectedRoleIdForApiPerms ?? ""}
                    onChange={(e) => setSelectedRoleIdForApiPerms(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  >
                    <option value="">{t(trans.profileAdmin.selectRole)}</option>
                    {rbacRoles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {rbacApiPermissions.map((permission) => (
                      <label key={permission.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedApiPermissionIds.includes(permission.id)}
                          onChange={(e) => {
                            setSelectedApiPermissionIds((prev) =>
                              e.target.checked ? [...prev, permission.id] : prev.filter((id) => id !== permission.id)
                            );
                          }}
                        />
                        <span>{permission.method} {permission.pathPattern}</span>
                      </label>
                    ))}
                  </div>
                  <Button onClick={handleSaveRoleApiPermissions} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.profileAdmin.saveApiPermissions)}</Button>
                </div>
              )}

              {rbacModal === "source-scopes" && (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <select
                      value={scopeUserId ?? ""}
                      onChange={(e) => setScopeUserId(Number(e.target.value))}
                      className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                    >
                      <option value="">{t(trans.profileAdmin.selectUser)}</option>
                      {rbacUsers.map((user) => (
                        <option key={user.id} value={user.id}>{user.email}</option>
                      ))}
                    </select>
                    <select
                      value={scopeAccessLevel}
                      onChange={(e) => setScopeAccessLevel(e.target.value as "read" | "write" | "admin")}
                      className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                    >
                      <option value="read">read</option>
                      <option value="write">write</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {rbacDataSources.map((source) => (
                      <label key={source.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={scopeDataSourceIds.includes(source.id)}
                          onChange={(e) => {
                            setScopeDataSourceIds((prev) =>
                              e.target.checked ? [...prev, source.id] : prev.filter((id) => id !== source.id)
                            );
                          }}
                        />
                        <span>{source.name}</span>
                      </label>
                    ))}
                  </div>
                  <Button onClick={handleSaveSourceScopes} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.profileAdmin.saveDataSourceScopes)}</Button>
                </div>
              )}

              {rbacModal === "edit-user-roles" && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t(trans.profileAdmin.rolesCommaSeparatedHint)}</p>
                  <Input
                    value={editingUserRoleCsv}
                    onChange={(e) => setEditingUserRoleCsv(e.target.value)}
                    placeholder="role1,role2"
                  />
                  <Button onClick={handleSaveUserRolesFromModal} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {t(trans.profileAdmin.saveRoles)}
                  </Button>
                </div>
              )}

              {rbacModal === "confirm-freeze" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {pendingFreezeTarget ? t(trans.profileAdmin.confirmFreezeUser) : t(trans.profileAdmin.confirmUnfreezingThisUser)}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setRbacModal(null)}>{t(trans.profileAdmin.cancel)}</Button>
                    <Button onClick={handleConfirmFreezeAction} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      {t(trans.profileAdmin.confirm)}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, country, organization, position }),
      });
      if (response.ok) {
        setProfileUpdateSuccess(true);
        setTimeout(() => setProfileUpdateSuccess(false), 3000);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    setIsUpdating(true);
    // TODO: Implement API call to change password
    setTimeout(() => {
      alert("Password change functionality will be implemented soon!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdating(false);
    }, 1000);
  };

  const handleGenerateSecret = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/user/telegram-secret", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setTelegramSecret(data.telegram_secret);
        setShowSecret(true);
      }
    } catch (error) {
      console.error("Error generating telegram secret:", error);
      alert("Failed to generate secret. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySecret = () => {
    if (telegramSecret) {
      navigator.clipboard.writeText(telegramSecret);
      alert(t(trans.userProfile.secretCopied));
    }
  };

  const maskSecret = (secret: string) => {
    return "*".repeat(secret.length);
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestMessage(null);

    if (!suggestPlatform) {
      setSuggestMessage({ type: "error", text: t(trans.suggestArticle.errorSelectPlatform) });
      return;
    }
    if (!suggestUrl.trim()) {
      setSuggestMessage({ type: "error", text: t(trans.suggestArticle.errorEnterUrl) });
      return;
    }

    const prefixes: Record<string, string> = {
      x: "https://x.com",
      linkedin: "https://linkedin.com",
      wechat: "https://mp.weixin.qq.com/",
    };
    const errorKeys: Record<string, { en: string; zh: string }> = {
      x: trans.suggestArticle.errorInvalidUrlX,
      linkedin: trans.suggestArticle.errorInvalidUrlLinkedIn,
      wechat: trans.suggestArticle.errorInvalidUrlWechat,
    };

    if (!suggestUrl.startsWith(prefixes[suggestPlatform])) {
      setSuggestMessage({ type: "error", text: t(errorKeys[suggestPlatform]) });
      return;
    }

    setSuggestSubmitting(true);
    try {
      const response = await fetch("/api/user/suggest-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: suggestPlatform, url: suggestUrl.trim() }),
      });

      if (response.status === 409) {
        setSuggestMessage({ type: "error", text: t(trans.suggestArticle.duplicateError) });
        return;
      }

      if (!response.ok) {
        setSuggestMessage({ type: "error", text: t(trans.suggestArticle.submitError) });
        return;
      }

      const data = await response.json();
      setSuggestHistory((prev) => [data.submission, ...prev]);
      setSuggestUrl("");
      setSuggestPlatform("");
      setSuggestMessage({ type: "success", text: t(trans.suggestArticle.submitSuccess) });
    } catch (error) {
      console.error("Error submitting article:", error);
      setSuggestMessage({ type: "error", text: t(trans.suggestArticle.submitError) });
    } finally {
      setSuggestSubmitting(false);
    }
  };
  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 px-3">
              {t(trans.userProfile.userMenu)}
            </h2>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-start gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                    <span className="text-left leading-snug break-words">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-8">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-2 border-white dark:border-slate-800">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                          {t(trans.userProfile.hello)} {userName}!
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    {!(bio && organization && position) && (
                      <div>
                        <Button
                          onClick={() => handleTabChange("profile")}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          {t(trans.userProfile.completeProfile)}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    {t(trans.userProfile.dashboard)}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {t(trans.userProfile.underConstruction)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                    <div className="animate-pulse flex gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animation-delay-200"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animation-delay-400"></div>
                    </div>
                    <span>{t(trans.userProfile.comingSoon)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admin-dashboard" && (
              isAdminUser ? (
                <AdminDashboard />
              ) : (
                <div className="max-w-3xl">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{t(trans.profileAdmin.accessDenied)}</h2>
                  <p className="text-sm text-slate-500 mt-2">{t(trans.profileAdmin.adminOnlyDashboardHint)}</p>
                </div>
              )
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                  {t(trans.userProfile.profileSettings)}
                </h2>

                {/* Update Profile Form */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6">
                    {t(trans.userProfile.updateInfo)}
                  </h3>

                  {profileUpdateSuccess && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 font-medium">
                      {t(trans.userProfile.profileUpdateSuccess)}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Avatar */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        {t(trans.userProfile.avatar)}
                      </label>
                      <div className="flex items-center gap-5">
                        <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 shadow">
                          {avatar ? (
                            <Image
                              src={avatar}
                              alt="Avatar preview"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-3xl font-bold">
                              {name ? name.charAt(0).toUpperCase() : session.user.email?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all"
                          >
                            <User className="h-4 w-4" />
                            {t(trans.userProfile.uploadAvatar)}
                          </label>
                          {avatar && (
                            <button
                              type="button"
                              onClick={() => setAvatar(null)}
                              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-left transition-colors"
                            >
                              Remove photo
                            </button>
                          )}
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            JPG, PNG or GIF.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t(trans.userProfile.name)}
                        </label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t(trans.userProfile.namePlaceholder)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t(trans.userProfile.emailReadOnly)}
                        </label>
                        <Input
                          type="email"
                          value={session.user.email || ""}
                          disabled
                          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Organization + Position */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t(trans.userProfile.organization)}
                        </label>
                        <Input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder={t(trans.userProfile.organizationPlaceholder)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t(trans.userProfile.position)}
                        </label>
                        <Input
                          type="text"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          placeholder={t(trans.userProfile.positionPlaceholder)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.country)}
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      >
                        <option value="">{t(trans.userProfile.countryPlaceholder)}</option>
                        <option value="CN">China</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="KR">South Korea</option>
                        <option value="IN">India</option>
                        <option value="AU">Australia</option>
                        <option value="CA">Canada</option>
                        <option value="BR">Brazil</option>
                        <option value="RU">Russia</option>
                        <option value="NL">Netherlands</option>
                        <option value="SE">Sweden</option>
                        <option value="NO">Norway</option>
                        <option value="FI">Finland</option>
                        <option value="DK">Denmark</option>
                        <option value="CH">Switzerland</option>
                        <option value="AT">Austria</option>
                        <option value="PL">Poland</option>
                        <option value="ES">Spain</option>
                        <option value="IT">Italy</option>
                        <option value="PT">Portugal</option>
                        <option value="SG">Singapore</option>
                        <option value="HK">Hong Kong</option>
                        <option value="TW">Taiwan</option>
                        <option value="ID">Indonesia</option>
                        <option value="MY">Malaysia</option>
                        <option value="TH">Thailand</option>
                        <option value="VN">Vietnam</option>
                        <option value="NZ">New Zealand</option>
                        <option value="ZA">South Africa</option>
                        <option value="NG">Nigeria</option>
                        <option value="EG">Egypt</option>
                        <option value="MX">Mexico</option>
                        <option value="AR">Argentina</option>
                        <option value="IL">Israel</option>
                        <option value="TR">Turkey</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="AE">United Arab Emirates</option>
                      </select>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.bio)}
                        <span className="ml-2 text-xs font-normal text-slate-400">({bio.length}/300)</span>
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value.slice(0, 300))}
                        placeholder={t(trans.userProfile.bioPlaceholder)}
                        rows={4}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? t(trans.userProfile.updating) : t(trans.userProfile.updateInfoButton)}
                    </Button>
                  </form>
                </div>

                {/* Change Password Form */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    {t(trans.userProfile.changePassword)}
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.currentPassword)}
                      </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t(trans.userProfile.currentPasswordPlaceholder)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.newPassword)}
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t(trans.userProfile.newPasswordPlaceholder)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.confirmNewPassword)}
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t(trans.userProfile.confirmNewPasswordPlaceholder)}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? t(trans.userProfile.updating) : t(trans.userProfile.changePasswordButton)}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === "subscriptions" && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {t(trans.userProfile.subscriptionsTitle)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {t(trans.userProfile.subscriptionsDescription)}
                </p>

                <div className="space-y-6">
                  {/* Daily Digest */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {t(trans.userProfile.dailyDigest)}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {t(trans.userProfile.dailyDigestDescription)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          onClick={() => window.open('https://lists.ivorysql.org/postorius/lists/pgtechdailycn.ivorysql.org/', 'manageSubscription', 'width=1000,height=800,scrollbars=yes,resizable=yes')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t(trans.userProfile.manageSubscription)}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Digest */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {t(trans.userProfile.weeklyDigest)}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {t(trans.userProfile.weeklyDigestDescription)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          onClick={() => window.open('https://lists.ivorysql.org/postorius/lists/pgtechweeklycn.ivorysql.org/', 'manageSubscription', 'width=1000,height=800,scrollbars=yes,resizable=yes')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t(trans.userProfile.manageSubscription)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bot Access Tab */}
            {activeTab === "bot" && (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {t(trans.userProfile.telegramBotTitle)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {t(trans.userProfile.telegramBotDescription)}
                </p>

                {/* Secret Key Section */}
                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t(trans.userProfile.yourSecret)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {t(trans.userProfile.secretDescription)}
                  </p>

                  {isLoadingSecret ? (
                    <div className="text-center py-4">
                      <span className="text-slate-600 dark:text-slate-400">
                        {t(trans.userProfile.loading)}
                      </span>
                    </div>
                  ) : telegramSecret ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={showSecret ? telegramSecret : maskSecret(telegramSecret)}
                          readOnly
                          className="font-mono bg-white dark:bg-slate-900"
                        />
                        <Button
                          onClick={() => setShowSecret(!showSecret)}
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={handleCopySecret}
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleGenerateSecret}
                        disabled={isGenerating}
                        variant="outline"
                        className="w-full"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                        {isGenerating ? t(trans.userProfile.generating) : t(trans.userProfile.regenerateSecret)}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {t(trans.userProfile.noSecretYet)}
                      </p>
                      <Button
                        onClick={handleGenerateSecret}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Bot className={`h-4 w-4 mr-2 ${isGenerating ? "animate-pulse" : ""}`} />
                        {isGenerating ? t(trans.userProfile.generating) : t(trans.userProfile.generateSecret)}
                      </Button>
                    </div>
                  )}
                </div>

                {/* How to Use Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    {t(trans.userProfile.howToUse)}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        1
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step1)} <span className="font-semibold">@pgnexus_bot</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        2
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step2)} <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">{t(trans.userProfile.startCommand)}</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        3
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step3)} <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">{t(trans.userProfile.step3Command)}</span> {t(trans.userProfile.step3Suffix)}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        4
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Telegram Link and QR Code */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Telegram Link */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      PGNexus Bot
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      @pgnexus_bot
                    </p>
                    <Button
                      onClick={() => window.open("https://t.me/pgnexus_bot", "_blank")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t(trans.userProfile.openTelegram)}
                    </Button>
                  </div>

                  {/* QR Code */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                      {t(trans.userProfile.scanQrCode)}
                    </p>
                    <div className="relative w-48 h-48 bg-white dark:bg-slate-900 rounded-lg p-2 shadow-md">
                      <Image
                        src="/images/pgnexus-telegram.webp"
                        alt="PGNexus Telegram Bot QR Code"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Suggest Article Tab */}
            {activeTab === "suggest" && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {t(trans.suggestArticle.title)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {t(trans.suggestArticle.description)}
                </p>

                {/* Submission Form */}
                <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <form onSubmit={handleSuggestSubmit} className="space-y-5">
                    {/* Platform */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.suggestArticle.platformLabel)}
                      </label>
                      <select
                        value={suggestPlatform}
                        onChange={(e) => {
                          setSuggestPlatform(e.target.value as "x" | "linkedin" | "wechat" | "");
                          setSuggestMessage(null);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t(trans.suggestArticle.platformPlaceholder)}</option>
                        <option value="x">{t(trans.suggestArticle.platformX)}</option>
                        <option value="linkedin">{t(trans.suggestArticle.platformLinkedIn)}</option>
                        <option value="wechat">{t(trans.suggestArticle.platformWechat)}</option>
                      </select>
                    </div>

                    {/* URL */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.suggestArticle.urlLabel)}
                      </label>
                      <Input
                        type="url"
                        value={suggestUrl}
                        onChange={(e) => {
                          setSuggestUrl(e.target.value);
                          setSuggestMessage(null);
                        }}
                        placeholder={t(trans.suggestArticle.urlPlaceholder)}
                        className="w-full"
                      />
                    </div>

                    {/* Feedback message */}
                    {suggestMessage && (
                      <p
                        className={`text-sm font-medium ${
                          suggestMessage.type === "success"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {suggestMessage.text}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={suggestSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {suggestSubmitting
                        ? t(trans.suggestArticle.submitting)
                        : t(trans.suggestArticle.submitButton)}
                    </Button>
                  </form>
                </div>

                {/* Submission History */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    {t(trans.suggestArticle.historyTitle)}
                  </h3>

                  {suggestHistoryLoading ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {t(trans.common.loading)}
                    </p>
                  ) : suggestHistory.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {t(trans.suggestArticle.historyEmpty)}
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-left">
                            <th className="px-4 py-3 font-medium w-32">{t(trans.suggestArticle.colPlatform)}</th>
                            <th className="px-4 py-3 font-medium">{t(trans.suggestArticle.colUrl)}</th>
                            <th className="px-4 py-3 font-medium w-28">{t(trans.suggestArticle.colStatus)}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {suggestHistory.map((item) => {
                            const platformLabels: Record<string, { en: string; zh: string }> = {
                              x: trans.suggestArticle.platformX,
                              linkedin: trans.suggestArticle.platformLinkedIn,
                              wechat: trans.suggestArticle.platformWechat,
                            };
                            const statusLabels: Record<string, { en: string; zh: string }> = {
                              pending: trans.suggestArticle.statusPending,
                              approved: trans.suggestArticle.statusApproved,
                              rejected: trans.suggestArticle.statusRejected,
                            };
                            const statusColors: Record<string, string> = {
                              pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                              approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                              rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                            };

                            return (
                              <tr
                                key={item.id}
                                className="bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                              >
                                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                                  {platformLabels[item.platform]
                                    ? t(platformLabels[item.platform])
                                    : item.platform}
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs">
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                                  >
                                    <span className="truncate">{item.url}</span>
                                    <LinkIcon className="h-3 w-3 flex-shrink-0" />
                                  </a>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      statusColors[item.status] || "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {statusLabels[item.status]
                                      ? t(statusLabels[item.status])
                                      : item.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Management Tab */}
            {isAdminUser && activeTab === "content-management" && <ContentManagementCenter />}

            {/* Workflow Control Tab */}
            {isAdminUser && activeTab === "workflow-control" && <WorkflowControlPanel />}

            {/* RBAC Tab */}
            {isAdminUser && activeTab === "rbac" && (
              <div className="max-w-6xl space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t(trans.profileAdmin.userPermissionManagement)}</h2>
                    <p className="text-slate-600 dark:text-slate-400">{t(trans.profileAdmin.rbacSubtitle)}</p>
                  </div>
                  <Button variant="outline" onClick={fetchRbacOverview} disabled={rbacLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${rbacLoading ? "animate-spin" : ""}`} />
                    {t(trans.profileAdmin.refresh)}
                  </Button>
                </div>

                {rbacMessage && (
                  <div className={`p-4 rounded-lg border text-sm font-medium ${rbacMessage.type === "success" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400"}`}>
                    {rbacMessage.text}
                  </div>
                )}

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Users className="h-4 w-4" />{t(trans.profileAdmin.totalUsers)}</div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{rbacUsers.length}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><ShieldCheck className="h-4 w-4" />{t(trans.profileAdmin.totalRoles)}</div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{rbacRoles.length}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><KeyRound className="h-4 w-4" />{t(trans.profileAdmin.totalPermissions)}</div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{rbacPermissions.length + rbacApiPermissions.length}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "users", label: t(trans.profileAdmin.userManagement) },
                    { id: "roles", label: t(trans.profileAdmin.roleManagement) },
                    { id: "permissions", label: t(trans.profileAdmin.permissionGranularity) },
                    { id: "api-permissions", label: t(trans.profileAdmin.apiPermissionControlTab) },
                    { id: "source-scopes", label: t(trans.profileAdmin.dataSourceScopes) },
                    { id: "activity-logs", label: t(trans.profileAdmin.activityLogs) },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setRbacInnerTab(tab.id as RbacInnerTab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${rbacInnerTab === tab.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {rbacInnerTab === "users" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.profileAdmin.usersFreezeUnfreezeTitle)}</h3>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setRbacModal("create-user")}>{t(trans.profileAdmin.createUser)}</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500">
                            <th className="py-2">{t(trans.profileAdmin.user)}</th>
                            <th className="py-2">{t(trans.profileAdmin.roles)}</th>
                            <th className="py-2">{t(trans.profileAdmin.subscriptions)}</th>
                            <th className="py-2">{t(trans.profileAdmin.status)}</th>
                            <th className="py-2">{t(trans.profileAdmin.actions)}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {rbacUsers.map((user) => (
                            <tr key={user.id}>
                              <td className="py-2">
                                <div className="font-medium text-slate-800 dark:text-slate-200">{user.email}</div>
                                <div className="text-xs text-slate-500">{user.name || t(trans.profileAdmin.unnamedUser)}</div>
                              </td>
                              <td className="py-2 min-w-[280px]">{(userRoleDrafts[user.id] ?? user.roles.join(",")) || "-"}</td>
                              <td className="py-2">{user.subscriptionCount}</td>
                              <td className="py-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${user.isFrozen ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                                  {user.isFrozen ? t(trans.profileAdmin.frozen) : t(trans.profileAdmin.active)}
                                </span>
                              </td>
                              <td className="py-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openFreezeConfirmModal(user.id, !user.isFrozen, userRoleDrafts[user.id] ?? user.roles.join(","))}
                                  >
                                    {user.isFrozen ? <Unlock className="h-4 w-4 mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
                                    {user.isFrozen ? t(trans.profileAdmin.unfreeze) : t(trans.profileAdmin.freeze)}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openEditUserRolesModal(user.id, userRoleDrafts[user.id] ?? user.roles.join(","), user.isFrozen)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    {t(trans.profileAdmin.editRoles)}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {rbacInnerTab === "roles" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.profileAdmin.roleManagement)}</h3>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setRbacModal("create-role")}>{t(trans.profileAdmin.createRole)}</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500">
                            <th className="py-2">{t(trans.profileAdmin.role)}</th>
                            <th className="py-2">{t(trans.profileAdmin.users)}</th>
                            <th className="py-2">{t(trans.profileAdmin.permissions)}</th>
                            <th className="py-2">{t(trans.profileAdmin.apiPermissions)}</th>
                            <th className="py-2">{t(trans.profileAdmin.actions)}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {rbacRoles.map((role) => (
                            <tr key={role.id}>
                              <td className="py-2">
                                <div className="font-medium text-slate-800 dark:text-slate-200">{role.name}</div>
                                <div className="text-xs text-slate-500">{role.description || "-"}</div>
                              </td>
                              <td className="py-2">{role.userCount}</td>
                              <td className="py-2">{role.permissionCount}</td>
                              <td className="py-2">{role.apiPermissionCount}</td>
                              <td className="py-2">
                                <Button size="sm" variant="outline" onClick={() => handleDeleteRole(role.id, role.isSystem)} disabled={role.isSystem} className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950/20">{t(trans.profileAdmin.delete)}</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {rbacInnerTab === "permissions" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.profileAdmin.permissionGranularitySettings)}</h3>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setRbacModal("role-permissions")}>{t(trans.profileAdmin.configurePermissions)}</Button>
                    </div>
                  </div>
                )}

                {rbacInnerTab === "api-permissions" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.profileAdmin.apiPermissionControlHeading)}</h3>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setRbacModal("role-api-permissions")}>{t(trans.profileAdmin.configureApiPermissions)}</Button>
                    </div>
                  </div>
                )}

                {rbacInnerTab === "source-scopes" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.profileAdmin.restrictAdminDataSourcesTitle)}</h3>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setRbacModal("source-scopes")}>{t(trans.profileAdmin.configureScopes)}</Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t(trans.profileAdmin.configuredScopes)} {rbacSourceScopes.length}</p>
                  </div>
                )}

                {rbacInnerTab === "activity-logs" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      {t(trans.profileAdmin.userActivityLogs)}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500">
                            <th className="py-2">{t(trans.profileAdmin.time)}</th>
                            <th className="py-2">{t(trans.profileAdmin.actor)}</th>
                            <th className="py-2">{t(trans.profileAdmin.action)}</th>
                            <th className="py-2">{t(trans.profileAdmin.target)}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {rbacActivityLogs.slice(0, 50).map((log) => (
                            <tr key={log.id}>
                              <td className="py-2">{new Date(log.createdAt).toLocaleString()}</td>
                              <td className="py-2">{log.actorEmail || t(trans.profileAdmin.system)}</td>
                              <td className="py-2">{log.action}</td>
                              <td className="py-2">{log.targetType}:{log.targetId || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Data Sources Tab (Admin only) */}
            {isAdminUser && activeTab === "data-sources" && (
              <div className="max-w-6xl space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t(trans.profileAdmin.dataSourceManagementCenter)}</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t(trans.profileAdmin.dataSourceCenterSubtitle)}
                  </p>
                </div>

                {dataSourceMessage && (
                  <div
                    className={`p-4 rounded-lg border text-sm font-medium ${
                      dataSourceMessage.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400"
                        : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400"
                    }`}
                  >
                    {dataSourceMessage.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.profileAdmin.configuredDataSources)}</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={fetchDataSources} disabled={dataSourcesLoading}>
                        {t(trans.profileAdmin.refresh)}
                      </Button>
                      <Button onClick={handleCreateDataSource} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <Plus className="h-4 w-4 mr-1" />
                        {t(trans.profileAdmin.addDataSource)}
                      </Button>
                    </div>
                  </div>

                  {dataSourcesLoading ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">{t(trans.profileAdmin.loading)}</div>
                  ) : dataSources.length === 0 ? (
                    <div className="p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                      {t('No data sources yet. Click "Add Data Source" to create one.', '暂无数据源，请点击“添加数据源”创建。')}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dataSources.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900/40">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{item.name}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {t(trans.profileAdmin.type)} {item.sourceType.toUpperCase()} | {t(trans.profileAdmin.category)} {item.category} | {t(trans.profileAdmin.frequency)} {item.frequencyMode}
                                {item.frequencyValue ? ` (${item.frequencyValue})` : ""}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-all">{item.endpoint}</p>
                            </div>
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                item.isEnabled
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {item.isEnabled ? t(trans.profileAdmin.enabled) : t(trans.profileAdmin.disabled)}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 mt-4 text-xs text-slate-600 dark:text-slate-400">
                            <div>{t(trans.profileAdmin.lastSuccessfulFetch)} {item.lastSuccessAt ? new Date(item.lastSuccessAt).toLocaleString() : t(trans.profileAdmin.notAvailable)}</div>
                            <div>{t(trans.profileAdmin.lastSuccessfulDedupeTimestamp)} {item.lastSuccessDedupeTs ? new Date(item.lastSuccessDedupeTs).toLocaleString() : t(trans.profileAdmin.notAvailable)}</div>
                            <div>{t(trans.profileAdmin.averageProcessingTime)} {item.avgProcessingMs ? `${item.avgProcessingMs} ms` : t(trans.profileAdmin.notAvailable)}</div>
                            <div>{t(trans.profileAdmin.anomalyAlert)} {item.anomalyAlertEnabled ? `${t(trans.profileAdmin.anomalyOnWithThreshold)} ${item.anomalyThresholdPct}${t(trans.profileAdmin.percentSuffix)}` : t(trans.profileAdmin.off)}</div>
                            <div className="md:col-span-2">
                              {t(trans.profileAdmin.recentErrorLog)} {item.lastErrorLog ? item.lastErrorLog : t(trans.profileAdmin.notAvailable)}
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => handleEditDataSource(item)}>
                              <Pencil className="h-4 w-4 mr-1" />
                              {t(trans.profileAdmin.edit)}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDataSource(item.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {t(trans.profileAdmin.delete)}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
      </div>
      {dataSourceModal}
      {rbacModalNode}
    </>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    }>
      <UserProfileContent />
    </Suspense>
  );
}
