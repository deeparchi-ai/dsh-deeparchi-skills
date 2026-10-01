# BIAN v13.0 Business Area 速查表

## 核心 Business Area 清单

| BIAN Business Area | 说明 | 常见 WNS 误归属 |
|:--|:--|:--|
| Business Direction | 战略方向、企业架构、绩效管理 | 经营管理 / 业务支撑 |
| Party Reference Data | 参与方数据：客户、机构、合作方 | 客户与市场营销管理 |
| Sales | 销售与营销管理 | 客户与市场营销管理 |
| Product Directory | 产品定义、规格、目录 | 产品管理（正确） |
| Agreement | 协议与合同 | 未独立 |
| Customer Behavior | 客户行为洞察 | 未独立 |
| Channel | 渠道管理 | 客户与市场营销管理 |
| Cross Channel | 跨渠道协同 | 客户与市场营销管理 |
| Operations | 通用运营处理 | 运营管理（正确，但需精简） |
| Position | 账户头寸与余额（含存款） | 🔴 误归入"产品管理" |
| Lending | 信贷全生命周期（产品+流程） | 🔴 误归入"产品管理" |
| Payments | 支付、清算、结算 | 🔴 误归入"产品管理" |
| Card Products | 银行卡 | 🔴 误归入"产品管理" |
| Corporate Banking Products | 对公产品（现金管理、托管） | 🔴 误归入"产品管理" |
| Trade Finance | 贸易融资 | 🔴 误归入"产品管理" |
| Wealth | 财富管理 | 🔴 误归入"产品管理" |
| Market Operations | 金融市场操作（交易、证券化） | 🔴 误归入"产品管理" |
| Corporate Finance | 公司金融（财资管理） | 🔴 误归入"产品管理" |
| Asset & Liability Management | 资产负债管理 | 风险管理 / 经营管理 |
| Risk & Compliance | 风险与合规（含内控、反洗钱） | 风险管理 + 内控合规 |
| Finance & Accounting | 财务会计 | 经营管理 |
| Human Resources | 人力资源 | 业务支撑 |
| Procurement & Administration | 采购与行政 | 经营管理 |
| IT & Architecture | IT 与架构管理 | ❌ 完全缺失 |

## 最常见的误归类模式

1. **"产品管理"黑洞**：存款、贷款、支付、信用卡、贸易融资、金融市场、财富管理全部塞入"产品管理"
2. **运营大杂烩**：清算、账户、柜面归运营，实际分属 Payments / Position / Channel
3. **IT 域真空**：科技管理不被视为业务域
4. **ALM 无处安放**：流动性风险和利率风险从 Risk 中独立出来
