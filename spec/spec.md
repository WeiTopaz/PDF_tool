# Feature Specification: PDF Tool Specification

**Feature Branch**: `001-pdf-tool-spec`  
**Created**: 2025年12月17日  
**Status**: Draft  
**Input**: User description: "Follow instructions in [speckit.specify.prompt.md](file:///Users/huangwei/Project/pdf_tool/.github/prompts/speckit.specify.prompt.md).
# PDF Tool 規格（Spec）

## 0. 文件資訊
- 專案類型：純前端、單頁工具（本機端處理 PDF）
- 目標架構：Frontend Monolith + 三層式（UI / Application / Core-Utility）+ 輕量 Clean（以資料夾/模組邊界落實）
- 既有頁籤/頁面：合併、旋轉、分割、圖片化壓縮、結構壓縮、頁面插入、聲明

---

## 1. 背景與問題定義
使用者需要在不安裝桌面軟體、且不將檔案上傳到伺服器的前提下，完成常見 PDF 作業：
1) 合併多個 PDF（可調整順序）
2) 旋轉 PDF（支援頁碼範圍）
3) 分割 PDF（支援範圍分組、每頁一檔、ZIP）
4) 壓縮 PDF：圖片化（可控 DPI/品質/灰階）與結構化（重建頁面/清空 metadata）
5) 頁面插入（必備功能；需具體定義與落地）
6) 聲明（限制、風險、責任）

---

## 2. 目標（Goals）
G1. 全流程本機端運算（browser local），不依賴後端服務  
G2. 7 個頁面功能齊備且 UX 一致：合併、旋轉、分割、圖片化壓縮、結構壓縮、頁面插入、聲明  
G3. 所有功能具備可追蹤 UI log（開始/成功/失敗原因）  
G4. 以三層式 + 輕量 Clean 重整程式碼：UI 與核心邏輯切離、核心邏輯可測試  
G5. 明確揭露限制：圖片化壓縮副作用、特殊 PDF 可能處理失敗等

---

## 3. 非目標（Non-goals）
N1. 不做帳號/登入/雲端同步/伺服器端處理  
N2. 不承諾支援所有 PDF 特殊內容（加密、DRM、3D、影音等），僅需在 UI 明確告知限制  
N3. 不導入微服務、CQRS、EDA、SOA 等分散式架構

---

## 4. 功能需求（Functional Requirements）

### 4.1 合併（Merge）
FR-MERGE-1：接受多個 PDF 檔案輸入（multiple）  
FR-MERGE-2：可調整合併順序（UI 提示上下箭頭重排；行為以列表順序為準）  
FR-MERGE-3：至少 2 檔才能執行，否則顯示警告  
FR-MERGE-4：輸出檔名固定 `merged.pdf`  
FR-MERGE-5：log 顯示每個檔案讀取與加入頁數，最後顯示總頁數

### 4.2 旋轉（Rotate）
FR-ROTATE-1：接受單一 PDF  
FR-ROTATE-2：可選旋轉角度：90/180/270（相對旋轉，疊加到既有角度）  
FR-ROTATE-3：支援頁碼範圍（留空＝全部）  
FR-ROTATE-4：輸出檔名為 `原檔名-rotated.pdf`  
FR-ROTATE-5：log 顯示總頁數與實際旋轉頁數

### 4.3 分割（Split）
FR-SPLIT-1：接受單一 PDF  
FR-SPLIT-2：支援頁碼範圍字串（例：`1-3,5;8-10`），分號 `;` 分組輸出  
FR-SPLIT-3：提供「每頁一檔」選項，啟用後忽略範圍  
FR-SPLIT-4：提供「ZIP 打包下載」選項（預設勾選），多檔輸出建議 ZIP  
FR-SPLIT-5：log 顯示選檔、分割策略、完成/錯誤

### 4.4 圖片化壓縮（Raster Compress）
FR-RASTER-1：接受單一 PDF  
FR-RASTER-2：支援頁碼範圍（空白＝全部）  
FR-RASTER-3：可設定 DPI（數字輸入，支援常用建議值）  
FR-RASTER-4：可設定 JPEG 品質（0.3~1），可選灰階  
FR-RASTER-5：輸出檔名需包含 dpi/品質等參數（便於追溯）  
FR-RASTER-6：UI 必須明示副作用：會失去可選文字/連結/表單等

