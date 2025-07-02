export const MENU_STRUCTURE = {
  dashboard: {
    id: 'dashboard',
    name: '首頁',
    icon: 'fas fa-tachometer-alt',
    path: '/',
  },
  scheduling: {
    id: 'scheduling',
    name: '排程管理',
    icon: 'fas fa-calendar-alt',
    children: {
      schedulingEntry: {
        id: 'scheduling-entry',
        name: '排期進單管理',
        icon: 'fas fa-file-alt',
        children: {
          schedulingCreate: { id: 'scheduling-create', name: '排期單建立', path: '/scheduling/create' },
          schedulingDetails: { id: 'scheduling-details', name: '排期單明細', path: '/scheduling/details' },
          schedulingApproval: { id: 'scheduling-approval', name: '排期單審核流程', path: '/scheduling/approval' },
        },
      },
      dailyProgram: {
        id: 'daily-program',
        name: '每日節目排程',
        icon: 'fas fa-tv',
        children: {
          programCreation: { id: 'program-creation', name: '節目表建立', path: '/daily-program/creation' },
          programAdjustment: { id: 'program-adjustment', name: '節目線異動', path: '/daily-program/adjustment' },
          programMaster: { id: 'program-master', name: '節目主檔管理', path: '/daily-program/master' },
          programDetail: { id: 'program-detail', name: '節目明細檔管理', path: '/daily-program/detail' },
          broadcastMonth: { id: 'broadcast-month', name: '播映月份檔管理', path: '/daily-program/broadcast-month' },
          postponement: { id: 'postponement', name: '延期管理', path: '/daily-program/postponement' },
        },
      },
      adSlot: {
        id: 'ad-slot',
        name: '廣告時段管理',
        icon: 'fas fa-clock',
        children: {
          channelSeconds: { id: 'channel-seconds', name: '頻道可排播秒數設定', path: '/ad-slot/channel-seconds' },
          channelMaster: { id: 'channel-master', name: '頻道基本資料管理', path: '/ad-slot/channel-master' },
        },
      },
      logArrangement: {
        id: 'log-arrangement',
        name: 'LOG 編排作業',
        icon: 'fas fa-list-alt',
        children: {
          programLineArrangement: { id: 'program-line-arrangement', name: '節目線編排', path: '/log-arrangement/program-line' },
          breakArrangement: { id: 'break-arrangement', name: '破口編排', path: '/log-arrangement/break' },
          adPlacement: { id: 'ad-placement', name: '廣告位置編排', path: '/log-arrangement/ad-placement' },
          idCardArrangement: { id: 'id-card-arrangement', name: 'ID 卡編排', path: '/log-arrangement/id-card' },
          promoArrangement: { id: 'promo-arrangement', name: 'Promo 編排', path: '/log-arrangement/promo' },
          placementRules: { id: 'placement-rules', name: '置入規則編排', path: '/log-arrangement/placement-rules' },
          sandwichRules: { id: 'sandwich-rules', name: '三明治規則編排', path: '/log-arrangement/sandwich-rules' },
          logConversion: { id: 'log-conversion', name: 'LOG 轉檔作業', path: '/log-arrangement/conversion' },
        },
      },
      broadcastLog: {
        id: 'broadcast-log',
        name: '託播檔管理',
        icon: 'fas fa-file-export',
        children: {
          scheduleToBroadcast: { id: 'schedule-to-broadcast', name: '排期單轉託播單', path: '/broadcast-log/schedule-to-broadcast' },
          broadcastGeneration: { id: 'broadcast-generation', name: '託播單產生', path: '/broadcast-log/generation' },
          emailDispatch: { id: 'email-dispatch', name: '郵件發送', path: '/broadcast-log/email-dispatch' },
        },
      },
      broadcastResult: { id: 'broadcast-result', name: '播出結果查詢', icon: 'fas fa-search', path: '/broadcast-result' },
    },
  },
  sales: {
    id: 'sales',
    name: '銷售與業務管理',
    icon: 'fas fa-handshake',
    children: {
      salesMethod: {
        id: 'sales-method',
        name: '銷售辦法管理',
        icon: 'fas fa-calculator',
        children: {
          programPackages: { id: 'program-packages', name: '節目組合', path: '/sales/program-packages' },
          pricingStrategies: { id: 'pricing-strategies', name: '價格策略', path: '/sales/pricing-strategies' },
          broadcastRules: { id: 'broadcast-rules', name: '刊播規則', path: '/sales/broadcast-rules' },
          nielsenStandards: { id: 'nielsen-standards', name: '尼爾森標準', path: '/sales/nielsen-standards' },
        },
      },
      broadcastOrder: {
        id: 'broadcast-order',
        name: '託播單管理',
        icon: 'fas fa-clipboard-list',
        children: {
          broadcastOrderList: { id: 'broadcast-order-list', name: '託播單列表', path: '/sales/broadcast-order-list' },
          broadcastOrderEdit: { id: 'broadcast-order-edit', name: '託播單新增／編輯', path: '/sales/broadcast-order-edit' },
        },
      },
      customerStatistics: { id: 'customer-statistics', name: '客戶統計報表', icon: 'fas fa-chart-pie', path: '/sales/customer-statistics' },
    },
  },
  tvAd: {
    id: 'tv-ad',
    name: '電視廣告管理',
    icon: 'fas fa-video',
    children: {
      adMaterial: {
        id: 'ad-material',
        name: '廣告素材管理',
        icon: 'fas fa-film',
        children: {
          materialMaster: { id: 'material-master', name: '材料主檔', path: '/tv-ad/material-master' },
          projectMaterials: { id: 'project-materials', name: '專案材料', path: '/tv-ad/project-materials' },
          mtvPromos: { id: 'mtv-promos', name: 'MTV 宣傳帶', path: '/tv-ad/mtv-promos' },
          agbCategory: { id: 'agb-category', name: 'AGB 主/子分類檔管理', path: '/tv-ad/agb-category' },
        },
      },
      materialExtension: { id: 'material-extension', name: '材料延申申請', icon: 'fas fa-plus-circle', path: '/tv-ad/material-extension' },
      ingestProcess: { id: 'ingest-process', name: '進帶流程管理', icon: 'fas fa-upload', path: '/tv-ad/ingest-process' },
      redBookUpdate: { id: 'red-book-update', name: '紅本資料自動更新', icon: 'fas fa-sync', path: '/tv-ad/red-book-update' },
      adReports: { id: 'ad-reports', name: '廣告相關報表', icon: 'fas fa-chart-bar', path: '/tv-ad/reports' },
    },
  },
  reports: {
    id: 'reports',
    name: '報表與下載',
    icon: 'fas fa-chart-bar',
    children: {
      adScheduleReport: { id: 'ad-schedule-report', name: '廣告排程報表', icon: 'fas fa-calendar-check', path: '/reports/ad-schedule' },
      broadcastResultReport: { id: 'broadcast-result-report', name: '播出結果報表', icon: 'fas fa-tv', path: '/reports/broadcast-result' },
      customerReport: { id: 'customer-report', name: '客戶統計報表', icon: 'fas fa-users', path: '/reports/customer' },
      systemDataReport: { id: 'system-data-report', name: '系統基礎資料報表', icon: 'fas fa-database', path: '/reports/system-data' },
    },
  },
  masterData: {
    id: 'master-data',
    name: '基礎資料管理',
    icon: 'fas fa-database',
    children: {
      companyData: { id: 'company-data', name: '公司資料管理', icon: 'fas fa-building', path: '/master-data/company' },
      departmentData: { id: 'department-data', name: '部門資料管理', icon: 'fas fa-sitemap', path: '/master-data/department' },
      employeeData: { id: 'employee-data', name: '員工資料管理', icon: 'fas fa-users', path: '/master-data/employee' },
      customerData: { id: 'customer-data', name: '客戶資料管理', icon: 'fas fa-user-tie', path: '/master-data/customer' },
      customerGroup: { id: 'customer-group', name: '客戶集團管理', icon: 'fas fa-users-cog', path: '/master-data/customer-group' },
      agentGroup: { id: 'agent-group', name: '代理商群組管理', icon: 'fas fa-handshake', path: '/master-data/agent-group' },
      vendorData: { id: 'vendor-data', name: '廠商資料管理', icon: 'fas fa-truck', path: '/master-data/vendor' },
      systemSettings: { id: 'system-settings', name: '區域、國別、銀行等設定', icon: 'fas fa-globe', path: '/master-data/system-settings' },
      targetAudience: { id: 'target-audience', name: '目標受眾資料', icon: 'fas fa-bullseye', path: '/master-data/target-audience' },
      serialNumber: { id: 'serial-number', name: '使用單號碼設定', icon: 'fas fa-hashtag', path: '/master-data/serial-number' },
      contactData: { id: 'contact-data', name: '聯絡人資料管理', icon: 'fas fa-address-book', path: '/master-data/contact' },
      materialClassification: { id: 'material-classification', name: '廣告材料分類規則', icon: 'fas fa-tags', path: '/master-data/material-classification' },
      programType: { id: 'program-type', name: '節目類型設定', icon: 'fas fa-tv', path: '/master-data/program-type' },
      adType: { id: 'ad-type', name: '廣告類型設定', icon: 'fas fa-ad', path: '/master-data/ad-type' },
    },
  },
  account: {
    id: 'account',
    name: '帳號與權限管理',
    icon: 'fas fa-users',
    children: {
      accountList: { id: 'account-list', name: '帳號列表', icon: 'fas fa-list', path: '/account/list' },
      rolePermission: { id: 'role-permission', name: '角色與權限設定', icon: 'fas fa-user-shield', path: '/account/role-permission' },
    },
  },
  system: {
    id: 'system',
    name: '系統設定',
    icon: 'fas fa-cog',
    children: {
      systemParameters: { id: 'system-parameters', name: '系統參數設定', icon: 'fas fa-sliders-h', path: '/system/parameters' },
    },
  },
};

export const MATERIAL_TYPES = {
  C: { name: '商業廣告', color: 'bg-green-500' },
  I: { name: 'ID卡', color: 'bg-yellow-500' },
  G: { name: '公益廣告', color: 'bg-orange-500' },
  '9': { name: 'Promo', color: 'bg-purple-500' },
};

export const TIME_SLOTS = [
  '05', '06', '07', '08', '09', '10', '11', '12',
  '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '01', '02', '03', '04'
];

export const SPOT_TYPES = [
  { value: 'first', label: '首' },
  { value: 'first2', label: '首2' },
  { value: 'last2', label: '尾2' },
  { value: 'last', label: '尾' },
];

export const TARGET_AUDIENCES = [
  { value: 'F15-49', label: '女性 15-49' },
  { value: 'M25-54', label: '男性 25-54' },
  { value: 'ALL15+', label: '全體 15+' },
  { value: 'F25-54', label: '女性 25-54' },
  { value: 'M15-49', label: '男性 15-49' },
];
