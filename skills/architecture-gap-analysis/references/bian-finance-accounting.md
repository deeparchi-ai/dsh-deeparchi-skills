# BIAN Finance & Accounting 域参考

> v13.0 Service Landscape 中 Finance & Accounting Business Area 的 Service Domain 清单、BOM 链接和流程工具入口。

## Service Domain 清单（21 个）

| Service Domain | 核心职能 |
|:--|:--|
| Financial Accounting | 接收财务事实 → 创建会计分录 → 更新总账/子账 |
| Accounts Receivable | 应收账款管理 |
| Account Reconciliation | 账户对账 |
| Internal Audit | 内部审计 |
| Financial Statement Assessment | 财务报表评估 |
| Corporate Finance | 企业融资 |
| Corporate Treasury | 企业资金管理 |
| Asset & Liability Management | 资产负债管理（ALM） |
| Cash Management & Account Services | 现金管理与账户服务 |
| Cash Concentration | 现金归集 |
| Central Cash Handling | 集中现金处理 |
| Position Keeping | 头寸记账 |
| Position Management | 头寸管理 |
| Internal Bank Account | 内部银行账户 |
| Open Item Management | 未清项目管理 |
| Commissions | 佣金管理 |
| Commission Agreement | 佣金协议 |
| Disbursement | 付款/支付 |
| Financial Gateway | 金融网关 |
| Financial Instrument Reference Data Mgmt | 金融工具参考数据管理 |
| Financial Instrument Valuation | 金融工具估值 |

## BOM 直达链接（v13.0 GitHub Raw YAML）

所有 YAML 在 `https://github.com/bian-official/public/tree/main/release13.0.0/semantic-apis/oas3/yamls`

### 核心财务
- Financial Accounting: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/FinancialAccounting.yaml`
- Accounts Receivable: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/AccountsReceivable.yaml`
- Account Reconciliation: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/AccountReconciliation.yaml`
- Financial Statement Assessment: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/FinancialStatementAssessment.yaml`
- Internal Audit: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/InternalAudit.yaml`
- Asset & Liability Management: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/AssetAndLiabilityManagement.yaml`

### 头寸与现金
- Position Keeping: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/PositionKeeping.yaml`
- Position Management: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/PositionManagement.yaml`
- Cash Management & Account Services: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/CashManagementAndAccountServices.yaml`
- Cash Concentration: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/CashConcentration.yaml`

### 企业金融
- Corporate Finance: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/CorporateFinance.yaml`
- Corporate Treasury: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/CorporateTreasury.yaml`
- Financial Instrument Valuation: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/FinancialInstrumentValuation.yaml`
- Commissions: `https://raw.githubusercontent.com/bian-official/public/main/release13.0.0/semantic-apis/oas3/yamls/Commissions.yaml`

## YAML 结构说明

以 FinancialAccounting.yaml 为例：
- **CRUD 端点**: Initiate / Update / Control / Retrieve
- **子实体**: LedgerPosting（Update / Capture）
- **Schema 对齐**: ISO20022 数据字典（CurrencyCode ISO-4217, AmountType 枚举等）
- **BIAN Action Pattern**: CR（Control Record）、BQ（Business Query）

## 流程原型 — Business Scenario Designer

- Portal 首页（免费注册）: `https://portal.bian.org/`
- 功能说明: `https://bian.org/bian-portal/`
- 登录后按 Business Area 筛选 "Finance & Accounting"，拖拽组装 Service Domain 交互链

## 版本

| 版本 | 发布时间 | GitHub 路径 |
|:--|:--|:--|
| v13.0 | 当前稳定版 | `release13.0.0/semantic-apis/oas3/yamls/` |
| v14.0 | 2026年3月（AI-Ready） | `release14.0.0/semantic-apis/oas3/`（路径结构有调整） |