### 4.5 結構壓縮（Structural Compress）
FR-STRUCT-1：接受單一 PDF  
FR-STRUCT-2：提供「重建頁面（複製每頁到新檔）」選項（預設開啟）  
FR-STRUCT-3：提供「清空 metadata」選項（預設開啟）  
FR-STRUCT-4：輸出檔名需反映 rebuild/nometa 選項  
FR-STRUCT-5：UI 必須明示風險：互動元素（表單/註解/附件）可能在重建時被捨棄；建議先備份

### 4.6 頁面插入（Insert Pages）——必備但需補齊
#### 4.6.1 現況檢視（落差）
- `PDF_tool.html` 的 tab 與 panel 命名不一致（`tab-insert` vs `panel-insertt`），且面板內容看起來複製了分割 UI（range / each / zip / "分割並下載" 文案），因此目前無法視為「已完成的頁面插入」。  
- 本次重構必須把「頁面插入」修正為一致命名、獨立 log、且具備明確插入語意。

#### 4.6.2 功能定義（本 spec 的要求）
FR-INSERT-1：至少需要「目標 PDF」與「來源 PDF」兩個輸入（否則無法定義插入來源）  
FR-INSERT-2：可指定「插入位置」（例如：在第 N 頁之前/之後，或插入到文件開頭/結尾）  
FR-INSERT-3：可指定來源 PDF 的「頁碼範圍」要插入哪些頁（留空＝全部）  
FR-INSERT-4：輸出為單一 PDF（檔名包含 inserted 或含位置資訊）  
FR-INSERT-5：log 顯示：目標/來源檔案、插入位置、插入頁數、完成/錯誤  
FR-INSERT-6：不得破壞既有「全本機端」承諾

> 註：以上為「必要語意」；UI 具體欄位在重構時落地（例如兩個 drop zone、position selector、range input）。

### 4.7 聲明（Disclaim）
FR-DISCLAIM-1：提供聲明區塊，載明：用途、風險、圖片化壓縮副作用、特殊 PDF 限制、責任歸屬、版本與日期  
FR-DISCLAIM-2：聲明內容必須可被使用者在 UI 直接閱讀

---

## 5. 非功能需求（NFR）
NFR-1 隱私：不送出檔案、不記錄內容  
NFR-2 可用性：所有面板互動一致（拖放/選檔 → 設定 → Run → log → 下載）  
NFR-3 可維護性：核心邏輯需可被獨立測試（純函式/最小 DOM 依賴）  
NFR-4 穩健性：錯誤訊息可讀（至少顯示 err.message），不得吞錯

---

## 6. 架構與模組切分（Frontend Monolith + 3 Layers + Lightweight Clean）

### 6.1 分層定義
- UI Layer：DOM、事件綁定、狀態顯示、log render
- Application Layer：用例流程（讀檔→解析設定→呼叫 core→輸出下載）、錯誤統一處理、命名策略組裝
- Core-Utility：PDF 操作與演算法、range parser、zip builder、檔名策略（避免 DOM）

### 6.2 目錄規劃（建議）
/src
  /ui
    merge.ui.ts
    rotate.ui.ts
    split.ui.ts
    raster.ui.ts
    struct.ui.ts
    insert.ui.ts
    tabs.ui.ts
  /app
    merge.usecase.ts
    rotate.usecase.ts
    split.usecase.ts
    raster.usecase.ts
    struct.usecase.ts
    insert.usecase.ts
    download.service.ts
    log.service.ts
  /core
    pdf
      merge.ts
      rotate.ts
      split.ts
      rasterize.ts
      structural.ts
      insert.ts
    parsing
      pageRange.ts
    naming
      outputName.ts
    types
      options.ts
  /lib
    pdfLib.ts
    pdfJs.ts
    jszip.ts
index.html
main.ts

### 6.3 模組邊界規則
- UI 只能呼叫 app（usecase/service），不得直接操作 core
- core 不得 import UI / DOM
- 第三方庫統一由 /lib 封裝
- usecase 負責流程組裝，不做 PDF 內容細節運算

---

## 7. 驗收標準（Acceptance Criteria）
AC-1 合併：少於 2 檔不可執行；合併後輸出 merged.pdf；log 顯示每檔加入頁數與總頁數  
AC-2 旋轉：可選 90/180/270；支援範圍；輸出 -rotated；log 顯示旋轉頁數  
AC-3 分割：支援 `1-3,5;8-10` 分組；支援每頁一檔；ZIP 下載可用  
AC-4 圖片化壓縮：可調 DPI/品質/灰階/範圍；UI 明示副作用；輸出命名包含參數  
AC-5 結構壓縮：rebuild/nometa 可切換；命名反映選項；UI 明示互動元素風險  
AC-6 頁面插入：具備「目標+來源」兩檔輸入、位置、來源範圍；能輸出單一 PDF；log 完整  
AC-7 聲明：內容可讀且包含用途/風險/版本日期等必要資訊"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 合併 PDF (Priority: P1)

作為使用者，我想要將多個 PDF 檔案合併成一個檔案，並能調整合併順序，而無需將檔案上傳到伺服器。

**Why this priority**: 這是 PDF 處理的基本功能，許多使用者需要合併文件。

**Independent Test**: 可以透過上傳多個 PDF、調整順序並下載合併後的單一 PDF 來完整測試。

**Acceptance Scenarios**:

1. **Given** 多個 PDF 檔案，**When** 我選擇它們並點擊合併，**Then** 我得到一個按選擇順序合併的單一 PDF。
2. **Given** 少於 2 個檔案，**When** 我嘗試合併，**Then** 我看到警告且無法繼續。
3. **Given** 合併成功，**When** 檢查 log，**Then** log 顯示每個檔案的頁數和總頁數。

---

### User Story 2 - 旋轉 PDF (Priority: P2)

作為使用者，我想要旋轉 PDF 的頁面，選擇角度和頁碼範圍，而檔案處理在本機端。

**Why this priority**: 旋轉是常見的 PDF 調整功能。

**Independent Test**: 可以上傳 PDF、設定旋轉角度和範圍、下載旋轉後的 PDF 來測試。

**Acceptance Scenarios**:

1. **Given** 一個 PDF，**When** 我選擇 90/180/270 度旋轉特定頁面，**Then** 那些頁面被相對旋轉。
2. **Given** 旋轉完成，**When** 檢查輸出檔名，**Then** 檔名為原檔名加上 -rotated。
3. **Given** 旋轉成功，**When** 檢查 log，**Then** log 顯示總頁數和實際旋轉頁數。

---

### User Story 3 - 分割 PDF (Priority: P2)

作為使用者，我想要將 PDF 分割成多個檔案，支援範圍分組或每頁一檔，並可選擇 ZIP 下載。

**Why this priority**: 分割是重要的 PDF 管理功能。

**Independent Test**: 上傳 PDF、設定分割選項、下載分割結果來測試。

**Acceptance Scenarios**:

1. **Given** 一個 PDF，**When** 我輸入範圍字串如 1-3,5;8-10，**Then** 輸出多個 PDF 按分組。
2. **Given** 我選擇每頁一檔，**When** 執行分割，**Then** 忽略範圍，每頁成為獨立檔案。
3. **Given** 多檔輸出，**When** ZIP 選項開啟，**Then** 下載 ZIP 檔案。

---

### User Story 4 - 圖片化壓縮 PDF (Priority: P3)

作為使用者，我想要壓縮 PDF 透過圖片化，控制 DPI 和品質，並了解副作用。

**Why this priority**: 壓縮有助於減小檔案大小，但有權衡。

**Independent Test**: 上傳 PDF、設定壓縮參數、下載壓縮後 PDF 來測試。

**Acceptance Scenarios**:

1. **Given** 一個 PDF，**When** 我設定 DPI 和 JPEG 品質，**Then** PDF 被重新渲染為圖片。
2. **Given** 壓縮完成，**When** 檢查 UI，**Then** 顯示會失去文字/連結等副作用警告。
3. **Given** 輸出檔名，**When** 檢查，**Then** 包含 DPI 和品質參數。

---

### User Story 5 - 結構壓縮 PDF (Priority: P3)

作為使用者，我想要壓縮 PDF 透過重建頁面和清空 metadata，並了解風險。

**Why this priority**: 結構壓縮提供另一種壓縮方式。

**Independent Test**: 上傳 PDF、選擇重建和清空選項、下載壓縮後 PDF。

**Acceptance Scenarios**:

1. **Given** 一個 PDF，**When** 我選擇重建頁面，**Then** 每頁被複製到新檔案。
2. **Given** 我選擇清空 metadata，**When** 執行，**Then** metadata 被移除。
3. **Given** 壓縮完成，**When** 檢查 UI，**Then** 顯示互動元素可能被捨棄的風險。

---

### User Story 6 - 插入頁面到 PDF (Priority: P2)

作為使用者，我想要將一個 PDF 的頁面插入到另一個 PDF 的指定位置。

**Why this priority**: 插入是進階 PDF 操作。

**Independent Test**: 上傳目標和來源 PDF、指定位置和範圍、下載插入後 PDF。

**Acceptance Scenarios**:

1. **Given** 目標和來源 PDF，**When** 我指定插入位置和來源範圍，**Then** 來源頁面被插入到目標。
2. **Given** 2個 PDF，**When** 我輸入1個數字字串如 1；2；10，**Then** 將從第1個PDF的第該頁開始插入第2個PDF的全部頁面，並輸出1個 PDF 。
3. **Given** 插入完成，**When** 檢查輸出，**Then** 為單一 PDF 檔名包含插入資訊。
4. **Given** 插入成功，**When** 檢查 log，**Then** 顯示檔案、位置、頁數。

---

### User Story 7 - 查看聲明 (Priority: P4)

作為使用者，我想要閱讀工具的聲明，了解用途、風險和限制。

**Why this priority**: 提供透明度和法律保護。

**Independent Test**: 開啟聲明頁面，檢查內容是否可讀。

**Acceptance Scenarios**:

1. **Given** 聲明頁面，**When** 我查看，**Then** 顯示用途、風險、副作用、限制、責任、版本日期。

### Edge Cases

- 當 PDF 檔案很大時，處理時間可能較長。
- 當 PDF 包含特殊內容如加密或 3D 時，可能處理失敗，UI 需告知限制。
- 當使用者輸入無效的頁碼範圍時，顯示錯誤訊息。
- 當瀏覽器記憶體不足時，處理大型 PDF 可能失敗。

## Constitution Alignment *(mandatory)*

*GATE: Must verify compliance with all constitutional principles before finalizing spec.*

- [ ] **產品承諾**: 功能設計確保本機端處理，風險揭露，輸出可追溯。
- [ ] **架構治理**: 遵循三層式架構，層間分離，第三方庫封裝。
- [ ] **功能一致性與落差修正**: 功能頁面一致互動，頁面插入具插入語意，Tabs id 一致。
- [ ] **品質門檻**: 定義測試需求，錯誤處理，資料安全措施。
- [ ] **變更流程**: 本 spec 更新優先於實作。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-MERGE-1**: 系統必須接受多個 PDF 檔案輸入。
- **FR-MERGE-2**: 系統必須允許透過 UI 調整合併順序。
- **FR-MERGE-3**: 系統必須要求至少 2 個檔案才能執行合併。
- **FR-MERGE-4**: 系統必須輸出檔名為 'merged.pdf' 的檔案。
- **FR-MERGE-5**: 系統必須記錄每個檔案的頁數和總頁數。

- **FR-ROTATE-1**: 系統必須接受單一 PDF 輸入。
- **FR-ROTATE-2**: 系統必須允許選擇旋轉角度 90/180/270 度。
- **FR-ROTATE-3**: 系統必須支援頁碼範圍（空白表示全部）。
- **FR-ROTATE-4**: 系統必須輸出檔名為 'original-rotated.pdf' 的檔案。
- **FR-ROTATE-5**: 系統必須記錄總頁數和旋轉頁數。

- **FR-SPLIT-1**: 系統必須接受單一 PDF 輸入。
- **FR-SPLIT-2**: 系統必須支援範圍字串如 '1-3,5;8-10' 用於分組輸出。
- **FR-SPLIT-3**: 系統必須提供「每頁一檔」選項。
- **FR-SPLIT-4**: 系統必須提供 ZIP 下載選項（預設勾選）。
- **FR-SPLIT-5**: 系統必須記錄選擇、分割策略、完成/錯誤。

- **FR-RASTER-1**: 系統必須接受單一 PDF 輸入。
- **FR-RASTER-2**: 系統必須支援頁碼範圍（空白表示全部）。
- **FR-RASTER-3**: 系統必須允許設定 DPI。
- **FR-RASTER-4**: 系統必須允許設定 JPEG 品質 (0.3-1) 和灰階選項。
- **FR-RASTER-5**: 系統必須在輸出檔名中包含 dpi/品質。
- **FR-RASTER-6**: 系統必須在 UI 中顯示副作用警告。

- **FR-STRUCT-1**: 系統必須接受單一 PDF 輸入。
- **FR-STRUCT-2**: 系統必須提供「重建頁面」選項（預設開啟）。
- **FR-STRUCT-3**: 系統必須提供「清空 metadata」選項（預設開啟）。
- **FR-STRUCT-4**: 系統必須在輸出檔名中反映 rebuild/nometa。
- **FR-STRUCT-5**: 系統必須顯示互動元素的風險警告。

- **FR-INSERT-1**: 系統必須要求目標和來源 PDF 輸入。
- **FR-INSERT-2**: 系統必須允許指定插入位置。
- **FR-INSERT-3**: 系統必須允許指定來源頁碼範圍。
- **FR-INSERT-4**: 系統必須輸出單一 PDF，檔名包含插入資訊。
- **FR-INSERT-5**: 系統必須記錄目標/來源檔案、位置、頁數、完成/錯誤。
- **FR-INSERT-6**: 系統必須維持本機端處理承諾。

- **FR-DISCLAIM-1**: 系統必須提供聲明區塊，包含用途、風險、副作用、限制、責任、版本/日期。
- **FR-DISCLAIM-2**: 系統必須使聲明內容可在 UI 中閱讀。

### Non-Functional Requirements

- **NFR-1**: 隱私：不送出檔案、不記錄內容。
- **NFR-2**: 可用性：所有面板互動一致（拖放/選檔 → 設定 → 執行 → log → 下載）。
- **NFR-3**: 可維護性：核心邏輯可獨立測試（純函式、最小 DOM 依賴）。
- **NFR-4**: 穩健性：可讀錯誤訊息（至少顯示 err.message），不得吞錯。

### Key Entities

- **PDF File**: 代表 PDF 文件，具有頁面和 metadata。
- **Page Range**: 指定要處理的頁面，支援逗號和分號語法。
- **Compression Options**: DPI、品質、灰階、重建、metadata 清除的設定。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-1**: 使用者可以合併 PDF 並調整順序，輸出 merged.pdf，log 顯示頁數。
- **SC-2**: 使用者可以旋轉 PDF 頁面 90/180/270 度並支援範圍，輸出 -rotated，log 顯示旋轉頁數。
- **SC-3**: 使用者可以分割 PDF 支援範圍分組或每頁一檔，並 ZIP 下載，log 顯示策略。
- **SC-4**: 使用者可以圖片化壓縮 PDF 控制 DPI/品質，UI 警告副作用，檔名包含參數。
- **SC-5**: 使用者可以結構壓縮 PDF 選擇重建/metadata 選項，UI 警告風險，檔名反映選項。
- **SC-6**: 使用者可以將來源 PDF 頁面插入目標 PDF 指定位置/範圍，輸出單一 PDF，log 完整。
- **SC-7**: 使用者可以閱讀聲明，了解用途/風險/限制/責任/版本。

## Architecture and Module Division

### Layer Definition
- UI Layer：DOM、事件綁定、狀態顯示、log render
- Application Layer：用例流程（讀檔→解析設定→呼叫 core→輸出下載）、錯誤統一處理、命名策略組裝
- Core-Utility：PDF 操作與演算法、range parser、zip builder、檔名策略（避免 DOM）

### Directory Planning
/src
  /ui
    merge.ui.ts
    rotate.ui.ts
    split.ui.ts
    raster.ui.ts
    struct.ui.ts
    insert.ui.ts
    tabs.ui.ts
  /app
    merge.usecase.ts
    rotate.usecase.ts
    split.usecase.ts
    raster.usecase.ts
    struct.usecase.ts
    insert.usecase.ts
    download.service.ts
    log.service.ts
  /core
    pdf
      merge.ts
      rotate.ts
      split.ts
      rasterize.ts
      structural.ts
      insert.ts
    parsing
      pageRange.ts
    naming
      outputName.ts
    types
      options.ts
  /lib
    pdfLib.ts
    pdfJs.ts
    jszip.ts
index.html
main.ts

### Module Boundary Rules
- UI 只能呼叫 app（usecase/service），不得直接操作 core
- core 不得 import UI / DOM
- 第三方庫統一由 /lib 封裝
- usecase 負責流程組裝，不做 PDF 內容細節運算
